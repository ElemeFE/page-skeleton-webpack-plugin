import { SMALLEST_BASE64 } from '../config'
import { getOppositeShape, setAttributes } from '../util'

function imgHandler(ele, { color, shape, shapeOpposite }) {
  const { width, height } = ele.getBoundingClientRect()
  const attrs = {
    width,
    height,
    src: SMALLEST_BASE64
  }

  const finalShape = shapeOpposite.indexOf(ele) > -1 ? getOppositeShape(shape) : shape

  setAttributes(ele, attrs)
  // DON'T put `style` attribute in attrs, becasure maybe have another inline style.
  Object.assign(ele.style, {
    background: color,
    borderRadius: finalShape === 'circle' ? '50%' : 0
  })

  if (ele.hasAttribute('alt')) {
    ele.removeAttribute('alt')
  }
}

export default imgHandler
