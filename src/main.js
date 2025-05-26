import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import router from "./router";
import moment from "moment";
import { 
  Toast, 
  Dialog, 
  Lazyload, 
  Icon, 
  Field, 
  Empty, 
  Loading,
  List,
  PullRefresh,
  Tab,
  Tabs,
  Image as VanImage,
  NavBar,
  Cell,
  CellGroup,
  Radio,
  RadioGroup,
  Popup,
  Button,
  Swipe,
  SwipeItem, 
} from "vant";
import store from "./store";
import '@/assets/css/tailwindcss.css'
import "@/assets/fonts/iconfont.css";
import VueLuckyCanvas from '@lucky-canvas/vue'

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(Lazyload);
Vue.use(VueLuckyCanvas);
Vue.use(Icon);
Vue.use(Field);
Vue.use(Empty);
Vue.use(Loading);
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(VanImage);
Vue.use(NavBar);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Popup);
Vue.use(Button); 
Vue.use(Swipe);
Vue.use(SwipeItem);

Vue.filter("timeFormat", function (value, str = "YYYY-MM-DD HH:mm:ss") {
  return moment(value).format(str);
});
Vue.filter("formatTimestamp", function (value, str = "YYYY-MM-DD HH:mm:ss") {
  return moment.unix(value).format(str);
});
Vue.prototype.$moment = moment;
Vue.filter('moment', function(value, format) {
  if (value) {
    return moment(value).format(format)
  }
  return ''
})
async function loadConfig() {
  const configUrl = process.env.VUE_APP_CONFIG_URL;
  const response = await fetch(configUrl);
  // if (!response.ok) {
  //   throw new Error(`Failed to load config from ${configUrl}`);
  // }
  const config = await response.json();
  // 将配置存储在Vue的全局属性中
  Vue.prototype.$config = config;
  
  // 触发配置加载完成事件
  document.dispatchEvent(new Event('configLoaded'));
}
// 加载配置文件并初始化Vue实例
loadConfig().then(() => {
  new Vue({
    render: (h) => h(App),
    beforeCreate() {
      Vue.prototype.$bus = this; //安装全局事件总线
    },
    router,
    store,
  }).$mount("#app");
}).catch(error => {
  console.error('Failed to load configuration:', error);
});

