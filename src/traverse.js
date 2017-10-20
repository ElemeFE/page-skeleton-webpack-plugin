// return outerHTML
const imageTranslate = require('./imageTranslate')
const textTranslate = require('./textTranslate')

const { isBase64Img } = require('./util')

module.exports = all => {

  Array.from(all).forEach(ele => {
    if (ele.tagName === 'IMG' && !isBase64Img(ele)) {
      return imageTranslate(document, ele)
    }
    if (
      ele.childNodes
      && ele.childNodes.length === 1
      && ele.childNodes[0].nodeType === 3
      ) {
      return textTranslate(ele)
    }
  })

}
