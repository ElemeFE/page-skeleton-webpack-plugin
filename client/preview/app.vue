<template>
  <div class="app">
    <div class="left">
      <Chatbox
        :list="msgList"
      ></Chatbox>
    </div>
    <div class="middle">
      <Preview
        :url="url"
      ></Preview>
    </div>
    <div class="right">
      <Edit
        @genShell="handleClick"
      ></Edit>
    </div>
  </div>
</template>

<script>
  import Preview from './components/preview.vue'
  import Chatbox from './components/chatbox.vue'
  import Edit from './components/edit.vue'
  import { mapState } from 'vuex'
  export default {
    components: {
      Preview,
      Chatbox,
      Edit
    },
    computed: {
      ...mapState(['url', 'connect', 'msgList'])
    },
    methods: {
      handleClick() {
        this.$store.dispatch('WRITE_SHELL')
      }
    }
  }
</script>

<style scoped>
  .app {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    padding-top: 35px;
    background: radial-gradient(circle at top right,#667EEA,#764BA2);
  }
  .left {
    flex: 0;
    flex-shrink: 0;
  }
  .middle {
    flex: 0;
    flex-shrink: 0;
  }
  .right {
    flex: 1;
  }
</style>