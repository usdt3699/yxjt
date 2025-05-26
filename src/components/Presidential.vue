<template>
  <div class="count-container mx-4">
    <!--    <div class="flex flex-col items-center justify-center">-->
    <!--      <img src="@/assets/img/dividend/gzfh.png" class="count-img"/>-->
    <!--      <div>-->
    <!--        国债分红-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <span>{{ walletInfo.salary || '0.00' }}</span>元-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="flex flex-col items-center justify-center">
      <img src="@/assets/img/dividend/wdgz.png" class="count-img"/>
      <div>
        我的国债
      </div>
      <div>
        <span>{{ (walletInfo.stock || '0')|formatDecimal2 }}</span>股
      </div>
    </div>
    <div class="flex flex-col items-center justify-center">
      <img src="@/assets/img/dividend/tjjgz.png" class="count-img"/>
      <div>
        推荐奖国债
      </div>
      <div>
        <span>{{ (walletInfo.bonus_stock || '0')|formatDecimal2 }}</span>股
      </div>
    </div>
    <div class="flex flex-col items-center justify-center">
      <img src="@/assets/img/dividend/gzfh.png" class="count-img"/>
      <div>
        总数国债
      </div>
      <div>
        <span>{{ getTotal(walletInfo) }}</span>股
      </div>
    </div>
  </div>
</template>

<script>

import axios from "@/net/axios";
import api from "@/net/api";

export default {
  props: ['pageKey'],
  data() {
    return {
      walletInfo: {},
    };
  },

  mounted() {
    this.getUserWallet();
  },
  filters: {
    formatDecimal(value) {
      return parseFloat(value).toFixed(1);
    },
    formatDecimal2(value) {
      return parseFloat(value).toFixed(0);
    },
    formatDecimal3(value) {
      return (parseFloat(value) / 10000).toFixed(0) + '万';
    }
  },
  methods: {
    getTotal(walletInfo) {
      try{
        const total = parseInt(walletInfo.stock) + parseInt(walletInfo.bonus_stock)
        return total.toFixed(0)||'0';
      }
      catch (e) {
        return '0'
      }
    },
    getUserWallet() {
      axios.get(api.userWallet)
          .then((res) => {
            this.walletInfo = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
    },
  },
};
</script>

<style lang="less" scoped>
.count-container {
  background: #FFFFFF;
  opacity: 0.9;
  box-shadow: 0px 0px 11.6px 0px #C1C1C140;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  color: #898989;
  font-size: 14px;
  padding: 10px 0;
  margin-top: -30px;
  margin-bottom: 10px;

  /deep/ span {
    color: #FF0000;
  }
}

.count-img {
  height: 26px;
  margin-bottom: 6px;
}
</style>
