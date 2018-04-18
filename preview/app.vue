<template>
  <div class="container">
    <bar-top
      @preview="preview"
      @genShell="writeShell"
    ></bar-top>
    <div class="main">
      <div class="left">
        <preview
          :url="url"
          type="origin"
        ></preview>
      </div>
      <div class="middle">
        <preview
          :url="skeletonPageUrl"
          type="skeleton"
        ></preview>
      </div>
      <div class="right">
        <edit
          :shell-html="shellHtml"
        ></edit>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :show-close="false"
      :modal="true"
      width="360px">
      <div slot="title" class="modal-title">手机预览</div>
      <p>1. 手机和开发电脑连入同一 WIFI 网络。</p>
      <p>2. 在系统「安全性与隐私」设置中，关闭防火墙。</p>
      <p>3. 打开微信「扫一扫」，扫描二维码。</p>
      <div class="image-wrapper">
        <img :src="qrCode" alt="qr code">
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import BarTop from './components/bartop.vue'
  import Preview from './components/preview.vue'
  import Chatbox from './components/chatbox.vue'
  import Edit from './components/edit.vue'
  import { mapState } from 'vuex'
  import Bus from './bus'
  export default {
    components: {
      BarTop,
      Preview,
      Chatbox,
      Edit
    },
    data() {
      return {
        dialogVisible: false
      }
    },
    computed: {
      ...mapState(['url', 'connect', 'msgList', 'skeletonPageUrl', 'qrCode', 'shellHtml'])
    },
    created() {
      Bus.$on('message', this.handleMessageReceive)
    },
    methods: {
      writeShell() {
        this.$store.dispatch('WRITE_SHELL')
      },
      handleMessageReceive(data) {
        this.$message(data)
      },
      preview () {
        this.dialogVisible = true
      }
    }
  }
</script>

<style scoped>
  .modal-title, .image-wrapper {
    text-align: center;
  }
  .container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f9f9f9;
  }
  .main {
    margin-top: 66px;
    display: flex;
  }
  .left {
    flex: 0;
    flex-shrink: 0;
    margin: 20px;
    margin-right: 0;
  }
  .middle {
    flex: 0;
    flex-shrink: 0;
    margin: 20px;
  }
  .right {
    flex: 1;
  }
</style>