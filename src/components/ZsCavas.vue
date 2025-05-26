<template>
  <div>
    <!-- 证书预览 -->
    <van-overlay
      :show="showPreview"
      @click="closePreview"
      class="certificate-preview-overlay"
    >
      <div class="certificate-preview-container" @click.stop>
        <div class="certificate-preview-close" @click="closePreview">
          <van-icon name="cross" size="24" color="#fff" />
        </div>
        <div class="certificate-preview-content">
          <img
            :src="certificateImage"
            alt="创兴银行银联卡凭证"
            class="certificate-preview-image"
            v-if="certificateImage"
          />
        </div>
        <div class="certificate-preview-footer">
          <div class="save-button" @click="saveCertificate">保存证书</div>
        </div>
      </div>
    </van-overlay>

    <!-- 隐藏的canvas元素用于生成证书图片 -->
    <canvas ref="certificateCanvas" style="display: none"></canvas>
  </div>
</template>

<script>
import { Toast, Icon, Overlay } from "vant";

export default {
  name: "ActivityCertificatePreview",
  components: {
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
  },
  props: {
    // 卡详情数据
    userInfo: {
      type: Object,
      default: null,
    },
    // 是否显示预览
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      certificateImage: null,
      showPreview: false,
    };
  },
  watch: {
    // 监听show属性变化
    show(newVal) {
      if (newVal) {
        // 每次显示时重置证书图片，强制重新生成
        this.certificateImage = null;
        this.handleViewCertificate();
      } else {
        this.showPreview = false;
      }
    },
    // 监听userInfo变化
    userInfo(newVal) {
      if (newVal) {
        // 每次卡片数据变化时重置证书图片，强制重新生成
        this.certificateImage = null;
        if (this.show) {
          this.handleViewCertificate();
        }
      }
    },
  },
  methods: {
    // 关闭证书预览
    closePreview() {
      this.showPreview = false;
      this.$emit("update:show", false);
    },

    // 保存证书图片
    saveCertificate() {
      if (!this.certificateImage) {
        Toast("证书图片未生成");
        return;
      }

      // 创建一个临时链接
      const link = document.createElement("a");
      link.href = this.certificateImage;
      link.download = "会员证.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Toast("证书保存成功");
    },

    // 处理查看证书
    handleViewCertificate() {
      // 显示加载中提示
      Toast.loading({
        message: "图片生成中...",
        forbidClick: true,
        duration: 0,
      });

      // 每次都重新生成证书图片
      this.drawCertificate();

      // 使用setTimeout确保图片生成完成后再显示预览
      setTimeout(() => {
        // 关闭加载提示
        Toast.clear();
        // 显示预览
        this.showPreview = true;
      }, 500); // 给予足够的时间让图片渲染完成
    },

    // 绘制证书
    drawCertificate() {
      console.log("开始绘制证书");
      const canvas = this.$refs.certificateCanvas;
      if (!canvas) {
        console.error("找不到canvas元素");
        return;
      }

      // 检查是否有卡详情数据
      if (!this.userInfo) {
        console.error("没有卡详情数据");
        Toast.fail("获取卡详情失败，请重试");
        return;
      }

      // 设置高分辨率画布
      const dpr = window.devicePixelRatio || 1;
      const width = 1587; // 缩放到适合手机屏幕的尺寸
      const height = 2245;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);

      // 加载证书模板图片
      const certificateImg = new Image();
      certificateImg.onload = () => {
        console.log("证书模板图片加载完成");
        // 绘制证书背景
        ctx.drawImage(certificateImg, 0, 0, width, height);

        // 获取卡详情数据
        const cardInfo = this.userInfo;

        ctx.textAlign = "left";
        ctx.font = 'bold 50px "SimSun"';
        ctx.textAlign = "left";
        ctx.fillStyle = "#000";

        ctx.fillText(cardInfo.real_name || cardInfo.name || "", 360, 720);
        ctx.fillText(Number(cardInfo.stock_sales_num) || "", 700, 900);

        ctx.fillText("2025", 840, 1800);
        ctx.fillText("05", 1040, 1800);
        ctx.fillText("20", 1170, 1800);

        // 保存绘制好的证书图片
        this.certificateImage = canvas.toDataURL("image/png");
      };

      certificateImg.onerror = (error) => {
        console.error("图片加载失败:", error);
        Toast.fail("证书模板加载失败");
      };

      try {
        certificateImg.src = require("../assets/img/gqzs.jpg");
        console.log("开始加载证书模板图片");
      } catch (error) {
        console.error("加载证书模板图片失败:", error);
        Toast.fail("证书模板加载失败");
      }
    },
  },
};
</script>

<style scoped lang="less">
.certificate-preview-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 10;
}

.certificate-preview-container {
  position: relative;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.certificate-preview-close {
  position: absolute;
  top: -40px;
  right: 0;
  z-index: 10;
  cursor: pointer;
}

.certificate-preview-content {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.certificate-preview-image {
  width: 100%;
  height: auto;
  display: block;
}

.certificate-preview-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

/* 保存按钮 */
.save-button {
  width: 154px;
  height: 39.484px;
  flex-shrink: 0;
  border-radius: 5px;
  background: linear-gradient(149deg, #28d87d 14.44%, #01bd5d 87.25%);
  color: #fff;
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 39.484px;
  cursor: pointer;
}
</style>
