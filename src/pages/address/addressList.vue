<template>
  <div class="h-full w-full flex flex-col">
    <nav-bar
        :title="title"
        left-text=""
        left-arrow
        @click-left="onClickLeft"
        :safe-area-inset-top="true"
        :border="false"
    />
    <div class="overflow-hidden w-full">
      <div class="page-content-2">
        <PullRefresh v-model="refreshing" @refresh="refreshData" class="h-full">
          <address-list
              v-model="chosenAddressId"
              :list="list"
              default-tag-text="默认"
              @add="onAdd"
              @edit="onEdit"
          />
          <Empty v-if="list.length === 0" description="暂无数据"/>
        </PullRefresh>
      </div>
    </div>
  </div>
</template>
<script>


import axios from "@/net/axios";
import api from "@/net/api";
import {AddressList, Empty, NavBar, PullRefresh} from "vant";
import {FundType, getFundTypeLabel} from "@/config";

export default {
  components: {NavBar, AddressList, Empty, PullRefresh},
  data() {
    return {
      getFundTypeLabel,
      FundType,
      title: this.$route.meta.title,
      totalPage: 0,
      pageSize: 10,
      pageNo: 1,
      loading: false,
      finished: false,
      refreshing: false,
      chosenAddressId: '1',
      list: [],
    };
  },
  mounted() {
    this.loadMore()  // 加载数据
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
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      axios
          .get(api.addressList)
          .then((res) => {
            this.$toast.clear();
            console.log('地址列表1', res)
            res.data.map((item) => {
              this.list.push({
                id: item.id,
                name: item.name,
                tel: item.phone,
                address: item.detail_address,
                isDefault: item.status == 1 ? true : false,
              })
            })
            console.log('地址列表', this.list)
            this.loading = false
            this.refreshing = false
            this.finished = true;
          })
          .catch((err) => {
            this.$toast.clear();
            this.loading = false
            this.refreshing = false
            this.finished = true;
            err.msg && this.$toast(err.msg);
          });
    },
    onAdd() {
      this.$router.push({name: 'editAddress', params: {id: 0}})
    },
    onEdit(item) {
      this.$router.push({name: 'editAddress', params: {id: item.id}})
    },
  },
};
</script>

<style scoped lang="less">

</style>
