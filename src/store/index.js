import Vue from 'vue'
import Vuex from 'vuex'
import modal from './modal'
import user from './user'
import customer from './customer'
import systemInfo from './systemInfo'
import tabs from './tabs'
import page from './page'
//应用Vuex插件
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    modal,
    user,
    customer,
    systemInfo,
    tabs,
    page
  },
})
 
