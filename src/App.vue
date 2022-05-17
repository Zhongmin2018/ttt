<template>
  <div id="app">
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'app',
  computed:{
    hostip(){
      return this.$store.getters.hostip;
    },
    appid(){
      return this.$store.getters.appid;
    }
  },
  mounted(){
    const tdata = {
      'data':{
        "mqtt": this.$mqtt,
      }
    }
    // 设置成全局
    this.$store.commit("setmqtt",tdata);
    // 开始订阅与自己相关的信息主题
    this.$mqtt.subscribe('gliot/'+this.appid+'/'+this.hostip+'/#');
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

</style>
