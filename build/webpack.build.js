'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')

module.exports = Object.assign({
  entry: './document/index.js',
  output: {
    path: path.resolve(__dirname, '../doc'),
    filename: 'doc.min.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './document/index.html'
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin('doc.css')
  ]
}, require('./webpack.base'))
