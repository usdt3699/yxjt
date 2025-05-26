<template>
  <div>
    <canvas ref="idCardCanvas" :width="internalWidth" :height="internalHeight" style="display:none"></canvas>
    <img v-if="generatedCardUrl" :src="generatedCardUrl" class="card-image" alt="Generated Bank Card" />
  </div>
</template>

<script>
export default {
  props: {
    cardData: {
      type: Object,
      required: true
    },
    backgroundImg: {
      type: String,
      required: true
    },
    cardWidth: {
      type: Number,
      default: 280
    },
    cardHeight: {
      type: Number,
      default: 176
    }
  },
  data() {
    return {
      generatedCardUrl: null,
      // 内部使用3倍分辨率渲染
      scale: 3,
      internalWidth: 0,
      internalHeight: 0
    }
  },
  created() {
    // 计算内部渲染尺寸
    this.internalWidth = this.cardWidth * this.scale;
    this.internalHeight = this.cardHeight * this.scale;
  },
  methods: {
    async generateIdCard() {
      const canvas = this.$refs.idCardCanvas;
      const ctx = canvas.getContext('2d');
      const s = this.scale; // 缩放因子

      // 加载背景图片
      const bgImg = await this.loadImage(this.backgroundImg);
      ctx.drawImage(bgImg, 0, 0, this.internalWidth, this.internalHeight);

      // 创建渐变效果
      const createGradient = (x, y, width, height) => {
        const gradient = ctx.createLinearGradient(x * s, y * s, x * s, (y + height) * s);
        gradient.addColorStop(0, '#FFF');
        gradient.addColorStop(0.5417, '#FFF');
        gradient.addColorStop(1, '#fff');
        return gradient;
      };

      // 设置文字阴影效果
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 1.256 * s;
      ctx.shadowOffsetX = 0.314 * s;
      ctx.shadowOffsetY = 0.314 * s;

      // 设置卡号样式 - 字体大小也要按比例放大
      ctx.font = `400 ${14 * s}px "HarmonyOS Sans"`;
      ctx.letterSpacing = `${2.683 * s}px`;

      // 格式化卡号 (每4位加空格)
      const formattedCardNo = this.cardData.bank_no.replace(/(\d{4})/g, '$1 ').trim();

      // 使用渐变填充文字 - 坐标也要按比例放大
      const cardNoGradient = createGradient(20, 115, 200, 20);
      ctx.fillStyle = cardNoGradient;
      ctx.fillText(formattedCardNo, 22 * s, 120 * s);

      // 设置姓名样式
      const nameGradient = createGradient(20, 145, 100, 20);
      ctx.fillStyle = nameGradient;
      ctx.fillText(this.cardData.name, 20 * s, 160 * s);

      // 设置有效期样式
      const expireGradient = createGradient(120, 136, 80, 20);
      ctx.fillStyle = expireGradient;
      ctx.fillText(this.cardData.expire_at, 100 * s, 140 * s);

      // 重置阴影
      ctx.shadowColor = 'rgba(207, 207, 207, 1)';
      ctx.shadowOffsetX = -0.314 * s;
      ctx.shadowOffsetY = -0.314 * s;
      ctx.shadowBlur = 1.256 * s;

      // 生成最终图片URL
      this.generatedCardUrl = canvas.toDataURL('image/png');
      this.$emit('card-generated', this.generatedCardUrl);
    },
    loadImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    }
  },
  mounted() {
    if (this.cardData && this.backgroundImg) {
      this.generateIdCard();
    }
  },
  watch: {
    cardData: {
      handler() {
        if (this.cardData && this.backgroundImg) {
          this.generateIdCard();
        }
      },
      deep: true
    },
    backgroundImg: {
      handler() {
        if (this.cardData && this.backgroundImg) {
          this.generateIdCard();
        }
      }
    }
  }
}
</script>

<style scoped>
.card-image {
  width: 280px;
  height: 176px;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@font-face {
  font-family: 'HarmonyOS Sans';
  src: url('https://cdn.jsdelivr.net/gh/lxgw/LxgwWenKai@latest/dist/LXGWWenKai-Regular.ttf') format('truetype');
  /* 使用开源的霞鹜文楷作为HarmonyOS Sans的替代，因为HarmonyOS Sans需要授权 */
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
</style>
