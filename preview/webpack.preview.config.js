const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const path = require('path')


const PATH = {
  app: __dirname,
  build: __dirname
}

module.exports = {
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
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader']
      })
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000
      }
    }]
  },
  plugins: [
    new CleanPlugin('dist'),
    new HtmlWebpackPlugin({
      template: path.resolve(PATH.app, './index.html'),
      filename: path.resolve(PATH.build, './dist/index.html'),
      inject: true
    }),
    new ExtractTextPlugin({
      filename: 'app-[contenthash:8].min.css'
    }),
  ]
}