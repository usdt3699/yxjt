import axios from "axios";
import { isNullOrEmpty } from "../utils";
import store from "../store";
import Vue from "vue";

axios.defaults.timeout = 20000;
axios.defaults.maxContentLength = 1048576;
axios.defaults.headers["Accept"] = "application/json, text/plain, */*";
axios.defaults.headers["Content-Type"] = "multipart/form-data";

// 动态设置baseURL
const setBaseUrl = () => {
  if (Vue.prototype.$config && Vue.prototype.$config.API_URL) {
    axios.defaults.baseURL = Vue.prototype.$config.API_URL;
  }
};

// 初始化时尝试设置baseURL
setBaseUrl();

// 监听配置加载完成事件
document.addEventListener("configLoaded", () => {
  setBaseUrl();
});

axios.interceptors.request.use(
  async function (config) {
    if (!isNullOrEmpty(window.token)) {
      config.headers["authorization"] = window.token;
      config.headers["Token"] = window.token;
    }
    config.headers["source"] = "h5";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    const { data } = response;
    // console.log('接口返回成功', response)
    if (data.code == 200) {
      return Promise.resolve(data);
    } else if (data.code == -2 || data.code == 401 || data.code == 406) {
      store.commit("tabs/ACCOUNT_LOGOUT_FAILURE", true);
      return Promise.reject(data);
    } else {
      return Promise.reject(data);
    }
  },
  async function (err) {
    console.log("响应失败", JSON.stringify(err));
    if (err.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      const { data, status, statusText } = err.response;
      console.log("响应失败", status);
      if (status == 401 || status == 403) {
        store.commit("tabs/ACCOUNT_LOGOUT_FAILURE", true);
      }
      return Promise.reject(data);
    } else {
      const errorObj = { msg: err.message || "服务器繁忙，请稍后重试" };
      return Promise.reject(errorObj);
    }
  }
);
export default axios;
