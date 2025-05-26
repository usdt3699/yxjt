<template>
  <div class="foot_menu w-full">
    <Tabbar v-model="active" active-color="#F49F00" inactive-color="#595959" :border="false" @change="changeTab">
      <TabbarItem
          v-for="(item, index) in filteredMenuList"
          :key="index"
      >
        <span class="nav-title">{{ item.title }}</span>
        <template #icon="props">
          <img :src="props.active ? item.sel_pic : item.pic"/>
        </template>
      </TabbarItem>
    </Tabbar>
  </div>
</template>

<script>
import {Icon, Tabbar, TabbarItem} from "vant";
import {mapState} from "vuex";

export default {
  props: ['pageKey'],
  components: {
    Icon,
    Tabbar,
    TabbarItem,
  },
  computed: {
    ...mapState("systemInfo", ["systemInfo"]),
    filteredMenuList() {
      return this.menuList.filter(item => {
        return item.isShow === 1;
      });
    }
  },
  data() {
    return {
      active: "首页",
      menuList: [
        {
          "title": "首页",
          "isShow": 1,
          "url": "/home",
          "pic": require('@/assets/img/nav/menu_home.png'),
          "sel_pic": require('@/assets/img/nav/menu_home_checked.png'),
        },
        {
          "title": "股票",
          "isShow": 1,
          "url": "/stock",
          "pic": require('@/assets/img/nav/menu_stock.png'),
          "sel_pic": require('@/assets/img/nav/menu_stock_checked.png'),
        },
        {
          "title": "房产",
          "isShow": 1,
          "url": "/estate",
          "pic": require('@/assets/img/nav/menu_assets.png'),
          "sel_pic": require('@/assets/img/nav/menu_assets_checked.png'),
        },
        {
          "title": "银行卡",
          "isShow": 1,
          "url": "/bankCard",
          "pic": require('@/assets/img/nav/menu_card.png'),
          "sel_pic": require('@/assets/img/nav/menu_card_checked.png'),
        },
        {
          "title": "车辆",
          "isShow": 1,
          "url": "/carList",
          "pic": require('@/assets/img/nav/menu_vehicle.png'),
          "sel_pic": require('@/assets/img/nav/menu_vehicle_checked.png'),
        },
        {
          "title": "项目",
          "isShow": 1,
          "url": "/projectList",
          "pic": require('@/assets/img/nav/menu_project.png'),
          "sel_pic": require('@/assets/img/nav/menu_project_checked.png'),
        },
        {
          "title": "我的",
          "isShow": 1,
          "url": "/profile",
          "pic": require('@/assets/img/nav/menu_my.png'),
          "sel_pic": require('@/assets/img/nav/menu_my_checked.png'),
        }],
    };
  },
  created() {
    this.$bus.$on('active', this.handleMessage);
  },
  beforeDestroy() {
    this.$bus.$off('active', this.handleMessage); // 在组件销毁前移除监听器
  },
  mounted() {
    console.log('加载页面')
    this.init();
  },
  methods: {
    handleMessage(index) {
      console.log('收到事件', index)
      this.active = index;
    },
    matchRoute(menuPath, routePath) {
      // 处理首页特殊情况
      if (menuPath === '/home' && routePath === '/') return true;
      return routePath.startsWith(menuPath);
    },
    init() {
      const currentPath = this.$route.path;
      const activeIndex = this.filteredMenuList.findIndex(item =>
        this.matchRoute(item.url, currentPath)
      );
      if (activeIndex !== -1) {
        this.active = activeIndex;
      }
    },
    changeTab(index) {
      this.active = index;
      const item = this.filteredMenuList[index];
      console.log('跳转',item)
      if (item.title == '客服') {
        window.location.href = this.systemInfo.customerService;
        return;
      }
      this.navigateTo(item.url);
    },
    navigateTo(url) {
      this.$router.push(url);
    },
  },
  watch: {
    $route: {
      handler(to) {
        const activeIndex = this.filteredMenuList.findIndex(item => item.url === to.path);
        if (activeIndex !== -1) {
          this.active = activeIndex;
        }
      },
      immediate: true
    }
  },
};
</script>

<style lang="less" scoped>
.foot_menu {
  height: 50px;
  background-color: #fff;
  position: fixed;
  z-index: 999;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
}

.van-tabbar-item__icon img {
  height: 1.5rem;
}

.nav-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
