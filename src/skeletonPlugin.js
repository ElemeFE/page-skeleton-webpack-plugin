'use strict'

const merge = require('lodash/merge')
const webpack = require('webpack')
const optionsSchema = require('./config/optionsSchema.json')

const Server = require('./server')
const { log, addScriptTag, getShellCode } = require('./util/utils')
const { defaultOptions, staticPath } = require('./config/config')

function SkeletonPlugin(options = {}) {
  const validationErrors = webpack.validateSchema(optionsSchema, options)
  if (validationErrors.length) {
    const errorMsg = validationErrors.map(error => {
      return `option ${error.dataPath} ${error.message}, but got ${typeof error.data}`
    }).join('\n')
    throw new Error(`The options do not match the optionsSchema:\n${errorMsg}`)
  }
  this.options = merge({ staticPath }, defaultOptions, options)
  this.server = null
}

SkeletonPlugin.prototype.apply = function (compiler) { // eslint-disable-line func-names
  compiler.plugin('entry-option', () => {
    const server = this.server = new Server(this.options) // eslint-disable-line no-multi-assign
    server.listen()
      .catch(err => log(err, 'error'))
  })

  compiler.plugin('compilation', (compilation) => {
    compilation.plugin('html-webpack-plugin-before-html-processing', async (htmlPluginData, callback) => {
      // at develop phase, insert the interface code
      if (process.env.NODE_ENV !== 'production') {
        const { port } = this.options
        const clientEntry = `http://localhost:${port}/${staticPath}/index.bundle.js`
        const oldHtml = htmlPluginData.html
        htmlPluginData.html = addScriptTag(oldHtml, clientEntry, port)
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
      if (this.server) {
        this.server.close()
      }
    })
  })
}

module.exports = SkeletonPlugin
