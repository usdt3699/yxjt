<template>
  <div>
    <canvas
      ref="inviteCanvas"
      :width="347"
      :height="299"
      style="display:none"
    ></canvas>
    <img
      v-if="generatedCardUrl"
      :src="generatedCardUrl"
      class="w-full"
      alt="Invite Card"
    />
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import bgImage from '@/assets/img/invite/bg_qrcode.png';

export default  {
  name: 'InviteCardGenerator',

  props: {
    code: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    inviteCount: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      generatedCardUrl: null,
      backgroundImage: bgImage,
      canvasWidth: 347,
      canvasHeight: 299,
      generateCardDebounced: null,
    }
  },

  methods: {
    // 防抖函数，避免短时间内多次调用
    debounce(func, wait) {
      let timeout;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(context, args);
        }, wait);
      };
    },

    async generateCard() {
      try {
        // 确保canvas元素存在
        if (!this.$refs.inviteCanvas) return;

        const canvas = this.$refs.inviteCanvas;
        const ctx = canvas.getContext('2d');

        // 完全清空画布
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // 设置默认背景色
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // 加载并绘制背景图
        try {
          const bg = await this.loadImage(this.backgroundImage);
          ctx.drawImage(bg, 0, 0, this.canvasWidth, this.canvasHeight);
        } catch (error) {
          console.error('背景图加载失败:', error);
          // 背景图加载失败时使用纯色背景
          ctx.fillStyle = '#f5f5f5';
          ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        }

        // 生成并绘制二维码
        let qrCode;
        try {
          // 生成二维码数据 URL
          const qrCodeDataUrl = await this.generateQRCode();
          console.log('二维码生成成功，准备加载图片');

          // 直接创建图片对象并设置源
          qrCode = new Image();
          qrCode.src = qrCodeDataUrl;

          // 等待图片加载完成
          await new Promise((resolve, reject) => {
            qrCode.onload = resolve;
            qrCode.onerror = () => {
              console.error('二维码图片加载失败');
              resolve(); // 即使失败也继续流程
            };

            // 设置超时
            setTimeout(resolve, 1000);
          });
        } catch (error) {
          console.error('二维码生成失败:', error);
          // 二维码生成失败时创建一个占位图形
          ctx.fillStyle = '#eeeeee';
          const qrSize = 90;
          const qrX = 35;
          const qrY = (this.canvasHeight - qrSize) / 2 - 24;
          ctx.fillRect(qrX, qrY, qrSize, qrSize);

          // 在占位区域添加文字提示
          ctx.fillStyle = '#999999';
          ctx.font = '12px HarmonyOS Sans SC';
          ctx.textAlign = 'center';
          ctx.fillText('二维码', qrX + qrSize/2, qrY + qrSize/2);

          // 创建一个空的图像对象以继续流程
          qrCode = new Image();
          qrCode.width = qrSize;
          qrCode.height = qrSize;
        }

        // 调整二维码位置和大小 - 放在左侧框框中
        const qrSize = 90;
        const qrX = 35;  // 左边距
        const qrY = (this.canvasHeight - qrSize) / 2-24; // 垂直居中
        ctx.drawImage(qrCode, qrX, qrY, qrSize, qrSize);

        // 绘制邀请码文字
        ctx.font = '15px HarmonyOS Sans SC';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        const textX = 180; // 右侧文字起始位置
        const textY = this.canvasHeight / 2 - 60;
        ctx.fillText(`我的邀请码:${this.code}`, textX, textY);

        // 绘制底部文字
        const baseText = '当前已邀请';
        const countText = this.inviteCount.toString();
        const personText = '人';

        // 计算文本总宽度以实现居中
        ctx.font = '15px HarmonyOS Sans SC';
        const baseTextWidth = ctx.measureText(baseText).width;
        ctx.font = 'bold 23px HarmonyOS Sans SC';
        const countTextWidth = ctx.measureText(countText).width;
        ctx.font = '15px HarmonyOS Sans SC';
        const personTextWidth = ctx.measureText(personText).width;
        const totalWidth = baseTextWidth + countTextWidth + personTextWidth;

        // 计算起始x坐标以实现居中
        const startX = (this.canvasWidth - totalWidth) / 2;
        const bottomY = this.canvasHeight - 30; // 距离底部30px

        // 绘制"当前已邀请"
        ctx.font = '500 15px HarmonyOS Sans SC';
        ctx.fillStyle = '#373737';
        ctx.textAlign = 'left';
        ctx.letterSpacing = '0.9px';
        let currentX = startX;
        ctx.fillText(baseText, currentX, bottomY);
        currentX += baseTextWidth+10;

        // 绘制数字
        ctx.font = 'bold 23px HarmonyOS Sans SC';
        ctx.fillStyle = '#DF4C4C';
        ctx.fillText(countText, currentX, bottomY);
        currentX += countTextWidth+5;

        // 绘制"人"
        ctx.font = '500 15px HarmonyOS Sans SC';
        ctx.fillStyle = '#DF4C4C';
        ctx.fillText(personText, currentX, bottomY);

        // 生成最终图片
        this.generatedCardUrl = canvas.toDataURL('image/png');
        this.$emit('card-generated', this.generatedCardUrl);
      } catch (error) {
        console.error('生成邀请卡片失败:', error);
      }
    },

    loadImage(url) {
      return new Promise((resolve, reject) => {
        // 判断是否是对象类型，如果是对象则直接使用
        if (typeof url === 'object' && url !== null) {
          resolve(url);
          return;
        }

        // 如果是本地导入的图片模块，直接使用
        if (url && url.indexOf && url.indexOf('data:image') === 0) {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => {
            console.error('加载图片失败：数据图片格式');
            // 失败时仍然创建一个空图片对象，避免整个流程失败
            const fallbackImg = new Image();
            fallbackImg.width = 1;
            fallbackImg.height = 1;
            resolve(fallbackImg);
          };
          img.src = url;
          return;
        }

        try {
          const img = new Image();
          img.crossOrigin = 'anonymous'; // 允许跨域加载图片

          // 添加超时处理
          const timeout = setTimeout(() => {
            console.error('加载图片超时：', url);
            // 超时时仍然创建一个空图片对象
            const fallbackImg = new Image();
            fallbackImg.width = 1;
            fallbackImg.height = 1;
            resolve(fallbackImg);
          }, 5000); // 5秒超时

          img.onload = () => {
            clearTimeout(timeout);
            resolve(img);
          };

          img.onerror = (e) => {
            clearTimeout(timeout);
            console.error('加载图片失败：', url, e);
            // 失败时仍然创建一个空图片对象
            const fallbackImg = new Image();
            fallbackImg.width = 1;
            fallbackImg.height = 1;
            resolve(fallbackImg);
          };

          img.src = url;
        } catch (error) {
          console.error('创建图片对象失败：', error);
          // 异常时仍然创建一个空图片对象
          const fallbackImg = new Image();
          fallbackImg.width = 1;
          fallbackImg.height = 1;
          resolve(fallbackImg);
        }
      });
    },

    generateQRCode() {
      return new Promise((resolve, reject) => {
        try {
          // 创建一个临时div元素来生成二维码
          const tempDiv = document.createElement('div');
          tempDiv.style.position = 'absolute';
          tempDiv.style.top = '-9999px';
          tempDiv.style.left = '-9999px';
          document.body.appendChild(tempDiv);

          // 使用更安全的方式生成二维码
          try {
            new QRCode(tempDiv, {
              text: this.url || 'https://example.com', // 防止url为空
              width: 120,
              height: 120,
              colorDark: '#000000',
              colorLight: '#ffffff',
              correctLevel: QRCode.CorrectLevel.H
            });
          } catch (qrError) {
            console.error('生成二维码失败:', qrError);
            // 如果二维码生成失败，创建一个空白图像
            const canvas = document.createElement('canvas');
            canvas.width = 120;
            canvas.height = 120;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 120, 120);
            ctx.fillStyle = '#000000';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('二维码', 60, 60);
            resolve(canvas.toDataURL('image/png'));
            document.body.removeChild(tempDiv);
            return;
          }

          // 给一个合理的超时时间确保二维码图片已经生成
          const timeout = setTimeout(() => {
            console.warn('二维码生成超时，使用备用图像');
            // 超时后创建一个空白图像
            const canvas = document.createElement('canvas');
            canvas.width = 120;
            canvas.height = 120;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 120, 120);
            ctx.fillStyle = '#000000';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('二维码', 60, 60);
            resolve(canvas.toDataURL('image/png'));
            document.body.removeChild(tempDiv);
          }, 2000); // 2秒超时

          // 尝试获取生成的二维码图片
          setTimeout(() => {
            try {
              clearTimeout(timeout);
              const qrImage = tempDiv.querySelector('img');
              const qrCanvas = tempDiv.querySelector('canvas');

              if (qrImage && qrImage.src) {
                // 使用生成的图片
                resolve(qrImage.src);
              } else if (qrCanvas) {
                // 如果没有img但有canvas，使用canvas生成图片
                resolve(qrCanvas.toDataURL('image/png'));
              } else {
                // 如果都没有，创建一个空白图像
                const canvas = document.createElement('canvas');
                canvas.width = 120;
                canvas.height = 120;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, 120, 120);
                ctx.fillStyle = '#000000';
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('二维码', 60, 60);
                resolve(canvas.toDataURL('image/png'));
              }

              // 清理临时元素
              document.body.removeChild(tempDiv);
            } catch (error) {
              console.error('获取二维码图片失败:', error);
              // 失败时创建一个空白图像
              const canvas = document.createElement('canvas');
              canvas.width = 120;
              canvas.height = 120;
              const ctx = canvas.getContext('2d');
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, 120, 120);
              ctx.fillStyle = '#000000';
              ctx.font = '14px Arial';
              ctx.textAlign = 'center';
              ctx.fillText('二维码', 60, 60);
              resolve(canvas.toDataURL('image/png'));

              // 尝试清理临时元素
              try {
                document.body.removeChild(tempDiv);
              } catch (e) {
                console.warn('清理临时元素失败:', e);
              }
            }
          }, 200); // 给一个短暂停确保二维码生成
        } catch (error) {
          console.error('二维码生成过程中发生错误:', error);
          // 失败时创建一个空白图像
          const canvas = document.createElement('canvas');
          canvas.width = 120;
          canvas.height = 120;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, 120, 120);
          ctx.fillStyle = '#000000';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('二维码', 60, 60);
          resolve(canvas.toDataURL('image/png'));
        }
      });
    }
  },

  created() {
    // 创建防抖函数，避免频繁重绘导致的重影问题
    this.generateCardDebounced = this.debounce(this.generateCard, 200);
  },

  async mounted() {
    await this.generateCardDebounced();
  },

  watch: {
    code: {
      handler() {
        this.generateCardDebounced();
      }
    },
    url: {
      handler() {
        this.generateCardDebounced();
      }
    },
    inviteCount: {
      handler() {
        this.generateCardDebounced();
      }
    }
  }
}
</script>
