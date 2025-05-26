<template>
  <div class="h-full w-full bg">

    <div class="overflow-hidden w-full">
      <div class="page-content-2">
        <PullRefresh v-model="refreshing" @refresh="refreshData" class="h-full">
          <div style="height: 80px"/>
          <BxBzCountDown  @onFinished="onFinished"/>
          <list
              v-model="loading"
              :finished="finished"
              @load="loadMore"
              @refresh="refreshData"
          >
            <div class="mx-2 flex flex-col rounded bg-white">
              <div class="w-full px-8 py-2">
                <img src="@/assets/img/dividend/bxbz.png"/>
              </div>
              <div class="item-container"
                   v-for="(item,index) in list"
                   :key="index">

                <div class="item-header py-2 flex flex-row items-center text-white relative ">
                  <img src="@/assets/img/dividend/icon-shbz.png"
                       style="height: 15px;margin-right: 3px;margin-left: 10px"/>
                  <div class="mr-1">{{ item.price|formatDecimal2 }}元</div>
                  <div> 百姓保障</div>
                  <img :src="getIcon(index)"  style="height: 40px"
                       class="absolute right-1 top-0"/>
                </div>
                <div class="flex-row flex text-base mt-2 items-center  ">
                  <img src="@/assets/img/dividend/icon-item.png" style="height: 60px"/>

                  <div class="ml-1 flex-1">
                    百姓保障: <span style="color: red">可获得{{ getStockInfo(item.stock, index) }}万</span><br/>
                    每日释放: <span style="color: red">10%</span><br/>
                    团队奖励: <span style="color: red">{{ getPercent(item,index) }}</span>
                  </div>
                  <div class="btn text-center text-white font-bold text-base flex justify-center items-center"
                       @click="jumpToPay(item)">购买
                  </div>
                </div>
              </div>
            </div>
          </list>
          <div style="height: 20px"/>
          <Empty v-if="isNullOrEmpty(list)&&loading===false&&refreshing==false" description="暂无数据"/>

        </PullRefresh>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "@/net/axios";
import api from "@/net/api";
import {Empty, List, PullRefresh} from "vant";
import {isNullOrEmpty} from "@/utils";
import BxBzCountDown from "@/components/BxBzCountDown";

export default {
  name: "index",
  components: {List, Empty, PullRefresh, BxBzCountDown},
  data() {
    return {
      active: 0,
      isNullOrEmpty,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      walletInfo: {},
      showMultiple: true,
    };
  },
  mounted() {

  },
  filters: {
    formatDecimal(value) {
      return parseFloat(value).toFixed(1);
    },
    formatDecimal2(value) {
      if (!value)
        return "0"
      return parseFloat(value).toFixed(0);
    },
    formatDecimal3(value) {
      if (!value)
        return "0"
      return (parseFloat(value) / 10000).toFixed(0);
    },
    formatPercent(value) {
      if (!value)
        return ""
      return `(${value.one * 100*3}% ${value.two * 100*3}% ${value.three * 100*3}%)`
    },
  },
  computed: {
    title() {
      return this.$route.meta.title; // 获取路由的meta属性的title值
    }
  },
  methods: {
    getIcon(index){
      switch (index) {
        case 0:
          return require('@/assets/img/dividend/three.png')
        case 1:
          return require('@/assets/img/dividend/four.png')
        case 2:
          return require('@/assets/img/dividend/5.png')
        case 3:
          return require('@/assets/img/dividend/6.png')
        case 4:
          return require('@/assets/img/dividend/10.png')
      }
    },

    onFinished(status) {
      this.showMultiple = !status;
    },
    refreshData() {
      this.refreshing = true
      this.loadMore()
    },
    getStockInfo(stock, index) {
      if (!stock)
        return "0"
      if (this.showMultiple) {
        switch (index) {
          case 0:
          return (parseFloat(stock) / 10000 * 3).toFixed(0);
          case 1:
            return (parseFloat(stock) / 10000 * 4).toFixed(0);
          case 2:
            return (parseFloat(stock) / 10000 * 5).toFixed(0);
          case 3:
            return (parseFloat(stock) / 10000 * 6).toFixed(0);
          case 4:
            return (parseFloat(stock) / 10000 * 10).toFixed(0);
        }
      } else {
        return (parseFloat(stock) / 10000).toFixed(0);
      }

    },
    getPercent(value, index) {
      if (!value)
        return "0"
      if (this.showMultiple) {
        switch (index) {
          case 0:
          return `(${value.one * 100*3}% ${value.two * 100*3}% ${value.three * 100*3}%)`
          case 1:
            return `(${value.one * 100*4}% ${value.two * 100*4}% ${value.three * 100*4}%)`
          case 2:
            return `(${value.one * 100*5}% ${value.two * 100*5}% ${value.three * 100*5}%)`
          case 3:
            return `(${value.one * 100*6}% ${value.two * 100*6}% ${value.three * 100*6}%)`
          case 4:
            return `(${value.one * 100*10}% ${value.two * 100*10}% ${value.three * 100*10}%)`
        }
      } else {
        return (parseFloat(stock) / 10000).toFixed(0);
      }

    },

    loadMore() {
      axios.get(api.welfareList)
          .then(res => {
            this.list = res.data.filter(item => item.ntype == 4);
            this.loading = false
            this.refreshing = false
            this.finished = true;
          })
          .catch(err => {
            this.loading = false
            this.finished = true
            this.refreshing = false
            err.msg && this.$toast(err.msg);
          });
    },
    jumpToPay(data) {
      this.$router.push({
        name: "buyDividend",
        query: {
          id: data.id,
          stock: (parseFloat(data.stock) / 10000).toFixed(0),
          price: data.price,
          title: '百姓保障',
          unit: '万'
        },
      });
    },

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

.bg {
  background-image: url('../../assets/img/dividend/bg_bxbz.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.btn {
  height: 40px;
  line-height: 40px;
  width: 60px;
  background: #E60012;
  box-shadow: 0px 6px 9px 0px rgba(255, 0, 0, 0.35);
  border-radius: 50px;
  border: 2px solid #FFC600;
}

.welfare-list-item {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #333;
  font-size: 14px;
  margin-bottom: 30px;
  flex-direction: column;
}

.list-item-content {
  top: 30px;
  background: #FFE7C1;
  border-radius: 20px;
  padding: 40px 20px 20px;
  display: flex;
  flex-direction: column;

}

.list-item-content .btn {
  background-image: linear-gradient(180deg, #FDE0B4 0%, #FFC771 100%);
  border-radius: 16px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #AB0F13;
  align-self: center;
  margin-top: 20px;
}

.content-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  opacity: 0.5;
  background: #FFFFFF;
  color: #3E3E3E;
  padding: 5px 15px;
  font-size: 12px;
  margin-top: 20px;
}

.progress-box {
  width: 60%;
  background-color: #AB0F13;
  height: 10px;
  margin: 0 10px;
  opacity: 1;
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

.top-container {
  background-image: url('../../assets/img/dividend/bg.png');
  background-size: 100%;
  background-repeat: no-repeat;
  height: 260px;
  padding-top: 190px;
  padding-left: 70px;
  padding-right: 20px;
}

.limit-content {
  background: linear-gradient(90deg, rgba(255, 238, 89, 0) 0%, #FFEE59 20%, #FFEE59 80%, rgba(255, 238, 89, 0) 100%);
  justify-content: center;
  display: flex;
  flex-direction: row;
  align-items: center;
}


.item-container {

  border-radius: 10px;
  border: 1px solid #DCDCDC;
  margin: 0 12px 15px;
  padding: 10px;

  .item-header {
    height: 50px;
    background: linear-gradient(90deg, #E40719, #FAB646);
    border-radius: 5px;
  }

}

.btn-buy {
  background: #F25D59;
  border-radius: 5px;
  color: #FFFFFF;
  font-size: 14px;
  padding: 5px 10px;
  cursor: pointer;
}

.content-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  opacity: 0.5;
  background: #FFFFFF;
  color: #3E3E3E;
  padding: 5px 15px;
  font-size: 12px;
  margin-top: 10px;
}

.progress-box {
  background-color: #E5E5E5;
  height: 6px;
  margin: 0 10px;

  .complete-progress {
    background-color: #F91126;
    height: 6px;
  }
}

</style>
