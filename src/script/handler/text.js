import { getComputedStyle, px2relativeUtil, getTextWidth, setOpacity } from '../util'

/**
 * handle text block
 */
function addTextMask(paragraph, {
  textAlign,
  lineHeight,
  paddingBottom,
  paddingLeft,
  paddingRight
}, maskWidthPercent = 0.5) {
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

function textHandler(ele, { color }, cssUnit) {
  const { width } = ele.getBoundingClientRect()
  // if the text block's width is less than 50, just set it to transparent.
  if (width <= 50) {
    return setOpacity(ele)
  }
  const comStyle = getComputedStyle(ele)
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
  // Math.floor
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
    backgroundSize: `100% ${px2relativeUtil(lineHeight, cssUnit)}`,
    backgroundClip: 'content-box',
    backgroundColor: 'transparent',
    position,
    color: 'transparent',
    backgroundRepeat: 'repeat-y'
  })
  /* eslint-enable no-mixed-operators */
  // add white mask
  if (lineCount > 1) {
    addTextMask(ele, comStyle)
  } else {
    const textWidth = getTextWidth(text, {
      fontSize,
      lineHeight,
      wordBreak,
      wordSpacing
    })
    const textWidthPercent = textWidth / (width - parseInt(paddingRight, 10) - parseInt(paddingLeft, 10))
    ele.style.backgroundSize = `${textWidthPercent * 100}% ${px2relativeUtil(lineHeight, cssUnit)}`
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

export default textHandler
