<template>
  <div class="home">
    <div class="title">Make your project more awesome</div>
    <div class="sub-title">
      remove loading, see your page at first sight <br>
      get image or code for your shell page
    </div>
    <router-link class="get-start" :to="{ name: 'guide'}">Get start</router-link>
    <cloud class="cloud"></cloud>
  </div>
</template>

<script>
  import Cloud from '../components/cloud.vue'

  export default {
    name: 'Home',

    components: {
      Cloud
    }
  }
</script>

<style scoped>
  .home {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;;
    align-items: center;
    height: calc(100vh - 50px);
    background-color: #00aeee;
  }
  .title {
    font-size: 34px;
    text-align: center;
    color: #fff;
    margin: 120px 0 15px;
  }
  .sub-title {
    font-size: 18px;
    color: #89defd;
    text-align: center;
    margin-bottom: 40px;
    line-height: 26px;
  }
  .get-start {
    position: relative;
    z-index: 1;
    font-size: 18px;
    color: #fff;
    padding: 10px 20px;
    border: 1px solid #fff;
    border-radius: 4px;

    &:hover {
      background-color: #32c5fb;
    }
  }
  .cloud {
    margin-top: -100px;
  }
</style>

