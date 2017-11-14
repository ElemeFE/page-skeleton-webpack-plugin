import App from './app.vue'
import Home from './page/home.vue'
import Guide from './page/guide.vue'
import './common.css'

const router = new VueRouter({
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home
    },
    {
      name: 'guide',
      path: '/guide',
      component: Guide
    }
  ]
})

new Vue({
  router,
  render: h => h(App)
}).$mount(document.querySelector('#app'))

