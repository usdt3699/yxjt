<template>
  <div class="min-h-screen relative overflow-y-auto">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common2.png" alt="背景" class="w-full">
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <!-- 标题栏 -->
        <TitleBar :logoSrc="require('@/assets/img/home/yuexiu_logo.png')" @back="$router.back()"/>

        <!-- 内容区域 -->
        <div class="content-container mx-4 mt-6 rounded-lg p-5 bg-white shadow-md">
          <div class="recharge-header mb-8">
            <div class="text-center">
              <div class="text-gray-500 text-sm mb-2">当前余额</div>
              <div class="text-3xl font-bold text-[#F52735]">¥{{ currentBalance }}</div>
            </div>
          </div>

          <div class="recharge-amount mb-8">
            <div class="text-base font-medium mb-3">充值金额</div>
            <div class="relative">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl font-bold">¥</div>
              <input
                v-model="amount"
                type="number"
                class="w-full p-3 pl-8 bg-gray-50 rounded-lg text-xl font-bold"
                placeholder="请输入充值金额"
              />
            </div>
          </div>

          <div class="quick-amount mb-8">
            <div class="text-base font-medium mb-3">快速选择</div>
            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="(item, index) in quickAmounts"
                :key="index"
                class="amount-item py-2 px-3 rounded-lg text-center"
                :class="{ 'active': amount === item.value }"
                @click="amount = item.value"
              >
                {{ item.label }}
              </div>
            </div>
          </div>

          <div class="recharge-tips mb-8">
            <div class="bg-[#FFF7F7] p-3 rounded-lg">
              <div class="flex items-start">
                <van-icon name="info-o" class="text-[#F52735] mr-2 mt-0.5" />
                <div class="text-sm text-gray-600">
                  <p>1. 充值金额将实时到账，可用于平台内的各项支付</p>
                  <p>2. 如有任何问题，请联系客服处理</p>
                </div>
              </div>
            </div>
          </div>

          <div class="recharge-button">
            <van-button
              round
              block
              color="#F52735"
              :disabled="!isValidAmount"
              @click="handleRecharge"
            >
              立即充值
            </van-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 支付弹窗 -->
    <payment-dialog
      v-model="showPayment"
      :amount="amount"
      :coupon="null"
      :showBalancePayment="false"
      @confirm="handlePayConfirm"
    />
  </div>
</template>

<script>
import { Button, Icon, Dialog } from "vant";
import { mapState } from "vuex";
import PaymentDialog from "@/components/common/PaymentDialog.vue";
import axios from "@/net/axios";
import api from "@/net/api";
import TitleBar from "@/components/common/TitleBar.vue";

export default {
  name: "BalanceRecharge",
  components: {
    TitleBar,
    PaymentDialog,
    [Button.name]: Button,
    [Icon.name]: Icon,
  },
  data() {
    return {
      currentBalance: "0.00",
      amount: "",
      showPayment: false,
      quickAmounts: [
        { label: "¥400", value: "400" },
        { label: "¥900", value: "900" },
        { label: "¥1500", value: "1500" },
        { label: "¥4000", value: "4000" },
        { label: "¥7000", value: "7000" },
        { label: "¥9000", value: "9000" },
      ]
    };
  },
  computed: {
    ...mapState("user", ["userWallet"]),
    isValidAmount() {
      return this.amount && parseFloat(this.amount) > 0;
    }
  },
  mounted() {
    this.getRouteParams();
  },
  methods: {
    getRouteParams() {
      // 获取路由参数
      if (this.$route.query) {
        this.currentBalance = this.$route.query.balance || '0.00';
      }
    },

    handleRecharge() {
      if (!this.isValidAmount) {
        this.$toast("请输入有效的充值金额");
        return;
      }
      this.showPayment = true;
    },
    async handlePayConfirm({ pay_type, channel_type }) {
      const params = {
        pay_type,
        channel_type,
        amount: this.amount,
        source: 1, // 余额充值
      };

      try {
        const res = await axios.post(api.balancePay, params);
        this.showPayment = false;

        if (pay_type === 9) {
          await Dialog.alert({
            title: "提示",
            message: "充值成功！",
            theme: "round-button",
            confirmButtonText: "确定",
            confirmButtonColor: "#F52735",
          });
        } else {
          if (res.data && res.data.payUrl) {
            window.location.href = res.data.payUrl;
          }
        }
      } catch (err) {
        this.showPayment = false;
        await Dialog.alert({
          title: "提示",
          message: err.msg || "充值失败",
          theme: "round-button",
          confirmButtonText: "确定",
          confirmButtonColor: "#F52735",
        });
      }
    }
  }
};
</script>

<style scoped lang="less">
.content-container {
  border-radius: 12px;
}

.amount-item {
  border: 1px solid #e0e0e0;
  transition: all 0.3s;

  &.active {
    border-color: #F52735;
    background-color: #FFF7F7;
    color: #F52735;
  }
}

.recharge-button {
  .van-button {
    height: 44px;
    font-size: 16px;
  }
}
</style>
