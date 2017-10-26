const port = '8989'
const staticPath = '__webpack_page_skeleton__'
const pluginConfig = {
  device: 'iPhone 6 Plus',
  defer: 5000,
  excludes: [],
  remove: [],
  hide: [],
  screenShot: {
    type: 'png',
    fullPage: true,
  },
  headless: false
}
module.exports = {
  pluginConfig,
  staticPath,
  port
}
