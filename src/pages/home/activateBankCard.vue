<template>
  <div class="h-full w-full bg-[#F0F2F6]">
    <div class="overflow-y-auto w-full relative page-content-2">
      <!-- 顶部区域 -->
      <div class="relative">

        <div class="px-4 pt-8 relative z-10">
          <div class="text-white text-xl flex items-center">
            <van-icon
                name="arrow-left"
                size="24"
                color="#fff"
                class="mr-2"
                @click="$router.back()"
            />

          </div>

          <div class="mt-4">
            <bank-card-generator
                v-if="bankCardInfo"
                :card-data="bankCardInfo"
            />
            <img
                v-else
                src="@/assets/img/bg_bank_card.png"
                class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="mx-4 p-6 bg-white rounded-lg shadow-sm mt-4">
        <!-- 姓名输入 -->
        <div class="mb-6">
          <div class="text-[15px] mb-2">姓名</div>
          <input
              v-model="name"
              type="text"
              placeholder="输入姓名"
              class="w-full p-3 bg-[#F5F5F5] rounded-lg text-[14px] outline-none"
              :disabled="bankCardInfo?.status !== 0"
          />
        </div>

        <!-- 银行名称 -->
        <div class="mb-6">
          <div class="text-[15px] mb-2">银行名称</div>
          <input
              v-model="bankName"
              type="text"
              placeholder="输入银行名称"
              class="w-full p-3 bg-[#F5F5F5] rounded-lg text-[14px] outline-none"
              :disabled="bankCardInfo?.status !== 0"
          />
        </div>

        <!-- 银行卡号 -->
        <div class="mb-8">
          <div class="text-[15px] mb-2">银行卡号</div>
          <input
              v-model="cardNumber"
              type="text"
              @input="handleCardNumberInput"
              placeholder="输入银行卡号"
              class="w-full p-3 bg-[#F5F5F5] rounded-lg text-[14px] outline-none"
              :disabled="bankCardInfo?.status !== 0"
          />
        </div>

        <!-- 按钮 - 只在status为0或1时显示 -->
<!--        <button-->
<!--            v-if="bankCardInfo?.status !== 2"-->
<!--            @click="handleButtonClick"-->
<!--            :disabled="loading || bankCardInfo?.status === 3"-->
<!--            class="w-full py-3 text-white rounded-lg text-[15px] flex items-center justify-center"-->
<!--            :class="[loading || bankCardInfo?.status === 3 ? 'bg-gray-400' : 'bg-[#F23D30]']"-->
<!--        >-->
<!--          <van-loading v-if="loading" size="20px" color="#fff" class="mr-1"/>-->
<!--          {{ buttonText }}-->
<!--        </button>-->
      </div>
    </div>

    <!-- 支付弹窗 -->
    <payment-dialog
        v-model="showPayment"
        :amount="298"
        @confirm="handlePayConfirm"
    />
  </div>
</template>

<script>
import {Icon as VanIcon, Loading as VanLoading, Toast,} from 'vant';
import axios from "@/net/axios";
import api from "@/net/api";
import BankCardGenerator from "@/pages/home/bankCardGenerator.vue";
import PaymentDialog from '@/components/common/PaymentDialog.vue';
import {mapState} from "vuex";

export default {
  name: "activateBankCard",
  components: {
    VanIcon,
    VanLoading,
    BankCardGenerator,
    PaymentDialog
  },
  data() {
    return {
      name: '',
      bankName: '',
      cardNumber: '',
      loading: false,
      bankCardInfo: null,
      showPayment: false
    }
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    buttonText() {
      if (this.loading) return '提交中...';
      switch (this.bankCardInfo?.status) {
        case 0:
          return '绑定黑金卡';
        case 1:
          return '激活黑金卡 ￥298';
        case 3:
          return '审核中';
        default:
          return '绑定黑金卡';
      }
    }
  },
  mounted() {
    this.getBankCardInfo();
  },
  methods: {
    handleCardNumberInput(e) {
      // 只允许输入数字
      this.cardNumber = e.target.value.replace(/\D/g, '');
    },

    validateForm() {
      if (!this.name.trim()) {
        Toast('请输入持卡人姓名');
        return false;
      }
      if (!this.bankName.trim()) {
        Toast('请输入银行名称');
        return false;
      }
      if (!this.cardNumber || this.cardNumber.length < 16) {
        Toast('请输入正确的银行卡号');
        return false;
      }
      return true;
    },

    async handleButtonClick() {
      if (this.bankCardInfo?.status === 1) {
        this.showPayment = true;
        return;
      }

      if (this.userInfo.recommend_identify_num <= 1) {
        await this.$dialog.alert({
          message: '邀请2人实名注册即可绑定成功',
          confirmButtonText: '去邀请',
        });
        this.$router.push({name: 'userInvite'});
        return;
      }

      if (!this.validateForm()) return;

      this.loading = true;

      try {
        await axios.post(api.editBankOrderSec, {
          real_name: this.name.trim(),
          bank_name: this.bankName.trim(),
          bank_no: this.cardNumber,
          type: 1,
          id: this.bankCardInfo.id,
        });

        await this.$dialog.alert({
          title: '提示',
          message: '绑定成功',
          confirmButtonText: '确定',
          showCancelButton: false
        });

        this.$router.back();
      } catch (err) {
        this.$dialog.alert({
          title: '提示',
          message: err.msg || '绑定失败，请重试'
        });
      } finally {
        this.loading = false;
      }
    },

    async handlePayConfirm({payType}) {
      const params = {
        pay_type: payType,
        source: 4,
        amount: 298,
      }

      try {
        const loading = Toast.loading({
          message: '处理中...',
          forbidClick: true,
        });

        const res = await axios.post(api.balancePay, params);
        loading.clear();

        if (res.data.url) {
          window.location.href = res.data.url;
        } else {
          await this.$dialog.alert({
            title: '提示',
            message: '激活成功！',
            theme: 'round-button',
            confirmButtonText: '确定',
            confirmButtonColor: '#F52735'
          });
          this.showPayment = false;
          this.getBankCardInfo();
        }
      } catch (err) {
        Toast(err.msg || '支付失败，请重试');
      }
    },

    getBankCardInfo() {
      axios.get(api.myBankOrder, {params: {type: 1}})
          .then(res => {
            this.bankCardInfo = res.data;
            // 优先使用 bankCardInfo 的 real_name，如果没有则使用 userInfo 的 real_name
            this.name = this.bankCardInfo?.real_name || this.userInfo?.real_name || '';
            this.bankName = this.bankCardInfo?.bank_name || '';
            this.cardNumber = this.bankCardInfo?.bank_no || '';
          })
          .catch(err => {
            console.log('获取银行卡信息失败', err);
          });
    }
  }
}
</script>

<style scoped>
.page-content-2 {
  min-height: 100vh;
  padding-bottom: 20px;
}
</style>
