<template>
  <div class="min-h-screen relative">
    <div class="w-full relative">
      <img
        src="../../assets/img/home/bg_common4.png"
        alt="背景"
        class="w-full"
      />
      <div class="absolute top-0 left-0 right-0">
        <!-- 标题栏 -->
        <TitleBar
          :logoSrc="require('@/assets/img/home/yuexiu_logo.png')"
          @back="$router.back()"
        />

        <!-- 页面标题 -->
        <div class="page-title-container">
          <div class="page-title">我的银行卡</div>
        </div>

        <!-- 主要内容区域 -->
        <div class="px-[10px] pt-[15px] pb-[55px] relative z-10">
          <!-- 内容背景容器 -->
          <div class="card-list-container">
            <!-- 判断是否有数据 -->
            <template v-if="bankList.length === 0">
              <!-- 无数据提示 -->
              <div class="empty-data-container">
                <van-empty description="暂未领取" image="search">
                  <van-button
                    round
                    type="danger"
                    class="empty-btn"
                    @click="goToBankCard"
                  >
                    立即去领取
                  </van-button>
                </van-empty>
              </div>
            </template>
            <template v-else>
              <!-- 循环展示卡片和信息作为整体 -->
              <div
                v-for="(item, index) in bankList"
                :key="item.id"
                class="content-bg card-content-item"
              >
                <!-- 卡片区域 -->
                <div class="card-wrapper">
                  <bank-card-generator
                    v-if="item.card_detail"
                    :card-data="item.card_detail"
                    :background-img="cardModels[item.id]"
                  />
                  <img v-else :src="item.img" class="card-image" />
                </div>

                <!-- 卡片信息区域 -->
                <div class="card-info">
                  <div class="card-desc-lines">
                    <div class="card-desc-line">• {{ item.desc1 }}</div>
                    <div class="card-desc-line">• {{ item.desc2 }}</div>
                  </div>
                  <div class="card-title">{{ item.name }}</div>
                  <!-- 卡片详细信息区域 - 整体容器 -->
                  <div class="card-detail-container">
                    <!-- 持卡人信息 -->
                    <div class="card-info-item">
                      <span class="info-label">持卡人：</span>
                      <span class="info-value">{{
                        item.card_detail.name || "未设置"
                      }}</span>
                    </div>
                    <!-- 卡号信息 -->
                    <div class="card-info-item">
                      <span class="info-label">卡号：</span>
                      <span class="info-value">{{
                        item.card_detail.bank_no || "未设置"
                      }}</span>
                      <span
                        v-if="item.id == 1 && item.card_detail.is_merge == 0"
                        class="bind-btn"
                        @click="bindRealCard(item)"
                        >绑定实卡卡号</span
                      >
                    </div>

                    <!-- 汇款额度信息 -->
                    <div class="card-info-item">
                      <span class="info-label">现金额度：</span>
                      <span class="info-value"
                        >{{ item.card_detail.invite_award || "0" }}元</span
                      >
                    </div>
                    <!-- 额度信息 -->
                    <div class="card-info-item">
                      <span class="info-label">信用额度：</span>
                      <span class="info-value"
                        >{{ item.card_detail.credit_amount || "0" }}元({{
                          extractParenthesisContent(item.desc2)
                        }})</span
                      >
                    </div>
                    <!-- 汇款额度 -->
                    <div
                      v-if="item.card_detail.invite_award_withdraw_num > 0"
                      class="card-info-item"
                    >
                      <span class="info-label">汇款额度：</span>
                      <span class="info-value"
                        >{{
                          item.card_detail.invite_award_withdraw_num || "0"
                        }}元</span
                      >
                    </div>
                    <!-- 审核状态 -->
                    <div class="card-info-item">
                      <span class="info-label">审核状态：</span>
                      <span class="info-value status-reviewing">审核中</span>
                    </div>
                    <!-- 绑定按钮区域 -->
                    <div class="bind-buttons">
                      <div
                        class="bind-alipay-btn"
                        @click="handleAlipayAction(item)"
                      >
                        <img
                          src="@/assets/img/alipay_icon.png"
                          class="bind-icon"
                          alt="支付宝图标"
                          onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22><path fill=%22%23fff%22 d=%22M7.01 11.125c-1.07 0-1.94.87-1.94 1.94s.87 1.94 1.94 1.94c1.07 0 1.94-.87 1.94-1.94s-.87-1.94-1.94-1.94zm0 2.88c-.52 0-.94-.42-.94-.94s.42-.94.94-.94.94.42.94.94-.42.94-.94.94zm9.98-2.88c-1.07 0-1.94.87-1.94 1.94s.87 1.94 1.94 1.94c1.07 0 1.94-.87 1.94-1.94s-.87-1.94-1.94-1.94zm0 2.88c-.52 0-.94-.42-.94-.94s.42-.94.94-.94.94.42.94.94-.42.94-.94.94zm-5.99-1.94c0 1.07.87 1.94 1.94 1.94 1.07 0 1.94-.87 1.94-1.94s-.87-1.94-1.94-1.94c-1.07 0-1.94.87-1.94 1.94zm2.88 0c0 .52-.42.94-.94.94s-.94-.42-.94-.94.42-.94.94-.94.94.42.94.94zm-9.9-5.82v11.76h17.94V6.25H3.98zm16.94 10.76H4.98V7.25h15.94v9.76z%22/></svg>'"
                        />
                        <div class="bind-text">
                          <div class="bind-title">
                            {{ userInfo.alipay ? "转入支付宝" : "绑定支付宝" }}
                          </div>
                          <div class="bind-subtitle">
                            {{ userInfo.alipay ? "点击转入" : "点击绑定" }}
                          </div>
                        </div>
                      </div>
                      <div
                        class="bind-wechat-btn"
                        @click="handleWechatAction(item)"
                      >
                        <img
                          src="@/assets/img/wechat_icon.png"
                          class="bind-icon"
                          alt="微信图标"
                          onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22><path fill=%22%23fff%22 d=%22M9.5 8.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-6.95 6.08c-.02.25.15.48.4.53.77.15 1.53.25 2.3.25 5.23 0 9.56-3.87 10.3-8.87.02-.25-.15-.48-.4-.53-.64-.12-1.3-.2-1.98-.23-.25-.01-.46.18-.5.43-.37 2.25-2.35 4.03-4.77 4.03-1.19 0-2.29-.45-3.12-1.19-.2-.17-.49-.17-.69 0-.83.74-1.93 1.19-3.12 1.19-.52 0-1.03-.08-1.5-.24-.24-.08-.49.04-.59.27-.31.88-.49 1.86-.49 2.89 0 .66.07 1.32.21 1.97.05.25.25.42.5.42 1.17-.05 2.31-.25 3.4-.59.22-.07.37-.29.35-.53zm-1.09-10.52c-4.44.22-8.01 3.75-8.46 8.16-.02.21.02.43.13.6.36.53.94 1.08 1.64 1.08.92 0 1.57-.73 1.7-1.56.13-.83-.35-1.64-1.07-1.94-.25-.1-.4-.35-.39-.62.06-2.84 2.41-5.21 5.25-5.29.21-.01.39-.15.46-.34.17-.46.5-.85.94-1.09.19-.1.31-.3.29-.52-.02-.22-.17-.4-.38-.45-.36-.09-.73-.13-1.11-.13-.33 0-.66.03-.98.09z%22/></svg>'"
                        />
                        <div class="bind-text">
                          <div class="bind-title">
                            {{ userInfo.wechat ? "转入微信" : "绑定微信" }}
                          </div>
                          <div class="bind-subtitle">
                            {{ userInfo.wechat ? "点击转入" : "点击绑定" }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 提示对话框 -->
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
          <div
            class="text-[#999] text-center text-[17.88px] font-normal leading-[157.9%] mb-6"
          >
            进行实名注册即可免费申领
          </div>

          <!-- 按钮 -->
          <button
            class="invite-btn w-[140px] h-[37.373px] rounded-[18.686px] border-[1.068px] border-[#EB6400]"
            @click="goToInvite"
          >
            去邀请
          </button>
        </div>
      </van-overlay>

      <!-- 绑定实卡对话框 -->
      <van-dialog
        v-model="showBindCardDialog"
        title="绑定实卡卡号"
        show-cancel-button
        confirm-button-color="#F23D30"
        @confirm="confirmBindCard"
      >
        <div class="bind-card-dialog-content">
          <van-field
            v-model="bindCardNo"
            label="卡号"
            placeholder="请输入实卡卡号"
            clearable
            type="number"
          />
        </div>
      </van-dialog>

      <!-- 通用输入对话框 -->
      <van-dialog
        v-model="showInputDialogFlag"
        :title="inputDialogTitle"
        show-cancel-button
        confirm-button-color="#F23D30"
        @confirm="confirmInputDialog"
        @cancel="cancelInputDialog"
      >
        <div class="bind-card-dialog-content">
          <van-field
            v-model="inputDialogValue"
            :placeholder="inputDialogPlaceholder"
            clearable
          />
        </div>
      </van-dialog>

      <!-- 转入弹窗 -->
      <van-popup
        v-model="showTransferPopup"
        round
        position="bottom"
        :style="{ padding: '20px' }"
      >
        <div class="transfer-popup-content">
          <div class="transfer-popup-title">
            {{ transferType === "wechat" ? "转入微信" : "转入支付宝" }}
          </div>
          <div class="transfer-popup-form">
            <van-field
              v-model="transferForm.amount"
              label="转入金额"
              placeholder="请输入转入金额"
              type="number"
            />
            <div class="transfer-popup-tip">
              可用额度：{{ currentCard?.card_detail.invite_award || 0 }}元
              <span class="transfer-all-btn" @click="handleSetFullAmount"
                >全部</span
              >
            </div>
            <div class="text-red-600 text-[14px] mt-3">
              说明：根据中华人民共和国个人所得税法，个人从中国境内取得的所得，依照本法规定缴纳个人所得税。缴纳个人所得税后，该比款项将会在24小时内打入您所绑定的银行卡。
            </div>
          </div>
          <div class="transfer-popup-buttons">
            <van-button
              round
              block
              color="#F23D30"
              native-type="button"
              @click="handleConfirmTransfer"
            >
              确认转入
            </van-button>
          </div>
        </div>
      </van-popup>
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
import {
  Button,
  Dialog,
  Empty,
  Field,
  Loading,
  Overlay,
  Popup,
  Swipe,
  SwipeItem,
  Toast,
} from "vant";
import BankCardGenerator from "@/pages/home/bankCardGenerator.vue";
import axios from "@/net/axios";
import api from "@/net/api";
import { mapActions } from "vuex";
import jkModel from "@/assets/img/chinadream/jk-model.png";
import bjkModel from "@/assets/img/chinadream/bjk-model.png";
import hjkModel from "@/assets/img/chinadream/hjk-model.png";
import TitleBar from "@/components/common/TitleBar.vue";
import PaymentDialog from "@/components/common/PaymentDialog.vue";

export default {
  name: "index",
  components: {
    PaymentDialog,
    TitleBar,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Toast.name]: Toast,
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Empty.name]: Empty,
    BankCardGenerator,
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
      showTransferDialog: false,
      selectedAsset: null,
      restore_wallet: {},
      showPayment: false,
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
      showDialog: false, // 添加邀请弹窗控制
      price: 0, // 添加邀请弹窗控制
      showBindCardDialog: false, // 绑定实卡对话框控制
      currentCard: null, // 当前操作的卡片
      bindCardNo: "", // 绑定的实卡卡号
      showInputDialogFlag: false, // 输入对话框控制
      inputDialogTitle: "", // 输入对话框标题
      inputDialogPlaceholder: "", // 输入对话框提示文本
      inputDialogValue: "", // 输入对话框值
      inputDialogResolve: null, // 输入对话框Promise解析函数
      showTransferPopup: false, // 转入弹窗控制
      transferType: "", // 转入类型：wechat或alipay
      transferForm: {
        // 转入表单
        amount: "",
      },
    };
  },
  mounted() {
    this.getUserInfo();
    this.getBankList();
    this.getUserInfoData();
    this.getSystemInfo();
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    ...mapActions("systemInfo", ["getSystemInfo"]),
    // 跳转到银行卡页面
    goToBankCard() {
      this.$router.push({ name: "bankCard" });
    },
    handleCustomerService() {
      console.log("点击客服", this.systemInfo?.customerService);
      if (this.systemInfo?.customerService) {
        window.location.href = this.systemInfo.customerService;
      }
    },
    async getBankList() {
      try {
        this.pageLoading = true;
        const res = await axios.get(api.myVipCardOrder);
        if (res.code === 200 && res.data?.vipCardConfigList) {
          // 过滤掉 card_detail 是空数组的卡片，只保留 card_detail 是对象的卡片
          this.bankList = res.data.vipCardConfigList
            .filter((item) => {
              // 判断 card_detail 是否是对象而不是空数组
              const isObject =
                item.card_detail &&
                typeof item.card_detail === "object" &&
                !Array.isArray(item.card_detail);

              return isObject;
            })
            .map((item) => {
              const desc = item.describe.split(",");
              return {
                ...item,
                desc1: desc[0],
                desc2: desc[1],
              };
            });

          console.log("过滤后的卡片数据:", this.bankList);
        }
      } catch (error) {
        console.error("获取卡片列表失败:", error);
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
    formatAmount(num) {
      return num ? (num / 10000).toFixed(0) : 0;
    },

    // 添加去邀请方法
    goToInvite() {
      this.showDialog = false;
      this.$router.push({ name: "userInvite" });
    },

    // 绑定实卡卡号
    bindRealCard(card) {
      this.currentCard = card;
      this.bindCardNo = ""; // 不显示默认卡号，需要用户重新输入
      this.showBindCardDialog = true;
    },

    // 确认绑定实卡卡号
    async confirmBindCard() {
      if (!this.bindCardNo) {
        Dialog.alert({
          title: "提示",
          message: "请输入卡号",
          confirmButtonText: "确定",
          confirmButtonColor: "#F23D30",
        });
        return;
      }

      try {
        // 调用mergeBankCard接口绑定实卡卡号
        const res = await axios.post(api.mergeBankCard, {
          id: this.currentCard.id,
          bank_no: this.bindCardNo,
        });

        if (res.code === 200) {
          Toast.success("绑定成功");
          this.showBindCardDialog = false;
          // 刷新列表数据
          this.getBankList();
        } else {
          Dialog.alert({
            title: "提示",
            message: res.msg || "绑定失败",
            confirmButtonText: "确定",
            confirmButtonColor: "#F23D30",
          });
        }
      } catch (error) {
        Dialog.alert({
          title: "提示",
          message: error.msg || "绑定失败",
          confirmButtonText: "确定",
          confirmButtonColor: "#F23D30",
        });
      }
    },

    // 显示输入对话框
    showInputDialog(title, placeholder) {
      this.inputDialogTitle = title;
      this.inputDialogPlaceholder = placeholder;
      this.inputDialogValue = "";
      this.showInputDialogFlag = true;

      // 返回一个Promise，在用户确认或取消时解析
      return new Promise((resolve) => {
        this.inputDialogResolve = resolve;
      });
    },

    // 确认输入对话框
    confirmInputDialog() {
      if (this.inputDialogResolve) {
        this.inputDialogResolve(this.inputDialogValue);
        this.inputDialogResolve = null;
      }
    },

    // 取消输入对话框
    cancelInputDialog() {
      if (this.inputDialogResolve) {
        this.inputDialogResolve(null);
        this.inputDialogResolve = null;
      }
    },

    // 处理微信按钮点击
    async handleWechatAction(card) {
      this.currentCard = card;
      if (this.userInfo.wechat) {
        // 已绑定，处理转入逻辑
        await this.handleTransfer("wechat");
      } else {
        // 未绑定，显示绑定弹窗
        await this.bindWechat();
      }
    },

    // 绑定微信
    async bindWechat() {
      try {
        console.log("准备显示微信输入框");
        // 弹出输入框让用户输入微信号
        const wechatId = await this.showInputDialog(
          "绑定微信",
          "请输入您的微信号"
        );
        console.log("微信输入框返回值:", wechatId);
        if (!wechatId) return;

        // 调用接口更新微信信息
        const res = await axios.post(api.updateUserInfo, {
          type: "wechat",
          value: wechatId,
        });

        if (res.code === 200) {
          Toast.success("绑定微信成功");
          // 更新用户信息
          await this.getUserInfoData();
        } else {
          Dialog.alert({
            title: "提示",
            message: res.msg || "绑定失败",
            confirmButtonText: "确定",
            confirmButtonColor: "#F23D30",
          });
        }
      } catch (error) {
        Dialog.alert({
          title: "提示",
          message: error.msg || "绑定失败",
          confirmButtonText: "确定",
          confirmButtonColor: "#F23D30",
        });
      }
    },
    async handlePayConfirm({ pay_type, channel_type }) {
      const params = {
        pay_type,
        channel_type,
        project_id: 1,
        source: 21,
        type: this.transferType,
        coin_type: this.currentCard.invite_award_name_en,
        num: this.transferForm.amount,
        amount: this.price || 300,
      };

      try {
        const res = await axios.post(api.balancePay, params);
        this.showPayment = false;

        if (pay_type === 9) {
          // 余额支付
          await Dialog.alert({
            title: "提示",
            message: "开户申请提交成功！",
            theme: "round-button",
            confirmButtonText: "确定",
            confirmButtonColor: "#EB6400",
          });
          // 点击确定后返回上一页
          await this.getBankList();
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
    },
    // 处理支付宝按钮点击
    async handleAlipayAction(card) {
      this.currentCard = card;
      if (this.userInfo.alipay) {
        // 已绑定，处理转入逻辑
        await this.handleTransfer("alipay");
      } else {
        // 未绑定，显示绑定弹窗
        await this.bindAlipay();
      }
    },

    // 绑定支付宝
    async bindAlipay() {
      try {
        console.log("准备显示支付宝输入框");
        // 弹出输入框让用户输入支付宝账号
        const alipayId = await this.showInputDialog(
          "绑定支付宝",
          "请输入您的支付宝账号"
        );
        console.log("支付宝输入框返回值:", alipayId);
        if (!alipayId) return;

        // 调用接口更新支付宝信息
        const res = await axios.post(api.updateUserInfo, {
          type: "alipay",
          value: alipayId,
        });

        if (res.code === 200) {
          Toast.success("绑定支付宝成功");
          // 更新用户信息
          await this.getUserInfoData();
        } else {
          Dialog.alert({
            title: "提示",
            message: res.msg || "绑定失败",
            confirmButtonText: "确定",
            confirmButtonColor: "#F23D30",
          });
        }
      } catch (error) {
        Dialog.alert({
          title: "提示",
          message: error.msg || "绑定失败",
          confirmButtonText: "确定",
          confirmButtonColor: "#F23D30",
        });
      }
    },

    // 处理转入逻辑
    handleTransfer(type) {
      this.transferType = type;
      this.transferForm.amount = "";
      this.showTransferPopup = true;
    },

    // 处理全部按钮点击
    handleSetFullAmount() {
      this.transferForm.amount = this.currentCard.card_detail.invite_award || 0;
    },

    // 处理确认转入
    async handleConfirmTransfer() {
      if (
        !this.transferForm.amount ||
        isNaN(this.transferForm.amount) ||
        this.transferForm.amount <= 0
      ) {
        return Toast("请输入正确的转入金额");
      }

      try {
        // const formData = new FormData();
        // formData.append("type", this.transferType);
        // formData.append("num", this.transferForm.amount);
        // formData.append("coin_type", this.currentCard.invite_award_name_en); // 添加coin_type字段，值为列表的id
        if (Number(this.transferForm.amount) < 2000000) {
          this.price = 2000;
        } else if (Number(this.transferForm.amount) < 5000000) {
          this.price = 3000;
        } else {
          this.price = 5000;
        }
        this.showPayment = true;
        this.showTransferPopup = false;
        // this.handlePayConfirm();
        // const res = await axios.post(api.transIn, formData);

        // loading.clear();
        // this.showTransferPopup = false;

        // await Dialog.alert({
        //   message: res.msg || "您的转入申请已提交",
        // });

        await this.getBankList(); // 刷新数据
      } catch (err) {
        Dialog.alert({
          message: err.msg || "转入失败",
        }).then(() => {
          if (err.msg.includes("邀请")) {
            this.$router.push({ name: "projectList" });
          }
        });
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
        // if (card.status === 3) {
        //   if (card.card_detail && card.card_detail.status === 1) {
        //     return '立即开户';
        //   } else if (card.card_detail && card.card_detail.status === 2) {
        //     return '查看领取';
        //   }
        //   return '已领取';
        // }
        return "立即申领";
      };
    },

    // 从字符串中提取括号内的内容
    extractParenthesisContent() {
      return (text) => {
        if (!text) return "";
        // 使用中文括号正则表达式
        const match = text.match(/（([^）]+)）/);
        return match ? match[1] : "";
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

/* 按钮状态样式 */
.apply-btn.gradient {
  background: linear-gradient(346deg, #ef8f4a 9.79%, #ea4529 89.46%);
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
  width: 100%;
  position: relative;
  padding: 5px 0;
  border-bottom: 1px dashed #f0f0f0;
}

.card-info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #666;
  font-size: 14px;
  min-width: 80px;
  text-align: left;
}

.info-value {
  color: #333;
  font-size: 14px;
  flex: 1;
  text-align: left;
  word-break: break-all;
}

/* 绑定实卡按钮样式 */
.bind-btn {
  color: #f23d30;
  font-size: 12px;
  padding: 2px 8px;
  border: 1px solid #f23d30;
  border-radius: 10px;
  margin-left: 10px;
  white-space: nowrap;
}

/* 绑定微信和支付宝按钮区域 */
.bind-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.bind-wechat-btn,
.bind-alipay-btn {
  width: 48%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  padding: 0 15px;
  box-sizing: border-box;
}

.bind-wechat-btn {
  background-color: #07c160;
  color: white;
}

.bind-alipay-btn {
  background-color: #1677ff;
  color: white;
}

.bind-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.status-reviewing {
  color: #ff9800;
  font-weight: 500;
}

/* 空数据提示样式 */
.empty-data-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 250px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 20px;
}

.empty-btn {
  width: 140px;
  height: 40px;
  font-size: 16px;
  margin-top: 16px;
  background-color: #f23d30;
  border: none;
}

.bind-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.bind-title {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 2px;
  white-space: nowrap;
}

.bind-subtitle {
  font-size: 12px;
  opacity: 0.8;
}

/* 绑定卡号对话框内容样式 */
.bind-card-dialog-content {
  padding: 20px 16px;
}

.dialog-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  padding-left: 16px;
}

/* 转入弹窗样式 */
.transfer-popup-content {
  padding: 10px;
}

.transfer-popup-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.transfer-popup-form {
  margin-bottom: 20px;
}

.transfer-popup-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  padding-left: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transfer-all-btn {
  color: #1989fa;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.transfer-popup-buttons {
  margin-top: 20px;
}
/* 页面标题样式 */
.page-title-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0 10px;
  position: relative;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  position: relative;
  padding: 8px 25px;
  background: linear-gradient(to bottom, #ff3b30, #ff9500);
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(255, 59, 48, 0.3);
}
</style>
