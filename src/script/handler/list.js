function listHandle(ele) {
  const children = ele.children
  const len = Array.from(children).filter(child => child.tagName === 'LI').length
  if (len === 0) return false
  const firstChild = children[0]
  // 解决有时ul元素子元素不是 li元素的 bug。
  if (firstChild.tagName !== 'LI') return listHandle(firstChild)
  Array.from(children).forEach((c, i) => {
    if (i > 0) c.parentNode.removeChild(c)
  })
  // 将 li 所有兄弟元素设置成相同的元素，保证生成的页面骨架整齐
  for (let i = 1; i < len; i++) {
    ele.appendChild(firstChild.cloneNode(true))
  }
}

export default listHandle
