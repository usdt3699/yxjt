<template>
  <div class="h-full w-full flex flex-col">
    <nav-bar
        :title="title"
        left-text=""
        left-arrow
        @click-left="onClickLeft"
        :safe-area-inset-top="true"
    />
    <div class="overflow-hidden w-full">
      <div class="page-content-2">
        <PullRefresh v-model="refreshing" @refresh="refreshData" class="h-full">
          <!--        <div class="bg-white flex flex-row justify-evenly items-center px-4 py-2 m-2 rounded-md"-->
          <!--        >-->

          <!--          <div class="flex flex-col flex-1 items-center">-->
          <!--            <p class="text-red-500">{{ childCount.totalStock ? childCount.totalStock : '0' }}股</p>-->
          <!--            <div class="flex flex-row items-center">-->
          <!--              <i class="iconfont icon-gufenshouyi text-green-500 mr-1"/>-->
          <!--              <p class="text-sm">总股份数</p>-->
          <!--            </div>-->

          <!--          </div>-->
          <!--          <div class="flex flex-col flex-1 items-center">-->
          <!--            <p class="text-red-500">{{ childCount ? childCount.totalMarketPrice : '0.00' }}元</p>-->
          <!--            <div class="flex flex-row items-center">-->
          <!--              <i class="iconfont icon-jiazhi text-yellow-500 mr-1"/>-->
          <!--              <p class="text-sm">总价值</p>-->
          <!--            </div>-->
          <!--          </div>-->
          <!--        </div>-->
          <list
              v-model="loading"
              :finished="finished"
              :finished-text="list.length>10?'没有更多了':''"
              @load="loadMore"
              @refresh="refreshData"
          >
            <div v-for="(item, index) in list" :key="index" class="flex flex-row items-center bg-white p-2 border-line"
                 :class="{ 'border-b': index !== list.length - 1 }">
              <div class="flex flex-col ml-1 flex-1">
                <div class="text-sm text-b333">{{ item.title }}</div>
                <div class="text-sm text-b666 flex flex-row  items-center mt-1">购买成功
                </div>
              </div>
              <div class="flex flex-col ml-1">
                <div class="text-sm text-b333 flex flex-row  items-center">
                  <div class="flex-1"/>
                  <span>每日分红:</span>
                  <div class="text-red-500">{{ item.bonus.bonus|formatDecimal }}</div>
                  <span>元</span>
                </div>
                <div class="text-sm text-b666  mt-1">{{ item.createtime | timeFormat('YYYY.MM.DD') }}</div>
              </div>
            </div>
          </list>
          <Empty v-if="list.length === 0" description="暂无数据"/>
        </PullRefresh>
      </div>
    </div>
  </div>
</template>

<script>


import axios from "@/net/axios";
import api from "@/net/api";
import {mapActions, mapState} from "vuex";
import {Empty, List, NavBar, PullRefresh,} from "vant";

export default {
  name: "index",
  components: {NavBar, List,  Empty, PullRefresh},
  data() {
    return {
      totalPage: 0,
      pageSize: 10,
      pageNo: 1,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      childCount: {},
    };
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    title() {
      return this.$route.meta.title; // 获取路由的meta属性的key值
    }
  },
  mounted() {
    this.getUserInfo();
  },
  // watch: {
  //   userInfo: {
  //     handler(newVal, oldVal) {
  //         this.getTeamStatistics()
  //     },
  //     immediate: true
  //   }
  // },
  filters: {
    formatDecimal(value) {
      if (!value)
        return "0"
      return parseFloat(value).toFixed(2);
    },

  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    onClickLeft() {
      // 点击左侧返回按钮返回上一页
      this.$router.go(-1);
    },
    jumpToLevel(level) {
      this.$router.push({name: 'childTeam', params: {level: level}})
    },
    refreshData() {
      this.refreshing = true
      this.pageNo = 1
      this.totalPage = 0
      // this.getTeamStatistics()
      this.loadMore()
    },
    loadMore() {

      axios
          .get(api.buyBonusList, {
            params: {
              source: 1
            }
          })
          .then((res) => {
            this.list = res.data;
            this.loading = false
            this.refreshing = false
            this.finished = true;
          })
          .catch((err) => {
            this.loading = false
            this.refreshing = false
            this.finished = true;
            err.msg && this.$toast(err.msg);
          });
    },
    getTeamStatistics() {
      axios
          .post(api.bonusStatistic, {})
          .then((res) => {
            this.childCount = res.data
          })
          .catch((err) => {
            err.msg && this.$toast(err.msg);
          });
    },
  },
};
</script>

<style scoped lang="less">
</style>
