import Vue from 'vue'
import App from './app.vue'
import store from './store'
import initSock from './socket'

import './assets/icons.js'
import './index.css'

import {
  Button,
  Dialog,
  Message,
  ButtonGroup,
  Dropdown,
  DropdownMenu,
  DropdownItem
} from 'element-ui'

;[
  Button,
  Dialog,
  ButtonGroup,
  Dropdown,
  DropdownMenu,
  DropdownItem
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
