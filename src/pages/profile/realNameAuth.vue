<template>
  <div class="h-full w-full flex flex-col">


    <!-- 背景图 -->
    <img
      src="@/assets/img/profile/transfer-bg.png"
      class="absolute top-0 left-0 w-full h-[100vh] object-cover"
    />
    <div class="relative z-30">
      <img
        src="@/assets/img/profile/shield.png"
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
          <div class="text-[20px] font-medium text-[#333]">实名认证</div>
        </div>
        <img
          src="@/assets/img/title_line.png"
          class="w-[120px] h-[3px] mb-2 ml-[28px]"
        />
        <div class="text-[14px] text-gray-600 ml-[28px]">补全身份信息，保障账号安全</div>

      </div>

      <!-- 内容区域 -->
      <div class="bg-white rounded-lg p-4 mt-6">

        <p class="text-gray-700 mb-6">请您使用有效身份证信息认证</p>

        <form @submit.prevent="onSubmit">
          <div class="mb-6">
            <label class="block text-gray-700 text-sm mb-2">真实姓名</label>
            <input
              v-model="realname"
              type="text"
              class="w-full p-3 bg-gray-50 rounded"
              placeholder="请输入真实姓名"
              :readonly="isAuth"
            >
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm mb-2">证件号码</label>
            <input
              v-model="idcard"
              type="text"
              class="w-full p-3 bg-gray-50 rounded"
              placeholder="请输入身份证号码"
              :readonly="isAuth"
            >
          </div>

          <div class="mt-4 text-gray-500 text-sm flex items-center">
            <img
              src="@/assets/img/profile/info-circle.png"
              alt="Info"
              class="w-4 h-4 mr-2"
            >
            <span>实名仅用于您是否为真人用户，不会对信息做任何采集与保留，请放心使用。</span>
          </div>

          <div
            class="mt-8"
            v-if="!isAuth"
          >
            <div
              class="submit-button"
              @click="onSubmit"
            >确认</div>
          </div>
          <div
            class="mt-8"
            v-if="isAuth"
          >
            <div class="submit-button disabled">已通过认证</div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import axios from "@/net/axios";
import api from "@/net/api";
import { isNullOrEmpty } from "@/utils";
import Coupon from "@/components/Coupon.vue";

export default {
  components: {  Coupon },
  computed: {
    ...mapState("user", ["identifyInfo"]),
    title() {
      return "实名认证";
    },
  },
  watch: {
    identifyInfo(newVal) {
      if (newVal) {
        this.isAuth = newVal.status == 1 || newVal.status == 2;
        this.realname = newVal.name;
        this.idcard = newVal.id_card_no;
      }
    },
  },
  mounted() {
    this.getIdentifyInfo();
  },
  data() {
    return {
      idcard: "",
      realname: "",
      isAuth: false,
    };
  },
  methods: {
    ...mapActions("user", ["getIdentifyInfo"]),
    onClickLeft() {
      this.$router.go(-1);
    },
    onSubmit() {

      if (isNullOrEmpty(this.realname)) {
        this.$toast("请输入真实姓名");
        return;
      }
      // const regName = /^[\u4e00-\u9fa5]+·?[\u4e00-\u9fa5]+$/;
      // if (!regName.test(this.realname)) {
      //   this.$toast("真实姓名填写有误!");
      //   return;
      // }
      if (isNullOrEmpty(this.idcard)) {
        this.$toast("请输入身份证号码");
        return;
      }
      // const regExp = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;
      // if (!regExp.test(this.idcard)) {
      //   this.$toast("身份证号填写有误!");
      //   return;
      // }
      this.$toast.loading({
        message: "提交中...",
        forbidClick: true,
      });
      axios
        .post(api.realAuth, {
          id_card_no: this.idcard,
          name: this.realname,
        })
        .then(() => {
          this.$toast.clear();
          this.getIdentifyInfo();
          this.$dialog.alert({
            message: '实名认证提交成功',
            confirmButtonText: '确定'
          }).then(() => {
            this.$router.go(-1);
          });
        })
        .catch((err) => {
          this.$toast.clear();
          err.msg && this.$toast(err.msg);
        });
    },

  },
};
</script>

<style scoped>
.submit-button {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  background: linear-gradient(90deg, #ff6a57, #f23d30);
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
