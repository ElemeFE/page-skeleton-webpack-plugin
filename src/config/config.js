'use strict'

const staticPath = '__webpack_page_skeleton__'

const defaultOptions = {
  port: '8989',
  // ['spin', 'chiaroscuro', 'shine'],
  loading: 'spin',
  text: {
    color: '#EEEEEE'
  },
  image: {
    // `rect` | `circle`
    shape: 'rect',
    color: '#EFEFEF',
    shapeOpposite: []
  },
  button: {
    color: '#EFEFEF',
    excludes: []
  },
  svg: {
    // or transparent
    color: '#EFEFEF',
    // circle | rect
    shape: 'circle',
    shapeOpposite: []
  },
  pseudo: {
    // or transparent
    color: '#EFEFEF',
    // circle | rect
    shape: 'circle',
    shapeOpposite: []
  },
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
  grayBlock: [],
  cookies: [],
  headless: true,
  h5Only: false,
  // or 'vw|vh|vmin|vmax'
  cssUnit: 'rem',
  decimal: 4,
  logLevel: 'info',
  quiet: false,
  noInfo: false,
  logTime: true
}

const htmlBeautifyConfig = {
  indent_size: 2,
  html: {
    end_with_newline: true,
    js: {
      indent_size: 2
    },
    css: {
      indent_size: 2
    }
  },
  css: {
    indent_size: 1
  },
  js: {
    'preserve-newlines': true
  }
}

module.exports = {
  htmlBeautifyConfig,
  defaultOptions,
  staticPath
}
