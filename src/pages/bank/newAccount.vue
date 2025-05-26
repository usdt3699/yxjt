<template>
  <div class="min-h-screen relative overflow-y-auto">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common5.png" alt="背景" class="w-full">
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <TitleBar :logoSrc="require('@/assets/img/home/yuexiu_logo.png')" @back="$router.back()" />

        <!-- 内容区域 -->
        <div class="content-container mx-4 rounded-lg p-4">
          <!-- 卡片区域 -->
          <div class="card-wrapper">
            <bank-card-generator
                v-if="card_detail && Object.keys(card_detail).length > 0 && getCardBackground"
                :card-data="typeof card_detail === 'string' ? JSON.parse(card_detail) : card_detail"
                :background-img="getCardBackground"
            />
            <img v-else :src="img || require('@/assets/img/chinadream/jk-model.png')" class="card-image"/>
          </div>

          <!-- 卡片描述区域 -->
          <div class="card-info">
            <div class="info-item">
              <span class="info-label">卡种名称</span>
              <span class="info-value">{{ name || '创兴银联金卡' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">信用额度</span>
              <span class="info-value">{{ parseInt(card_detail.credit_amount || 0) }}元</span>
            </div>
            <div class="info-item">
              <span class="info-label">现金额度</span>
              <span class="info-value">{{ parseInt(card_detail.invite_award || 0) }}元(二十年免息)</span>
            </div>
            <div class="info-item">
              <span class="info-label">申办张数</span>
              <span class="info-value">{{ card_detail.card_count || '1' }}张</span>
            </div>
            <div class="info-item">
              <span class="info-label">开户费</span>
              <span class="info-value">{{ parseInt(price || 0) }}元</span>
            </div>
          </div>

          <!-- 说明区域 -->
          <div class="fee-note">
            <span class="note-icon">•</span>
            <span class="note-text">说明：成功开户后开户押金将会到个人中心 我的押金处进行提现。</span>
          </div>

          <!-- 按钮区域 -->
          <div class="button-container">
            <button class="open-account-button" @click="handleButtonClick">{{buttonText}}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用PaymentDialog组件 -->
    <payment-dialog
      v-model="showPayment"
      :amount="price || 300"
      :coupon="null"
      @confirm="handlePayConfirm"
    />
  </div>
</template>

<script>
import {Button, Dialog, Icon, Loading, Overlay, RadioGroup, Radio, Area, Popup, Checkbox, Toast} from "vant";
import TitleBar from "@/components/common/TitleBar.vue";
import {mapActions} from "vuex";
import {areaList} from '@vant/area-data';
import axios from "../../net/axios";
import api from "../../net/api";
import BankCardGenerator from "@/pages/home/bankCardGenerator.vue";
import jkModel from "@/assets/img/chinadream/jk-model.png";
import bjkModel from "@/assets/img/chinadream/bjk-model.png";
import hjkModel from "@/assets/img/chinadream/hjk-model.png";
import PaymentDialog from "@/components/common/PaymentDialog.vue";

export default {
  name: "ApplyHouse",
  components: {
    BankCardGenerator,
    TitleBar,
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Area.name]: Area,
    [Popup.name]: Popup,
    [Checkbox.name]: Checkbox,
    PaymentDialog,
  },
  data() {
    return {
      pageLoading: false,
      areaList,
      showAreaPicker: false,
      showPayment: false,
      userInfo: null,
      id: null,
      price: '',
      name: '',
      img: null,
      card_detail: {},
      cardModels: {
        1: jkModel,    // 金卡
        2: bjkModel,   // 白金卡
        3: hjkModel    // 黑金卡
      }
    };
  },

  mounted() {
    this.getSystemInfo();
    this.getUserInfoData();
    // 获取路由传递的ID参数
    if (this.$route.query) {
      this.id = this.$route.query.id;
      this.price = this.$route.query.price;
      this.img = this.$route.query.img;
      // 处理 card_detail，确保它是一个对象
      if (this.$route.query.card_detail) {
        this.card_detail = typeof this.$route.query.card_detail === 'string'
          ? JSON.parse(this.$route.query.card_detail)
          : this.$route.query.card_detail;
      }
      this.name = this.$route.query.name;
    } else {
      // 如果没有ID参数，显示提示并返回上一页
      Dialog.alert({
        message: '参数错误，请重新选择',
        confirmButtonText: '确定',
        confirmButtonColor: '#EB6400'
      }).then(() => {
        this.$router.back();
      });
    }
  },

  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),

    async getUserInfoData() {
      try {
        const resUser = await axios.get(api.userInfo);
        if (resUser) {
          this.userInfo = resUser.data.userInfo;
        }
      } catch (err) {
        console.log(err);
      }
    },

    async handleButtonClick() {
      if(this.card_detail.status === 1) {
      // 检查实名认证
      if (!this.userInfo?.is_identify) {
        await Dialog.alert({
          message: "请先完成实名认证",
          confirmButtonText: "去认证",
        });
        this.$router.push({name: "realNameAuth"});
        return;
      }

      // 显示支付对话框
      this.showPayment = true;
      } else {
        // 跳转到收据页
        this.goToReceipt()
      }
    },

    goToReceipt() {
      this.$router.push({
        name: 'bankCardReceipt',
        query: {
          receiverName: this.card_detail.name || '',
          cardName: this.name || '',
          depositAmount: this.price || '0.00',
          otherDeposit: '0.00', // 可能需要从其他地方获取
          cardCashAmount: this.card_detail.invite_award||'0.00', // 可能需要从其他地方获取
          cardCreditAmount: this.card_detail.credit_amount||'0.00', // 可能需要从其他地方获取
          collectorName: '越秀集团', // 可能需要从其他地方获取
          receiptDate: this.pay_time||''
        }
      });
    },

    async handlePayConfirm({pay_type, channel_type}) {
      const params = {
        pay_type,
        channel_type,
        project_id: this.id,
        source: 11,
        amount: this.price || 300,
      };

      try {
        const res = await axios.post(api.balancePay, params);
        this.showPayment = false;

        if (pay_type === 9) { // 余额支付
          await Dialog.alert({
            title: "提示",
            message: "开户申请提交成功！",
            theme: "round-button",
            confirmButtonText: "确定",
            confirmButtonColor: "#EB6400",
          });
          // 点击确定后返回上一页
          this.$router.back();
        } else {
          // 第三方支付
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
    }
  },

  computed: {
    getCardBackground() {
      return this.cardModels[this.id] || this.cardModels[1]; // 默认使用金卡背景
    },
    buttonText() {
      console.log('按钮庄文',this.card_detail.status)
      return this.card_detail.status === 1 ? '立即开户' : '查看收据'
    }
  }
};
</script>

<style scoped lang="less">
.card-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

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

// 新增卡片信息样式
.card-info {
  width: 100%;
  padding: 0 5px;
  margin-top: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.info-label {
  color: #373737;
  font-size: 14px;
}

.info-value {
  color: #5C3A21;
  font-weight: 600;
  font-size: 14px;
}

// 说明区域样式调整
.fee-note {
  display: flex;
  align-items: flex-start;
  margin: 15px 5px 15px 5px;
  color: #EB6400;
  font-size: 12px;
}

.note-icon {
  margin-right: 5px;
  color: #EB6400;
  flex-shrink: 0;
}

.note-text {
  flex: 1;
  line-height: 1.4;
}

// 修改按钮样式
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.open-account-button {
  width: 80%;
  height: 44px;
  background: linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%);
  border-radius: 5.207px;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 500;
  border: none;
  margin-bottom: 5px;
}

// 支付弹窗样式
.payment-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border-radius: 16px 16px 0 0;
  padding: 20px;
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.payment-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-icon {
  font-size: 20px;
  color: #999;
}

.payment-content {
  padding: 0 10px;
}

.payment-amount {
  font-size: 24px;
  font-weight: 700;
  color: #EB6400;
  text-align: center;
  margin: 20px 0;
}

.payment-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #F2F2F2;
}

.payment-method {
  margin-top: 20px;
}

.method-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
}

.method-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #F2F2F2;
}

.method-info {
  display: flex;
  align-items: center;
}

.method-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.payment-button {
  background: linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%);
  color: #FFFFFF;
  height: 45px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  margin-top: 20px;
}
</style>
