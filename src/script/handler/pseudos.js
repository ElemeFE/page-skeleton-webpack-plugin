import { getOppositeShape, addClassName } from '../util'
import { CLASS_NAME_PREFEX } from '../config'
import { addStyle } from './styleCache'

function pseudosHandler({ ele, hasBefore, hasAfter }, { color, shape, shapeOpposite }) {
  const finalShape = shapeOpposite.indexOf(ele) > -1 ? getOppositeShape(shape) : shape
  const PSEUDO_CLASS = `${CLASS_NAME_PREFEX}pseudo`
  const PSEUDO_RECT_CLASS = `${CLASS_NAME_PREFEX}pseudo-rect`
  const PSEUDO_CIRCLE_CLASS = `${CLASS_NAME_PREFEX}pseudo-circle`

  const rules = {
    [`.${PSEUDO_CLASS}::before, .${PSEUDO_CLASS}::after`]: `{
      background: ${color} !important;
      background-image: none !important;
      color: transparent !important;
      border-color: transparent !important;
    }`,
    [`.${PSEUDO_RECT_CLASS}::before, .${PSEUDO_RECT_CLASS}::after`]: `{
      border-radius: 0 !important;
    }`,
    [`.${PSEUDO_CIRCLE_CLASS}::before, .${PSEUDO_CIRCLE_CLASS}::after`]: `{
      border-radius: 50% !important;
    }`
  }

  Object.keys(rules).forEach(key => {
    addStyle(key, rules[key])
  })

  addClassName(ele, [PSEUDO_CLASS, finalShape === 'circle' ? PSEUDO_CIRCLE_CLASS : PSEUDO_RECT_CLASS])
}

export default pseudosHandler
