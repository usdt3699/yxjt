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
          <div v-for="(item, index) in list" :key="index" class="flex flex-col bg-white p-2 py-3 border-line m-2 rounded-md" >
            <div class="flex flex-row ml-1 justify-between">
              <img :src="item.image_url" style="width: 100px; height: 60px;" class="rounded"  @click="preViewImage(item.image_url)" />
              <div class="flex flex-col justify-between ">
                <div class="text-base text-b333 font-bold flex flex-row justify-end">{{ getTypeStr(item.type)}}</div>
                <div class="text-sm text-b333">领取时间：{{ item.created_at | timeFormat('YYYY.MM.DD HH:mm') }}</div>
              </div>
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
import {Empty, ImagePreview, List, NavBar, PullRefresh,} from "vant";

export default {
  components: {NavBar, List, Empty,ImagePreview, PullRefresh,},
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
          .get(api.cardAddressList)
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
    getTypeStr(type){
      if(type==1){
        return "养老证"
      }else if(type==2){
        return "分红卡"
      }else{
        return "云数贸本票"
      }
    },
    preViewImage(imgUrl) {
      ImagePreview({images:[imgUrl],closeable: true,showIndex:false});
    },
  },
};
</script>

<style scoped lang="less">

</style>
