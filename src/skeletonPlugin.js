// const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const Server = require('./Server')
const { log, addScriptTag } = require('./util/utils')
const { pluginConfig, port, staticPath } = require('./config/config')

function SkeletonPlugin(options = {}) {
  this.options = Object.assign({ port, staticPath }, pluginConfig, options)
  this.server = null
  this.clientEntry = `http://localhost:${port}/${staticPath}/index.js`
}

SkeletonPlugin.prototype.apply = function(compiler) {
  compiler.plugin('entry-option', compiler => {
    const server = this.server = new Server(this.options)
    server.listen()
  })
  // const insertAssets = new HtmlWebpackIncludeAssetsPlugin({
  //   assets: [`http://localhost:${port}/${staticPath}/index.js`],
  //   append: true
  // })
  // insertAssets.apply(compiler)
  compiler.plugin('emit', (compilation, callback) => {
    const assets = compilation.assets
    const htmlFiles = Object.keys(assets).filter(filename => /\.html$/.test(filename))
    htmlFiles.forEach(filename => {
      const { source, size } = assets[filename]
      assets[filename] = {
        source: function() {
          return addScriptTag(source(), this.clientEntry)
        },
        size: function() {
          return size
        }
      }
    })
    callback()
  })
  ;['watch-close', 'failed'].forEach(event => {
    compiler.plugin(event, () => {
      this.server && this.server.close()
    })
  })
}

module.exports = SkeletonPlugin
