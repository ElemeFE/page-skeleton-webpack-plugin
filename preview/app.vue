<template>
  <div class="app">
    <div class="main">
      <div class="left">
        <Preview
          :url="url"
          type="origin"
        ></Preview>
      </div>
      <div class="middle">
        <Preview
          :url="skeletonPageUrl"
          type="skeleton"
        ></Preview>
      </div>
      <div class="right">
        <Edit
          @genShell="handleClick"
          :qr-code="qrCode"
        ></Edit>
      </div>
    </div>
  </div>
</template>

<script>
  import Preview from './components/preview.vue'
  import Chatbox from './components/chatbox.vue'
  import Edit from './components/edit.vue'
  import { mapState } from 'vuex'
  import Bus from './bus'
  export default {
    components: {
      Preview,
      Chatbox,
      Edit
    },
    computed: {
      ...mapState(['url', 'connect', 'msgList', 'skeletonPageUrl', 'qrCode'])
    },
    created() {
      Bus.$on('message', this.handleMessageReceive)
    },
    methods: {
      handleClick() {
        this.$store.dispatch('WRITE_SHELL')
      },
      handleMessageReceive(data) {
        this.$message(data)
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
    background: radial-gradient(circle at top right,#667EEA,#764BA2);
  }
  .main {
    margin-top: 35px;
    display: flex;
  }
  .left {
    flex: 0;
    flex-shrink: 0;
    margin-left: 35px;
    margin-right: 35px;
  }
  .middle {
    flex: 0;
    flex-shrink: 0;
    margin-right: 35px;
  }
  .right {
    flex: 1;
  }
</style>