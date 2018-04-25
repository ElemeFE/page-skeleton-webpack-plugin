<template>
  <div class="bar-top">
    <div class="logo">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-skeleton"></use>
      </svg>
    </div>
    <div class="logo-text">Page Skeleton</div>
    <ul class="documents">
        <li><a href="https://github.com/ElemeFE/page-skeleton-webpack-plugin" target="_blank">Documents</a></li>
        <li><a href="https://zhuanlan.zhihu.com/p/34702561" target="_blank">Blog</a></li>
    </ul>
    <div class="tools">
        <div class="routes-dropdown">
          <el-dropdown size="small" type="primary" split-button @command="handleDropdownSelect">
              {{ 'Routes: ' + currentRoute }}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(route, i) of dropDownRoutes" :key="i" :command="route">{{ route.url }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>      
        </div>
        <el-button type="success" icon="el-icon-mobile-phone" circle
          @click="preview"
        ></el-button>
        <el-button type="primary" icon="el-icon-edit" circle
          @click="write"
        ></el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      dropDownRoutes: {
        type: Array,
        required: true
      },
      currentRoute: {
        type: String,
        required: true
      }
    },
    methods: {
      preview () {
        this.$emit('preview')
      },
      write () {
        this.$emit('genShell')
      },
      handleDropdownSelect (item) {
        this.$emit('select', item)
      }
    }
  }
</script>

<style scoped>
  .bar-top {
    width: 100%;
    height: 66px;
    padding: 13px 20px;
    box-sizing: border-box;
    position: fixed;
    background: #fff;
    top: 0;
    display: flex;
    border-bottom: 1px solid #e8e8e8;
  }
  .logo {
    width: 40px;
    height: 40px;
  }
  .logo > svg {
    width: 100%;
    height: 100%;
  }
  .logo-text {
    height: 40px;
    font-size: 25px;
    line-height: 40px;
    margin-left: 20px;
    color: #606266;
  }
  .documents {
    display: flex;
    height: 40px;
    margin-left: 100px;
  }
  .documents li {
    height: 40px;
    font-size: 18px;
    line-height: 40px;
    margin-right: 30px;
  }
  .documents li a {
    text-decoration: none;
    color: #909399;
  }
  .tools {
    flex: 1;
    text-align: right;
  }
  .routes-dropdown {
    display: inline-block;
    margin-top: 6px;
    margin-right: 20px;
  }
</style>
