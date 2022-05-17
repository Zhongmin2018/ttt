<template>
  <div class="index">
    <h1 class="title">广联智通生产系统<sup class="sup">BETA</sup></h1>
    <div id="index">
      <!-- <div class="album">
        <router-link :to="{ name: 'pcba'}">PCBA测试</router-link>
      </div>
      <div class="album">
        <router-link :to="{ name: 'testproduct'}">产品测试</router-link>
      </div> -->
      <div class="album" v-show="authkey == '1' && platform == 'raspi' || authkey== '5' && platform == 'raspi'|| authkey == '7' && platform == 'raspi'">
        <router-link :to="{ name: 'pcba'}">PCBA测试</router-link>
      </div>
      <div class="album" v-show="authkey == '1' && platform == 'raspi' || authkey== '5' && platform == 'raspi'|| authkey == '7' && platform == 'raspi'">
        <router-link :to="{ name: 'testproduct'}">产品测试</router-link>
      </div>
<!--       <div class="album" v-show="authkey == '1' && platform == 'raspi' || authkey== '5' && platform == 'raspi' || authkey == '7' && platform == 'raspi'">
        <router-link :to="{ name: 'through'}">吞吐量测试</router-link>
      </div> -->
      <div class="album" v-show="authkey == '1' && platform != 'raspi' || authkey == '5' && platform != 'raspi' || authkey == '7' && platform != 'raspi'">
        <router-link :to="{ name: 'power'}">功率测试</router-link>
      </div>
      <div class="album" v-show="authkey == '1' && platform != 'raspi' || authkey == '5' && platform != 'raspi' || authkey == '7' && platform != 'raspi'">
        <router-link :to="{ name: 'glmark'}">产品出厂录入</router-link>
      </div>
      <div class="album" v-show="authkey == '1' && platform != 'raspi' || authkey == '5' && platform != 'raspi' || authkey == '7' && platform != 'raspi'">
        <router-link :to="{ name: 'glserch'}">订单信息查询</router-link>
      </div>
      <div class="album" v-show="authkey == '1' && platform != 'raspi' || authkey == '5' && platform != 'raspi' || authkey == '7' && platform != 'raspi'">
        <router-link :to="{ name: 'glshow'}">出厂产品信息查询</router-link>
      </div>
      <div class="album" v-show="authkey == '2' && platform != 'raspi' || authkey == '6' && platform != 'raspi' || authkey == '7' && platform != 'raspi'">
        <router-link :to="{ name: 'glreject'}">不良品录入和查询</router-link>
      </div>
      <div class="album" v-show="authkey == '2' && platform != 'raspi' || authkey == '6' && platform != 'raspi' || authkey == '7' && platform != 'raspi'">
        <router-link :to="{ name: 'glrepair'}">不良品维修</router-link>
      </div>
      <div class="album" v-show="authkey == '4' && platform != 'raspi' || authkey == '5' && platform != 'raspi' || authkey == '6' && platform != 'raspi'|| authkey == '7' && platform != 'raspi'">
        数据库备份
      </div>
      <div class="album" v-show="authkey == '4' && platform != 'raspi'|| authkey == '5'&& platform != 'raspi' || authkey == '6' && platform != 'raspi'|| authkey == '7' && platform != 'raspi'">
        邮箱服务设置
      </div>
      <div class="album" v-show="authkey == '4' && platform != 'raspi'|| authkey == '5'&& platform != 'raspi' || authkey == '6' && platform != 'raspi'|| authkey == '7' && platform != 'raspi'">
        <router-link :to="{name: 'rootAuthority'}">超级权限</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  beforeRouteEnter(to, from, next) {
    // 通过Vue-x保存的用户名判断有无登录 刷新用户名将不存在
    next(vm => {
      if (!vm.userName) {
        vm.$router.push("login");
      }
    });
  },
  computed: {
    // 用户名
    userName() {
      return this.$store.getters.userName;
    },
    // 权限 key
    authkey() {
      return this.$store.getters.authkey;
    },
    // 操作系统
    platform() {
      return this.$store.getters.platform;
    }
  },
  mounted() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  margin: 10px auto;
}
.sup {
  font-weight: 100;
}
a {
  display: block;
  text-decoration: none;
  color: inherit;
  width: 100%;
  height: 200px;
}
#index {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  width: 100%;
  padding: 50px 0px;
}
.album {
  text-align: center;
  line-height: 200px;
  width: 25%;
  height: 200px;
  background-color: #757575;
  overflow-x: hidden;
  /*border-radius:  50%;*/
  box-shadow: 0px 3px 16px -5px #020202;
  margin-left: 20px;
  margin-bottom: 20px;
  font-size: 30px;
  color: #424242;
  user-select: none;
}
.album:hover {
  background-color: #bdbdbd;
  color: #000;
  cursor: pointer;
}
</style>
