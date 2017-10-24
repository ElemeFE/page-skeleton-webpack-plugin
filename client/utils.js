import tiza from 'tiza'

const log = msg => {
  tiza.color('goldenrod')
    .italic()
    .size(14)
    .text(`[PSG] ${msg}`)
    .log()
}

export {
  log
}