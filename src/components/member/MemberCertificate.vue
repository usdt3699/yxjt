<template>
  <div class="h-full w-full overflow-y-auto bg-gray-100">
    <!-- Loading overlay -->
    <van-overlay
        :show="pageLoading"
        class="flex items-center justify-center z-50"
    >
      <van-loading
          type="spinner"
          color="#fff"
          size="36"
          vertical
      >加载中...</van-loading>
    </van-overlay>

    <!-- 会员证书图片 -->
    <img
        :src="certificateImage"
        v-if="certificateImage"
        class="w-full h-auto"
    />

    <!-- 用于生成图片的 canvas，但不显示 -->
    <canvas
        ref="certificateCanvas"
        class="hidden"
        :width="750"
        :height="1625"
    ></canvas>
  </div>
</template>
<script>
import { Loading, Overlay, Toast } from "vant";
import axios from "@/net/axios";
import api from "@/net/api";

export default {
  name: "MemberCertificate",
  components: {
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
  },

  data() {
    return {
      loading: false,
      pageLoading: false,
      userInfo: {},
      identifyInfo: {},
      certificateImage: "",
    };
  },


  created() {
    this.loadMore();
  },

  methods: {
    async loadMore() {
      if (this.loading) return;
      this.loading = true;
      this.pageLoading = true;

      try {
        const res = await axios.get(api.userInfo);
        const resId = await axios.get(api.identifyInfo)

        if (res||resId) {
          this.userInfo = res?.data?.userInfo;
          this.identifyInfo = resId?.data||{};
          this.generateCertificateImage();
        }
      } catch (err) {
        Toast(err.msg || "加载失败");
      } finally {
        this.loading = false;
        this.pageLoading = false;
      }
    },

    async generateCertificateImage() {
      const canvas = this.$refs.certificateCanvas;
      const ctx = canvas.getContext("2d");

      // 加载背景图
      const bgImage = new Image();
      bgImage.src = require("@/assets/img/member/bg.png");

      await new Promise((resolve) => {
        bgImage.onload = resolve;
      });

      // 绘制背景
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

      // 设置文字样式
      ctx.textAlign = "center";
      ctx.fillStyle = "#FF0000";
      ctx.font = "bold 48px Arial";

      // 调整所有内容的起始Y坐标
      const contentStartY = 650; // 增加顶部起始位置
      const lineHeight = 60;

      // 绘制标题
      ctx.fillText("越秀集团会员证书", canvas.width / 2, contentStartY);

      // 绘制欢迎文本
      ctx.font = "36px Arial";
      ctx.fillStyle = "#000";
      ctx.fillText(
          "恭喜您，成为越秀集团正式会员！",
          canvas.width / 2,
          contentStartY + 80
      );

      // 绘制会员信息
      ctx.textAlign = "left";
      ctx.font = "32px Arial";
      const startY = contentStartY + 180; // 调整会员信息起始位置

      ctx.fillText(
          `会员信息                      编码：ZT${this.userInfo.code}`,
          100,
          startY
      );
      ctx.fillText(`会员姓名：${this.identifyInfo.name|| "未设置"}`, 100, startY + lineHeight);
      ctx.fillText(
          `身份证号：${this.identifyInfo.id_card_no || "未设置"}`,
          100,
          startY + lineHeight * 2
      );

      ctx.fillStyle = "#FF0000";
      ctx.fillText(
          `每月工资：${this.userInfo.is_member === 1 ? "已激活" : "未激活"}`,
          100,
          startY + lineHeight * 3
      );

      // 绘制会员权益
      ctx.fillStyle = "#000";
      ctx.font = "28px Arial";

      // 将长文本分成两行
      ctx.fillText(
          "正式会员权益：每月初始工资18万元，按月每",
          100,
          startY + lineHeight * 4
      );
      ctx.fillText(
          "月增长8万元。并且可以优先成为越秀集团股",
          100,
          startY + lineHeight * 5
      );
      ctx.fillText("东。", 100, startY + lineHeight * 6);

      // 加载印章图片
      const stampImage = new Image();
      stampImage.src = require("@/assets/img/gz.png");

      await new Promise((resolve) => {
        stampImage.onload = resolve;
      });

      // 绘制印章
      ctx.drawImage(
          stampImage,
          canvas.width - 300,
          startY + lineHeight * 6, // 调整印章位置
          200,
          200
      );

      // 绘制日期
      ctx.textAlign = "left";
      ctx.fillText("印章：", canvas.width - 400, startY + lineHeight * 7);
      const date =
          this.userInfo.created_at?.split(" ")[0]?.replace(/-/g, "年") + "日" ||
          "2025年01月02日";
      ctx.fillText(
          `日期：${date}`,
          canvas.width - 400,
          startY + lineHeight * 8
      );

      // 生成图片 URL
      this.certificateImage = canvas.toDataURL("image/png");
    },
  },
};
</script>

<style scoped lang="less">
.custom-loading {
  :deep(.van-pull-refresh__head) {
    .van-loading {
      .van-loading__spinner {
        color: #fff !important;
      }

      .van-loading__text {
        color: #fff !important;
      }
    }

    .van-pull-refresh__text {
      color: #fff !important;
    }
  }
}
</style>
