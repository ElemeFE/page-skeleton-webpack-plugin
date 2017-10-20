const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const { sleep } = require('./src')
const { createServer } = require('./src/server')

const skeleton = async function(url, option = {}) {

  const defaultOption = {
    device: 'iPhone 6'
  }

  const { device, defer = 0, remove = null, excludes = null, launch: launchOpt } = Object.assign({}, defaultOption, option)

  const browser = await puppeteer.launch(launchOpt)

  const page = await browser.newPage()
  await page.emulate(devices[device])
  
  await page.goto(url)

  await sleep(defer)

  const html = await page.evaluate((remove, excludes) => {
    const $ = document.querySelectorAll
    if (remove.length) {
      const removeEle = $(remove.join(','))
      Array.from(removeEle).forEach(ele => ele.parentNode.removeChild(ele))
    }

    const excludesEle = excludes.length ? Array.from($(excludes.join(','))) : []
    const isBase64Img = img => /base64/.test(img.src)
    const imgs = []
    const texts = []
    const imgHandler = ele => {
      const div = document.createElement('div')
      const parent = ele.parentNode

      const { width, height } = ele.getBoundingClientRect()

      div.style.width = `${width}px`
      div.style.height = `${height}px`
      div.style.backgroundColor = '#efefef'

      parent.removeChild(ele)
      parent.appendChild(div)
    }
    const textHandler = ele => {
      const comStyle = window.getComputedStyle(ele)
      const { lineHeight, paddingTop, paddingRight, paddingBottom, position: opos, fontSize } = comStyle
      const position = ['fixed', 'absolute', 'flex'].find(p => p === opos) ? opos : 'relative'
      const height = ele.offsetHeight
      const lineCount = height / lineHeight | 0
      let textHeightRatio = parseInt(fontSize, 10) / parseInt(lineHeight, 10)
      if (Number.isNaN(textHeightRatio)) {
        textHeightRatio = 1 / 1.4
      }
      Object.assign(ele.style, {
        color: '#eee',
        backgroundImage: `linear-gradient(#fff ${(1 - textHeightRatio) / 2 * 100}%, #eee 0%, #eee ${((1 - textHeightRatio) / 2 + textHeightRatio) * 100}%, #fff 0%)`,
        backgroundSize: `100% ${lineHeight}px`,
        backgroundClip: 'content-box',
        backgroundPositionY: paddingTop,
        position
      })
      // add white mask
      if (lineCount > 1) {
        const div = document.createElement('div')

        Object.assign(div.style, {
          width: '50%',
          height: lineHeight,
          background: '#fff',
          position: 'absolute',
          right: paddingRight,
          bottom: paddingBottom
        })

        ele.appendChild(div)        
      }

    }

    const traverse = ele => {
      if (~excludesEle.indexOf(ele)) return false
      if (ele.tagName === 'IMG' && !isBase64Img(ele)) return imgs.push(ele)
      if (
        ele.childNodes
        && ele.childNodes.length === 1
        && ele.childNodes[0].nodeType === 3
        ) {
        return texts.push(ele)
      }

      if (ele.children && ele.children.length > 0) {
        Array.from(ele.children).forEach(child => traverse(child))
      }

    }

    traverse(document.documentElement)

    imgs.forEach(ele => imgHandler(ele))
    texts.forEach(ele => textHandler(ele))

    return document.documentElement.outerHTML

  }, remove, excludes)

  browser.close()

  return { html }
}

module.exports = skeleton
