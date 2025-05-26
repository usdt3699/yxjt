<template>
  <div class="min-h-screen w-full relative">
    <!-- 背景和人物图片组合 -->
    <img
        src="@/assets/img/team/bg_team_top.png"
        class="fixed top-0 left-0 w-full h-full object-cover z-0"
    />

    <!-- loading遮罩 -->
    <div
        v-if="firstLoading"
        class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    >
      <van-loading
          type="spinner"
          color="#fff"
          size="36"
          vertical
      >加载中...
      </van-loading>
    </div>

    <!-- 主内容区域 -->
    <div class="relative z-10">
      <!-- 顶部标题栏 -->
      <div class="px-4 pt-4 pb-4 flex items-center">
        <!-- 返回箭头 -->
        <div
            class="w-8 h-8 flex items-center cursor-pointer"
            @click="onClickLeft"
        >
          <van-icon
              name="arrow-left"
              class="text-black text-xl"
          />
        </div>

        <!-- 标题 -->
        <div class="flex-1 text-center">
          <div class="text-black text-xl font-medium">我的团队</div>
        </div>

        <div class="w-8"></div>
      </div>

      <!-- 团队人数统计 -->
      <div class="px-4 mb-4">
        <div class="flex items-center">
          <div class="flex items-center justify-center">
            <img src="@/assets/img/team/icon_team.png" class="w-12 h-12"/>
          </div>
          <div class="ml-4">
            <div class="text-[#3E3E3E] text-[16px] font-bold">我的团队</div>
            <div class="text-[#FF4B33] text-xl font-bold mt-1">{{ childCount?.group_num || '0' }}<span class="text-sm">人</span></div>
          </div>
        </div>
      </div>

      <!-- Tab和列表区域 -->
      <div class="mx-4 bg-white rounded-[20px] overflow-hidden">
        <!-- Tab切换 -->
        <van-tabs
            v-model="activeTab"
            @click="onClick"
            class="custom-tabs"
        >
          <van-tab
              v-for="tab in tabs"
              :key="tab.name"
              :title="getTabTitle(tab)"
              :name="tab.name"
          >
            <!-- 列表内容 -->
            <van-pull-refresh
                v-model="refreshing"
                @refresh="refreshData"
            >
              <van-list
                  v-model="loading"
                  :finished="finished"
                  :finished-text="list.length > 0 && total > pageSize ? '没有更多了' : ''"
                  @load="loadMore"
              >
                <!-- 空状态 -->
                <van-empty
                    v-if="list.length === 0 && !loading"
                    class="custom-empty"
                    image="search"
                    description="暂无相关数据"
                />

                <!-- 列表项 -->
                <div
                    v-for="(item, index) in list"
                    :key="index"
                    class="p-4 border-b border-[#F5F5F5] last:border-none"
                >
                  <div class="flex items-center">
                    <img
                        :src="item.head_img || require('@/assets/img/home/default_avatar.png')"
                        class="w-12 h-12 rounded-full"
                    />
                    <div class="ml-3 flex-1">
                      <div class="flex justify-between items-center">
                        <div class="flex items-center">
                          <span class="text-[#FF0000] font-medium">{{ item.real_name || '未实名' }}</span>
                          <span class="text-[#999] text-sm ml-2">({{ item.username }})</span>
                        </div>
                        <span class="text-[#999] text-sm">{{ item.created_at | timeFormat('YYYY/MM/DD') }}</span>
                      </div>
                      <div class="text-[#666] text-sm mt-2">
                        {{ item.achievement }}元 (业绩)
                      </div>
                    </div>
                  </div>
                </div>
              </van-list>
            </van-pull-refresh>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/net/axios";
import api from "@/net/api";
import {mapActions, mapState} from "vuex";
import {Tab, Tabs} from "vant";

export default {
  name: "index",
  components: {[Tab.name]: Tab, [Tabs.name]: Tabs},
  data() {
    return {
      count: 0,
      pageSize: 10,
      pageNo: 1,
      level: 1,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      childCount: {},
      activeTab: "0",
      tabs: [
        {title: "1级好友", name: "0"},
        {title: "2级好友", name: "1"},
        {title: "3级好友", name: "2"},
      ],
      inviteCode: "",
      inviteUrl: "",
      firstLoading: true,
      total: 0,
      rewardList: [], // 团队奖励列表
    };
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    title() {
      return "我的团队";
    },
  },
  mounted() {
    this.loadMore();
  },

  methods: {
    ...mapActions("user", ["getUserInfo"]),
    onClickLeft() {
      this.$router.go(-1);
    },
    onClick(name) {
      this.level = parseInt(name) + 1;
      this.resetList();
    },
    resetList() {
      this.list = [];
      this.pageNo = 1;
      this.finished = false;
      this.loading = false;
      this.firstLoading = true;
      this.loadMore();
    },
    refreshData() {
      this.resetList();
      this.refreshing = false;
    },
    loadMore() {
      if (this.refreshing) {
        this.list = [];
      }

      this.loading = true;
      axios
          .get(api.teamList, {
            params: {
              level: this.level,
              page: this.pageNo,
              size: this.pageSize,
            },
          })
          .then((res) => {
            this.firstLoading = false;

            if (this.pageNo === 1) {
              this.list = res.data.list;
              this.childCount = res.data.userInfo || {};
            } else {
              this.list = [...this.list, ...res.data.list];
            }
            this.total = res.data.total;

            // 判断是否加载完成
            this.finished = this.list.length >= this.total;
            this.loading = false;
            if (this.list.length > 0) {
              this.pageNo++;
            }
          })
          .catch((err) => {
            this.firstLoading = false;
            this.loading = false;
            this.finished = true;
            err.msg && this.$toast(err.msg);
          });
    },
    getTabTitle(tab) {
      if (!this.childCount) return `${tab.title}(0人)`;

      const count =
          {
            0: this.childCount.zhi_num,
            1: this.childCount.recommendTwoLevelNum,
            2: this.childCount.recommendThreeLevelNum,
          }[tab.name] || 0;

      return `${tab.title}(${count}人)`;
    },
  },
};
</script>

<style scoped lang="less">
.custom-tabs {
  :deep(.van-tabs__wrap) {
    height: 44px;
  }

  :deep(.van-tabs__nav) {
    padding: 0;
    display: flex;
    justify-content: center;
  }

  :deep(.van-tab) {
    color: #333;
    font-size: 14px;
    padding: 0 16px;
    flex: none;
    min-width: 80px;

    &--active {
      color: #FF4B33;
      font-weight: 500;
    }
  }

  :deep(.van-tabs__line) {
    width: 20px;
    height: 3px;
    background: #FF4B33;
    border-radius: 2px;
    bottom: 6px;
  }

  :deep(.van-tabs__content) {
    background: #fff;
  }
}

.custom-empty {
  padding: 32px 0;

  :deep(.van-empty__image) {
    width: 120px;
    height: 120px;
  }

  :deep(.van-empty__description) {
    color: #999;
    font-size: 14px;
  }
}
</style>
