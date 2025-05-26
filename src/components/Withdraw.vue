<template>
  <div class="bg-F6F6F6 rounded">
  <div class="withdrawal-container">
    <div class="flex flex-col items-center justify-center">
      <div class="text-black font-bold text-base">
        百姓补贴
      </div>
      <div class="my-1">
        <span>{{ walletInfo.annuity || '0.00' }}</span>元
      </div>
      <button class="btn-primary" @click="jumpToWithdraw('annuity','百姓补贴',walletInfo.annuity)">立即提现</button>
    </div>
    <div class="flex flex-col items-center justify-center">
      <div class="text-black font-bold text-base">
        推广奖
      </div>
      <div class="my-1">
        <span>{{ walletInfo.cash || '0' }}</span>元
      </div>
      <button class="btn-primary" @click="jumpToWithdraw('cash','推广奖',walletInfo.cash)">立即提现</button>
    </div>
    <div class="flex flex-col items-center justify-center">
      <div class="text-black font-bold text-base">
        扶贫金
      </div>
      <div class="my-1">
        <span>{{ walletInfo.totalbalance || '0' }}</span>元
      </div>
      <button class="btn-primary" @click="jumpToWithdraw('totalbalance','扶贫金',walletInfo.totalbalance)">立即提现</button>
    </div>
  </div>
<!--  <div class="withdrawal-container">-->
<!--    <div class="flex flex-col items-center justify-center">-->
<!--      <div class="text-black font-bold text-base">-->
<!--        百姓保障-->
<!--      </div>-->
<!--      <div class="my-1">-->
<!--        <span>{{ walletInfo.totalprofit || '0' }}</span>元-->
<!--      </div>-->
<!--      <button class="btn-EDEDED border-E58201 border text-base px-2 rounded text-CE6F00" >自动释放</button>-->
<!--    </div>-->
<!--    <div class="flex flex-col items-center justify-center">-->
<!--      <div class="text-black font-bold text-base">-->
<!--        每日释放-->
<!--      </div>-->
<!--      <div class="my-1">-->
<!--        <span>{{ walletInfo.fund || '0' }}</span>元-->
<!--      </div>-->
<!--      <button class="btn-primary" @click="jumpToWithdraw('fund','每日释放',walletInfo.fund)">立即提现</button>-->
<!--    </div>-->
<!--    <div class="flex flex-col items-center justify-center">-->
<!--      <div class="text-black font-bold text-base">-->
<!--        团队奖励-->
<!--      </div>-->
<!--      <div class="my-1">-->
<!--        <span>{{ walletInfo.bonus || '0' }}</span>元-->
<!--      </div>-->
<!--      <button class="btn-primary" @click="jumpToWithdraw('bonus','团队奖励',walletInfo.bonus)">立即提现</button>-->
<!--    </div>-->

<!--  </div>-->
  <div class="withdrawal-container">
    <div class="flex flex-col items-center justify-center">
      <div class="text-black font-bold text-base">
        资金保障
      </div>
      <div class="my-1">
        <span>{{ userInfo.baoxian || '0' }}</span>元
      </div>
      <button class="btn-primary" @click="jumpToWithdraw('baoxian','资金保障',userInfo.baoxian)">立即提现</button>
    </div>
    <div class="flex flex-col items-center justify-center">
      <div class="text-black font-bold text-base">
        每日分红
      </div>
      <div class="my-1">
        <span>{{ userInfo.baoxianshifang || '0' }}</span>元
      </div>
      <button class="btn-primary" @click="jumpToWithdraw('baoxianshifang','每日分红',userInfo.baoxianshifang)">立即提现</button>
    </div>
    <div class="flex flex-col items-center justify-center">
      <div class="text-black font-bold text-base">
        保险团队奖
      </div>
      <div class="my-1">
        <span>{{ userInfo.baoxiantuandui || '0' }}</span>元
      </div>
      <button class="btn-primary" @click="jumpToWithdraw('baoxiantuandui','保险团队奖',userInfo.baoxiantuandui)">立即提现</button>
    </div>
  </div>
  </div>
</template>

<script>

import axios from "@/net/axios";
import api from "@/net/api";
import {mapState} from "vuex";

export default {
  props: ['pageKey'],
  data() {
    return {
      walletInfo: {},
    };
  },
  computed: {
    ...mapState("user", ["userInfo"])
  },
  mounted() {
    this.getUserWallet();
  },

  methods: {
    getUserWallet() {
      axios.get(api.userWallet)
          .then((res) => {
            this.walletInfo = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
    },
    jumpToWithdraw(type, title, amount) {
      if ((type == 'baoxian'||type == 'baoxiantuandui')&&(this.userInfo.activate&16)==0) {
        this.$dialog.alert({
          title: '提示',
          message: '先购买百姓保险',
          theme: 'round-button',
        }).then(() => {
          this.$router.push({name: "insurance"});
          this.$bus.$emit('active', 3);
        });
        return
      }
      // if (type == 'totalbalance') {
      //   this.$dialog.alert({
      //     title: '提示',
      //     message: '周六日暂未开放',
      //     theme: 'round-button',
      //   }).then(() => {
      //
      //   });
      //   return
      // }
      // if (type == 'salary'&&amount<30) {
      //   this.$dialog.alert({
      //     title: '提示',
      //     message: '国债分红满30可提现',
      //     theme: 'round-button',
      //   }).then(() => {
      //
      //   });
      //   return
      // }

      this.$router.push({
        name: "withdrawal",
        query: {type, title, amount},
      });
    },
  },
};
</script>

<style lang="less" scoped>
.withdrawal-container {
  background: #F6F6F6;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  color: #898989;
  font-size: 14px;
  padding: 10px 0;
  margin: 10px 0;

  /deep/ span {
    color: #FF0000;
  }
}

.btn-primary {
  font-family: MiSans;
  font-size: 13px;
  font-weight: 400;
  line-height: 13px;
  text-align: left;
  color: #FFFFFF;
  background-color: #F91126;
  border-radius: 5px;
  padding: 5px 10px;

}
</style>
