<template>
  <div class="chat">
    <ul>
      <transition-group name="list" tag="p">
        <li v-for="(m, i) of list" :key="i">
          <div class="icon" :class="{meicon: m.type === 'me'}">{{m.type}}</div>
          <div class="msg" :class="{me: m.type === 'me'}">{{m.msg}}</div>
        </li>
      </transition-group>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      list: {
        type: Array,
        required: true
      }
    }
  }
</script>

<style>
  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }
  .list-enter, .list-leave-to
  /* .list-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
  }
  .chat {
    width: 400px;
    height: 635px;
    padding: 20px;
    margin-right: 20px;
    margin-left: 20px;
    background: linear-gradient(to right, #a1c4fd, #c2e9fb);
    box-sizing: border-box;
    border-radius: 10px;
    overflow: hidden;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    clear: both;
    margin-bottom: 10px;
  }
  .icon {
    font-size: 12px;
    color: #999;
    margin-bottom: 5px;
  }
  .meicon {
    float: right;
  }
  .msg {
    color: #444;
    width: 300px;
    padding: 5px;
    background: rgba(255, 255, 255, .4);
    border-radius: 5px;
    position: relative;
  }
 
  .me {
    float: right;
    clear: both;
    background: rgba(48, 131, 242, .4);
  }
</style>