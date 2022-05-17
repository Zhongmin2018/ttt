/**
 * Created by aminkira on 17/9/18.
 */
import Vuex from 'vuex'
import Vue from 'vue'
import property from './modules/property'
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
    },
    modules: {
      property,
    },
    mutations: {
    }
})
