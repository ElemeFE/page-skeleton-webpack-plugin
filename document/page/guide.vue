<template>
  <div class="guide">
    <div v-html="guide"></div>
  </div>
</template>

<script>
  import readme from '../../README.md'

  export default {
    name: 'Guide',

    data() {
      return {
        guide: readme
      }
    }
  }
</script>

<style scoped>
  .guide {
    color: #999;
    background-color: #fff;
    padding: 30px 30px;
  }
</style>


