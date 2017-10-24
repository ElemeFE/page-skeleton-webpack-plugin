var path = require('path')
var express = require('express')
var app = require('express')()
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var webpackConfig = require('./webpack.config')
var server
var PORT = process.env.port || 8080
var compiler = webpack(webpackConfig)
var devMiddleware = webpackDevMiddleware(compiler, {
  stats: {
    colors: true,
    chunks: false,
    children: false,
  },
  lazy: false,
  publicPath: '/',
})

app.use(devMiddleware)
app.use(webpackHotMiddleware(compiler))
app.use(express.static(path.join(__dirname, './dist')))

var http = require('http')
server = http.createServer(app)


server.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`)
})
