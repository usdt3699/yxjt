<template>
  <div class="h-full w-full bg">
    <nav-bar
        :title="title"
        left-text=""
        :left-arrow="false"
        :border="false"
        :safe-area-inset-top="true"
    />
    <div class="overflow-hidden w-full">
      <div class="page-content">
        <PullRefresh v-model="refreshing" @refresh="refreshData" class="h-full">

          <list
              v-model="loading"
              :finished="finished"
              @load="loadMore"
              @refresh="refreshData"
          >
            <div class="mx-2 flex flex-col">
              <div class="w-full bg-white rounded-xl mb-2" v-for="(item, index) in list" :key="index">
                <div class="relative">
                  <img :src="item.pic_url"/>
                  <div class="text-white text-lg font-bold text-center mt-2 absolute bottom-3  right-3 text-center">
                    钱包余额<br/>
                    <span style="color: red">{{ item.amount }}</span>
                  </div>
                </div>

                <div class="flex flex-row items-center justify-between p-2">
                  <div class="text-lg font-bold text-black">{{ item.title }}</div>
                  <div v-if="item.status==-1" class="btn px-2 py-1 text-sm text-white rounded-lg"
                       @click="jumpToPay(item)">立即制卡
                  </div>
                  <div v-else-if="item.status==0" class="btn px-2 py-1 text-sm text-white rounded-lg"
                       @click="jumpToAddress(item)">填写邮寄地址
                  </div>
                  <div v-else class=" px-2 py-1 text-sm text-black rounded-lg flex flex-row items-center">
                    <span>制作中</span>
                    <div  class="border border-F8574F px-2 py-1 text-sm text-red-600 rounded-lg ml-2"
                          @click="jumpProgress(item)">制卡进度
                    </div>
                  </div>
                </div>
                <div class="text-838383 text-base flex flex-row items-center justify-between p-2">
                  <div>
                    <div>日额度：<span class="text-red-500">{{ item.stock|formatDecimal2 }}</span></div>
                    <div>可绑定微信</div>
                  </div>
                  <div>
                    <div>年额度：<span class="text-red-500">{{ item.total|formatDecimal2 }}</span></div>
                    <div>可绑定支付宝</div>
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
import {Empty, NavBar, List, PullRefresh} from "vant";
import {isNullOrEmpty} from "@/utils";
import {mapActions, mapState} from "vuex";

export default {
  name: "index",
  components: {List, Empty, NavBar, PullRefresh},
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
  onShow() {

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
      return `(${value.one * 100 * 3}% ${value.two * 100 * 3}% ${value.three * 100 * 3}%)`
    },
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    title() {
      return this.$route.meta.title; // 获取路由的meta属性的title值
    }
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    onFinished(status) {
      this.showMultiple = !status;
    },
    refreshData() {
      this.refreshing = true
      this.loadMore()
    },

    loadMore() {
      const request1 = axios.get(api.cardAddressList);
      const request2 = axios.get(api.welfareList);
      const request3 = axios.get(api.userInfo);
      // 合并请求
      axios.all([request1, request2,request3])
          .then(axios.spread((response1, response2,response3) => {
            this.loading = false
            this.finished = true
            console.log('请求成功', response1.data, response2.data)
            this.list = response2.data.filter(data => data.ntype == 8).map((item,index) => {
              item.status = -1;//默认没有购买 0 未填写地址
              if (!isNullOrEmpty(response1.data)) {
                const buyCard = response1.data.find(data => data.bid == item.id)
                if (buyCard) {
                  item.status = buyCard.status;
                  item.packageId = buyCard.id;
                  item.pic_url = buyCard.image_url;
                  item.cardAddress = buyCard;
                }
              }
              switch (index) {
                case 0:
                  item.amount = response3.data.btamount||'0';
                  break;
                case 1:
                  item.amount = response3.data.tjamount||'0';
                  break;
                case 2:
                  item.amount = response3.data.fpamount||'0';
                  break;
                case 3:
                  item.amount = response3.data.bzamount||'0';
                  break;
              }
              return item;
            })
            console.log('最后的结果', this.list)
          }))
          .catch(err => {
            err.msg && this.$toast(err.msg);
          });
    },
    jumpToPay(data) {
      console.log('点击跳转', data)
      this.$router.push({
        name: "buyCard",
        query: {
          id: data.id,
          price: data.price,
          content: data.title + '制作费',
          title: '立即支付',
        },
      });
    },
    jumpToAddress(data) {
      console.log('点击跳转', data)
      this.$router.push({
        name: "addAddress",
        query: {
          id: data.packageId,
        },
      });
    },
    jumpProgress(data) {
      console.log('点击跳转', data)
      this.$router.push({
        name: "cardProgress",
        query: {
          address: data.cardAddress.address,
          name: data.cardAddress.name,
          phone: data.cardAddress.phone,
          title: data.title,
        },
      });
    },

  },
};
</script>

<style scoped lang="less">
.van-nav-bar {
  background-color: transparent;
}

.van-nav-bar /deep/ .van-nav-bar__title {
  color: #fff;
}

.bg {
  background-image: url('../../assets/img/dividend/bg-yhk.png');
  background-size: 100% auto;
  background-repeat: no-repeat;
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

.btn {
  background: linear-gradient(90deg, #FF5455, #FFB533);
}

</style>
