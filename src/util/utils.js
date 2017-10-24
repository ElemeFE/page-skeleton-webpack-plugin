const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const promisefy = fn => (...args) => {
  return new Promise((resolve, reject) => {
    fn(...args, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

async function writeShell(pathname, html) {
  const templatesPath = path.resolve(__dirname, '../templates')
  const jsFilename = 'shell.js'
  const vueFilename = 'shell.vue'
  const jsDestPath = path.resolve(pathname, jsFilename)
  const vueDestPath = path.resolve(pathname, vueFilename)
  try {
    await promisefy(fs.copyFile)(path.resolve(templatesPath, jsFilename), jsDestPath)
    const vueTemplate = await promisefy(fs.readFile)(path.resolve(templatesPath, vueFilename), 'utf-8')
    const code = vueTemplate.replace(/\$\$html/g, html)
    await promisefy(fs.writeFile)(vueDestPath, code, 'utf-8')
  } catch(err) {
    log(err, 'error')
  }
}

function getSegment(html) {
  return html
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
    result = await promisefy(fs.readFile)(sourcePath, 'utf-8')
  } catch(err) {
    throw new Error(err)
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
  promisefy,
  addScriptTag,
  writeShell,
  getSegment,
  genScriptContent
}
