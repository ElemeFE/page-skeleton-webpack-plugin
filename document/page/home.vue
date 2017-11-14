<template>
  <div class="home">
    <div class="first-page">
      <div class="title">Make your project more awesome</div>
      <div class="sub-title">
        remove loading, see your page at first sight <br>
        get image or code for your shell page
      </div>
      <router-link class="get-start" :to="{ name: 'guide'}">Get start</router-link>
      <cloud class="cloud"></cloud>
      <img class="pull-down" src="./images/pull-down.png" width="32" alt="pull-down">
    </div>
    <div class="main">
      <demo></demo>
      <preview></preview>
      <usage></usage>
    </div>
  </div>
</template>

<script>
  import Cloud from '../components/cloud.vue'
  import Demo from '../components/demo.vue'
  import Usage from '../components/usage.vue'
  import Preview from '../components/preview.vue'

  export default {
    name: 'Home',

    components: {
      Cloud,
      Demo,
      Usage,
      Preview
    }
  }
</script>

<style scoped>
  .first-page {
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
  .main {
    background-color: #fff;
    padding: 60px 0;
  }
  .cloud {
    margin-top: -100px;
  }
  .pull-down {
    position: absolute;
    width: 32px;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    animation: pullDown 1.2s ease-in-out infinite alternate;
  }
  @keyframes pullDown {
    to {
        transform: translateX(-50%) translateY(10px)
    }
  }
</style>

