<template>
  <div class="min-h-screen relative overflow-y-auto">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common2.png" alt="背景" class="w-full">
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <TitleBar :logoSrc="require('@/assets/img/home/yuexiu_logo.png')" @back="$router.back()" />
        <!-- 内容区域 -->
        <div class="content-wrapper">
          <!-- 标题 -->
          <div class="page-title">完税证明</div>

          <!-- 税收证明图片 -->
          <div class="tax-certificate-container">
            <canvas ref="taxCanvas" @click="previewTaxImage" class="tax-canvas"></canvas>
            <img v-if="taxImageUrl" :src="taxImageUrl" class="hidden" ref="taxTemplateImage" @load="imageLoaded" alt="税收证明模板" />
          </div>
        </div>
      </div>
      <!-- 图片预览 -->
      <van-image-preview
        v-model="showImagePreview"
        :images="previewImages"
        :start-position="previewIndex"
        :show-indicators="false"
      />
    </div>
  </div>
</template>

<script>
import {Button, Dialog, Icon, ImagePreview, Loading, Overlay} from "vant";
import TitleBar from "@/components/common/TitleBar.vue";
import moment from "moment";

export default {
  name: "PropertyCertificate",
  components: {
    TitleBar,
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  data() {
    return {
      pageLoading: false,
      showImagePreview: false,
      previewImages: [],
      previewIndex: 0,
      price: 0,
      no: '',
      taxes_pay_time: '',
      taxImageUrl: require('@/assets/img/tax/tax_template.png'),
      taxCanvasWidth: window.innerWidth * 0.9, // 初始宽度为屏幕宽度的90%
      taxCanvasHeight: 0, // 高度会根据图片比例自动计算
    };
  },

  mounted() {
    this.getRouteParams();
    window.addEventListener('resize', this.handleResize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    getRouteParams() {
      // 获取路由参数
      if (this.$route.query) {
        this.price = this.$route.query.taxes_pay_amount || 0;
        this.no = this.$route.query.no || '';
        this.taxes_pay_time = this.$route.query.taxes_pay_time || '';

        // 在参数获取完成后调用绘制方法
        this.$nextTick(() => {
          // 检查模板图片是否已加载
          if (this.$refs.taxTemplateImage && this.$refs.taxTemplateImage.complete) {
            this.drawTaxCertificate();
          }
        });
      }
    },

    // 绘制税收证明
    drawTaxCertificate() {
      // 检查是否已获取到参数
      if (!this.$refs.taxCanvas || !this.$refs.taxTemplateImage) {
        return; // 如果还没有准备好，则不进行绘制
      }

      const canvas = this.$refs.taxCanvas;
      const ctx = canvas.getContext('2d');
      const img = this.$refs.taxTemplateImage;

      // 原图比例 1500:1040 约等于 1.44:1
      const originalRatio = 1040/1500;

      // 设置canvas宽度为屏幕宽度
      this.taxCanvasWidth = window.innerWidth;
      this.taxCanvasHeight = this.taxCanvasWidth * originalRatio;

      canvas.width = this.taxCanvasWidth;
      canvas.height = this.taxCanvasHeight;

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制模板图片
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 设置文字样式
      ctx.fillStyle = '#7E7EDD';
      const fontSize = Math.max(canvas.width * 6 / 1500, 6); // 保持原字体大小
      ctx.font = `700 ${fontSize}px Jura`;

      // 格式化日期 - 确保格式为"2025年2月15日"
      let formattedDate = moment(this.taxes_pay_time).format('YYYY年M月DD日');

      // 更精确地调整坐标位置 - 这些坐标需要根据实际模板图片进行微调

      // 1. 填发日期
      const dateX = canvas.width * 460 / 1500+58;
      const dateY = canvas.height * 538 / 1040-76;
      ctx.fillText(formattedDate, dateX, dateY);

      // 2. 税务机关
      const taxOrgX = canvas.width * 730 / 1500+66;
      const taxOrgY = canvas.height * 538 / 1040-76;
      ctx.fillText("国家税务总局嘉兴市税务分局", taxOrgX, taxOrgY);

       // 3. 税号
      const taxNoX = canvas.width * 210 / 1500-30;
      const taxNoY = canvas.height * 614 / 1040-16;
      ctx.fillText(this.no, taxNoX, taxNoY);

      // 3. 税种
      const taxTypeX = canvas.width * 210 / 1500+43;
      const taxTypeY = canvas.height * 614 / 1040-16;
      ctx.fillText("人民币", taxTypeX, taxTypeY);

      // 4. 品名名称
      const productNameX = canvas.width * 320 / 1500+73;
      const productNameY = canvas.height * 614 / 1040-16;
      ctx.fillText("契税", productNameX, productNameY);

      // 5. 税款所属时期
      const taxPeriodX = canvas.width * 505 / 1500+70;
      const taxPeriodY = canvas.height * 614 / 1040-16;
      ctx.fillText(formattedDate, taxPeriodX, taxPeriodY);

      // 5. 入(退)库日期
      const taxInX = canvas.width * 505 / 1500+130;
      const taxInY = canvas.height * 614 / 1040-16;
      ctx.fillText(formattedDate, taxInX, taxInY);

      // 6. 实缴(退)金额
      const actualAmountX = canvas.width * 700 / 1500+145;
      const actualAmountY = canvas.height * 614 / 1040-16;
      ctx.fillText(`¥${this.price}`, actualAmountX, actualAmountY);

      // 7. 金额合计（大写）
      const amountInWordsX = canvas.width * 160 / 1500+20;
      const amountInWordsY = canvas.height * 806 / 1040-16;
      const chineseAmount = this.convertToChinese(this.price || 0);
      ctx.fillText(`(大写) ${chineseAmount}`, amountInWordsX, amountInWordsY);

      // 8. 金额合计右侧表格的金额
      const totalAmountX = canvas.width * 700 / 1500+145;
      const totalAmountY = canvas.height * 806 / 1040-16;
      ctx.fillText(`¥${this.price}`, totalAmountX, totalAmountY);

      // 9. 备注
      const remarkX = canvas.width * 530 / 1500+68;
      const remarkY = canvas.height * 850 / 1040-8;
      ctx.fillText("正常申报一般申报正税自行申报国家税务总局嘉兴市税务分局", remarkX, remarkY);

      
    },

    // 添加中文大写金额转换方法
    convertToChinese(num) {
      if (num === 0) return "零元整";

      const digitCN = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
      const unitCN = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟'];
      const decimals = ['角', '分'];

      let result = '';
      let numStr = num.toString();

      // 处理整数部分
      if (numStr.indexOf('.') === -1) numStr += '.00';
      const parts = numStr.split('.');
      const intPart = parts[0];
      const decimalPart = parts[1];

      // 处理整数
      if (parseInt(intPart, 10) > 0) {
        let zeroFlag = false;
        for (let i = 0; i < intPart.length; i++) {
          const n = parseInt(intPart[i], 10);
          const pos = intPart.length - i - 1;

          if (n === 0) {
            zeroFlag = true;
          } else {
            if (zeroFlag) {
              result += digitCN[0];
              zeroFlag = false;
            }
            result += digitCN[n] + unitCN[pos];
          }
        }
        result += '元';
      }

      // 处理小数
      if (decimalPart) {
        const decLen = Math.min(decimalPart.length, 2);

        for (let i = 0; i < decLen; i++) {
          const n = parseInt(decimalPart[i], 10);
          if (n > 0) {
            result += digitCN[n] + decimals[i];
          }
        }
      }

      if (result.endsWith('元')) {
        result += '整';
      }

      return result;
    },

    // 预览图片
    previewTaxImage() {
      // 将canvas转为图片URL
      const dataUrl = this.$refs.taxCanvas.toDataURL('image/png');
      this.previewImages = [dataUrl];
      this.previewIndex = 0;
      this.showImagePreview = true;
    },

    // 窗口大小变化时重新绘制canvas
    handleResize() {
      this.$nextTick(() => {
        this.drawTaxCertificate();
      });
    },

    // 添加图片加载完成的处理方法
    imageLoaded() {
      // 图片加载完成后，检查参数是否已获取
      if (this.price || this.no || this.taxes_pay_time) {
        // 如果已经有参数，则进行绘制
        this.drawTaxCertificate();
      }
    }
  },
};
</script>

<style scoped lang="less">
.content-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url('~@/assets/img/certificate/info_bg.png') no-repeat center/cover;
  min-height: 100vh;
  padding-bottom: 20px;
}

.page-title {
  color: #1F1F1F;
  font-family: "HarmonyOS Sans SC";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.9px;
  margin: 20px 0;
  text-align: center;
}

.tax-certificate-container {
  width: 100%;
  margin: 0 auto;
  padding: 0;
  display: flex;
  justify-content: center;
}

.tax-canvas {
  width: 100%;
  height: auto;
  cursor: pointer;
}

.hidden {
  display: none;
}

.top-bg-image {
  width: 100%;
  height: auto;
  margin-top: 20px;
}

.certificate-image {
  width: 90%;
  height: auto;
  margin: 20px auto 0;
  position: relative;
  z-index: 2;
}

.info-container {
  width: 90%;
  margin: 15px auto;
  padding: 15px;
  border-radius: 5px;
  background-color: #fff;
}

.price-text {
  color: #734126;
  font-family: "HarmonyOS Sans SC";
  font-size: 15px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 1.9px;
  margin-bottom: 15px;
}

.submit-btn {
  display: flex;
  width: 299px;
  height: 44px;
  padding: 4.339px;
  justify-content: center;
  align-items: center;
  gap: 4.339px;
  margin: 0 auto;
  border: none;
  border-radius: 5.207px;
  background: linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%);
}

.btn-text {
  color: #F7F7F8;
  text-align: center;
  font-family: "HarmonyOS Sans SC";
  font-size: 17.356px;
  font-weight: 500;
  line-height: 17.356px;
}

.content-container {
  overflow: hidden;
  margin-top: 0;
  position: relative;
}

.house-title {
  color: #1F1F1F;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.9px;
}

.project-name {
  color: #F33;
  text-align: right;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.3px;
}

.content-title {
  color: #1F1F1F;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.content-text {
  color: #333;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 14px;
  line-height: 1.6;
  padding: 0 10px;
}

/* 添加图片样式 */
.content-text :deep(img) {
  max-width: 100%;
  height: auto;
  cursor: pointer;
}

.house-layout-image {
  width: 100%;
  text-align: center;
}

.title-container {
  width: 92.712px;
  height: 30px;
  flex-shrink: 0;
  background: linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%);
  text-align: center;
  border: 1px solid rgba(195, 159, 122, 0.13);
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.25));
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin: 16px 0 8px;
  position: relative;
  z-index: 1;
}

.group-title {
  color: #FFF;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: rgba(195, 159, 122, 0.13);
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 17px;
  font-weight: 500;
  letter-spacing: -0.3px;
}

.intro-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}
</style>
