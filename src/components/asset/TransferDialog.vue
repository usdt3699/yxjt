<template>
  <van-popup
    v-model="show"
    round
    position="center"
    class="transfer-popup"
  >
    <div class="relative w-[90vw]">
      <img
        src="@/assets/img/bg_dialog.png"
        class="absolute top-0 left-0 w-full h-full object-cover"
      />

      <div class="relative z-10 px-4 py-6">
        <div class="text-center mb-6">
          <div class="text-[20px] font-medium text-[#333] mb-2">{{ asset?.name }}</div>
          <div class="text-[14px] text-[#666]">该平移/恢复名称</div>
        </div>

        <div class="bg-white/80 rounded-lg p-4 mb-6 space-y-4">
          <div class="text-[14px] text-[#666] flex justify-between">
            <span>资产编号：</span>
            <span class="text-[#333]">{{ asset?.goods_number }}</span>
          </div>

          <div class="text-[14px] text-[#666] flex justify-between">
            <span>有效平移/恢复日期：</span>
            <span class="text-[#333]">{{ asset?.expire_date }}</span>
          </div>

          <div class="text-[14px] text-[#666] flex justify-between">
            <span>资产平移/恢复至：</span>
            <span class="text-[#333]">越秀集团</span>
          </div>

          <div class="text-[14px] text-[#666] flex justify-between">
            <span>剩余平移/恢复额度：</span>
            <span class="text-[#333]">{{ balance|| 0 }}元</span>
          </div>

          <div class="mb-4">
            <div class="text-[14px] text-[#666] mb-2">
              平移/恢复资产:
              <!--              <span class="text-[#F23D30]">(平移手续费金额的0.001%)</span>-->
            </div>
            <div class="flex items-center rounded border border-[#E5E5E5] overflow-hidden">
              <input
                v-model="form.num"
                type="number"
                placeholder="请输入平移/恢复数量"
                class="flex-1 px-4 py-2 outline-none"
              />
              <div
                class="px-4 py-2 text-[#0580C0] cursor-pointer whitespace-nowrap"
                @click="handleFillAll"
              >
                全部
              </div>
            </div>
          </div>

        </div>

        <div class="flex space-x-4">
          <div
            class="flex-1 py-3 rounded-full text-[#fff] bg-[#434343] text-center cursor-pointer"
            @click="handleCancel"
          >
            取消
          </div>
          <div
            class="flex-1 py-3 rounded-full text-[#fff] bg-gradient-to-r from-[#0580C0] to-[#1663D6] text-center cursor-pointer"
            @click="handleConfirm"
          >
            立即平移/恢复
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { Toast, Popup } from "vant";

const FEE_RATE = 0.001; // 手续费率 0.001%

export default {
  name: "TransferDialog",
  components: {
    [Popup.name]: Popup,
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  data() {
    return {
      form: {
        num: "",
      },
      FEE_RATE,
    };
  },
  props: {
    value: Boolean,
    asset: {
      type: Object,
      default: () => ({}),
    },
    balance: {
      type: String,
      default: "0.00",
    },
  },
  methods: {
    handleCancel() {
      this.$emit("input", false);
      this.form.num = "";
    },
    validateForm() {
      if (!this.form.num) {
        Toast("请输入平移/恢复数量");
        return false;
      }
      if (isNaN(this.form.num) || this.form.num <= 0) {
        Toast("请输入有效的平移/恢复数量");
        return false;
      }
      if (
        this.asset?.remain_amount &&
        this.form.num > this.asset.remain_amount
      ) {
        Toast("平移/恢复数量不能超过剩余额度");
        return false;
      }
      return true;
    },
    calculateFee(amount) {
      if (!amount || isNaN(amount)) return 0;
      return ((amount * FEE_RATE) / 100).toFixed(2);
    },
    async handleConfirm() {
      if (!this.validateForm()) return;

      this.$emit("confirm", {
        id: this.asset.id,
        num: this.form.num,
      });
      this.form.num = "";
    },
    handleFillAll() {
      this.form.num = this.balance;
    },
  },
};
</script>

<style scoped>
.transfer-popup {
  border-radius: 16px;
  overflow: hidden;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 渐变背景按钮hover效果 */
.bg-gradient-to-r:hover {
  opacity: 0.9;
}
</style>
