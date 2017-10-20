const fs = require('fs')
const path = require('path')

const { skeleton } = require('../index')
const url = 'http://h5.test.ele.me/limitbuy/#/home'

const option = {
  device: 'iPhone 6 Plus',
  defer: 5000,
  excludes: ['.app-header'],
  remove: ['.icon-wrapper', '.unlogin-container_1Kyfq_0', '.main-wrapper_2p2-E_0'],
  hide: ['.remain-bar'],
  launch: {
    headless: false,
    executablePath: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
  }
};

(async function() {

  const { html } = await skeleton(url, option)
  const pathName = path.join(__dirname, '/index.html')
  fs.writeFile(pathName, html, 'utf8', err => {
    if (err) console.log(err)
  })

})()
.catch(console.log.bind(console))

