'use strict'

const Server = require('./server')
const { log, addScriptTag, getShellCode } = require('./util/utils')
const { pluginConfig, port, staticPath } = require('./config/config')

function SkeletonPlugin(options = {}) {
  this.options = Object.assign({ port, staticPath }, pluginConfig, options)
  this.server = null
}

SkeletonPlugin.prototype.apply = function (compiler) { // eslint-disable-inline func-names
  compiler.plugin('entry-option', (compiler) => {
    const server = this.server = new Server(this.options)
    server.listen()
      .catch(err => log(err, 'error'))
  })

  compiler.plugin('compilation', (compilation) => {
    compilation.plugin('html-webpack-plugin-before-html-processing', async (htmlPluginData, callback) => {
      // at develop phase, insert the interface code
      if (process.env.NODE_ENV !== 'production') {
        const clientEntry = `http://localhost:${port}/${staticPath}/index.bundle.js`
        const oldHtml = htmlPluginData.html
        htmlPluginData.html = addScriptTag(oldHtml, clientEntry)
      }
      // replace `<!-- shell -->` with `shell code`
      if (!this.options.h5Only) {
        try {
          const code = await getShellCode(this.options.pathname)
          htmlPluginData.html = htmlPluginData.html.replace('<!-- shell -->', code)
        } catch (err) {
          log(err.toString(), 'error')
        }
      }
      callback(null, htmlPluginData)
    })
  })

  ;['watch-close', 'failed'].forEach((event) => {
    compiler.plugin(event, () => {
      this.server && this.server.close()
    })
  })
}

module.exports = SkeletonPlugin
