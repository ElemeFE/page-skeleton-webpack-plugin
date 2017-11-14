<template>
  <div class="app">
    <app-header></app-header>
    <router-view></router-view>
    <app-footer></app-footer>
  </div>
</template>

<script>
  import AppHeader from './components/appHeader.vue'
  import AppFooter from './components/appFooter.vue'

  export default {
    name: 'App',

    components: {
      AppHeader,
      AppFooter
    }
  }
</script>

