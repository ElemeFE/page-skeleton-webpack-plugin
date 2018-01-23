'use strict'

const fs = require('fs')
const http = require('http')
const path = require('path')
const EventEmitter = require('events')
const { promisify } = require('util')
const sockjs = require('sockjs')
const hasha = require('hasha')
const express = require('express')
const open = require('opn')
const MemoryFileSystem = require('memory-fs')
const {
  writeShell,
  log,
  sockWrite,
  generateQR,
  addDprAndFontSize,
  getLocalIpAddress
} = require('./util/utils')
const Skeleton = require('./skeleton')

const myFs = new MemoryFileSystem()

class Server extends EventEmitter {
  constructor(options) {
    super()
    Object.keys(options).forEach(k => Object.assign(this, { [k]: options[k] }))
    this.options = options
    this.host = getLocalIpAddress()
    // 用于缓存写入 shell.html 文件的 html
    this.cacheHtml = ''
    // 用于缓存 生成 skeleton page 的页面
    this.url = ''
    // 骨架页面地址
    this.skeletonPageUrl = ''
    // 预览页面地址
    this.previewPageUrl = `http://${this.host}:${options.port}/preview.html`
    this.sockets = []
    this.previewSocket = null
    this.skeleton = null
  }
  _getSkeleton() {
    this.skeleton = this.skeleton || new Skeleton(this.options)
    return this.skeleton
  }
  async initRouters() {
    const { app, staticPath } = this
    app.use('/', express.static(path.resolve(__dirname, '../preview/dist')))

    const staticFiles = await promisify(fs.readdir)(path.resolve(__dirname, '../client'))

    staticFiles
      .filter(file => /\.bundle/.test(file))
      .forEach((file) => {
        app.get(`/${staticPath}/${file}`, (req, res) => {
          res.setHeader('Content-Type', 'application/javascript')
          fs.createReadStream(path.join(__dirname, '..', 'client', file)).pipe(res)
        })
      })

    app.get('/preview.html', async (req, res) => {
      fs.createReadStream(path.resolve(__dirname, '..', 'preview/dist/index.html')).pipe(res)
    })

    app.get('/:filename', async (req, res) => {
      const { filename } = req.params
      if (!/\.html$/.test(filename)) return false
      let html = await promisify(fs.readFile)(path.resolve(__dirname, 'templates/notFound.html'), 'utf-8')
      try {
        // if I use `promisify(myFs.readFile)` if will occur an error
        // `TypeError: this[(fn + "Sync")] is not a function`,
        // So `readFile` need to hard bind `myFs`, maybe it's an issue of `memory-fs`
        html = await promisify(myFs.readFile.bind(myFs))(path.resolve(__dirname, `${staticPath}/${filename}`), 'utf-8')
      } catch (err) {
        log(`When you request the preview html, ${err} ${filename}`, 'error')
      }
      res.send(html)
    })
  }
  initSocket() {
    const { listenServer } = this
    const sockjsServer = sockjs.createServer({
      sockjs_url: `/${this.staticPath}/sockjs.bundle.js`,
      log(severity, line) {
        if (severity === 'error') {
          log(line, 'error')
        }
      }
    })
    this.sockjsServer = sockjsServer
    sockjsServer.installHandlers(listenServer, { prefix: '/socket' })
    sockjsServer.on('connection', (conn) => {
      if (this.sockets.indexOf(conn) === -1) {
        this.sockets.push(conn)
        log(`client socket: ${conn.id} connect to server`)
      }

      conn.on('data', this.resiveSocketData(conn))

      conn.on('close', () => {
        const index = this.sockets.indexOf(conn)
        if (index > -1) this.sockets.splice(index, 1)
        if (this.previewSocket === conn) {
          this.previewSocket = null
          log('preview closed')
        }
      })
    })
  }
  // 启动服务
  async listen() {
    /* eslint-disable no-multi-assign */
    const app = this.app = express()
    const listenServer = this.listenServer = http.createServer(app)
    /* eslint-enable no-multi-assign */
    this.initRouters()
    this.initSocket()
    listenServer.listen(this.port, () => {
      log(`page-skeleton server listen at port: ${this.port}`)
    })
  }
  // 关闭服务
  close() {
    // TODO...
    if (this.skeleton) this.skeleton.closeBrowser()
    process.exit()
    this.listenServer.close(() => {
      log('server closed')
    })
  }
  /**
   * 处理 data socket 消息
   */
  resiveSocketData(conn) {
    return async (data) => {
      const msg = JSON.parse(data)
      switch (msg.type) {
        case 'generate': {
          if (!msg.data) return log(msg)
          const url = msg.data
          this.url = url
          const preGenMsg = 'begin to generator HTML...'
          log(preGenMsg)
          sockWrite(this.sockets, 'console', preGenMsg)
          try {
            const { html, shellHtml } = await this._getSkeleton().genHtml(url)
            // CACHE SHELLHTML
            this.cacheHtml = shellHtml
            const fileName = await this.writeMagicHtml(html)
            const afterGenMsg = 'generator HTML successfully...'
            log(afterGenMsg)
            sockWrite(this.sockets, 'console', afterGenMsg)
            this.skeletonPageUrl = `http://${this.host}:${this.port}/${fileName}`
            const openMsg = 'Browser open another page...'
            sockWrite([conn], 'console', openMsg)
            sockWrite([conn], 'success', openMsg)
            if (this.previewSocket) {
              const data = await this.getPreviewData()
              sockWrite([this.previewSocket], 'url', JSON.stringify(data))
            } else {
              open(this.previewPageUrl, { app: 'google chrome' })
            }
          } catch (err) {
            const message = err.message || 'generate html failed.'
            log(err)
            sockWrite(this.sockets, 'error', message)
          }
          break
        }

        case 'connect': {
          if (msg.data === 'preview') {
            this.previewSocket = conn
            log('preview page connected')
          }
          break
        }

        case 'url': {
          if (msg.data !== 'preview') return log(msg)
          const data = await this.getPreviewData()
          sockWrite([conn], 'url', JSON.stringify(data))
          break
        }

        case 'writeShellFile': {
          sockWrite([conn], 'console', 'before write shell files...')
          const { pathname, cacheHtml, options } = this
          await writeShell(pathname, cacheHtml, options)
          const afterWriteMsg = 'Write files successfully...'
          log(afterWriteMsg)
          sockWrite([conn], 'console', afterWriteMsg)
          break
        }
        default: break
      }
    }
  }
  async getPreviewData () {
    const { skeletonPageUrl, url } = this
    const qrCode = await generateQR(skeletonPageUrl)
    return {
      skeletonPageUrl,
      url,
      qrCode
    }
  }
  /**
   * 将 sleleton 模块生成的 html 写入到内存中。
   */
  async writeMagicHtml(html) {
    const decHtml = addDprAndFontSize(html)
    try {
      const { staticPath } = this
      const pathName = path.join(__dirname, staticPath)
      let fileName = await hasha(decHtml, { algorithm: 'md5' })
      fileName += '.html'
      myFs.mkdirpSync(pathName)
      await promisify(myFs.writeFile.bind(myFs))(path.join(pathName, fileName), decHtml, 'utf8')
      return fileName
    } catch (err) {
      log(err, 'error')
    }
  }
}

module.exports = Server
