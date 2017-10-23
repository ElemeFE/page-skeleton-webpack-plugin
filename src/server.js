const http = require('http')
const sockjs = require('sockjs')
const hasha = require('hasha')
const express = require('express')
const path = require('path')
const EventEmitter = require('events')
const MemoryFileSystem = require('memory-fs')
const { getSegment, writeShell, log } = require('./util/utils')
const Skeleton = require('./Skeleton')

const myFs = new MemoryFileSystem()

class Server extends EventEmitter {
  constructor(options) {
    super()
    Object.keys(options).forEach(k => Object.assign(this, { [k]: options[k] }))
    this.options = options
    // 用于缓存写入 shell.vue 文件的 html
    this.cacheHtml = ''
  }
  // 启动服务
  listen() {
    const app = this.app = express()
    
    app.use('/:filename', (req, res) => {
      const { filename } = req.params
      if (!/\.html$/.test(filename)) return false
      myFs.readFile(path.resolve(__dirname, `${this.staticPath}/${filename}`), 'utf-8', (err, html) => {
        if (err) return log(err)
        res.send(html)
      })
    })

    // app.use('/', express.static(path.resolve(__dirname, staticPath)))

    var sockjsServer = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' })

    sockjsServer.on('connection', conn => {
        conn.on('data', message => {
            const msg = JSON.parse(message)
            switch (msg.type) {
              case 'generate': {
                if (!msg.url) return log(msg)
                const url = msg.url;

                (async () => {

                  const { html } = await new Skeleton(url, this.options).genHtml()
                  const pathName = path.join(__dirname, this.staticPath)
                  let fileName = await hasha(html, { algorithm: 'md5' })
                  fileName += '.html'
                  this.cacheHtml = getSegment(html)
                  conn.write(html)
                  conn.write(`http://127.0.0.1:${this.port}/${fileName}`)
                  myFs.mkdirpSync(pathName)
                  myFs.writeFile(path.join(pathName, fileName), html, 'utf8', err => {
                    if (err) log(err)
                  })

                })()
                .catch(log)
                break
              }
              case 'ok': {
                writeShell(this.pathname, this.cacheHtml)
                break
              }
            }
            
        })
        conn.on('close', function() {
          // TODO:
        })
    })

    const listenServer = http.createServer(app)
    sockjsServer.installHandlers(listenServer, { prefix:'/socket' })
    listenServer.listen(this.port, () => {
      log(`page-skeleton server listen at port: ${this.port}`)
    })
  }
   // 关闭服务
  close() {
    process.exit()
  }
}


module.exports = Server
