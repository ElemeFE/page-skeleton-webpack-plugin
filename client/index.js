import SockJS from 'sockjs-client'
import { port } from '../src/config/config'
import { log } from './utils'
// TODO headless 打开的页面不连接 socket
const sock = new SockJS(`http://localhost:${port}/socket`)
sock.onopen = function() {
  log('connected')
  sock.send(JSON.stringify({open: 'test'}))
}
// 用于调试
window.sock = sock

sock.onmessage = function(e) {
  const { type, data } = JSON.parse(e.data)
  switch (type) {
    case 'success': {
      window.open(data)
      break
    }
    case 'console': {
      log(data)
      break
    }
  }
 }

sock.onclose = function() {
  log('close')
  sock.close()
}