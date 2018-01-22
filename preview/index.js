import Vue from 'vue'
import App from './app.vue'
import store from './store'
import initSock from './socket'

import {
  Button,
  Dialog,
  Message
} from 'element-ui'

;[
  Button,
  Dialog
].forEach(cpt => {
  Vue.component(cpt.name, cpt)
})

Vue.prototype.$message = Message

initSock(store)

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
