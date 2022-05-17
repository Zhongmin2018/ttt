<template>
  <div class="mark">
    <h1 class="title">产品出厂录入<sup class="sup">BETA</sup></h1>
    <router-link :to="{ name: 'index'}" style="position: absolute; left:50px; top: 10px;"><img :src="home" alt="home" style="width: 38px;"></router-link>
    <div class="input_box">
      <mu-auto-complete hintText="请输入公司名字" @input="handleInput" :dataSource="dataSource" @change="handlechange" v-model="order_pi" />
      <mu-raised-button label="清除订单号" class="demo-raised-button" primary @click="clearOrderPi"/>
      <mu-raised-button label="清除查询号" class="demo-raised-button" secondary @click="cleardata"/>
      <mu-table :showCheckbox="showCheckbox">
        <mu-thead slot="header">
          <mu-tr>
            <mu-th tooltip="序号">序号</mu-th>
            <mu-th tooltip="code_ddns">code_ddns</mu-th>
            <mu-th tooltip="mac_address">mac地址</mu-th>
            <mu-th tooltip="product_type">设备类型</mu-th>

            <mu-th tooltip="order_pi">订单号</mu-th>
            <mu-th tooltip="order_input_time">录入时间</mu-th>
            <mu-th tooltip="order_input_name">订单录入者</mu-th>
            <mu-th tooltip="throughput_rx">吞吐量rx值</mu-th>

            <mu-th tooltip="throughput_tx">吞吐量tx值</mu-th>
            <mu-th tooltip="throughpu_test_name">吞吐量测试者</mu-th>

          </mu-tr>
        </mu-thead>
        <mu-tbody v-show="order_pi">
          <mu-tr v-for="(item,index) in tableData" :key="index" :class="{'active': item.update == 'no'}">
            <mu-td>{{index+1}}</mu-td>
            <mu-td><input class="code" type="text" v-model="item.code" @change="handcodeput"></mu-td>
            <mu-td>{{item.mac_address}}</mu-td>
            <mu-td>{{item.product_type}}</mu-td>

            <mu-td>{{item.order_pi}}</mu-td>
            <mu-td>{{item.order_input_time}}</mu-td>
            <mu-td>{{item.order_input_name}}</mu-td>
            <mu-td>{{item.throughput_rx}}</mu-td>

            <mu-td>{{item.throughput_tx}}</mu-td>
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
      dialog: false,
      panelStatus1: false,
      panelStatus2: false,
      dataSource: [],
      deltedata: '',
      order_pi: '',
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
      password: '',
      title: '',
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
            'operate_event': 'order_input',
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
        'operate_event': 'order_input',
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
    // 扫码处理方法
    handcodeput(e){
      const code = e.target.value;
      const list = code.split(" ");
      const len = code.length;
      const _self =this;
      // 如果要是没有填写订单号，初始化数据
      if(!this.order_pi){
        this.code = "";
        this.tableData = [{"con":1},{"con":1}];
      }
      //保证二维码组成的长度正确和已经填写了点单号的前提下
      if(len==24&&list.length==2&&this.order_pi || len==17&&list.length==1&&this.order_pi || len==42&&list.length==3&&this.order_pi){
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
                'action': 'mac2ddns',
                'mac_address': code,
              }
            }).then((response) => {
              ddns = response.data.ddns_name;
              _self.chec_mac(ddns,_self.tableData.length);
            })
          }
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
        if(res.data[0].order_pi){
          _self.tableData[count -2] = res.data[0];
          _self.tableData[count-2].code = ddns;
          _self.tableData[count-2].update = 'no';
          _self.tableData.push({
            "con":1,
          });
          _self.code = "";
        }else{
          axios.put('/api.php',{
            params:{
              'action': 'updateDeviceInfo',
              'ddns_name': ddns,
              'order_pi': _self.order_pi,
              'order_input_time': 'setNow',
              'order_input_name': _self.userName
            }
          }).then((response) => {
            if(response.data.status == "ok"){
              axios.get("/api.php",{
                params:{
                  'action': 'getDeviceInfo',
                  'ddns_name': ddns,
                }
              }).then((resp) => {
                if(resp.data[0].order_pi){
                  _self.tableData[count -2] = resp.data[0];
                  _self.tableData[count-2].code = ddns;
                  _self.tableData[count-2].update = 'yes';
                  _self.tableData.push({
                    "con":1,
                  });
                  _self.code = "";
                }
              })
            }
          })
        }
      });
    },
    cleardata(){
      this.codedata = [];
      this.tableData = [
        {
          "con": 1,
        },{
          "con": 1,
        }
      ]
    },
    clearOrderPi(){
      this.order_pi ="";
      this.codedata = [];
      this.tableData = [
        {
          "con": 1,
        },{
          "con": 1,
        }
      ]
    },
    handlechange (val) {
      this.order_pi = val;
      console.log("chnage",val)
    },
    handleInput (val) {
      const _self = this;
      axios.get('/api.php',{
        params: {
          'action': 'likeOrderPi',
          'order_pi':_self.order_pi,
        }
      })
      .then(function(response) {
        console.log(response.data);
        let data = []
        for(let i =0;i<response.data.length;i++){
          data.push(response.data[i].order_pi);
        }
        _self.dataSource = data;
      })
      .catch(function(error){
        console.log(error);
      })
    },
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
  border: 0 solid #000;
  outline: none;
  border-bottom: 2px solid blue;
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
.active{
  background-color: #84ffff !important;
}
</style>
