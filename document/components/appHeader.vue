<template>
  <div class="app-header">
    <div class="logo" title="you will be like it">
      <router-link :to="{ name: 'home' }">Page Skeleton</router-link>
    </div>
    <nav>
      <router-link exact-active-class="active" :to="{ name: 'home' }">Home</router-link>
      <router-link exact-active-class="active" :to="{ name: 'guide' }">Guide</router-link>
      <a href="">GitHub</a>
    </nav>
  </div>
</template>

<script>
  export default {
    name: 'AppHeader'
  }
</script>

<style scoped>
  .app-header {
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 30px;
    color: #fff;
    background-color: #00aeee;
  }
  nav a {
    position: relative;
    color: #fff;
    margin-left: 15px;

    &::after {
      display: block;
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      width: 0;
      height: 1px;
      background: #fff;
      transform: translateX(-50%);
      transition: all .3s;
    }
  }
  nav .active {
    &::after {
      width: 100%;
    }
  }
</style>


