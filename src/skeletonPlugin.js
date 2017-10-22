const Server = require('./Server')
const { writeShell } = require('./util/utils')

function SkeletonPlugin({ pathname }) {
  console.log(pathname)
  this.pathname = pathname
  this.server = null
}

SkeletonPlugin.prototype.apply = function(compiler) {
  compiler.plugin('entry-option', compiler => {
    this.server = new Server({ staticPath: 'statics' })
    this.server.on('writeShell', html => {
      writeShell(this.pathname, html)
    })
  })
  compiler.plugin('fail', compiler => {
    this.server && this.server.close()
  })
}

module.exports = SkeletonPlugin

