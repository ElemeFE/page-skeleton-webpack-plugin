<template>
  <div class="usage">
    <div class="title">how to use</div>
    <p>
      npm install -- save-dev page-skeleton-webpack-plugin <br>
      npm install --save-dev html-webpack-plugin
    </p>
    <div class="start">
      Now, get Started quickly in our <router-link :to="{ name: 'guide' }">guide</router-link>, or make contribute to our project.
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Usage'
  }
</script>

<style scoped>
  .usage {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    color: #999;
  }
  .title {
    color: #666;
    font-size: 28px;
    text-align: center;
    margin-bottom: 10px;
  }
  p {
    line-height: 24px;
  }
  .start {
    margin-top: 30px;
  }
  .start a {
    color: #32c5fb;
  }
</style>


