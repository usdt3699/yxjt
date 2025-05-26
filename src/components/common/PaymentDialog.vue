<template>
  <div class="payment-dialog-container">
    <van-popup
      v-model="show"
      position="bottom"
      round
      class="payment-dialog"
      :overlay-style="{ zIndex: 20000 }"
      :z-index="20001"
      :safe-area-inset-bottom="!isIPhoneSafari"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-medium">选择支付方式</span>
          <van-icon name="cross" @click="onClose" />
        </div>

        <div class="amount-info bg-[#F8F8F8] p-3 rounded-lg mb-4">
          <div class="text-sm text-gray-500 mb-1">支付金额</div>
          <template v-if="coupon">
            <div class="flex items-center justify-between">
              <span class="text-gray-500">商品金额</span>
              <span class="line-through text-gray-400">¥{{ amount }}</span>
            </div>
            <div class="flex items-center justify-between text-sm mt-1">
              <span class="text-[#F52735]">优惠券抵扣</span>
              <span class="text-[#F52735]">-¥{{ coupon.coupon_num }}</span>
            </div>
            <div class="h-[1px] bg-gray-200 my-2"></div>
            <div class="flex items-center justify-between">
              <span>实付金额</span>
              <span class="text-xl font-bold text-[#F52735]"
                >¥{{ actualAmount }}</span
              >
            </div>
          </template>
          <template v-else>
            <div class="text-xl font-bold text-[#F52735] mt-1">
              ¥{{ amount }}
            </div>
          </template>

          <div class="text-sm text-gray-500 mb-1" v-if="tip">
            {{ tip }}
          </div>
        </div>

        <van-radio-group v-model="selectedPayType">
          <van-loading v-if="configLoading" class="py-8 text-center" />
          <van-cell-group v-else class="rounded-lg overflow-hidden">
            <van-cell
              v-for="item in filteredPaymentList"
              :key="item.id"
              clickable
              :title="item.name"
              @click="selectedPayType = item.id"
              class="flex items-center"
              v-show="item.is_show != 'balance_enable' || balance_enable"
            >
              <template #icon>
                <img :src="item.icon" class="h-5 mr-2" />
              </template>
              <template #right-icon>
                <van-radio :name="item.id" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>

        <div class="mt-4">
          <van-button
            round
            block
            color="#F52735"
            :loading="loading"
            @click="onConfirm"
          >
            确认支付
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Cell, CellGroup, Radio, RadioGroup, Popup, Button, Icon } from "vant";
import { mapState } from "vuex";
import axios from "@/net/axios";
import api from "@/net/api";

export default {
  name: "PaymentDialog",

  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [Icon.name]: Icon,
  },

  props: {
    value: Boolean,
    amount: {
      type: [Number, String],
      default: 0,
    },
    tip: {
      type: String,
    },
    balance_enable: {
      type: Boolean,
      default: true,
    },
    coupon: {
      type: Object,
      default: null,
    },
    showBalancePayment: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      isIPhoneSafari: false,
      selectedPayType: "union_a",
      channel_type: 1,
      loading: false,
      systemConfig: {},
      paymentList: [
        {
          id: "union_a",
          name: "银联",
          icon: require("@/assets/img/payment/union.png"),
          type: 3,
          is_show: "yun_pay_enable",
          channel_type: 1,
        },
        {
          id: "union_b",
          name: "银联",
          icon: require("@/assets/img/payment/union.png"),
          type: 3,
          is_show: "b_yun_pay_enable",
          channel_type: 2,
        },
        {
          id: "alipay_a",
          name: "支付宝",
          icon: require("@/assets/img/payment/alipay.png"),
          type: 2,
          is_show: "alipay_enable",
          channel_type: 1,
        },
        {
          id: "alipay_b",
          name: "支付宝",
          icon: require("@/assets/img/payment/alipay.png"),
          type: 2,
          is_show: "b_alipay_enable",
          channel_type: 2,
        },
        {
          id: "wxpay_a",
          name: "微信支付",
          icon: require("@/assets/img/payment/wxpay.png"),
          type: 1,
          is_show: "wechat_enable",
          channel_type: 1,
        },
        {
          id: "wxpay_b",
          name: "微信支付",
          icon: require("@/assets/img/payment/wxpay.png"),
          type: 1,
          is_show: "b_wechat_enable",
          channel_type: 2,
        },
        {
          id: "bank",
          name: "银行卡",
          icon: require("@/assets/img/payment/alipay.png"),
          type: 5,
          is_show: "bank_enable",
        },
        {
          id: "balance",
          name: "余额支付",
          icon: require("@/assets/img/payment/yue.png"),
          type: 9,
          is_show: "balance_enable",
        },
      ],
      configLoading: false,
    };
  },

  computed: {
    ...mapState("systemInfo", ["systemInfo"]),

    show: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },

    filteredPaymentList() {
      return this.paymentList.filter((item) => {
        // 如果是余额支付，则根据showBalancePayment属性决定是否显示
        if (item.type === 9) {
          return (
            this.showBalancePayment && this.systemConfig[item.is_show] == 1
          );
        }
        // 其他支付方式按照原来的逻辑
        return this.systemConfig[item.is_show] == 1;
      });
    },

    actualAmount() {
      if (!this.coupon) return this.amount;
      const result = (
        Number(this.amount) - Number(this.coupon.coupon_num)
      ).toFixed(2);
      return result > 0 ? result : "0.00"; // 防止出现负数
    },
  },

  mounted() {
    this.detectIPhoneSafari();
  },

  watch: {
    show: {
      immediate: true,
      async handler(val) {
        if (val) {
          await this.getSystemConfig();
        }
      },
    },
  },

  methods: {
    detectIPhoneSafari() {
      const ua = navigator.userAgent;
      // 检测是否是iPhone上的Safari浏览器
      this.isIPhoneSafari =
        /iPhone/i.test(ua) &&
        /Safari/i.test(ua) &&
        !/Chrome/i.test(ua) &&
        !/CriOS/i.test(ua);
    },

    onClose() {
      this.show = false;
    },

    async onConfirm() {
      this.loading = true;
      try {
        const selectedPayment = this.paymentList.find(
          (item) => item.id === this.selectedPayType
        );

        this.$emit("confirm", {
          pay_type: selectedPayment?.type || 3,
          channel_type: selectedPayment?.channel_type || null,
        });
      } finally {
        this.loading = false;
      }
    },

    async getSystemConfig() {
      this.configLoading = true;
      try {
        const res = await axios.get(api.systemInfo);
        if (res.data) {
          this.systemConfig = res.data;
        }
      } catch (error) {
        console.log("获取支付配置失败:", error);
      } finally {
        this.configLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.payment-dialog-container {
  position: relative;
  z-index: 99999;
}

.payment-dialog {
  max-height: 90vh;
  overflow-y: auto;
}

.amount-info {
  border-radius: 8px;
}
</style>
