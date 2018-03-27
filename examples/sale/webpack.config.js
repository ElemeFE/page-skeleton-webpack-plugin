const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const px2rem = require('postcss-px2rem')
const cssnext = require('postcss-cssnext')({
  browsers: [
    'last 2 versions',
    'iOS >= 7',
    'Android >= 4.0',
  ],
})
const SkeletonPlugin = require('../../index.js').SkeletonPlugin

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          },
          postcss:[
            require('postcss-import')(),
            require('postcss-nested'),
            cssnext,
            px2rem({remUnit: 75}) ]
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html'
    }),
    new SkeletonPlugin({
      svg: {
        color: '#EFEFEF',
        shape: 'circle',
        shapeOpposite: ['.Rating-gray_1kpffd5_0 svg']
      },
      image: {
        shape: 'rect', // `rect` | `circle`
        color: '#EFEFEF',
        shapeOpposite: ['.mint-swipe-items-wrap img']
      },
      pseudo: {
        color: '#EFEFEF', // or transparent
        shape: 'circle', // circle | rect
        shapeOpposite: ['.delivery-icon-hollow_3q8_B5r_0', '.index-premium_39rl0v9']
      },
      button: {
        color: '#EFEFEF',
        excludes: ['.mint-swipe-items-wrap a']
      },
      pathname: path.resolve(__dirname, `./src`),
      defer: 5000,
      excludes: [],
      remove: [],
      hide: ['.index-dashedline_7B79b3W', '.Rating-actived_GBtiHkB_0'],
      grayBlock: ['#header'],
      cssUnit: 'vw',
      cookies: [{
        name: 'hello',
        value: 'world',
        url: 'http://127.0.0.1'
      }, {
        name: 'ransixi',
        value: 'jocs',
        path: '/',
        url: 'http://127.0.0.1'
      }]
    }),
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
