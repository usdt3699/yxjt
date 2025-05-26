import Auth from "../utils/auth";
import router from "../router";
export default {
  namespaced: true,
  state: {
    /** 当前tab   '/home' 可以更改为自己默认的页面*/
    editableTabsValue: Auth.getEditableTabsValue() || "/home",
    /** tab数组 */
    editableTabs: Auth.getEditableTabs() || [{ title: "首页", name: "/home" }],
  },

  /** 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation */
  mutations: {
    //退出登录时注销tab
    ACCOUNT_LOGOUT_FAILURE(state) {
      // state.editableTabsValue = '/home';
      // state.editableTabs = [{title:'首页',name:'/home'}];

      //其他代码
      //   Auth.removeEditableTabs();
      //   Auth.removeEditableTabsValue();
      Auth.removeToken();
      router?.replace({ name: "login" }).catch((err) => {});
    },
    //设置当前tab数组
    addTab(state, data) {
      state.editableTabs = data;
      Auth.setEditableTabs(data);
    },
    //设置当前tab
    setTabName(state, data) {
      // console.log('设置当前tab',state,data)
      state.editableTabsValue = data;
      Auth.setEditableTabsValue(data);
    },
  },
  /** Action 提交的是 mutation，而不是直接变更状态。Action 可以包含任意异步操作。 */
  actions: {
    /** 登出 */
    accountLogoutSubmit({ commit }, params) {
      commit("ACCOUNT_LOGOUT_FAILURE");
      // return new Promise((resolve, reject) => {
      // UserCountService.logout(params).then((res) => {
      //   commit('ACCOUNT_LOGOUT_FAILURE');
      //   resolve()
      // }).catch(err => {
      //   commit('ACCOUNT_LOGOUT_FAILURE');
      //   resolve()
      // })
      // })
    },
  },
};
