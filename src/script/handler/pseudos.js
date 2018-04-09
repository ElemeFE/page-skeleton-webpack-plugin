import { getOppositeShape, $ } from '../util'
import { CLASS_NAME_PREFEX, SKELETON_STYLE } from '../config'

function pseudosHandler({ ele, hasBefore, hasAfter }, { color, shape, shapeOpposite }) {
  const finalShape = shapeOpposite.indexOf(ele) > -1 ? getOppositeShape(shape) : shape
  const PSEUDO_CLASS = `${CLASS_NAME_PREFEX}pseudo`
  const PSEUDO_RECT_CLASS = `${CLASS_NAME_PREFEX}pseudo-rect`
  const PSEUDO_CIRCLE_CLASS = `${CLASS_NAME_PREFEX}pseudo-circle`

  let styleEle = $(`[data-skeleton="${SKELETON_STYLE}"]`)

  if (!styleEle) {
    const rules = `
        .${PSEUDO_CLASS}::before, .${PSEUDO_CLASS}::after {
          background: ${color} !important;
          background-image: none !important;
          color: transparent !important;
          border-color: transparent !important;
        }
        .${PSEUDO_RECT_CLASS}::before, .${PSEUDO_RECT_CLASS}::after {
          border-radius: 0 !important;
        }
        .${PSEUDO_CIRCLE_CLASS}::before, .${PSEUDO_CIRCLE_CLASS}::after {
          border-radius: 50% !important;
        }
      `

    styleEle = document.createElement('style')
    styleEle.setAttribute('data-skeleton', SKELETON_STYLE)
    if (!window.createPopup) { /* For Safari */
      styleEle.appendChild(document.createTextNode(''))
    }
    styleEle.innerHTML = rules
    if (document.head) {
      document.head.appendChild(styleEle)
    } else {
      document.body.appendChild(styleEle)
    }
  }

  ele.classList.add(PSEUDO_CLASS)
  ele.classList.add(finalShape === 'circle' ? PSEUDO_CIRCLE_CLASS : PSEUDO_RECT_CLASS)
}

export default pseudosHandler
