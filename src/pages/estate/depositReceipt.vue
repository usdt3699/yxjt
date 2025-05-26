<template>
  <div class="min-h-screen relative overflow-y-auto">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common2.png" alt="背景" class="w-full">
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <TitleBar :logoSrc="require('@/assets/img/home/yuexiu_logo.png')" @back="$router.back()"/>

        <!-- 内容区域 -->
        <div class="content-container mx-4 rounded-lg p-5">
          <div class="receipt-title">房屋锁定押金收据</div>

          <div class="receipt-content">
            <p>今收到（<span class="underdashline">{{ receiverName }}</span>）：</p>

            <p>房屋押金人民币（大写）<span class="underdashline">{{ convertToChinese(depositAmount) }}</span>万<span
                class="underdashline">{{ convertDecimalToChinese(depositAmount) }}</span>仟<span class="underdashline">{{
                convertCentToChinese(depositAmount)
              }}</span>佰<span class="underdashline">{{ convertYuanToChinese(depositAmount) }}</span>拾元整（￥<span
                class="underdashline">{{ depositAmount || '________' }}</span>）。</p>

            <p>另收押金人民币（大写）<span class="underdashline">{{ convertToChinese(otherDeposit) }}</span>万<span
                class="underdashline">{{ convertDecimalToChinese(otherDeposit) }}</span>仟<span
                class="underdashline">{{ convertCentToChinese(otherDeposit) }}</span>佰<span
                class="underdashline">{{ convertYuanToChinese(otherDeposit) }}</span>拾元整（￥<span
                class="underdashline">{{ otherDeposit || '________' }}</span>）。</p>

            <p>房屋坐落于浙江省嘉兴市南湖区余新镇渔里路和幸福路交叉口。</p>

          </div>

          <div class="receipt-footer">
            <p class="signature-wrapper">
              收款人签名：<span class="underdashline text-white">{{ collectorName }}</span>
              <img
                  v-if="status>=2"
                  src="@/assets/img/common/collector_stamp.png"
                  alt="收款章印"
                  class="stamp-image"
              >
            </p>
            <p>收款日期：<span class="underdashline">{{ formattedDate }}</span></p>
          </div>
        </div>

        <!-- 底部信息区域 -->
        <div class="info-container">
          <p class="price-text">
            说明：需缴纳{{ price }}元房屋锁定押金费，未缴纳房屋押金费视为自动放弃该房产认领资格，房屋锁定押金费将在缴纳后可在个人中心
            押金处提现。</p>
          <button class="submit-btn" v-if="status==1" @click="handleButtonClick">
            <span class="btn-text">立即缴纳</span>
          </button>
          <button class="save-btn" v-if="status>=2" @click="saveAsImage">
            <span class="btn-text">保存收据</span>
          </button>
        </div>
      </div>

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
import {Loading, Overlay} from "vant";
import TitleBar from "@/components/common/TitleBar.vue";
import {mapActions} from "vuex";
import PaymentDialog from "@/components/common/PaymentDialog.vue";
import axios from "@/net/axios";
import api from "@/net/api";
import html2canvas from 'html2canvas';

export default {
  name: "DepositReceipt",
  components: {
    PaymentDialog,
    TitleBar,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
  },
  data() {
    return {
      pageLoading: false,
      // 收据数据
      receiverName: '',
      depositAmount: '',
      otherDeposit: '',
      collectorName: '',
      receiptDate: '',
      showPayment: false,
      house: {},
      price: '',
      status: 1,
    };
  },

  mounted() {
    this.getSystemInfo();
    this.getRouteParams();
  },

  computed: {
    formattedDate() {
      if (!this.receiptDate) return '';
      const date = new Date(this.receiptDate);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
  },

  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),
    getRouteParams() {
      // 获取路由参数
      if (this.$route.query) {
        this.id = this.$route.query.id || '';
        this.status = this.$route.query.status || '';
        this.price = this.$route.query.deposit || '';
        if (this.status > 1) {
          this.depositAmount = this.$route.query.deposit || '';
          this.receiverName = this.$route.query.receiverName || '';
          this.otherDeposit = this.$route.query.otherDeposit || '0.00';
          this.collectorName = '越秀集团';
          this.receiptDate = this.$route.query.pay_time || new Date().toISOString();
        }
      }
    },
    async handlePayConfirm({pay_type, channel_type}) {
      const params = {
        pay_type,
        channel_type,
        project_id: this.id,
        source: 15,
        amount: this.price,
      };

      try {
        const res = await axios.post(api.balancePay, params);
        this.showPayment = false;

        if (pay_type === 9) {
          await this.$dialog.alert({
            title: "提示",
            message: "缴纳成功！",
            theme: "round-button",
            confirmButtonText: "确定",
            confirmButtonColor: "#F52735",
          });
          // 点击确定后返回上一页
          this.$router.back();
        } else {
          if (res.data.payUrl) {
            window.location.href = res.data.payUrl;
          }
        }
      } catch (err) {
        this.showPayment = false;
        await this.$dialog.alert({
          title: "提示",
          message: err.msg || "支付失败",
          theme: "round-button",
          confirmButtonText: "确定",
          confirmButtonColor: "#F52735",
        });
      }

    },

    async handleButtonClick() {
      if (this.status === 1) {
        this.showPayment = true;
      }
    },
    // 金额转中文大写函数
    convertToChinese(num) {
      // 提取万位数
      if (!num) return '零';
      let amount = parseFloat(num);
      let wan = Math.floor(amount / 10000);
      return this.numberToChinese(wan);
    },

    convertDecimalToChinese(num) {
      // 提取千位数
      if (!num) return '零';
      let amount = parseFloat(num);
      let qian = Math.floor((amount % 10000) / 1000);
      return this.numberToChinese(qian);
    },

    convertCentToChinese(num) {
      // 提取百位数
      if (!num) return '零';
      let amount = parseFloat(num);
      let bai = Math.floor((amount % 1000) / 100);
      return this.numberToChinese(bai);
    },

    convertYuanToChinese(num) {
      // 提取十位数
      if (!num) return '零';
      let amount = parseFloat(num);
      let shi = Math.floor((amount % 100) / 10);
      return this.numberToChinese(shi);
    },

    numberToChinese(num) {
      const chineseNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
      return chineseNums[num] || '零';
    },

    async saveAsImage() {
      try {
        const content = document.querySelector('.content-container');
        const canvas = await html2canvas(content, {
          backgroundColor: '#ffffff',
          scale: 2, // 提高清晰度
          useCORS: true // 允许跨域图片
        });
        
        // 转换为图片并下载
        const link = document.createElement('a');
        link.download = '房屋锁定押金收据.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        this.$dialog.alert({
          title: "提示",
          message: "保存图片失败",
          theme: "round-button",
          confirmButtonText: "确定",
          confirmButtonColor: "#F52735",
        });
      }
    },
  },
};
</script>

<style scoped lang="less">
.content-container {
  background: #FFF;
  stroke-width: 1px;
  stroke: rgba(195, 159, 122, 0.13);
  filter: drop-shadow(0px 0px 8px #F2F4F7);
  border: 1px solid rgba(195, 159, 122, 0.13);
  overflow: hidden;
  margin-top: 0;
  position: relative;
  border-radius: 8px;
  margin-left: 16px;
  margin-right: 16px;
}

.info-container {
  width: 90%;
  margin: 15px auto;
  padding: 15px;
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

.receipt-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.receipt-content {
  line-height: 1.8;
  font-size: 16px;

  p {
    margin-bottom: 15px;
  }
}

.receipt-footer {
  margin-top: 30px;
  text-align: right;

  p {
    margin-bottom: 10px;
  }
}

/* 只保留虚线下划线 */
.underdashline {
  display: inline-block;
  min-width: 40px;
  border-bottom: 1px dashed #333;
  text-align: center;
  padding: 0 4px;
  border-top: none;
  border-left: none;
  border-right: none;
}

.signature-wrapper {
  position: relative;
  display: inline-block;
}

.stamp-image {
  position: absolute;
  width: 72px;
  height: 72px;
  left: 90px; /* 调整到签名文字上方 */
  top: -30px; /* 向上偏移覆盖签名 */
  opacity: 0.85;
  pointer-events: none; /* 防止图片影响文字交互 */
  transform: rotate(-5deg); /* 稍微旋转一下，更真实 */
}

.save-btn {
  display: flex;
  width: 299px;
  height: 44px;
  padding: 4.339px;
  justify-content: center;
  align-items: center;
  gap: 4.339px;
  margin: 15px auto 0;
  border: none;
  border-radius: 5.207px;
  background: linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%);
}
</style>
