<template>
  <div class="transfer-page">
    <!-- Header with back button -->
    <div class="header">
      <van-nav-bar
        title="转账"
        left-arrow
        @click-left="onBack"
        :border="false"
      />
    </div>

    <!-- Account balance card -->
    <div class="balance-card">
      <div class="account-number">
        <img class="bank-icon" src="@/assets/img/login/logo.png" />
        <span>**** 7972</span>
        <router-link to="/transfer-detail" class="detail-link">
          转账明细 ≫
        </router-link>
      </div>

      <div class="balance-amount flex flex-col justify-center items-center">
        <div class="label">账户余额</div>
        <div class="amount">¥ 39999.00</div>
      </div>
    </div>

    <!-- Transfer form -->
    <div class="transfer-form ">
      <van-cell-group :border="false" class="form-group">
        <van-cell title="转入到现金余额" is-link>
          <template #right-icon>
            <img src="~@/assets/img/profile/arrow-right.png" class="custom-arrow" />
          </template>
        </van-cell>
        <van-cell title="本行转账" is-link>
          <template #right-icon>
            <img src="~@/assets/img/profile/arrow-right.png" class="custom-arrow" />
          </template>
        </van-cell>

        <div class="amount-input">
          <van-field
            v-model="transferAmount"
            type="number"
            placeholder="输入转入金额"
            :border="false"
          >
            <template #button>
              <span class="transfer-all" @click="transferAll">全部转入</span>
            </template>
          </van-field>
        </div>

        <div class="amount-hint">
          可转入余额39999元
        </div>
      </van-cell-group>

      <!-- Submit button -->
      <div class="submit-btn">
        <van-button type="primary" block @click="onSubmit">确认</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransferPage',
  data() {
    return {
      transferAmount: ''
    }
  },
  methods: {
    onBack() {
      this.$router.back()
    },
    transferAll() {
      this.transferAmount = '39999'
    },
    onSubmit() {
      // Handle transfer submission
      this.$dialog.confirm({
        title: '确认转账',
        message: `确认转入 ${this.transferAmount} 元？`
      }).then(() => {
        // Process transfer
      })
    }
  }
}
</script>

<style scoped>
.transfer-page {
  min-height: 100vh;
  background: url('~@/assets/img/profile/transfer-bg.png') no-repeat;
  background-size: cover;
}

.header .van-nav-bar {
  background: transparent;
}

.header .van-nav-bar__title {
  color: #333;
  font-size: 18px;
}

.header .van-icon {
  color: #333;
}

.balance-card {
  margin: 20px 16px;
  padding: 20px;
  background: url('~@/assets/img/profile/balance-card-bg.png') no-repeat;
  background-size: cover;
  border-radius: 12px;
}

.account-number {
  display: flex;
  align-items: center;
}

.bank-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.detail-link {
  margin-left: auto;
  color: #333;
  font-size: 14px;
  text-decoration: none;
}

.balance-amount {
  margin-top: 30px;
}

.balance-amount .label {
  color: #666;
  font-size: 14px;
}

.balance-amount .amount {
  margin-top: 8px;
  font-size: 32px;
  font-weight: bold;
}

.transfer-form {
  margin: 20px 16px;
}

.form-group {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.transfer-form .van-cell {
  padding: 16px;
  align-items: center;
}

.transfer-form .van-cell::after {
  border-color: #f5f5f5;
}

/* 隐藏默认的右箭头图标 */
.transfer-form >>> .van-cell__right-icon {
  display: none;
}

/* 自定义箭头图标样式 */
.custom-arrow {
  width: 16px;
  height: 16px;
  margin-left: 8px;
}

.amount-input {
  padding: 16px;
}

.transfer-all {
  color: #ff6b00;
  font-size: 14px;
}

.amount-hint {
  padding: 0 16px 16px;
  color: #ff6b00;
  font-size: 12px;
}

.submit-btn {
  padding: 20px 16px;
}

.submit-btn .van-button {
  height: 44px;
  font-size: 16px;
  border-radius: 22px;
  background: linear-gradient(to right, #0088ff, #0055ff);
}

/* 深度选择器替代方案 */
.transfer-page >>> .van-nav-bar {
  background: transparent;
}

.transfer-page >>> .van-nav-bar__title {
  color: #333;
  font-size: 18px;
}

.transfer-page >>> .van-icon {
  color: #333;
}
</style>
