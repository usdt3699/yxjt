<template>
  <van-popup
    v-model="show"
    position="bottom"
    round
    @close="onClose"
    class="bank-card-dialog"
  >
    <div class="dialog-content">
      <!-- 关闭按钮 -->
      <van-icon
        name="cross"
        class="close-icon"
        @click="onClose"
      />

      <!-- 标题 -->
      <div class="title">已审核通过</div>

      <!-- 副标题 -->
      <div class="subtitle">审核通过需缴纳押金</div>

      <!-- 金额和提示信息卡片 -->
      <div class="info-card">
        <div class="amount">
          <span class="currency">¥</span>
          <span class="number">199.00</span>
        </div>
        <div class="fee-text">需支付押金</div>

        <div class="tips">
          小贴士：
          <div class="tip-content">小贴士： 缴纳会员名额登记押金，此押金是为了防止不法分子恶意哄骗名额，从而谋取非法利益。让真正的家人没有名额可领！此押金会在25个工作日内自动返还到您的支付账户中。</div>
        </div>
      </div>

      <!-- 支付按钮 -->
      <van-button
        block
        class="pay-button"
        @click="handlePay"
      >
        立即支付
      </van-button>
    </div>
  </van-popup>
</template>

<script>
import { Popup, Button, Icon } from "vant";
import { mapState } from "vuex";

export default {
  name: "AddMemberConfirmDialog",
  components: {
    [Popup.name]: Popup,
    [Button.name]: Button,
    [Icon.name]: Icon,
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
  },
  props: {
    value: Boolean,
    amount: {
      type: [Number, String],
      default: 0,
    },
  },
  methods: {
    onClose() {
      this.show = false;
    },
    handlePay() {
      this.show = false;
      this.$emit("confirm");
    },
  },
};
</script>

<style scoped>
.bank-card-dialog {
  max-height: 80vh;
}

.dialog-content {
  padding: 24px 16px;
  text-align: center;
  position: relative;
  background: #eaf7ff;
}

.close-icon {
  position: absolute;
  left: 16px;
  top: 16px;
  font-size: 20px;
  color: #323233;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #2570eb;
}

.subtitle {
  width: 80%;
  margin: 0 auto 24px;
  padding: 0px 20px;
  font-size: 16px;
  color: #323233;
}

.info-card {
  width: 90%;
  margin: 0 auto 24px;
  padding: 20px;
  background: #ffffff;
  box-shadow: 0px 7px 22px 0px rgba(0, 84, 223, 0.14);
  border-radius: 15px;
}

.amount {
  margin: 0;
}

.currency {
  font-size: 20px;
  color: #f52735;
  font-weight: 500;
}

.number {
  font-size: 32px;
  color: #f52735;
  font-weight: 600;
}

.fee-text {
  font-size: 14px;
  color: #969799;
  margin-bottom: 20px;
}

.tips {
  background: #f7f8fa;
  padding: 12px;
  border-radius: 8px;
  text-align: left;
  font-size: 14px;
  color: #323233;
}

.tip-content {
  color: #969799;
  margin-top: 4px;
  line-height: 1.4;
}

.pay-button {
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  background: #1989fa;
  border: none;
  border-radius: 4px;
  color: #fff;
}
</style>
