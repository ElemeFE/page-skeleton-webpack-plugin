const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    }, {
      test: /\.tpl\.html$/,
      use: {
        loader: 'raw-loader'
      }
    }, {
      test: /\.vue/,
      use: ['vue-loader']
    }]
  },
  plugins: [
    new UglifyJSPlugin()
  ]
}