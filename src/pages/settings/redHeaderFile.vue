<template>
  <div class="page-container h-screen">
    <nav-bar
        :title="title"
        left-text=""
        left-arrow
        @click-left="onClickLeft"
        :safe-area-inset-top="true"
        class="w-full"
    />
    <div class="flex-grow overflow-hidden w-full">
      <div class="overflow-y-auto h-full">
        <div class="bg-white m-4 p-3" v-html="systemInfo.aboutus">

        </div>
      </div>
    </div>
  </div>
</template>
<script>

import TitleBar from "@/components/TitleBar";
import {mapActions, mapState} from "vuex";
import {NavBar,} from "vant";

export default {
  name: "ContactUs",
  components: {TitleBar,NavBar,},
  computed: {
    ...mapState("user", ["userInfo"]),
    ...mapState("systemInfo", ["systemInfo"]),
    title() {
      return this.$route.meta.title; // 获取路由的meta属性的key值
    }
  },
  mounted() {
    this.getSystemInfo();
  },
  data() {
    return {
      details: {},
      id: this.$route.params.id,
    }
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    ...mapActions("systemInfo", ["getSystemInfo"]),
    onClickLeft() {
      // 点击左侧返回按钮返回上一页
      this.$router.go(-1);
    },
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
