<template>
  <div class="min-h-screen bg-[#960E14] relative overflow-y-auto pb-[80px]">
    <div class="w-full relative">
      <img src="@/assets/img/invite/bg_szbt.png" alt="邀请背景" class="w-full">
      <div class="absolute top-[200px] left-0 right-0 px-4">
        <!-- 补贴列表 -->
        <div class="subsidy-list w-full">
          <!-- 顶部标题图片 -->
          <div class="relative">
            <img src="@/assets/img/invite/ic_btfs.png" alt="补贴放送" class="subsidy-title-image"/>
          </div>
          <div class="subsidy-container rounded-[8.609px] bg-[rgba(255,242,242,0.92)]">
            <div
                v-for="(item, index) in assetList"
                :key="index"
                class="subsidy-item mb-3 overflow-hidden"
            >
              <div class="p-3 flex">
                <!-- 项目图片 -->
                <img
                    :src="item.img || '@/assets/img/icon_invest.png'"
                    class="subsidy-icon"
                />

                <div class="flex-1 ml-3">
                  <div class="flex justify-between items-start">
                    <span class="farmer-count">实名人数达到</span>
                    <span class="farmer-count">{{ item.invite_identity_user || 0 }}人</span>
                  </div>

                  <div class="flex justify-between items-end mt-2">
                    <div class="flex flex-col">
                      <div class="subsidy-amount">{{ item.invite_award_num || '0' }}元</div>
                      <div class="subsidy-text">补贴</div>
                    </div>
                    <button
                        class="apply-btn"
                        :class="{'apply-btn-disabled': item.status === 3}"
                        @click.stop="handleAssetClick(item)"
                    >{{ getButtonText(item.status) }}
                    </button>
                  </div>
                  
                  <!-- 进度条 -->
                  <div class="progress-container mt-2">
                    <div 
                      class="progress-bar" 
                      :style="{width: calculateProgress(item.has_recommend_identify_num, item.invite_identity_user) + '%'}"
                    ></div>
                  </div>
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
import {Dialog, Loading, Overlay, Toast, Button, Field, Icon} from "vant";
import axios from "@/net/axios";
import api from "@/net/api";
import {mapActions} from "vuex";
import CustomerService from "@/components/CustomerService.vue";

export default {
  name: "index",
  components: {
    CustomerService,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Toast.name]: Toast,
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    [Field.name]: Field,
    [Icon.name]: Icon,
  },
  data() {
    return {
      pageLoading: true,
      customerServicePos: {
        right: 15,
        bottom: 80
      },
      assetList: [],
      selectedAsset: null,
      userInfo: {},
    };
  },
  mounted() {
    this.getSystemInfo();
    this.getUserInfoData();
    this.getAssetList();
  },
  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),

    handleCustomerService() {
      if (this.systemInfo?.customerService) {
        window.location.href = this.systemInfo.customerService;
      }
    },

    async getAssetList() {
      try {
        this.pageLoading = true;
        const res = await axios.get(api.myInviteVipAward);
        if (res.code === 200 && res.data?.inviteCheckList) {
          this.assetList = res.data.inviteCheckList;
        }
      } catch (error) {
        Dialog.alert({
          title: "提示",
          message: error.msg || "获取失败",
          confirmButtonText: "确定",
          confirmButtonColor: "#F23D30",
        });
      } finally {
        this.pageLoading = false;
      }
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
    async handleAssetClick(item) {
      if (!this.userInfo?.is_identify) {
        await Dialog.alert({
          message: "请先完成实名认证",
          confirmButtonText: "去认证",
        });
        this.$router.push({name: "realNameAuth"});
        return;
      }

      switch(item.status) {
        case 1:
          this.$router.push({name: "userInvite"});
          break;
        case 2:
          this.$router.push({name: "applySubsidies", query:  item});
          break;
        case 3:
          // 已领取状态不做任何操作
          break;
      }
    },

    getButtonText(status) {
      switch(status) {
        case 1:
          return '未达标';
        case 2:
          return '申请补贴';
        case 3:
          return '已领取';
        default:
          return '申请补贴';
      }
    },
    
    // 计算进度百分比
    calculateProgress(hasRecommendNum, targetNum) {
      if (!hasRecommendNum || !targetNum) return 0;
      const current = parseInt(hasRecommendNum) || 0;
      const target = parseInt(targetNum) || 1; // 避免除以0
      const percentage = Math.min(Math.floor((current / target) * 100), 100);
      return percentage;
    },
  },
};
</script>

<style scoped>
 

/* 进度条样式 */
.progress-container {
  height: 8px;
  border-radius: 50px;
  background: #6F0000;
  overflow: hidden;
  width: 100%;
}

.progress-bar {
  height: 100%;
  border-radius: 59px;
  background: var(--Linear, linear-gradient(90deg, #F23D30 0%, #FF6A57 48.44%, #F23D30 100%));
  transition: width 0.3s ease;
}

.subsidy-title-image {
  position: absolute;
  left: 0;
  top: -30px;
  z-index: 10;
  width: 160px;
  height: auto;
}

.subsidy-container {
  padding: 20px 15px 10px 15px;
  position: relative;
}

.subsidy-item {
  background: #FFF;
  border-radius: 8px;
  margin-bottom: 12px;
}

.subsidy-icon {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.farmer-count {
  color: #252626;
  font-family: "HarmonyOS Sans SC";
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.323px;
}

.subsidy-amount {
  color: #FF1D1D;
  font-family: Alata;
  font-size: 17.217px;
  font-weight: 400;
  letter-spacing: -0.323px;
}

.subsidy-text {
  color: #969799;
  font-family: "HarmonyOS Sans SC";
  font-size: 13px;
  font-weight: 400;
}

.apply-btn {
  border-radius: 4.304px;
  background: linear-gradient(90deg, #F23D30 0%, #FF6A57 48.44%, #F23D30 100%);
  color: #FFF;
  text-align: center;
  font-family: "HarmonyOS Sans SC";
  font-size: 15.065px;
  font-weight: 500;
  letter-spacing: -0.323px;
  padding: 6px 12px;
  border: none;
}

.apply-btn-disabled {
  background: #CCCCCC;
  cursor: not-allowed;
}

/* 自定义弹窗样式 */
:deep(.van-dialog__header) {
  padding: 15px;
  border-bottom: 1px solid #eee;
}


.amount-section .van-field {
  padding: 12px 16px;
  background: #ffffff;
  border: 2px solid #dcdcdc;
  border-radius: 8px;
}

.amount-section :deep(.van-field__control) {
  font-size: 16px;
  color: #333;
}

.amount-section :deep(.van-field__control::placeholder) {
  color: #999;
}

</style>
