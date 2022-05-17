<template lang="html">
  <div class="pcba">
    <h1>PCBA测试<sup class="sup">BETA</sup></h1>
    <router-link :to="{ name: 'index'}" style="position: absolute; left:50px; top: 10px;"><img :src="home" alt="home" style="width: 38px;"></router-link>
    
    
    
    <mu-select-field label="在点击的时候显示设备列表信息" v-model="device_type" :maxHeight="300" @change="handlechange">
      <mu-menu-item v-for="item, index in list3" :key="index" :title="item" :value="item"/>
    </mu-select-field>


    
    <!-- 按钮 -->
    <mu-raised-button v-bind:label="label" class="demo-raised-button" v-bind:disabled="!firststbt" secondary @click="startTest"/>
    
    
    
    <div>
      <mu-stepper :activeStep="firststep" v-show="device_type">
        <mu-step v-for="item,index in firststeps" :key="index">
          <mu-step-label>
            {{item}}
          </mu-step-label>
        </mu-step>
      </mu-stepper>
    </div>
    <div class="status" v-bind:class="{success:testStatus=='success'}">
      <h1>成功</h1>
    </div>
    <div class="status" v-bind:class="{fail:testStatus=='fail'}">
      <h1>失败</h1>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import home from '../assets/home.png'
export default {
  name: 'pcba',
  data(){
    return {
      home,
      device_type: '',
      list3: [],
      list31: [],
      list32: [],
      list33: [],
      firststeps: [],
      process: [],
      success: 'success',
      fail: 'fail',
      device_type1: '',
      device_type2: '',
      device_type3: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if(!vm.userName){
        vm.$router.push('login');
      }else{
        vm.list3 = ['GL-AR150','GL-AR750','GL-AR300M' , 'GL-MT300N-V2','GL-MT300N-V2-xinjia', 'GL-MT300N-V3','GL-AR300M-double-flash', 'GL-B1300','GL-MIFI','GL-MIFI-CUSTOM','GL-ENGEL','GL-CORE','GL-AR750S','GL-AR750S-Internet-Switch','GL-X750','GL-X1200','GL-S1300','GL-avira'];
        vm.list31 = ['XV','XW'];
        vm.list32 = ['1','2','3','4'];
        vm.list33 = ['0','1'];
        // 设置用户进入某个页面的开始时间
        vm.$store.commit('setUserStart');
        vm.$store.commit('setstep',{'data':{'step': 'first'}});
      }
    });
  },
  beforeRouteLeave (to, from, next) {
    if(this.firststep != 0){
      alert('你还有设备没有测试完，请确保测试完成!');
      next(false);
    }else{
      this.list3 = [];
      this.device_type = '';
      this.$store.commit('setDeviceType',{'data':{'deviceType': ''}});
      this.$store.commit('setprocess',{'data':{'process': []}});
      this.$store.commit('setUserStop');
      next();
    }
  },
  computed:{
    userName(){
      return this.$store.getters.userName;
    },
    authkey(){
      return this.$store.getters.authkey;
    },
    hostip(){
      return this.$store.getters.hostip;
    },
    firststep(){
      return this.$store.getters.processStep;
    },
    firststbt(){
      return this.$store.getters.thirdstbt;
    },
    // 按钮
    label(){
      return this.$store.getters.label;
    },
    testStatus(){
      return this.$store.getters.testStatus;
    },
  },
  methods:{
    handlechange(val){
      console.log('0000000000000000')
      console.log(val);
      this.device_type = val;
      switch(val){
        case 'GL-AR750':
          this.firststeps = ['连接设备','检测校准','检测内存','测试sd卡','测试重置开关','测试led','测试拨动开关','测试usb设备','测试成功'];
          this.process = ['onconnect','oncalibration','ontestddr','ontestsd','onreset','onled','ontestswitch','ontestusb','onfirstok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        case 'GL-AR750S':
          this.firststeps = ['连接设备','检测校准','检测内存','测试sd卡','测试重置开关','测试led','测试拨动开关','测试usb设备','测试成功'];
          this.process = ['onconnect','oncalibration','ontestddr','ontestsd','onreset','onled','onswitchleftmid','ontestusb','onfirstok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        case 'GL-AR750S-Internet-Switch':
          this.firststeps = ['连接设备','检测校准','检测内存','测试重置开关','测试led','测试拨动开关','测试成功'];
          this.process = ['onconnect','oncalibration','ontestddr','onreset','onled','onswitchleftmid','onfirstok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        case 'GL-B1300':
          this.firststeps = ['连接设备','检测校准','检测内存','测试重置开关','测试led','测试mesh开关','测试usb设备','测试成功'];
          this.process = ['onconnect','oncalibration','ontestddr','onreset','onled','onmeshset','ontestusb','onfirstok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        case 'GL-S1300':
          this.firststeps = ['连接设备','下载测试脚本','检测校准','检测内存','测试重置开关','测试led','测试mesh开关','测试usb设备','测试成功'];
          this.process = ['onconnect','ondowntest','oncalibration','ontestddr','onreset','onled','onmeshset','ontestusb','onfirstok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        case 'GL-avira':
          this.firststeps = ['连接设备','下载测试脚本','检测校准','检测内存','测试重置开关','测试led','测试mesh开关','测试usb设备','测试emmc','测试成功'];
          this.process = ['onconnect','ondowntest','oncalibration','ontestddr','onreset','onled','onmeshset','ontestusb','ontestemmc','onfirstok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        case 'GL-MIFI':
          this.firststeps = ['连接设备','检测校准','检测内存','测试重置开关','测试led','测试sd卡','测试sim卡','测试usb设备','测试成功'];
          this.process = ['onconnect','oncalibration','ontestddr','onreset','onled','ontestsd','ontest3g','ontestusb','onfirstok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        case 'GL-MIFI-CUSTOM':
          this.firststeps = ['连接设备','检测校准','检测内存','测试重置开关','测试led','测试sd卡','测试sim卡','测试usb设备','测试成功'];
          this.process = ['onconnect','oncalibration','ontestddr','onreset','onled','ontestsd','ontest3g','ontestusbmifi','onfirstok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        case 'GL-ENGEL':
          this.firststeps = ['连接设备','检测校准','检测内存','测试重置开关','测试led','测试sd卡','测试usb设备','控制5gLED灯','控制电源检测','测试成功'];
          this.process = ['onconnect','oncalibration','ontestddr','onreset','onled','ontestsd','ontestusb','ongpiofive','onsecondpower','onfirstok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        case 'GL-CORE':
          this.firststeps = ['连接设备','检测校准','检测内存','测试重置开关','测试usb设备','测试成功'];
          this.process = ['onconnect','oncalibration','ontestddr','onreset','ontestusb','oncoreok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        case 'GL-CORE-Wiline':
          this.firststeps = ['连接设备','检测内存','测试重置开关','测试usb设备','测试成功'];
          this.process = ['onconnect','ontestddr','onreset','ontestusb','oncoreok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        case 'GL-MT300N-V3':
          this.firststeps = ['连接设备','检测校准','检测内存','测试重置开关','测试led','测试成功'];
          this.process = ['onconnect','oncalibration','ontestddr','onreset','onled','onfirstok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        case 'GL-AR300M-double-flash':
          this.firststeps = ['连接设备','检测校准','检测内存','测试重置开关','测试led','测试拨动开关','测试usb设备','测试成功'];
          this.process = ['onconnect','oncalibration','ontestddr','onreset','onled','onswitchleftmidright','ontestusb','onfirstok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        case 'GL-X750':
          this.firststeps = ['连接设备','检测校准','检测内存','测试重置开关','测试led','测试sd卡','测试sim卡','测试usb设备','测试成功'];
          this.process = ['onconnect','oncalibration','ontestddr','onreset','onled','ontestsd','ontest3g','ontestusb','onfirstok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        case 'GL-AR300M':
          this.firststeps = ['连接设备','检测内存','测试重置开关','测试led','测试拨动开关','测试usb设备','测试成功'];
          this.process = ['onconnect','ontestddr','onreset','onled','ontestswitch','ontestusb','onfirstok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        case 'GL-X1200':
          this.firststeps = ['连接设备','下载测试脚本','检测校准','检测内存','测试重置开关','测试led','测试sd卡','测试sim卡','测试usb设备','测试单片机','测试GPS设备','测试看门狗','测试成功'];
          this.process = ['onconnect','ondowntest','oncalibration','ontestddr','onreset','onled','ontestsd','ontest3g','ontestusb','ontestmcu','ontestgps','ontestdog','onfirstok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        case 'GL-MT300N-V2':
          this.firststeps = ['连接设备','检测校准','检测内存','测试重置开关','测试led','测试拨动开关','测试usb设备','测试成功'];
          this.process = ['onconnect','oncalibration','ontestddr','onreset','onled','ontestswitch','ontestusb','onfirstok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        case 'GL-MT300N-V2-xinjia':
          this.firststeps = ['连接设备','下载测试脚本','检测校准','检测内存','测试重置开关','测试led','测试拨动开关','测试usb设备','测试成功'];
          this.process = ['onconnect','ondowntest','oncalibration','ontestddr','onreset','onled','ontestswitch','ontestusb','onfirstok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
        default:
          this.firststeps = ['连接设备','检测校准','检测内存','测试重置开关','测试led','测试拨动开关','测试usb设备','测试成功'];
          this.process = ['onconnect','oncalibration','ontestddr','onreset','onled','ontestswitch','ontestusb','onfirstok'];
          this.$store.commit('setprocess',{'data':{'process': this.process}});
          break;
      }
      // 设置当前型号
      this.$store.commit('setDeviceType',{'data':{'deviceType': val}});
    },
    // 开始设置
    startTest(val){
      // 按钮状态设置
      console.log(this.device_type, this.device_type1, this.device_type2, this.device_type3)
      this.$store.commit('settirdstbt');
      const data = {
        // 当前设备型号
        'device_type': this.device_type,
        'device_type1': this.device_type1,
        'device_type2': this.device_type2,
        'device_type3': this.device_type3,
        'index': 0,
        'step': 'first',
      }
      this.$store.dispatch('sendcommand',{'command':'onconnect','payload':data});
      const date = new Date();
      const tdata = {
        'data': {
          'startTime': date.getTime(),
        }
      }
      this.$store.commit('setStartTime',tdata);
    }
  },
  mounted(){
    // 初始化步骤为0
    this.$store.commit('setstep',{'data':{'step': 'first'}});
  }
}
</script>

<style>
.title{
  font-size: 18px;
  margin: 0px auto;
}
.sup{
  font-weight: 100;
}
.success,.fail{
  position: absolute;
  top:100px;
  left: 0px;
  width: 100%;
  text-align: center;
  font-size: 8em;
  font-weight: bolder;
}
h1{
  padding:0px;
  margin: 0px;
  width: 100%;
  text-align: center;
}
.status{
  display: none;
}
.success{
  color: green;
  display: block;
}
.fail{
  color: red;
  display: block;
}
.mu-step-label-circle{
    width: 30px !important;
    height: 30px !important;
    font-size: 28px !important;
    line-height: 30px !important;
    text-align: center;
    overflow: hidden;
    border-radius: 100%;
    color: #fff;
}
.mu-stepper {
  flex-wrap: wrap
}
.mu-step-label{
  font-size: 20px !important;
}
</style>
