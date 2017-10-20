const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const { sleep, genScriptContent } = require('./util/utils')
const scriptFns = require('./util/browserUtils')

const skeleton = async function(url, option = {}) {
  const defaultOption = {
    device: 'iPhone 6'
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
  // 将一些 utils 插入到打开的页面执行环境中
  await page.addScriptTag({
    content: genScriptContent(...scriptFns)
  })
  await sleep(defer)

  const html = await page.evaluate(async (remove, excludes, hide) => {

    const $ = document.querySelectorAll.bind(document)

    if (remove.length) {
      const removeEle = $(remove.join(','))
      Array.from(removeEle).forEach(ele => ele.parentNode.removeChild(ele))
    }

    if (hide.length) {
      const hideEle = $(hide.join(','))
      Array.from(hideEle).forEach(ele => ele.style.opacity = 0)
    }

    const excludesEle = excludes.length ? Array.from($(excludes.join(','))) : []

    await traverse(document.documentElement, excludesEle)

    return document.documentElement.outerHTML

  }, remove, excludes, hide)

  browser.close()

  return { html }
}

module.exports = skeleton
