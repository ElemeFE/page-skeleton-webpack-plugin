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

'use strict'

const { getComputedStyle, Node } = window
const Skeleton = (function skeleton(document) {
  /**
   * constants
   */
  const TRANSPARENT = 'transparent'
  const EXT_REG = /\.(jpeg|jpg|png|gif|svg|webp)/
  const GRADIENT_REG = /gradient/
  const DISPLAY_NONE = /display:\s*none/
  // 插件客户端界面的 className
  const CONSOLE_CLASS = '.sk-console'
  const PRE_REMOVE_TAGS = ['script']
  const AFTER_REMOVE_TAGS = ['title', 'meta', 'style']
  const SKELETON_STYLE = 'skeleton-style'
  const CLASS_NAME_PREFEX = 'sk-'
  // 最小 1 * 1 像素的透明 gif 图片
  const SMALLEST_BASE64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  const MOCK_TEXT_ID = 'skeleton-text-id'
  /**
   * utils
   */
  const $$ = document.querySelectorAll.bind(document)
  const $ = document.querySelector.bind(document)
  const isBase64Img = img => /base64/.test(img.src)

  const setAttributes = (ele, attrs) => {
    Object.keys(attrs).forEach(k => ele.setAttribute(k, attrs[k]))
  }

  const genClassName = () => `${CLASS_NAME_PREFEX}${Math.random().toString(32).slice(2)}`
  const PSEUDO_CLASS = genClassName()
  const inViewPort = (ele) => {
    const rect = ele.getBoundingClientRect()
    return rect.top < window.innerHeight
      && rect.left < window.innerWidth
  }

  const checkHasPseudoEle = (ele) => {
    const hasBefore = getComputedStyle(ele, '::before').getPropertyValue('content') !== ''
    const hasAfter = getComputedStyle(ele, '::after').getPropertyValue('content') !== ''
    if (hasBefore || hasAfter) {
      return { hasBefore, hasAfter, ele }
    }
    return false
  }

  const checkHasBorder = (styles) => styles.getPropertyValue('border-style') !== 'none'

  const checkHasTextDecoration = (styles) => !/none/.test(styles.textDecorationLine)

  const px2rem = px => {
    const pxValue = typeof px === 'string' ? parseInt(px, 10) : px
    const htmlElementFontSize = getComputedStyle(document.documentElement).fontSize

    return `${(pxValue / parseInt(htmlElementFontSize, 10))}rem`
  }

  const getTextWidth = (text, style) => {
    let offScreenParagraph = document.querySelector(`#${MOCK_TEXT_ID}`)
    if (!offScreenParagraph) {
      const wrapper = document.createElement('p')
      offScreenParagraph = document.createElement('span')
      Object.assign(wrapper.style, {
        width: '10000px'
      })
      offScreenParagraph.id = MOCK_TEXT_ID
      wrapper.appendChild(offScreenParagraph)
      document.body.appendChild(wrapper)
    }
    Object.assign(offScreenParagraph.style, style)
    offScreenParagraph.textContent = text
    return offScreenParagraph.getBoundingClientRect().width
  }

  function addTextMask (paragraph, { textAlign, lineHeight, paddingBottom, paddingLeft, paddingRight }, maskWidthPercent = 0.5) {
    let left
    let right
    switch (textAlign) {
      case 'center':
        left = document.createElement('span')
        right = document.createElement('span')
        ;[left, right].forEach(mask => {
          Object.assign(mask.style, {
            display: 'inline-block',
            width: `${maskWidthPercent / 2 * 100}%`,
            height: lineHeight,
            background: '#fff',
            position: 'absolute',
            bottom: paddingBottom
          })
        })
        left.style.left = paddingLeft
        right.style.right = paddingRight
        paragraph.appendChild(left)
        paragraph.appendChild(right)
        break
      case 'right':
        left = document.createElement('span')
        Object.assign(left.style, {
          display: 'inline-block',
          width: `${maskWidthPercent * 100}%`,
          height: lineHeight,
          background: '#fff',
          position: 'absolute',
          bottom: paddingBottom,
          left: paddingLeft
        })
        paragraph.appendChild(left)
        break
      case 'left':
      default:
        right = document.createElement('span')
        Object.assign(right.style, {
          display: 'inline-block',
          width: `${maskWidthPercent * 100}%`,
          height: lineHeight,
          background: '#fff',
          position: 'absolute',
          bottom: paddingBottom,
          right: paddingRight
        })
        paragraph.appendChild(right)
        break
    }
  }

  function textHandler(ele, { color }) {
    const { width } = ele.getBoundingClientRect()
    // 宽度小于 50 的元素就不做阴影处理
    if (width <= 50) {
      return setOpacity(ele)
    }
    const comStyle = window.getComputedStyle(ele)
    const text = ele.textContent
    let {
      lineHeight,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      position: pos,
      fontSize,
      textAlign,
      wordSpacing,
      wordBreak
    } = comStyle
    if (!/\d/.test(lineHeight)) {
      const fontSizeNum = parseInt(fontSize, 10) || 14
      lineHeight = `${fontSizeNum * 1.4}px`
    }
    const position = ['fixed', 'absolute', 'flex'].find(p => p === pos) ? pos : 'relative'

    const height = ele.offsetHeight
    // 向下取整
    const lineCount = (height - parseInt(paddingTop, 10) - parseInt(paddingBottom, 10)) / parseInt(lineHeight, 10) | 0 // eslint-disable-line no-bitwise

    let textHeightRatio = parseInt(fontSize, 10) / parseInt(lineHeight, 10)
    if (Number.isNaN(textHeightRatio)) {
      textHeightRatio = 1 / 1.4 // default number
    }
    /* eslint-disable no-mixed-operators */
    Object.assign(ele.style, {
      backgroundImage: `linear-gradient(
        transparent ${(1 - textHeightRatio) / 2 * 100}%,
        ${color} 0%,
        ${color} ${((1 - textHeightRatio) / 2 + textHeightRatio) * 100}%,
        transparent 0%)`,
      backgroundOrigin: 'content-box',
      backgroundSize: `100% ${px2rem(lineHeight)}`,
      backgroundClip: 'content-box',
      backgroundColor: 'transparent',
      position,
      color: 'transparent',
      backgroundRepeatX: 'no-repeat'
    })
    /* eslint-enable no-mixed-operators */
    // add white mask
    if (lineCount > 1) {
      addTextMask(ele, comStyle)
    } else {
      const textWidth = getTextWidth(text, { fontSize, lineHeight, wordBreak, wordSpacing })
      const textWidthPercent = textWidth / (width - parseInt(paddingRight, 10) - parseInt(paddingLeft, 10))
      ele.style.backgroundSize = `${textWidthPercent * 100}% ${px2rem(lineHeight)}`
      switch (textAlign) {
        case 'left': // do nothing
          break
        case 'center':
          ele.style.backgroundPositionX = '50%'
          break
        case 'right':
          ele.style.backgroundPositionX = '100%'
          break
      }
    }
  }

   function imgHandler(ele, { color, shape }) {
    const { width, height } = ele.getBoundingClientRect()
    const attrs = {
      width,
      height,
      src: SMALLEST_BASE64
    }
    setAttributes(ele, attrs)
    // DON'T put `style` attribute in attrs, becasure maybe have another inline style.
    Object.assign(ele.style, {
      background: color,
      borderRadius: shape === 'circle' ? '50%' : 0
    })

    if (ele.hasAttribute('alt')) {
      ele.removeAttribute('alt')
    }
  }
  /**
   * [buttonHandler 改变 button 元素样式：包括去除 border和 box-shadow, 背景色和文字颜色统一]
   */
  function buttonHandler(ele, { color }) {
    Object.assign(ele.style, {
      color: color,
      background: color,
      border: 'none',
      boxShadow: 'none'
    })
  }

  function backgroundImageHandler(ele, { color, shape }) {
    Object.assign(ele.style, {
      background: color,
      borderRadius: shape === 'circle' ? '50%' : 0
    })
  }
  /**
   * [transparent 设置元素字体颜色为透明，必要情况下，设置其 textDecorationColor 也为透明色]
   */
  function transparent(ele) {
    ele.style.color = TRANSPARENT
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
    for (let i = 1; i < len; i++) {
      ele.appendChild(firstChild.cloneNode(true))
    }
  }

  function removeHandler(ele) {
    const parent = ele.parentNode
    if (parent) {
      parent.removeChild(ele)
    }
  }

  function emptyHandler(ele) {
    ele.innerHTML = ''
  }

  function pseudosHandler({ ele, hasBefore, hasAfter }, { color, shape }) {
    let styleEle = $(`[data-skeleton="${SKELETON_STYLE}"]`)
    const selector = `.${PSEUDO_CLASS}::before, .${PSEUDO_CLASS}::after`
    let rule = `
      {
        background: ${color} !important;
        background-image: none !important;
        border-radius: ${shape === 'circle' ? '50%' : 0} !important;
        color: transparent !important;
        border-color: transparent !important;
      }
    `

    if (!styleEle) {
      styleEle = document.createElement('style')
      styleEle.setAttribute('data-skeleton', SKELETON_STYLE)
      if (document.head) {
        document.head.appendChild(styleEle)
      } else {
        document.body.appendChild(styleEle)
      }
      if (!window.createPopup) { /* For Safari */
        styleEle.appendChild(document.createTextNode(''))
      }
    }

    ele.classList.add(PSEUDO_CLASS)
    const oldHTML = styleEle.innerHTML
    if (!/\S/.test(oldHTML)) {
      const CSSRule = `${selector} ${rule}`
      styleEle.innerHTML = `${CSSRule}`
    }
  }

  function svgHandler(ele, { color, shape }) {
    const { width, height } = ele.getBoundingClientRect()
    if (width === 0 || height === 0 || ele.getAttribute('aria-hidden') === 'true') {
      return removeHandler(ele)
    }
    emptyHandler(ele)
    Object.assign(ele.style, {
      width: px2rem(width),
      height: px2rem(height),
      borderRadius: shape === 'circle' ? '50%' : 0
    })
    if (color === TRANSPARENT) {
      setOpacity(ele)
    } else {
      ele.style.background = color
    }
  }

  function gradientHandler(ele) {
    ele.style.background = TRANSPARENT
  }

  function grayHandler(ele, { color }) {
    const elements = ele.querySelectorAll('*')
    Array.from(elements).forEach(element => {
      const childNodes = element.childNodes
      if (Array.from(childNodes).some(n => n.nodeType === Node.TEXT_NODE)) {
        element.style.color = color
      }
    })
    ele.style.color = color
    ele.style.background = color
  }

  function addBlickAnimation() {
    const style = document.createElement('style')
    const styleContent = `
      @keyframes blink {
        0% {
          opacity: .4;
        }

        50% {
          opacity: 1;
        }

        100% {
          opacity: .4;
        }
      }
      .blink {
        animation-duration: 2s;
        animation-name: blink;
        animation-iteration-count: infinite;
      }
    `
    style.innerHTML = styleContent
    document.head.appendChild(style)
    document.body.firstElementChild.classList.add('blink')
  }

  function traverse(options) {
    const { excludes, text, image, button, svg, grayBlock, pseudo } = options
    const excludesEle = excludes.length ? Array.from($$(excludes.join(','))) : []
    const grayEle = grayBlock.length ? Array.from($$(grayBlock.join(','))) : []
    const rootElement = document.documentElement

    const texts = []
    const buttons = []
    const hasImageBackEles = []
    const toRemove = []
    const imgs = []
    const svgs = []
    const pseudos = []
    const gradientBackEles = []
    const grayBlocks = []

    ;(function preTraverse(ele) {
      const styles = window.getComputedStyle(ele)
      const hasPseudoEle = checkHasPseudoEle(ele)
      if (!inViewPort(ele) || DISPLAY_NONE.test(ele.getAttribute('style'))) {
        return toRemove.push(ele)
      }
      if (~grayEle.indexOf(ele)) { // eslint-disable-line no-bitwise
        return grayBlocks.push(ele)
      }
      if (~excludesEle.indexOf(ele)) return false // eslint-disable-line no-bitwise

      if (hasPseudoEle) {
        pseudos.push(hasPseudoEle)
      }

      if (checkHasBorder(styles)) {
        ele.style.border = 'none'
      }

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
      if (checkHasTextDecoration(styles)) {
        ele.style.textDecorationColor = TRANSPARENT
      }
      // 隐藏所有 svg 元素
      if (ele.tagName === 'svg') {
        return svgs.push(ele)
      }
      if (EXT_REG.test(styles.background) || EXT_REG.test(styles.backgroundImage)) {
        return hasImageBackEles.push(ele)
      }
      if (GRADIENT_REG.test(styles.background) || GRADIENT_REG.test(styles.backgroundImage)) {
        return gradientBackEles.push(ele)
      }
      if (ele.tagName === 'IMG' && !isBase64Img(ele)) {
        return imgs.push(ele)
      }
      if (
        ele.nodeType === Node.ELEMENT_NODE
        && (ele.tagName === 'BUTTON' || (ele.tagName === 'A' && ele.getAttribute('role') === 'button'))
      ) {
        return buttons.push(ele)
      }
      if (
        ele.childNodes
        && ele.childNodes.length === 1
        && ele.childNodes[0].nodeType === Node.TEXT_NODE
        && /\S/.test(ele.childNodes[0].textContent)
      ) {
        return texts.push(ele)
      }
    }(rootElement))

    svgs.forEach(e => svgHandler(e, svg))
    texts.forEach(e => textHandler(e, text))
    buttons.forEach(e => buttonHandler(e, button))
    hasImageBackEles.forEach(e => backgroundImageHandler(e, image))
    imgs.forEach(e => imgHandler(e, image))
    pseudos.forEach(e => pseudosHandler(e, pseudo))
    gradientBackEles.forEach(e => gradientHandler(e))
    grayBlocks.forEach(e => grayHandler(e, button))
    // remove mock text wrapper
    const offScreenParagraph = document.querySelector(`#${MOCK_TEXT_ID}`)
    if (offScreenParagraph && offScreenParagraph.parentNode) {
      toRemove.push(offScreenParagraph.parentNode)
    }
    toRemove.forEach(e => removeHandler(e))
  }

  function genSkeleton(options) {
    const { remove, hide } = options
    /**
     * before walk
     */
    // 将 `remove` 队列中的元素删除
    if (Array.isArray(remove)) {
      remove.push(CONSOLE_CLASS, ...PRE_REMOVE_TAGS)
      const removeEle = $$(remove.join(','))
      Array.from(removeEle).forEach(ele => removeHandler(ele))
    }
    // 将 `hide` 队列中的元素通过调节透明度为 0 来进行隐藏
    if (hide.length) {
      const hideEle = $$(hide.join(','))
      Array.from(hideEle).forEach(ele => setOpacity(ele))
    }
    /**
     * walk in process
     */
    
    traverse(options)
    /**
     * add animation blink
     */
    addBlickAnimation()
  }

  function getHtmlAndStyle() {
    const root = document.documentElement
    const rawHtml = root.outerHTML
    const styles = Array.from($$('style')).map(style => style.innerHTML || style.innerText)
    Array.from($$(AFTER_REMOVE_TAGS.join(','))).forEach(ele => removeHandler(ele))
    // fix html parser can not handle `<div ubt-click=3659 ubt-data="{&quot;restaurant_id&quot;:1236835}" >`
    // need replace `&quot;` into `'`
    const cleanedHtml = document.body.innerHTML.replace(/&quot;/g, "'")
    return { rawHtml, styles, cleanedHtml }
  }

  return {
    genSkeleton,
    getHtmlAndStyle
  }
}(document))

window.Skeleton = Skeleton
