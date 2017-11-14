<template>
  <div class="app">
    <app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
  import AppHeader from './components/appHeader.vue'

  export default {
    name: 'App',

    components: {
      AppHeader
    }
  }
</script>

