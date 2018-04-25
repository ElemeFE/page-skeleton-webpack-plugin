const path = require('path')
const { promisify } = require('util')
const fs = require('fs')
const { assert } = require('chai')
const extraFs = require('fs-extra')
const sinon = require('sinon')

const {
  writeShell, htmlMinify, sleep,
  genScriptContent, addScriptTag,
  collectImportantComments,
  outputSkeletonScreen, addDprAndFontSize,
  sockWrite
} = require('../src/util/')

describe('utils in the project', () => {
  const filePath = path.resolve(__dirname, './temp')
  const outputPath = path.resolve(__dirname, './dist')
  const html = `
      <html>
        <head>
          <style>
            .sk {
              color: red;
            }
          </style>
        </head>
        <body>page skeleton</body>
      </html>
    `
  const routesData = {
    '/': {
      html
    },
    '/search': {
      html
    }
  }
  beforeEach(async function () {
    await extraFs.remove(filePath)
    await extraFs.remove(outputPath)
  })

  afterEach(async function () {
    await extraFs.remove(filePath)
    await extraFs.remove(outputPath)
  })
  // test `writeShell funciton`
  describe('the basic use of writeShell uitl', () => {
    it (`shold write "index.html" file`, async function () {
      await writeShell(routesData, { pathname: filePath, minify: false })
      const indexData = await promisify(fs.readFile)(path.resolve(filePath, './index.html'), 'utf-8')
      const searchData = await promisify(fs.readFile)(path.resolve(filePath, './search.html'), 'utf-8')
      assert.isOk(/page\sskeleton/.test(indexData) === true, 'expect index.html has the content of "page skeleton')
      assert.isOk(/page\sskeleton/.test(searchData) === true, 'expect search.html has the content of "page skeleton')
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
  describe(`the basic use of "outputSkeletonScreen"`, () => {
    const originalHtml = '<html><!-- shell --><html>'
    beforeEach(async () => {
      await writeShell(routesData, { pathname: filePath, minify: false })
    })

    it(`should get the code of "shell.html"`, async () => {
      await outputSkeletonScreen(originalHtml, { pathname: filePath, staticDir: outputPath, routes: Object.keys(routesData) }, console.log.bind(console))
      const files = await promisify(fs.readdir)(outputPath)
      assert.isTrue(files.length === Object.keys(routesData).length)
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
