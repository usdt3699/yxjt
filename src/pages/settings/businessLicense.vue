<template>
  <div class="page-container h-screen">
    <nav-bar
        :title="title"
        left-text=""
        left-arrow
        @click-left="onClickLeft"
        :safe-area-inset-top="true"
        class="w-full"
        :border="false"
    />
    <div class="flex-grow overflow-hidden w-full">
      <div class="overflow-y-auto h-full">
        <div class="bg-white m-4 p-3">
          <img
            :src="imgUrl"
            class="w-full h-auto object-contain cursor-pointer"
            alt="营业执照"
            @click="showImage"
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import TitleBar from "@/components/TitleBar";
import {NavBar, ImagePreview} from "vant";

export default {
  components: {TitleBar,NavBar,},

  data() {
    return {
      title: '营业执照',
      imgUrl: require('@/assets/img/yyzz.jpg')
    }
  },
  methods: {
    onClickLeft() {
      // 点击左侧返回按钮返回上一页
      this.$router.go(-1);
    },
    showImage() {
      ImagePreview([this.imgUrl]);
    }
  },



}
</script>

<style scoped lang="less">
img {
  max-width: 100%;
}

.enTitle {
  font-size: 30px;
  color: #F91126;
  letter-spacing: -3px;
  text-transform: uppercase;
}

.contentBox {
  width: 90%;
  padding: 10px;
  margin: 20px auto;
  background-color: #fff;
}

.contentBox .title {
  font-size: 30px;
  color: #bc8f4b;
}

.contentBox .content > h1 {
  color: #3f3e55;
  font-size: 30px;
}

.contentBox .content > h2 {
  color: #3f3e55;
  font-size: 18px;
  opacity: 0.9;
  padding-bottom: 25px;
}

.contentBox .content > p {
  font-size: 14px;
  line-height: 24px;
  color: #b1b1b1;
  padding-bottom: 20px;
}

.content {
  line-height: 1.8rem;
}
</style>
