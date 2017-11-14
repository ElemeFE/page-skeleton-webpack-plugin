<template>
  <div class="cloud">
    <div class="cloud-one"></div>
    <div class="cloud-two"></div>
    <div class="cloud-three"></div>
  </div>
</template>

<script>
  export default {
    name: 'Cloud'
  }
</script>

<style scoped>
  @keyframes cloud_one {
    0% {
    left: 0
    }
    100% {
    left: -200%
    }
  }
  @keyframes cloud_two {
    0% {
    left: 0
    }
    100% {
    left: -200%
    }
  }
  @keyframes cloud_three {
    0% {
    left: 0
    }
    100% {
    left: -200%
    }
  }
  .cloud {
    width: 100%;
    height: 480px;
    position: relative;
    overflow: hidden;
    transform: translate3d(0, 0, 0);
  }
  .cloud-one {
    background: url("./images/cloud-one.png");
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 300%;
    animation: cloud_one 100s linear infinite;
    transform: translate3d(0, 0, 0);
  }
  .cloud-two {
    background: url("./images/cloud-two.png");
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 300%;
    animation: cloud_two 125s linear infinite;
    transform: translate3d(0, 0, 0);
  }
  .cloud-three {
    background: url("./images/cloud-three.png");
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 300%;
    animation: cloud_three 150s linear infinite;
    transform: translate3d(0, 0, 0);
  }
</style>

