const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const { sleep, genScriptContent, log } = require('./util/utils')

class Skeleton {
  constructor(url, options = {}) {
    this.options = options
    this.url = url
  }
  async genHtml() {
    const {
      device,
      defer = 0,
      remove = [],
      excludes = [],
      hide = [],
      headless
    } = this.options
    const { url } = this
    const browser = await puppeteer.launch({ headless })
    const page = await browser.newPage()
    await page.emulate(devices[device])
    await page.goto(url)
    const content = await genScriptContent()
    // `./util/headlessClient.js` 文件插入到 page 中
    await page.addScriptTag({ content })
    await sleep(defer)

    const html = await page.evaluate(async (remove, excludes, hide) => {
      return getOutHtml(remove, excludes, hide)
    }, remove, excludes, hide)

    browser.close()

    return { html }
  }

}

module.exports = Skeleton
