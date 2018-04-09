/**
 * [buttonHandler 改变 button 元素样式：包括去除 border和 box-shadow, 背景色和文字颜色统一]
 */
function buttonHandler(ele, { color, excludes }) {
  if (excludes.indexOf(ele) > -1) return false
  Object.assign(ele.style, {
    color,
    background: color,
    border: 'none',
    boxShadow: 'none'
  })
}

export default buttonHandler
