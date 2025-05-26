<template>
  <div class="w-screen h-screen bg-windBg">
    <router-view />
  </div>
</template>

<script>
import UserStorage from "@/utils/user_storage";
import Vue from "vue";

export default {
  name: "App",
  components: {},
  mounted() {
    console.log("App mounted");
    // 加载本地配置
    this.loadLocalConfig();
    const token = UserStorage.getToken()
    if (token) {
      UserStorage.setToken(token);
      window.token = token;
    }
  },
  methods: {
    async loadLocalConfig() {
      try {
        //回到页面就获取新的，防止更改后没有生效
        const configUrl = process.env.VUE_APP_CONFIG_URL;
        console.log('配置文件内容', configUrl);
        const response = await fetch(configUrl);
        Vue.prototype.$config = await response.json();
        UserStorage.setConfig(this.$config);
        console.log('config', this.$config);
      } catch (error) {
        console.error('加载本地配置失败', error);
      }
    },
  }
};
</script>

<style lang="less">
body {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.page-content {
  max-height: calc(100vh - 5.95rem);
  overflow-y: auto;
}
.page-content-2 {
  max-height: calc(100vh - 2.8rem);
  overflow-y: auto;
}
img {
  image-rendering: -webkit-optimize-contrast; /* 针对Webkit浏览器 */
  image-rendering: crisp-edges; /* 标准属性 */
}
</style>
