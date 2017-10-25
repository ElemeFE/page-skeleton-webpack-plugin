<template>
  <div 
    class="sk-console"
    :class="{'show': show}"
  >
    <div class="button-wrapper" @click="handleClick">
      {{text}}
      <a href="javascript:;">{{title}}</a>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      title: {
        reqired: true,
        type: String
      },
      text: {
        required: true,
        type: String
      },
      show: {
        required: true,
        type: Boolean
      }
    },
    methods: {
      handleClick() {
        this.$emit('pclick')
      }
    }
  }
</script>
<style scoped>
  .sk-console {
    position: fixed;
    top: -2rem;
    left: 0;
    right: 0;
    width: 100%;
    height: 2rem;
    text-align: center;
    color: #fff;
    font-size: .45rem;
    background: rgba(255, 255, 255, .8);
    transition: all .2s .1s ease-out;
  }
  .show {
    top: 0;
  }
  .button-wrapper {
    position: relative;
    width: 85%;
    height: 1rem;
    background: rgba(0, 0, 0, .8);
    border-radius: 1rem;
    margin: .5rem auto;
    box-sizing: border-box;
    line-height: 1rem;
  }
  
  a {
    width: 1rem;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    font-size: .65rem;
    color: #fff;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    background: rgb(255, 64, 129);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px;
  }
</style>