<template>
  <div class="min-h-screen relative pb-[10px]">
    <div class="w-full relative">
      <img
        src="../../assets/img/home/bg_common4.png"
        alt="背景"
        class="w-full"
      />
      <div class="absolute top-0 left-0 right-0 bg-[#FDDCCA]">
        <!-- 顶部区域 -->
        <div class="flex justify-between items-center pt-[15px] px-[10px]">
          <!-- 左侧logo -->
          <img
            src="../../assets/img/home/logo.png"
            alt="越秀集团"
            class="h-[40px]"
          />
        </div>

        <!-- 主要内容区域 -->
        <div class="px-[10px] pt-[15px] pb-[55px] relative z-10">
          <!-- 内容背景容器 -->
          <div class="card-list-container">
            <!-- 循环展示卡片和信息作为整体 -->
            <div
              v-for="(item, index) in bankList"
              :key="item.id"
              class="content-bg card-content-item"
            >
              <!-- 卡片区域 -->
              <div class="card-wrapper">
                <bank-card-generator
                  v-if="item.status === 3 && item.card_detail"
                  :card-data="item.card_detail"
                  :background-img="cardModels[item.id]"
                />
                <img v-else :src="item.img" class="card-image" />
              </div>

              <!-- 卡片信息区域 -->
              <div class="card-info">
                <div class="card-title">{{ item.name }}</div>
                <div class="card-desc-lines">
                  <div class="card-desc-line">• {{ item.desc1 }}</div>
                  <div class="card-desc-line">• {{ item.desc2 }}</div>
                </div>
                <!-- 进度条 -->
                <div class="card-progress-container">
                  <div
                    class="card-progress-bar"
                    :style="{ width: getRandomProgress(item) + '%' }"
                  ></div>
                  <div class="progress-text">
                    {{ getRandomProgress(item) }}%
                  </div>
                </div>
                <div class="apply-btn gradient" @click="handleAssetClick(item)">
                  {{ getButtonText(item) }}
                </div>
                <!-- 当状态为3时显示查看银行卡凭证按钮 -->
                <div
                  v-if="item.status === 3 && item.card_detail.status === 2"
                  class="apply-btn view-cert-btn"
                  @click="handleViewCertificate(item)"
                >
                  查看激活凭证
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 客服组件 -->
      <CustomerService
        :position="customerServicePos"
        @contact="handleCustomerService"
      />

      <!-- 提示对话框 -->

      <!-- 使用证书预览组件 -->
      <certificate-preview
        :card-detail="selectedCardDetail"
        :show.sync="showCertificatePreview"
      ></certificate-preview>
      <activity-certificate-preview
        :card-detail="selectedCardDetail"
        :show.sync="showActivityCertificatePreview"
      ></activity-certificate-preview>
      <!-- 支付弹窗 -->
      <payment-dialog
        v-model="showPayment"
        :amount="selectedAsset?.card_detail?.price || 0"
        @confirm="handlePayConfirm"
      />
      <van-overlay
        :show="showDialog"
        class="flex items-center justify-center z-50"
      >
        <div
          class="invite-dialog bg-white rounded-lg w-[80%] py-8 px-6 flex flex-col items-center"
        >
          <!-- 图标 -->
          <img
            src="@/assets/img/estate/ic_invite_tip.png"
            alt="邀请提示"
            class="w-[80px] h-[80px] mb-4"
          />

          <!-- 提示文字 -->
          <div
            class="text-[#999] text-center text-[21.88px] font-normal leading-[157.9%] mb-2"
          >
            需要邀请 ({{ selectedAsset?.has_recommend_identify_num || 0 }}/{{
              selectedAsset?.invite_identity_user || 0
            }}) 人
          </div>
          <!-- <div
            class="text-[#999] text-center text-[17.88px] font-normal leading-[157.9%] mb-6"
          >
            进行实名注册即可免费申领
          </div> -->

          <!-- 按钮 -->
          <button
            class="invite-btn w-[140px] h-[37.373px] rounded-[18.686px] border-[1.068px] border-[#EB6400]"
            @click="goToInvite"
          >
            去邀请
          </button>
        </div>
      </van-overlay>
    </div>
  </div>
</template>

<script>
import {
  Button,
  Dialog,
  Overlay,
  Loading,
  Toast,
  Swipe,
  SwipeItem,
} from "vant";
import BankCardGenerator from "@/pages/home/bankCardGenerator.vue";
import CertificatePreview from "@/components/bank/CertificatePreview.vue";
import axios from "@/net/axios";
import api from "@/net/api";
import { mapActions } from "vuex";
import jkModel from "@/assets/img/chinadream/jk-model.png";
import bjkModel from "@/assets/img/chinadream/bjk-model.png";
import hjkModel from "@/assets/img/chinadream/hjk-model.png";
import CustomerService from "@/components/CustomerService.vue";
import PaymentDialog from "@/components/common/PaymentDialog.vue";
import ActivityCertificatePreview from "@/components/bank/ActivityCertificatePreview.vue";

export default {
  name: "index",
  components: {
    ActivityCertificatePreview,
    CustomerService,
    CertificatePreview,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Toast.name]: Toast,
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    BankCardGenerator,
    PaymentDialog,
  },
  data() {
    return {
      pageLoading: true,
      customerServicePos: {
        right: 15,
        bottom: 80,
      },
      settleLimit: 0,
      bankList: [],
      searchKeyword: "",
      source: 11,
      showTransferDialog: false,
      selectedAsset: null,
      restore_wallet: {},
      showCertificatePreview: false,
      showActivityCertificatePreview: false,
      selectedCardDetail: null,
      userInfo: {},
      canUseCoupon: true,
      couponList: [],
      selectedCoupon: null,
      showAdvantageDialog: false,
      cardModels: {
        1: jkModel, // 金卡
        2: bjkModel, // 白金卡
        3: hjkModel, // 黑金卡
      },
      progressValues: {}, // 存储每个卡片的进度值
      showDialog: false, // 添加邀请弹窗控制
      showPayment: false, // 支付弹窗控制
    };
  },
  mounted() {
    this.getUserInfo();
    this.getBankList();
    this.getUserInfoData();
    this.getSystemInfo();
    this.generateRandomProgress();
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    ...mapActions("systemInfo", ["getSystemInfo"]),
    // 生成随机进度值
    generateRandomProgress() {
      this.bankList.forEach((item) => {
        this.$set(
          this.progressValues,
          item.id,
          Math.floor(Math.random() * 85) + 15
        ); // 生成15-100之间的随机数
      });
    },
    // 获取卡片的进度值
    getRandomProgress({ id, card_detail }) {
      if (card_detail.status > 0) {
        return 100;
      }
      if (id == 1) {
        return 32;
      }
      if (id == 2) {
        return 53;
      }
      if (id == 3) {
        return 71;
      }
    },
    handleCustomerService() {
      console.log("点击客服", this.systemInfo?.customerService);
      if (this.systemInfo?.customerService) {
        window.location.href = this.systemInfo.customerService;
      }
    },

    async getBankList(data) {
      try {
        this.pageLoading = true;
        const res = await axios.get(api.myVipCardAward);
        if (res.code === 200 && res.data?.vipCardConfigList) {
          this.bankList = res.data.vipCardConfigList.map((item) => {
            const desc = item.describe.split(",");
            return {
              ...item,
              desc1: desc[0],
              desc2: desc[1],
            };
          });
          if (data) {
            const item = this.bankList.find((item) => item.id === data.id);
            this.handleViewCertificate(item);
          }
        }
      } catch (error) {
        Dialog.alert({
          title: "提示",
          message: error.msg || "获取失败",
          confirmButtonText: "确定",
          confirmButtonColor: "#F23D30",
        });
      } finally {
        this.pageLoading = false;
      }
    },
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

    async handleAssetClick(item) {
      if (!this.userInfo?.is_identify) {
        await Dialog.alert({
          message: "请先完成实名认证",
          confirmButtonText: "去认证",
        });
        this.$router.push({ name: "realNameAuth" });
        return;
      }
      // if(!this.userInfo?.member_status){
      //   this.$dialog.alert({
      //     message: "请先申请会员",
      //     confirmButtonText: "立即申请",
      //   }).then(() => {
      //     this.$router.push({name: "member"});
      //   });
      //   return;
      // }
      // Dialog.alert({message:'正在开放中，请留意官方公告信息。'})
      // return

      this.selectedAsset = item;

      // 判断是否为金卡以外的卡片，且金卡未领取
      if (item.id !== 1) {
        // 查找金卡的状态
        const goldCard = this.bankList.find((card) => card.id == 1);
        if (goldCard && goldCard.status != 3) {
          // 如果金卡未领取，提示用户先领取金卡
          await Dialog.alert({
            message: "请先领取金卡",
            confirmButtonText: "确定",
          });
          return;
        }
      }

      // 判断是否需要邀请
      if (item.status === 1 && item.invite_identity_user > 0) {
        if (item.has_recommend_identify_num < item.invite_identity_user) {
          this.showDialog = true;
          return;
        }
      }

      if (item.status === 1 || item.status === 2) {
        this.$router.push({ name: "applyCard", query: { id: item.id } });
        return;
      }

      // 处理已领取状态的卡片
      if (item.status === 3 && item.card_detail) {
        if (item.card_detail && item.card_detail.status === 1) {
          // this.$dialog
          //   .confirm({
          //     message: `需缴纳${Number(
          //       item.card_detail.price
          //     )}元缴纳年费即可立即完成激活。`,
          //     confirmButtonText: "立即激活",
          //   })
          //   .then(() => {
          //     this.source = 11;
          //     this.selectedAsset = item;
          //     this.showPayment = true;
          //   });
          this.$router.push({
            name: "xyCard",
            query: {
              id: item.id,
              status: item.card_detail.status,
              name: item.card_detail.name,
              price: item.card_detail.price,
              credit_amount: item.card_detail.credit_amount,
            },
          });
          return;
        }
        if (item.card_detail && item.card_detail.status === 2) {
          this.$router.push({
            name: "xyCard",
            query: {
              id: item.id,
              status: item.card_detail.status,
              name: item.card_detail.name,
              price: item.card_detail.price,
              credit_amount: item.card_detail.credit_amount,
            },
          });
          return;
        }
        // try {
        //   const res = await axios.post(api.freeActiveVipCard, { id: item.id });
        //   this.$dialog
        //     .alert({
        //       message: res.msg || "激活成功",
        //       confirmButtonText: "确定",
        //     })
        //     .then(() => {
        //       this.getBankList(item);
        //     });
        // } catch (e) {
        // this.$dialog
        //   .alert({
        //     message: e.msg || "需要参与五一福利项目即可完成激活",
        //     confirmButtonText: "确定",
        //   })
        //   .then(() => {
        //     if (e.msg.includes("激活")) {
        //       this.$router.push({ name: "projectActivity" });
        //     }
        //   });
        // }

        // 弹出支付弹窗，使用card_detail.price作为支付金额
        // this.selectedAsset = item;
        // this.showPayment = true;
        // this.source = 11;

        return;
      }
    },

    // 处理支付确认
    async handlePayConfirm({ pay_type, channel_type }) {
      const params = {
        pay_type,
        channel_type,
        project_id: this.selectedAsset.id,
        source: this.source, // 银行卡激活的source值为1
        amount: this.selectedAsset.card_detail.price,
      };

      try {
        const res = await axios.post(api.balancePay, params);
        this.showPayment = false;
        if (pay_type === 9) {
          await this.$dialog.alert({
            title: "提示",
            message: "支付成功！",
            theme: "round-button",
            confirmButtonText: "确定",
            confirmButtonColor: "#F52735",
          });
          this.getBankList(this.selectedAsset); // 刷新列表
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

    // 添加去邀请方法
    goToInvite() {
      this.showDialog = false;
      this.$router.push({ name: "userInvite" });
    },

    // 处理查看银行卡凭证
    handleViewCertificate(item) {
      if (item && item.status === 3) {
        if (item.card_detail.status === 2) {
          // 设置选中的卡详情数据
          this.selectedCardDetail = item;
          // 显示证书预览
          this.showActivityCertificatePreview = true;
        }
      }
    },
  },
  watch: {
    bankList: {
      handler(val) {
        if (val && val.length > 0) {
          // 设置CSS变量用于计算卡片信息区域的位置
          document.documentElement.style.setProperty(
            "--bank-list-length",
            val.length
          );
        }
      },
      immediate: true,
    },
  },

  computed: {
    // 获取按钮文本
    getButtonText() {
      return (card) => {
        // 处理已领取状态，根据card_detail.status显示不同文字
        if (card.status === 3) {
          // console.log("已领取状态", card.card_detail);
          if (card.card_detail && card.card_detail.status === 1) {
            return "签署承诺书";
          }
          // if (card.card_detail && card.card_detail.status === 1) {
          //   return "激活失败，查询原因";
          // }
          if (card.card_detail && card.card_detail.status === 2) {
            return "查看承诺书";
            // return "激活失败，查询原因";
            // return "审核中";
            // return "审核通过，等待短信通知。";
          }
          return "立即激活";
          //   } else if (card.card_detail && card.card_detail.status === 2) {
        }
        return "立即申领";
      };
    },
  },
};
</script>

<style scoped>
/* 卡片列表样式 */
.card-list-container {
  position: relative;
  width: 100%;
  margin: 0;
  z-index: 10;
  padding: 5px;
  padding-bottom: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  touch-action: auto;
}

.card-content-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.card-wrapper {
  width: 100%;
  max-width: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.page-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
  background: #f23d30;
  overflow-x: hidden;
  overflow-y: auto;
  touch-action: auto;
  -webkit-overflow-scrolling: touch;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  object-fit: cover;
  object-position: top center;
  z-index: 0;
  pointer-events: none;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding-top: 19vh;
  padding-bottom: 50px;
  touch-action: auto;
  min-height: 100vh;
}

.content-bg {
  width: 100%;
  padding: 30px 15px 35px;
  box-sizing: border-box;
  position: relative;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="433" viewBox="0 0 345 433" fill="none" preserveAspectRatio="none"><g filter="url(%23filter0_i_47_571)"><path d="M10.9867 421.945L10.723 420.978L9.79124 420.611C5.22517 418.809 2 414.359 2 409.16V23.8409C2 18.642 5.22508 14.1915 9.79102 12.3902L10.7228 12.0225L10.9865 11.0562C12.4111 5.83531 17.1893 2 22.8581 2H322.142C327.811 2 332.589 5.83533 334.014 11.0562L334.277 12.0226L335.209 12.3902C339.775 14.1916 343 18.6421 343 23.8409V409.16C343 414.359 339.775 418.809 335.209 420.611L334.277 420.978L334.013 421.945C332.589 427.165 327.811 431 322.142 431H22.8581C17.1895 431 12.4116 427.165 10.9867 421.945Z" fill="%23FFE5D4" stroke="%23FBC57F" stroke-width="4"/></g><defs><filter id="filter0_i_47_571" x="0" y="0" width="346" height="434" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dx="1" dy="1"/><feGaussianBlur stdDeviation="10"/><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/><feColorMatrix type="matrix" values="0 0 0 0 0.824 0 0 0 0 0.439 0 0 0 0 0 0 0 0 0.47 0"/><feBlend mode="normal" in2="shape" result="effect1_innerShadow_47_571"/></filter></defs></svg>');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-image {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
}

/* 卡片信息区域新样式 */
.card-info {
  width: 100%;
  max-width: 320px;
  text-align: center;
  padding: 0;
  box-sizing: border-box;
  z-index: 1;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 卡片标题新样式 */
.card-title {
  color: #4f4f4f;
  text-align: center;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 16.23px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 1.136px;
  margin-bottom: 15px;
}

/* 卡片描述行容器 */
.card-desc-lines {
  margin-bottom: 20px;
  width: 100%;
}

/* 卡片描述行样式 */
.card-desc-line {
  color: #4f4f4f;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 14.23px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.996px;
  margin-bottom: 8px;
  text-align: left;
}

/* 按钮新样式 */
.apply-btn {
  width: 196px;
  height: 47.354px;
  flex-shrink: 0;
  border-radius: 52.06px;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  cursor: pointer;
  user-select: none;
  background: #fff;
  color: #333;
  font-family: "HarmonyOS Sans", sans-serif;
}

/* 卡片进度条样式 */
.card-progress-container {
  width: 90%;
  height: 20px;
  background-color: rgba(239, 143, 74, 0.2);
  border-radius: 10px;
  overflow: visible;
  margin: 8px auto 15px;
  position: relative;
}

.progress-text {
  position: absolute;
  right: 10px;
  top: 0;
  height: 20px;
  line-height: 20px;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  z-index: 2;
}

.card-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #ef8f4a 0%, #ea4529 100%);
  border-radius: 10px;
  transition: width 0.5s ease;
}

/* 按钮状态样式 */
.apply-btn.gradient {
  background: linear-gradient(346deg, #ef8f4a 9.79%, #ea4529 89.46%);
  color: #fff;
}

/* 查看银行卡凭证按钮样式 */
.view-cert-btn {
  background: linear-gradient(149deg, #59caff 14.44%, #0055c7 87.25%);
  margin-top: 10px;
  color: #fff;
}

.apply-btn.disabled {
  background: linear-gradient(0deg, #c3c3c3 0%, #808080 98.96%);
  border: 1.8px solid #707070;
  box-shadow: 0.338px 0.338px 0.338px 0px rgba(255, 255, 255, 0.36) inset;
  color: #fff;
  cursor: not-allowed;
}

.title {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 180px;
  padding-top: 20px;
}

.tags:after {
  content: ""; /* 必须设置 content 属性才能生效 */
  width: 20px; /* 下划线长度*/
  height: 3px; /* 下划线高度*/
  background-color: red; /* 下划线颜色*/
  position: absolute; /* 下划线位置*/
  left: 34px; /* 下划线位置*/
  top: 36px; /* 下划线位置，可以参考行高来设置*/
}

/* 添加购买国债优势按钮样式 */
.advantage-btn {
  position: relative;
  color: #f23d30;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  padding-bottom: 5px;
}

.advantage-btn:after {
  content: "";
  width: 100%;
  height: 2px;
  background-color: #f23d30;
  position: absolute;
  left: 0;
  bottom: 0;
}

/* 国债优势弹窗样式 */
.advantage-dialog-container {
  display: flex;
  flex-direction: column;
  height: 70vh;
}

.advantage-content {
  padding: 15px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  flex: 1;
  overflow-y: auto;
}

.advantage-content p {
  margin-bottom: 10px;
}

.dialog-buttons {
  padding: 15px;
  background-color: #fff;
  border-top: 1px solid #eee;
  position: sticky;
  bottom: 0;
}

.assets-list {
  display: flex;
  flex-direction: column;
}

.asset-item {
  background: #fff;
  display: flex;
  align-items: center;
}

.asset-item:first-of-type {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.asset-item:last-of-type {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.asset-icon {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.asset-content {
  flex: 1;
}

.asset-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.asset-type {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.asset-duration {
  font-size: 14px;
  color: #1e7e38;
  border-radius: 5px;
}

.asset-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.rate-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.rate-label {
  font-size: 14px;
  color: #666;
}

.rate-value {
  font-size: 18px;
  color: #f23d30;
  font-weight: bold;
}

.rate-type {
  font-size: 12px;
  color: #999;
  margin-left: 5px;
}

.price-info {
  text-align: right;
}

.price {
  font-size: 18px;
  color: #f23d30;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-check,
.btn-buy {
  border-radius: 5px;
  font-size: 14px;
  border: none;

  width: 45%;
  height: 30px;
}

.btn-check {
  background: #5aacff;
  color: #fff;
}

.btn-buy {
  background: #f23d30;
  color: #fff;
}

/* 自定义弹窗样式 */
:deep(.van-dialog__header) {
  color: #f23d30;
  font-weight: bold;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

:deep(.van-button--danger) {
  background-color: #f23d30;
  border-color: #f23d30;
}

/* 调整主要内容区域的内边距 */
.px-\[10px\] {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

/* 邀请按钮样式 */
.invite-btn {
  background: linear-gradient(147deg, #eb6400 20.81%, #f49f00 92.21%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  font-family: "HarmonyOS Sans";
  font-size: 16.017px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

/* 邀请对话框样式 */
.invite-dialog {
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
}
/* 卡片详细信息区域容器样式 */
.card-detail-container {
  width: 100%;
  max-width: 320px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 15px;
  margin-top: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #fbc57f;
}

/* 卡片信息项样式 */
.card-info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 5px 0;
  border-bottom: 1px dashed #f0f0f0;
}

.card-info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #666;
  font-size: 14px;
  min-width: 70px;
}

.info-value {
  color: #333;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
}

.bind-btn {
  color: #eb6400;
  font-size: 12px;
  background-color: rgba(235, 100, 0, 0.1);
  padding: 3px 8px;
  border-radius: 10px;
  margin-left: 10px;
}

/* 绑定按钮区域样式 */
.bind-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  width: 100%;
}

.bind-alipay-btn,
.bind-wechat-btn {
  display: flex;
  align-items: center;
  background: linear-gradient(to right, #f5f5f5, #e9e9e9);
  border-radius: 8px;
  padding: 8px 12px;
  width: 48%;
  cursor: pointer;
}

.bind-alipay-btn {
  background: linear-gradient(to right, #f0f9ff, #e6f7ff);
}

.bind-wechat-btn {
  background: linear-gradient(to right, #f0fff0, #e6ffe6);
}

.bind-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.bind-text {
  display: flex;
  flex-direction: column;
}

.bind-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.bind-subtitle {
  font-size: 12px;
  color: #666;
}
</style>
