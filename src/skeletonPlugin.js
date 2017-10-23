const Server = require('./Server')
const { log } = require('./util/utils')
const { pluginConfig, port, staticPath } = require('./config/config')

function SkeletonPlugin(options = {}) {
  this.options = Object.assign({ port, staticPath }, pluginConfig, options)
  this.server = null
}

SkeletonPlugin.prototype.apply = function(compiler) {
  compiler.plugin('entry-option', compiler => {
    const server = this.server = new Server(this.options)
    server.listen()
  });
  ['watch-close', 'failed'].forEach(event => {
    compiler.plugin(event, () => {
      this.server && this.server.close()
    })
  })
}

module.exports = SkeletonPlugin
