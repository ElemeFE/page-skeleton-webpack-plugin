/**
 * a Map instance to cache the styles which will be inserted into the skeleton page.
 * key is the selector and value is the css rules.
 */
import { CLASS_NAME_PREFEX } from '../config'

const styleCache = new Map()

// some common styles
export const shapeStyle = (shape) => {
  const selector = `.${CLASS_NAME_PREFEX + shape}`
  const rule = `{
    border-radius: ${shape === 'rect' ? '0' : '50%'};
  }`
  if (!styleCache.has(selector)) {
    styleCache.set(selector, rule)
  }
}

export const addStyle = (selector, rule) => {
  if (!styleCache.has(selector)) {
    styleCache.set(selector, rule)
  }
}

export default styleCache
