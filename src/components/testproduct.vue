<template lang="html">
  <div class="testproduct">
    <h1>PRODUCT测试<sup class="sup">BETA</sup></h1>
    <router-link :to="{ name: 'index'}" style="position: absolute; left:50px; top: 10px;"><img :src="home" alt="home" style="width: 38px;"></router-link>
    <mu-select-field label="在点击的时候显示设备列表信息" v-model="device_type" :maxHeight="300" @change="handlechange">
      <mu-menu-item v-for="item, index in list3" :key="index" :title="item" :value="item"/>
    </mu-select-field>

    <mu-raised-button v-bind:label="label" class="demo-raised-button" v-bind:disabled="!firststbt" secondary/>

      <div class="input" v-show="device_type && device_type == 'GL-MIFI-CUSTOM'">
      <mu-select-field label="产品型号" v-model="device_type1" :maxHeight="300">
        <mu-menu-item v-for="item, index in list31" :key="index" :title="item" :value="item"/>
      </mu-select-field>
      <mu-select-field label="硬件版本" v-model="device_type2" :maxHeight="300">
        <mu-menu-item v-for="item, index in list32" :key="index" :title="item" :value="item"/>
      </mu-select-field>

      <mu-select-field label="软件版本" v-model="device_type3" :maxHeight="300">
        <mu-menu-item v-for="item, index in list33" :key="index" :title="item" :value="item"/>
      </mu-select-field>
    </div>
    

    <div class="input" v-show="device_type && device_type == 'GL-MIFI-CUSTOM'">
    	<hr/>
	    	<input type="text" class="code" placeholder="扫码" v-model="code1" @change="handcodeget"/>
	    	<mu-raised-button v-bind:label="codesay1 || '请扫码！'" v-bind:disabled="!firststbt" class="demo-raised-button" secondary/>
	    <hr/>
    </div>



    <div class="input" v-show="device_type && device_type != 'GL-avira'">
    	<hr/>
	    	<input type="text" class="code" placeholder="扫码" v-model="code" @change="handcodeput"/>
	    	<mu-raised-button v-bind:label="codesay || '请扫码后自动开始！'" v-bind:disabled="!firststbt" class="demo-raised-button" secondary/>
	    <hr/>
    </div>
     <div class="input" v-show="device_type && device_type == 'GL-avira'">
    	<hr/>
	    	<input type="text" class="code" placeholder="请扫码" v-model="code" @change="handcodeput1"/>
	    	<mu-raised-button v-bind:label="codesay || '扫码后自动开始！'" v-bind:disabled="!firststbt" class="demo-raised-button" secondary/>
	    <hr/>
    </div>
    <div>
      <mu-stepper :activeStep="firststep" v-show="device_type">
        <mu-step v-for="item,index in firststeps" :key="index">
          <mu-step-label class="step-label-circle">
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
import qrcode from 'js-qrcode'
import home from '../assets/home.png'
import init1 from '../assets/cr.png'
import recover1 from '../assets/null.png'
import recover2 from '../assets/tab.png'
export default {
  name: 'testproduct',
  data(){
    return {
      home,
      code: '',
      code1: '',
      code2: '',
      init1,
      recover1,
      recover2,
      device_type: '',
      success: 'success',
      fail: 'fail',
      codesay: '',
      codesay1: '',
      list3: [],
      list31: [],
      list32: [],
      list33: [],
      firststeps: [],
      process: [],
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
        vm.list3 = ['GL-AR150','GL-AR750','GL-AR750S','GL-AR300M' ,'GL-MT300N-V2','GL-MT300N-V3','GL-B1300','GL-MIFI','GL-MIFI-CUSTOM','GL-ENGEL','GL-CORE','GL-CORE-Wiline','GL-AR300M-double-flash','GL-X750','GL-USB150','GL-X1200','GL-S1300','GL-MT300N-V2-xinjia','GL-avira']
        vm.list31 = ['XV','XW'];
        vm.list32 = ['1','2','3','4'];
        vm.list33 = ['0','1'];
        vm.$store.commit('setstep',{'data':{'step': 'second'}});
        vm.$store.commit('setUserStart');
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
    label(){
      return this.$store.getters.label;
    },
    ddns_name(){
    	return this.$store.getters.ddns_name;
    },
    nextDdns(){
      return this.$store.getters.nextDdns;
    },
    product5G(){
      return this.$store.getters.product5G;
    },
    testStatus(){
      return this.$store.getters.testStatus;
    },
  },
  methods:{
    handlechange(val){
      console.log(val);
      this.device_type = val;
      switch(val){
        case 'GL-B1300':
            this.firststeps = ['连接设备','检测是否进行pcba测试','检测内存大小','测试重置开关','测试mesh开关','测试成功'];
            this.process = ['onconnect','oncheckfirst','ontestddr','onreset','onmeshset','onsecondok'];
            break;
        case 'GL-S1300':
            this.firststeps = ['连接设备','检测是否进行pcba测试','检测内存大小','测试重置开关','测试mesh开关','测试成功'];
            this.process = ['onconnect','oncheckfirst','ontestddr','onreset','onmeshset','onsecondok'];
            break;
        case 'GL-avira':
            this.firststeps = ['连接设备','检测是否进行pcba测试','检测内存大小','测试重置开关','测试mesh开关','测试蓝牙','测试zigbee','测试成功'];
            this.process = ['onconnect','oncheckfirst','ontestddr','onreset','onmeshset','onbluetooth','onzigbee','onsecondok'];
            break;
        case 'GL-CORE':
            this.firststeps = ['连接设备','检测内存大小','写入pcba标志','测试成功'];
            this.process = ['onconnect','ontestddr','onfirstok','onsecondok'];
            break;
        case 'GL-CORE-Wiline':
            this.firststeps = ['连接设备','检测内存大小','测试重置开关','测试usb设备','写入pcba标志','测试成功'];
            this.process = ['onconnect','ontestddr','onreset','ontestusb','onfirstok','onsecondok'];
            break;
        case 'GL-MIFI':
            this.firststeps = ['连接设备','检测是否进行pcba测试','检测内存大小','测试成功'];
            this.process = ['onconnect','oncheckfirst','ontestddr','onsecondok'];
            break;
        case 'GL-MIFI-CUSTOM':
            this.firststeps = ['连接设备','检测是否进行pcba测试','检测内存大小','测试成功'];
            this.process = ['onconnect','oncheckfirst','ontestddr','onsecondok'];
            break;
        case 'GL-ENGEL':
            this.firststeps = ['连接设备','检测是否进行pcba测试','检测内存大小','测试成功'];
            this.process = ['onconnect','oncheckfirst','ontestddr','onsecondok'];
            break;
        case 'GL-AR750S':
            this.firststeps = ['连接设备','检测是否进行pcba测试','检测内存大小','测试重置开关','测试拨动开关','测试成功'];
            this.process = ['onconnect','oncheckfirst','ontestddr','onreset','onswitchleftmid','onsecondok'];
            break;
        case 'GL-X750':
            this.firststeps = ['连接设备','检测是否进行pcba测试','检测内存大小','测试重置开关','测试成功'];
            this.process = ['onconnect','oncheckfirst','ontestddr','onreset','onsecondok'];
            break;
        case 'GL-MT300N-V3':
            this.firststeps = ['连接设备','检测是否进行pcba测试','检测内存大小','测试重置开关','测试成功'];
            this.process = ['onconnect','oncheckfirst','ontestddr','onreset','onsecondok'];
            break;
        case 'GL-USB150':
            this.firststeps = ['连接设备','检测校准','检测内存大小','测试重置开关','测试led','测试成功'];
            this.process = ['onconnect','oncalibration','ontestddr','onreset','onled','onsecondok'];
            break;
        case 'GL-AR300M-double-flash':
            this.firststeps = ['连接设备','检测是否进行pcba测试','检测内存大小','测试重置开关','测试拨动开关','测试成功'];
            this.process = ['onconnect','oncheckfirst','ontestddr','onreset','onswitchleftmidright','onsecondok'];
            break;
         case 'GL-X1200':
            this.firststeps = ['连接设备','检测是否进行pcba测试','检测内存大小','测试重置开关','测试成功'];
            this.process = ['onconnect','oncheckfirst','ontestddr','onreset','onsecondok'];
            break;
         case 'GL-MT300N-V2-xinjia':
            this.firststeps = ['连接设备','检测是否进行pcba测试','检测内存大小','测试重置开关','测试拨动开关','测试蓝牙','测试成功'];
            this.process = ['onconnect','oncheckfirst','ontestddr','onreset','ontestswitch','onbluetooth','onsecondok'];
            break;
        default:
            this.firststeps = ['连接设备','检测是否进行pcba测试','检测内存大小','测试重置开关','测试拨动开关','测试成功'];
            this.process = ['onconnect','oncheckfirst','ontestddr','onreset','ontestswitch','onsecondok'];
            break;
      }
      this.$store.commit('setprocess',{'data':{'process': this.process}});
      this.$store.commit('setDeviceType',{'data':{'deviceType': val}});
    },
    handcodeget(e){
		  const code1 = this.code1;

      this.code2 = code1.split(";")[0]
      console.log(111111122111111)
      console.log(this.code2)
		  const len = code1.length;
      if(code1.length == 44){
        console.log(code1, this.code2)
        this.codesay1 = "扫码成功";
      }
      setTimeout(()=>{
        this.code1 = "";
        this.codesay1 = "";
      },3000);
		},    
    handcodeput(e){
      console.log(121212121212)
		  const code = this.code;
		  const list = code.split(" ");
		  const len = code.length;
      let mac = "";
      let nextDdns = ""
		  const _self =this;
		  if(len==24&&list.length==2 || len==17&&list.length==1 || len==42&&list.length==3){
		    console.log(code);
		    console.log(list);
		    console.log(len);
        console.log(1313131313131313)
		    let ddns = ""
		    if(code.length ==24){
		      if(list[0].length < list[1].length){
		        ddns = list[0];
		      }else{
		        ddns = list[1];
          }
          console.log(ddns);
          axios.get('/api.php',{
            params:{
              'action': 'getDeviceInfo',
              'ddns_name': ddns
            }
          }).then((response) => {
            mac = response.data[0].mac_address
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
              this.$store.commit('setddns',{'data':{'ddns': ddns,'nextDdns': nextDdns}});
              this.code = "";
      		    this.codesay = "扫码成功";
      		    this.startTest();
            });
          });
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
		      console.log(ddns);
          console.log(141414141414)
          axios.get('/api.php',{
            params:{
              'action': 'getDeviceInfo',
              'ddns_name': ddns
            }
          }).then((response) => {
            mac = response.data[0].mac_address
            console.log(151515151515)
            console.log(mac)
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
            console.log(16161616161)
            nextMac = newstr
            axios.get("/api.php",{
                params:{
                  action: 'mac2ddns',
                  mac_address: nextMac,
                }
            }).then((response) => {
              nextDdns = response.data.ddns_name;
              console.log(nextDdns)
              console.log(171717171717)
              this.$store.commit('setddns',{'data':{'ddns': ddns,'nextDdns': nextDdns}});
              this.code = "";
      		    this.codesay = "扫码成功";
      		    this.startTest();
            });
          });
		    }
		    if(code.length == 17){
		      axios.get("/api.php",{
		        params:{
		          'action': 'mac2ddns',
		          'mac_address': code,
		        }
		      }).then((response) => {
		      	ddns = response.data.ddns_name;
            console.log(ddns);
            console.log(33333333333333333333)
            let macString = code.split(":").join("");
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
              let nextDdns = response.data.ddns_name;
              console.log(nextDdns)
              this.$store.commit('setddns',{'data':{'ddns': ddns,'nextDdns': nextDdns}});
      		    this.codesay = "扫码成功";
      		    this.startTest();
            });
		      })
		    }
		    setTimeout(()=>{
          this.code = "";
		    	this.codesay = "";
		    },3000);
		  }
    },
     handcodeput1(e){
      console.log('handcodeput1')
		  const code = this.code;
		  const list = code.split(" ");
		  const len = code.length;
      let mac = "";
      let nextDdns = ""
		  const _self =this;
		  if(len==24&&list.length==2 || len==17&&list.length==1 || len==42&&list.length==3){
        console.log('avira 扫码');
		    console.log(code);
		    console.log(list);
		    console.log(len);
        console.log(1313131313131313)
		    let ddns = ""
		    if(code.length ==24){
          console.log('avira code24');
		      if(list[0].length < list[1].length){
		        ddns = list[0];
		      }else{
		        ddns = list[1];
          }
          console.log(ddns);
              this.$store.commit('setddns',{'data':{'ddns': ddns,'nextDdns': nextDdns}});
              this.code = "";
              this.codesay = "扫码成功";
              console.log("avira 扫码成功");
      		    this.startTest1();
		    }
		    if(code.length == 42){
          console.log('avira code42');
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
          console.log(nextDdns)
          console.log(171717171717)
          this.$store.commit('setddns',{'data':{'ddns': ddns,'nextDdns': nextDdns}});
          this.code = "";
          this.codesay = "扫码成功";
          console.log("avira 扫码成功");
      		this.startTest1();
		    }
		    if(code.length == 17){
		      axios.get("/api.php",{
		        params:{
		          'action': 'mac2ddns1',
		          'mac_address': code,
		        }
		      }).then((response) => {
              console.log('avira code17');
              console.log(response.data)
              ddns = response.data.ddns_name;
              this.$store.commit('setddns',{'data':{'ddns': ddns,'nextDdns': nextDdns}});
              this.codesay = "扫码成功";
              console.log("avira 扫码成功");
      		    this.startTest1();
            });
		    }
		    setTimeout(()=>{
          this.code = "";
		    	this.codesay = "";
		    },3000);
		  }
    },
     startTest(){
      const that = this;
    	if(that.ddns_name){
    		axios.get('/api.php',{
	        params:{
	          'action': 'getDeviceInfo',
	          'ddns_name': that.ddns_name
	        }
	      }).then((response) => {
          console.log(response.data[0]);
          console.log(44444444444444444)
	      	if(response.data[0].used == '0' || !response.data[0].used){
            //这个需要仔细考虑
	      		if(that.product5G.indexOf(that.device_type) != -1){
              console.log(161616161616)
              axios.get('/api.php',{
                params:{
                  'action': 'getDeviceInfo',
                  'ddns_name': that.nextDdns
                }
              }).then((res) => {
                if(res.data[0].used == '0' || !response.data[0].used){
                  console.log(18181818181818)
                  that.$store.commit('settirdstbt');
                  
                  const params = {
                    'action': 'updateDeviceInfo',
                    'ddns_name': that.ddns_name,
                    'product_test_name': that.userName,
                    'product_type': that.device_type+'-WAN',
                    'product_test_time': 'setNow',
                  }
                  this.$store.dispatch('setDataBase',params);
                  const data = {
                    'device_type': that.device_type+'-WAN',
                    'mac_address': response.data[0].mac_address,
                    'ddns_name': this.ddns_name,
                    'sn_back_up': response.data[0].sn_back_up,
                    'sn_now_use': response.data[0].sn_now_use,
                    'index': 0,
                    'step': 'second',
                  }
                  this.$store.dispatch('sendcommand',{'command':'onconnect','payload':data});
                  const date = new Date();
                  const tdata = {
                    'data': {
                      'startTime': date.getTime(),
                    }
                  }
                  this.$store.commit('setStartTime',tdata);
                }else{
                  alert('二维码被占用，不允许再次使用。');
                }
              })
            }else{
              console.log(1717171717171)
              that.$store.commit('settirdstbt');
              const params = {
                'action': 'updateDeviceInfo',
                'ddns_name': that.ddns_name,
                'product_test_name': that.userName,
                'product_type': that.device_type+'-WAN',
                'product_test_time': 'setNow',
              }
              console.log(18181818181818)
              that.$store.dispatch('setDataBase',params);
              console.log(this.code2)
              const data = {
                'device_type': that.device_type+'-WAN',
                'mac_address': response.data[0].mac_address,
                'ddns_name': this.ddns_name,
                'sn_back_up': response.data[0].sn_back_up,
                'sn_now_use': response.data[0].sn_now_use,
                'index': 0,
                'step': 'second',
                'code2': this.code2,

              }
              console.log(19191919191919)
              that.$store.dispatch('sendcommand',{'command':'onconnect','payload':data});
              const date = new Date();
              const tdata = {
                'data': {
                  'startTime': date.getTime(),
                }
              }
              console.log(2020202020202020)
              that.$store.commit('setStartTime',tdata);
              console.log(212121212121212)
            }
	      	}else{
	      		alert('二维码被占用，不允许再次使用。');
	      	}
	      });
    	}else{
    		alert('请先扫码');
    	}
    },
    startTest1(){
      console.log('startTest1')
      const that = this;
    	if(that.ddns_name){
        console.log('that.ddns_name '+that.ddns_name)
    		axios.get('/api.php',{
	        params:{
	          'action': 'getDeviceInfo1',
	          'ddns_name': that.ddns_name
	        }
	      }).then((response) => {
          console.log('avira 取数据');
          console.log(response.data[0]);
          console.log(44444444444444444)
	      	if(response.data[0].used == '0' || !response.data[0].used){
            //这个需要仔细考虑
	      		if(that.product5G.indexOf(that.device_type) != -1){
              console.log('avira5G 取数据');
              console.log(161616161616)
              axios.get('/api.php',{
                params:{
                  'action': 'getDeviceInfo',
                  'ddns_name': that.nextDdns
                }
              }).then((res) => {
                if(res.data[0].used == '0' || !response.data[0].used){
                  console.log(18181818181818)
                  that.$store.commit('settirdstbt');
                  
                  const params = {
                    'action': 'updateDeviceInfo',
                    'ddns_name': that.ddns_name,
                    'product_test_name': that.userName,
                    'product_type': that.device_type+'-WAN',
                    'product_test_time': 'setNow',
                  }
                  this.$store.dispatch('setDataBase',params);
                  const data = {
                    'device_type': that.device_type+'-WAN',
                    'mac_address': response.data[0].mac_address,
                    'ddns_name': this.ddns_name,
                    'sn_back_up': response.data[0].sn_back_up,
                    'sn_now_use': response.data[0].sn_now_use,
                    'index': 0,
                    'step': 'second',
                  }
                  this.$store.dispatch('sendcommand',{'command':'onconnect','payload':data});
                  const date = new Date();
                  const tdata = {
                    'data': {
                      'startTime': date.getTime(),
                    }
                  }
                  this.$store.commit('setStartTime',tdata);
                }else{
                  alert('二维码被占用，不允许再次使用。');
                }
              })
            }else{
              console.log( 'avira 获取信息');
              that.$store.commit('settirdstbt');
              const data = {
                'device_type': that.device_type,
                'mac_address': response.data[0].mac_address,
                'ddns_name': this.ddns_name,
                'sn_back_up': response.data[0].sn_back_up,
                'sn_now_use': response.data[0].sn_now_use,
                'index': 0,
                'step': 'second',
                'code2': this.code2,
                'serial': response.data[0].serial,
                'key': response.data[0].key1,
                'ssid': response.data[0].ssid,
              }
              console.log(19191919191919)
              that.$store.dispatch('sendcommand',{'command':'onconnect','payload':data});
              const date = new Date();
              const tdata = {
                'data': {
                  'startTime': date.getTime(),
                }
              }
              console.log(2020202020202020)
              that.$store.commit('setStartTime',tdata);
              console.log(212121212121212)
            }
	      	}else{
	      		alert('二维码被占用，不允许再次使用。');
	      	}
	      });
    	}else{
    		alert('请先扫码');
    	}
    }
  },
  mounted(){
    console.log(2323232323232323)
    this.$store.commit('setstep',{'data':{'step': 'second'}});
  }
}
</script>

<style>
.title{
  font-size: 18px;
  margin: 0px auto;
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
.mu-step-label{
  font-size: 20px !important;
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
#init,#recovery1,#recovery2{
	display: inline-block;
	width: 80px;
}
.code{
  width:20%;
  height: 23px;
  border: 0 solid #000;
  transform: translateY(3px);
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
</style>
