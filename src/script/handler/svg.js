import { emptyElement, removeElement, getOppositeShape, px2relativeUtil, setOpacity } from '../util'
import { TRANSPARENT } from '../config'

function svgHandler(ele, { color, shape, shapeOpposite }, cssUnit) {
  const { width, height } = ele.getBoundingClientRect()

  if (width === 0 || height === 0 || ele.getAttribute('aria-hidden') === 'true') {
    return removeElement(ele)
  }

  const finalShape = shapeOpposite.indexOf(ele) > -1 ? getOppositeShape(shape) : shape

  emptyElement(ele)

  Object.assign(ele.style, {
    width: px2relativeUtil(width, cssUnit),
    height: px2relativeUtil(height, cssUnit),
    borderRadius: finalShape === 'circle' ? '50%' : 0
  })
  if (color === TRANSPARENT) {
    setOpacity(ele)
  } else {
    ele.style.background = color
  }
}

export default svgHandler
