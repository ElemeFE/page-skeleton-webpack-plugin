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
  headless: true
}
module.exports = {
  pluginConfig,
  staticPath,
  port
}
