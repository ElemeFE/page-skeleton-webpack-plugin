var SockJS = require('sockjs-client')
var { port } = require('../src/config/config')
var sock = new SockJS(`http://localhost:${port}/socket`)
sock.onopen = function() {
  console.log('open')
  sock.send(JSON.stringify({open: 'test'}))
}
// 用于调试
window.sock = sock

sock.onmessage = function(e) {
  console.log('message', e.data)
 }

 sock.onclose = function() {
  console.log('close')
  sock.close()
 }