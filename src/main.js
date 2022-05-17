import Vue from 'vue'
import App from './App'
import router from './router'
import VueMqtt from 'vue-mqtt'
import axios from 'axios'
import store from './store/store'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'

axios.get('/api.php', {
    params: {
        'action': 'ip'
    }
}).then((res) => {
    store.commit('sethostip', res);
    // 生成客户端随机码，用于和执行层进行通信。
    const appid = Math.random().toString(36).substr(2);
    const data = {
        'data': {
            'appid': appid,
        }
    };
    // 设置全局
    store.commit('setappid', data);
    // 设置mqtt通信的topic，只关注和自己相关的信息。gliot「前缀」/appid「自己」/hostip「信息的来源」/#「所有和自己相关的命令和信息」
    const topic = 'gliot/' + store.getters.appid + '/' + store.getters.hostip + '/#';
    console.log(store.getters.hostip, store.getters.appid);
    Vue.use(VueMqtt, 'ws://192.168.16.17:9001', { keepalive: 13 * 60 * 60, will: { topic: 'gliot/' + store.getters.hostip + '/' + store.getters.appid + '/offline', qos: 1 } })
    Vue.use(MuseUI)
    Vue.config.productionTip = false
    new Vue({
        el: '#app',
        router,
        store,
        mqtt: {
            [topic]: function (data, topic) {
                const toparr = topic.split('/');
                // 执行层反馈的信息
                const device = JSON.parse(String.fromCharCode.apply(null, data));
                // 只关注命令
                const behavior = toparr[3];
                console.log(behavior)
                // 分发到vuex中对应的处理器
                this.$store.dispatch(behavior, device);
            }
        },
        template: '<App/>',
        components: { App }
    })
})
