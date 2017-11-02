'use strict'

const { promisify } = require('util')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const { minify } = require('html-minifier')

async function writeShell(pathname, html, options) {
  const { h5Only } = options
  const templatesPath = path.resolve(__dirname, '../templates')
  const jsFilename = 'shell.js'
  const vueFilename = 'shell.vue'
  const htmlFilename = 'shell.html'
  const jsDestPath = path.resolve(pathname, jsFilename)
  const vueDestPath = path.resolve(pathname, vueFilename)
  const htmlDestPath = path.resolve(pathname, htmlFilename)

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

async function insertScreenShotTpl(html) {
  const tplFilePath = path.resolve(__dirname, '../templates/screenShotTpl.html')
  const screenShotTemplate = await promisify(fs.readFile)(tplFilePath, 'utf-8')
  return screenShotTemplate.replace(/\$\$html/g, html)
}

function htmlMinify(html, options) {
  return options === false ? html : minify(html, options)
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
function addScriptTag(source, src) {
  const token = source.split('</body>')
  if (token.length < 2) return source
  const scriptTag = `<script type="text/javascript" src="${src}" defer></script>`
  return `${token[0]}${scriptTag}</body>${token[1]}`
}

function log(msg, type = 'log') {
  if (type === 'log') {
    return console.log(chalk.bold.blueBright(`[PSG] ${msg}`))
  }
  console[type](chalk.bold.redBright(msg))
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
  const cleaned = css.replace(/\/\*\![\s\S]*?\*\/\n*/gm, (match) => {
    once.add(match)
    return ''
  })
  const combined = Array.from(once)
  combined.push(cleaned)
  return combined.join('\n')
}

const getShellCode = async (pathname) => {
  const filename = 'shell.html'
  let code
  try {
    code = await promisify(fs.readFile)(path.resolve(pathname, filename), 'utf-8')
  } catch (err) {
    log('You do not has shell.html file now!')
    code = ''
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

module.exports = {
  log,
  sleep,
  promisify,
  sockWrite,
  addScriptTag,
  writeShell,
  insertScreenShotTpl,
  htmlMinify,
  getShellCode,
  genScriptContent,
  collectImportantComments
}
