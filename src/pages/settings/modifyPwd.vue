<template>
  <div class="page-container h-screen">
    <nav-bar
      :title="title"
      left-text=""
      left-arrow
      @click-left="onClickLeft"
      :safe-area-inset-top="true"
      class="w-full"
      :border="false"
    />
    <div class="flex-grow overflow-hidden w-full">
      <div class="overflow-y-auto h-full">
        <form
          @submit="onSubmit"
          class="rounded-sm bg-white p-2 m-2"
        >
          <field
            v-model="account"
            type="text"
            name="account"
            label="手机号"
            placeholder="请输入手机号"
            :center="true"
            input-align="right"
          />
          <field
            v-model="idCardNo"
            type="text"
            name="idCardNo"
            label="身份证号"
            placeholder="请输入身份证号"
            :center="true"
            input-align="right"
          />
          <field
            v-model="password"
            type="password"
            name="password"
            label="新密码"
            placeholder="请输入新密码"
            :center="true"
            input-align="right"
          />
          <field
            v-model="repassword"
            type="password"
            name="repassword"
            label="确认密码"
            placeholder="请再次输入新密码"
            :center="true"
            input-align="right"
          />
          <div class="mt-8 mb-2 mx-2">
            <Button
              round
              block
              type="info"
              color="#F91126"
              native-type="submit"
            >确定</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { Button, Field, NavBar } from "vant";
import axios from "@/net/axios";
import api from "@/net/api";
import { isNullOrEmpty } from "@/utils";
import { mapState } from "vuex";

export default {
  components: { NavBar, Button, Field },

  data() {
    return {
      title: this.$route.meta.title,
      password: "",
      account: "",
      repassword: "",
      idCardNo: "",
    };
  },
  computed: {
    ...mapState("user", ["userInfo"]),
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    validateIdCard(idCard) {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      return reg.test(idCard);
    },
    onSubmit(event) {
      event.preventDefault();
      const { password, account, repassword, idCardNo } = this;
      if (isNullOrEmpty(account)) {
        this.$toast("请输入手机号");
        return;
      }
      if (isNullOrEmpty(idCardNo)) {
        this.$toast("请输入身份证号");
        return;
      }
      if (!this.validateIdCard(idCardNo)) {
        this.$toast("请输入正确的身份证号");
        return;
      }
      if (isNullOrEmpty(password)) {
        this.$toast("请输入新密码");
        return;
      }
      if (isNullOrEmpty(repassword)) {
        this.$toast("请再次输入新密码");
        return;
      }

      if (password != repassword) {
        this.$toast("两次输入的密码不一致");
        this.password = "";
        this.repassword = "";
        return;
      }
      this.$toast.loading({
        message: "提交中...",
        forbidClick: true,
      });
      axios
        .post(api.modifyPwd, {
          account,
          password,
          re_password: repassword,
          id_card_no: idCardNo,
        })
        .then(() => {
          this.$toast.clear();
          this.$toast("修改成功,请重新登陆");
          this.$store.commit("tabs/ACCOUNT_LOGOUT_FAILURE", true);
        })
        .catch((err) => {
          this.$toast.clear();
          err.msg && this.$toast(err.msg);
        });
    },
  },
};
</script>

<style scoped lang="less">
</style>
