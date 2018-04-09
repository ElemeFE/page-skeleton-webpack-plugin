function backgroundHandler(ele, { color, shape }) {
  Object.assign(ele.style, {
    background: color,
    borderRadius: shape === 'circle' ? '50%' : 0
  })
}

export default backgroundHandler
