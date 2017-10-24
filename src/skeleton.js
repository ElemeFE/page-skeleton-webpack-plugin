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
      headless,
      executablePath
    } = this.options
    const { url } = this

    const browser = await puppeteer.launch({ headless, executablePath })
    const page = await browser.newPage()
    await page.emulate(devices[device])
    await page.goto(url)
    const content = await genScriptContent()
    // `./util/headlessClient.js` 文件插入到 page 中
    await page.addScriptTag({ content })
    await sleep(defer)

    const html = await page.evaluate(async (remove, excludes, hide) => {
      let outHtml
      try {
        // `getOutHtml` 方法是通过 `addScriptTag` 方法插入 js 代码中的方法
        outHtml = await getOutHtml(remove, excludes, hide)
      } catch (err) {
        log(err, 'error')
      }
      return outHtml

    }, remove, excludes, hide)

    browser.close()

    return { html }
  }

}

module.exports = Skeleton
