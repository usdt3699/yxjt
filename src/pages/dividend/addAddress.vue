<template>
  <div class="page-container h-screen  bg">
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
        <div class="rounded-sm bg-white p-2 m-2">
          <field
              v-model="name"
              name="name"
              label="收货人"
              placeholder="请输入收货人"
              :center="true"
              input-align="right"
          />
          <field
              v-model="phone"
              name="phone"
              label="手机号"
              placeholder="请输入手机号"
              :center="true"
              input-align="right"
          />
          <field
              v-model="address"
              name="address"
              label="地址"
              placeholder="请输入详细地址"
              :center="true"
              input-align="right"
          />
          <div class="mt-8 mb-2 mx-2" >
            <button class="rounded bg-primary py-2 text-white w-full" @click="onSubmit">提交</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import {mapActions} from "vuex";
import {Field, NavBar} from "vant";
import axios from "@/net/axios";
import api from "@/net/api";
import {isNullOrEmpty} from "@/utils";

export default {
  components: { NavBar,  Field},
  data() {
    return {
      title: this.$route.meta.title,
      phone: "",
      name: "",
      address: "",
    }
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    onClickLeft() {
      this.$router.go(-1);
    },
    onSubmit() {
      const {phone, name,address} = this;
      if (isNullOrEmpty(name)) {
        this.$toast("请输入收货人");
        return
      }

      if (isNullOrEmpty(phone)) {
        this.$toast("请输入手机号");
        return
      }

      if (isNullOrEmpty(address)) {
        this.$toast("请输入收货地址");
        return
      }
      this.$toast.loading({
        message: "提交中...",
        forbidClick: true,
      });
      axios.post(api.receivepost, {
        id:this.$route.query.id,
        phone,
        name,
        address,
      }).then((res) => {
        this.$toast.clear();
        this.$toast("提交成功");
        this.onClickLeft();
      }).catch((err) => {
        this.$toast.clear();
        err.msg && this.$toast(err.msg);
      });
    },
  },

}
</script>

<style scoped lang="less">
.page-container /deep/ .van-field__label{
  font-weight: bold;
}
.van-nav-bar {
  background-color: transparent;
}

.van-nav-bar /deep/ .van-nav-bar__title {
  color: #fff;
}

.bg {
  background-image: url('../../assets/img/dividend/bg-yhk.png');
  background-size: 100% auto;
  background-repeat: no-repeat;
}
</style>
