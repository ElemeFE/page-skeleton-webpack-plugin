'use strict'

const staticPath = '__webpack_page_skeleton__'

const defaultOptions = {
  port: '8989',
  loading: 'spin', // ['spin', 'chiaroscuro'],
  text: {
    color: '#EEEEEE'
  },
  image: {
    shape: 'rect', // `rect` | `circle`
    color: '#EFEFEF',
    shapeOpposite: []
  },
  button: {
    color: '#EFEFEF',
    excludes: []
  },
  svg: {
    color: '#EFEFEF', // or transparent
    shape: 'circle', // circle | rect
    shapeOpposite: []
  },
  pseudo: {
    color: '#EFEFEF', // or transparent
    shape: 'circle', // circle | rect
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
  cssUnit: 'rem' // or 'vw|vh|vmin|vmax'
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
  defaultOptions,
  staticPath
}
