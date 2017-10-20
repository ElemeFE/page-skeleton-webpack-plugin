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
  genScriptContent
}
