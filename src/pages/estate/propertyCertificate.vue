<template>
  <div class="min-h-screen relative overflow-y-auto">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common2.png" alt="背景" class="w-full">
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <TitleBar :logoSrc="require('@/assets/img/home/yuexiu_logo.png')" @back="$router.back()" />
        <!-- 内容区域 -->
        <div class="content-wrapper">
          <!-- 顶部背景图(包含文字) -->
           <img v-if="status>2" src="@/assets/img/certificate/top_bg.png" class="top-bg-image" alt="通知背景">

          <!-- 产权证书图片 -->
          <img
            v-if="status <= 2"
            :src="getCertificateImage"
            class="certificate-image"
            alt="产权证书"
            @click="handleCertificateClick"
          >
          <!-- status>2时使用canvas生成的图片 -->
          <img
            v-else
            :src="generatedCertificateImage"
            class="certificate-image"
            alt="产权证书"
            @click="handleCertificateClick"
          >

          <!-- 底部信息区域 -->
          <div class="info-container" >
            <p class="price-text" v-if="status <= 2">说明：需缴纳{{ price }}元即可领取不动产权证，该产权登记费用为房管局收取，和越秀集团无关。越秀集团已为家人们争取了免费的领取方式。</p>
            <button class="submit-btn" @click="handleButtonClick">
              <span class="btn-text">{{ buttonText }}</span>
            </button>
          </div>
        </div>
      </div>
      <!-- 图片预览 -->
      <van-overlay :show="showImagePreview" @click="showImagePreview = false" class="certificate-preview-overlay">
        <div class="certificate-preview-container" @click.stop>
          <div class="certificate-preview-close" @click="showImagePreview = false">
            <van-icon name="cross" size="24" color="#fff" />
          </div>
          <div class="certificate-preview-content">
            <img :src="status <= 2 ? getCertificateImage : generatedCertificateImage" alt="产权证书" class="certificate-preview-image">
          </div>
          <div class="certificate-preview-footer">
            <div class="save-button" @click="saveCertificate">保存证书</div>
          </div>
        </div>
      </van-overlay>

      <!-- 隐藏的canvas元素用于生成证书图片 -->
      <canvas ref="certificateCanvas" style="display: none;"></canvas>
    </div>

    <payment-dialog
      v-model="showPayment"
      :amount="price"
      :coupon="null"
      @confirm="handlePayConfirm"
    />

  </div>
</template>

<script>
import {Button, Dialog, Icon, ImagePreview, Loading, Overlay, Toast} from "vant";
import TitleBar from "@/components/common/TitleBar.vue";
import {mapActions} from "vuex";
import PaymentDialog from "@/components/common/PaymentDialog.vue";
import axios from "@/net/axios";
import api from "@/net/api";
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
    PaymentDialog,
  },
  data() {
    return {
      pageLoading: false,
      certificateId: '',
      price: 300, // 默认值，实际从路由参数获取
      showImagePreview: false,
      previewImages: [],
      previewIndex: 0,
      status: 2,
      real_name: '',
      pay_time: '',
      fix_asset_num: '',
      fix_asset_long_num: '',
      showPayment: false,
      generatedCertificateImage: null,
      certificateImages: {
        '1': require('@/assets/img/certificate/certificate_1.png'),
        '2': require('@/assets/img/certificate/certificate_2.png'),
        '3': require('@/assets/img/certificate/certificate_3.png'),
        '4': require('@/assets/img/certificate/certificate_4.png'),
      },
    };
  },

  computed: {
    getCertificateImage() {
      return this.certificateImages[this.$route.query.typeId] || ''
    },
    buttonText() {
      // return this.status === 2 ? '立即缴纳' : '查看完税证明'
      return this.status === 2 ? '立即缴纳' : '保存证书'
    }
  },

  mounted() {
    this.getSystemInfo();
    this.getRouteParams();

    // 如果status > 2，生成证书图片
    if (this.status > 2) {
      this.$nextTick(() => {
        this.drawCertificate();
      });
    }
  },

  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),
    getRouteParams() {
      // 获取路由参数
      if (this.$route.query) {
        this.certificateId = this.$route.query.id || '';
        this.typeId = this.$route.query.typeId || '';
        this.price = this.$route.query.price || 0;
        this.status = this.$route.query.status ||2;
        this.real_name = this.$route.query.real_name || '';
        this.pay_time = this.$route.query.taxes_pay_time || '';
        this.fix_asset_num = this.$route.query.fix_asset_num || '';
        this.fix_asset_long_num = this.$route.query.fix_asset_long_num || '';
        this.needPop = this.$route.query.needPop || false;
        // 从内容中解析出图片
        this.extractImages();
        if(this.needPop){
         setTimeout(()=> this.showImagePreview=true,1000)
        }
      }
    },
    async getAssetList(id) {
      try {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
        });
        const res = await axios.get(api.myHouseOrderList, {params: {page: 1, size: 100}});
        this.assetList = res.data.list
        if (id) {
          const item = this.assetList.find(item => item.id === id);
          this.status = item.status;
          this.pay_time = this.$route.query.taxes_pay_time || '';
          this.fix_asset_num = this.$route.query.fix_asset_num || '';
          this.fix_asset_long_num = this.$route.query.fix_asset_long_num || '';
          this.drawCertificate();
          setTimeout(() => {
            // 显示图片预览
            this.showImagePreview = true;
          }, 1000);

        }
      } catch (error) {
        Dialog.alert({
          title: "提示",
          message: error.msg || "获取失败",
          confirmButtonText: "确定",
          confirmButtonColor: "#F23D30",
        });
      } finally {
        this.$toast.clear()
      }
    },
    // 从内容中提取图片URL
    extractImages() {
      const imgRegex = /<img.*?src="(.*?)".*?>/g;
      let images = [];
      let match;

      while ((match = imgRegex.exec(this.houseContent)) !== null) {
        images.push(match[1]);
      }

      this.previewImages = images;
    },

    handleCustomerService() {
      if (this.systemInfo?.customerService) {
        window.location.href = this.systemInfo.customerService;
      }
    },

    async handleButtonClick() {
      if(this.status === 2) {
        // // 检查实名认证
        // if (!this.userInfo?.is_identify) {
        //   await Dialog.alert({
        //     message: "请先完成实名认证",
        //     confirmButtonText: "去认证",
        //   });
        //   this.$router.push({name: "realNameAuth"});
        //   return;
        // }

        // 显示支付对话框
        this.showPayment = true;
      } else {
        // 跳转到收据页
        // this.goToReceipt()
        this.saveCertificate()
      }
    },

    async handlePayConfirm({pay_type, channel_type}) {
      const params = {
        pay_type,
        channel_type,
        project_id: this.certificateId,
        source: 16,
        amount: this.price,
      };

      try {
        const res = await axios.post(api.balancePay, params);
        this.showPayment = false;

        if (pay_type === 9) {
          await this.$dialog.alert({
            title: "提示",
            message: "缴费成功！",
            theme: "round-button",
            confirmButtonText: "确定",
            confirmButtonColor: "#F52735",
          }).then(()=>{
            this.getAssetList(this.certificateId)

          });

        } else {
          if (res.data.payUrl) {
            window.location.href = res.data.payUrl;
          }
        }
      } catch (err) {
        this.showPayment = false;
        await this.$dialog.alert({
          title: "提示",
          message:err.msg || "支付失败",
          theme: "round-button",
          confirmButtonText: "确定",
          confirmButtonColor: "#F52735",
        });
      }
    },

    handleCertificateClick() {
      // 显示图片预览
      this.showImagePreview = true;
    },

    // 保存证书图片
    saveCertificate() {
      const imageSource = this.status <= 2 ? this.getCertificateImage : this.generatedCertificateImage;
      if (!imageSource) {
        Toast('证书图片未生成');
        return;
      }

      // 创建一个临时链接
      const link = document.createElement('a');
      link.href = imageSource;
      link.download = '不动产权证书.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Toast('证书保存成功');
    },

    // 绘制证书
    drawCertificate() {
      console.log('开始绘制证书');
      const canvas = this.$refs.certificateCanvas;
      if (!canvas) {
        console.error('找不到canvas元素');
        return;
      }

      // 设置高分辨率画布
      const dpr = window.devicePixelRatio || 1;
      // 原图尺寸为 2600 × 1760，保持原图比例
      const originalWidth = 2600;
      const originalHeight = 1760;
      const scale = 0.3; // 缩放比例，适应手机屏幕
      const width = originalWidth * scale;
      const height = originalHeight * scale;

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

        // 设置字体样式
        ctx.textAlign = 'left';

        // 绘制权利人姓名（根据图片，权利人在右上角表格中）
        ctx.font = '16px "SimSun"';
        ctx.fillStyle = '#000';
        // 权利人位置根据实际证书模板调整
        console.log('绘制权利:', this.fix_asset_num);
        ctx.fillText(this.fix_asset_num || '', width * 0.8+45, height * 0.12-14);
        ctx.fillText(this.real_name || '', width * 0.5+130, height * 0.12+26);
        ctx.fillText(this.fix_asset_long_num || '', width * 0.5+130, height * 0.12+116);

        // 绘制日期（使用pay_time）
        if (this.pay_time) {
          try {
            // 将日期拆分成年月日
            const date = moment(this.pay_time);
            if (date.isValid()) {
              const year = date.format('YYYY');
              const month = date.format('MM');
              const day = date.format('DD');

              // 分别绘制年、月、日到对应的空白位置（根据图片，日期在底部盖章处）
              ctx.font = '16px "SimSun"';
              ctx.fillStyle = '#000';
              // 根据实际证书模板调整位置
              const yearX = width * 0.37-80;
              const monthX = width * 0.42-55;
              const dayX = width * 0.46-40;
              const dateY = height * 0.67+53;
              ctx.fillText(year, yearX, dateY);
              ctx.fillText(month, monthX, dateY);
              ctx.fillText(day, dayX, dateY);
            }
          } catch (e) {
            console.error('日期解析错误:', e);
          }
        }

        // 保存绘制好的证书图片
        this.generatedCertificateImage = canvas.toDataURL('image/png');
        console.log('证书图片生成完成', this.generatedCertificateImage ? '成功' : '失败');
      };

      certificateImg.onerror = (error) => {
        console.error('图片加载失败:', error);
        Toast.fail('证书模板加载失败');
      };

      try {
        // 根据typeId选择不同的模板图片
        certificateImg.src = this.certificateImages[this.$route.query.typeId] || this.certificateImages['1'];
        console.log('开始加载证书模板图片');
      } catch (error) {
        console.error('加载证书模板图片失败:', error);
        Toast.fail('证书模板加载失败');
      }
    },
    goToReceipt() {
      console.log('按照',this.$route.query)
      this.$router.push({
        name: 'taxBill',
        query: {
          no: this.$route.query.no,
          taxes_pay_amount: this.$route.query.taxes_pay_amount,
          taxes_pay_time: this.$route.query.taxes_pay_time,
        }
      });
    }
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
  background: linear-gradient(149deg, #28D87D 14.44%, #01BD5D 87.25%);
  color: #FFF;
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 39.484px;
  cursor: pointer;
}
.content-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url('~@/assets/img/certificate/info_bg.png') no-repeat center/cover;
  min-height: 100vh;
  padding-bottom: 20px;
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
