<template>
  <div class="demo">
    <div class="text">
      <h1>Accurate</h1>
      <h2>Accurately generate the skeleton structure of each page</h2>
    </div>
    <div class="image">
      <img src="./images/demo1.png" width="250" alt="demo">
      <img src="./images/demo1-preview.png" width="250" alt="demo">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Demo'
  }
</script>

<style scoped>
  .demo {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: 60px;
  }
  .text {
    width: 400px;
    margin-right: 50px;
  }
  h1 {
    color: #666;
    margin: 100px 0 10px;
  }
  h2 {
    color: #999;
  }
  .image img {
    margin-left: 10px;
  }
</style>


