<template>
    <div class="date_picker">
      <h1 class="title">订单信息查询<sup class="sup">BETA</sup></h1>
      <router-link :to="{ name: 'index'}" style="position: absolute; left:50px; top: 10px;"><img :src="home" alt="home" style="width: 38px;"></router-link>
        <h3 class="title">总共{{total}}套</h3>
        <div class="date_input_box">
          <download :data="tableData" :fields="tablefields" class="btn btn-default" :name= "reslt1+' '+reslt2+'.xls'">导出excel</download>
            <mu-date-picker class="date-picker" hintText="请选择开始日期" v-model="reslt1"/>
            <mu-raised-button label="清除开始日期" class="demo-raised-button" primary @click="clearstart"/>
            <mu-date-picker class="date-picker" hintText="请选择结束日期" v-model="reslt2"/>
            <mu-raised-button label="清除结束日期" class="demo-raised-button" secondary @click="clearstop"/>
            <mu-auto-complete hintText="请输入公司名字" @input="handleInput" :dataSource="dataSource" @change="handlechange" v-model="order_pi"/>
            <mu-raised-button label="清除公司名字" class="demo-raised-button" @click="clearOrderPi"/>
            <mu-raised-button label="查询" class="demo-raised-button" @click="serch"/>
        </div>

        <mu-table :showCheckbox="showCheckbox" id="excelbaner">
          <mu-thead slot="header">
            <mu-tr>
              <mu-th tooltip="序号">序号</mu-th>
              <mu-th tooltip="mac_address">mac地址</mu-th>
              <mu-th tooltip="ddn_name">ddns_name</mu-th>
              <mu-th tooltip="SN1">SN1</mu-th>

              <mu-th tooltip="SN2(客户用)">SN2(客户用)</mu-th>
              <mu-th tooltip="order_pi">订单号</mu-th>
              <mu-th tooltip="order_input_time">录入时间</mu-th>
              <mu-th tooltip="order_input_name">订单录入者</mu-th>

              <mu-th tooltip="throughput_rx">吞吐量rx值</mu-th>
              <mu-th tooltip="throughput_tx">吞吐量tx值</mu-th>
              <mu-th tooltip="product_type">设备类型</mu-th>
            </mu-tr>
          </mu-thead>
          <mu-tbody>
            <mu-tr v-for="(item,index) in tableData" :key="index" :selected="item.selected">
              <mu-td>{{index+1}}</mu-td>
              <mu-td>{{item.mac_address}}</mu-td>
              <mu-td>{{item.ddns_name}}</mu-td>
              <mu-td>{{item.sn_back_up}}</mu-td>

              <mu-td>{{item.sn_now_use}}</mu-td>
              <mu-td>{{item.order_pi}}</mu-td>
              <mu-td>{{item.order_input_time}}</mu-td>
              <mu-td>{{item.order_input_name}}</mu-td>

              <mu-td>{{item.throughput_rx}}</mu-td>
              <mu-td>{{item.throughput_tx}}</mu-td>
              <mu-td>{{item.product_type}}</mu-td>
            </mu-tr>
          </mu-tbody>
        </mu-table>
    </div>
</template>
<script>
  import axios from 'axios'
  import home from '../assets/home.png'
  export default {
    name: 'datepicker',
    components:{
      "download": resolve => require(['vue-json-excel'], resolve),
    },
    data () {
      return {
        order_pi: '',
        home,
        dataSource: [],
        showCheckbox: false,
        //保存选择的年月日
        reslt1: '',
        reslt2: '',
        tableData: [],
        tablefields:{
          "order_pi": "公司名字",
          "mac_address": "mac地址",
          "order_input_time": "入库时间",
        }
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
              'operate_event': 'checkData',
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
          'operate_event': 'checkData',
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
    computed: {
      //根据选择的年月计算最终显示的结果
      total:function(){
        return this.tableData.length
      },
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
      clearstart(){
        this.reslt1 = "";
      },
      clearstop(){
        this.reslt2 ="";
      },
      clearOrderPi(){
        this.order_pi = "";
      },
      handlechange (val) {
        this.order_pi = val;
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
      serch: function(){
        const _self = this;
        _self.tableData = [];
        let start_time = _self.reslt1;
        let stop_time = _self.reslt2;
        if(start_time == "" && stop_time){
          start_time = stop_time;
        }else if(stop_time == "" && start_time){
          stop_time = start_time;
        }
        console.log(start_time,'and',stop_time,'and',_self.order_pi);
        axios.get('/api.php', {
          params: {
            'action': 'macSerch',
            'start_time': start_time,
            'stop_time': stop_time,
             'order_pi': _self.order_pi
          }
        })
        .then(function (response) {
          console.log(response);
          if(response.data !="Query failed")
            _self.tableData = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
        console.log(start_time);
        console.log(stop_time);
        console.log(this.order_pi);
      }
    }
  }
</script>
<style lang="css" scoped>
.title{
  font-size: 18px;
  margin: 0px auto;
}
.title{
  color: #000;
}
.sup{
  font-weight: 100;
}
.btn{
  margin-right: 30px;
}
.date-picker{
  width: 120px!important;
  text-indent: 0px;
  text-align:left!important;
}
</style>
