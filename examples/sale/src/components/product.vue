<template>
  <section class="product">
    <div class="product-header">
      <div class="left">
        <span class="shop-name">{{product.storeName}}</span>
      </div>
      <div class="right">
        <span>{{`评价${product.areaAgentFee}分`}}</span>
        <span>{{`配送费&yen;${product.deliveryPrice}`}}</span>
      </div>
    </div>
    <div class="product-content">
      <div class="img-wrapper">
        <img :src="product.foodImageURL" :alt="product.foodName">
      </div>
      <div class="product-info">
        <div class="title" :class="{'in-active': !hasProduct}">{{product.foodName}}</div>
        <div class="info-body">
          <div class="body-left">
            <div class="remain">
              <div class="remain-num"
                :class="{'active': hasProduct}"
              >
                <span>{{hasProduct ? `仅剩${product.promotionStock}份` : '今日已抢完'}}</span>
              </div>
              <div class="remain-bar">
                <div :style="{'width': `${product.promotionStock / product.dailyStock * 100}%`}" class="bar-inner"></div>
              </div>
            </div>
            <div class="price-wrapper">
              <div class="cur-price" :class="{'in-active': !hasProduct}">&yen;<span>{{product.activityPrice}}</span></div>
              <div class="pre-price"><span>&yen;{{product.originalPrice}}</span></div>
            </div>
          </div>
          <div class="right-button">
            <button :class="{'none': !hasProduct}">{{hasProduct ? '马上抢' : '进店逛逛'}}</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    props: {
      product: {
        type: Object,
        required: true,
      },
    },
    computed: {
      hasProduct() {
        return +this.product.promotionStock !== 0
      },
    },
  }
</script>

<style scoped>
  :root {
    --redColor: #ff3618;
  }
  .product {
    width: 100%;
    height: 304px;
    display: flex;
    flex-direction: column;
    padding: 0 30px;
    font-family: "PingFangSC";
  }
  .product-header {
    height: 72px;
    box-sizing: border-box;
    border-bottom: 1px dashed rgb(221, 221, 221);
    font-size: 22px;
    font-family: "PingFangSC";
    color: #666;
    display: flex;
    justify-content: space-between;
  }
  .left, .right {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .left {
    flex: 1;
    max-width: 60%;
  }
  .shop-name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .right span {
    padding: 0 15px;
  }
  .right > span:last-of-type {
    padding-right: 0;
    position: relative;
    &::before {
      content: '';
      width: 1px;
      height: 20px;
      position: absolute;
      top: 6px;
      left: 0;
      background: #ddd;
    }
  }
  .product-content {
    display: flex;
    padding-top: 20px;
  }
  .img-wrapper {
    width: 180px;
    height: 180px;
    overflow: hidden;
    position: relative;
    border-radius: 4px;
    flex-shrink: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .product-info {
    margin-left: 20px;
    overflow: hidden;
    flex: 1;
    .title {
      font-size: 32px;
      color: #000;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .in-active {
      opacity: .4;
    }
    .info-body {
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      flex: 1;
    }
    .body-left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .remain-num {
      font-size: 22px;
      color: #666;
    }
    .active {
      color: rgb(255 54 24);
    }
    .remain-bar {
      width: 240px;
      height: 12px;
      border-radius: 6px;
      background-color: #ddd;
      position: relative;
      margin-top: 6px;
    }
    .bar-inner {
      height: 100%;
      background: linear-gradient(to right, rgb(255 131 85), rgb(255 87 87));
      position: absolute;
      left: 0;
      border-radius: 6px;
    }
    .price-wrapper {
      display: flex;
      font-family: "PingFangSC";
      margin-top: 10px;
    }
    .cur-price {
      color: var(--redColor);
      margin-right: 15px;
      font-size: 25px;
      span {
        font-weight: 500;
        font-size: 50px;
      }
    }
    .pre-price {
      font-size: 24px;
      color: #999;
      display: flex;
      flex-direction: column-reverse;
      span {
        margin-bottom: 10px;
        text-decoration: line-through;
      }
    }
    .right-button {
      display: flex;
      flex-direction: column-reverse;
      button {
        width: 160px;
        height: 70px;
        border-radius: 4px;
        box-sizing: border-box;
        background: linear-gradient(to right, rgb(255 83 57), rgb(255 54 24));
        font-size: 28px;
        font-weight: 500;
        text-align: center;
        line-height: 70px;
        color: #fff;
        margin-bottom: 20px;
      }
      .none {
        background: #fff;
        border: 1px solid var(--redColor);
        color: var(--redColor);
      }
    }
  }
</style>
