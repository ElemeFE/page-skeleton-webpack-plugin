'use strict'

const { promisify } = require('util')
const fs = require('fs')
const os = require('os')
const path = require('path')
const fse = require('fs-extra')
const QRCode = require('qrcode')
const chalk = require('chalk')
const { minify } = require('html-minifier')
const { html2json, json2html } = require('html2json')
const htmlBeautify = require('js-beautify').html_beautify

const { htmlBeautifyConfig } = require('../config/config')

async function writeShell(pathname, html, options) {
  const { h5Only } = options
  const templatesPath = path.resolve(__dirname, '../templates')
  const jsFilename = 'shell.js'
  const vueFilename = 'shell.vue'
  const htmlFilename = 'shell.html'
  const jsDestPath = path.resolve(pathname, jsFilename)
  const vueDestPath = path.resolve(pathname, vueFilename)
  const htmlDestPath = path.resolve(pathname, htmlFilename)
  try {
    await fse.ensureDir(pathname)
  } catch (err) {
    log(err)
  }

  if (!h5Only) {
    await promisify(fs.writeFile)(htmlDestPath, html, 'utf-8')
    return Promise.resolve()
  }

  try {
    await fse.copy(path.resolve(templatesPath, jsFilename), jsDestPath)
    const vueTemplate = await promisify(fs.readFile)(path.resolve(templatesPath, vueFilename), 'utf-8')
    const code = vueTemplate.replace(/\$\$html/g, html)
    await promisify(fs.writeFile)(vueDestPath, code, 'utf-8')
  } catch (err) {
    log(err, 'error')
  }
}

function htmlMinify(html, options) {
  return options === false ? htmlBeautify(html, htmlBeautifyConfig) : minify(html, options)
}

function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

async function genScriptContent() {
  const sourcePath = path.resolve(__dirname, './headlessClient.js')
  let result
  try {
    result = await promisify(fs.readFile)(sourcePath, 'utf-8')
  } catch (err) {
    log(err, 'error')
  }
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
/* eslint-disable no-console */
function log(msg, type = 'log') {
  if (type === 'log') {
    return console.log(chalk.bold.blueBright(`[PSG] ${msg}`))
  }
  console[type](chalk.bold.redBright(msg))
}
/* eslint-enable no-console */
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

const getShellCode = async (pathname) => {
  const FILE_NAME = 'shell.html'
  let code = ''
  try {
    code = await promisify(fs.readFile)(path.resolve(pathname, FILE_NAME), 'utf-8')
  } catch (err) {
    log(`You do not has ${FILE_NAME} file now!`)
  }
  return code
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
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    for (const alias of iface) {
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}

module.exports = {
  log,
  sleep,
  sockWrite,
  addScriptTag,
  generateQR,
  writeShell,
  htmlMinify,
  getShellCode,
  genScriptContent,
  addDprAndFontSize,
  getLocalIpAddress,
  collectImportantComments
}
