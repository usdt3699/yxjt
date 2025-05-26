import * as mtypes from './mutation-types.js'

export default {
  namespaced:true,
  state: {
    customerInfo: {
      uid: '',
      mobile:'',
      depositBalance:'0',
      name:'',
    },
  },
  mutations: {
    [mtypes.MODAL.CHANGE_CUSTOMER_STATE] (state, payload) {
      console.log('CHANGE_CUSTOMER_STATE',payload)
      state.customerInfo = payload
    },
  },
  actions: {
    changeCustomerInfoState ({ commit }, payload) {
      commit(mtypes.MODAL.CHANGE_CUSTOMER_STATE, payload)
    },
  },
} 
