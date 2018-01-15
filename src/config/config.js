'use strict'

const port = '8989'
const staticPath = '__webpack_page_skeleton__'
const pluginConfig = {
  device: 'iPhone 6 Plus',
  debug: false,
  minify: {
    minifyCSS: { level: 2 },
    removeComments: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: false
  },
  defer: 5000,
  excludes: [],
  remove: [],
  hide: [],
  headless: true,
  h5Only: false
}

const htmlBeautifyConfig = {
  'indent_size': 4,
  'html': {
    'end_with_newline': true,
    'js': {
      'indent_size': 2
    },
    'css': {
      'indent_size': 2
    }
  },
  'css': {
    'indent_size': 1
  },
  'js': {
    'preserve-newlines': true
  }
}

module.exports = {
  htmlBeautifyConfig,
  pluginConfig,
  staticPath,
  port
}
