import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    { //进入页面自动跳转至登录页面
      path: '/',
      redirect: 'login'
    },
    { //登陆页面
      path: '/login',
      name: 'login',
      component: resolve => require(['@/components/login'], resolve)
    },
    { // 注册页面
      path: '/signin',
      name: 'signin',
      component: resolve => require(['@/components/signin'], resolve)
    },
    { // 主页
      path: '/index',
      name: 'index',
      component: resolve => require(['@/components/index'], resolve)
    },
    { // pcba测试页面
      path: '/pcba',
      name: 'pcba',
      component: resolve => require(['@/components/pcba'], resolve)
    },
    { // product测试页面
      path: '/testproduct',
      name: 'testproduct',
      component: resolve => require(['@/components/testproduct'], resolve)
    },
    { // 吞吐量测试页面
      path: '/through',
      name: 'through',
      component: resolve => require(['@/components/through'], resolve)
    },
    { // 出厂产品信息查询页面
      path: '/glshow',
      name: 'glshow',
      component: resolve => require(['@/components/glshow'], resolve)
    },
    { // 产品出厂录入页面
      path: '/glmark',
      name: 'glmark',
      component: resolve => require(['@/components/glmark'], resolve)
    },
    { // 订单信息查询页面
      path: '/glserch',
      name: 'glserch',
      component: resolve => require(['@/components/glserch'], resolve)
    },
    { // 不良品信息录入/查询页面
      path: '/glreject',
      name: 'glreject',
      component: resolve => require(['@/components/reject'], resolve)
    },
    { // 不良品维修录入/查询页面
      path: '/glrepair',
      name: 'glrepair',
      component: resolve => require(['@/components/repair'], resolve)
    },
    { // 超级权限页面
      path: '/rootAuthority',
      name: 'rootAuthority',
      component: resolve => require(['@/components/rootAuthority'], resolve)
    },
    {
      path: '/power',
      name: 'power',
      component: resolve => require(['@/components/powerTest'], resolve)
    }
  ]
})
