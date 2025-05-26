export default {
  namespaced:true,
  state: {
    isMain:false
  },
  mutations:{
    setIsMain(state,value){
      state.isMain = value
    }, 
  },
} 
