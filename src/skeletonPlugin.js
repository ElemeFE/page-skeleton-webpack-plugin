const Server = require('./Server')
const { log, addScriptTag } = require('./util/utils')
const { pluginConfig, port, staticPath } = require('./config/config')

function SkeletonPlugin(options = {}) {
  Object.assign(pluginConfig.screenShot, options.screenShot)
  this.options = Object.assign({ port, staticPath }, pluginConfig, options)
  this.server = null
}

SkeletonPlugin.prototype.apply = function(compiler) {
  compiler.plugin('entry-option', compiler => {
    const server = this.server = new Server(this.options)
    server.listen()
    .catch(err => log(err, 'error'))
  })
  
  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {

      const clientEntry = `http://localhost:${port}/${staticPath}/index.bundle.js`
      const oldHtml = htmlPluginData.html
      htmlPluginData.html = addScriptTag(oldHtml, clientEntry)
      callback(null, htmlPluginData)
      
    })
  })

  ;['watch-close', 'failed'].forEach(event => {
    compiler.plugin(event, () => {
      this.server && this.server.close()
    })
  })
}

module.exports = SkeletonPlugin
