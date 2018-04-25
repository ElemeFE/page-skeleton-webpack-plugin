'use strict'

const { promisify } = require('util')
const fs = require('fs')
const os = require('os')
const path = require('path')
const fse = require('fs-extra')
const weblog = require('webpack-log')
const QRCode = require('qrcode')
const { minify } = require('html-minifier')
const { html2json, json2html } = require('html2json')
const htmlBeautify = require('js-beautify').html_beautify
const { htmlBeautifyConfig } = require('../config/config')

const getCleanedShellHtml = (html) => {
  const STYLE_REG = /<style>[\s\S]+?<\/style>/
  const BODY_REG = /<body>([\s\S]+?)<\/body>/
  const css = STYLE_REG.exec(html)[0]
  const cleanHtml = BODY_REG.exec(html)[1]
  return `${css}\n${cleanHtml}`
}

function htmlMinify(html, options) {
  return options === false ? htmlBeautify(html, htmlBeautifyConfig) : minify(html, options)
}

async function writeShell(routesData, options) {
  const { pathname, minify: minOptions } = options
  return Promise.all(Object.keys(routesData).map(async (route) => {
    const html = routesData[route].html
    const minifiedHtml = htmlMinify(getCleanedShellHtml(html), minOptions)
    const trimedRoute = route.replace(/\//g, '')
    const filePath = path.join(pathname, trimedRoute ? `${trimedRoute}.html` : 'index.html')
    await fse.ensureDir(pathname)
    await promisify(fs.writeFile)(filePath, minifiedHtml, 'utf-8')
    return Promise.resolve()
  }))
}

function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

async function genScriptContent() {
  const sourcePath = path.resolve(__dirname, '../script/index.js')
  const result = await promisify(fs.readFile)(sourcePath, 'utf-8')
  return result
}
// add script tag into html string, just as document.body.appendChild(script)
function addScriptTag(source, src, port) {
  const token = source.split('</body>')
  if (token.length < 2) return source
  const scriptTag = `
    <script>
      window._pageSkeletonSocketPort = ${port}
    </script>
    <script type="text/javascript" src="${src}" defer></script>
    `
  return `${token[0]}${scriptTag}</body>${token[1]}`
}

function createLog(options) {
  let logLevel = options.logLevel || 'info'
  if (options.quiet === true) {
    logLevel = 'silent'
  }
  if (options.noInfo === true) {
    logLevel = 'warn'
  }

  return weblog({
    level: logLevel,
    name: 'pswp',
    timestamp: options.logTime
  })
}

/**
 * original author: pepterbe(https://github.com/peterbe/minimalcss)
 * Take call "important comments" and extract them all to the
 * beginning of the CSS string.
 * This makes it possible to merge when minifying across blocks of CSS.
 * For example, if you have (ignore the escaping for the sake of demonstration):
 *
 *   /*! important 1 *\/
 *   p { color: red; }
 *   /*! important 2 *\/
 *   p { background-color: red; }
 *
 * You can then instead get:
 *
 *   /*! important 1 *\/
 *   /*! important 2 *\/
 *   p { color: red; background-color: red; }
 *
 * @param {string} css
 * @return {string}
 */
const collectImportantComments = (css) => {
  const once = new Set()
  const cleaned = css.replace(/(\/\*![\s\S]*?\*\/)\n*/gm, (match, p1) => {
    once.add(p1)
    return ''
  })
  const combined = Array.from(once)
  combined.push(cleaned)
  return combined.join('\n')
}

// const getShellCode = async (pathname) => {
//   const FILE_NAME = 'index.html'
//   const code = await promisify(fs.readFile)(path.resolve(pathname, FILE_NAME), 'utf-8')
//   return code
// }

const outputSkeletonScreen = async (originHtml, options, log) => {
  const { pathname, staticDir, routes } = options
  return Promise.all(routes.map(async (route) => {
    const trimedRoute = route.replace(/\//g, '')
    const filePath = path.join(pathname, trimedRoute ? `${trimedRoute}.html` : 'index.html')
    const html = await promisify(fs.readFile)(filePath, 'utf-8')
    const finalHtml = originHtml.replace('<!-- shell -->', html)
    const outputDir = path.join(staticDir, route)
    const outputFile = path.join(outputDir, 'index.html')
    await fse.ensureDir(outputDir)
    await promisify(fs.writeFile)(outputFile, finalHtml, 'utf-8')
    log(`write ${outputFile} successfully in ${route}`)
    return Promise.resolve()
  }))
}

// Server 端主动推送消息到制定 socket
const sockWrite = (sockets, type, data) => {
  sockets.forEach((sock) => {
    sock.write(JSON.stringify({
      type, data
    }))
  })
}

const addDprAndFontSize = (html) => {
  const json = html2json(html)
  const rootElement = json.child.filter(c => c.tag === 'html')[0]
  const oriAttr = rootElement.attr
  const style = oriAttr.style || []
  const index = style.indexOf('font-size:')
  if (index > -1) {
    style[index + 1] = '124.2px;'
  } else {
    style.push('font-size:')
    style.push('124.2px;')
  }
  const rootAttr = Object.assign(oriAttr, {
    'data-dpr': '3',
    style
  })
  rootElement.attr = rootAttr
  return json2html(json)
}

const generateQR = async (text) => {
  try {
    return await QRCode.toDataURL(text)
  } catch (err) {
    return Promise.reject(err)
  }
}

const getLocalIpAddress = () => {
  const interfaces = os.networkInterfaces()
  for (const devName in interfaces) { // eslint-disable-line guard-for-in
    const iface = interfaces[devName]
    for (const alias of iface) {
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}

module.exports = {
  createLog,
  sleep,
  sockWrite,
  addScriptTag,
  generateQR,
  writeShell,
  htmlMinify,
  outputSkeletonScreen,
  genScriptContent,
  addDprAndFontSize,
  getLocalIpAddress,
  collectImportantComments
}
