/**
 * this file's centent will be insert into the page which headless Chrome open.
 * and will be exec in browser environment. 
 */
// TODO: IF this file is more than 500 lines, pls split it into modules, and use
// webpack packup it.
/**
 * get the output html source code,
 * this function return a promise, and the `html` will be resolve
 */
const getOutHtml = (function (document) {

  /**
   * 常量
   */
  // const CANVAS_ID = 'pre-canvas'
  const IMG_COLOR = '#EFEFEF'
  const TEXT_COLOR = '#EEEEEE'
  const BUTTON_COLOR = '#EFEFEF'
  const BACK_COLOR = '#EFEFEF'
  const TRANSPARENT = 'transparent'
  const EXT_REG = /jpeg|png|gif|svg/
  const removedTags = ['script', 'link', 'title', 'svg']
  const CONSOLE_CLASS = '.sk-console'
  const SMALLEST_BASE64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

  const $$ = document.querySelectorAll.bind(document)
  const isBase64Img = img => /base64/.test(img.src)

  const setAttributes = (ele, attrs) => {
    Object.keys(attrs).forEach(k => ele.setAttribute(k, attrs[k]))
  }

  const inViewPort = function(ele) {
    const rect = ele.getBoundingClientRect()
    return rect.top < window.innerHeight
      && rect.left < window.innerWidth
  }

  function imgHandler(ele) {
    const { width, height } = ele.getBoundingClientRect()
    const attrs = {
      width,
      height,
      src: SMALLEST_BASE64,
      style: `background: ${IMG_COLOR}`
    }
    setAttributes(ele, attrs)
    if (ele.hasAttribute('alt')) {
      ele.removeAttribute('alt')
    }
  }

  function textHandler(ele) {
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
      backgroundColor: TRANSPARENT,
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
    Object.assign(ele.style, {
      color: BUTTON_COLOR,
      background: BUTTON_COLOR,
      border: 'none',
      boxShadow: 'none'
    })
  }

  function backgroundImageHandler(ele) {
    ele.style.background = BACK_COLOR
  }
  /**
   * [transparent 设置元素字体颜色为透明，必要情况下，设置其 textDecorationColor 也为透明色]
   */
  function transparent(ele) {
    ele.style.color = TRANSPARENT
    const styles = getComputedStyle(ele)
  }

  function setOpacity(ele) {
    ele.style.opacity = 0
  }

  function listHandle(ele) {
    const children = ele.children
    const len = children.length
    if (len === 0) return false
    const firstChild = children[0]
    // 解决有时ul元素子元素不是 li元素的 bug。
    if (firstChild.tagName !== 'LI') return listHandle(firstChild)
    Array.from(children).forEach((c, i) => {
      if (i > 0) c.parentNode.removeChild(c)
    })
    // 将 li 所有兄弟元素设置成相同的元素，保证生成的页面骨架整齐
    for(let i = 1; i < len; i++) {
      ele.appendChild(firstChild.cloneNode(true))
    }
  }

  function removeHandler(ele) {
    const parent = ele.parentNode
    parent && parent.removeChild(ele)
  }

  function traverse(ele, excludesEle) {
    const texts = []
    const buttons = []
    const hasImageBackEles = []
    const toRemove = []
    const imgs = [];
    (function preTraverse(ele) {
      const styles = window.getComputedStyle(ele)
      const lowerTagName = ele.tagName.toLowerCase()
      if (
          ~removedTags.indexOf(lowerTagName)
          || !inViewPort(ele)
        ) {
        return toRemove.push(ele)
      }
      if (~excludesEle.indexOf(ele)) return false
      if (ele.children.length > 0 && /UL|OL/.test(ele.tagName)) {
        listHandle(ele)
      }
      if (ele.children && ele.children.length > 0) {
        Array.from(ele.children).forEach(child => preTraverse(child))
      }

      // 将所有拥有 textChildNode 子元素的元素的文字颜色设置成背景色，这样就不会在显示文字了。
      if (ele.childNodes && Array.from(ele.childNodes).some(n => n.nodeType === Node.TEXT_NODE)) {
        transparent(ele)
      }
      if (!/none/.test(styles.textDecorationLine)) {
        ele.style.textDecorationColor = TRANSPARENT
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
      if (ele.nodeType === Node.ELEMENT_NODE && ele.tagName === 'BUTTON') {
        return buttons.push(ele)
      }
      if (
        ele.childNodes
        && ele.childNodes.length === 1
        && ele.childNodes[0].nodeType === Node.TEXT_NODE
        ) {
        return texts.push(ele)
      }

    })(ele)

    toRemove.forEach(ele => removeHandler(ele))
    texts.forEach(ele => textHandler(ele))
    buttons.forEach(ele => buttonHandler(ele))
    hasImageBackEles.forEach(ele => backgroundImageHandler(ele))
    imgs.map(ele => imgHandler(ele))
  }

  function getOutHtml(remove, excludes, hide) {
    // 将 `remove` 队列中的元素删除
    if (Array.isArray(remove)) {
      remove.push(CONSOLE_CLASS)
      const removeEle = $$(remove.join(','))
      Array.from(removeEle).forEach(ele => ele.parentNode.removeChild(ele))
    }
    // 将 `hide` 队列中的元素通过调节透明度为 0 来进行隐藏
    if (hide.length) {
      const hideEle = $$(hide.join(','))
      Array.from(hideEle).forEach(ele => ele.style.opacity = 0)
    }

    const excludesEle = excludes.length ? Array.from($$(excludes.join(','))) : []
    const root = document.documentElement
    traverse(root, excludesEle)
    return root.outerHTML
  }

  return getOutHtml

})(document)
