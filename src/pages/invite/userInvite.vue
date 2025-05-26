<template>
  <div class="min-h-screen bg-[#F9B962] relative overflow-y-auto ">
    <div class="absolute top-0 left-0 right-0 w-full ">
      <!-- 标题栏 -->
      <div class="bg-[#FCDBC7]">
        <TitleBar :logoSrc="require('@/assets/img/home/yuexiu_logo.png')" @back="$router.back()" />
      </div>
      <img src="@/assets/img/invite/bg_invite.png" alt="背景" class="w-full">

      <!-- 内容区域 -->
      <div class="absolute top-[260px] left-0 right-0 px-4 pb-[60px]">
        <!-- 内容容器 -->
        <div class="rounded-[6px] bg-white p-4">
          <!-- 顶部图片 -->
          <div class="flex justify-center mb-4">
            <img src="@/assets/img/invite/invite_header_image.png" alt="邀请好友有礼" class="w-1/2">
          </div>

          <!-- 活动说明文字 -->
          <div class="bg-[#FFF4E6] rounded-[6px] p-3 mb-4">
            <div class="text-[#FF7F00] text-center text-[15px] font-bold font-harmonyos leading-6">
              注册立即赠送20000元现金额度，<br>实名认证额外赠送30000元现金额度及6000越秀地产股票
            </div>
          </div>

          <!-- 已邀请和奖励总额信息 -->
          <div class="flex bg-[#FFF9EC] rounded-lg p-4 my-4">
            <div class="flex-1 flex flex-col items-center justify-center">
              <span class="text-[#6C6C6C] text-[15px] font-normal font-harmonyos">已邀请</span>
              <div class="flex items-baseline mt-2">
                <span class="text-[#FF7F00] text-[29px] font-bold font-harmonyos">{{ userInfo?.recommend_identify_num || 0 }}</span>
                <span class="text-[#FF7F00] text-[15px] font-normal font-harmonyos ml-1">人</span>
              </div>
            </div>

            <div class="w-px border-l border-dashed border-[#FF7F00] mx-4"></div>

            <div class="flex-1 flex flex-col items-center justify-center">
              <span class="text-[#6C6C6C] text-[15px] font-normal font-harmonyos">奖励总额</span>
              <div class="flex items-baseline mt-1">
                <span class="text-[#FF7F00] text-[29px] font-bold font-harmonyos">{{ totalCashReward }}</span>
                <span class="text-[#FF7F00] text-[15px] font-normal font-harmonyos ml-1">现金</span>
              </div>
              <div class="flex items-baseline">
                <span class="text-[#FF7F00] text-[29px] font-bold font-harmonyos">{{ totalStockReward }}</span>
                <span class="text-[#FF7F00] text-[15px] font-normal font-harmonyos ml-1">股</span>
              </div>
            </div>
          </div>

          <!-- 邀请二维码区域 -->
          <div class="mt-4 mb-4">
            <div class="flex">
              <div class="flex-1 flex flex-col items-center mr-4">
                <span class="text-[#FF7F00] text-[12.381px] font-bold font-noto tracking-[0.796px] mb-2">分享二维码给好友</span>
                <div class="border-[3px] border-[#FF7F00] bg-white inline-block p-2">
                  <div id="qrCodeContainer" class="w-24 h-24"></div>
                </div>
              </div>

              <div class="flex-1 flex flex-col justify-center">
                <div class="flex items-center justify-center mb-3">
                  <div class="text-[#FF7F00] text-[13px] font-medium font-harmonyos tracking-[-0.1px] mr-2">我的邀请码:</div>
                  <div class="text-[#FF7F00] text-[17px] font-medium font-harmonyos tracking-[-0.1px]">{{ code }}</div>
                </div>

                <div class="w-full">
                  <button class="w-full rounded-[50px] bg-gradient-to-r from-[#EB6400] to-[#F49F00] text-white text-[18px] font-bold font-harmonyos py-2.5" @click="onCopy(url)">
                    复制推广链接
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 邀请列表 -->
          <div class="space-y-4">
            <div v-for="(item, index) in rewardList" :key="index" class="mb-4">
              <!-- 上部分：标题和按钮 -->
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <img src="@/assets/img/invite/invite_icon.png" alt="邀请图标" class="w-6 h-6 mr-2">
                  <span class="text-[#4F4F4F] font-normal text-[15px] font-harmonyos">邀请{{item.invite_identity_user}}位好友注册</span>
                </div>
                <div :class="[
                  'rounded-[19px] px-4 py-1.5 text-white text-[13px] font-medium font-harmonyos',
                  item.status === 2 || item.status === 3 ? 'bg-gray-400' : 'bg-[#E17234]'
                ]">
                  {{ item.status === 2 || item.status === 3 ? '已完成' : '去邀请' }}
                </div>
              </div>

              <!-- 下部分：奖励信息 -->
              <div class="flex justify-between items-start">
                <div class="flex-1 flex flex-col items-center">
                  <span class="text-[#FF7F00] text-[15px] font-normal font-harmonyos">{{item.gift_coin_num}}股</span>
                  <span class="text-[#FF7F00] text-[13px] font-normal font-harmonyos mt-1">越秀地产股票</span>
                </div>
                <div class="flex-1 flex flex-col items-center">
                  <span class="text-[#FF7F00] text-[15px] font-normal font-harmonyos">{{item.invite_award_num}}元</span>
                  <span class="text-[#FF7F00] text-[13px] font-normal font-harmonyos mt-1">现金额度</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 客服组件 -->
    <CustomerService
      :position="customerServicePos"
      @contact="handleCustomerService"
    />
  </div>
</template>

<script>
import axios from "@/net/axios";
import api from "@/net/api";
import CustomerService from "@/components/CustomerService.vue";
import {mapActions} from "vuex";
import TitleBar from "@/components/common/TitleBar.vue";
import QRCode from 'qrcodejs2';

export default {
  name: "userInvite",
  components: {
    TitleBar,
    CustomerService
  },
  computed: {
    code() {
      return this.userInfo?.code || "888888";
    },
    url() {
      return this.userInfo?.shareUrl || "";
    },
    totalCashReward() {
      return this.rewardList
        .filter(item => item.status === 2 || item.status === 3)
        .reduce((sum, item) => sum + Number(item.invite_award_num), 0);
    },
    totalStockReward() {
      return this.rewardList
        .filter(item => item.status === 2 || item.status === 3)
        .reduce((sum, item) => sum + Number(item.gift_coin_num), 0);
    },
  },
  data() {
    return {
      rewardList: [],
      loading: false,
      userInfo: null,
      qrCode: null,
      customerServicePos: {
        right: 15,
        bottom: 480
      },
    };
  },
  async created() {
    this.getSystemInfo();
    await this.loadConfig();
    await this.getActivatedList();
  },
  mounted() {
    this.generateQrCode();
  },
  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),
    async loadConfig() {
      try {
        const res = await axios.get(api.userInfo);
        if (res) {
          this.userInfo = res.data.userInfo;
        }
      } catch (error) {
        this.$toast(error.message || "获取用户信息失败");
      }
    },
    async getActivatedList() {
      if (this.loading) return;
      this.loading = true;

      try {
        const res = await axios.get(api.receiveList);
        if (res.data?.inviteConfigList) {
          this.rewardList = res.data.inviteConfigList;
        } else {
          this.$toast(res.msg || "获取数据失败");
        }
      } catch (e) {
        console.log("获取邀请列表失败:", e);
        this.$toast("网络错误,请稍后重试");
      } finally {
        this.loading = false;
      }
    },
    handleCustomerService() {
      if (this.systemInfo?.customerService) {
        window.location.href = this.systemInfo.customerService;
      }
    },
    onCopy(text) {
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, input.value.length);
      document.execCommand("Copy");
      document.body.removeChild(input);
      this.$dialog.alert({
        title: '提示',
        message: '已复制邀请链接',
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: '确定',
      });
    },
    generateQrCode() {
      // 生成二维码
      this.$nextTick(() => {
        const qrCodeContainer = document.getElementById('qrCodeContainer');
        if (qrCodeContainer) {
          // 清空容器
          qrCodeContainer.innerHTML = '';

          // 生成新的二维码
          new QRCode(qrCodeContainer, {
            text: this.url || `https://example.com/invite?code=${this.code}`,
            width: 96,
            height: 96,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
          });
        }
      });
    }
  },
};
</script>

<style scoped>
.font-harmonyos {
  font-family: "HarmonyOS Sans SC", sans-serif;
}

.font-noto {
  font-family: "Noto Sans Bengali UI", sans-serif;
}


</style>
