const express = require('express')
const path = require('path')

module.exports = {
  // 启动服务
  createServer({staticPath, port = 9898}) {
    if (!staticPath) throw new Error('You must provide static path')

    const app = express()
    console.log(path.resolve(__dirname, staticPath))
    app.use(express.static(staticPath))

    app.listen(port, () => {
      console.log(`start server at port: ${port}`)
    })
  },
  // 关闭服务
  closeServer() {
    process.exit()
  }
}