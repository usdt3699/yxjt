<template>
  <div class="h-full w-full flex flex-col withdraw-record-page">
    <!-- Header -->
    <div class="header">
      <van-nav-bar
        title="资产平移/恢复记录"
        left-arrow
        @click-left="onClickLeft"
        :border="false"
      />
    </div>

    <!-- 列表内容区域 -->
    <div class="flex-1 overflow-auto pt-3">
      <PullRefresh
        v-model="refreshing"
        @refresh="refreshData"
        class="min-h-full"
      >
        <List
          v-model="loading"
          :finished="finished"
          :finished-text="list.length > 0 ? '没有更多了' : ''"
          @load="loadMore"
          class="h-full"
          :loading-text="pageNo > 1 ? '加载中...' : ''"
        >
          <!-- 首次加载中 -->
          <div
            v-if="firstLoading"
            class="py-8 text-center"
          >
            <van-loading
              type="spinner"
              color="#0068B7"
            />
          </div>

          <!-- 无数据显示空视图 -->
          <van-empty
            v-else-if="list.length === 0 && !loading && !firstLoading"
            class="custom-empty"
            image="search"
            description="暂无相关数据"
          />

          <!-- 列表内容 -->
          <template v-else>
            <div
              v-for="(item, index) in list"
              :key="index"
              class="bg-white rounded-lg p-4 mb-3 mx-4"
            >
              <div class="text-[16px] text-[#0068B7] font-medium mb-3">
                {{ item.withdraw_good?.name }}
                <span class="text-[12px] text-[#1663D6]">（该平移/恢复名称）</span>
              </div>

              <div class="flex justify-between items-center text-[14px] text-[#333] mb-2">
                <span>资产编号：</span>
                <span>{{ item.withdraw_good?.goods_number }}号</span>
              </div>

              <div class="flex justify-between items-center text-[14px] text-[#333] mb-2">
                <span>有效平移/恢复日期：</span>
                <span>{{ item.withdraw_good?.expire_date }}</span>
              </div>

              <div class="flex justify-between items-center text-[14px] text-[#333] mb-2">
                <span>资产平移/恢复至：</span>
                <span>精准助农</span>
              </div>

              <div class="flex justify-between items-center text-[14px] text-[#333] mb-2">
                <span>平移/恢复资产：</span>
                <span>{{ item.num }}元</span>
              </div>

              <div class="flex justify-between items-center text-[14px] text-[#666]">
                <span>时间：</span>
                <span>{{ item.created_at }}</span>
              </div>
            </div>
          </template>
        </List>
      </PullRefresh>
    </div>
  </div>
</template>

<script>
import axios from "@/net/axios";
import api from "@/net/api";
import { Empty, List, NavBar, PullRefresh, Tab, Tabs } from "vant";
import {
  getReviewStatusLabel,
  ReviewStatus,
  getNTypeLabel,
  NType,
} from "@/config";

export default {
  components: {
    NavBar,
    List,
    Empty,
    PullRefresh,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
  },
  data() {
    return {
      getReviewStatusLabel,
      getNTypeLabel,
      NType,
      ReviewStatus,
      count: 0,
      pageSize: 10,
      pageNo: 1,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      firstLoading: false,
      isRequesting: false, // 添加请求状态标志
    };
  },
  created() {
    this.loadMore(); // 组件创建后加载数据
  },
  methods: {
    resetList() {
      if (this.isRequesting) return;
      this.list = [];
      this.pageNo = 1;
      this.finished = false;
      this.loading = true;
      this.firstLoading = false;
      this.loadMore();
    },
    refreshData() {
      if (this.isRequesting) return;
      this.resetList();
      this.refreshing = false;
    },
    async loadMore() {
      if (this.isRequesting) return;

      if (this.refreshing) {
        this.list = [];
        this.pageNo = 1;
      }

      this.isRequesting = true;

      try {
        const res = await axios.get(api.withdrawalRecordList, {
          params: {
            page: this.pageNo,
            coin_type: "tran_restore_wallet",
          },
        });

        if (this.pageNo === 1) {
          this.list = res.data.list;
          this.count = res.data.total;
        } else {
          this.list = [...this.list, ...res.data.list];
        }

        if (this.list.length < this.count) {
          this.pageNo++;
          this.finished = false;
        } else {
          this.finished = true;
        }
      } catch (err) {
        this.finished = true;
        err.msg && this.$toast(err.msg);
      } finally {
        this.loading = false;
        this.firstLoading = false;
        this.isRequesting = false;
      }
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    getStatusColorClass(status) {
      if (this.activeTab === "reborn_invite_award") {
        return "text-green-500";
      }

      switch (status) {
        case ReviewStatus.PAID:
          return "text-green-500";
        case ReviewStatus.PENDING:
          return "text-blue-500";
        case ReviewStatus.PAYMENT_FAILED:
          return "text-red-500";
        default:
          return "text-gray-500";
      }
    },
  },
};
</script>

<style scoped lang="less">
.withdraw-record-page {
  min-height: 100vh;
  background: url("~@/assets/img/profile/transfer-bg.png") no-repeat;
  background-size: cover;
}

.header {
  :deep(.van-nav-bar) {
    background: transparent;
  }

  :deep(.van-nav-bar__title) {
    color: #000000;
    font-size: 18px;
    font-weight: 500;
  }

  :deep(.van-icon) {
    color: #000000;
    font-size: 20px;
  }
}

// 修改tabs样式
.custom-tabs {
  :deep(.van-tabs__wrap) {
    --van-tabs-nav-background: transparent;
  }

  :deep(.van-tab) {
    color: #313131;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }

  :deep(.van-tab--active) {
    color: #0068b7;
    font-weight: 500;
  }

  :deep(.van-tabs__line) {
    width: 20px !important;
    height: 3px;
    background: #0068b7;
    border-radius: 1.5px;
  }

  :deep(.van-tabs__nav) {
    border: none;
  }
}

// 自定义空视图样式
.custom-empty {
  padding: 60px 0;

  :deep(.van-empty__image) {
    width: 120px;
    height: 120px;
  }

  :deep(.van-empty__description) {
    color: #999;
    font-size: 14px;
    line-height: 20px;
    margin-top: 20px;
  }
}

// 添加列表相关样式
:deep(.van-list) {
  min-height: 100%;
}

:deep(.van-pull-refresh) {
  min-height: 100%;
}

// 确保内容区域可以滚动
.overflow-auto {
  -webkit-overflow-scrolling: touch;
}
</style>
