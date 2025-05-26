<template>
  <div class="h-full w-full bg-primary">
    <nav-bar
        title="资产"
        left-text=""
        :left-arrow="false"
        :border="false"
        :safe-area-inset-top="true"
    />
    <div class="overflow-hidden w-full">
      <div class="p-4 page-content">
        <router-view/>
      </div>
    </div>
  </div>
</template>
<script>
import {NavBar} from "vant";

export default {
  name: "index",
  components: {NavBar},
  data() {
    return {
      active: 0,
    };
  },
  computed: {
    title() {
      return this.$route.meta.title; // 获取路由的meta属性的title值
    }
  },
};
</script>

<style scoped lang="less">
.van-nav-bar {
  background-color: #B41212;
}

.van-nav-bar /deep/ .van-nav-bar__title {
  color: #fff;
}

.body-content {
  background-image: url('../../assets/img/dividend/bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.page-content /deep/ .van-loading__text {
  color: #fff;
}

.page-content /deep/ .van-pull-refresh__head {
  color: #fff;
}

.page-content /deep/ .van-empty__description {
  color: #fff;
}

</style>
