import { Node } from '../config'

function grayHandler(ele, { color }) {
  const elements = ele.querySelectorAll('*')
  Array.from(elements).forEach(element => {
    const childNodes = element.childNodes
    if (Array.from(childNodes).some(n => n.nodeType === Node.TEXT_NODE)) {
      element.style.color = color
    }
  })
  ele.style.color = color
  ele.style.background = color
}

export default grayHandler
