<template>
  <div class="container">
    <bar-top
      @preview="preview"
      @genShell="writeShell"
      @select="handleSelectRoute"
      :drop-down-routes = "dropDownRoutes"
      :current-route="currentRoute"
    ></bar-top>
    <div class="main">
      <div class="left">
        <preview
          :url="currentSkeletonScreen.url"
          type="origin"
        ></preview>
      </div>
      <div class="middle">
        <preview
          :url="currentSkeletonScreen.skeletonPageUrl"
          type="skeleton"
        ></preview>
      </div>
      <div class="right">
        <edit
          :html="currentSkeletonScreen.html"
          :current-route="currentRoute"
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
        <img :src="currentSkeletonScreen.qrCode" alt="qr code">
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
  import bus from './bus'
  export default {
    components: {
      BarTop,
      Preview,
      Chatbox,
      Edit
    },
    data() {
      return {
        dialogVisible: false,
        dropDownRoutes: [],
        currentRoute: '/',
        currentSkeletonScreen: {
          url: '',
          skeletonPageUrl: '',
          qrCode: '',
          html: ''
        }
      }
    },
    computed: {
      ...mapState(['connect', 'routes'])
    },
    watch: {
      routes: function (value, oldValue) {
        console.log(this.dropDownRoutes)
        if (value !== oldValue && value) {
          this.dropDownRoutes = Object.keys(value).map(route => ({ route, url: value[route].url }))
          this.currentSkeletonScreen = value[this.currentRoute]
        }
      }
    },
    created() {
      bus.$on('message', this.handleMessageReceive)
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
      },
      handleSelectRoute ({ route }) {
        this.currentRoute = route
        this.currentSkeletonScreen = this.routes[route]
        setTimeout(() => {
          bus.$emit('set-code', this.routes)
        })
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