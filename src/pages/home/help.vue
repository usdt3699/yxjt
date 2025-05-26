<template>
  <div class="min-h-screen relative overflow-y-auto bg-[#F8B894]">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common.png" alt="背景" class="w-full">
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <TitleBar :logoSrc="require('@/assets/img/home/yuexiu_logo.png')" @back="$router.back()" />

        <!-- 内容区域 -->
        <div class="content-container mx-4 rounded-lg p-2">
          <!-- 标题 -->
          <div class="title-container">
            <span class="group-title">新手帮助</span>
          </div>

          <!-- 介绍图 -->
          <div class="intro-image-container">
            <img src="@/assets/img/home/group_intro_banner.png" alt="集团介绍" class="w-full">
          </div>

          <!-- 文字内容 -->
          <div class="intro-content p-4" v-html="groupIntroContent">
          </div>
        </div>
      </div>

      <!-- 客服组件 -->
      <CustomerService
          :position="customerServicePos"
          @contact="handleCustomerService"
      />

      <!-- 加载遮罩 -->
      <van-overlay
          :show="pageLoading"
          class="flex items-center justify-center z-2"
      >
        <van-loading
            type="spinner"
            color="#fff"
            size="36"
            vertical
        >
          加载中...
        </van-loading>
      </van-overlay>
    </div>
  </div>
</template>

<script>
import {Button, Dialog, Icon, Loading, Overlay} from "vant";
import CustomerService from "@/components/CustomerService.vue";
import TitleBar from "@/components/common/TitleBar.vue";
import {mapActions} from "vuex";
import axios from "@/net/axios";
import api from "@/net/api";

export default {
  name: "GroupIntroduce",
  components: {
    TitleBar,
    CustomerService,
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
  },
  data() {
    return {
      pageLoading: false,
      customerServicePos: {
        right: 15,
        bottom: 80
      },
      groupIntroContent: "",
    };
  },

  mounted() {
    this.getSystemInfo();
    this.getData();
  },

  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),
    handleCustomerService() {
      if (this.systemInfo?.customerService) {
        window.location.href = this.systemInfo.customerService;
      }
    },
    getData() {
      axios
          .get(api.newsList, {params: {type: 6,index_status:0}})
          .then((res) => {
            if (res.data.length > 0) {
              this.groupIntroContent = res.data[0].content;
            }
          })
          .catch(() => {
            console.log("获取新闻失败");
          });
    },
  },
};
</script>

<style scoped lang="less">
.content-container {
  background: #FFF;
  stroke-width: 1px;
  stroke: rgba(195, 159, 122, 0.13);
  filter: drop-shadow(0px 0px 8px #F2F4F7);
  border: 1px solid rgba(195, 159, 122, 0.13);
  overflow: hidden;
  margin-top: 0;
  position: relative;
  border-radius: 8px;
  margin-left: 16px;
  margin-right: 16px;
}

.title-container {
  width: 92.712px;
  height: 30px;
  flex-shrink: 0;
  background: linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%);
  text-align: center;
  border: 1px solid rgba(195, 159, 122, 0.13);
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.25));
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin: 16px 0 8px;
  position: relative;
  z-index: 1;
}

.group-title {
  color: #FFF;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: rgba(195, 159, 122, 0.13);
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 17px;
  font-weight: 500;
  letter-spacing: -0.3px;
}

.intro-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  white-space: pre-line;
}
</style>
