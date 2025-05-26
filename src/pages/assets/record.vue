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
            :finished-text="list.length>10?'没有更多了':''"
            @load="loadMore"
            @refresh="refreshData"
        >
          <div v-for="(item, index) in list" :key="index" class="flex flex-col bg-white p-2 border-line"
               :class="{ 'border-b': index !== list.length - 1 }">

            <div class="flex flex-row justify-between items-center">
              <div class="text-sm text-b333">{{ item.assetTitle }}</div>
              <div class="text-sm text-b333">{{ item.createtime | timeFormat('YYYY.MM.DD') }}</div>

            </div>
            <div class="flex flex-row justify-between items-center my-1">
              <div class="text-sm text-b666" v-if="item.payStatus === 1">已支付：{{ item.payPrice }}元</div>
              <div class="text-sm text-b666" v-else>未支付</div>
              <div class="text-sm text-b666" v-if="item.payStatus === 1">审核进度：{{ item.progress || '3' }}%</div>
              <Button v-else type="danger" round size="small" class="ml-2" @click="jumpToPay(item)">立即支付</Button>
            </div>
            <p class="text-sm text-b666" v-if="item.payStatus === 1">财政部审核预计30-50天内恢复完成</p>
          </div>
        </list>
        <Empty v-if="list.length === 0 && !loading" description="暂无数据"/>
      </PullRefresh>
    </div>
    </div>
  </div>
</template>

<script>


import axios from "@/net/axios";
import api from "@/net/api";
import {Button, Empty, List, NavBar, PullRefresh} from "vant";

export default {
  name: "index",
  components: {NavBar, List,Empty, PullRefresh,Button},
  data() {
    return {
      title: this.$route.meta.title,
      totalPage: 0,
      pageSize: 10,
      pageNo: 1,
      list: [],
      // list: [{
      //   assetTitle: "测试资产",
      //   createtime: "2020-01-01 12:00:00",
      //   payPrice: "60",
      //   progress: "60",
      // },{
      //   assetTitle: "测试资产",
      //   createtime: "2020-01-01 12:00:00",
      //   payPrice: "60",
      //   progress: "60",
      // }],
      loading: false,
      finished: false,
      refreshing: false,
    };
  },

  methods: {

    onClickLeft() {
      // 点击左侧返回按钮返回上一页
      this.$router.go(-1);
    },
    refreshData() {
      this.refreshing = true
      this.pageNo = 1
      this.totalPage = 0
      this.loadMore()
    },
    loadMore() {
      // this.loading = false
      // this.refreshing = false
      // this.finished = true;
      // return;
      axios
          .post(api.assetBuyRecordList, {
            params: {
              pageNo: this.pageNo,
              pageSize: this.pageSize,
              level: this.level
            }
          })
          .then((res) => {

            if (this.pageNo === 1) {
              this.list = res.data;
              this.totalPage = res.totalPage;
            } else {
              this.list = this.list.concat(res.data);
            }
            this.loading = false
            this.refreshing = false
            if (this.list.length < this.count) {
              this.pageNo++;
            } else {
              this.finished = true;
            }
          })
          .catch((err) => {
            this.loading = false
            this.refreshing = false
            this.finished = true;
            err.msg && this.$toast(err.msg);
          });
    },
    jumpToPay(data) {
      if (data.isBuy == 1) {
        this.$toast('该资产正在审核中，请耐心等待');
        return;
      }
      this.$router.push({
        name: "buyAssets",
        query: {
          id: data.assetId,
          name: data.assetTitle,
          price: data.payPrice,
        },
      });
    },
  },
};
</script>

<style scoped lang="less">

</style>
