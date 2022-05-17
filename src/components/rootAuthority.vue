<template>
  <div class="mark">
    <h1 class="title">超级权限<sup class="sup">BETA</sup></h1>
    <router-link :to="{ name: 'index'}" style="position: absolute; left:50px; top: 10px;"><img :src="home" alt="home" style="width: 38px;"></router-link>
    <div class="input_box">
      <mu-raised-button label="清除" class="demo-raised-button" secondary @click="cleardata"/>
      <mu-dialog :open="dialog" :title="title || '修改当前值，请再三思考是否修改'" @close="close">
        <mu-text-field label="原因" hintText="请输入修改原因" v-model="reason" type="text" labelFloat/>
        <mu-text-field label="修改值" hintText="请输入修改值" v-model="val" type="text" labelFloat/>
        <mu-flat-button slot="actions" @click="close" primary label="取消"/>
        <mu-flat-button slot="actions" primary @click="upInfo" label="确定"/>
      </mu-dialog>
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
            <mu-th tooltip="used">二维码占用标志</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
          <mu-tr v-for="item,index in tableData" :key="index">
            <mu-td>{{index+1}}</mu-td>
            <mu-td><input type="text" class="code" placeholder="扫码" @change="handcodeput" v-model="codedata[index]"></mu-td>
            <mu-td>{{item.mac_address}}</mu-td>
            <mu-td @click="updateData($event, 'order_pi', item, index)">{{item.order_pi}}</mu-td>

            <mu-td @click="updateData($event, 'order_input_time', item, index)">{{item.order_input_time}}</mu-td>
            <mu-td @click="updateData($event, 'order_input_name', item, index)">{{item.order_input_name}}</mu-td>
            <mu-td @click="updateData($event, 'product_type', item, index)">{{item.product_type}}</mu-td>
            <mu-td @click="updateData($event, 'product_test_time', item, index)">{{item.product_test_time}}</mu-td>

            <mu-td @click="updateData($event, 'product_test_name', item, index)">{{item.product_test_name}}</mu-td>
            <mu-td @click="updateData($event, 'throughput_rx', item, index)">{{item.throughput_rx}}</mu-td>
            <mu-td @click="updateData($event, 'throughput_tx', item, index)">{{item.throughput_tx}}</mu-td>
            <mu-td @click="updateData($event, 'throughpu_test_time', item, index)">{{item.throughpu_test_time}}</mu-td>

            <mu-td @click="updateData($event, 'throughpu_test_name', item, index)">{{item.throughpu_test_name}}</mu-td>
            <mu-td @click="updateData($event, 'used', item, index)">{{item.used}}</mu-td>
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
      dialog: false,
      title: "",
      selected: '',
      selectedItem: {},
      selectedIndex: '',
      val: '',
      reason: '',
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
      changedVal: '',
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
            'operate_event': 'updateProduct',
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
        'operate_event': 'updateProduct',
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
        const redata = res.data[0];
        console.log(redata);
        let glData = {};
        glData = redata;
        _self.tableData[count -2] = glData;
        _self.tableData[count-2].code = ddns;
        _self.tableData.push({
          "con":1,
        });
        _self.code = "";
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
    },
    open () {
      this.dialog = true
    },
    close () {
      this.val = "";
      this.selectedIndex = "";
      this.changedVal = "";
      this.selectedItem = {};
      this.selected = "";
      this.dialog = false
    },
    updateData(e,item,selectedItem,selectedIndex){
      this.selectedItem = selectedItem;
      this.selected = item;
      this.selectedIndex = selectedIndex;
      switch(item){
        case 'order_pi':
          this.title = "修改订单号，请谨慎修改";
          this.changedVal = this.selectedItem.order_pi;
          break;
        case 'order_input_time':
          this.title = "修改订单录入时间，请谨慎修改";
          this.changedVal = this.selectedItem.order_input_time;
          break;
        case 'order_input_name':
          this.title = "修改订单录入者名字，请谨慎修改";
          this.changedVal = this.selectedItem.order_input_name;
          break;
        case 'product_type':
          this.title = "修改设备型号，请谨慎修改";
          this.changedVal = this.selectedItem.product_type;
          break;
        case 'product_test_time':
          this.title = "修改产品测试时间，请谨慎修改";
          this.changedVal = this.selectedItem.product_test_time;
          break;
        case 'product_test_name':
          this.title = "修改产品测试者名字，请谨慎修改";
          this.changedVal = this.selectedItem.product_test_name;
          break;
        case 'throughput_rx':
          this.title = "修改吞吐量rx值，请谨慎修改";
          this.changedVal = this.selectedItem.throughput_rx;
          break;
        case 'throughput_tx':
          this.title = "修改吞吐量tx值，请谨慎修改";
          this.changedVal = this.selectedItem.throughput_tx;
          break;
        case 'throughpu_test_time':
          this.title = "修改吞吐量测试时间，请谨慎修改";
          this.changedVal = this.selectedItem.throughpu_test_time;
          break;
        case 'throughpu_test_name':
          this.title = "修改吞吐量测试者名字，请谨慎修改";
          this.changedVal = this.selectedItem.throughpu_test_name;
          break;
        case 'used':
          this.title = "修改二维码标志，请谨慎修改";
          this.changedVal = this.selectedItem.used;
          break;
      }
      if(this.selectedItem.ddns_name){
        this.open();
      }
    },
    upInfo(){
      let data = {
        action: 'updateDeviceInfo',
        'ddns_name':this.selectedItem.ddns_name,
      }
      const that = this;
      switch(this.selected){
        case 'order_pi':
          data.order_pi = this.val;
          break;
        case 'order_input_time':
          if(this.val == ""){
            data.order_input_time = this.val;
          }else{
            data.order_input_time = "setNow";
          }
          break;
        case 'order_input_name':
          data.order_input_name = this.val;
          break;
        case 'product_type':
          data.product_type = this.val;
          break;
        case 'product_test_time':
          if(this.val == ""){
            data.product_test_time = this.val;
          }else{
            data.product_test_time = 'setNow';
          }
          break;
        case 'product_test_name':
          data.product_test_name = this.val;
          break;
        case 'throughput_rx':
          data.throughput_rx = this.val;
          break;
        case 'throughput_tx':
          data.throughput_tx = this.val;
          break;
        case 'throughpu_test_time':
          if(this.val == ''){
            data.throughpu_test_time = this.val;
          }else{
            data.throughpu_test_time = 'setNow';
          }
          break;
        case 'throughpu_test_name':
          data.throughpu_test_name = this.val;
          break;
        case 'used':
          if(this.val == "0"){
            data.used = '0';
          }else if(this.val == "1"){
            data.used = '1';
          }else{
            alert("请输入0或者1");
            return 
          }
          break;
      }
      if(!that.reason){
        alert('请填写修改的原因！！！')
        return
      }
      axios.put('/api.php',{
        params: data
      }).then((resp) => {
        axios.get('/api.php',{
          params: {
            action: 'getDeviceInfo',
            'ddns_name':this.selectedItem.ddns_name,
          }
        }).then((response) => {
          console.log("1111111111122222222222333333333333")
          console.log(response.data)
          console.log(typeof response.data)
      
          axios.post('/api.php',{
            params: {
              'action': 'addOperationInfo',
              'user_name': that.userName,
              'machine_hostip': that.hostip,
              'user_time': that.userNowTime,
              'operate_event': 'updateProduct',
              'operate_message': '修改了'+  response.data[0].mac_address+"设备的"+that.selected+"值，将"+that.changedVal+"修改为"+this.val+"|修改原因："+that.reason,
            }
          }).then((res) => {
            console.log(response);
            this.tableData[this.selectedIndex] = response.data[0];
            this.close();
          })
        })
      });
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
