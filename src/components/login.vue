<template>
  <div class="login">
    <h1 class="title">广联智通生产系统<sup class="sup">BETA</sup></h1>
    <div class="loginpanel">
      <div class="username loginitem">
        <input type="password" v-model="info" placeholder="请扫描你的工牌二维码" @keyup.enter="btnclick">
      </div>
      <div class="button loginitem">
         <button type="button" name="button" @click="btnclick">登录／注册</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import md5 from 'js-md5'
export default {
  name: 'login',
  data(){
    return{
      info: '',
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('setUserStart');
    });
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('setUserStop');
    next(true);
  },
  computed:{
    hostip(){
      return this.$store.getters.hostip;
    },
    userNowtime(){
      return this.$store.getters.userNowTime.toFixed(1);
    }
  },
  methods:{
    // 6c29df5275f8bf08d369c7828c1414d6+aminkira@gmail.com 登录账号类型
      btnclick: function(){
        console.log('nimaqusi')
        if(!this.info) {
          alert("can't be empty!")
          return
        }
          const info  = this.info.split('+');
          console.log(info[1]);
          console.log(info[0]);
          const that = this;
          axios.get('/api.php',{
            params:{
              'action': 'getUserPass',
              'email': info[1],
              'password': info[0],
            }
          }).then((response) => {
            console.log('login: ', response);
            const logindata ={
              'data':{
                'userName': response.data.user_name,
                'authkey': response.data.auth_key
              }
            }
            // 保存登录信息
            that.$store.commit('setlogin',logindata);
            that.$router.push('index');
          });
      }
    // btnclick: function(){
    //   const that = this;
    //   if(this.username && this.password){
    //     if(this.password.slice(-1) == "&"){
    //       console.log(that.password.slice(0,-1));
    //       console.log(md5(that.password.slice(0,-1)));
    //       axios.put('/api.php',{
    //         params:{
    //           'action': 'updateUserInfo',
    //           'user_name': that.username,
    //           'password': md5(that.password.slice(0,-1))
    //         }
    //       }).then((res) => {
    //         if(res.data.status == 'ok'){
    //           axios.post('/api.php',{
    //               params: {
    //                 'action': 'addOperationInfo',
    //                 'user_name': that.username,
    //                 'machine_hostip': that.hostip,
    //                 'user_time': that.userNowtime,
    //                 'operate_event': 'updatePassword',
    //               }
    //             }).then((resp) => {
    //               if(resp.data.status == 'ok'){
    //                 alert('密码修改成功,请进行登录');
    //                 that.username = "";
    //                 that.password = "";
    //               }
    //             })
    //         }
    //       });
    //     }else{
    //       axios.get('/api.php',{
    //         params:{
    //           'action': 'getUserInfo',
    //           'user_name': this.username,
    //         }
    //       }).then((response) => {
    //         if(response.data){
    //           if(response.data.password == md5(that.password)){
    //             const logindata ={
    //               'data':{
    //                 'userName': that.username,
    //                 'authkey': response.data.auth_key
    //               }
    //             }
    //             that.$store.commit('setlogin',logindata);
    //             axios.post('/api.php',{
    //               params: {
    //                 'action': 'addOperationInfo',
    //                 'user_name': that.username,
    //                 'machine_hostip': that.hostip,
    //                 'user_time': that.userNowtime,
    //                 'operate_event': 'login',
    //               }
    //             }).then((res) => {
    //               console.log(res);
    //               if(res.data.status == 'ok'){
    //                 that.username = "";
    //                 that.password = "";
    //                 that.$router.push('index');
    //               }
    //             })
    //           }else{
    //             alert('您输入的密码错误！请重新输入。如果忘记密码请联系管理员');
    //           }
    //         }else{
    //           alert('请前去注册页面注册账户');
    //           that.$router.push('signin');
    //         }
    //       })
    //     }
    //   }else{
    //     this.$router.push('signin');
    //   }
    // }
  }
}
</script>

<style>
.login{
  position: absolute;
  top:0;
  bottom:0;
  right: 0;
  left: 0;
  color: #000;
  background-color: #fff;
}
.title{
  margin-top: 5%;
}
.sup{
  font-weight: 100;
}
.loginpanel{
  margin: 0 auto;
  margin-top: 5%;
  max-width: 33%;
  max-height: 55%;
  padding: 30px 10px;
  border-radius: 15px;
  box-shadow:  0px 3px 16px -5px #020202;
}
.loginitem input,.loginitem button{
  outline: none;
  border: 0px solid #fff;
  width: 80%;
  height: 45px;
  margin-top:20px;
  background-color: #bdbdbd;
  border-radius: 5px;
  text-align: center;
  color: #000;
  font-size: 25px;
  font-weight: 700;
}
.loginitem button:focus{
  animation: bfocus .5s ease;
  background-color: #616161;
  box-shadow:  0px 3px 16px -5px #020202;
  color: #78909c;
}
@keyframes bfocus {
  0%{
    background-color: #bdbdbd;
  }
  50%{
    background-color: #616161;
  }
}
</style>
