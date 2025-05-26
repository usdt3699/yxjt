<template>
  <div class="px-4 w-full">
    <div class="container w-full">
      <div class="text-black font-bold text-lg mb-2 ml-2">常用功能</div>
      <div class="w-full text-black text-base flex flex-row flex-wrap">
        <div class="w-1/4 flex flex-col justify-center items-center mb-2" @click="jumpToPage('realNameAuth')" v>
          <img src="@/assets/img/profile/smrz.png" alt="" style="height: 30px;" class="mb-1">
          <span>实名绑定</span>
        </div>
        <div class="w-1/4 flex flex-col justify-center items-center mb-2" @click="jumpToPage('bindBankCard')" v>
          <img src="@/assets/img/profile/yhbd.png" alt="" style="height: 30px;" class="mb-1">
          <span>银行卡绑定</span>
        </div>
        <div class="w-1/4 flex flex-col justify-center items-center mb-2" @click="jumpToPage('contactUs')" v>
          <img src="@/assets/img/profile/zxkf.png" alt="" style="height: 30px;" class="mb-1">
          <span>社交群聊</span>
        </div>
        <div class="w-1/4 flex flex-col justify-center items-center mb-2" @click="jumpToPage('team')" v>
          <img src="@/assets/img/profile/team.png" alt="" style="height: 30px;" class="mb-1">
          <span>我的团队</span>
        </div>
        <div class="w-1/4 flex flex-col justify-center items-center mb-2" @click="jumpToPage('fundDetails')" v>
          <img src="@/assets/img/profile/zjmx.png" alt="" style="height: 30px;" class="mb-1">
          <span>资金明细</span>
        </div>
        <div class="w-1/4 flex flex-col justify-center items-center mb-2" @click="jumpToPage('withdrawRecord')" v>
          <img src="@/assets/img/profile/txjl.png" alt="" style="height: 30px;" class="mb-1">
          <span>提现记录</span>
        </div>
        <div class="w-1/4 flex flex-col justify-center items-center mb-2" @click="jumpToPage('buyBonusList')" v>
          <img src="@/assets/img/profile/gmjl.png" alt="" style="height: 30px;" class="mb-1">
          <span>购买记录</span>
        </div>
        <div class="w-1/4 flex flex-col justify-center items-center mb-2" @click="jumpToPage('downloadApp')" v>
          <img src="@/assets/img/profile/download.png" alt="" style="height: 30px;" class="mb-1">
          <span>App下载</span>
        </div>
      </div>
      <button class="bg-primary text-white font-bold text-base rounded-full py-2 my-4 mx-10" @click="onLoginOut">退出登录
      </button>
    </div>
  </div>
</template>

<script>

import {Grid, GridItem, NavBar} from "vant";
import Presidential from "@/components/Presidential";
import Withdraw from "@/components/Withdraw";
import Notice from "@/components/Notice";

export default {
  components: {NavBar, Grid, GridItem, Presidential, Withdraw, Notice},
  props: ['pageKey'],
  data() {
    return {};
  },

  mounted() {

  },

  methods: {
    jumpToPage(name) {
      if (name == 'downloadApp') {
        window.location.href = '/download.html';
        return
      }
      if (name == 'customService') {
        // window.location.href = this.$config.KF_URL;
        return
      }
      this.$router.push({name});
    },
    onLoginOut() {
      this.$dialog.confirm({
        title: '提示',
        message: '确定要退出登录吗？',
      })
          .then(() => {
            this.$store.commit("tabs/ACCOUNT_LOGOUT_FAILURE", true);
          })
          .catch(() => {
          });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  background: #FFFFFF;
  opacity: 0.9;
  box-shadow: 0px 0px 11.6px 0px #C1C1C140;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  color: #898989;
  font-size: 14px;
  padding: 10px 0;
  margin-bottom: 10px
}

.count-img {
  height: 26px;
  margin-bottom: 6px;
}
</style>
