<template>
  <div class="h-full w-full bg-[#F0F2F6]">
    <van-overlay :show="pageLoading" class="flex items-center justify-center z-50">
      <van-loading type="spinner" color="#fff" size="36" vertical>加载中...</van-loading>
    </van-overlay>

    <!-- 标题栏 -->
    <nav-bar
      title="申请记录"
      left-text=""
      left-arrow
      @click-left="$router.back()"
      :safe-area-inset-top="true"
      :border="false"
      class="fixed top-0 left-0 right-0 z-20"
    />

    <!-- 标题栏占位 -->
    <div class="h-[44px]"></div>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="min-h-full">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 空状态 -->
        <van-empty v-if="list.length === 0 && !loading" description="暂无记录" />

        <!-- 记录列表 -->
        <div v-for="item in list" :key="item.id" class="mx-4 mt-3 bg-white rounded-lg p-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-lg font-bold">{{ item.link_ido_name }}</span>
            <span :class="getStatusClass(item.status)" class="font-medium">
              {{ getStatusText(item.status) }}
            </span>
          </div>

          <div class="mt-3 flex justify-between items-center">
            <span class="text-gray-600">申请金额</span>
            <span class="text-red-500 text-lg font-bold">¥{{ item.apply_settled_amount }}</span>
          </div>

          <div class="mt-2 flex justify-between text-[13px] text-gray-500">
            <span>申请人</span>
            <span>{{ item.real_name }}</span>
          </div>

          <div class="mt-2 flex justify-between text-[13px] text-gray-500">
            <span>申请时间</span>
            <span>{{ item.created_at }}</span>
          </div>

          <div v-if="item.remark" class="mt-2 text-[13px] text-gray-500">
            备注: {{ item.remark }}
          </div>
        </div>

      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { PullRefresh, List, Empty, Loading, Overlay, Icon, NavBar } from 'vant';
import axios from '@/net/axios';
import api from '@/net/api';

export default {
  components: {
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Empty.name]: Empty,
    [Loading.name]: Loading,
    [Overlay.name]: Overlay,
    [Icon.name]: Icon,
      NavBar,
  },

  data() {
    return {
      pageLoading: true,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      current_page: 1,
      page_size: 10,
    };
  },

  methods: {
    getStatusClass(status) {
      const classes = {
        0: 'text-[#1989fa]', // 蓝色表示审核中
        1: 'text-[#07c160]', // 绿色表示通过
        2: 'text-[#ee0a24]'  // 红色表示拒绝
      };
      return classes[status] || '';
    },

    getStatusText(status) {
      const statusMap = {
        0: '审核处理中',
        1: '审核通过',
        2: '审核拒绝'
      };
      return statusMap[status] || '未知状态';
    },

    async fetchRecords() {
      try {
        const res = await axios.get(api.user_settled_apply_record, {
          params: {
            page: this.current_page,
            size: this.page_size
          }
        });

        const newList = res.data.list || [];
        if (this.refreshing) {
          this.list = newList;
        } else {
          this.list = [...this.list, ...newList];
        }

        this.finished = newList.length < this.page_size;

      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
        this.refreshing = false;
        this.pageLoading = false;
      }
    },

    async onLoad() {
      if (this.refreshing) {
        this.current_page = 1;
      } else {
        this.current_page += 1;
      }
      await this.fetchRecords();
    },

    async onRefresh() {
      this.finished = false;
      this.loading = true;
      this.current_page = 1;
      await this.fetchRecords();
    },
  },

  mounted() {
    this.fetchRecords();
  }
};
</script>

<style scoped>
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
}
</style>
