'use strict'

const postcssNested = require('postcss-nested')
const postcssCssnext = require('postcss-cssnext')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const svgoConfig = JSON.stringify(require('./svgo-config.json'))

const postCssPlugins = [
  postcssNested,
  postcssCssnext({
    browsers: [
      'last 2 versions',
      'Android >= 4.3',
      'iOS >= 7.0'
    ]
  })
]

const rules = [
  /*  preLoaders  */
  {
    enforce: 'pre',
    test: /.vue$/,
    loader: 'eslint-loader',
    exclude: /node_modules/
  }, {
    enforce: 'pre',
    test: /.js$/,
    loader: 'eslint-loader',
    exclude: /node_modules/
  }, {
    enforce: 'pre',
    test: /\.svg$/,
    loader: `svgo-loader?${svgoConfig}`,
    exclude: /node_modules/
  },
  /*  loaders  */
  {
    test: /\.svg$/,
    exclude: [/not-sprite-svg/, /node_modules/],
    loader: `svg-sprite-loader?${JSON.stringify({
      name: '[name].[hash:7]',
      prefixize: true
    })}`
  }, {
    test: /\.svg$/,
    loader: 'url-loader?limit=10000',
    include: /not-sprite-svg/,
    exclude: /node_modules/
  }, {
    test: /\.(png|jpg|jpeg|gif)$/,
    loader: 'url-loader?limit=80000',
    exclude: /node_modules/
  }, {
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
      loaders: {
        js: 'eslint-loader!babel-loader'
      },
      postcss: postCssPlugins,
      extractCSS: true,
      autoprefixer: false,
      cssModules: {
        localIdentName: '[name]-[local]_[hash:base64:7]',
        camelCase: true
      }
    },
    exclude: /node_modules/
  }, {
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/
  }, {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            minimize: true
          }
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: () => postCssPlugins
          }
        }
      ]
    }),
    exclude: /node_modules/
  }
]

module.exports = {
  module: {
    rules
  },
  resolve: {
    extensions: ['.js', '.vue', '.json']
  },
  externals: {
    vue: 'Vue'
  }
}
