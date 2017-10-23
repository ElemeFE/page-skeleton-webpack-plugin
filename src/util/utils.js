const fs = require('fs')
const path = require('path')

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
    console.log(err)
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

module.exports = {
  sleep,
  promisefy,
  writeShell,
  getSegment
  genScriptContent
}
