const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const { minify } = require('csso')
const { parse, toPlainObject, fromPlainObject, translate } = require('css-tree')
const {
  sleep, genScriptContent, log,
  htmlMinify, collectImportantComments
} = require('./util/utils')

class Skeleton {
  constructor(options = {}) {
    this.options = options
    this.browser = null
    this.page = null
  }

  async initPage() {
    if (this.browser && this.page) {
      return this.page
    }
    const { device, headless } = this.options
    const browser = await puppeteer.launch({ headless })
    const page = await browser.newPage()
    await page.emulate(devices[device])
    this.browser = browser
    this.page = page
    return this.page
  }

  async makeSkeleton() {
    const { defer, remove, excludes, hide } = this.options
    const content = await genScriptContent()
    // `./util/headlessClient.js` 文件插入到 page 中
    await this.page.addScriptTag({ content })
    await sleep(defer)
    await this.page.evaluate(async (remove, excludes, hide) => {
      const { genSkeleton } = Skeleton
      genSkeleton(remove, excludes, hide)
    }, remove, excludes, hide)
  }

  async genHtml(url) {

    const stylesheetAstObjects = {}
    const stylesheetContents = {}

    const page = await this.initPage()

    await page.setRequestInterceptionEnabled(true)
    page.on('request', request => {
      if (stylesheetAstObjects[request.url]) {
        // don't need to download the same assets
        request.abort()
      } else {
        request.continue()
      }
    })
    // To build a map of all downloaded CSS (css use link tag)
    page.on('response', response => {
      const { url } = response
      const ct = response.headers['content-type'] || ''
      if (!response.ok) {
        throw new Error(`${response.status} on ${url}`)
      }
      if (ct.indexOf('text/css') > -1 || /\.css$/i.test(url)) {
        response.text().then(text => {
          const ast = parse(text, {
            parseValue: false,
            parseRulePrelude: false
          })
          stylesheetAstObjects[url] = toPlainObject(ast)
          stylesheetContents[url] = text
        })
      }
    })
    page.on('pageerror', error => {
      throw error
    })

    const response = await page.goto(url, { waitUntil: 'networkidle' })
    if (!response.ok) {
      throw new Error(`${response.status} on ${url}`)
    }

    await this.makeSkeleton()

    const { rawHtml, styles, cleanedHtml } = await page.evaluate(async () => {
      const { getHtmlAndStyle } = Skeleton
      return getHtmlAndStyle()
    })

    const stylesheetAstArray = styles.map(style => {
      const ast = parse(style, {
        parseValue: false,
        parseRulePrelude: false
      })
      return toPlainObject(ast)
    })

    const cleanedStyles = await page.evaluate(async (stylesheetAstObjects, stylesheetAstArray) => {
      const DEAD_OBVIOUS = new Set(['*', 'body', 'html'])
      const cleanedStyles = []
      const checker = selector => {
        if (DEAD_OBVIOUS.has(selector)) {
          return true
        }
        if (/:-(ms|moz)-/.test(selector)) {
          return true
        }
        try {
          const keep = !!document.querySelector(selector)
          return keep
        } catch (err) {
          const exception = err.toString()
          console.error(`Unable to querySelector('${selector}') [${exception}]`)
          return false
        }
      }

      const cleaner = (ast, callback) => {

        const decisionsCache = {}

        const clean = (children, callback) => {
          return children.filter(child => {
            if (child.type === 'Rule') {
              const values = child.prelude.value.split(',').map(x => x.trim())
              const keepValues = values.filter(selectorString => {
                if (decisionsCache[selectorString] !== undefined) {
                  return decisionsCache[selectorString]
                }
                const keep = callback(selectorString)
                decisionsCache[selectorString] = keep
                return keep
              })
              if (keepValues.length) {
                // re-write the selector value
                child.prelude.value = keepValues.join(', ')
                return true
              } else {
                return false
              }
            } else if (child.type === 'Atrule' && child.name === 'media') {
              // recurse
              child.block.children = clean(child.block.children, callback)
              return child.block.children.length > 0
            }
            // The default is to keep it.
            return true
          })
        }

        ast.children = clean(ast.children, callback)
        return ast
      }

      const links = Array.from(document.querySelectorAll('link'))
      links
        .filter(link => {
          return (
            link.href &&
            (link.rel === 'stylesheet' ||
              link.href.toLowerCase().endsWith('.css')) &&
            !link.href.toLowerCase().startsWith('blob:') &&
            link.media !== 'print'
          )
        })
        .forEach(stylesheet => {
          if (stylesheetAstObjects[stylesheet.href]) {
            throw new Error(`${stylesheet.href} not in stylesheetAstObjects`)
          }
          if (!Object.keys(stylesheetAstObjects[stylesheet.href]).length) {
            // If the 'stylesheetAstObjects[stylesheet.href]' thing is an
            // empty object, simply skip this link.
            return
          }
          const ast = stylesheetAstObjects[stylesheet.href]
          cleanedStyles.push(cleaner(ast, checker))
        })
      stylesheetAstArray.forEach(ast => {
        cleanedStyles.push(cleaner(ast, checker))
      })

      return cleanedStyles

    }, stylesheetAstObjects, stylesheetAstArray)

    const allCleanedCSS = cleanedStyles.map(ast => {
      const cleanedAst = fromPlainObject(ast)
      return translate(cleanedAst)
    }).join('\n')
    let finalCss = collectImportantComments(allCleanedCSS)
    finalCss = minify(finalCss).css
    const shellHtml = `<style>${finalCss}</style>\n${htmlMinify(cleanedHtml)}`
    const returned = {
      html: rawHtml,
      shellHtml
    }
    return Promise.resolve(returned)
  }
  // TODO...
  async genScreenShot(url) {
    await this.initPage()
    await this.page.goto(url)
    /* 待优化 目前是拿到VP 然后设置VP 主要是 deviceScaleFactor */
    await this.makeSkeleton()
    const viewport = await this.page.viewport()
    viewport.deviceScaleFactor = 1
    await this.page.setViewport(viewport)
    const screenShotBuffer = await this.page.screenshot({
      type: 'png',
      fullPage: true,
    })
    return { screenShotBuffer }
  }

  closeBrowser() {
    this.browser && this.browser.close()
  }
}

module.exports = Skeleton
