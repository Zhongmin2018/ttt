<template>
  <div class="mark">
    <h1 class="title">功率测试<sup class="sup">BETA</sup></h1>
    <router-link :to="{ name: 'index'}" style="position: absolute; left:50px; top: 10px;"><img :src="home" alt="home" style="width: 38px;"></router-link>
    <div class="input_box">
      <mu-select-field label="在点击的时候显示设备列表信息" :maxHeight="300" @change="handlechange">
        <mu-menu-item v-for="(item, index) in list3" :key="index" :title="item" :value="item"/>
      </mu-select-field>
      <mu-raised-button label="清除" class="demo-raised-button" primary @click="clearData"/>
      <mu-table :showCheckbox="showCheckbox">
        <mu-thead slot="header">
          <mu-tr>
            <mu-th tooltip="序号">序号</mu-th>
            <mu-th tooltip="扫码">扫码</mu-th>
            <mu-th tooltip="当前状态">当前状态</mu-th>
            <mu-th tooltip="mac地址">Mac地址状态</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody v-show="device_type">
          <mu-tr v-for="(item,index) in dataList" :key="index">
            <mu-td>{{index+1}}</mu-td>
            <mu-td><input class="code" type="text" v-model="item.code" @change="handlevalchange($event, index)"></mu-td>
            <mu-td :class="item.power == 'PASS' ? 'success': 'fail'">{{item.power}}</mu-td>
            <mu-td :class="item.status == '成功' ? 'success': 'fail'">{{item.status}}</mu-td>
          </mu-tr>
        </mu-tbody>
      </mu-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import jsonp from '../assets/jsonp.js'
import home from '../assets/home.png'
export default {
  name: 'power',
  data(){
    return{
      home,
      showCheckbox: false,
      device_type: '',
      timer: {},
      cpuList:['MTK7620','MTK7628','MTK7628_1','QCA150M','QCA300M'],
      list3: ['GL-AR150','GL-AR300M', 'GL-AR300M-Lite', 'GL-MT300N-V2', 'GL-MT300N','GL-MT300A'],
      dataList: [{
          'code': '',
          'mac': '',
          'power': '请扫码',
          'status': '请扫码',
        }, {
          'code': '',
          'mac': '',
          'power': '请扫码',
          'status': '请扫码',
        },{
          'code': '',
          'mac': '',
          'power': '请扫码',
          'status': '请扫码',
        },{
          'code': '',
          'mac': '',
          'power': '请扫码',
          'status': '请扫码',
        }],
      }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if(!vm.userName){
        vm.$router.push('login');
      }else{
        vm.$store.commit('setUserStart');
      }
    });
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('setUserStop');
    next(true);
  },
  mounted(){
    console.log('power');
  },
  methods:{
    handlechange(val){
      console.log(val)
      this.device_type = val;
      switch(this.device_type) {
        case 'GL-AR150':
          jsonp(`http://${this.hostip}/setinfo?product=QCA150M`, null,(err, data) => {
            console.log(data)
          });
          break;
        case 'GL-AR300M':
          jsonp(`http://${this.hostip}/setinfo?product=QCA300M`, null,(err, data) => {
            console.log(data)
          });
          break;
        case 'GL-AR750':
          jsonp(`http://${this.hostip}/setinfo?product=QCA300M`, null,(err, data) => {
            console.log(data)
          });
          break;
        case 'GL-AR300M-Lite':
          jsonp(`http://${this.hostip}/setinfo?product=QCA300M`, null,(err, data) => {
            console.log(data)
          });
          break;
        case 'GL-MT300N-V2':
          jsonp(`http://${this.hostip}/setinfo?product=MTK7628_1`, null,(err, data) => {
            console.log(data)
          });
          break;
        case 'GL-MT300N':
          jsonp(`http://${this.hostip}/setinfo?product=MTK7620`, null,(err, data) => {
            console.log(data)
          });
          break;
        case 'GL-MT300A':
          jsonp(`http://${this.hostip}/setinfo?product=MTK7620`, null,(err, data) => {
            console.log(data)
          });
          break;
        case 'GL-B1300':
          console.log('hello')
          break;
        default:
          console.log('hello')
      }
    },
    clearData(){
      this.dataList = [{
          'code': '',
          'mac': '',
          'power': '请扫码',
          'status': '请扫码',
        }, {
          'code': '',
          'mac': '',
          'power': '请扫码',
          'status': '请扫码',
        },{
          'code': '',
          'mac': '',
          'power': '请扫码',
          'status': '请扫码',
        },{
          'code': '',
          'mac': '',
          'power': '请扫码',
          'status': '请扫码',
        }];
    },
    handlevalchange(e,ind){
      console.log("handlevalchange()")
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
        console.log(ddns);
        if(ddns){
          axios.get("/api.php",{
            params:{
              'action': 'getDeviceInfo',
              'ddns_name': ddns,
            }
          }).then((res) => {
            mac = res.data[0].mac_address;
            let macString = mac.split(":").join("");
            this.dataList[ind].code = macString;
            this.dataList[ind].status = "扫码成功";
            let that = this;
            setTimeout(() => {
              jsonp(`http://${that.hostip}/start?num=${ind+1}&sn=${macString}`, null,(err, data) => {
                console.log(data)
                if(data.status == '1'){
                  console.log('ok')
                  that.timer[ind+1] = setInterval(()=>{
                    jsonp(`http://${that.hostip}/getinfo?num=${ind+1}`, null,(err, data) => {
                      if(data.Result){
                        clearInterval(that.timer[ind+1]);
                        data.MAC=data.MAC.split(":").join("");
                        that.dataList[ind].power = data.Result;
                        if(data.MAC == macString){
                          that.dataList[ind].status = "成功"
                        }else{
                          that.dataList[ind].status = "失败"
                        }
                        console.log('通过ddns的形式测试')
                        const params = {
                          'action': 'updateDeviceInfo',
                          'ddns_name': ddns,
                          'power_test_name': that.userName,
                          'power_test_time': 'setNow',
                          'power_loss': data.Loss,
                          'power': data.Power,
                          'power_result': data.Result,
                        }
                        that.$store.dispatch('setDataBase', params);
                      }
                    });
                  },1000);
                }
              });
            },1000)
          })
        }else{
          let macString = mac.split(":").join("");
          this.dataList[ind].code = macString;
          this.dataList[ind].status = "扫码成功";
          let that = this;
          setTimeout(() => {
            jsonp(`http://${that.hostip}/start?num=${ind+1}&sn=${macString}`, null,(err, data) => {
              console.log(data)
              if(data.status == '1'){
                console.log('ok')
                that.timer[ind+1] = setInterval(()=>{
                  jsonp(`http://${that.hostip}/getinfo?num=${ind+1}`, null,(err, data) => {
                    if(data.Result){
                      console.log('通过mac地址的形式测试')
                      clearInterval(that.timer[ind+1]);
                      that.dataList[ind].power = data.Result;
                      data.MAC=data.MAC.split(":").join("");
                      if(data.MAC == macString){
                        that.dataList[ind].status = "成功"
                      }else{
                        that.dataList[ind].status = "失败"
                      }
                      axios.get("/api.php",{
                        params:{
                          'action': 'mac2ddns',
                          'mac_address': mac,
                        }
                      }).then((response) => {
                        let ddns = response.data.ddns_name;
                        console.log(ddns);
                        const params = {
                          'action': 'updateDeviceInfo',
                          'ddns_name': ddns,
                          'power_test_name': that.userName,
                          'power_test_time': 'setNow',
                          'power_loss': data.Loss,
                          'power': data.Power,
                          'power_result': data.Result,
                        }
                        that.$store.dispatch('setDataBase', params);
                      })
                    }
                  });
                },1000);
              }
            });
          },1000)
        }
      }
    },
  },
  computed:{
    hostip(){
      return this.$store.getters.hostip;
      // return '192.168.16.12';
    },
    userName(){
      return this.$store.getters.userName;
    },
    userNowtime(){
      return this.$store.getters.userNowTime.toFixed(1);
    }
  }
}
</script>

<style>
.title{
  margin-top: 5%;
}
.sup{
  font-weight: 100;
}
.success {
  background-color: green !important;
}
</style>
