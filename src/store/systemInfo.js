import axios from "../net/axios";
import api from "@/net/api";

export default {
  namespaced:true,
  state: {
    systemInfo: {},
  },
  mutations: {
    setSystemInfo (state, payload) {
      state.systemInfo = payload
    },
  },
  actions: {
    getSystemInfo ({ commit }, payload) {
      axios.get(api.systemInfo)
          .then(res=>{ 
            commit('setSystemInfo', res.data)
          })
          .catch(e=>{
            
          }) 
    },
  },
}
 
