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
      <div class="page-content-2" >
      <PullRefresh v-model="refreshing" @refresh="refreshData" class="h-full">
        <list
            v-model="loading"
            @load="loadMore"
            @refresh="refreshData"
            :finished="finished"
        >
          <div v-for="(item, index) in list" :key="index" class="flex flex-col bg-white p-2 py-3 border-line"
               :class="{ 'border-b': index !== list.length - 1 }">
            <div class="flex flex-row ml-1 justify-between">
              <div v-if="item.type==1" class="text-sm text-g999">未中奖</div>
              <div v-else class="text-sm text-b666">奖品:<span class="font-bold">{{ item.prize_name }}</span></div>
              <div class="text-sm text-b333">抽奖时间：{{ item.createtime | formatTimestamp('YYYY.MM.DD HH:mm') }}</div>
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


import TitleBar from "@/components/TitleBar";
import axios from "@/net/axios";
import api from "@/net/api";
import {Empty, List, NavBar, PullRefresh,} from "vant";

export default {
  components: {TitleBar, NavBar, List, Empty, PullRefresh,},
  data() {
    return {
      title: this.$route.meta.title,
      totalPage: 0,
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
      this.loadMore()
    },
    loadMore() {
      axios
          .get(api.drawRecord)
          .then((res) => {
            this.list=res.data
            this.loading = false
            this.finished = true
          })
          .catch((err) => {
            this.loading = false
            this.refreshing = false
            this.finished = true
          });
    },
  },
};
</script>

<style scoped lang="less">

</style>
