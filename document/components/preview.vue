<template>
  <div class="preview">
    <div class="image">
      <img src="./images/preview.png" width="500" alt="previews">
    </div>
    <div class="text">
      <h1>Customize</h1>
      <h2>Various ways to customize your skeleton page</h2>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Preview'
  }
</script>

<style scoped>
  .preview {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-bottom: 60px;
  }
  .text {
    width: 400px;
    margin-left: 50px;
  }
  h1 {
    color: #666;
    margin: 100px 0 10px;
  }
  h2 {
    color: #999;
  }
</style>
