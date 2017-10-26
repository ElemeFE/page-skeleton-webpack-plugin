const fs = require('fs')
const http = require('http')
const sockjs = require('sockjs')
const hasha = require('hasha')
const express = require('express')
const path = require('path')
const EventEmitter = require('events')
const open = require('opn')
const MemoryFileSystem = require('memory-fs')
const {
  htmlMinify,
  writeShell,
  log,
  promisify,
  addScriptTag
} = require('./util/utils')
const Skeleton = require('./Skeleton')

const myFs = new MemoryFileSystem()

class Server extends EventEmitter {
  constructor(options) {
    super()
    Object.keys(options).forEach(k => Object.assign(this, { [k]: options[k] }))
    this.options = options
    // 用于缓存写入 shell.vue 文件的 html
    this.cacheHtml = ''
    this.sockets = []
    this.skeleton = null
  }
  _getSkeleton() {
    return this.skeleton = this.skeleton ||  new Skeleton(this.options)
  }
  async initRouters() {
    const { app, staticPath } = this
    // app.use(`/${staticPath}`, express.static(path.resolve(__dirname, staticPath)))

    const staticFiles = await promisify(fs.readdir)(path.resolve(__dirname, '../client'))

    staticFiles
      .filter(file => /\.bundle/.test(file))
      .forEach(file => {
        app.get(`/${staticPath}/${file}`, (req, res) => {
          res.setHeader('Content-Type', 'application/javascript')
          fs.createReadStream(path.join(__dirname, '..', 'client', file)).pipe(res)
        })
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
      } catch(err) {
        log(err, 'error')
      }
      res.send(html)
    })
  }
  initSocket() {
    const { listenServer } = this
    const sockjsServer = this.sockjsServer = sockjs.createServer({
      sockjs_url: `/${this.staticPath}/sockjs.bundle.js`,
      log(severity, line) {
        if (severity === 'error') {
          log(line, 'error')
        }
      }
    })
    sockjsServer.installHandlers(listenServer, { prefix:'/socket' })
    sockjsServer.on('connection', conn => {
      if (!~this.sockets.indexOf(conn)) {
        this.sockets.push(conn)
        log(`client socket: ${conn.id} connect to server`)
      }

      conn.on('data', this.resiveSocketData(conn))

      conn.on('close', () => {
        const index = this.sockets.indexOf(conn)
        if (index > -1) this.sockets.splice(index, 1)
      })
    })
  }
  // 启动服务
  async listen() {
    const app = this.app = express()
    const listenServer = this.listenServer = http.createServer(app)
    this.initRouters()
    this.initSocket()
    listenServer.listen(this.port, () => {
      log(`page-skeleton server listen at port: ${this.port}`)
    })
  }
   // 关闭服务
  close() {
    // TODO...
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
          this.sockWrite(this.sockets, 'console', preGenMsg)
          const { html } = await this._getSkeleton().genHtml(url)
          const fileName = await this.writeMagicHtml(html)
          const afterGenMsg = 'generator HTML successfully...'
          log(afterGenMsg)
          this.sockWrite(this.sockets, 'console', afterGenMsg)
          const directUrl = `http://127.0.0.1:${this.port}/${fileName}?preview=true`
          const openMsg = 'Browser open another page...'
          this.sockWrite([conn], 'console', openMsg)
          this.sockWrite([conn], 'success', openMsg)
          open(directUrl, { app: 'google chrome' })
          break
        }
        case 'screenshot': {
          if (!msg.data) return log(msg)
          const url = msg.data
          const screenShotMsg = 'begin to generator screenshot...'
          log(screenShotMsg)
          this.sockWrite(this.sockets, 'console', screenShotMsg)
          const { screenShotBuffer } = await this._getSkeleton().genScreenShot(url)
          // todo 图片压缩
          const base64 = `data:${this.options.screenShot.type};base64,${screenShotBuffer.toString('base64')}`
          const fileName = await this.writeMagicHtml(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>预览 shell 图片</title>
          </head>
          <body>
            <img style="width: 100%;" src="${base64}">
          </body>
          </html>`)
          const afterGenMsg = 'generator HTML successfully...'
          log(afterGenMsg)
          this.sockWrite(this.sockets, 'console', afterGenMsg)
          const directUrl = `http://127.0.0.1:${this.port}/${fileName}?preview=true`
          const openMsg = 'Browser open another page...'
          this.sockWrite([conn], 'console', openMsg)
          this.sockWrite([conn], 'success', openMsg)
          open(directUrl, { app: 'google chrome' })
          break
        }
        case 'ok': {
          this.sockWrite([conn], 'console', 'before write shell files...')
          await writeShell(this.pathname, this.cacheHtml)
          const afterWriteMsg = 'Write files successfully...'
          log(afterWriteMsg)
          this.sockWrite([conn], 'console', afterWriteMsg)
          this.sockWrite([conn], 'success', afterWriteMsg)
          break
        }
      }
    }
  }
  /**
   * 将 sleleton 模块生成的 html 写入到内存中。
   */
  async writeMagicHtml(html) {
    try {
      const { staticPath, port } = this
      const clientEntry = `http://localhost:${port}/${staticPath}/index.bundle.js`
      const pathName = path.join(__dirname, staticPath)
      let fileName = await hasha(html, { algorithm: 'md5' })
      fileName += '.html'
      this.cacheHtml = htmlMinify(html)
      const sockHtml = addScriptTag(html, clientEntry)
      myFs.mkdirpSync(pathName)
      await promisify(myFs.writeFile.bind(myFs))(path.join(pathName, fileName), sockHtml, 'utf8')
      return fileName
    } catch (err) {
      log(err, 'error')
    }
  }

  // Server 端主动推送消息到制定 socket
  sockWrite(sockets, type, data) {
    sockets.forEach(sock => {
      sock.write(JSON.stringify({
        type, data
      }))
    })
  }

}

module.exports = Server
