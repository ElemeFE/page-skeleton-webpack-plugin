import tiza from 'tiza'

const log = msg => {
  tiza.color('goldenrod')
    .italic()
    .size(14)
    .text(`[PSG] ${msg}`)
    .log()
}

const isPreview = /preview=true/.test(window.location.href)

export {
  log,
  isPreview
}