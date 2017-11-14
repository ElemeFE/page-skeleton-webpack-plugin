'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = Object.assign({
  entry: './document/index.js',
  output: {
    path: path.resolve(__dirname, '../doc'),
    filename: '[name].[chunkhash].min.js'
  },
  plugins: [
    new CleanWebpackPlugin(['doc'], {
      root: path.resolve(__dirname, '../')
    }),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './document/index.html'
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin('[name].[chunkhash].min.css')
  ]
}, require('./webpack.base'))
