/**
 * use the same config options as image block.
 */
import { addStyle, shapeStyle } from './styleCache'
import { CLASS_NAME_PREFEX } from '../config'
import { addClassName } from '../util'

function backgroundHandler(ele, { color, shape }) {
  const imageClass = CLASS_NAME_PREFEX + 'image'
  const shapeClass = CLASS_NAME_PREFEX + shape
  const rule = `{
    background: ${color} !important;
  }`
  
  addStyle(`.${imageClass}`, rule)

  shapeStyle(shape)

  addClassName(ele, [imageClass, shapeClass])
}

export default backgroundHandler
