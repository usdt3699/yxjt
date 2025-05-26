<template>
  <div class="page-container">
    <!-- Header -->
    <div class="header">
      <van-nav-bar
          :title="title"
          :border="false"
      >
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
        <van-tab title="金卡" name="gold_balance"/>
        <van-tab title="钛金卡" name="tai_balance"/>
        <van-tab title="钻石卡" name="diamond_balance"/>
      </van-tabs>
    </div>

    <!-- 列表内容区域 -->
    <div class="scroll-container">
      <PullRefresh
          v-model="refreshing"
          @refresh="refreshData"
      >
        <List
            v-model="loading"
            :finished="finished"
            :finished-text="list.length > 0 ? '没有更多了' : ''"
            @load="loadMore"
            :immediate-check="true"
            class="list-container"
            :loading-text="page > 1 ? '加载中...' : ''"
        >
          <!-- 首次加载中 -->
          <div v-if="firstLoading" class="py-8 text-center">
            <van-loading type="spinner" color="#F91126"/>
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
              <div class="item-content">
                <div class="item-main">
                  <div class="item-left">
                    <div class="item-title">
                      <template v-if="activeTab === 'activity'">
                        {{ item.name }}
                      </template>
                      <template v-else>
                        {{
                          activeTab === "env_wallet" ? item.name : item.content
                        }}
                      </template>
                    </div>
                    <div class="item-subtitle">
                      <template v-if="activeTab === 'env_wallet'">
                        投资金额: {{ item.invest_money }}元
                      </template>
                      <template v-else>
                        余额:{{
                          Math.floor(item.after)
                        }}{{
                          activeTab === "stock" || activeTab === "stock_right" || activeTab === "origin_stock"
                              ? "股"
                              : "元"
                        }}
                      </template>
                    </div>
                  </div>
                  <div class="item-right">
                    <div class="item-amount">
                      {{ item.total }}
                      <span class="unit">
                        {{
                          getUnit(activeTab)
                        }}
                      </span>
                    </div>
                    <div class="item-date">
                      {{
                        $options.filters.timeFormat(
                            item.created_at,
                            "MM月DD日 HH:mm"
                        )
                      }}
                    </div>
                  </div>
                </div>
                <div class="item-tip" v-if="item.product_income_tip">
                  {{ item.product_income_tip }}
                </div>
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
import {List, NavBar, PullRefresh, Tab, Tabs} from "vant";
import {EnumOperations, FundType, getFundTypeLabel} from "@/config";

export default {
  components: {NavBar, List, PullRefresh, [Tab.name]: Tab, [Tabs.name]: Tabs},
  data() {
    return {
      getFundTypeLabel,
      FundType,
      title: this.$route.meta.title,
      totalPage: 0,
      size: 20,
      page: 1,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      firstLoading: false,
      activeTab: "stock",
      total: 0,
      isRequesting: false,
    };
  },
  filters: {
    getTypes(value) {
      if (value == EnumOperations.INCREASE) {
        return "收入";
      }
      return "支出";
    },
    timeFormat(value, format = "YYYY-MM-DD") {
      if (!value) return "";
      const date = new Date(value);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      if (format === "MM月DD日 HH:mm") {
        return `${month}月${day}日 ${hours}:${minutes}`;
      }
      // ... 保留其他格式的处理 ...
      return value;
    },
  },
  created() {
    // 接收路由参数,设置默认选中的 tab
    if (this.$route.query.type) {
      this.activeTab = this.$route.query.type;
    }
    // 组件创建后立即加载数据
    this.loadMore();
  },
  methods: {
    getUnit(type) {
      const unitMap = {
        stock: '越秀地产股权',
        stock_right: '越秀原始股',
        default: '元'
      }
      return unitMap[type] || unitMap.default
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    onClick(name) {
      if (this.isRequesting) return; // 防止请求中切换
      if (typeof name === "object") {
        name = name.name; // 处理 click-tab 事件传入的参数
      }

      this.activeTab = name;
      this.list = [];
      this.page = 1;
      this.finished = false;
      this.loading = true; // 设置 loading 为 true 触发加载
      this.firstLoading = false;
      // 使用 nextTick 确保状态更新后再调用加载
      this.$nextTick(() => {
        this.loadMore();
      });
    },
    resetList() {
      if (this.isRequesting) return;
      this.list = [];
      this.page = 1;
      this.finished = false;
      this.loading = false;
      this.firstLoading = false;
      this.loadMore();
    },
    refreshData() {
      if (this.isRequesting) return;
      this.resetList();
      this.refreshing = false;
    },
    async loadMore() {
      // 移除可能阻止首次加载的条件
      if (this.isRequesting) return;

      if (this.refreshing) {
        this.list = [];
        this.page = 1;
      }

      this.isRequesting = true;

      try {
        const res = await axios.get(api.balanceLog, {
          params: {
            coin_type: this.activeTab,
            page: this.page,
            size: this.size,
          },
        });

        if (res.data?.list) {
          if (this.refreshing) {
            this.list = res.data.list;
          } else {
            this.list = [...this.list, ...res.data.list];
          }

          this.page++;
          this.finished = this.list.length >= res.data.total;
        } else {
          this.finished = true;
        }
      } catch (err) {
        err.msg && this.$toast(err.msg);
        this.finished = true;
      } finally {
        this.loading = false;
        this.refreshing = false;
        this.firstLoading = false;
        this.isRequesting = false;
      }
    },
    maskName(name) {
      if (!name) return "";
      if (name.length <= 2) {
        return name.substr(0, 1) + "*";
      }
      return name.substr(0, 1) + "*".repeat(name.length - 2) + name.substr(-1);
    },

    async getDetails() {
      try {
        this.loading = true;
        const userListRes = await axios.get(api.inviteProvinceUserList, {
          params: {
            page: this.page,
            size: this.size,
          },
        });

        if (userListRes.data?.list) {
          const mergedData = userListRes.data.list.map((item) => ({
            name: item.real_name ? this.maskName(item.real_name) : "未实名",
            phone: item.username,
            area: item.province,
            income: item.gift_coin_num,
            user_id: item.user_id,
            created_at: item.created_at,
          }));

          if (this.refreshing) {
            this.list = mergedData;
          } else {
            this.list = [...this.list, ...mergedData];
          }

          this.page++;
          this.finished = this.list.length >= userListRes.data.total;
        } else {
          this.finished = true;
        }
      } catch (err) {
        err.msg && this.$toast(err.msg);
        this.finished = true;
      } finally {
        this.loading = false;
        this.refreshing = false;
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
  background: #F9EAEA;
  background-size: cover;
  overflow: hidden;
  z-index: 1;
}

.tab-container {
  position: sticky;
  top: 44px;
  z-index: 10;
  background: #F9EAEA;
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}

.scroll-container {
  flex: 1;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  position: relative;
  width: 100%;
}

.header {
  width: 100%;

  :deep(.van-nav-bar) {
    background: white;
    width: 100%;
  }

  :deep(.van-nav-bar__title) {
    color: #000000;
    font-size: 18px;
    font-weight: 500;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

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
    color: #F23D30;
    font-weight: 500;
  }

  :deep(.van-tabs__line) {
    width: 20px !important;
    height: 3px;
    background: #F23D30;
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

// 列表容器
.list-container {
  width: 100%;
  padding-bottom: 50px;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

// 修改列表项样式
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
:deep(li), :deep(li::before), :deep(li::marker), .no-marker::before, .no-marker::marker {
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

.item-content {
  width: 100%;
}

.item-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.item-left {
  flex: 1;
  min-width: 0;
}

.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-subtitle {
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-amount {
  font-size: 16px;
  font-weight: 600;
  color: #F23D30;
}

.unit {
  font-size: 12px;
  margin-left: 2px;
}

.item-date {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.item-tip {
  font-size: 14px;
  color: #F23D30;
  margin-top: 8px;
}
</style>
