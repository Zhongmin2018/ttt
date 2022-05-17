<template>
    <div class="date_picker">
      <h1 class="title">不良品维修录入/查询<sup class="sup">BETA</sup></h1>
      <router-link :to="{ name: 'index'}" style="position: absolute; left:50px; top: 10px;"><img :src="home" alt="home" style="width: 38px;"></router-link><br/>
        <div class="date_input_box">
            <input type="text" class="code" placeholder="扫码" v-model="code" @change="handcodeput">
            <mu-text-field hintText="请输入处理结果" v-model="reject_repair" :errorText="multiLineInputErrorText" @textOverflow="handleMultiLineOverflow" multiLine :rows="1" :rowsMax="20" :maxLength="300"/>
            <mu-raised-button label="录入/查询" class="demo-raised-button" @click="serch"/>
        </div>
        <mu-dialog :open="dialog" title="不良品简述详情" @close="close">
          {{reject_detail}}
          <mu-flat-button slot="actions" @click="close" primary label="取消"/>
          <mu-flat-button slot="actions" primary @click="close" label="确定"/>
        </mu-dialog>
        <mu-table :showCheckbox="showCheckbox" id="excelbaner">
          <mu-thead slot="header">
            <mu-tr>
              <mu-th tooltip="序号">序号</mu-th>
              <mu-th tooltip="mac_address">mac地址</mu-th>
              <mu-th tooltip="product_type">设备类型</mu-th>
              <mu-th tooltip="reject_sketch">不良信息简述</mu-th>
              
              <mu-th tooltip="reject_input_name">不良信息录入人</mu-th>
              <mu-th tooltip="reject_input_time">不良信息录入时间</mu-th>
              <mu-th tooltip="reject_repair">处理结果</mu-th>
              <mu-th tooltip="reject_repair_name">处理人</mu-th>

              <mu-th tooltip="reject_repair_time">处理时间</mu-th>
            </mu-tr>
          </mu-thead>
          <mu-tbody>
            <mu-tr v-for="item,index in tableData" :key="index" :selected="item.selected">
              <mu-td>{{index+1}}</mu-td>
              <mu-td>{{item.mac_address}}</mu-td>
              <mu-td>{{item.product_type}}</mu-td>
              <mu-td @click="handleClick($event, item)">{{item.reject_sketch}}</mu-td>
              <mu-td>{{item.reject_input_name}}</mu-td>
              <mu-td>{{item.reject_input_time}}</mu-td>
              <mu-td>{{item.reject_repair}}</mu-td>
              <mu-td>{{item.reject_repair_name}}</mu-td>

              <mu-td>{{item.reject_repair_time}}</mu-td>
            </mu-tr>
          </mu-tbody>
        </mu-table>
    </div>
</template>
<script>
  import axios from 'axios'
  import home from '../assets/home.png'
  export default {
    name: 'repair',
    data () {
      return {
        home,
        reject_repair: '',
        code: '',
        ddns_name: '',
        reject_detail: '',
        dialog: false,
        dataSource: [],
        showCheckbox: false,
        multiLineInputErrorText: '',
        //保存选择的年月日
        tableData: [],
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
              'operate_event': 'checkRepairEnter',
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
          'operate_event': 'checkRepairLeave',
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
      open () {
        this.dialog = true
      },
      close () {
        this.dialog = false
      },
      handleClick(e,item){
        this.reject_detail = item.reject_detail;
        this.open();
      },
      handcodeput(e){
        const code = this.code;
        const list = code.split(" ");
        const len = code.length;
        const _self =this;
        if(len==24&&list.length==2 || len==17&&list.length==1 || len==42&&list.length==3){
          console.log(code);
          console.log(list);
          console.log(len);
          let ddns = ""
          if(code.length ==24){
            if(list[0].length < list[1].length){
              ddns = list[0];
            }else{
              ddns = list[1];
            }
            _self.ddns_name = ddns;
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
            _self.ddns_name = ddns;
          }
          if(code.length == 17){
            axios.get("/api.php",{
              params:{
                'action': 'mac2ddns',
                'mac_address': code,
              }
            }).then((response) => {
              _self.ddns_name = response.data.ddns_name;
            })
          }
        }
      },
      handleMultiLineOverflow (isOverflow) {
        this.multiLineInputErrorText = isOverflow ? '超过啦！！！！' : ''
      },
      serch: function(){
        const _self = this;
        console.log(this.reject_repair)
        if(this.reject_repair){
          axios.put('/api.php',{
            params:{
              'action': 'updateDeviceInfo',
              'ddns_name': _self.ddns_name,
              'reject_repair_name': _self.userName,
              'reject_repair': _self.reject_repair,
              'reject_repair_time': 'setNow'
            }
          }).then((res) => {
            if(res.data.status == 'ok'){
              axios.get('/api.php',{
                params:{
                  'action': 'getDeviceInfo',
                  'ddns_name': _self.ddns_name
                }
              }).then((resp) => {
                console.log(resp.data[0].reject_repair);
                _self.tableData = resp.data;
                _self.reject_repair = "";
                _self.ddns_name = "";
                _self.code = "";
              })
            }
          })
        }else{
          axios.get('/api.php',{
            params:{
              'action': 'getDeviceInfo',
              'ddns_name': _self.ddns_name
            }
          }).then((resp) => {
            _self.tableData = resp.data;
            _self.ddns_name = "";
            _self.code ="";
          })
        }
      }
    }
  }
</script>
<style lang="css" scoped>
.title{
  font-size: 18px;
  margin: 0px auto;
  color: #000;
}
.sup{
  font-weight: 100;
}
.code{
  width:20%;
  height: 23px;
  border: 0 solid #000;
  transform: translateY(4px);
  outline: none;
  border-bottom: 1px solid blue;
}
.code:focus{
  animation: myfirst 2.5s;
}
@keyframes myfirst
{
from {
  border-bottom: 1px solid #fff;
}
to {
  border-bottom: 1px solid red;
}
}
td{
  overflow: hidden;
}
.btn{
  margin-right: 30px;
}
.date_input_box{
  margin-top: 30px;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: baseline;
}
.date-picker{
  width: 120px!important;
  text-indent: 0px;
  text-align:left!important;
}
</style>
