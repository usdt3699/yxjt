<template>
  <div class="flex flex-col h-screen">
    <!-- loading遮罩 -->
    <van-overlay :show="pageLoading" class="flex items-center justify-center">
      <van-loading type="spinner" color="#fff" size="36" vertical>加载中...</van-loading>
    </van-overlay>

    <!-- 标题栏 -->
    <div class="h-[44px] flex items-center justify-center px-4"
         style="background: radial-gradient(352.65% 128.18% at 21.33% -5.63%, #FE462D 0%, #FF867D 58.53%, #F52735 100%);">
      <span class="text-white text-lg">资环中心</span>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 overflow-y-auto bg-[#F5F5F5] pb-16">
      <van-pull-refresh
          v-model="refreshing"
          @refresh="onRefresh"
          head-height="50"
          loading-text="加载中..."
          pulling-text=""
          loosing-text=""
          success-text=""
          :loading-icon="loadingIcon"
          class="custom-loading"
      >
        <!-- 数据展示区域 -->
        <div class="mx-4 mt-4 bg-white rounded-[10px] shadow-lg p-4">
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-[#DB3B21] text-sm mb-1">团队奖励</div>
              <div class="text-[#313131] font-medium mb-2">
                <span class="text-lg">{{ walletInfo.team_award.amount||''  }}</span>
                <span class="text-sm ml-1">元</span>
              </div>
              <button
                  class="w-[60px] h-[26px] text-xs bg-[#FF4341] text-white rounded"
                  @click="jumpToWithdraw(walletInfo.team_award)"
              >提现
              </button>
            </div>
            <div class="text-center">
              <div class="text-[#DB3B21] text-sm mb-1">每日提现额度</div>
              <div class="text-[#313131] font-medium mb-2">
                <span class="text-lg">{{ walletInfo.invite_award.daily_limit||''  }}</span>
                <span class="text-sm ml-1">元</span>
              </div>
              <button
                  class="w-[60px] h-[26px] text-xs bg-[#FF4341] text-white rounded"
                  @click="jumpToWithdraw(walletInfo.invite_award)"
              >提现
              </button>
            </div>
            <div class="text-center">
              <div class="text-[#DB3B21] text-sm mb-1">股权</div>
              <div class="text-[#313131] font-medium mb-2">
                <span class="text-lg">{{ walletInfo.stock.amount | formatAmount }}</span>
                <span class="text-sm ml-1">股</span>
              </div>
              <button
                  class="w-[60px] h-[26px] text-xs bg-[#FF4341] text-white rounded"
                  @click="jumpToWithdraw(walletInfo.stock)"
              >抛售
              </button>
            </div>
          </div>
        </div>

        <!-- Banner图 -->
        <div class="mx-4 mt-4" @click="goToTeamInvite">
          <img src="@/assets/img/zhzx/zhzx_banner.png" class="w-full rounded-[10px]"/>
        </div>

        <!-- 项目列表 -->
        <div class="px-4 mt-4">
          <div v-for="(item, index) in projectList" :key="index"
               class="bg-white rounded-[10px] mb-3 overflow-hidden">
            <!-- 标题和价格 -->
            <div class="px-4 py-3 flex justify-between items-center">
              <span class="text-[#333] text-base font-medium">{{ item.title }}</span>
              <span class="text-[#F52735] text-base px-2 py-1 rounded-[5px] bg-[rgba(185,75,75,0.10)]">
                ¥{{ item.price }}
              </span>
            </div>

            <!-- 项目内容 -->
            <div class="px-4 py-3 grid grid-cols-3 gap-4">
              <div class="text-center">
                <div class="text-[#F52735] text-base font-medium mb-1">{{ item.dailyBonus }}元</div>
                <div class="text-[#666] text-sm">每日分红</div>
              </div>
              <div class="text-center">
                <div class="text-[#F52735] text-base font-medium mb-1">{{ item.shares }}股</div>
                <div class="text-[#666] text-sm">股权</div>
              </div>
              <div class="text-center">
                <div class="text-[#F52735] text-base font-medium mb-1">{{ item.period }}天</div>
                <div class="text-[#666] text-sm">收益周期</div>
              </div>
            </div>

            <!-- 进度条 -->
            <div class="px-4 pb-3">
              <div class="flex items-center">
                <div class="flex-1 h-[6px] bg-[#FFB2B2] rounded-[50px] overflow-hidden">
                  <div class="h-full bg-[#B01818] rounded-[50px]" :style="{width: item.progress + '%'}"></div>
                </div>
                <span class="text-sm text-[#AE1C1C] ml-2">{{ item.progress }}%已售出</span>
              </div>
            </div>

            <!-- 激活按钮 -->
            <button
                class="w-full h-12 bg-[#FFD46D] text-[#333] text-base font-medium"
                @click="activateProject(item)"
            >
              激活
            </button>
          </div>
        </div>

        <payment-dialog
            v-model="showPayment"
            :amount="currentProject?.price"
            @confirm="handlePayConfirm"
        />

      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import {Icon, Picker, Popup, PullRefresh, Overlay, Loading, Dialog} from "vant";
import axios from "@/net/axios";
import api from "@/net/api";
import PaymentDialog from '@/components/common/PaymentDialog.vue'

export default {
  name: "environmentalCentral",
  components: {
    [PullRefresh.name]: PullRefresh,  // 正确注册 PullRefresh 组件
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Icon.name]: Icon,
    PaymentDialog,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
  },
  data() {
    return {
      refreshing: false,
      loadingIcon: 'loading',
      projectList: [],
      showPayment: false,
      currentProject: null,
      pageLoading: true,
      showSuccessDialog: false,
      walletInfo: {
        team_award: {
          amount: '0.00',
          title: '团队奖励',
          type: 'team_award'
        },
        invite_award: {
          amount: '0.00',
          title: '资环资金',
          type: 'invite_award',
          daily_limit: '0.00'
        },
        stock: {
          amount: '0.00',
          title: '股权',
          type: 'stock'
        }
      }
    }
  },
  methods: {
    async getUserWallet() {
      try {
        const res = await axios.get(api.userWallet)
        const coinList = res.data.coinList;

        // 把数组转成对象，方便管理和使用
        const walletData = {
          team_award: {
            amount: '0.00',
            title: '团队奖励',
            type: 'team_award'
          },
          invite_award: {
            amount: '0.00',
            title: '资环资金',
            type: 'invite_award',
            daily_limit: '0.00'
          },
          stock: {
            amount: '0.00',
            title: '股权',
            type: 'stock'
          }
        }

        // 更新钱包数据
        coinList.forEach(coin => {
          if (walletData[coin.name_en]) {
            walletData[coin.name_en].amount = coin.num || '0.00';
            walletData[coin.name_en].title = coin.name;
          }
          // 找到day_withdraw数据时更新invite_award的daily_limit
          if (coin.name_en === 'day_withdraw') {
            walletData.invite_award.daily_limit = coin.num || '0.00';
          }
        })

        this.walletInfo = walletData;

      } catch (err) {
        console.log(err)
      }
    },

    async fetchData() {
      try {
        // 同时获取项目列表和钱包数据
        await Promise.all([
          this.getUserWallet(),
          // 原有的获取项目列表逻辑
          axios.get(api.welfareList, {
            params: {type: 2}
          }).then(res => {
            if (res.code === 200 && res.data.idoList) {
              this.projectList = res.data.idoList.map(item => ({
                title: item.name,
                price: item.price,
                dailyBonus: item.day_income,
                shares: item.gift_coin_num,
                period: item.total_day,
                progress: Math.floor(Math.random() * 100),
                id: item.id
              }));
            }
          })
        ])
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        this.pageLoading = false
      }
    },

    async onRefresh() {
      this.refreshing = true;
      await this.fetchData();
      this.refreshing = false;
      this.pageLoading = false;
    },

    goToTeamInvite() {
      this.$router.push({name: "teamInvite"});
    },

    activateProject(project) {
      this.currentProject = project
      this.showPayment = true
    },

    async handlePayConfirm({payType}) {
      try {
        const params = {
          source: 2,
          pay_type: payType,
          project_id: this.currentProject.id,
          amount: this.currentProject.price
        }

        const res = await axios.post(api.balancePay, params)
        this.showPayment = false

        if (payType === 9) {
          await this.fetchData()
          await this.$dialog.alert({
            title: '提示',
            message: '购买成功！',
            theme: 'round-button',
            confirmButtonText: '确定',
            confirmButtonColor: '#F52735'
          })
          return
        }

        if (res.data?.payUrl) {
          window.location.href = res.data.payUrl
        }

      } catch (err) {
        this.$toast(err.msg || '支付失败')
      }
    },

    jumpToWithdraw(data) {
      // 如果是股权抛售
      if (data.type === 'stock') {
        this.$dialog.alert({
          title: '提示',
          message: '暂未开启抛售',
          theme: 'round-button',
          confirmButtonText: '确定',
          confirmButtonColor: '#F52735'
        });
        return;
      }

      // 其他类型继续原来的跳转逻辑
      this.$router.push({
        name: "withdrawal",
        query: data,
      });
    },
  },
  created() {
    this.fetchData();
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
  },
}
</script>

<style scoped lang="less">
.custom-loading {
  :deep(.van-pull-refresh__head) {
    .van-loading {
      .van-loading__spinner {
        color: #999 !important;
      }

      .van-loading__text {
        color: #999 !important;
      }
    }

    .van-pull-refresh__text {
      color: #999 !important;
    }
  }
}

.bg-gradient-text {
  background: linear-gradient(180deg, #FF5A46 0%, #F62836 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'PingFang SC';
}
</style>
