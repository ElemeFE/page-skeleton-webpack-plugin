function sleep(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}

function genScriptContent(...args) {
  return `\n${args.map(f => f.toString()).join('\n')}\n`
}

module.exports = {
  sleep,
  genScriptContent
}
