module.exports = img => {
  const div = document.createElement('div')
  const parent = img.parentNode

  console.log(div)

  div.style.width = '100%'
  div.style.height = '100%'
  div.style.background = '#fefefe'

  parent.removeChild(img)
  parent.appendChild(div)
}
