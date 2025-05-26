<template>
  <div class="transfer-page">
    <!-- Header -->
    <div class="header">
      <van-nav-bar
        :title="pageTitle"
        left-arrow
        @click-left="onClickLeft"
        :border="false"
      />
    </div>

    <!-- Account balance card -->
    <div
      class="balance-card"
      :class="{
        'withdraw-bg': actionText === '提现',
        'other-bg': actionText !== '提现',
      }"
    >
      <div class="balance-amount">
        <div class="label">{{ pageTitle }}</div>
        <div class="amount">
          {{ unit === "股" ? Math.floor(balance) : "¥" + balance }}
        </div>
        <div class="sub-text" v-if="actionText == '提现'">
          请先绑定银行卡账号进行提现
        </div>
      </div>
      <div class="record-link" @click="jumpToWithdrawDetail">
        {{ actionText }}记录 ≫
      </div>
    </div>

    <!-- Transfer form -->
    <div class="transfer-form">
      <div class="form-container">
        <div
          class="bank-header"
          v-if="!['recommend_award', 'income_wallet'].includes(type)"
        >
          <span class="card-title" v-if="actionText != '转入'">{{
            actionText == "出售" ? "出售数量" : "提现金额"
          }}</span>
          <div
            class="bank-info"
            v-if="actionText == '转入'"
            @click="showBankCardPopup"
          >
            <span class="bank-name"
              >{{ (bankCardInfo && bankCardInfo.name) || "请先领取银行卡" }}
              {{ bankCardNumber }}</span
            >
            <van-icon name="arrow" class="arrow-icon" />
          </div>
        </div>

        <!-- 新增提现至选项 -->
        <div
          class="withdraw-to-section"
          v-if="['recommend_award', 'income_wallet'].includes(type)"
        >
          <div class="section-title">提现至</div>
          <div class="withdraw-options">
            <div
              class="option-item"
              :class="{ active: withdrawTo === 'bank' }"
              @click="selectWithdrawTo('bank')"
            >
              <van-icon name="debit-pay" />
              <span>银行卡</span>
            </div>
            <div
              class="option-item"
              :class="{ active: withdrawTo === 'wallet' }"
              @click="selectWithdrawTo('wallet')"
            >
              <van-icon name="balance-o" />
              <span>我的余额</span>
            </div>
          </div>
        </div>

        <div class="amount-section">
          <van-field
            v-model="amount"
            type="number"
            :placeholder="placeHolderText"
            :border="false"
          >
            <template #button>
              <span class="transfer-all" @click="transferAll">全部</span>
            </template>
          </van-field>
          <div class="amount-hint">
            可{{ actionText }}{{ unit === "元" ? "余额" : ""
            }}{{ unit === "股" ? Math.floor(balance) : balance }}{{ unit }}
          </div>
          <div class="amount-hint" v-if="type === 'stock_right'">
            可获得<span v-if="type === 'stock_right'" class="stock-value">
              {{
                (
                  parseFloat(balance) * parseFloat(originalStockInfo.price || 0)
                ).toFixed(2)
              }}元
            </span>
          </div>
          <div class="amount-hint" v-if="type === 'stock'">
            可获得<span v-if="type === 'stock'" class="stock-value">
              {{
                (
                  parseFloat(balance) *
                  parseFloat(day_stock_log.yesterday_min_sale_price || 0)
                ).toFixed(2)
              }}元
            </span>
          </div>
        </div>

        <div class="submit-btn">
          <div class="submit-button" @click="onSubmit">{{ actionText }}</div>
        </div>
      </div>
    </div>

    <div v-if="actionText === '提现'" class="px-4 text-[12px] text-[#666666]">
      说明:满10元即可免费提现，无特殊情况24小时之内到账。周末及节假日不可提现！
    </div>

    <!-- 添加银行卡列表弹出层 -->
    <van-popup v-model="showCardList" round position="bottom">
      <div class="card-list-popup">
        <div class="popup-header">
          <div class="popup-title">选择银行卡</div>
          <van-icon name="cross" @click="showCardList = false" />
        </div>
        <div class="card-list">
          <div
            v-for="card in bankCardList"
            :key="card.id"
            class="card-item"
            :class="{ active: bankCardInfo?.id === card.id }"
            @click="selectBankCard(card)"
          >
            <div class="card-info">
              <div class="bank-name">{{ card.name }}</div>
              <div class="card-number" v-if="card.card_detail?.bank_no">
                尾号{{ card.card_detail.bank_no.slice(-4) }}
              </div>
            </div>
            <van-icon
              name="success"
              v-if="bankCardInfo?.id === card.id"
              class="selected-icon"
            />
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import axios from "@/net/axios";
import api from "@/net/api";
import { isNullOrEmpty } from "@/utils";
import { mapState } from "vuex";
import { Field, NavBar, Icon } from "vant";

export default {
  components: {
    [Field.name]: Field,
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    bankCardNumber() {
      if (
        this.bankCardInfo &&
        this.bankCardInfo.card_detail &&
        this.bankCardInfo.card_detail.bank_no
      ) {
        return `(${this.bankCardInfo.card_detail.bank_no.slice(-4)})`;
      }
      return "";
    },
  },
  data() {
    return {
      amount: "",
      balance: this.$route.query.num || "0.00",
      title: this.$route.query.title || "0.00",
      actionText: this.$route.query.actionText || "提现",
      unit: this.$route.query.unit || "",
      type: this.$route.query.type || "",
      placeHolderText: `输入${this.$route.query.actionText}数量`,
      pageTitle:
        (this.$route.query.title || "") + (this.$route.query.actionText || ""),
      bankCardInfo: null,
      showCardList: false,
      bankCardList: [],
      originalStockInfo: {},
      day_stock_log: {},
      withdrawTo: "bank", // 新增提现至选项
    };
  },
  async mounted() {
    await this.getBankCardInfo();
    await this.getStockInfo();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpToWithdrawDetail() {
      this.$router.push({
        name: "withdrawRecord",
        query: {
          type: this.type,
        },
      });
    },
    transferAll() {
      this.amount =
        this.unit === "股" ? Math.floor(this.balance) : this.balance;
    },
    // 新增选择提现至方法
    selectWithdrawTo(type) {
      this.withdrawTo = type;
    },
    onSubmit(event) {
      event.preventDefault();
      const { amount } = this;
      if (isNullOrEmpty(amount)) {
        this.$toast("请输入" + this.actionText + "数额");
        return;
      }
      // if (parseFloat(amount) > parseFloat(this.balance)) {
      //   this.$toast(this.actionText + "数额不能大于可用余额");
      //   return;
      // }

      // if(!this.userInfo?.member_status){
      //   this.$dialog.alert({
      //     message: "请先申请会员",
      //     confirmButtonText: "立即申请",
      //   }).then(() => {
      //     this.$router.push({name: "member"});
      //   });
      //   return;
      // }
      // // 弹出提示对话框
      // this.$dialog.alert({
      //   title: "提示",
      //   message: "正在加速开放中，请留意官方通知！",
      //   theme: 'round-button',
      // });
      // return;

      const loading = this.$toast.loading({
        message: "提交中...",
        forbidClick: true,
      });

      if (this.actionText === "转入") {
        if (
          !this.bankCardInfo ||
          !this.bankCardList ||
          this.bankCardList.length === 0
        ) {
          loading.clear();
          this.$dialog
            .alert({
              title: "提示",
              message: "请先领取银行卡",
              confirmButtonText: "确定",
            })
            .then(() => {
              this.$router.push({ name: "bankCard" });
            });
          return;
        }

        axios
          .post(api.exchange, {
            id: this.bankCardInfo.id,
            num: amount,
          })
          .then(() => {
            loading.clear();
            this.$dialog
              .alert({
                title: "提示",
                message: "转入成功",
                confirmButtonText: "确定",
              })
              .then(() => {
                this.onClickLeft();
              });
          })
          .catch((err) => {
            loading.clear();

            err.msg &&
              this.$dialog
                .alert({
                  title: "提示",
                  message: err.msg || "转入失败",
                  confirmButtonText: "确定",
                })
                .then(() => {
                  if (err.msg.includes("激活银行卡")) {
                    this.$router.push({ name: "bankCard" });
                  } else if (err.msg.includes("邀请")) {
                    this.$router.push({ name: "userInvite" });
                  } else if (err.msg.includes("实名")) {
                    this.$router.push({ name: "realNameAuth" });
                  } else if (err.msg.includes("会员")) {
                    this.$router.push({ name: "member" });
                  }
                });
          });
      } else {
        const params = {
          num: amount,
          coin_type: this.type,
        };
        if (this.withdrawTo === "wallet") {
          params.to_coin_type = "balance";
        }

        axios
          .post(api.userWithdrawal, params)
          .then(() => {
            loading.clear();
            this.$dialog
              .alert({
                title: "提示",
                message: this.actionText + "成功",
                confirmButtonText: "确定",
              })
              .then(() => {
                this.onClickLeft();
              });
          })
          .catch((err) => {
            loading.clear();
            err.msg &&
              this.$dialog
                .alert({
                  title: "提示",
                  message: err.msg || "提现失败",
                  confirmButtonText: "确定",
                })
                .then(() => {
                  if (err.code == 533) {
                    this.$router.push({ name: "bindBankCard" });
                  } else if (err.msg.includes("激活银行卡")) {
                    this.$router.push({ name: "bankCard" });
                  } else if (err.msg.includes("邀请")) {
                    this.$router.push({ name: "userInvite" });
                  } else if (err.msg.includes("实名")) {
                    this.$router.push({ name: "realNameAuth" });
                  } else if (err.msg.includes("会员")) {
                    this.$router.push({ name: "member" });
                  }
                });
          });
      }
    },
    async getBankCardInfo() {
      try {
        const needBankCheck = ["invite_award"].includes(this.type);
        if (needBankCheck) {
          const res = await axios.get(api.myVipCardAward);
          if (res) {
            this.bankCardList = res.data?.vipCardConfigList.filter(
              (item) => item.status == 3
            );
            if (this.bankCardList) {
              this.bankCardInfo = this.bankCardList[0];
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    showBankCardPopup() {
      this.showCardList = true;
    },

    selectBankCard(card) {
      this.bankCardInfo = card;
      this.showCardList = false;
    },
    async getStockInfo() {
      try {
        const res = await axios.get(api.stock);
        if (res) {
          this.originalStockInfo = res.data;
        }
        const res2 = await axios.get(api.day_stock_log);
        if (res2) {
          this.day_stock_log = res2.data;
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped>
.transfer-page {
  min-height: 100vh;
  background: #f9eaea;
  background-size: cover;
}

.header .van-nav-bar {
  background: transparent;
}

.header :deep(.van-nav-bar__title) {
  color: #000000;
  font-size: 18px;
  font-weight: 500;
}

.header :deep(.van-icon) {
  color: #000000;
  font-size: 20px;
}

.balance-card {
  margin: 16px;
  padding: 10px 20px 20px;
  border-radius: 12px;
  position: relative;
  width: calc(100% - 32px);
  box-sizing: border-box;
  min-height: 153px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.withdraw-bg {
  background-image: url("~@/assets/img/profile/withdraw-card-bg.png");
}

.other-bg {
  background-image: url("~@/assets/img/profile/withdraw-card-bg2.png");
}

.balance-amount {
  text-align: left;
  margin-top: 0;
}

.balance-amount .label {
  color: #fff;
  font-size: 14px;
  margin-bottom: 8px;
}

.balance-amount .amount {
  color: #fff;
  font-size: 32px;
  font-weight: bold;
  display: flex;
  align-items: baseline;
}

.balance-amount .unit {
  font-size: 14px;
  margin-left: 4px;
  font-weight: normal;
}

.balance-amount .stock-value {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin-left: 8px;
  font-weight: normal;
}

.balance-amount .divider {
  margin: 0 8px;
  color: rgba(255, 255, 255, 0.5);
}

.balance-amount .price-trend {
  color: #ffe0b2;
  font-size: 16px;
  font-weight: 500;
}

.balance-amount .rate {
  font-size: 14px;
  margin-left: 4px;
  color: rgba(255, 255, 255, 0.8);
}

.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  color: #fff;
}

.step {
  font-size: 14px;
}

.arrow {
  margin: 0 10px;
  font-size: 14px;
}

.record-link {
  position: absolute;
  top: 10px;
  right: 20px;
  color: #fff;
  font-size: 14px;
}

.transfer-form {
  margin: 20px 16px;
}

.form-container {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.bank-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.card-title {
  color: #e60012;
  font-size: 14px;
}

.bank-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.bank-name {
  color: #000;
  font-size: 14px;
}

.arrow-icon {
  color: #999;
  font-size: 14px;
}

/* 新增提现至选项样式 */
.withdraw-to-section {
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.section-title {
  color: #333;
  font-size: 14px;
  margin-bottom: 12px;
}

.withdraw-options {
  display: flex;
  gap: 12px;
}

.option-item {
  flex: 1;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.option-item.active {
  background: #fff5f5;
  border-color: #e60012;
  color: #e60012;
}

.option-item .van-icon {
  font-size: 20px;
}

.amount-section {
  padding: 12px;
}

.amount-section .van-field {
  padding: 12px 16px;
  background: #ffffff;
  border: 2px solid #dcdcdc;
  border-radius: 8px;
}

.amount-section :deep(.van-field__control) {
  font-size: 16px;
  color: #333;
}

.amount-section :deep(.van-field__control::placeholder) {
  color: #999;
}

.transfer-all {
  color: #ff6b00;
  font-size: 14px;
  padding-right: 8px;
}

.amount-hint {
  color: #ff6b00;
  font-size: 12px;
  margin-top: 8px;
  text-align: right;
  padding: 0 4px;
}

.amount-hint .stock-value {
  color: #ff6b00;
}

.submit-btn {
  padding: 16px;
}

.submit-button {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  background: linear-gradient(90deg, #ff6a57, #f23d30);
  color: #fff;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.withdraw-tip {
  text-align: center;
  color: #1368d3;
  font-size: 12px;
  margin-top: 12px;
}

.card-list-popup {
  padding: 16px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 16px;
  border-bottom: 1px solid #eee;
}

.popup-title {
  font-size: 16px;
  font-weight: 500;
}

.card-list {
  max-height: 60vh;
  overflow-y: auto;
}

.card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.card-item.active {
  color: #e60012;
}

.card-info {
  flex: 1;
}

.card-info .bank-name {
  font-size: 16px;
  margin-bottom: 4px;
}

.card-info .card-number {
  font-size: 14px;
  color: #999;
}

.selected-icon {
  color: #e60012;
  font-size: 20px;
}

.bank-info {
  cursor: pointer;
}
</style>
