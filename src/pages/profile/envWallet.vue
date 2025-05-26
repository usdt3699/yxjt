<template>
  <div class="flex flex-col h-screen">
    <!-- loading遮罩 -->
    <van-overlay :show="pageLoading" class="flex items-center justify-center">
      <van-loading type="spinner" color="#fff" size="36" vertical>加载中...</van-loading>
    </van-overlay>

    <!-- 标题栏 -->
    <div class="h-[44px] flex items-center px-4 relative" style="background: radial-gradient(352.65% 128.18% at 21.33% -5.63%, #FE462D 0%, #FF867D 58.53%, #F52735 100%);">
      <van-icon name="arrow-left" class="text-white" @click="onClickLeft" />
      <span class="text-white text-lg absolute left-1/2 -translate-x-1/2">资环钱包</span>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 overflow-y-auto bg-[#F9948E] pb-16">
      <van-pull-refresh
        v-model="refreshing"
        @refresh="onRefresh"
        class="custom-loading"
      >
        <!-- 余额显示 -->
        <div class="px-4 pt-6 pb-4">
          <div class="bg-white rounded-lg p-4 shadow-[0px_4px_16px_0px_rgba(38,51,77,0.08)] flex flex-col items-center justify-center">
            <div class="text-[#A62727] text-sm" style="font-family: 'PingFang SC'; line-height: 22px;">余额总额</div>
            <div class="flex items-baseline mt-2">
              <span class="text-[#313131] text-2xl font-normal" style="font-family: 'PingFang SC'; line-height: 22px;">
                {{ walletInfo.amount }}
              </span>
              <span class="text-[#313131] text-[15px]" style="font-family: 'PingFang SC'; line-height: 22px;">元</span>
            </div>
          </div>

          <!-- 提现模块 -->
          <div class="bg-white rounded-lg p-4 mt-4 shadow-[0px_4px_16px_0px_rgba(38,51,77,0.08)]">
            <!-- 输入框 -->
            <div class="border border-[#B9C0CD] rounded-lg h-[58px] flex items-center mb-3">
              <van-field
                v-model="withdrawAmount"
                type="number"
                placeholder="请输入提现金额"
                center
                :border="false"
                input-align="center"
                class="flex-1"
              />
            </div>

            <!-- 当前提现金额显示 -->
            <div class="flex items-center mb-4">
              <span class="text-[#333] text-sm">当前可提现</span>
              <div class="flex items-baseline ml-1">
                <span class="text-[#E62E22] text-xs font-normal"
                      style="font-family: 'PingFang SC'; line-height: 18px;">
                  {{ walletInfo.currentAmount }}
                </span>
                <span class="text-[#E62E22] text-xs ml-1"
                      style="font-family: 'PingFang SC'; line-height: 18px;">元</span>
              </div>
            </div>

            <!-- 按钮组 -->
            <div class="flex gap-3">
              <button class="flex-1 h-[40px] bg-[#F52735] rounded-lg text-white"
                      @click="handleWithdraw"
                      :disabled="submitting"
                      style="font-family: 'PingFang SC'; font-size: 15px; font-weight: 400; line-height: 22px;">
                {{ submitting ? '提交中...' : '立即提现' }}
              </button>
              <button class="flex-1 h-[40px] bg-[#C06B65] rounded-lg text-white"
                      @click="jumpToWithdrawDetail('zihuan_wallet')"
                      style="font-family: 'PingFang SC'; font-size: 15px; font-weight: 400; line-height: 22px;">
                明细
              </button>
            </div>
          </div>
        </div>

        <!-- 投资中心卡片 -->
        <div class="px-4 pb-3">
          <div class="bg-white rounded-lg p-4">
            <!-- 投资中心累计分红标题 -->
            <div class="text-center mb-2">
              <span class="text-[#A62727]"
                    style="font-family: 'PingFang SC'; font-size: 15px; font-weight: 400; line-height: 22px;">
                投资中心累计分红
              </span>
            </div>
            <!-- 分红数值 -->
            <div class="text-center mb-3">
              <span class="text-[#313131]"
                    style="font-family: 'PingFang SC'; font-size: 20px; font-weight: 400; line-height: 22px;">
                {{ investmentData.valid_num }}/{{ investmentData.total_num }}
              </span>
            </div>

            <!-- 分割线 -->
            <div class="h-[1px] bg-[#EBEDF0] mb-3"></div>

            <!-- 投资中心标题 -->
            <div class="text-center mb-3">
              <span class="text-[#A62727]"
                    style="font-family: 'PingFang SC'; font-size: 19px; font-weight: 400; line-height: 22px;">
                投资中心
              </span>
            </div>

            <!-- 三个指标 -->
            <div class="flex justify-between mt-2">
              <div class="text-center">
                <div class="text-[#A62727] text-xs mb-1">投资总额余额</div>
                <div class="text-[#313131]"
                     style="font-family: 'PingFang SC'; font-size: 20px; font-weight: 400; line-height: 22px;">
                  {{ investmentData.total_buy_amount }} 元
                </div>
              </div>
              <div class="text-center">
                <div class="text-[#A62727] text-xs mb-1">投资总红利率</div>
                <div class="text-[#313131]"
                     style="font-family: 'PingFang SC'; font-size: 20px; font-weight: 400; line-height: 22px;">
                  {{ investmentData.day_rate }}%
                </div>
              </div>
              <div class="text-center">
                <div class="text-[#A62727] text-xs mb-1">每日收益</div>
                <div class="text-[#313131]"
                     style="font-family: 'PingFang SC'; font-size: 20px; font-weight: 400; line-height: 22px;">
                  {{ investmentData.zihuan_wallet }} 元
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 功能按钮组 -->
        <div class="px-4 pb-3 grid grid-cols-2 gap-3">
          <div v-for="item in projectList"
               :key="item.id"
               class="bg-white rounded-lg p-4">
            <div class="text-[#182946] text-center mb-2"
                 style="font-family: 'PingFang SC'; font-size: 16px; font-weight: 400; line-height: 24px;">
              {{ item.describe }}
            </div>
            <div class="border border-[#B9C0CD] rounded-lg mb-2">
              <van-field
                v-model="projectInputs[item.id]"
                type="number"
                placeholder="请输入"
                center
                :border="false"
                input-align="center"
                class="flex-1"
              />
            </div>
            <button class="w-full h-[32px] bg-[#F52735] rounded text-white"
                    @click="handleActivate(item)">
              激活
            </button>
          </div>
        </div>

      </van-pull-refresh>
    </div>

    <!-- 在 template 顶层添加 loading 遮罩 -->
    <van-overlay :show="submitting" class="flex items-center justify-center">
      <van-loading type="spinner" color="#fff" size="36" vertical>提交中...</van-loading>
    </van-overlay>

    <!-- 支付弹窗 -->
    <payment-dialog
      v-model="showPayment"
      :amount="currentProject?.price"
      @confirm="handlePayConfirm"
    />
  </div>
</template>

<script>
import {Field, Icon, PullRefresh, Overlay, Loading} from "vant";
import axios from '@/net/axios'
import api from '@/net/api'
import PaymentDialog from '@/components/common/PaymentDialog.vue'

export default {
  name: "envWallet",
  components: {
    [Icon.name]: Icon,
    [PullRefresh.name]: PullRefresh,
    [Field.name]: Field,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    PaymentDialog,
  },
  data() {
    return {
      refreshing: false,
      submitting: false,
      withdrawAmount: '',
      walletInfo: {},
      projectList: [],
      showPayment: false, // 支付弹窗
      currentProject: null, // 当前选中项目
      projectInputs: {}, // 存储每个项目的输入金额
      investmentData: {
        valid_num: 0
      }
    };
  },
  created() {
    this.getUserWallet()
    this.getProjectList()
    this.getInvestmentData()
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpToWithdrawDetail(type) {
      this.$router.push({
        name: "fundDetail",
        query: {type},
      });
    },
    onRefresh() {
      this.refreshing = true
      this.pageLoading = true
      Promise.all([
        this.getUserWallet(),
        this.getProjectList(),
        this.getInvestmentData()
      ]).finally(() => {
        this.refreshing = false
        this.pageLoading = false
      })
    },
    getUserWallet() {
      return axios.get(api.userWallet)
        .then((res) => {
          const coinList = res.data.coinList;
          const inviteAwardData = coinList.find(coin => coin.name_en === 'zihuan_wallet')

          if(inviteAwardData) {
            this.walletInfo = {
              amount: inviteAwardData.num || '0.00',
              currentAmount: inviteAwardData.num || '0.00',
              title: inviteAwardData.name || '资环钱包',
              type: inviteAwardData.name_en || 'zihuan_wallet'
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    handleWithdraw() {
      if (this.investmentData.valid_num < 15) {
        this.$dialog.alert({
          message: '请完成15次投资中心累计分红',
          confirmButtonText: '确定',
          confirmButtonColor: '#F34947',
        });
        return;
      }

      if (!this.withdrawAmount) {
        this.$toast("请输入提现金额");
        return;
      }

      if (parseFloat(this.withdrawAmount) > parseFloat(this.walletInfo.currentAmount)) {
        this.$toast("提现金额不能大于可用余额");
        return;
      }

      this.submitting = true;

      axios.post(api.userWithdrawal, {
        num: this.withdrawAmount,
        coin_type: this.walletInfo.type,
      }).then((res) => {
        this.$dialog.alert({
          message: '提现成功，审核5-7个工作日',
          confirmButtonText: '确定',
          confirmButtonColor: '#F34947',
        });
        this.withdrawAmount = '';
        this.getUserWallet();
      }).catch((err) => {
        err.msg && this.$toast(err.msg);
      }).finally(() => {
        this.submitting = false;
      });
    },
    // 获取项目列表
    async getProjectList() {
      try {
        const res = await axios.get(api.receiveList, {
          params: { type: 4 }
        })
        if (res.data?.inviteConfigList) {
          this.projectList = res.data.inviteConfigList
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 激活项目
    handleActivate(project) {
      const amount = this.projectInputs[project.id]
      if (!amount) {
        this.$toast("请输入金额");
        return;
      }

      this.currentProject = {
        ...project,
        price: amount
      }
      this.showPayment = true
    },
    // 处理支付确认
    async handlePayConfirm({ payType }) {
      try {
        const params = {
          source: 11, // 资环钱包
          pay_type: payType,
          project_id: this.currentProject.id,
          amount: this.currentProject.price
        }

        const res = await axios.post(api.balancePay, params)
        this.projectInputs[this.currentProject.id] = '' // 清空输入
        this.currentProject = null
        this.showPayment = false

        if (payType === 9) {
          await this.$dialog.alert({
            title: '提示',
            message: '购买成功！',
            theme: 'round-button',
            confirmButtonText: '确定',
            confirmButtonColor: '#F52735'
          })
          await this.getUserWallet()
          return
        }

        if (res.data?.payUrl) {
          window.location.href = res.data.payUrl
        }

      } catch (err) {
        this.$toast(err.msg || '支付失败')
      }
    },

    async getInvestmentData() {
      try {
        const res = await axios.post(api.myInvestment)
        if (res.data?.data) {
          this.investmentData = res.data.data
        }
      } catch (err) {
        console.log(err)
      }
    },
  },
  filters: {
    formatAmount(value) {
      if (!value || isNaN(value)) {
        return '0';
      }
      const num = Number(value);
      if (Number.isInteger(num)) {
        return num.toString();
      }
      return num.toFixed(2);
    }
  }
}
</script>

<style scoped lang="less">
.custom-loading {
  :deep(.van-pull-refresh__head) {
    .van-loading {
      .van-loading__spinner {
        color: #fff !important;
      }
      .van-loading__text {
        color: #fff !important;
      }
    }
    .van-pull-refresh__text {
      color: #fff !important;
    }
  }
}

.page-container {

}
.page-body{
  background-image: url('../../assets/img/invite/bg_invite.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.def-box {

  background-color:#FFF7EC;
  padding: 30px 15px;

  .left {
    width: 40%;
    text-align: center;
  }

  .right {
    display: flex;
    align-items: center;
    border-top: 1px dashed #AB0F13;;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .btn1 {
    display: block;
    background-image: linear-gradient(180deg, #FDE0B4 0%, #FFC771 100%);
    color: #AB0F13;
    border-radius: 4px;
    margin: 2rem auto .1rem;
    font-size: 14px;
    padding: 5px 10px;
  }

  .img {
    width: 60%;
    margin-top: 10px;
  }

  .text {
    color: #000;
    font-size: 16px;
  }
}

.share-address button {
  width: 45%;
  line-height: 35px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  background: rgba(255, 255, 255, .4);
  border-radius: 35px;
  display: block;
  margin: 0 auto;

  .btn1 {
    background-image: linear-gradient(180deg, #FDE0B4 0%, #FFC771 100%);
    width: 150px;
    margin-bottom: .1rem;
    color: #AB0F13;
  }
}

.custom-field {
  :deep(.van-cell) {
    height: 58px;
    background-color: transparent;
    padding: 0 16px;
  }

  /* 移除 van-field 默认的边框和圆角 */
  :deep(.van-field__control) {
    border: none;
    border-radius: 0;
  }
}

/* 确保外层容器的圆角正常显示 */
.border {
  overflow: hidden;  /* 添加这行确保内部元素不会超出圆角 */
}

</style>
