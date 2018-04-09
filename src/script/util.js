import { MOCK_TEXT_ID, TRANSPARENT } from './config'

export const getComputedStyle = window.getComputedStyle
export const $$ = document.querySelectorAll.bind(document)
export const $ = document.querySelector.bind(document)
export const isBase64Img = (img) => /base64/.test(img.src)

export const setAttributes = (ele, attrs) => {
  Object.keys(attrs).forEach(k => ele.setAttribute(k, attrs[k]))
}

export const inViewPort = (ele) => {
  const rect = ele.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.left < window.innerWidth
}

export const checkHasPseudoEle = (ele) => {
  const hasBefore = getComputedStyle(ele, '::before').getPropertyValue('content') !== ''
  const hasAfter = getComputedStyle(ele, '::after').getPropertyValue('content') !== ''
  if (hasBefore || hasAfter) {
    return { hasBefore, hasAfter, ele }
  }
  return false
}

export const checkHasBorder = (styles) => styles.getPropertyValue('border-style') !== 'none'

export const getOppositeShape = (shape) => shape === 'circle' ? 'rect' : 'circle'

export const checkHasTextDecoration = (styles) => !/none/.test(styles.textDecorationLine)

export const getViewPort = () => {
  const vh = window.innerHeight
  const vw = window.innerWidth

  return {
    vh,
    vw,
    vmax: Math.max(vw, vh),
    vmin: Math.min(vw, vh),
  }
}

export const px2relativeUtil = (px, unit = 'rem') => {
  const pxValue = typeof px === 'string' ? parseFloat(px, 10) : px
  if (unit === 'rem') {
    const htmlElementFontSize = getComputedStyle(document.documentElement).fontSize
    return `${(pxValue / parseFloat(htmlElementFontSize, 10))}${unit}`
  } else {
    const dimensions = getViewPort()
    const base = dimensions[unit]
    return `${pxValue / base * 100}${unit}`
  }
}

export const getTextWidth = (text, style) => {
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

export const setOpacity = (ele) => {
  ele.style.opacity = 0
}

export const transparent = (ele) => {
  ele.style.color = TRANSPARENT
}

export const removeElement = (ele) => {
  const parent = ele.parentNode
  if (parent) {
    parent.removeChild(ele)
  }
}

export const emptyElement = (ele) => {
  ele.innerHTML = ''
}
