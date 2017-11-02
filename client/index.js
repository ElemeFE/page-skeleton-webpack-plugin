'use strict'

import SockJS from 'sockjs-client'
import Vue from 'vue/dist/vue.esm.js'
import { port } from '../src/config/config'
import { log, isPreview } from './utils'
import Console from './components/console/index.vue'

// TODO headless 打开的页面不连接 socket
const sock = new SockJS(`http://localhost:${port}/socket`)
const vm = createView(sock)

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
      vm.$data.text = data
      // window.open(data)
      log(data)
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

function createView(sock) {
  const root = document.createElement('div')
  document.body.appendChild(root)
 
  return new Vue({
    components: {
      Console
    },
    el: root,
    data: {
      show: isPreview,
      title: isPreview ? 'G' : 'P',
      text: isPreview ? 'Write shell files' : 'Preview skeleton page'
    },
    template: '<Console :show="show" :title="title" :text="text" @pclick="handleClick"></Console>',
    created() {
      this.$nextTick(() => {
         document.body.addEventListener('keydown', e => {
          const keyCode = e.keyCode || e.which || e.charCode
          const ctrlKey = e.ctrlKey || e.metaKey
          if(ctrlKey && keyCode === 13) {
            this.show = !this.show
          }
          
        })
      })
    },
    methods: {
      handleClick() {
        this.text = 'IN PROGRESS...'
        if (isPreview) {
          sock.send(JSON.stringify({ type: 'ok' }))
        } else {
          sock.send(JSON.stringify({ type: 'generate', data: window.location.href }))
        }
      }
    }
  })
}



