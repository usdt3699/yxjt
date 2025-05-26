<template>
    <div class="h-full w-full flex flex-col fund-details-page">
      <!-- Header -->
      <div class="header">
        <van-nav-bar
            title="新手帮助"
            left-arrow
            @click-left="onClickLeft"
            :border="false"
        />
      </div>

      <!-- 列表内容区域 -->
      <div class="flex-1 overflow-auto">
        <PullRefresh
            v-model="refreshing"
            @refresh="refreshData"
            class="min-h-full"
        >
          <!-- 加载中 -->
          <div
              v-if="loading"
              class="py-8 text-center"
          >
            <van-loading
                type="spinner"
                color="#F91126"
            />
          </div>

          <!-- 无数据显示空视图 -->
          <van-empty
              v-else-if="list.length === 0"
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
              <div class="flex justify-between items-center mb-3" @click="toggleContent(index)">
                <div class="text-base font-medium text-gray-900">{{ item.title }}</div>
                <van-icon :name="expandedItems[index] ? 'arrow-up' : 'arrow-down'" />
              </div>
              <div class="text-sm text-gray-400 mb-2">
                {{ $options.filters.timeFormat(item.created_at, 'MM月DD日 HH:mm') }}
              </div>
              <div v-show="expandedItems[index]" class="text-sm text-gray-600" v-html="item.content"></div>
            </div>
          </template>
        </PullRefresh>
      </div>
    </div>
  </template>

  <script>
  import axios from "@/net/axios";
  import api from "@/net/api";
  import {PullRefresh, Tab, Tabs, NavBar, Empty, Loading, Dialog, Icon} from "vant";
  import {FundType, getFundTypeLabel} from "@/config";

  export default {
    components: {
      PullRefresh,
      NavBar,
      Empty,
      Loading,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Dialog.Component.name]: Dialog.Component,
      [Icon.name]: Icon
    },
    data() {
      return {
        getFundTypeLabel,
        FundType,
        list: [],
        loading: false,
        refreshing: false,
        activeTab: "static",
        isRequesting: false,
        firstLoading: true,
        expandedItems: {}
      };
    },
    filters: {
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
        return value;
      },
    },
    created() {
      if (this.$route.query.type) {
        this.activeTab = this.$route.query.type;
      }
      this.loadData();
    },
    methods: {
      onClickLeft() {
        this.$router.go(-1);
      },
      onClick(name) {
        if (this.isRequesting) return;
        if (typeof name === "object") {
          name = name.name;
        }
        this.activeTab = name;
        this.list = [];
        this.loading = true;
        this.firstLoading = false;
        this.loadData();
      },
      async refreshData() {
        this.refreshing = true;
        await this.loadData();
        this.refreshing = false;
      },
      async loadData() {
        if (this.isRequesting) return;
        this.isRequesting = true;
        this.loading = true;
        try {
          const res = await axios.get(api.newsList, {
            params:{
              type: 3,
              index_status: 0
            }
          });
          this.list = res.data;
        } catch (error) {
          console.error('加载数据失败:', error);
          error.msg && this.$dialog.alert({
            message: error.msg
          });
        } finally {
          this.loading = false;
          this.refreshing = false;
          this.isRequesting = false;
        }
      },
      toggleContent(index) {
        this.$set(this.expandedItems, index, !this.expandedItems[index]);
      }
    }
  };
  </script>

  <style lang="less" scoped>
  .fund-details-page {
    min-height: 100vh;
    background: url("~@/assets/img/profile/transfer-bg.png") no-repeat;
    background-size: cover;

    :deep(.van-nav-bar) {
      background-color: transparent;

      .van-nav-bar__title {
        color: #333;
      }

      .van-icon {
        color: #333;
      }
    }

    .custom-tabs {
      :deep(.van-tabs__wrap) {
        padding: 0 16px;
      }

      :deep(.van-tab) {
        color: #666;

        &--active {
          color: #0068B7;
          font-weight: 500;
        }
      }
    }
  }
  </style>
