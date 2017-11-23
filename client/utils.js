import tiza from 'tiza'

const log = msg => {
  tiza.color('#006633')
    // .italic()
    .size(14)
    .text(`😄 -> "[PSG] ${msg}"`)
    .log()
}

export {
  log
}
