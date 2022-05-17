<template>
  <div class="mark">
    <h1 class="title">出厂产品信息查询<sup class="sup">BETA</sup></h1>
    <router-link :to="{ name: 'index'}" style="position: absolute; left:50px; top: 10px;"><img :src="home" alt="home" style="width: 38px;"></router-link>
    <div class="input_box">
      <mu-raised-button label="清除" class="demo-raised-button" secondary @click="cleardata"/>
      <mu-table :showCheckbox="showCheckbox">
        <mu-thead slot="header">
          <mu-tr>
            <mu-th tooltip="序号">序号</mu-th>
            <mu-th tooltip="code_ddns">扫码</mu-th>
            <mu-th tooltip="mac_address">mac地址</mu-th>
            <mu-th tooltip="order_pi ">订单号</mu-th>

            <mu-th tooltip="order_input_time">录入时间</mu-th>
            <mu-th tooltip="order_input_name">订单录入者</mu-th>
            <mu-th tooltip="product_type">设备类型</mu-th>
            <mu-th tooltip="product_test_time">产品测试时间</mu-th>

            <mu-th tooltip="product_test_name">产品测试者</mu-th>
            <mu-th tooltip="throughput_rx">吞吐量rx值</mu-th>
            <mu-th tooltip="throughput_tx">吞吐量tx值</mu-th>
            <mu-th tooltip="throughpu_test_time">吞吐量测试时间</mu-th>

            <mu-th tooltip="throughpu_test_name">吞吐量测试者</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
          <mu-tr v-for="(item,index) in tableData" :key="index">
            <mu-td>{{index+1}}</mu-td>
            <mu-td><input type="text" class="code" placeholder="扫码" @change="handcodeput" v-model="codedata[index]"></mu-td>
            <mu-td>{{item.mac_address}}</mu-td>
            <mu-td>{{item.order_pi}}</mu-td>

            <mu-td>{{item.order_input_time}}</mu-td>
            <mu-td>{{item.order_input_name}}</mu-td>
            <mu-td>{{item.product_type}}</mu-td>
            <mu-td>{{item.product_test_time}}</mu-td>

            <mu-td>{{item.product_test_name}}</mu-td>
            <mu-td>{{item.throughput_rx}}</mu-td>
            <mu-td>{{item.throughput_tx}}</mu-td>
            <mu-td>{{item.throughpu_test_time}}</mu-td>

            <mu-td>{{item.throughpu_test_name}}</mu-td>
          </mu-tr>
        </mu-tbody>
      </mu-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import home from '../assets/home.png'
export default {
  name: 'Mark',
  data () {
    return {
      //panel是否显示
      timer: "",
      code: "",
      home,
      panelStatus1: false,
      panelStatus2: false,
      dataSource: [],
      company: '',
      tableData: [
        {
          "con": 1,
        },{
          "con": 1,
        }
      ],
      codedata:[

      ],
      showCheckbox: false,
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if(!vm.userName){
        vm.$router.push('login');
      }else{
        vm.$store.commit('setUserStart');
        axios.post('/api.php',{
          params: {
            'action': 'addOperationInfo',
            'user_name': vm.userName,
            'machine_hostip': vm.hostip,
            'user_time': vm.userNowTime,
            'operate_event': 'checkProduct',
          }
        }).then((res) => {
          if(res.data.status == 'ok'){
            console.log('ok');
          }
        })
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    const that = this;
    this.$store.commit('setUserStop');
    axios.post('/api.php',{
      params: {
        'action': 'addOperationInfo',
        'user_name': that.userName,
        'machine_hostip': that.hostip,
        'user_time': that.userNowTime,
        'operate_event': 'checkProduct',
      }
    }).then((res) => {
      console.log(res);
      if(res.data.status == 'ok'){
        next();
      }else{
        next();
      }
    });
  },
  computed:{
    userName(){
      return this.$store.getters.userName;
    },
    hostip(){
      return this.$store.getters.hostip;
    },
    userNowTime(){
      return this.$store.getters.userNowTime.toFixed(1);
    },
    authkey(){
      return this.$store.getters.authkey;
    }
  },
  methods: {
    handcodeput(e){
      const code = e.target.value;
      const list = code.split(" ");
      const len = code.length;
      const _self =this;
      if(len==24&&list.length==2 || len==17&&list.length==1 || len==42&&list.length==3){
        let ddns = ""
        if(code.length ==24){
          if(list[0].length < list[1].length){
            ddns = list[0];
          }else{
            ddns = list[1];
          }
          _self.chec_mac(ddns,_self.tableData.length);
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
          _self.chec_mac(ddns,_self.tableData.length);
        }
        if(code.length == 17){
          axios.get("/api.php",{
            params:{
              action: 'mac2ddns',
              mac_address: code,
            }
          }).then((response) => {
            console.log(response);
            ddns = response.data.ddns_name;
            _self.chec_mac(ddns,_self.tableData.length);
          })
        }
      }
    },
    chec_mac(ddns,count){
      console.log(ddns);
      console.log(count);
      const _self = this;
      axios.get("/api.php",{
        params:{
          'action': 'getDeviceInfo',
          'ddns_name': ddns,
        }
      }).then((res) => {
        console.log(res)
        let mac = res.data[0].mac_address;
        let device_type = res.data[0].product_type;
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
        const redata = res.data[0];
        console.log(redata);
        if(device_type && device_type.indexOf('AR750') != -1 || device_type && device_type.indexOf('B1300') != -1){
          console.log('这个是5G产品');
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
          console.log(nextMac)
          axios.get("/api.php",{
              params:{
                action: 'mac2ddns',
                mac_address: nextMac,
              }
          }).then((respon) => {
            console.log(respon);
            let nextDdns = respon.data.ddns_name;
            console.log(nextDdns);
            axios.get('/api.php',{
              params:{
                'action': 'getDeviceInfo',
                'ddns_name': nextDdns,
              }
            }).then((res) => {
              console.log(res);
              const red = res.data[0];
              console.log(red);
              let glDatae = {};
              glDatae= red;
              let glData = {};
              glData = redata;
              _self.tableData[count-2] = glData;
              _self.tableData[count-2].code = ddns;
              if(glDatae.throughput_rx){
                _self.tableData[count-2].throughput_rx =_self.tableData[count-2].throughput_rx+"/"+glDatae.throughput_rx;
              }
              if(glDatae.throughput_tx){
                _self.tableData[count-2].throughput_tx =_self.tableData[count-2].throughput_tx+"/"+glDatae.throughput_tx;
              }
              console.log(_self.tableData[count-2])
              _self.tableData.push({
                "con":1,
              });
              _self.code = "";
            })
          })
        }else{
          let glData = {};
          glData = redata;
          _self.tableData[count-2] = glData;
          _self.tableData[count-2].code = ddns;
          _self.tableData.push({
            "con":1,
          });
          _self.code = "";
        }
      });
    },
    cleardata(){
      const that = this;
      that.codedata = [];
      that.tableData = [
        {
          "con": 1,
        },
        {
          "con": 1,
        }]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title{
  font-size: 18px;
  margin: 0px auto;
}
.sup{
  font-weight: 100;
}
.code:focus{
  animation: myfirst 2.5s;
}
.code{
  width:100%;
  height: 35px;
  outline: none;
  border: 0px;
  border-bottom: 2px solid blue;
}
@keyframes myfirst
{
from {
  border-bottom: 1px solid #fff;
}
to {
  border-bottom: 2px solid red;
}
}
.active{
  background-color: #84ffff !important;
}
</style>
