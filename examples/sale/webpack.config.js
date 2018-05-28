const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')
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
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: (loader) => [
                require('postcss-import')({ root: loader.resourcePath }),
                require('postcss-nested'),
                cssnext,
                px2rem({ remUnit: 75 })
              ]
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        )
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
    new VueLoaderPlugin(),
    new SkeletonPlugin({
      pathname: path.resolve(__dirname, `./shell`),
      staticDir: path.resolve(__dirname, './dist'),
      routes: ['/'],
      port: '7890',
      loading: 'chiaroscuro',
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
      defer: 5000,
      excludes: [],
      remove: [],
      hide: ['.index-dashedline_7B79b3W', '.Rating-actived_GBtiHkB_0'],
      grayBlock: ['#header'],
      cssUnit: 'rem',
      headless: true,
      // minify: false,
      cookies: [{
        name: 'SID',
        value: 'a495vvmEPEE4DZi083dr8yR3EAPYqW40HaWA',
        url: 'https://h5.ele.me'
      }, {
        name: 'USERID',
        value: '273745271',
        url: 'https://h5.ele.me'
      }],
      noInfo: false
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
  module.exports.mode = 'production'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
