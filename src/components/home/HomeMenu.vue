<template>
  <div class="flex flex-row justify-evenly py-4 bg-white rounded">
    <div
        class="flex flex-col items-center justify-center"
        @click="jumpToPage('businessLicense')"
    >
      <img src="@/assets/img/index/ic_yyzz.png" class="w-10">
      <div class="text-base text-b333 mt-1">营业执照</div>
    </div>
    <div
        class="flex flex-col items-center justify-center"
        @click="jumpToPage('contactUs')"
    >
      <img src="@/assets/img/index/ic_share.png" class="w-10">
      <div class="text-base text-b333 mt-1">官网群聊</div>
    </div>
    <div
        class="flex flex-col items-center justify-center"
        @click="jumpToPage('userInvite')"
    >
      <img src="@/assets/img/index/ic_share.png" class="w-10">
      <div class="text-base text-b333 mt-1">分享</div>
    </div>
    <div
        class="flex flex-col items-center justify-center"
        @click="jumpToPage('capitalAssets')"
    >
      <img src="@/assets/img/index/ic_zcjs.png" class="w-10">
      <div class="text-base text-b333 mt-1">资产结算</div>
    </div>

  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("systemInfo", ["systemInfo"]),
    ...mapState("user", ["userInfo"]),
  },
  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),
    jumpToPage(name) {
      if (name == 'downloadApp') {
        this.$router.push({name: 'inviteUser', query: {code: this.userInfo.code}});
        return
      }
      if (name == 'customService') {
        // window.location.href = this.$config.KF_URL;
        return
      }
      this.$router.push({name});
    },
  },
};
</script>
<style scoped lang="less">
</style>
