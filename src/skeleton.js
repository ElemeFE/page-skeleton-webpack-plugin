'use strict'

const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const { parse, toPlainObject, fromPlainObject, generate } = require('css-tree')
const {
  sleep, genScriptContent,
  htmlMinify, collectImportantComments
} = require('./util/utils')

class Skeleton {
  constructor(options = {}) {
    this.options = options
    this.browser = null
    this.page = null
  }

  async initPage() {
    // close old browser and page.
    this.closeBrowser()

    const { device, headless, debug } = this.options
    const browser = await puppeteer.launch({ headless })
    const page = await browser.newPage()

    await page.emulate(devices[device])
    this.browser = browser
    this.page = page
    if (debug) {
      page.on('console', (...args) => {
        console.log(...args) // eslint-disable-line no-console
      })
    }

    return this.page
  }

  async makeSkeleton() {
    const { defer } = this.options
    const content = await genScriptContent()

    // `./util/headlessClient.js` 文件插入到 page 中
    await this.page.addScriptTag({ content })
    await sleep(defer)
    await this.page.evaluate(async (options) => {
      const { genSkeleton } = Skeleton
      genSkeleton(options)
    }, this.options)
  }

  async genHtml(url) {
    const stylesheetAstObjects = {}
    const stylesheetContents = {}

    const page = await this.initPage()
    const { cookies } = this.options

    await page.setRequestInterception(true)
    page.on('request', (request) => {
      if (stylesheetAstObjects[request.url]) {
        // don't need to download the same assets
        request.abort()
      } else {
        request.continue()
      }
    })
    // To build a map of all downloaded CSS (css use link tag)
    page.on('response', (response) => {
      const url = response.url() // eslint-disable-line no-shadow
      const ct = response.headers()['content-type'] || ''
      if (response.ok && !response.ok()) {
        throw new Error(`${response.status} on ${url}`)
      }

      if (ct.indexOf('text/css') > -1 || /\.css$/i.test(url)) {
        response.text().then((text) => {
          const ast = parse(text, {
            parseValue: false,
            parseRulePrelude: false
          })
          stylesheetAstObjects[url] = toPlainObject(ast)
          stylesheetContents[url] = text
        })
      }
    })
    page.on('pageerror', (error) => {
      throw error
    })

    try {
      if (cookies.length) {
        await page.setCookie(...cookies.filter(cookie => typeof cookie === 'object'))
      }
      const response = await page.goto(url, { waitUntil: 'networkidle2' })
      if (response && !response.ok()) {
        throw new Error(`${response.status} on ${url}`)
      }
    } catch (err) {
      console.log(err)
    }

    await this.makeSkeleton()

    const { rawHtml, styles, cleanedHtml } = await page.evaluate(async () => {
      const { getHtmlAndStyle } = Skeleton
      return getHtmlAndStyle()
    })

    const stylesheetAstArray = styles.map((style) => {
      const ast = parse(style, {
        parseValue: false,
        parseRulePrelude: false
      })
      return toPlainObject(ast)
    })

    const cleanedCSS = await page.evaluate(async (stylesheetAstObjects, stylesheetAstArray) => { // eslint-disable-line no-shadow
      const DEAD_OBVIOUS = new Set(['*', 'body', 'html'])
      const cleanedStyles = []

      const checker = (selector) => {
        if (DEAD_OBVIOUS.has(selector)) {
          return true
        }
        if (/:-(ms|moz)-/.test(selector)) {
          return true
        }
        if (/:{1,2}(before|after)/.test(selector)) {
          return true
        }
        try {
          const keep = !!document.querySelector(selector)
          return keep
        } catch (err) {
          const exception = err.toString()
          console.log(`Unable to querySelector('${selector}') [${exception}]`, 'error') // eslint-disable-line no-console
          return false
        }
      }

      const cleaner = (ast, callback) => {
        const decisionsCache = {}

        const clean = (children, cb) => children.filter((child) => {
          if (child.type === 'Rule') {
            const values = child.prelude.value.split(',').map(x => x.trim())
            const keepValues = values.filter((selectorString) => {
              if (decisionsCache[selectorString]) {
                return decisionsCache[selectorString]
              }
              const keep = cb(selectorString)
              decisionsCache[selectorString] = keep
              return keep
            })
            if (keepValues.length) {
              // re-write the selector value
              child.prelude.value = keepValues.join(', ')
              return true
            }
            return false
          } else if (child.type === 'Atrule' && child.name === 'media') {
            // recurse
            child.block.children = clean(child.block.children, cb)
            return child.block.children.length > 0
          }
          // The default is to keep it.
          return true
        })

        ast.children = clean(ast.children, callback)
        return ast
      }

      const links = Array.from(document.querySelectorAll('link'))

      links
        .filter(link => (
          link.href &&
            (link.rel === 'stylesheet' ||
              link.href.toLowerCase().endsWith('.css')) &&
            !link.href.toLowerCase().startsWith('blob:') &&
            link.media !== 'print'
        ))
        .forEach((stylesheet) => {
          if (!stylesheetAstObjects[stylesheet.href]) {
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
      stylesheetAstArray.forEach((ast) => {
        cleanedStyles.push(cleaner(ast, checker))
      })

      return cleanedStyles
    }, stylesheetAstObjects, stylesheetAstArray)

    const allCleanedCSS = cleanedCSS.map((ast) => {
      const cleanedAst = fromPlainObject(ast)
      return generate(cleanedAst)
    }).join('\n')

    const finalCss = collectImportantComments(allCleanedCSS)
    // finalCss = minify(finalCss).css ? `html-minifier` use `clean-css` as css minifier
    // so don't need to use another mimifier.
    let shellHtml = `<style>${finalCss}</style>\n${cleanedHtml}`
    shellHtml = htmlMinify(shellHtml, this.options.minify)
    const returned = {
      html: rawHtml,
      shellHtml
    }
    this.closeBrowser()
    return Promise.resolve(returned)
  }

  closeBrowser() {
    if (this.page) this.page.close()
    if (this.browser) this.browser.close()
  }
}

module.exports = Skeleton
