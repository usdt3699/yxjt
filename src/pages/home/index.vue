<template>
  <div class="min-h-screen relative pb-[10px]">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common.png" alt="背景" class="w-full" />
      <div class="absolute top-0 left-0 right-0 px-4">
        <!-- 顶部区域 -->
        <div class="flex justify-between items-center pt-[15px] px-[10px]">
          <!-- 左侧logo -->
          <img
            src="@/assets/img/home/logo.png"
            alt="越秀集团"
            class="h-[40px]"
          />
          <!-- 右侧客服图标 -->
          <div
            class="flex flex-col items-center"
            @click="handleCustomerService"
          >
            <img
              src="@/assets/img/home/customer_service_icon.png"
              alt="客服"
              class="w-[24px]"
            />
            <span class="mt-1 text-xs text-[#333]">客服</span>
          </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="px-[10px] pt-[15px] pb-[55px] relative z-10">
          <!-- 轮播图区域 -->
          <div class="w-full mb-4 overflow-hidden">
            <Banner />
          </div>
          <!-- 公告区域 -->
          <div
            class="w-full rounded-[10px] bg-white p-3 mb-2 flex items-center"
            v-if="tips && tips.length > 0"
          >
            <!-- 左侧标题区域 -->
            <div class="flex items-center pr-3 border-r border-[#f2f2f2]">
              <div class="headline-container flex items-center">
                <span class="headline-part1">头</span
                ><span class="headline-part2">条</span>
              </div>
              <div
                class="ml-1 px-2 py-0.5 rounded-[10px] flex items-center border-[1px] border-[#FF6C6C] whitespace-nowrap"
              >
                <img
                  src="@/assets/img/home/hot_icon.png"
                  alt="热点"
                  class="w-[12px] h-[12px] mr-1"
                />
                <span class="hotspot-text text-[11px] font-normal">热点</span>
              </div>
            </div>
            <!-- 右侧内容区域 -->
            <div class="flex-1 pl-3 flex items-center overflow-hidden">
              <van-swipe
                class="notice-swipe w-full"
                :autoplay="3000"
                vertical
                :show-indicators="false"
              >
                <van-swipe-item v-for="(notice, index) in tips" :key="index">
                  <div class="flex items-center justify-between w-full">
                    <div
                      class="notice-content text-[#555] text-[12.036px] font-bold truncate"
                      @click.stop="jumpToDetails(notice.id)"
                    >
                      {{ stripHtml(notice.title) }}
                    </div>
                    <van-icon
                      name="arrow"
                      class="flex-shrink-0 ml-1"
                      color="#999"
                      size="16"
                    />
                  </div>
                </van-swipe-item>
              </van-swipe>
            </div>
          </div>
          <!-- 视频区域 -->
          <div class="w-full mb-4 overflow-hidden rounded-[10px]">
            <HomeVideo />
          </div>
          <div
            class="w-full mb-4 overflow-hidden"
            @click="jumpToPage('myStocks')"
          >
            <img
              src="@/assets/img/home/psysg.png"
              alt="banner图"
              class="w-full rounded-[10px]"
            />
          </div>
          <!-- <div
            class="w-full mb-4 overflow-hidden"
            @click="jumpToPage('projectList')"
          >
            <img
              src="@/assets/img/home/Group4.png"
              alt="banner图"
              class="w-full rounded-[10px]"
            />
          </div> -->
          <!-- banner图 -->
          <div class="w-full mb-4 overflow-hidden" @click="jumpToPage('gdqy')">
            <img
              src="@/assets/img/home/gdqy.png"
              alt="banner图"
              class="w-full rounded-[10px]"
            />
          </div>
          <!-- <div
            class="w-full mb-4 overflow-hidden"
            @click="jumpToPage('myHouses')"
          >
            <img
              src="@/assets/img/home/bdczs.png"
              alt="banner图"
              class="w-full rounded-[10px]"
            />
          </div> -->
          <div
            class="w-full mb-4 overflow-hidden"
            @click="jumpToPage('member')"
          >
            <img
              src="@/assets/img/home/Group480964241.png"
              alt="banner图"
              class="w-full rounded-[10px]"
            />
          </div>
          <!-- <div
            class="w-full mb-4 overflow-hidden"
            @click="jumpToPage('member')"
          >
            <img
              src="@/assets/img/home/join_member.png"
              alt="banner图"
              class="w-full rounded-[10px]"
            />
          </div> -->
          <!-- banner图 -->

          <!-- banner图 -->
          <!--          <div class="w-full mb-4 overflow-hidden" @click="jumpToPage('exchangeHouses')">-->
          <!--            <img src="@/assets/img/home/house_exchange_banner.png" alt="房屋置换申请" class="w-full rounded-[10px]">-->
          <!--          </div>-->
          <!-- 功能菜单 -->
          <div class="bg-white rounded-[10px] p-4 mb-4">
            <div class="flex justify-between">
              <div
                class="flex flex-col items-center"
                @click="jumpToPage('help')"
              >
                <img
                  src="@/assets/img/home/new_help.png"
                  alt="APP下载"
                  class="w-[50px] h-[50px]"
                />
                <span class="mt-2 text-sm">新手帮助</span>
              </div>
              <div class="flex flex-col items-center" @click="getDownloadUrl">
                <img
                  src="@/assets/img/home/app_download_icon.png"
                  alt="APP下载"
                  class="w-[50px] h-[50px]"
                />
                <span class="mt-2 text-sm">APP下载</span>
              </div>
              <div
                class="flex flex-col items-center"
                @click="jumpToPage('leadership')"
              >
                <img
                  src="@/assets/img/home/real_name_icon.png"
                  alt="实名认证"
                  class="w-[50px] h-[50px]"
                />
                <span class="mt-2 text-sm">领导班子</span>
              </div>
              <div
                class="flex flex-col items-center"
                @click="jumpToPage('contactUs')"
              >
                <img
                  src="@/assets/img/home/official_account_icon.png"
                  alt="官方群聊"
                  class="w-[50px] h-[50px]"
                />
                <span class="mt-2 text-sm">官方群聊</span>
              </div>
              <div
                class="flex flex-col items-center"
                @click="jumpToPage('introduce')"
              >
                <img
                  src="@/assets/img/home/group_intro_icon.png"
                  alt="集团介绍"
                  class="w-[50px] h-[50px]"
                />
                <span class="mt-2 text-sm">集团介绍</span>
              </div>
            </div>
          </div>

          <!-- 邀请好友区域 -->
          <div class="mb-4" @click="jumpToPage('userInvite')">
            <h3 class="text-lg font-medium mb-2">邀请好友</h3>
            <img
              src="@/assets/img/home/invite_friends_banner.png"
              alt="邀请好友得奖励"
              class="w-full rounded-[10px]"
            />
          </div>

          <!-- 新闻动态标题 -->
          <div class="flex items-center mb-3">
            <h3 class="text-lg font-medium">新闻动态</h3>
          </div>

          <!-- 新闻列表 -->
          <div class="w-full">
            <van-swipe :show-indicators="false" :loop="false" :width="200">
              <van-swipe-item
                v-for="(item, index) in newsList"
                :key="index"
                class="pr-3"
              >
                <div @click="jumpToDetails(item.id)" class="w-full">
                  <div class="relative">
                    <img
                      :src="item.img"
                      class="w-[168px] h-[175px] object-cover"
                      alt="新闻图片"
                    />
                    <div
                      class="absolute bottom-2 left-0 bg-black bg-opacity-30 text-white text-xs px-1 py-0.5 rounded-r-card"
                    >
                      来源:{{ item.source || "人民网" }}
                    </div>
                  </div>
                  <div
                    class="mt-2 text-sm line-clamp-2 h-[40px] news-title-width"
                  >
                    {{ stripHtml(item.title) }}
                  </div>
                </div>
              </van-swipe-item>
            </van-swipe>
          </div>
        </div>
      </div>

      <!-- 客服组件 -->
      <CustomerService
        :position="customerServicePos"
        @contact="handleCustomerService"
      />

      <!-- 弹窗组件 -->
      <popup
        v-for="(notice, index) in notices"
        :key="index"
        v-model="notice.show"
        position="center"
        :closeable="true"
      >
        <div class="bg-white rounded-[20px] overflow-hidden">
          <div
            class="notice-title flex items-center justify-center text-2xl py-4 border-b border-[#f5f5f5]"
          >
            公告消息
          </div>
          <div class="p-4 max-h-[400px] overflow-y-auto">
            <p v-html="notice.content" class="text-base"></p>
          </div>
          <div class="p-6 flex justify-center">
            <div
              @click="closeDialog(index)"
              class="bg-primary text-white px-12 py-2.5 rounded-full cursor-pointer hover:opacity-90"
            >
              立即查看
            </div>
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { Popup, Icon as VanIcon } from "vant";
import api from "@/net/api";
import axios from "@/net/axios";
import Banner from "@/components/home/Banner.vue";
import CustomerService from "@/components/CustomerService.vue";
import HomeVideo from "@/components/home/HomeVideo.vue";

export default {
  name: "index",
  components: {
    Banner,
    Popup,
    CustomerService,
    HomeVideo,
    VanIcon,
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    ...mapState("systemInfo", ["systemInfo"]),
    title() {
      return this.$route.meta.title;
    },
  },
  data() {
    return {
      notices: [],
      tips: [],
      currentNoticeIndex: 0,
      customerServicePos: {
        right: 15,
        bottom: 80,
      },
      newsList: [],
    };
  },
  created() {
    this.getNoticeList();
    this.getNewsList();
  },
  mounted() {
    console.log("首页mounted");
    this.getUserInfo();
    this.getSystemInfo();
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    ...mapActions("systemInfo", ["getSystemInfo"]),

    jumpToDetails(id) {
      this.$router
        .push({
          name: "newsDetails",
          params: {
            id,
          },
        })
        .catch((err) => {
          console.error("路由跳转失败", err);
        });
    },
    handleCustomerService() {
      console.log("点击客服", this.systemInfo?.customerService);
      if (this.systemInfo?.customerService) {
        window.location.href = this.systemInfo.customerService;
      }
    },
    jumpToPage(name) {
      this.$router.push({ name });
    },
    openGovWebsite() {
      // 打开政府网站1号文件页面
      window.open(
        "https://www.gov.cn/yaowen/liebiao/202502/content_7005199.htm",
        "_blank"
      );
    },
    closeDialog(index) {
      this.notices[index].show = false;
      this.currentNoticeIndex++;
      if (this.currentNoticeIndex < this.notices.length) {
        if (index == 0) {
          // this.$router.push({ name: "gdqy" });
          // this.$router.push({ name: "projectList" });
          // this.$router.push({ name: "myHouses" });
          this.$router.push({ name: "myBankCard" });

          return;
        }
        setTimeout(() => {
          this.showNextNotice();
        }, 300);
      } else {
        // this.$router.push({ name: "gdqy" });
        this.$router.push({ name: "projectList" });
      }
    },
    getNoticeList() {
      axios
        .get(api.newsList, { params: { type: 1 } })
        .then((res) => {
          if (res.data.length > 0) {
            this.notices = res.data
              .filter((item) => item.index_status == 1)
              .map((notice) => ({
                ...notice,
                show: false,
              }));
            this.tips = res.data.filter((item) => item.index_status == 0);
            this.showNextNotice();
          }
        })
        .catch(() => {
          console.log("获取公告失败");
        });
    },

    showNextNotice() {
      if (this.currentNoticeIndex < this.notices.length) {
        this.notices[this.currentNoticeIndex].show = true;
      }
    },

    getDownloadUrl() {
      const baseUrl = window.location.origin;
      window.open(`${baseUrl}/download.html`, "_blank");
    },

    getNewsList() {
      axios
        .get(api.newsList, { params: { type: 5 } })
        .then((res) => {
          if (res.data.length > 0) {
            this.newsList = res.data;
          }
        })
        .catch(() => {
          console.log("获取新闻失败");
        });
    },

    stripHtml(html) {
      if (!html) return "";
      return html.replace(/<[^>]*>/g, "");
    },
  },
};
</script>

<style scoped lang="less">
.news-title-line {
  width: 3px;
  height: 16px;
  border-radius: 1.496px;
  background: linear-gradient(180deg, #2d84ff 0%, #79b1ff 100%);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.van-popup) {
  border-radius: 20px;
  overflow: hidden;
  width: 90%;
}

.notice-title {
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
}

.notice-swipe {
  height: 20px;

  .van-swipe-item {
    height: 100%;
  }
}

.policy-title {
  background: linear-gradient(149deg, #28d87d 14.44%, #01bd5d 87.25%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 25px);
}

.headline-part1 {
  color: #f00;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
}

.headline-part2 {
  color: #000;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
}

.hotspot-text {
  background: linear-gradient(146deg, #f9aa14 -0.44%, #fe0a01 53.67%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.news-title-width {
  width: 168px;
  overflow: hidden;
}
</style>
