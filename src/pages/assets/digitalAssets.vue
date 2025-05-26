<template>
  <PullRefresh v-model="refreshing" @refresh="refreshData" class="h-full">
    <list
        v-model="loading"
        :finished="finished"
        @load="loadMore"
        @refresh="refreshData"
    >
      <div class="bg-FDA64C rounded-lg p-4 flex flex-col justify-center items-center body-content relative">
        <div class="border-b border-gray-100 py-2 px-4 mb-2 flex justify-center items-center ">
          <span class="text-lg text-white font-bold">数字资产</span>
          <div @click="changePage"
               class="rounded flex justify-center items-center px-2 text-base bg-yellow-400 text-red-600 absolute right-4 top-6">
            我的资产
          </div>
        </div>
        <div class="bg-white w-full py-2 flex flex-row mb-4 rounded relative justify-center"
             v-for="(item,index) in list"
             :key="index">
          <div class="flex-1 flex flex-col justify-center items-center">
            <div>{{ item.price }}元</div>
            <div class="text-base">购买价格</div>
          </div>
          <div class="flex-1 flex flex-col justify-center items-center mb-2">
            <div class="text-pink-800">{{ item.numrmb|formatDecimal2 }}</div>
            <div class="text-base">数字资产</div>
          </div>
          <img src="@/assets/img/dividend/buy.png" style="height: 30px;margin: auto;"
               class="absolute  -bottom-3"
               @click="jumpToPay(item)"/>
        </div>
      </div>
    </list>
    <Empty v-if="isNullOrEmpty(list)&&loading===false&&refreshing==false" description="暂无数据"/>
  </PullRefresh>
</template>
<script>
import {Empty, List, PullRefresh} from "vant";
import {isNullOrEmpty} from "@/utils";
import axios from "@/net/axios";
import api from "@/net/api";

export default {
  name: "DigitalAssets",
  components: {List, Empty, PullRefresh},
  data() {
    return {
      isNullOrEmpty,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
    };
  },
  computed: {
    title() {
      return this.$route.meta.title; // 获取路由的meta属性的title值
    }
  },
  filters: {
    formatDecimal(value) {
      return parseFloat(value).toFixed(1);
    },
    formatDecimal2(value) {
      return parseFloat(value).toFixed(0);
    }
  },
  methods: {
    refreshData() {
      this.refreshing = true
      this.loadMore()
    },
    loadMore() {
      axios.get(api.welfareList)
          .then(res => {
            this.list = res.data.filter(item => item.ntype == 5);
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
          stock: data.numrmb,
          price: data.price,
          title: '数字资产',
        },
      });
    },
    changePage() {
      this.$router.push({
        name: "myAssets", // 跳转到我的资产页面
      });
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

.title-box {
  background-image: url('../../assets/img/bg-welfare.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 290px;
  height: 44px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -20px;
  color: #AB0F13;
  font-size: 16px;
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

</style>
