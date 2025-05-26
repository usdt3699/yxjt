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
          <list
              v-model="loading"
              :finished="finished"
              @load="loadMore"
              @refresh="refreshData"
          >
            <div v-for="(item, index) in list" :key="index" class="flex flex-col bg-white p-2 border-line"
                 :class="{ 'border-b': index !== list.length - 1 }">

              <div class="flex flex-row ml-1 justify-between">
                <div  class="text-sm text-b666 font-bold">{{ item.prize_name }}</div>
                <div class="text-sm text-b333">时间：{{ item.createtime | formatTimestamp('YYYY.MM.DD HH:mm') }}</div>
              </div>

            </div>
          </list>
          <Empty v-if="isNullOrEmpty(list)" description="暂无数据"/>
        </PullRefresh>
      </div>
    </div>
  </div>
</template>
<script>


import TitleBar from "@/components/TitleBar";
import axios from "@/net/axios";
import api from "@/net/api";
import {Empty, List, NavBar, PullRefresh,} from "vant";
import {getReviewStatusLabel, ReviewStatus, getNTypeLabel, NType} from "@/config";
import {isNullOrEmpty} from "@/utils";

export default {
  components: {TitleBar, NavBar, List, Empty, PullRefresh,},
  data() {
    return {
      getReviewStatusLabel,
      getNTypeLabel,
      isNullOrEmpty,
      NType,
      title: this.$route.meta.title,
      count: 0,
      pageSize: 10,
      pageNo: 1,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
    };
  },
  filters: {
    getLastFourDigits(value) {
      return value.slice(-4);
    },
  },
  methods: {
    onClickLeft() {
      // 点击左侧返回按钮返回上一页
      this.$router.go(-1);
    },
    refreshData() {
      this.refreshing = true
      this.pageNo = 1
      this.count = 0
      this.loadMore()
    },
    loadMore() {
      axios
          .get(api.myHouse)
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
    getStatusColorClass(status) {
      switch (status) {
        case ReviewStatus.PAID:
          return 'text-green-500'; // 返回绿色文字样式类
        case ReviewStatus.PAYMENT_FAILED:
          return 'text-red-500'; // 返回红色文字样式类
        default:
          return 'text-b333'; // 默认文字样式类
      }
    },
  },
};
</script>

<style scoped lang="less">

</style>
