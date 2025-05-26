<template>
  <div class="min-h-screen relative overflow-y-auto">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common2.png" alt="背景" class="w-full">
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <TitleBar :logoSrc="require('@/assets/img/home/yuexiu_logo.png')" @back="$router.back()" />

        <!-- 内容区域 -->
        <div class="content-container mx-4 rounded-lg p-5">
          <div class="receipt-title">开户押金收据</div>

          <div class="receipt-content">
            <p>今收到（<span class="underdashline">{{ receiverName }}</span>）：</p>

            <p>开户押金人民币（大写）
              <span v-if="getWanBai(depositAmount) > 0" class="underdashline">{{ numberToChinese(getWanBai(depositAmount)) }}</span>佰
              <span v-if="getWanShi(depositAmount) > 0" class="underdashline">{{ numberToChinese(getWanShi(depositAmount)) }}</span>拾
              <span class="underdashline">{{ numberToChinese(getWan(depositAmount)) }}</span>万
              <span class="underdashline">{{ numberToChinese(getQian(depositAmount)) }}</span>仟
              <span class="underdashline">{{ numberToChinese(getBai(depositAmount)) }}</span>佰
              <span class="underdashline">{{ numberToChinese(getShi(depositAmount)) }}</span>拾元整
              （￥<span class="underdashline">{{ depositAmount || '________' }}</span>）。
            </p>

            <p>另收押金人民币（大写）
              <span v-if="getWanBai(otherDeposit) > 0" class="underdashline">{{ numberToChinese(getWanBai(otherDeposit)) }}</span>佰
              <span v-if="getWanShi(otherDeposit) > 0" class="underdashline">{{ numberToChinese(getWanShi(otherDeposit)) }}</span>拾
              <span class="underdashline">{{ numberToChinese(getWan(otherDeposit)) }}</span>万
              <span class="underdashline">{{ numberToChinese(getQian(otherDeposit)) }}</span>仟
              <span class="underdashline">{{ numberToChinese(getBai(otherDeposit)) }}</span>佰
              <span class="underdashline">{{ numberToChinese(getShi(otherDeposit)) }}</span>拾元整
              （￥<span class="underdashline">{{ otherDeposit || '________' }}</span>）。
            </p>

            <p>{{cardName}}现金额度（大写）
              <span class="underdashline">{{ getChineseAmount(cardCashAmount) }}</span>
              （￥<span class="underdashline">{{ cardCashAmount || '________' }}</span>）。
            </p>

            <p>{{cardName}}信用额度（大写）
              <span class="underdashline">{{ getChineseAmount(cardCreditAmount) }}</span>
              （￥<span class="underdashline">{{ cardCreditAmount || '________' }}</span>）。
            </p>
          </div>

          <div class="receipt-footer">
            <p class="signature-wrapper">
              收款人签名：<span class="underdashline text-white">{{ collectorName }}</span>
              <img
                src="@/assets/img/common/collector_stamp.png"
                alt="收款章印"
                class="stamp-image"
              >
            </p>
            <p>收款日期：<span class="underdashline">{{ formattedDate }}</span></p>
          </div>
        </div>

        <!-- 添加保存按钮 -->
        <div class="info-container">
          <button class="save-btn" @click="saveAsImage">
            <span class="btn-text">保存收据</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {Loading, Overlay} from "vant";
import TitleBar from "@/components/common/TitleBar.vue";
import {mapActions} from "vuex";
import html2canvas from 'html2canvas';

export default {
  name: "DepositReceipt",
  components: {
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
      cardCashAmount: '',
      cardCreditAmount: '',
      collectorName: '',
      receiptDate: '',
      cardName: '',
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
        link.download = '开户押金收据.png';
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

    getRouteParams() {
      // 获取路由参数
      if (this.$route.query) {
        this.receiverName = this.$route.query.receiverName || '';
        this.cardName = this.$route.query.cardName || '';
        this.depositAmount = this.$route.query.depositAmount || '0.00';
        this.otherDeposit = this.$route.query.otherDeposit || '0.00';
        this.cardCashAmount = this.$route.query.cardCashAmount || '0.00';
        this.cardCreditAmount = this.$route.query.cardCreditAmount || '0.00';
        this.collectorName = this.$route.query.collectorName || '';
        this.receiptDate = this.$route.query.receiptDate || new Date().toISOString();
      }
    },

    // 获取万位的百位数
    getWanBai(num) {
      if (!num) return 0;
      const amount = parseFloat(num);
      return Math.floor(amount / 1000000) % 10;
    },

    // 获取万位的十位数
    getWanShi(num) {
      if (!num) return 0;
      const amount = parseFloat(num);
      return Math.floor(amount / 100000) % 10;
    },

    // 获取万位数
    getWan(num) {
      if (!num) return 0;
      const amount = parseFloat(num);
      return Math.floor(amount / 10000) % 10;
    },

    // 获取千位数
    getQian(num) {
      if (!num) return 0;
      const amount = parseFloat(num);
      return Math.floor(amount / 1000) % 10;
    },

    // 获取百位数
    getBai(num) {
      if (!num) return 0;
      const amount = parseFloat(num);
      return Math.floor(amount / 100) % 10;
    },

    // 获取十位数
    getShi(num) {
      if (!num) return 0;
      const amount = parseFloat(num);
      return Math.floor(amount / 10) % 10;
    },

    numberToChinese(num) {
      const chineseNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
      return chineseNums[num] || '零';
    },

    // 新增一个处理大写金额的方法
    getChineseAmount(num) {
      if (!num) return '';
      const amount = parseFloat(num);

      // 处理百万位
      if (amount >= 1000000) {
        const baiwan = Math.floor(amount / 1000000);
        return `${this.numberToChinese(baiwan)}佰万元整`;
      }

      // 处理十万位到百万位之间
      if (amount >= 100000) {
        const shiwan = Math.floor(amount / 100000);
        return `${this.numberToChinese(shiwan)}拾万元整`;
      }

      // 处理万位
      if (amount >= 10000) {
        const wan = Math.floor(amount / 10000);
        return `${this.numberToChinese(wan)}万元整`;
      }

      // 处理千位及以下
      let result = '';
      if (amount >= 1000) {
        result += `${this.numberToChinese(Math.floor(amount / 1000))}仟`;
      }
      if (amount >= 100) {
        result += `${this.numberToChinese(Math.floor(amount / 100) % 10)}佰`;
      }
      if (amount >= 10) {
        result += `${this.numberToChinese(Math.floor(amount / 10) % 10)}拾`;
      }
      result += '元整';
      return result;
    }
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
  left: 90px;  /* 调整到签名文字上方 */
  top: -30px;   /* 向上偏移覆盖签名 */
  opacity: 0.85;
  pointer-events: none;
  transform: rotate(-5deg);
}

.info-container {
  width: 90%;
  margin: 15px auto;
  padding: 15px;
}

.save-btn {
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
</style>
