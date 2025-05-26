<template>
  <div>
    <!-- 证书预览 -->
    <van-overlay :show="showPreview" @click="closePreview" class="certificate-preview-overlay">
      <div class="certificate-preview-container" @click.stop>
        <div class="certificate-preview-close" @click="closePreview">
          <van-icon name="cross" size="24" color="#fff" />
        </div>
        <div class="certificate-preview-content">
          <img :src="certificateImage" alt="创兴银行银联卡凭证" class="certificate-preview-image" v-if="certificateImage">
        </div>
        <div class="certificate-preview-footer">
          <div class="save-button" @click="saveCertificate">保存证书</div>
        </div>
      </div>
    </van-overlay>

    <!-- 隐藏的canvas元素用于生成证书图片 -->
    <canvas ref="certificateCanvas" style="display: none;"></canvas>
  </div>
</template>

<script>
import { Toast,  Icon, Overlay } from "vant";
import moment from "moment";

export default {
  name: "GoldCertificatePreview",
  components: {
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
  },
  props: {
    // 卡详情数据
    cardDetail: {
      type: Object,
      default: null
    },
    // 是否显示预览
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      certificateImage: null,
      showPreview: false
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
    // 监听cardDetail变化
    cardDetail(newVal) {
      if (newVal) {
        // 每次卡片数据变化时重置证书图片，强制重新生成
        this.certificateImage = null;
        if (this.show) {
          this.handleViewCertificate();
        }
      }
    }
  },
  methods: {
    // 关闭证书预览
    closePreview() {
      this.showPreview = false;
      this.$emit('update:show', false);
    },

    // 保存证书图片
    saveCertificate() {
      if (!this.certificateImage) {
        Toast('证书图片未生成');
        return;
      }

      // 创建一个临时链接
      const link = document.createElement('a');
      link.href = this.certificateImage;
      link.download = '创兴银行银联卡凭证.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Toast('证书保存成功');
    },

    // 处理查看证书
    handleViewCertificate() {
      console.log('查看银行卡凭证', this.cardDetail?.id);
      // 显示加载中提示
      Toast.loading({
        message: '图片生成中...',
        forbidClick: true,
        duration: 0
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
      console.log('开始绘制证书');
      const canvas = this.$refs.certificateCanvas;
      if (!canvas) {
        console.error('找不到canvas元素');
        return;
      }

      // 检查是否有卡详情数据
      if (!this.cardDetail) {
        console.error('没有卡详情数据');
        Toast.fail('获取卡详情失败，请重试');
        return;
      }
      
      // 输出完整的卡详情数据用于调试
      console.log('完整的卡详情数据:', JSON.stringify(this.cardDetail));

      // 设置高分辨率画布
      const dpr = window.devicePixelRatio || 1;
      // 使用证书模板原图大小 904 × 1280
      const width = 904 / 2; // 缩放到适合手机屏幕的尺寸
      const height = 1280 / 2;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      // 加载证书模板图片
      const certificateImg = new Image();
      certificateImg.onload = () => {
        console.log('证书模板图片加载完成');
        // 绘制证书背景
        ctx.drawImage(certificateImg, 0, 0, width, height);

        // 获取卡详情数据
        const cardInfo = this.cardDetail;
        const cardDetail = cardInfo.card_detail || {};
        console.log('卡详情数据:', cardDetail);
        
        // 如果没有card_detail数据，则直接使用cardInfo中的数据
        if (!cardDetail || Object.keys(cardDetail).length === 0) {
          console.log('使用备用数据源');
          // 如果没有real_name，则使用cardInfo中的real_name
          if (!cardDetail.real_name && cardInfo.real_name) {
            cardDetail.real_name = cardInfo.real_name;
          }
          // 如果没有created_at，则使用cardInfo中的created_at
          if (!cardDetail.created_at && cardInfo.created_at) {
            cardDetail.created_at = cardInfo.created_at;
          }
        }

        // 设置字体样式
        ctx.textAlign = 'left';

        // 绘制证书编号
        ctx.font = '11px "SimSun"';
        ctx.fillStyle = '#ff0000';
        ctx.fillText(cardDetail.certificate_num || '', width / 2 - 120, height / 3 - 18);
        
        // 绘制股东姓名
        ctx.font = '13px "SimSun"';
        ctx.fillStyle = '#000';
        // 股东姓名位置
        ctx.fillText(cardDetail.real_name || '', width / 2  - 120, height / 3 + 5);

      
        
        // 绘制兹证明后面的姓名
        ctx.font = '13px "SimSun"';
        ctx.fillStyle = '#000';
        ctx.fillText(cardDetail.real_name || '',  width / 2  - 108, height / 2 - 10); 



        // 绘制授予日期和签发日期（使用created_at）
        if (cardDetail.created_at) {
          try {
            const date = moment(cardDetail.created_at);
            if (date.isValid()) {
              // 格式化日期为 YYYY-MM-DD
              const formattedDate = date.format('YYYY-MM-DD');
              
              // 绘制授予日期
              ctx.font = '12px "SimSun"';
              ctx.fillStyle = '#000';
              ctx.fillText(formattedDate,  width / 2  - 120, height / 3 + 28); // 授予日期位置
              
              // 绘制签发日期
              ctx.fillText(formattedDate, width / 2 - 120, height - 122); // 签发日期位置
            }
          } catch (e) {
            console.error('日期解析错误:', e);
          }
        }

        // 保存绘制好的证书图片
        this.certificateImage = canvas.toDataURL('image/png');
        console.log('证书图片生成完成', this.certificateImage ? '成功' : '失败');
      };

      certificateImg.onerror = (error) => {
        console.error('图片加载失败:', error);
        Toast.fail('证书模板加载失败');
      };

      try {
        console.log('加载证书模板图片',this.cardDetail.stock_vip_level);
        if(this.cardDetail.stock_vip_level==1){
          certificateImg.src = require('../../assets/img/invite/gd/1.jpg');
        }
        else if(this.cardDetail.stock_vip_level==2){
          certificateImg.src = require('../../assets/img/invite/gd/2.jpg');
        }
        else if(this.cardDetail.stock_vip_level==3){
          certificateImg.src = require('../../assets/img/invite/gd/3.jpg');
        }

        console.log('开始加载证书模板图片');
      } catch (error) {
        console.error('加载证书模板图片失败:', error);
        Toast.fail('证书模板加载失败');
      }
    }
  }
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
  background: linear-gradient(149deg, #28D87D 14.44%, #01BD5D 87.25%);
  color: #FFF;
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 39.484px;
  cursor: pointer;
}
</style>
