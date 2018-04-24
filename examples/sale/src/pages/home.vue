<template>
  <div id="app">
    <header>
      <div class="banner">
        <router-link to="/search">
          <img src="https://fuss10.elemecdn.com/b/74/55aceba2b0b22d83b105370db1a7ajpeg.jpeg?imageMogr/thumbnail/!750x369r/gravity/Center/crop/750x369/" alt="banner">
        </router-link>
      </div>
    </header>
    <div class="product-list">
      <Product v-for="product of productLists"
        :key="product.foodId"
        class="product"
        :product="product">
        </Product>
    </div>
  </div>
</template>

<script>
  import Product from '../components/product.vue'
  import productData from '../data'

  export default {
    name: 'app',

    components: {
      Product,
    },

    data() {
      return {
        productLists: productData,
      }
    },
  }
</script>

<style>
  *,
  *::before,
  *::after {
    box-sizing: inherit;
    -webkit-tap-highlight-color: transparent;
  }
  html {
    box-sizing: border-box;
    font-family: 'Helvetica Neue', Tahoma, Arial, PingFangSC-Regular, 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
    user-select: none;
    -webkit-font-smoothing: antialiased;
    touch-action: manipulation;
  }
  body {
    margin: 0;
  }
</style>


<style scoped>
  .banner img {
    width: 100%;
  }
</style>
