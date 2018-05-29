const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CleanPlugin = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const PATH = {
  app: __dirname,
  build: __dirname
}

module.exports = {
  mode: 'development',
  entry: path.resolve(PATH.app, './index.js'),
  output: {
    filename: 'bundle.[hash:20].js',
    path: path.join(PATH.build, 'dist')
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        extractCSS: true
      }
    }, {
      test: /\.css$/,
      use: [
        process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
        "css-loader"
      ]
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000
      }
    }]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanPlugin('dist'),
    new HtmlWebpackPlugin({
      template: path.resolve(PATH.app, './index.html'),
      filename: path.resolve(PATH.build, './dist/index.html'),
      inject: true
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.mode = 'production'
  module.exports.plugins.push(new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: '[name].[hash].css',
    chunkFilename: '[id].[hash].css'
  }))
}