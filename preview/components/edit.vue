<template>
  <div class="edit-panel">
 <!--    <el-dialog
      title="手机预览"
      :visible.sync="dialogVisible"
      width="25%">
      <span>打开微信 App，点击右上角「扫一扫」,扫描二维码</span>
      <div class="image-wrapper">
        <img :src="qrCode" alt=" 二维码">
      </div>
    </el-dialog> -->
    <div class="card">
      <h3>手机预览骨架页面</h3>
      <p>1. 手机和开发电脑连入同一 WIFI 网络。</p>
      <p>2. 在系统「安全性与隐私」设置中，关闭防火墙。</p>
      <p>3. 打开微信「扫一扫」，扫描二维码。</p>
      <div class="image-wrapper">
        <img :src="qrCode" alt="二维码">
      </div>   
    </div>
    <div class="card">
      <h3>写入 Shell 文件</h3>
      <p>Shell 文件将保存在配置路径，你可以对生成的 shell.html 文件进行二次修改来更好的满足你的需求。</p>
      <el-button @click="handleClick" type="success" round>写入文件</el-button>
      <p>在不久的将来，预览页面将可编辑，尽情期待！</p> 
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: false
      }
    },
    props: {
      qrCode: {
        type: String,
        required: true
      }
    },
    methods: {
      preview () {
        this.dialogVisible = true
      },
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
  h3 {
    margin: 0;
    color: #444;
  }
  .edit-panel {
    width: 400px;
    height: 635px;
    padding: 20px;
    margin-right: 20px;
    background: linear-gradient(to right, #a1c4fd, #c2e9fb);
    box-sizing: border-box;
    border-radius: 10px;
    overflow: hidden;
  }
  .image-wrapper {
    text-align: center;
  }
  .card {
    margin-bottom: 20px;
  }
</style>