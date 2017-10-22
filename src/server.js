const http = require('http')
const sockjs = require('sockjs')
const express = require('express')
const path = require('path')
const EventEmitter = require('events')
const MemoryFileSystem = require('memory-fs')
const { getSegment } = require('./util/utils')
const myFs = new MemoryFileSystem()

const skeleton = require('./skeleton')

class Server extends EventEmitter {
  constructor({ port = 9898, staticPath = 'statics' }) {
    super()
    this.port = port
    this.staticPath = staticPath
    this.cacheHtml = ''
    this.createServer({ staticPath, port })
  }
  // 启动服务
  createServer({ staticPath, port }) {
    if (!staticPath) throw new Error('You must provide static path')
    const self = this
    const app = this.app = express()
    
    app.use('/index.html', (req, res) => {
      const html = myFs.readFileSync(path.resolve(__dirname, `${this.staticPath}/index.html`), 'utf-8')
      res.send(html)
    })

    // app.use('/', express.static(path.resolve(__dirname, staticPath)))

    var sockjsServer = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' })

    sockjsServer.on('connection', function(conn) {
        conn.on('data', function(message) {
            const msg = JSON.parse(message)
            switch (msg.type) {
              case 'generate': {
                if (!msg.url) return console.log(msg)
                const url = msg.url
                console.log(url)
                const option = {
                  device: 'iPhone 6 Plus',
                  defer: 5000,
                  excludes: ['.app-header'],
                  remove: ['.icon-wrapper', '.unlogin-container_1Kyfq_0', '.main-wrapper_2p2-E_0'],
                  hide: ['.remain-bar'],
                  launch: {
                    headless: false,
                    executablePath: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
                  }
                };

                (async function() {

                  const { html } = await skeleton(url, option)
                  
                  const pathName = path.join(__dirname, self.staticPath)
                  const fileName = 'index.html'
                  self.cacheHtml = html
                  conn.write(`http://127.0.0.1:${self.port}/${fileName}`)
                  myFs.mkdirpSync(pathName)
                  myFs.writeFile(path.join(pathName, fileName), html, 'utf8', err => {
                    if (err) console.log(err)
                  })

                })()
                .catch(console.log.bind(console))
                break
              }
              case 'ok': {
                self.emit('writeShell', self.cacheHtml)
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
    listenServer.listen(port, () => {
      console.log(`start server at port: ${port}`)
    })
  }
   // 关闭服务
  close() {
    process.exit()
  }
}


module.exports = Server
