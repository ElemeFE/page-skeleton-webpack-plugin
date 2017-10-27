const { promisify } = require('util')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const { minify } = require('html-minifier')

async function writeShell(pathname, html) {
  const templatesPath = path.resolve(__dirname, '../templates')
  const jsFilename = 'shell.js'
  const vueFilename = 'shell.vue'
  const jsDestPath = path.resolve(pathname, jsFilename)
  const vueDestPath = path.resolve(pathname, vueFilename)
  try {
    await fse.copy(path.resolve(templatesPath, jsFilename), jsDestPath)
    const vueTemplate = await promisify(fs.readFile)(path.resolve(templatesPath, vueFilename), 'utf-8')
    const code = vueTemplate.replace(/\$\$html/g, html)
    await promisify(fs.writeFile)(vueDestPath, code, 'utf-8')
  } catch(err) {
    log(err, 'error')
  }
}

async function insertScreenShotTpl(html) {
  const tplFilePath = path.resolve(__dirname, '../templates/screenShotTpl.html')
  const screenShotTemplate = await promisify(fs.readFile)(tplFilePath, 'utf-8')
  return screenShotTemplate.replace(/\$\$html/g, html)
}

function htmlMinify(html) {
  const minHtml = minify(html, {
    minifyCSS: true,
    removeComments: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true
  })
  return minHtml
    .replace(/(<html[^>]*>|<\/html>)/g, '')
    .replace(/(<body[^>]*>|<\/body>)/g, '')
    .replace(/(<head>|<\/head>)/g, '')
}

function sleep(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}

async function genScriptContent() {
  const sourcePath = path.resolve(__dirname, './headlessClient.js')
  let result
  try {
    result = await promisify(fs.readFile)(sourcePath, 'utf-8')
  } catch(err) {
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

module.exports = {
  log,
  sleep,
  promisify,
  addScriptTag,
  writeShell,
  insertScreenShotTpl,
  htmlMinify,
  genScriptContent
}
