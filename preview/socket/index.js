import SockJS from 'sockjs-client'
import bus from '../bus'

const { port } = window.location
const sock = new SockJS(`http://localhost:${port}/socket`)

window.sock = sock

export const socketWrite = (type, data) => {
  sock.send(JSON.stringify({ type, data }))
}

const initSock = store => {
  sock.onopen = () => {
    store.dispatch('GET_CONNECT', true)
    socketWrite('connect', 'preview')
    socketWrite('url', 'preview')
  }
  sock.onmessage = function(e) {
    const { type, data } = JSON.parse(e.data)
    switch (type) {
      case 'url':
      case 'update': {
        const updateData = JSON.parse(data)
        store.dispatch('GET_URL', updateData)
        if (type === 'url') {
          bus.$emit('set-code', updateData)
        }
        break
      }
      case 'console': {
        store.dispatch('WRITE_SHELL_SUCCESS', data)
        break
      }
    }
   }

  sock.onclose = function() {
    store.dispatch('GET_CONNECT', false)
    sock.close()
  }
}

export default initSock
