<template>
  <div class="login">
    <h1 class="title">广联智通生产系统<sup class="sup">BETA</sup></h1>
    <router-link :to="{ name: 'login'}" style="position: absolute; left:150px; top: 80px;"><img :src="home" alt="home" style="width: 38px;"></router-link>
    <div class="loginpanel">
      <div class="username loginitem">
        <input type="text" v-model="username" placeholder="请输入用户名">
      </div>
      <div class="username loginitem">
        <input type="text" v-model="email" placeholder="请输入邮箱">
      </div>
      <div class="password loginitem">
        <input type="password" v-model="password" placeholder="请输入密码">
      </div>
      <div class="username loginitem">
        <mu-select-field v-model="authkey" label="选择你的岗位">
          <mu-menu-item value="1" title="产线人员"/>
          <mu-menu-item value="2" title="开发人员"/>
        </mu-select-field>
      </div>
      <div class="button loginitem">
         <button type="button" name="button" @click="btnclick">注册</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import home from '../assets/peple.png'
import md5 from 'js-md5'
export default {
  name: 'signin',
  data(){
    return{
      username: '',
      authkey: '',
      home,
      email: '',
      password: '',
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
  methods:{
    btnclick: function(){
      const that = this;
      if(this.username && this.authkey && this.email.indexOf('@') !== -1 && this.password){
        axios.get('/api.php',{
          params:{
            'action': 'getUserInfo',
            'user_name': this.username,
          }
        }).then((response) => {
          if(response.data){
            alert("这个名字已经被注册，请确定你已经进行注册。如果没有请联系管理人员");
          }else{
            axios.post('/api.php',{
              params:{
                'action': 'addUserInfo',
                'user_name':that.username,
                'email': that.email,
                'auth_key': that.authkey,
                'password': md5(that.password)
              }
            }).then((res) => {
              if(res.data.status == 'ok'){
                console.log(that.hostip,that.username,that.userNowtime);
                axios.post('/api.php',{
                  params: {
                    'action': 'addOperationInfo',
                    'user_name': that.username,
                    'machine_hostip': that.hostip,
                    'user_time': that.userNowtime,
                    'operate_event': 'sign',
                  }
                }).then((resp) => {
                  if(resp.data.status == "ok"){
                    alert("注册成功，请去登录界面进行登录");
                    that.$router.push('login');
                  }
                })
              }
            })
          }
        })
      }else{
        alert('请检查输入是否正确，邮箱必须有@符号');
      }
    }
  },
  computed:{
    hostip(){
      return this.$store.getters.hostip;
    },
    userNowtime(){
      return this.$store.getters.userNowTime.toFixed(1);
    }
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
