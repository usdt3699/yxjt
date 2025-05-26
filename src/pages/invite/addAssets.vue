<template>
  <div class="h-full w-full flex flex-col">
    <!-- 背景图 -->
    <img
      src="@/assets/img/bg_assets.png"
      class="absolute top-0 left-0 w-full h-[100vh] object-cover"
    />

    <van-overlay
      :show="pageLoading"
      class="flex items-center justify-center z-50"
    >
      <van-loading
        type="spinner"
        color="#fff"
        size="36"
        vertical
      >加载中...
      </van-loading>
    </van-overlay>

    <!-- 自定义标题区域 -->
    <div class="relative z-10 flex flex-col px-4 pt-[44px]">
      <div class="flex flex-col">
        <div class="flex items-center mb-2">
          <van-icon
            name="arrow-left"
            size="20"
            class="mr-2"
            @click="$router.back()"
          />
          <div class="text-[20px] font-medium text-[#333]">资产平移/恢复</div>
        </div>
        <img
          src="@/assets/img/title_line.png"
          class="w-[120px] h-[3px] mb-6 ml-[28px]"
        />
      </div>

      <div class="bg-white rounded-lg p-4">
        <!--        <div class="mb-4">-->
        <!--          <div class="text-gray-600 mb-2">基本信息</div>-->
        <!--          <van-field-->
        <!--            v-model="form.content"-->
        <!--            placeholder="请填写基本信息"-->
        <!--            class="bg-gray-50 rounded"-->
        <!--          />-->
        <!--        </div>-->

        <div class="mb-6">
          <div class="text-gray-600 mb-2">录入平移/恢复平台名称</div>
          <van-field
            v-model="form.name"
            placeholder="请输入平移/恢复名称"
            class="bg-gray-50 rounded"
          />
        </div>

        <div
          class="h-[44px] rounded-full gradient-btn flex items-center justify-center cursor-pointer"
          @click="handleSubmit"
        >
          <span class="text-white text-[16px]">立即平移/恢复</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog, Icon, Loading, Overlay, Toast } from "vant";
import axios from "@/net/axios";
import api from "@/net/api";
import { mapActions, mapState } from "vuex";

export default {
  name: "addAssets",
  components: {
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Toast.name]: Toast,
    [Dialog.name]: Dialog,
  },
  computed: {
    ...mapState("user", ["userInfo"]),
  },
  data() {
    return {
      pageLoading: false,
      form: {
        name: "",
        content: "",
      },
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    async handleSubmit() {
      if (!this.form.name.trim()) {
        Dialog.alert({
          message: "请输入资产平移/恢复名称",
          confirmButtonColor: "#0066FF",
        });
        return;
      }

      if (this.userInfo?.bank_card_status == 0) {
        this.$dialog
          .alert({
            title: "提示",
            message: "先领取银行卡",
          })
          .then(() => {
            this.$router.push({ name: "bankCard" });
          });
        return;
      }

      try {
        this.pageLoading = true;
        const res = await axios.post(api.assetAdd, {
          name: this.form.name,
          content: "",
        });

        await Dialog.alert({
          message: res.msg || "提交成功",
          confirmButtonColor: "#0066FF",
        });

        this.$router.back();
      } catch (error) {
        Dialog.alert({
          message: error.msg || "提交失败",
          confirmButtonColor: "#0066FF",
        });
      } finally {
        this.pageLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.van-icon {
  color: #333;
}

.gradient-btn {
  background: linear-gradient(90deg, #ff0000, #ff0000);
  transition: opacity 0.2s;
}

.gradient-btn:active {
  opacity: 0.8;
}
</style>
