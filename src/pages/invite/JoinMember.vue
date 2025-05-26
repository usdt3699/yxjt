<template>
  <div class="min-h-screen bg-[#960E14] relative overflow-y-auto pb-[280px]">
    <div class="w-full relative">
      <img src="@/assets/img/invite/bg_zn.png" alt="邀请背景" class="w-full">
      <div class="absolute top-[160px] left-0 right-0 px-4">
        <div
            v-for="(item, index) in assetList"
            :key="index"
            class="bg-[#E4707B] border border-white rounded-[12px] mb-8 relative"
        >
          <!-- 标题行 -->
          <div class="flex items-center px-4 py-2 h-[16px] m">

          </div>

          <!-- 内容区域 -->
          <div class="bg-gradient-to-b rounded-[12px] from-white to-[#FFEDD2] p-4 pb-8">
            <div class="flex">
              <!-- 左侧产品信息 -->
              <div class="flex-shrink-0 mr-4">
                <img
                    :src="item.img"
                    class="w-[72px] h-[72px] rounded-[8px] object-cover"
                />
              </div>

              <!-- 右侧收益信息 -->
              <div class="flex-1">
                <!-- 上部分信息 -->
                <div class="flex justify-between items-center mb-2">
                  <div class="text-[#33374D] font-black text-[14.708px]">{{ item.name }}</div>
                  <div class="flex items-center">
                    <div class="text-[#705C2D] text-[11.81px] font-medium mr-1">助农金额</div>
                    <div class="bg-[#FFCF87] text-[#705C2D] text-[12px] font-medium px-2  rounded-[2.451px]">
                      {{ Math.floor(item.price) }}元
                    </div>
                  </div>
                </div>

                <!-- 下部分信息 -->
                <div class="flex justify-between">
                  <div class="text-center">
                    <div class="text-[#464646] text-[13.657px] font-medium">助农收益</div>
                    <div class="text-[#FFA400] text-[20.517px] font-medium">{{ Number(item.day_income).toFixed(0)}}元</div>
                  </div>
                  <div class="text-center">
                    <div class="text-[#464646] text-[13.657px] font-medium">助力补贴</div>
                    <div class="text-[#FFA400] text-[20.517px] font-medium">{{ item.gift_coin_num >= 10000 ? (item.gift_coin_num / 10000).toFixed(0) + '万' : item.gift_coin_num }}元</div>
                  </div>
                  <div class="text-center">
                    <div class="text-[#464646] text-[13.657px] font-medium">助力天数</div>
                    <div class="text-[#FFA400] text-[20.517px] font-medium">{{ item.total_day }}天</div>
                  </div>
                </div>
                <!-- 标题行 -->
                <div class="flex items-center py-2">
                  <img
                      src="@/assets/img/invite/ic_gou.png"
                      class="w-[16px] h-[16px] mr-2"
                  />
                  <div class="text-[#33374D] font-black text-[12px]">团队分红一级5%二级2%三级1%</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 立即助农按钮 -->
          <div class="flex justify-center absolute -bottom-4 left-0 right-0">
            <button
                class="bg-gradient-to-r from-[#FFB84D] to-[#FFB226] text-[#734E00] font-bold text-[14.708px] rounded-[5.253px] px-8 py-2 shadow-lg"
                @click="handleAssetClick(item)"
            >
              立即助农
            </button>
          </div>
        </div>
      </div>

      <!-- Keep existing dialogs and overlays -->
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

      <payment-dialog
          v-model="showPayment"
          :amount="selectedItem?.price"
          :coupon="selectedCoupon"
          @confirm="handlePayConfirm"
      />
      <!-- 客服组件 -->
      <CustomerService
          :position="customerServicePos"
          @contact="handleCustomerService"
      />
    </div>
  </div>
</template>

<script>
import {Button, Cell, CellGroup, Dialog, Icon, Loading, Overlay, Picker, Popup, PullRefresh, Radio, Toast,} from "vant";
import axios from "@/net/axios";
import api from "@/net/api";
import PaymentDialog from "@/components/common/PaymentDialog.vue";
import CustomerService from "@/components/CustomerService.vue";
import {mapActions} from "vuex";

export default {
  name: "JoinMember",
  components: {
    CustomerService,
    [PullRefresh.name]: PullRefresh,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
    [Radio.name]: Radio,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    PaymentDialog,
  },
  data() {
    return {
      loading: false,
      refreshing: false,
      pageLoading: false,
      showPayment: false,
      showConfirmDialog: false,
      showCertificate: false,
      userInfo: {},
      selectedItem: null,
      selectedPrices: {},
      canUseCoupon: true,
      couponList: [],
      assetList: [],
      selectedCoupon: null,
      chartInstances: [], // 存储图表实例
      showAdvantageDialog: false,
      customerServicePos: {
        right: 15,
        bottom: 80
      },
    };
  },

  mounted() {
    this.getSystemInfo();
    this.getUserInfoData()
    this.getAssetList();
  },

  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),
    handleCustomerService() {
      if (this.systemInfo?.customerService) {
        window.location.href = this.systemInfo.customerService;
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
    async getAssetList() {
      try {
        this.pageLoading = true;
        const res = await axios.get(api.welfareList, {
          params: {
            type: 1,
          },
        });
        if (res.code === 200 && res.data?.idoList) {
          this.assetList = res.data.idoList;
        }
      } catch (error) {
        Dialog.alert({
          title: "提示",
          message: error.msg || "获取资产列表失败",
          confirmButtonText: "确定",
          confirmButtonColor: "#F23D30",
        });
      } finally {
        this.pageLoading = false;
      }
    },


    jumpToPage(name) {
      this.$router.push({name});
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
      this.selectedItem = item;
      this.showPayment = true;
    },

    async handlePayConfirm({pay_type, channel_type}) {
      const params = {
        pay_type,
        channel_type,
        project_id: this.selectedItem.id,
        source: 2,
        amount: this.selectedItem.price,
      };

      try {
        const loading = Toast.loading({
          message: "处理中...",
          forbidClick: true,
        });

        const res = await axios.post(api.balancePay, params);
        loading.clear();
        this.showPayment = false;
        if (pay_type === 9) {
          await this.$dialog.alert({
            title: "提示",
            message: "购买成功！",
            theme: "round-button",
            confirmButtonText: "确定",
            confirmButtonColor: "#F52735",
          });
        } else {
          if (res.data.payUrl) {
            window.location.href = res.data.payUrl;
          }
        }
      } catch (err) {
        this.$toast(err.msg || "支付失败");
      }
    },


  },


};
</script>

<style scoped lang="less">
.trend-chart-container {
  position: relative;
  width: 100%;
  padding-right: 100px;
  margin-left: 0;
}

.trend-chart {
  width: 100%;
  height: 60px;
}

.trend-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 60px;
  padding-top: 0;
  padding-bottom: 0;
  min-width: 45px;
  text-align: left;
  margin-right: 4px;
}

.trend-y-label {
  font-size: 10px;
  color: #999;
  line-height: 1;
}

:deep(.van-pull-refresh__head) {
  .van-loading {
    .van-loading__spinner {
      color: #fff !important;
    }

    .van-loading__text {
      color: #fff !important;
    }
  }

  .van-pull-refresh__text {
    color: #fff !important;
  }
}
</style>
