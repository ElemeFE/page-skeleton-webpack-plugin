
function isBase64Img(img) {
  return /base64/.test(img.src)
}

function getBase64(width, height, color) {
  const CANVAS_ID = '#pre-canvas'
  let canvas = document.querySelector(CANVAS_ID)
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.style.position = 'absolute'
    canvas.left = '-100000px'
    document.body.appendChild(canvas)
    canvas.id = CANVAS_ID
  }
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      var reader = new FileReader()
      if (blob) {
        reader.readAsDataURL(blob)
      } else {
        reject('toBlob fail')
      }
      reader.onloadend = function(){
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject()
      }
    }, 'image/jpeg', 1)
  })
}

function imgHandler(ele) {
  const IMG_COLOR = '#EFEFEF'
  const { width, height } = ele.getBoundingClientRect()
  if (width === 0 || height === 0) return Promise.resolve()
  return new Promise((resolve, reject) => {
    getBase64(width, height, IMG_COLOR)
    .then(base64 => {
      ele.src = base64
      resolve()
    })
    .catch(err => {
      resolve()
    })
  })
}

function textHandler(ele) {
  const TEXT_COLOR = '#EEEEEE'
  const { width } = ele.getBoundingClientRect()
  // 宽度小于 50 的元素就不做阴影处理
  if (width <= 50) {
    return setOpacity(ele)
  }
  const comStyle = window.getComputedStyle(ele)
  const { lineHeight, paddingTop, paddingRight, paddingBottom, position: opos, fontSize } = comStyle
  const position = ['fixed', 'absolute', 'flex'].find(p => p === opos) ? opos : 'relative'
  const height = ele.offsetHeight
  const lineCount = height / lineHeight | 0 // 向下取整
  let textHeightRatio = parseInt(fontSize, 10) / parseInt(lineHeight, 10)
  if (Number.isNaN(textHeightRatio)) {
    textHeightRatio = 1 / 1.4
  }
  Object.assign(ele.style, {
    backgroundImage: `linear-gradient(
      transparent ${(1 - textHeightRatio) / 2 * 100}%,
      ${TEXT_COLOR} 0%,
      ${TEXT_COLOR} ${((1 - textHeightRatio) / 2 + textHeightRatio) * 100}%,
      transparent 0%)`,
    backgroundSize: `100% ${lineHeight}px`,
    backgroundClip: 'content-box',
    backgroundPositionY: paddingTop,
    position
  })
  // add white mask
  if (lineCount > 1) {
    const div = document.createElement('div')

    Object.assign(div.style, {
      width: '50%',
      height: lineHeight,
      background: '#fff',
      position: 'absolute',
      right: paddingRight,
      bottom: paddingBottom
    })

    ele.appendChild(div)        
  }

}
/**
 * [buttonHandler 改变 button 元素样式：包括去除 border和 box-shadow, 背景色和文字颜色统一]
 */
function buttonHandler(ele) {
  const BUTTON_COLOR = '#EFEFEF'
  Object.assign(ele.style, {
    color: BUTTON_COLOR,
    background: BUTTON_COLOR,
    border: 'none',
    boxShadow: 'none'
  })
}

function backgroundImageHandler(ele) {
  const BACK_COLOR = '#EFEFEF'
  ele.style.background = BACK_COLOR
}

function transparent(ele) {
  ele.style.color = 'transparent'
}

function setOpacity(ele) {
  ele.style.opacity = 0
}

function listHandle(ele) {
  const children = ele.children
  const len = children.length
  const firstChild = children[0]
  // 解决有时ul元素子元素不是 li元素的 bug。
  if (firstChild.tagName !== 'LI') return listHandle(firstChild)
  Array.from(children).forEach((c, i) => {
    if (i > 0) c.parentNode.removeChild(c)
  })
  for(let i = 1; i < len; i++) {
    ele.appendChild(firstChild.cloneNode(true))
  }
}

function traverse(ele, excludesEle) {
  const EXT_REG = /jpeg|png|gif|svg/
  const texts = []
  const buttons = []
  const hasImageBackEles = []
  const imgs = [];
  (function preTraverse(ele) {
    const styles = window.getComputedStyle(ele)
    if (~excludesEle.indexOf(ele)) return false
    if (ele.children.length > 0 && /UL|OL/.test(ele.tagName)) {
      listHandle(ele)
    }
    if (ele.children && ele.children.length > 0) {
      Array.from(ele.children).forEach(child => preTraverse(child))
    }

    // 将所有拥有 textChildNode 子元素的元素的文字颜色设置成背景色，这样就不会在显示文字了。
    if (ele.childNodes && Array.from(ele.childNodes).some(n => n.nodeType === 3)) {
      transparent(ele)
    }
    // 隐藏所有 svg 元素
    if (ele.tagName === 'svg') {
      return setOpacity(ele)
    }
    if (EXT_REG.test(styles.background) || EXT_REG.test(styles.backgroundImage)) {
      return hasImageBackEles.push(ele)
    }
    if (ele.tagName === 'IMG' && !isBase64Img(ele)) {
      return imgs.push(ele)
    }
    if (ele.nodeType === 1 && ele.tagName === 'BUTTON') {
      return buttons.push(ele)
    }
    if (
      ele.childNodes
      && ele.childNodes.length === 1
      && ele.childNodes[0].nodeType === 3
      ) {
      return texts.push(ele)
    }

  })(ele)

  texts.forEach(ele => textHandler(ele))
  buttons.forEach(ele => buttonHandler(ele))
  hasImageBackEles.forEach(ele => backgroundImageHandler(ele))
  return Promise.all(imgs.map(ele => imgHandler(ele)))
}

module.exports = [
  getBase64,
  listHandle,
  setOpacity,
  transparent,
  isBase64Img,
  imgHandler,
  textHandler,
  traverse,
  buttonHandler,
  backgroundImageHandler
]