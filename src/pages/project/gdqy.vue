<template>
  <div class="min-h-screen relative overflow-y-auto bg-[#F87344]">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common4.png" alt="背景" class="w-full" />
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <div class="flex items-center p-4">
          <div
            class="text-black text-lg flex items-center"
            @click="$router.back()"
          >
            <van-icon name="arrow-left" class="mr-1" />
            返回
          </div>
          <img
            src="@/assets/img/home/yuexiu_logo.png"
            alt="越秀集团"
            class="h-8 ml-auto"
          />
        </div>
        <!-- 内容区域 -->
        <div class="px-4 pt-4">
          <div
            class="stock-card"
            v-for="(item, index) in assetList"
            :key="index"
          >
            <!-- 福利标签 -->
            <div v-if="multiplier > 1" class="welfare-tag">
              {{ multiplier }}倍福利
            </div>

            <!-- 卡片头部 用本地图片，包括了图片背景和上面的价格文字信息 -->
            <div class="stock-card-header">
              <img
                :src="
                  require(`@/assets/img/project/stock_card_${index + 1}.png`)
                "
                class="stock-card-img"
              />
            </div>

            <!-- 卡片内容 -->
            <div class="stock-card-content">
              <div class="stock-info-row">
                <div class="stock-info-col">
                  <div class="stock-info-value">
                    {{ item.gift_coin_num
                    }}<span class="stock-info-unit">元</span>
                  </div>
                  <div class="stock-info-label">返现</div>
                </div>
                <div class="stock-info-col">
                  <div class="stock-info-value">
                    <span v-if="multiplier > 1" class="original-price"
                      >{{ calculateOriginalValue(item.gift_coin_num_sec)
                      }}<span class="stock-info-unit">元</span></span
                    >
                    {{ item.gift_coin_num_sec
                    }}<span class="stock-info-unit">元</span>
                  </div>
                  <div class="stock-info-label">现金额度</div>
                </div>
                <div class="stock-info-col">
                  <div class="stock-info-value">
                    <span v-if="multiplier > 1" class="original-price"
                      >{{ calculateOriginalValue(item.gift_coin_num_third)
                      }}<span class="stock-info-unit">克</span></span
                    >
                    {{ item.gift_coin_num_third
                    }}<span class="stock-info-unit">克</span>
                  </div>
                  <div class="stock-info-label">定制金条{{ multiplier }}条</div>
                </div>
              </div>

              <!-- 提示文本 -->
              <div class="stock-tip">赠送金条及现金额度可在线申领金条实物</div>

              <!-- 按钮区域 -->
              <div class="btn-area">
                <button class="buy-btn" @click="handleBuy(item, index)">
                  立即成为越秀{{ item.name }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 项目说明 -->
        <div class="project-info mx-4 mb-2">
          <div class="project-info-header">
            <img
              src="@/assets/img/home/yuexiu_logo.png"
              alt="越秀集团"
              class="h-5 w-auto"
            />
            <div class="project-info-title">项目说明</div>
          </div>
          <div class="project-info-content">
            <div class="project-info-item">
              1、成为股东后返现金额会到达项目收益可立即提现。
            </div>
            <div class="project-info-item">
              2、赠送的金条将由财务部立即定制安排发货。
            </div>
            <div class="project-info-item">
              3、赠送的现金额度将会自动打入到您申领的卡种当中，可取现可消费。
            </div>
            <div class="project-info-item">
              4、赠送的越秀交通项目将会获得该项目所有收益。
            </div>
            <div class="project-info-item">
              5、邀请下级成为股东可立即获得10%佣金。
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 支付弹窗 -->
    <payment-dialog
      v-model="showPayment"
      :amount="selectedItem ? selectedItem.price : 0"
      @confirm="handlePayConfirm"
    />
    <!-- 证书预览 -->
    <gold-certificate-preview
      :card-detail="selectedCardDetail"
      :show.sync="showActivityCertificatePreview"
    ></gold-certificate-preview>
  </div>
</template>

<script>
import { Button, Dialog, Icon, Loading, Overlay } from "vant";
import { mapActions } from "vuex";
import api from "@/net/api";
import axios from "@/net/axios";
import PaymentDialog from "@/components/common/PaymentDialog.vue";
import GoldCertificatePreview from "@/components/bank/GoldCertificatePreview.vue";

export default {
  name: "ProjectActivity",
  components: {
    GoldCertificatePreview,
    PaymentDialog,
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
        bottom: 80,
      },
      assetList: [],
      id: 7,
      showImagePreview: false,
      previewImages: [],
      previewIndex: 0,
      showPayment: false,
      selectedItem: null, // 添加选中的项目
      userInfo: {},
      countdownText: "",
      timer: null,
      endTime: new Date("2025-05-12 00:00:00").getTime(),
      selectedCardDetail: {},
      showActivityCertificatePreview: false,
      multiplier: 1, // 添加倍数控制变量
    };
  },

  mounted() {
    this.getSystemInfo();
    this.getAssetList();
    this.getUserInfoData();
    this.startCountdown();
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  filters: {
    formatAmount(value) {
      if (!value || isNaN(value)) {
        return "0";
      }
      const num = Number(value);
      if (Number.isInteger(num)) {
        return num.toString();
      }
      return num.toFixed(0);
    },
  },
  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),

    calculateOriginalValue(value) {
      if (!value) return "0";
      const numValue = parseFloat(value);
      return (numValue / this.multiplier).toFixed(2);
    },

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
        // 获取倍数值
        const res2 = await axios.get(api.stock);
        if (res2 && res2.data && res2.data.multiplier !== undefined) {
          this.multiplier = Number(res2.data.multiplier);
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
            type: 3,
          },
        });
        if (res.code === 200 && res.data?.idoList) {
          this.assetList = res.data.idoList;
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
    handleBuy(item, index) {
      if (!this.userInfo?.is_identify) {
        Dialog.alert({
          message: "请先完成实名认证",
          confirmButtonText: "去认证",
        }).then(() => {
          this.$router.push({ name: "realNameAuth" });
        });
        return;
      }
      // 设置选中的项目
      this.selectedItem = this.assetList[index];
      this.showPayment = true;
    },
    async handlePayConfirm({ pay_type, channel_type }) {
      const params = {
        pay_type,
        channel_type,
        project_id: this.selectedItem.id,
        source: 2,
        amount: this.selectedItem ? this.selectedItem.price : 0,
      };

      try {
        const res = await axios.post(api.balancePay, params);
        this.showPayment = false;
        if (pay_type === 9) {
          await Dialog.alert({
            title: "提示",
            message: "支付成功！",
            theme: "round-button",
            confirmButtonText: "确定",
            confirmButtonColor: "#F52735",
          });
          this.$router.push({ name: "gdpz" });
        } else {
          if (res.data.payUrl) {
            window.location.href = res.data.payUrl;
          }
        }
      } catch (err) {
        this.showPayment = false;
        await Dialog.alert({
          title: "提示",
          message: err.msg || "支付失败",
          theme: "round-button",
          confirmButtonText: "确定",
          confirmButtonColor: "#F52735",
        });
      }
    },
    startCountdown() {
      this.updateCountdown();
      this.timer = setInterval(this.updateCountdown, 1000);
    },
    updateCountdown() {
      const now = new Date().getTime();
      const distance = this.endTime - now;

      if (distance < 0) {
        clearInterval(this.timer);
        this.countdownText = "已结束";
        return;
      }

      const totalHours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.countdownText = `${totalHours}时${minutes}分${seconds}秒`;
    },
  },
};
</script>

<style scoped lang="less">
/* 项目说明样式 */
.project-info {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
}

.project-info-header {
  background-color: #f8f8f8;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-info-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.project-info-content {
  padding: 12px;
  font-size: 12px;
  color: #666;
  line-height: 1.6;
}

.project-info-item {
  margin-bottom: 4px;
  &:last-child {
    margin-bottom: 0;
  }
}

/* 股票卡片样式 */
.stock-card {
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.stock-card-header {
  width: 100%;
  position: relative;
}

.stock-card-img {
  width: 100%;
  height: auto;
  display: block;
}

.stock-card-content {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 0 0 12px 12px;
}

.stock-info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.stock-info-col {
  flex: 1;
  text-align: center;
}

.stock-info-value {
  font-size: 18px;
  font-weight: bold;
  color: #ff4b27;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stock-info-unit {
  font-size: 12px;
  margin-left: 2px;
  color: #ff4b27;
}

.stock-info-label {
  font-size: 12px;
  color: #666;
}

.stock-tip {
  text-align: center;
  font-size: 10px;
  color: #999;
  margin-bottom: 15px;
}

.btn-area {
  display: flex;
  justify-content: center;
}

.buy-btn {
  width: 90%;
  height: 40px;
  background: linear-gradient(to right, #ff6b00, #ff9500);
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.9;
  }
}

/* 保留其他原有样式 */
.welfare-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(90deg, #ff6a00 0%, #ff0000 100%);
  padding: 2px 8px;
  border-radius: 10px;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.countdown {
  font-weight: bold;
}

.price {
  font-size: 20px;
  color: #ff7a2b;
  font-weight: bold;
  margin-right: 15px;
  margin-top: 5px;
}

.return-tip {
  color: #666;
  font-size: 14px;
}

/* 原价划线样式 */
.original-price {
  text-decoration: line-through;
  font-size: 12px;
  color: #999;
  margin-bottom: 2px;
  display: inline-block;
}
</style>
