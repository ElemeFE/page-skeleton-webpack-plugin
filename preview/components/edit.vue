<template>
  <div class="edit-panel">
    <h3>Write Shell File</h3>
    <p> Are you satified with this page skeleton ?</p>
    <button @click="handleClick">Write File</button>
    <p>In the near future, you can edit this skeleton page, So stay tuned!</p>
  </div>
</template>

<script>
  export default {
    methods: {
      handleClick() {
        this.$emit('genShell')
      }
    }
  }
</script>

<style scoped>
  p {
    color: #666;
  }
  button {
    color: #fff;
    padding: 0 16px;
    background: rgb(0, 188, 212);
    border: none;
    cursor: pointer;
    line-height: 36px;
    font-size: 14px;
    font-weight: 400;
  }
  button:hover {
    background: rgba(0, 188, 212, .5);
  }
  h3 {
    margin: 0;
    color: #444;
  }
  .edit-panel {
    width: 400px;
    height: 635px;
    padding: 20px;
    margin-right: 20px;
    margin-left: 20px;
    background: linear-gradient(to right, #a1c4fd, #c2e9fb);
    box-sizing: border-box;
    border-radius: 10px;
    overflow: hidden;
  }
</style>