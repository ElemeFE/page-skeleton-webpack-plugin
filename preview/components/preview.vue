<template>
  <div class="model">
    <section class="top">
      <div class="time">
        <span>12:00</span>
        <span class="clock">
          <i></i>
        </span>
      </div>
      <div class="bang">
        <span class="dot"></span>
        <span class="line"></span>
      </div>
      <div class="single">
        <i class="i1"></i><i class="i2"></i><i class="i3"></i><i class="i4"></i>
        4G
        <div class="battery"></div>
      </div>
    </section>
    <section class="body">
      <iframe :src="url" frameborder="0" :class="{origin: type === 'origin'}"></iframe>
    </section>
    <section class="bottom"></section>
  </div>
</template>

<script>
  export default {
    props: {
      url: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      }
    }
  }
</script>

<style scoped>
  .model {
    box-sizing: border-box;
    width: 322px;
    height: 635px;
    border: 1px solid #e8e8e8;
    border-radius: 30px;
    background: #fff;
    position: relative;
    overflow: hidden;
  }
  .top {
    position: relative;
  }
  .time {
    color: #444;
    font-size: 12px;
    position: absolute;
    top: 8px;
    left: 15px;
    font-weight: 900;
  }
  .clock {
    display: inline-block;
    margin-left: 5px;
    width: 11px;
    height: 11px;
    box-sizing: border-box;
    border: 1px solid #444;
    border-radius: 50%;
    position: relative;
  }
  .clock::before, .clock::after {
    position: absolute;
    content: '';
    width: 4px;
    height: 2px;
    border-top-right-radius: 2px;
    border-top-left-radius: 2px;
    background: #444;
    top: -2px;
  }
  .clock::before {
    left: -3px;
    transform: rotate(-45deg);
  }
  .clock::after {
    right: -3px;
    transform: rotate(45deg);
  }
  .clock i {
    width: 1px;
    height: 4px;
    display: block;
    position: absolute;
    top: 1px;
    left: 4px;
    background: #444;
  }
  .clock i::before {
    content: '';
    width: 2px;
    height: 1px;
    position: absolute;
    bottom: 0;
    left: -2px;
    background: #444;
  }
  .bang {
    width: 161px;
    height: 25px;
    transform: translateX(-50%);
    position: absolute;
    top: 0;
    left: 50%;
    border-bottom-right-radius: 25px;
    border-bottom-left-radius: 25px;
    text-align: center;
  }
  .bang .dot {
    width: 8px;
    height: 8px;
    display: inline-block;
    border-radius: 50%;
    box-sizing: border-box;
    background: #bbb;
  }
  .bang .line {
    display: inline-block;
    width: 70px;
    height: 8px;
    border-radius: 4px;
    background: #bbb;
    margin-left: 5px;
  }
  .single {
    position: absolute;
    top: 8px;
    right: 15px;
    font-size: 12px;
  }
  .single i {
    width: 2px;
    display: inline-block;
    background: #444;
    margin-right: 2px;
  }
  .i1 {
    height: 4px;
  }
  .i2 {
    height: 6px;
  }
  .i3 {
    height: 8px;
  }
  .i4 {
    height: 10px;
    margin-right: 0;
  }
  .battery {
    display: inline-block;
    width: 20px;
    height: 10px;
    border: 1px solid #444;
    box-sizing: border-box;
    border-radius: 2px;
    position: relative;
  }
  .battery::before {
    content: '';
    width: 3px;
    height: 6px;
    position: absolute;
    top: 1px;
    right: -5px;
    background: #444;
    border-bottom-right-radius: 3px;
    border-top-right-radius: 3px;
  }
  .battery::after {
    content: '';
    width: 12px;
    height: 6px;
    position: absolute;
    top: 1px;
    left: 1px;
    background: #444;
    border-bottom-left-radius: 2px;
    border-top-left-radius: 2px;
  }
  .body {
    width: 100%;
    height: 590px;
    margin-top: 25px;
  }
  .body iframe {
    width: 400%;
    height: 400%;
    transform: scale(.25);
    transform-origin: top left;
  }
  .body iframe.origin {
    width: 100%;
    height: 100%;
    transform: scale(1);
  }
  .bottom {
    width: 110px;
    height: 4px;
    border-radius: 2px;
    background: #444;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 5px;
  }
</style>




