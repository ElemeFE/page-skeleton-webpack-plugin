'use strict'

const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')

module.exports = Object.assign({
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, '../doc'),
    filename: 'doc.min.js'
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin('doc.css')
  ]
}, require('./webpack.base'))
