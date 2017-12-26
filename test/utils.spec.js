const path = require('path')
const { promisify } = require('util')
const fs = require('fs')
const { assert } = require('chai')
const extraFs = require('fs-extra')
const sinon = require('sinon')

const {
  writeShell, htmlMinify, sleep,
  genScriptContent, addScriptTag,
  log, collectImportantComments,
  getShellCode, addDprAndFontSize,
  sockWrite
} = require('../src/util/utils')

describe('utils in the project', () => {
  const filePath = path.resolve(__dirname, './temp')
  const html = `
      <html>
        <body>page skeleton</body>
      </html>
    `
  beforeEach(async function () {
    await extraFs.remove(filePath)
  })

  afterEach(async function () {
    await extraFs.remove(filePath)
  })
  // test `writeShell funciton`
  describe('the basic use of writeShell uitl', () => {
    it (`shold write "shell.html" file when use in non-h5 project`, async function () {
      await writeShell(filePath, html, { h5Only: false })
      const data = await promisify(fs.readFile)(path.resolve(filePath, './shell.html'), 'utf-8')
      assert.isOk(/page\sskeleton/.test(data) === true, 'expect shell.html has the content of "page skeleton')
    })

    it (`shold write "shell.vue" and "shell.js" file in the destination directory`, async function () {
      await writeShell(filePath, html, { h5Only: true })
      const files = await promisify(fs.readdir)(filePath)
      assert.lengthOf(files, 2, 'temp directory should has two files')
    })
  })
  // test `htmlMinify` function
  describe(`the basic use of 'htmlMinify'`, () => {
    const html = `
      <div class="page-skeleton">page skeleton</div>
      <!-- comment -->
    `
    const option = {
      minifyCSS: { level: 2 },
      removeComments: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: false
    }
    it('shoud minify the html', () => {
      const minifiedHtml = htmlMinify(html, option)
      assert.isOk(/class=page-skeleton/.test(minifiedHtml))
      assert(/comment/.test(minifiedHtml) !== true)
    })
  })
  // test `sleep` function
  describe(`the basic use of sleep`, () => {
    it(`when use of "sleep" funciton, the promise will be resolve after specifical duration`, async () => {
      const start = +new Date()
      const duration = 500
      await sleep(duration)
      assert(+new Date() - start >= duration)
    })
  })
  // test `genScriptContent` function
  describe(`the basic use of 'genScriptContent', which used to get the script content`, () => {
    it(`should return the content of the "headlessClient.js" file`, async () => {
      const content  = await genScriptContent()
      assert.typeOf(content, 'string')
    })
  })
  // addScriptTag
  describe(`the basic use of "addScriptTag", which used to add script tag to html`, () => {
    it(`should return the html string which contains the newly script tag`, () => {
      const source = `
        <html>
          <body>page skeleton</body>
        </html>
      `
      const sourceWithoutBody = `
        <html>
          <div>page skeleton</div>
        </html>
      `
      const result = addScriptTag(source, 'http://www.test.com/cdn')
      const negResult = addScriptTag(sourceWithoutBody, 'http://www.test.com/cdn')

      assert.isOk(/script/.test(result))
      assert.isOk(/www\.test\.com/.test(result))
      assert.isFalse(/script/.test(negResult))
    })
  })
  // test `log` function
  describe(`the basic use of log function`, () => {
    let message = 'page skeleton'
    let logSpy
    let errorSpy
    let warnSpy
    let infoSpy

    beforeEach(() => {
      logSpy = sinon.spy(console, 'log')
      errorSpy = sinon.spy(console, 'error')
      warnSpy = sinon.spy(console, 'warn')
      infoSpy = sinon.spy(console, 'info')
    })

    afterEach(() => {
      console.log.restore()
      console.error.restore()
      console.warn.restore()
      console.info.restore()
      message = ''
    })

    it(`shoud be found the "console.log" method called`, () => {
      log(message)
      assert.isTrue(logSpy.calledOnce)
      assert.isTrue(new RegExp(message).test(logSpy.getCall(0).args[0]), `the argument should be equal to ${message}`)
    })
    it(`shoud be found the "console.error" method called`, () => {
      log('page skeleton', 'error')
      assert.isTrue(errorSpy.calledOnce)
    })
    it(`shoud be found the "console.warn" method called`, () => {
      log('page skeleton', 'warn')
      assert.isTrue(warnSpy.calledOnce)
    })
    it(`shoud be found the "console.info" method called`, () => {
      log('page skeleton', 'info')
      assert.isTrue(infoSpy.calledOnce)
    })
  })
  // test 'collectImportantComments' function
  describe(`the basic use of "collectImportantComments"`, () => {
    it(`should collect the "import comments" in the css, and return it.`, () => {
      const testCss = `
        /*! important1 */
        .test {
          color: red;
        }
        /*! important2 */
        .another-test {
          background: rgba(0, 0, 0, .4);
        }
      `
      const result = collectImportantComments(testCss)
      assert.isTrue(/\/\*\!\simportant1\s\*\/\n\/\*\!\simportant2\s\*\//.test(result))
    })
  })
  // test `getShellCode` function
  describe(`the basic use of "getShellCode"`, () => {
    let logSpy
    beforeEach(async () => {
      logSpy = sinon.spy(console, 'log')
      await writeShell(filePath, html, { h5Only: false })
    })
    afterEach(() => {
      console.log.restore()
    })
    it(`should get the code of "shell.html"`, async () => {
      const code = await getShellCode(filePath)
      assert.isTrue(/page\sskeleton/.test(code))
    })
    it(`should get nothing when the "filePath" is wrong`, async () => {
      const wrongPath = './wrong'
      const code = await getShellCode(wrongPath)
      assert.equal(code, '')
      assert.isTrue(logSpy.calledOnce)
    })
  })
  // test `addDprAndFontSize` function
  describe(`the basic use of addDprAndFontSize`, () => {
    it(`should add "dpr" and "fontsize to the html`, () => {
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Page Skeleton</title>
        </head>
        <body>
          <div>test page skeleton</div>
        </body>
        </html>
      `
      const alreadyHasFontSize = `
        <!DOCTYPE html>
        <html lang="en" style="font-size: 68px;" data-dpr="2">
        <head>
          <meta charset="UTF-8">
          <title>Page Skeleton</title>
        </head>
        <body>
          <div>test page skeleton</div>
        </body>
        </html>
      `
      const result = addDprAndFontSize(html)
      const result2 = addDprAndFontSize(alreadyHasFontSize)

      assert.isTrue(/124\.2px/.test(result))
      assert.isTrue(/data\-dpr/.test(result))
      assert.isTrue(/124\.2px/.test(result2))
      assert.isTrue(/data\-dpr/.test(result2))
    })
  })
  // test `sockWrite` function
  describe(`the basic use of sockWrite`, () => {
    const write = sinon.spy()
    const mockSocket = {
      write
    }
    it(`should test the "socket" write method will be called`, () => {
      sockWrite([mockSocket], 'test', 'page skeleton')
      assert.isTrue(write.calledOnce)
      assert.equal(write.getCall(0).args, '{"type":"test","data":"page skeleton"}')
    })
  })
})
