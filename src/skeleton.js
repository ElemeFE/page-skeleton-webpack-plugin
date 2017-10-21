const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const { sleep, genScriptContent } = require('./util/utils')

const skeleton = async function(url, option = {}) {
  const defaultOption = {
    device: 'iPhone 6 Plus'
  }
  const {
    device,
    defer = 0,
    remove = [],
    excludes = [],
    hide = [],
    launch: launchOpt
  } = Object.assign({}, defaultOption, option)

  const browser = await puppeteer.launch(launchOpt)
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
      throw new Error(err)
    }
    return outHtml

  }, remove, excludes, hide)

  browser.close()

  return { html }
}

module.exports = skeleton
