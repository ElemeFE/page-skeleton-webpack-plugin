'use strict'

const fs = require('fs')
const http = require('http')
const path = require('path')
const EventEmitter = require('events')
const sockjs = require('sockjs')
const hasha = require('hasha')
const express = require('express')
const open = require('opn')
const MemoryFileSystem = require('memory-fs')
const imagemin = require('imagemin')
const imageminPngquant = require('imagemin-pngquant')
const {
  writeShell,
  insertScreenShotTpl,
  log,
  sockWrite,
  promisify,
  addScriptTag
} = require('./util/utils')
const Skeleton = require('./skeleton')

const myFs = new MemoryFileSystem()

class Server extends EventEmitter {
  constructor(options) {
    super()
    Object.keys(options).forEach(k => Object.assign(this, { [k]: options[k] }))
    this.options = options
    // 用于缓存写入 shell.vue 文件的 html
    this.cacheHtml = ''
    this.previewUrl = ''
    const { port } = options
    this.directUrl = `http://127.0.0.1:${port}/preview.html`
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
    app.use('/', express.static(path.resolve(__dirname, '../client/dist')))

    const staticFiles = await promisify(fs.readdir)(path.resolve(__dirname, '../client'))

    staticFiles
      .filter(file => /\.bundle/.test(file))
      .forEach((file) => {
        app.get(`/${staticPath}/${file}`, (req, res) => {
          res.setHeader('Content-Type', 'application/javascript')
          fs.createReadStream(path.join(__dirname, '..', 'client', file)).pipe(res)
        })
      })

    app.get('/preview.html', async(req, res) => {
      fs.createReadStream(path.resolve(__dirname, '..', 'client/dist/index.html')).pipe(res)
    })

    app.get('/:filename', async (req, res) => {
      const { filename } = req.params
      if (!/\.html$/.test(filename)) return false
      let html
      try {
        // if I use `promisify(myFs.readFile)` if will occur an error
        // `TypeError: this[(fn + "Sync")] is not a function`,
        // So `readFile` need to hard bind `myFs`, maybe it's an issue of `memory-fs`
        html = await promisify(myFs.readFile.bind(myFs))(path.resolve(__dirname, `${staticPath}/${filename}`), 'utf-8')
      } catch (err) {
        log(err, 'error')
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
          const preGenMsg = 'begin to generator HTML...'
          log(preGenMsg)
          sockWrite(this.sockets, 'console', preGenMsg)
          const { html, shellHtml } = await this._getSkeleton().genHtml(url)
          // CACHE SHELLHTML
          this.cacheHtml = shellHtml
          const fileName = await this.writeMagicHtml(html)
          const afterGenMsg = 'generator HTML successfully...'
          log(afterGenMsg)
          sockWrite(this.sockets, 'console', afterGenMsg)
          this.previewUrl = `http://127.0.0.1:${this.port}/${fileName}`
          const openMsg = 'Browser open another page...'
          sockWrite([conn], 'console', openMsg)
          sockWrite([conn], 'success', openMsg)
          if (!this.previewSocket) {
            open(this.directUrl, { app: 'google chrome' })
          } else {
            sockWrite([this.previewSocket], 'url', this.previewUrl)
          }
          break
        }
        case 'connect': {
          if (msg.data === 'preview') {
            this.previewSocket = conn
            log('preview page connected')
          }
        }
        case 'url': {
          if (msg.data !== 'preview') return log(msg)
          sockWrite([conn], 'url', this.previewUrl)
          break
        }
        case 'screenshot': {
          if (!msg.data) return log(msg)
          const url = msg.data
          const screenShotMsg = 'begin to generator screenshot...'
          log(screenShotMsg)
          sockWrite(this.sockets, 'console', screenShotMsg)
          let { screenShotBuffer } = await this._getSkeleton().genScreenShot(url)
          // 图片压缩
          screenShotBuffer = await imagemin.buffer(screenShotBuffer, {
            plugins: [
              imageminPngquant({ quality: '65-80' })
            ]
          })
          const base64 = `data:png;base64,${screenShotBuffer.toString('base64')}`
          const html = await insertScreenShotTpl(base64)
          const fileName = await this.writeMagicHtml(html)
          const afterGenMsg = 'generator screenshot successfully...'
          log(afterGenMsg)
          sockWrite(this.sockets, 'console', afterGenMsg)
          const directUrl = `http://127.0.0.1:${this.port}/${fileName}?preview=false`
          const openMsg = 'Browser open another page...'
          sockWrite([conn], 'console', openMsg)
          sockWrite([conn], 'success', openMsg)
          open(directUrl, { app: 'google chrome' })
          break
        }
        case 'ok': {
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
  /**
   * 将 sleleton 模块生成的 html 写入到内存中。
   */
  async writeMagicHtml(html) {
    try {
      const { staticPath, port } = this
      const pathName = path.join(__dirname, staticPath)
      let fileName = await hasha(html, { algorithm: 'md5' })
      fileName += '.html'
      myFs.mkdirpSync(pathName)
      await promisify(myFs.writeFile.bind(myFs))(path.join(pathName, fileName), html, 'utf8')
      return fileName
    } catch (err) {
      log(err, 'error')
    }
  }
}

module.exports = Server
