const fs = require('fs')
const path = require('path')

const skeleton = require('../index')
const url = 'http://h5.test.ele.me/limitbuy/#/home'

const option = {
  device: 'iPhone 6',
  defer: 5000,
  excludes: [],
  remove: ['.icon-wrapper', '.banner-title'],
  launch: {
    headless: false,
    executablePath: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
  }
};

(async function() {

  const { html } = await skeleton(url, option)
  const pathName = path.join(__dirname, '/market.html')
  fs.writeFile(pathName, html, 'utf8', err => {
    if (err) console.log(err)
  })

})()
.catch(console.log.bind(console))

