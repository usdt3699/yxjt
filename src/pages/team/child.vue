<template>
  <div class="h-full w-full flex flex-col">

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
            <div v-for="(item, index) in list" :key="index" class="flex flex-row items-center bg-white p-2 border-line"
                 :class="{ 'border-b': index !== list.length - 1 }">
              <van-image
                  round
                  width="42px"
                  height="42px"
                  :src="item.avatar?userInfo.item: require('@/assets/img/home/default_avatar.png')"
              />
              <div class="flex flex-col ml-1 flex-1">
                <div class="text-base font-bold text-b333">{{ item.realname ? item.realname : '未实名' }}</div>
                <div class="text-sm text-b666">{{ item.mobile }}</div>
              </div>
              <div class="flex flex-col ml-1 items-end">
                <div class="text-sm text-b333"><span>业绩</span>：<span
                    class="text-red-500"> {{ item.rjmoney ? item.rjmoney : '0.00' }}</span></div>
                <div class="text-sm text-b666">加入：{{ item.reg_time | timeFormat('YYYY.MM.DD HH:mm') }}</div>
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
import {Empty, Image as VanImage, List, NavBar, PullRefresh,} from "vant";

export default {
  name: "index",
  components: {TitleBar, NavBar, List, VanImage, Empty, PullRefresh},
  data() {
    return {
      level: this.$route.params.level,
      totalPage: 0,
      pageSize: 10,
      pageNo: 1,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
    };
  },
  computed: {
    title() {
      switch (this.$route.params.level) {
        case 0:
          return "直推好友";
        case 1:
          return "二级好友";
        case 2:
          return "三级好友";
      }
    }
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
          .get(api.teamList, {
            params: {
              page: this.pageNo,
              size: this.pageSize,
              level: this.level
            }
          })
          .then((res) => {
            if (this.pageNo === 1) {
              this.list = res.data.list;
              this.count = res.data.total;
            } else {
              this.list = this.list.concat(res.data.list);
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
  },
};
</script>

<style scoped lang="less">

</style>
