<template>
  <div class="title-bar flex items-center justify-between px-4 py-3">
    <div class="flex items-center" @click="$emit('back')">
      <van-icon name="arrow-left" size="20" />
      <span class="ml-1">返回</span>
    </div>
    <div class="logo">
      <img :src="logoSrc" alt="logo" class="w-[153px] h-[38px]" />
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';

export default {
  name: "TitleBar",
  components: {
    [Icon.name]: Icon
  },
  props: {
    logoSrc: {
      type: String,
      default: () => require('@/assets/img/home/yuexiu_logo.png')
    }
  },
  emits: ['back']
}
</script>

<style scoped lang="less">
.title-bar {
  // 标题栏样式
  width: 100%;
  background-color: transparent;
  position: relative;
  z-index: 10;
}
</style>
