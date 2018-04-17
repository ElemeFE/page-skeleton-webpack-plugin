'use strict'

const merge = require('lodash/merge')
const webpack = require('webpack')
const optionsSchema = require('./config/optionsSchema.json')
const Server = require('./server')
const { addScriptTag, getShellCode } = require('./util')
const { defaultOptions, staticPath } = require('./config/config')
const OptionsValidationError = require('./config/optionsValidationError')

const EVENT_LIST = process.env.NODE_ENV === 'production' ? ['watch-close', 'failed', 'done'] : ['watch-close', 'failed']

function SkeletonPlugin(options = {}) {
  const validationErrors = webpack.validateSchema(optionsSchema, options)
  if (validationErrors.length) {
    throw new OptionsValidationError(validationErrors)
  }
  this.options = merge({ staticPath }, defaultOptions, options)
  this.server = null
}

SkeletonPlugin.prototype.apply = function (compiler) { // eslint-disable-line func-names
  compiler.plugin('entry-option', () => {
    const server = this.server = new Server(this.options) // eslint-disable-line no-multi-assign
    server.listen()
      .catch(err => server.log.warn(err))
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
          this.server.log.warn(err.toString())
        }
      }
      callback(null, htmlPluginData)
    })
  })

  EVENT_LIST.forEach((event) => {
    compiler.plugin(event, () => {
      if (this.server) {
        this.server.close()
      }
    })
  })
}

module.exports = SkeletonPlugin
