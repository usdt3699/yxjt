<template>
  <div class="h-full w-full flex flex-col fund-details-page">
    <div class="header">
      <van-nav-bar
          title="新手帮助"
          left-arrow
          @click-left="onClickLeft"
          :border="false"
      />
    </div>
    <div class="flex-1 overflow-auto">
      <img src="@/assets/img/help.jpg" class="w-full h-auto" alt="帮助说明"/>
    </div>
  </div>
</template>

<script>
import { NavBar } from "vant";

export default {
  components: {
    [NavBar.name]: NavBar,
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.fund-details-page {
  .header {
    background: transparent;
    :deep(.van-nav-bar) {
      background: transparent;
      .van-nav-bar__title {
        color: #333;
      }
      .van-icon {
        color: #333;
      }
    }
  }
}
</style>
