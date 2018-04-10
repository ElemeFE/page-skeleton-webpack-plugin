import { SMALLEST_BASE64 as src, CLASS_NAME_PREFEX } from '../config'
import { getOppositeShape, setAttributes, addClassName } from '../util'
import { addStyle, shapeStyle } from './styleCache'

function imgHandler(ele, { color, shape, shapeOpposite }) {
  const { width, height } = ele.getBoundingClientRect()
  const attrs = {
    width,
    height,
    src
  }

  const finalShape = shapeOpposite.indexOf(ele) > -1 ? getOppositeShape(shape) : shape

  setAttributes(ele, attrs)
  
  const className = CLASS_NAME_PREFEX + 'image'
  const shapeName = CLASS_NAME_PREFEX + finalShape
  const rule = `{
    background: ${color} !important;
  }`
  addStyle(`.${className}`, rule)
  shapeStyle(finalShape)

  addClassName(ele, [className, shapeName])

  if (ele.hasAttribute('alt')) {
    ele.removeAttribute('alt')
  }
}

export default imgHandler
