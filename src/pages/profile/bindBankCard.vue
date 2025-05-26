<template>
  <div class="h-full w-full flex flex-col">
    <!-- 背景图 -->
    <img
      src="@/assets/img/profile/transfer-bg.png"
      class="absolute top-0 left-0 w-full h-[100vh] object-cover"
    />
    <div class="relative z-30">
      <img
        src="@/assets/img/profile/bank_shield.png"
        class="absolute right-4 top-10 w-[50px]"
      />
    </div>
    <!-- 自定义标题区域 -->
    <div class="relative z-10 flex flex-col px-4 pt-[20px]">
      <div class="flex flex-col">
        <div class="flex items-center mb-2">
          <van-icon
            name="arrow-left"
            size="20"
            class="mr-2"
            @click="onClickLeft"
          />
          <div class="text-[20px] font-medium text-[#333]">绑定银行卡</div>
        </div>
        <img
          src="@/assets/img/title_line.png"
          class="w-[120px] h-[3px] mb-2 ml-[28px]"
        />
        <div class="text-[14px] text-gray-600 ml-[28px]">完善银行卡信息，方便个人收款</div>
      </div>

      <!-- 内容区域 -->
      <div class="bg-white rounded-lg p-4 mt-6">
        <p class="text-red-500 text-sm mb-6">为了您的资金安全，核实银行卡，姓名，银行卡信息，一旦填实，不能自行修改！</p>

        <form @submit.prevent="onSubmit">
          <div class="mb-6">
            <label class="block text-gray-700 text-sm mb-2">持卡人姓名</label>
            <input
              v-model="realname"
              type="text"
              class="w-full p-3 bg-gray-50 rounded"
              placeholder="请输入持卡人姓名"
            >
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm mb-2">开户行</label>
            <input
              v-model="bankname"
              type="text"
              class="w-full p-3 bg-gray-50 rounded"
              placeholder="请输入开户行"
              :readonly="isBind"
            >
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm mb-2">银行卡号</label>
            <input
              v-model="bankcode"
              type="number"
              class="w-full p-3 bg-gray-50 rounded"
              placeholder="请输入银行卡号"
              :readonly="isBind"
              maxlength="19"
              @input="validateBankCode"
            >
          </div>

          <div class="mt-4 text-gray-500 text-sm flex items-center">
            <img
              src="@/assets/img/profile/info-circle.png"
              alt="Info"
              class="w-4 h-4 mr-2"
            >
            <span>请确保填写信息准确无误，银行卡信息提交后不可修改。</span>
          </div>

          <div
            class="mt-8"
            v-if="!isBind"
          >
            <div
              class="submit-button"
              @click="onSubmit"
            >确认</div>
          </div>
          <div
            class="mt-8"
            v-if="isBind"
          >
            <div class="submit-button disabled">已绑定银行卡</div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { Button, Field, NavBar, Dialog } from "vant";
import axios from "@/net/axios";
import api from "@/net/api";
import { WithdrawalType } from "@/config";
import { isNullOrEmpty } from "@/utils";

export default {
  components: { NavBar, Button, Field },
  computed: {
    ...mapState("user", ["bankCardInfo", "identifyInfo"]),
  },
  created() {
    // 注册Dialog
    this.$dialog = Dialog;
  },
  watch: {
    identifyInfo(newVal, oldVal) {
      if (newVal&&!this.realname) {
        this.realname = newVal.name;
      }
    },
    bankCardInfo(newVal, oldVal) {
      if (newVal) {
        this.isBind = newVal.status == 1 || newVal.status == 2;
        this.bankname = newVal.bank_name;
        this.bankcode = newVal.bank_no;
        this.bank_address = newVal.bank_address;
        this.realname = newVal.real_name;
      }
    },
  },
  mounted() {
    this.getIdentifyInfo();
    this.getBankCardInfo();
  },
  data() {
    return {
      title: this.$route.meta.title,
      WithdrawalType,
      bankname: "",
      realname: "",
      bankcode: "",
      bank_address: "",
      isBind: false,
    };
  },
  methods: {
    ...mapActions("user", ["getBankCardInfo", "getIdentifyInfo"]),
    onClickLeft() {
      this.$router.go(-1);
    },
    onSubmit(event) {
      event.preventDefault();
      const { bankname, realname, bankcode, bank_address } = this;

      if (isNullOrEmpty(bankname)) {
        this.$toast("请输入银行名称");
        return;
      }
      const regBankName = /^[\u4e00-\u9fa5]{2,20}$/;
      if (!regBankName.test(this.bankname)) {
        this.$toast("银行名称填写有误!");
        return;
      }
      if (isNullOrEmpty(bankcode)) {
        this.$toast("请输入银行卡号");
        return;
      }
      // if (isNullOrEmpty(bank_address)){
      //   this.$toast("请输入开户支行");
      //   return
      // }
      this.$toast.loading({
        message: "提交中...",
        forbidClick: true,
      });
      axios
        .post(api.bindBankCard, {
          bank_name: bankname,
          real_name: realname,
          bank_no: bankcode,
          bank_address: bank_address,
        })
        .then((res) => {
          this.$toast.clear();

          this.$dialog.alert({
            title: "提示",
            message: "银行卡绑定成功",
            theme: "round-button",
            confirmButtonText: "确定",
          })
              .then(() => {
                this.onClickLeft();
              });
        })
        .catch((err) => {
          this.$toast.clear();
          err.msg && this.$toast(err.msg);
        });
    },
    validateBankCode(value) {
      // 移除非数字字符
      this.bankcode = value.replace(/\D/g, "");
    },
  },
};
</script>

<style scoped>
.submit-button {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  background: linear-gradient(90deg, #FF6A57, #F23D30);
  color: #fff;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.submit-button.disabled {
  background: #d1d4d8;
  cursor: not-allowed;
}

input {
  height: 48px;
  border: 1px solid #eee;
}

input:focus {
  outline: none;
  border-color: #0580c0;
}
</style>
