<template>
  <div class="min-h-screen relative overflow-y-auto bg-[#F87344]">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_activity.png" alt="背景" class="w-full">
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <div class="flex items-center p-4">
          <div class="text-white text-lg flex items-center" @click="$router.back()">
            <van-icon name="arrow-left" class="mr-1" />返回
          </div>
          <img src="@/assets/img/home/yuexiu_logo.png" alt="越秀集团" class="h-8 ml-auto">
        </div>

        <!-- 内容区域 -->
        <div class="px-4 pt-[110px]">


          <!-- 内容卡片 -->
          <div class="content-card">
            <!-- 限时标签 -->
<!--            <div class="limit-tag">-->
<!--              <span>限时</span>-->
<!--              <span class="countdown">{{countdownText}}</span>-->
<!--            </div>-->

            <!-- 价格信息 - 两行两列布局 -->
            <div class="info-grid">
              <!-- 第一行 -->
              <div class="info-row">
                <!-- 发行价格 -->
                <div class="info-col">
                  <div class="label">发行价格</div>
                  <div class="value">
                    <span class="number">{{item.price|formatAmount}}</span>
                    <span class="unit">元</span>
                  </div>
                </div>
                <!-- 每日分红 -->
                <div class="info-col">
                  <div class="label">每日分红</div>
                  <div class="value">
                    <span class="number">{{item.day_income|formatAmount}}</span>
                    <span class="unit">元</span>
                  </div>
                </div>
              </div>

              <!-- 第二行 -->
              <div class="info-row">
                <!-- 现金额度 -->
                <div class="info-col">
                  <div class="label">(赠)现金额度</div>
                  <div class="value">
                    <span class="number ml-2">300000</span>
                    <span class="unit">元</span>
                  </div>
                </div>
                <!-- 现金额度 -->
                <div class="info-col">
                  <div class="label">(赠)地产股票</div>
                  <div class="value">
                    <span class="number ml-2">300000</span>
                    <span class="unit">股</span>
                  </div>
                </div>
                <!-- 项目周期 -->
                <div class="info-col">
                  <div class="label">项目周期</div>
                  <div class="value">
                    <span class="number">{{item.total_day|formatAmount}}</span>
                    <span class="unit">天</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 按钮区域 -->
            <div class="btn-area">
              <button class="buy-btn" @click="handleBuy">立即买入</button>

            </div>
          </div>

          <!-- 项目说明卡片 -->
          <div class="project-desc mt-1 mb-8">
            <div class="desc-title">项目说明</div>
            <div class="desc-items">
              <div class="desc-item">
                <div class="dot"></div>
                <div class="text">每日分红每天可提现到账银行卡</div>
              </div>
              <div class="desc-item">
                <div class="dot"></div>
                <div class="text">赠送的现金额度将会自动打入到您申领的卡种当中，可取现可消费</div>
              </div>
              <div class="desc-item">
                <div class="dot"></div>
                <div class="text">在项目周期期间将会一直享有项目权益</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- 支付弹窗 -->
    <payment-dialog
      v-model="showPayment"
      :amount="item.price"
      @confirm="handlePayConfirm"
    />
  </div>
</template>

<script>
import {Button, Dialog, Icon, Loading, Overlay} from "vant";
import {mapActions} from "vuex";
import api from "@/net/api";
import axios from "@/net/axios";
import PaymentDialog from "@/components/common/PaymentDialog.vue";

export default {
  name: "ProjectActivity",
  components: {
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
        bottom: 80
      },
      item: {},
      id: 7,
      showImagePreview: false,
      previewImages: [],
      previewIndex: 0,
      showPayment: false,
      userInfo: {},
      countdownText: '',
      timer: null,
      endTime: new Date('2025-05-04 00:00:00').getTime()
    };
  },

  mounted() {
    this.getSystemInfo();
    this.getDetails();
    this.getUserInfoData();
    this.startCountdown();
  },
  beforeDestroy() {
    if(this.timer) {
      clearInterval(this.timer);
    }
  },
  filters: {
    formatAmount(value) {
      if (!value || isNaN(value)) {
        return '0';
      }
      const num = Number(value);
      if (Number.isInteger(num)) {
        return num.toString();
      }
      return num.toFixed(0);
    }
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
    async getDetails() {
      try {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
        });
        const res = await axios.get(api.idoDetail, {params: {id: this.id}})
        if (res.data) {
          this.item = res.data;
        }
      } catch (err) {
        console.log(err)
        err.msg && this.$toast(err.msg);
      } finally {
        this.$toast.clear();
      }
    },
    handleBuy() {
      if (!this.userInfo?.is_identify) {
        Dialog.alert({
          message: "请先完成实名认证",
          confirmButtonText: "去认证",
        }).then(() => {
          this.$router.push({name: "realNameAuth"});
        });
        return;
      }

      if(!this.userInfo?.member_status){
        Dialog.alert({
          message: "请先申请会员",
          confirmButtonText: "立即申请",
        }).then(() => {
          this.$router.push({name: "member"});
        });
        return;
      }

      this.showPayment = true;
    },
    async handlePayConfirm({pay_type, channel_type}) {
      const params = {
        pay_type,
        channel_type,
        project_id: this.id,
        source: 2,
        amount: this.item.price,
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
          this.$router.back();
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
        this.countdownText = '已结束';
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
.welfare-tag {
  background: #FF4B27;
  color: white;
  font-size: 16px;
  padding: 4px 12px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 15px;
}

.content-card {
  background: white;
  border-radius: 12px;
  padding: 25px 15px 10px;
  position: relative;
  border: 1px solid #FBC57F;
  box-shadow: 0 2px 10px rgba(251, 197, 127, 0.1);
}

.limit-tag {
  position: absolute;
  top: 0;
  right: 0;
  background: #FF4B27;
  color: white;
  padding: 4px 12px;
  border-radius: 0 12px 0 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.countdown {
  font-weight: bold;
}

.info-grid {
  margin: 20px 0 30px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;

  &:last-child {
    margin-bottom: 0;
  }
}

.info-col {
  flex: 1;
  text-align: center;
}

.label {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.value {
  color: #FF4B27;
  line-height: 1;
}

.number {
  font-size: 16px;
  font-weight: bold;
}

.unit {
  font-size: 14px;
  margin-left: 2px;
}

.btn-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.buy-btn {
  width: 80%;
  height: 45px;
  background: linear-gradient(to right, #FFD686, #FFE7B8);
  color: #333;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.9;
  }
}

.return-tip {
  color: #666;
  font-size: 14px;
}

.project-desc {
  background: white;
  border-radius: 12px;
  padding: 10px;
  border: 1px solid #FBC57F;
  box-shadow: 0 2px 10px rgba(251, 197, 127, 0.1);
}

.desc-title {
  color: #FF4B27;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  position: relative;
  padding-left: 12px;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 16px;
    background: #FF4B27;
    border-radius: 2px;
  }
}

.desc-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.desc-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.dot {
  width: 6px;
  height: 6px;
  background: #FF4B27;
  border-radius: 50%;
  margin-top: 8px;
}

.text {
  color: #666;
  font-size: 12px;
  line-height: 1.5;
  flex: 1;
}
</style>
