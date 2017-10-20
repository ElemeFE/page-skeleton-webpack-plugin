module.exports = {

  sleep(duration) {
    return new Promise(resolve => {
      setTimeout(resolve, duration)
    })
  },

  isBase64Img(img) {
    return /base64/.test(img.src)
  }

}
