<template>
  <div class="h-full w-full flex flex-col fund-details-page">
    <!-- Header -->
    <div class="header">
      <van-nav-bar
        title="项目记录"
        left-arrow
        @click-left="onClickLeft"
        :border="false"
      />
    </div>

    <!-- Tab栏固定 -->
    <!--      <div class="sticky top-[44px] z-10">-->
    <!--        <van-tabs-->
    <!--            v-model="activeTab"-->
    <!--            @click="onClick"-->
    <!--            class="custom-tabs"-->
    <!--            :background="'transparent'"-->
    <!--            :color="'#F23D30'"-->
    <!--        >-->
    <!--          <van-tab-->
    <!--              title="越秀项目"-->
    <!--              name="static"-->
    <!--          />-->
    <!--          <van-tab-->
    <!--              title="越秀股东"-->
    <!--              name="dynamic"-->
    <!--          />-->
    <!--        </van-tabs>-->
    <!--      </div>-->

    <!-- 列表内容区域 -->
    <div class="flex-1 overflow-auto">
      <PullRefresh
        v-model="refreshing"
        @refresh="refreshData"
        class="min-h-full"
      >
        <!-- 加载中 -->
        <div v-if="loading" class="py-8 text-center">
          <van-loading type="spinner" color="#F91126" />
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
            class="bg-white rounded-lg mt-3 mx-4 overflow-hidden"
          >
            <!-- 推荐标签 -->
            <div class="relative">
              <img
                v-if="item.rate_type === 1"
                class="absolute top-0 left-0 w-12 z-10"
                src="@/assets/img/chanYeJiJin/recommend.png"
                alt="推荐"
              />
              <div class="p-4">
                <div class="flex justify-center items-center">
                  <div class="text-base font-semibold">{{ item.name }}</div>
                </div>

                <div class="flex justify-between items-center mt-4">
                  <div class="flex flex-col">
                    <span class="text-[#F23D30] text-base font-bold"
                      >{{ item.invest_money
                      }}<span class="text-sm">元</span></span
                    >
                    <span class="text-xs text-gray-500 mt-1">购买价格</span>
                  </div>

                  <div class="flex flex-col items-center">
                    <span class="text-[#F23D30] text-base font-bold"
                      >{{ item.day_income }}
                      <span class="text-sm">元</span></span
                    >
                    <span class="text-xs text-gray-500 mt-1">每日收益</span>
                  </div>
                </div>

                <div class="flex justify-between items-center mt-4">
                  <div class="text-xs text-gray-500">购买时间</div>
                  <div class="text-xs text-gray-500">
                    {{
                      $options.filters.timeFormat(
                        item.created_at,
                        "YYYY-MM-DD HH:mm"
                      )
                    }}
                  </div>
                </div>
                <div
                  class="flex justify-center pt-[10px]"
                  v-if="setDayjs(item.created_at)"
                >
                  <button
                    class="free-button"
                    @click="
                      zsShow = true;
                      relu = item;
                    "
                  >
                    查看优先打款凭证
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </PullRefresh>
    </div>
    <DkZsCavas :userInfo="{ ...userInfo }" :show.sync="zsShow" :relu="relu" />
  </div>
</template>

<script>
import axios from "@/net/axios";
import api from "@/net/api";
import { PullRefresh, Tab, Tabs } from "vant";
import { FundType, getFundTypeLabel } from "@/config";
import DkZsCavas from "@/components/dkZsCavas.vue";
import dayjs from "dayjs";

export default {
  components: {
    DkZsCavas,
    PullRefresh,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
  },
  data() {
    return {
      getFundTypeLabel,
      FundType,
      list: [],
      loading: false,
      userInfo: {},
      refreshing: false,
      activeTab: "static",
      isRequesting: false,
      firstLoading: true,
      zsShow: false,
      relu: {},
    };
  },
  filters: {
    timeFormat(value, format = "YYYY-MM-DD") {
      if (!value) return "";
      const date = new Date(value);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      if (format === "MM月DD日 HH:mm") {
        return `${month}月${day}日 ${hours}:${minutes}`;
      } else if (format === "YYYY-MM-DD HH:mm") {
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      }
      return value;
    },
  },
  created() {
    if (this.$route.query.type) {
      this.activeTab = this.$route.query.type;
    }
    this.loadData();
    this.getUserInfoData();
  },
  methods: {
    setDayjs(d) {
      return dayjs(d).valueOf() > dayjs("2025-05-25 00:00:00").valueOf();
    },
    async getUserInfoData() {
      try {
        const resUser = await axios.get(api.userInfo);
        if (resUser) {
          this.userInfo = resUser.data.userInfo;
        }
      } catch (err) {
        console.log(err);
      }
    },
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
        let type;
        switch (this.activeTab) {
          case "static":
            type = 2;
            break;
          case "dynamic":
            type = 3;
            break;
          case "income_wallet":
            type = 1;
            break;
          case "income_robot":
            type = 4;
            break;
        }

        const res = await axios.get(api.buyBonusList, {
          params: { type: 2 },
        });

        if (res.code === 200) {
          this.list = res.data.idoList || [];
        }
      } catch (error) {
        console.error("加载数据失败:", error);
        error.msg && this.$toast(error.msg);
      } finally {
        this.loading = false;
        this.refreshing = false;
        this.firstLoading = false;
        this.isRequesting = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
/* 按钮区域样式 */
.view-button,
.free-button,
.purchase-button {
  display: flex;
  height: 34.713px;
  padding: 4.339px;
  justify-content: center;
  align-items: center;
  border-radius: 5.207px;
  color: #f7f7f8;
  text-align: center;
  font-family: "HarmonyOS Sans SC";
  font-size: 17.356px;
  font-weight: 500;
  line-height: 17.356px;
}

.free-button,
.purchase-button {
  background: linear-gradient(147deg, #eb6400 20.81%, #f49f00 92.21%);
  width: 80%;
}
.fund-details-page {
  min-height: 100vh;
  background: #f9eaea;
  background-size: cover;

  :deep(.van-nav-bar) {
    background-color: white;

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
        color: #f23d30;
        font-weight: 500;
      }
    }
  }
}
</style>
