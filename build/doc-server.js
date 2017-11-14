'use strict'

const childProcess = require('child_process')
const express = require('express')
const webpack = require('webpack')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware')
const devConfig = require('./webpack.dev.js')

const app = express()

const compiler = webpack(devConfig)
app.use(webpackHotMiddleware(compiler))
app.use(webpackDevMiddleware(compiler, {
  stats: {
    colors: true,
    chunks: false,
    children: false
  },
  lazy: false
}))

/* eslint-disable */
app.listen(8080, () => {
  console.log('Doc is running at http://localhost:8080/')
  childProcess.exec('open http://localhost:8080/')
})
