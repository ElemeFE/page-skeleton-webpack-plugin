import App from './app.vue'
import Vue from 'vue'
import store from './store'
import initSock from './socket'

initSock(store)

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
