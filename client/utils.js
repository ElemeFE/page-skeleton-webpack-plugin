import tiza from 'tiza'

export const log = (msg, type = 'success') => { // eslint-disable-line import/prefer-default-export
  const color = type === 'success' ? '#006633' : 'red'
  const emoji = type === 'success' ? '😄' : '😭'
  tiza.color(color)
    // .italic()
    .size(14)
    .text(`${emoji} -> "[PSG] ${msg}"`)
    .log()
}
