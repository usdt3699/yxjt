<template>
  <div class="page-container h-screen bg">
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
      <div class="overflow-y-auto h-full p-4">
        <div class="bg-white rounded-lg p-4 shadow-md">
          <div class="mb-4">
            <h2 class="text-lg font-bold flex items-center">
              <span
                class="w-6 h-6 bg-red-500 rounded-full flex text-sm items-center justify-center text-white mr-2"
                >收</span
              >
              配送信息
            </h2>
            <div class="mt-2 text-base">
              <div class="flex justify-between">
                <span>姓名: {{ data.name }}</span>
                <span>电话: {{ data.phone }}</span>
              </div>
              <div class="mt-1">地址: {{ data.address }}</div>
              <div class="mt-1">
                制卡进度: <span style="color: #207cf5">银行卡发货中</span>
              </div>
            </div>
          </div>

          <div class="border-t pt-4">
            <div class="flex items-center text-sm text-gray-600 mb-2">
              <img
                src="@/assets/img/dividend/sf-logo.png"
                alt="顺丰快递"
                class="w-6 h-6 mr-2"
              />
              顺丰快递 YT747801928452256
            </div>

            <div class="relative">
              <div
                class="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200"
              ></div>
              <div class="space-y-4">
                <TimelineItem
                  date="07-06 20:29"
                  title="申请制卡"
                  :description="`申请制卡${data.title}`"
                />
                <TimelineItem
                  date="07-06 21:29"
                  title="审核通过"
                  :description="`审核通过正在制作${data.title}`"
                />
                <TimelineItem
                  date="07-06 21:29"
                  title="已发货"
                  description="包裹正在等待揽收"
                />
                <TimelineItem
                  date="07-06 21:29"
                  title="已揽件"
                  :active="true"
                  description="您的快递在【上海】已揽收，揽收人：郑海"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { NavBar } from "vant";
import axios from "@/net/axios";
import api from "@/net/api";
import { isNullOrEmpty } from "@/utils";
import TimelineItem from "@/components/TimelineItem";

export default {
  components: { NavBar, TimelineItem },
  data() {
    return {
      title: this.$route.meta.title,
      data: this.$route.query,
    };
  },

  methods: {
    ...mapActions("user", ["getUserInfo"]),
    onClickLeft() {
      this.$router.go(-1);
    },
    onSubmit() {
      const { phone, name, address } = this;
      if (isNullOrEmpty(name)) {
        this.$toast("请输入收货人");
        return;
      }

      if (isNullOrEmpty(phone)) {
        this.$toast("请输入手机号");
        return;
      }

      if (isNullOrEmpty(address)) {
        this.$toast("请输入收货地址");
        return;
      }
      this.$toast.loading({
        message: "提交中...",
        forbidClick: true,
      });
      axios
        .post(api.receivepost, {
          id: this.$route.query.id,
          phone,
          name,
          address,
        })
        .then((res) => {
          this.$toast.clear();
          this.$toast("提交成功");
          this.onClickLeft();
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
.page-container /deep/ .van-field__label {
  font-weight: bold;
}
.van-nav-bar {
  background-color: transparent;
}

.van-nav-bar /deep/ .van-nav-bar__title {
  color: #fff;
}

.bg {
  background-image: url("../../assets/img/dividend/bg-yhk.png");
  background-size: 100% auto;
  background-repeat: no-repeat;
}
</style>
