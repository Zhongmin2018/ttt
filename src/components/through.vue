<template lang="html">
  <div class="through">
    <h1 class="title">吞吐量测试<sup class="sup">BETA</sup></h1>
    <router-link :to="{ name: 'index'}" style="position: absolute; left:50px; top: 10px;"><img :src="home" alt="home" style="width: 38px;"></router-link>
    <mu-select-field label="在点击的时候显示设备列表信息" :maxHeight="300" @change="handlechange">
      <mu-menu-item v-for="item, index in list3" :key="index" :title="item" :value="item"/>
    </mu-select-field>
    <span style="color:red;">{{limspeedon}}M/s</span>
    <span style="color:red;">{{limspeeddown}}M/s</span>
    <mu-raised-button label="开始测试" class="demo-raised-button" v-bind:disabled="thirdstbt" secondary @click="startTest"/>
    <mu-raised-button label="清除数据" class="demo-raised-button" v-bind:disabled="thirdstbt" secondary @click="clearTirdData"/>
    <span style="color:red;">机用平均速度{{meanTime}}s/g</span>
    <mu-table :showCheckbox="false" v-show="showTabel">
        <mu-thead>
          <mu-tr>
            <mu-th>序号</mu-th>
            <mu-th>扫码</mu-th>
            <mu-th>当前状态</mu-th>
            <mu-th>speed_rx</mu-th>
            <mu-th>speed_tx</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
          <mu-tr v-for="item,ind in dataList" :key="ind">
            <mu-td>{{ind+1}}</mu-td>
            <mu-td><input class="code" type="text" v-model="item.code" @change="handlevalchange($event, ind)"></mu-td>
            <mu-td>{{item.status}}</mu-td>
            <mu-td :class="limspeedon>parseInt(item.speed_rx)? 'success': 'fail'">{{item.speed_rx}}</mu-td>
            <mu-td :class="limspeeddown>parseInt(item.speed_tx)? 'success': 'fail'">{{item.speed_tx}}</mu-td>
          </mu-tr>
        </mu-tbody>
      </mu-table>
  </div>
</template>

<script>
import axios from 'axios'
import home from '../assets/home.png'
export default {
  name: "through",
  data(){
    return {
      device_type: "",
      showTabel: false,
      limspeedon: '',
      limspeeddown: '',
      home,
      list3: ['GL-AR150','GL-AR750','GL-AR750-5G','GL-AR300M', 'GL-AR300M-Lite', 'GL-MT300N-V2', 'GL-MT300N','GL-MT300A','GL-MIFI-nobattery','GL-CORE','GL-B1300','GL-B1300-5G'],
      process: ['onpretreat','onmacpare','onspeedrx','onspeedtx'],
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if(!vm.userName){
        vm.$router.push('login');
      }else{
        vm.$store.commit('setUserStart');
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    if(this.dataList.length >= 3){
      alert('你还有设备没有测试完，请确保测试完成！或清除数据');
      next(false);
    }else{
      this.$store.commit('setUserStop');
      next();
    }
  },
  methods:{
    handlechange(val){
      if(val){
        this.device_type = val;
        const data = {
          'device_type': this.device_type,
          'index': 0,
          'step': 'third',
        }
        this.$store.dispatch('sendcommand',{'command':'onconnect','payload':data});
        this.$store.commit('setDeviceType',{'data':{'deviceType': val}});
        this.$store.commit('setprocess',{'data':{'process': this.process}});
        this.showTabel = true;
        switch(this.device_type) {
          case 'GL-AR150':
            this.limspeedon = 35;
            this.limspeeddown = 35;
            break;
          case 'GL-AR300M':
            this.limspeeddown = 75;
            this.limspeedon = 75;
            break;
          case 'GL-AR750':
            this.limspeeddown = 75;
            this.limspeedon = 75;
            break;
          case 'Gl-AR750-5G':
            this.limspeeddown = 0;
            this.limspeedon = 0;
            break;
          case 'GL-AR300M-Lite':
            this.limspeeddown = 75;
            this.limspeedon = 75;
            break;
          case 'GL-MT300N-V2':
            this.limspeedon = 70;
            this.limspeeddown = 70;
            break;
          case 'GL-MT300N':
            this.limspeedon = 40;
            this.limspeeddown = 90;
            break;
          case 'GL-MT300A':
            this.limspeedon = 60;
            this.limspeeddown = 90;
            break;
          case 'GL-MIFI-nobattery':
            this.limspeedon = 60;
            this.limspeeddown = 90;
            break;
          case 'GL-CORE':
            this.limspeeddown = 0;
            this.limspeedon = 0;
            break;
          case 'GL-B1300':
            this.limspeeddown = 0;
            this.limspeedon = 0;
            break;
          case 'GL-B1300-5G':
            this.limspeeddown = 0;
            this.limspeedon = 0;
          default:
            this.limspeeddown = 35;
            this.limspeedon = 35;
        }
      }
    },
    handlevalchange(e,ind){
      const code = this.dataList[ind].code;
      const list = code.split(" ");
      const len = code.length;
      const _self =this;
      let mac = "";
      let ddns = "";
      if(len==24&&list.length==2 || len==17&&list.length==1 || len==42&&list.length==3){
        if(code.length ==24){
          if(list[0].length < list[1].length){
            ddns = list[0];
          }else{
            ddns = list[1];
          }
        }
        if(code.length == 42){
          if(list[0].indexOf(":") != -1){
            if(list[1].length < list[2].length){
              ddns = list[1]
            }else{
              ddns = list[2]
            }
          }else if(list[1].indexOf(":") != -1){
            if(list[0].length < list[2].length){
              ddns = list[0]
            }else{
              ddns = list[2]
            }
          }else if (list[2].indexOf(":") != -1) {
            if(list[0].length < list[1].length){
              ddns = list[0];
            }else{
              ddns = list[1];
            }
          }
        }
        if(code.length == 17){
          mac = code;
        }
        if(ddns){
          axios.get("/api.php",{
            params:{
              'action': 'getDeviceInfo',
              'ddns_name': ddns,
            }
          }).then((res) => {
            mac = res.data[0].mac_address;
            let macString = mac.split(":").join("");
            let macInt = parseInt(macString,16)+1;
            let nextMac = macInt.toString(16).toUpperCase();
            let newcode = nextMac.split("",12);
            let newstr = "";
            for(var i =0;i<12;i++){
            	newstr+=newcode[i]
            	if(i%2 && i!= 11){
            		console.log(newcode[i])
            		newstr+=":"
            	}
            }
            console.log(newstr)
            nextMac = newstr
            axios.get("/api.php",{
                params:{
                  action: 'mac2ddns',
                  mac_address: nextMac,
                }
            }).then((response) => {
              nextDdns = response.data.ddns_name;
              console.log(nextDdns)
              const cdata = {
                'data': {
                  'index': ind,
                  'mac': mac,
                  'ddns_name': ddns,
                  'nextDdns': nextDdns,
                  'status': '扫码成功'
                }
              }
              this.$store.commit('setTirdData',cdata);
            });
          })
        }else{
          axios.get("/api.php",{
            params:{
              action: 'mac2ddns',
              mac_address: mac,
            }
          }).then((response) => {
            ddns = response.data.ddns_name;
            let macString = mac.split(":").join("");
            let macInt = parseInt(macString,16)+1;
            let nextMac = macInt.toString(16).toUpperCase();
            let newcode = nextMac.split("",12);
            let newstr = "";
            for(var i =0;i<12;i++){
            	newstr+=newcode[i]
            	if(i%2 && i!= 11){
            		console.log(newcode[i])
            		newstr+=":"
            	}
            }
            console.log(newstr)
            nextMac = newstr
            axios.get("/api.php",{
                params:{
                  action: 'mac2ddns',
                  mac_address: nextMac,
                }
            }).then((response) => {
              nextDdns = response.data.ddns_name;
              console.log(nextDdns)
              const cdata = {
                'data': {
                  'index': ind,
                  'mac': mac,
                  'ddns_name': ddns,
                  'nextDdns': nextDdns,
                  'status': '扫码成功'
                }
              }
              this.$store.commit('setTirdData',cdata);
            });
          })
        }
      }
    },
    clearTirdData(){
      const _self = this;
      this.$store.commit('clearTirdData');
    },
    startTest(){
      this.$store.commit('settirdstbt');
      const data = {
        'index': 0,
        'mac_address': this.dataList[0].mac,
      }
      this.$store.dispatch('sendcommand',{'command':'onpretreat','payload':data});
      const date = new Date();
      const tdata = {
        'data': {
          'startTime': date.getTime(),
        }
      }
      this.$store.commit('setStartTime',tdata);
    }
  },
  computed:{
    dataList(){
      return this.$store.getters.thirdData;
    },
    hostip(){
      return this.$store.getters.hostip;
    },
    thirdstbt(){
      return this.$store.getters.thirdstbt;
    },
    meanTime(){
      return this.$store.getters.meanTime.toFixed(2);
    },
    userName(){
      return this.$store.getters.userName;
    },
    authkey(){
      return this.$store.getters.authkey;
    },
    userNowTime(){
      return this.$store.getters.userNowTime.toFixed(1);
    }
  },
  mounted(){
    this.$store.commit('setstep',{'data':{'step': 'third'}});
    const _self = this;
    // window.onbeforeunload = function(event){
    //   clearInterval(_self.usetimer);
    //   return true;
    // }
  }
}
</script>

<style lang="css">
.title{
  font-size: 18px;
  margin: 0px auto;
}
.sup{
  font-weight: 100;
}
#autocomplete{
  margin-top: -15px;
}
.code{
  width:100%;
  height: 22px;
  border: 0 solid #000;
  outline: none;
  border-bottom: 2px solid blue;
}
.code:focus{
  animation: myfirst 2.5s;
}
@keyframes myfirst
{
from {
  border-bottom: 2px solid #fff;
}
to {
  border-bottom: 2px solid red;
}
}
.fail {
  background-color: green !important;
}
</style>
