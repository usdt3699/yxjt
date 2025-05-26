<template>
  <div class="page-container">
    <!-- Header -->
    <div class="header">
      <van-nav-bar :title="title" :border="false">
        <template #left>
          <div class="custom-back" @click="onClickLeft">
            <div class="arrow-left"></div>
          </div>
        </template>
      </van-nav-bar>
    </div>

    <!-- Tab栏固定 -->
    <div class="tab-container">
      <van-tabs
        v-model="activeTab"
        @click="onClick"
        class="custom-tabs"
        :background="'transparent'"
        :color="'#F23D30'"
      >
        <van-tab title="项目收益" name="income_wallet" />
        <van-tab title="项目本金" name="item_wallet" />
        <van-tab title="团队奖励" name="recommend_award" />
        <van-tab title="越秀地产股票" name="stock" />
        <van-tab title="越秀原始股" name="stock_right" />
        <van-tab title="现金余额" name="invite_award" />
        <van-tab title="我的押金" name="deposit_wallet" />
        <van-tab title="我的余额" name="balance" />
        <van-tab title="金卡" name="gold_balance" />
        <van-tab title="钛金卡" name="tai_balance" />
        <van-tab title="钻石卡" name="diamond_balance" />
      </van-tabs>
    </div>

    <!-- 列表内容区域 -->
    <div class="scroll-container">
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
          <div v-if="firstLoading" class="py-8 text-center">
            <van-loading type="spinner" color="#F23D30" />
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
              class="list-item no-marker"
            >
              <template v-if="activeTab == 'stock_right'">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-lg font-bold">
                    抛售至{{ item?.bank_name || "" }}
                  </span>
                  <span :class="getStatusColorClass(item.status)">
                    {{ getReviewStatusLabel(item.status) }}
                  </span>
                </div>
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center">
                    <span class="text-red-500 text-lg font-bold mr-1"
                      >股权数：</span
                    >
                    <span class="text-red-500 text-lg font-bold"
                      >{{ Number(item.num) }}股</span
                    >
                  </div>
                </div>
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center">
                    <span class="text-red-500 text-lg font-bold mr-1"
                      >单价：</span
                    >
                    <span class="text-red-500 text-lg font-bold">
                      {{
                        (Number(item.ac_amount) / Number(item.num)).toFixed(2)
                      }}元/股</span
                    >
                  </div>
                </div>
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center">
                    <span class="text-red-500 text-lg font-bold mr-1"
                      >总金额：</span
                    >
                    <span class="text-red-500 text-lg font-bold">
                      {{ Number(item.ac_amount) }}元</span
                    >
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-lg font-bold">
                    {{
                      activeTab == "gold_balance" ||
                      activeTab == "tai_balance" ||
                      activeTab == "diamond_balance"
                        ? "转入"
                        : "提现到"
                    }}{{ item?.bank_name || "" }}
                  </span>
                  <span :class="getStatusColorClass(item.status)">
                    {{ getReviewStatusLabel(item.status) }}
                  </span>
                </div>
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center">
                    <span class="text-red-500 text-lg font-bold mr-1"
                      >金额：</span
                    >
                    <span class="text-red-500 text-lg font-bold"
                      >¥ {{ item.num }}</span
                    >
                  </div>
                  <div v-if="activeTab == 'bank_wallet'" class="text-gray-600">
                    {{ `绑定的${item.bank_name}:${item.bank_no}` }}
                  </div>
                </div>
                <div class="text-gray-500">
                  {{ item.created_at | timeFormat("YYYY/MM/DD HH:mm") }}
                </div>
                <div class="text-red-500 mt-2" v-if="item.remark">
                  {{ item.remark }}
                </div>
              </template>
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
      title: this.$route.meta.title,
      count: 0,
      pageSize: 10,
      pageNo: 1,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      firstLoading: false,
      activeTab: this.$route.query.type || "income_wallet",
      isRequesting: false, // 添加请求状态标志
    };
  },
  created() {
    this.loadMore(); // 组件创建后加载数据
  },
  methods: {
    onClick(name) {
      if (this.isRequesting) return; // 防止请求中切换
      this.activeTab = name;
      this.list = [];
      this.pageNo = 1;
      this.finished = false;
      this.loading = true;
      this.firstLoading = false;

      // 使用 nextTick 确保状态更新后再调用加载
      this.$nextTick(() => {
        this.loadMore();
      });
    },
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
            coin_type: this.activeTab,
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
/* 全局移除所有项目符号 */
:deep(*) {
  &::before,
  &::marker {
    display: none !important;
  }
}

.page-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f9eaea;
  background-size: cover;
  overflow: hidden;
  z-index: 1;
}

.header {
  width: 100%;

  .custom-back {
    display: flex;
    align-items: center;
    padding: 0 16px;
    height: 100%;
    cursor: pointer;
  }

  .arrow-left {
    width: 10px;
    height: 10px;
    border-top: 2px solid #000;
    border-left: 2px solid #000;
    transform: rotate(-45deg);
    margin-right: 4px;
  }

  .back-text {
    font-size: 14px;
    color: #000;
    font-weight: 500;
  }

  :deep(.van-nav-bar) {
    background: white;
    width: 100%;
  }

  :deep(.van-nav-bar__title) {
    color: #000000;
    font-size: 18px;
    font-weight: 500;
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :deep(.van-icon) {
    color: #000000;
    font-size: 20px;
  }

  :deep(.van-nav-bar__arrow) {
    color: #000000 !important;
    font-weight: bold;
    font-size: 18px;
  }

  :deep(.van-nav-bar__left) {
    color: #000000 !important;
  }
}

.tab-container {
  position: sticky;
  top: 44px;
  z-index: 10;
  background: #f9eaea;
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}

// 修改tabs样式
.custom-tabs {
  width: 100%;

  :deep(.van-tabs__wrap) {
    --van-tabs-nav-background: transparent;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
  }

  :deep(.van-tab) {
    color: #313131;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    flex: 0 0 auto;
    padding: 0 12px;
  }

  :deep(.van-tab--active) {
    color: #f23d30;
    font-weight: 500;
  }

  :deep(.van-tabs__line) {
    width: 20px !important;
    height: 3px;
    background: #f23d30;
    border-radius: 1.5px;
  }

  :deep(.van-tabs__nav) {
    border: none;
    width: auto;
    display: flex;
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
  padding: 12px 0;
  min-height: 100%;
  width: 100%;
}

:deep(.van-pull-refresh) {
  min-height: 100%;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

// 确保内容区域可以滚动
.scroll-container {
  flex: 1;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  position: relative;
  width: 100%;
  padding-top: 12px;
}

// 列表项样式
.list-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin: 0 12px 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: calc(100% - 24px);
  box-sizing: border-box;
  list-style: none;
  display: block;
}

/* 全局移除所有marker */
:deep(li),
:deep(li::before),
:deep(li::marker),
.no-marker::before,
.no-marker::marker {
  list-style-type: none !important;
  display: block;
}

:deep(.van-list__finished-text::before),
:deep(.van-list__loading::before),
:deep(.van-list__placeholder::before) {
  display: none !important;
}

:deep(.van-list) li {
  list-style: none !important;
}
</style>
