<template>
  <div class="min-h-screen relative pb-[20px]">
    <div class="w-full relative">
      <img
        src="@/assets/img/home/bg_common2.png"
        alt="背景"
        class="w-full h-full"
      />
      <div class="absolute top-0 left-0 right-0">
        <!-- 顶部区域 -->
        <div class="flex justify-between items-center pt-[15px] px-[10px]">
          <!-- 左侧logo -->
          <img
            src="@/assets/img/home/logo.png"
            alt="越秀集团"
            class="h-[40px]"
          />
          <!-- 右侧客服图标 -->
          <div
            class="flex flex-col items-center"
            @click="handleCustomerService"
          >
            <img
              src="@/assets/img/home/customer_service_icon.png"
              alt="客服"
              class="w-[24px]"
            />
            <span class="mt-1 text-xs text-[#333]">客服</span>
          </div>
        </div>
        <!-- Loading overlay remains unchanged -->
        <van-overlay
          :show="pageLoading"
          class="flex items-center justify-center z-[99]"
        >
          <van-loading type="spinner" color="#fff" size="36" vertical
            >加载中...
          </van-loading>
        </van-overlay>
        <div class="profile-scroll-container" v-if="!pageLoading">
          <div class="profile-scroll-content pt-10 pb-4">
            <!-- 用户信息区域 -->
            <div class="user-info-section px-4 mb-4">
              <!-- 左侧用户信息 -->
              <div class="flex w-full">
                <!-- 头像背景 -->
                <div
                  class="user-avatar-bg w-[81px] h-[81px] flex-shrink-0 bg-white rounded-full flex items-center justify-center shadow-custom"
                >
                  <img
                    :src="
                      userInfo.head_img ||
                      require('@/assets/img/home/default_avatar.png')
                    "
                    alt="用户头像"
                    class="w-[70px] h-[70px] rounded-full object-cover"
                    @click="jumpToPage('userInfo')"
                  />
                </div>
                <!-- 用户详细信息 -->
                <div class="ml-[15px] flex-1 flex flex-col justify-center">
                  <!-- 股东等级标识 -->
                  <div
                    v-if="userInfo.stock_vip_level"
                    :class="['stock-vip-badge', getStockVipClass]"
                    class="mb-[5px]"
                  >
                    <div class="stock-vip-text">{{ getStockVipText }}</div>
                  </div>

                  <div class="flex items-center">
                    <span class="user-name">{{ displayName }}</span>
                    <div
                      v-if="userInfo.is_identify"
                      class="flex items-center ml-[10px]"
                    >
                      <img
                        src="@/assets/img/profile/verified_icon.png"
                        alt="已实名"
                        class="w-[15px] h-[15px]"
                      />
                      <span class="verified-text ml-[3px]">已实名</span>
                    </div>
                    <!-- 会员标识 -->
                    <div
                      class="flex items-center ml-[5px] member-badge"
                      @click="toShow"
                    >
                      <img
                        src="@/assets/img/member/member_badge_bg.svg"
                        alt="会员背景"
                        class="member-badge-bg"
                      />
                      <div class="member-badge-content">
                        <img
                          src="@/assets/img/member/member_check.png"
                          alt="会员图标"
                          class="member-icon"
                        />
                        <span
                          :class="[
                            'member-text',
                            {
                              'member-text-pending':
                                userInfo.is_member !== 1 &&
                                userInfo.is_member !== 2,
                            },
                          ]"
                        >
                          {{
                            userInfo.is_member === 1
                              ? "越秀会员"
                              : userInfo.is_member === 2
                              ? "升级会员"
                              : "待审核会员"
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-row justify-between">
                    <div>
                      <div class="user-phone mt-[5px]">
                        {{ userInfo.name | maskPhoneNumber }}
                      </div>
                      <div class="user-invite-code mt-[5px]">
                        邀请码：{{ userInfo.code }}
                      </div>
                    </div>
                    <!-- 右侧签到区域 -->
                    <div class="flex flex-col items-end justify-end">
                      <div
                        class="sign-in-btn px-[15px] py-[2px]"
                        @click="handleSignIn"
                      >
                        签到
                      </div>
                      <div
                        class="invite-link-text mt-[5px]"
                        @click="onCopyText"
                      >
                        复制邀请链接 >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 我的钱包区域 -->
            <div class="wallet-section rounded-t-xl px-4 py-[15px] bg-white">
              <!-- 标题行 -->
              <div class="flex justify-between items-center mb-[15px]">
                <div class="wallet-title">我的钱包</div>
              </div>

              <!-- 钱包内容使用Flex布局 -->
              <div class="wallet-flex-container">
                <!-- 第一行 -->
                <div class="wallet-row">
                  <template v-for="(item, index) in walletList.slice(0, 3)">
                    <div :key="index" class="wallet-flex-item">
                      <div class="wallet-item-title">{{ item.title }}</div>
                      <div class="wallet-item-amount">{{ item.num }}</div>
                      <div class="wallet-item-buttons">
                        <div
                          class="wallet-item-detail-btn px-[12px] py-[2px] mt-[5px]"
                          @click="jumpToWithdrawDetail(item)"
                        >
                          明细
                        </div>
                        <div
                          class="wallet-item-btn px-[12px] py-[2px] mt-[5px]"
                          @click="jumpToWithdraw(item)"
                        >
                          {{ item.actionText }}
                        </div>
                      </div>
                    </div>
                    <div
                      :key="`divider-${index}`"
                      v-if="index < 1"
                      class="wallet-divider"
                    ></div>
                  </template>
                </div>

                <!--                 第二行-->
                <div class="wallet-row">
                  <template v-for="(item, index) in walletList.slice(3, 6)">
                    <div :key="index + 3" class="wallet-flex-item">
                      <div class="wallet-item-title">{{ item.title }}</div>
                      <div class="wallet-item-amount">{{ item.num }}</div>
                      <div class="wallet-item-buttons">
                        <div
                          class="wallet-item-detail-btn px-[12px] py-[2px] mt-[5px]"
                          @click="jumpToWithdrawDetail(item)"
                        >
                          明细
                        </div>
                        <div
                          class="wallet-item-btn px-[12px] py-[2px] mt-[5px]"
                          @click="jumpToWithdraw(item)"
                        >
                          {{ item.actionText }}
                        </div>
                      </div>
                    </div>
                    <div
                      :key="`divider-${index + 3}`"
                      v-if="index < 2"
                      class="wallet-divider"
                    ></div>
                  </template>
                </div>

                <!-- 第三行 -->
                <div class="wallet-row2">
                  <div class="wallet-flex-item2 w-1/3">
                    <div class="wallet-item-title">
                      {{ walletList[6].title }}
                    </div>
                    <div class="wallet-item-amount">
                      {{ walletList[6].num }}
                    </div>
                    <div class="wallet-item-buttons">
                      <div
                        class="wallet-item-detail-btn px-[12px] py-[2px] mt-[5px]"
                        @click="jumpToWithdrawDetail(walletList[6])"
                      >
                        明细
                      </div>
                      <div
                        class="wallet-item-btn px-[12px] py-[2px] mt-[5px]"
                        @click="jumpToWithdraw(walletList[6])"
                      >
                        {{ walletList[6].actionText }}
                      </div>
                    </div>
                  </div>
                  <!--&lt;!&ndash;                  <div class="wallet-divider"></div>&ndash;&gt;-->
                  <!--&lt;!&ndash;                  <div class="wallet-flex-item">&ndash;&gt;-->
                  <!--&lt;!&ndash;                    <div class="wallet-item-title">{{walletList[7].title}}</div>&ndash;&gt;-->
                  <!--&lt;!&ndash;                    <div class="wallet-item-amount">{{walletList[7].num}}</div>&ndash;&gt;-->
                  <!--&lt;!&ndash;                    <div class="wallet-item-buttons">&ndash;&gt;-->
                  <!--&lt;!&ndash;                      <div class="wallet-item-detail-btn px-[12px] py-[2px] mt-[5px]" @click="jumpToWithdrawDetail(walletList[7])">&ndash;&gt;-->
                  <!--&lt;!&ndash;                        明细&ndash;&gt;-->
                  <!--&lt;!&ndash;                      </div>&ndash;&gt;-->
                  <!--&lt;!&ndash;                      <div class="wallet-item-btn px-[12px] py-[2px] mt-[5px]" @click="jumpToWithdraw(walletList[7])">&ndash;&gt;-->
                  <!--&lt;!&ndash;                        {{walletList[7].actionText}}&ndash;&gt;-->
                  <!--&lt;!&ndash;                      </div>&ndash;&gt;-->
                  <!--&lt;!&ndash;                    </div>&ndash;&gt;-->
                  <!--&lt;!&ndash;                  </div>&ndash;&gt;-->
                </div>
              </div>
            </div>

            <!-- 保持健康服务区域原有样式 -->
            <div class="promo-banner" @click="jumpToPage('userInvite')">
              <img
                src="@/assets/img/profile/promo_banner.png"
                alt="promotion"
                class="w-full"
              />
            </div>

            <!-- Health Services -->
            <div class="service-section">
              <!--              <div class="section-title">健康服务</div>-->
              <div class="service-grid">
                <div
                  v-for="(item, index) in healthServices"
                  :key="index"
                  class="service-item"
                  @click="handleFunctionClick(item)"
                >
                  <img :src="item.icon" class="service-icon" />
                  <span class="service-name">{{ item.name }}</span>
                </div>
              </div>
            </div>

            <!-- Common Tools -->
            <div class="service-section">
              <div class="section-title">常用工具</div>
              <div class="service-grid">
                <div
                  v-for="(item, index) in commonTools"
                  :key="index"
                  class="service-item"
                  @click="handleFunctionClick(item)"
                >
                  <img :src="item.icon" class="service-icon" />
                  <span class="service-name">{{ item.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 签到弹窗 -->
      <SignInDialog
        v-model="showSignInDialog"
        :userInfo="userInfo"
        @sign-success="onSignSuccess"
      />
    </div>
    <member-certificate-preview
      :userInfo="userInfo"
      :show.sync="showMemberCertificatePreview"
    ></member-certificate-preview>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { WithdrawalType } from "@/config";
import axios from "@/net/axios";
import api from "@/net/api";
import { Dialog, ImagePreview, Loading, Overlay, PullRefresh } from "vant";
import SignInDialog from "@/components/SignInDialog.vue";
import MemberCertificatePreview from "@/components/bank/MemberCertificatePreview.vue";

export default {
  name: "index",
  components: {
    MemberCertificatePreview,
    SignInDialog,
    [PullRefresh.name]: PullRefresh,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
  },
  computed: {
    ...mapState("user", ["userWallet"]),
    ...mapState("systemInfo", ["systemInfo"]),
    title() {
      return "个人中心";
    },
    displayName() {
      if (!this.userInfo) {
        return "";
      }
      return this.userInfo.real_name || this.userInfo.name;
    },
    // 获取股东等级样式类
    getStockVipClass() {
      if (!this.userInfo || !this.userInfo.stock_vip_level) {
        return "";
      }

      switch (this.userInfo.stock_vip_level) {
        case 1:
          return "gold-vip";
        case 2:
          return "diamond-vip";
        case 3:
          return "honor-vip";
        default:
          return "";
      }
    },
    // 获取股东等级文本
    getStockVipText() {
      if (!this.userInfo || !this.userInfo.stock_vip_level) {
        return "";
      }

      switch (this.userInfo.stock_vip_level) {
        case 1:
          return "黄金股东";
        case 2:
          return "钻石股东";
        case 3:
          return "荣誉股东";
        default:
          return "";
      }
    },
  },
  data() {
    return {
      stockImage: require("@/assets/img/stock.png"),
      userInfo: {},
      invitaCode: "",
      shareUrl: "",
      showMemberCertificatePreview: false,
      shouldGenerateQRCode: false,
      showCoupon: false,
      showSignInDialog: false,
      customerServicePos: {
        right: 15,
        bottom: 80,
      },
      WithdrawalType,
      walletList: [
        {
          num: "0.00",
          title: "越秀地产股票",
          type: "stock",
          icon: require("@/assets/img/profile/icon_income_2.png"),
          actionText: "出售",
          unit: "股",
        },
        {
          num: "0.00",
          title: "团队奖励",
          type: "recommend_award",
          icon: require("@/assets/img/profile/icon_income_1.png"),
          actionText: "提现",
          unit: "元",
        },
        {
          num: "0.00",
          title: "项目收益",
          type: "income_wallet",
          icon: require("@/assets/img/profile/icon_income_0.png"),
          actionText: "提现",
          unit: "元",
        },
        // {
        //   num: "0.00",
        //   title: "项目本金",
        //   type: "item_wallet",
        //   icon: require("@/assets/img/profile/icon_income_3.png"),
        //   actionText: "提现",
        //   unit: "元",
        // },
        {
          num: "0.00",
          title: "现金余额",
          type: "invite_award",
          icon: require("@/assets/img/profile/icon_income_3.png"),
          actionText: "提现",
          unit: "元",
        },
        {
          num: "0.00",
          title: "越秀原始股",
          type: "stock_right",
          icon: require("@/assets/img/profile/icon_income_3.png"),
          actionText: "出售",
          unit: "股",
        },
        {
          num: "0.00",
          title: "我的押金",
          type: "deposit_wallet",
          icon: require("@/assets/img/profile/icon_income_3.png"),
          actionText: "提现",
          unit: "元",
        },
        {
          num: "0.00",
          title: "我的余额",
          type: "balance",
          icon: require("@/assets/img/profile/icon_income_3.png"),
          actionText: "充值",
          unit: "元",
        },
      ],
      healthServices: [
        {
          name: "团队管理",
          icon: require("@/assets/img/profile/icon_team.png"),
          route: "team",
        },
        {
          name: "提现明细",
          icon: require("@/assets/img/profile/icon_fund.png"),
          route: "withdrawRecord",
        },
        {
          name: "资金明细",
          icon: require("@/assets/img/profile/icon_chat.png"),
          route: "fundDetail",
        },
        {
          name: "实名认证",
          icon: require("@/assets/img/profile/icon_realName.png"),
          route: "realNameAuth",
        },
        {
          name: "官方群聊",
          icon: require("@/assets/img/profile/icon_group_chat.png"),
          route: "contactUs",
        },
        {
          name: "我的房产",
          icon: require("@/assets/img/profile/icon_assets.png"),
          route: "myHouses",
        },
        {
          name: "我的车辆",
          icon: require("@/assets/img/profile/icon_car.png"),
          route: "myVehicles",
        },
        {
          name: "我的股票",
          icon: require("@/assets/img/profile/icon_stock.png"),
          route: "myStocks",
        },
        {
          name: "我的银行卡",
          icon: require("@/assets/img/profile/ic_my_bank.png"),
          route: "myBankCard",
        },
        {
          name: "收货地址",
          icon: require("@/assets/img/profile/icon_address.png"),
          route: "editAddress",
        },
        {
          name: "银行绑定",
          icon: require("@/assets/img/profile/icon_bind_card.png"),
          route: "bindBankCard",
        },
        {
          name: "APP下载",
          icon: require("@/assets/img/profile/icon_download.png"),
          route: "downloadApp",
        },
        {
          name: "我的钱包",
          icon: require("@/assets/img/profile/icon_wallet.png"),
          route: "balanceRecharge",
        },
        {
          name: "我的黄金",
          icon: require("@/assets/img/profile/icon_gold.png"),
          route: "goldRecord",
        },
        {
          name: "股东凭证",
          icon: require("@/assets/img/profile/icon_gdpz.png"),
          route: "gdpz",
        },
      ],
      commonTools: [
        {
          name: "联系客服",
          icon: require("@/assets/img/profile/icon_service.png"),
          route: "customService",
        },
        {
          name: "邀请分享",
          icon: require("@/assets/img/profile/icon_invite.png"),
          route: "userInvite",
        },
        {
          name: "项目记录",
          icon: require("@/assets/img/profile/icon_record.png"),
          route: "buyRecord",
        },
        {
          name: "退出登录",
          icon: require("@/assets/img/profile/ic_logout.png"),
          route: "logout",
        },
      ],
      recommendRecords: [],
      refreshing: false,
      loadingIcon: "loading",
      pageLoading: true,
      myBankInfo: null,
      bankCardInfo: {},
      showRealNamePopup: false,
    };
  },
  mounted() {
    this.getSystemInfo();
    this.loadData();
    this.getAssetList();
  },
  filters: {
    maskPhoneNumber(phoneNumber) {
      const maskedNumber = phoneNumber?.replace(
        /(\d{3})\d{4}(\d{4})/,
        "$1****$2"
      );
      return maskedNumber;
    },
  },
  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),
    previewStockCertificate() {
      ImagePreview([this.stockImage]);
    },
    async loadData() {
      try {
        await this.getUserWallet();
        await this.getSystemInfo();
      } catch (error) {
        console.error("数据加载失败:", error);
        this.$toast("数据加载失败，请重试。");
      } finally {
        this.pageLoading = false;
      }
    },
    toShow() {
      if (this.userInfo.is_member === 1 || this.userInfo.is_member === 2) {
        this.showMemberCertificatePreview = true;
      }
    },
    jumpToWithdraw(data) {
      if (!this.userInfo.is_identify) {
        this.$dialog
          .alert({
            title: "提示",
            message: "请先完成实名认证",
          })
          .then(() => {
            this.$router.push({ name: "realNameAuth" });
          });
        return;
      }

      // 处理余额充值的特殊情况
      if (data.type === "balance") {
        this.$router.push({
          name: "balanceRecharge",
          query: { balance: data.num },
        });
        return;
      }
      if (data.type === "stock_right") {
        // Dialog.alert({ message: "集团正在排期上市，请耐心等待" });

        this.$router.push({
          name: "myStocks",
          query: { balance: data.num },
        });
        return;
      }

      if (
        ["recommend_award", "income_wallet", "deposit_wallet"].includes(
          data.type
        )
      ) {
        Dialog.alert({ message: "越秀集团上市期间，停止一切金融活动！" });

        return;
      }

      this.$router.push({
        name: "withdrawal",
        query: data,
      });
    },
    jumpToWithdrawDetail(data) {
      this.$router.push({
        name: "fundDetail",
        query: {
          type: data.type,
        },
      });
    },
    jumpToPage(name) {
      if (name == "downloadApp") {
        // this.$router.push({name: 'inviteUser', query: {code: this.userInfo.code}});
        const baseUrl = window.location.origin;
        window.open(`${baseUrl}/download.html`, "_blank");
        return;
      }
      if (name == "customService") {
        this.handleCustomerService();
        return;
      }
      if (name == "teamReward") {
        this.$router.push({
          name: "withdrawRecord",
          query: { type: "income_wallet" },
        });
        return;
      }
      if (name == "previewStockCertificate") {
        this.previewStockCertificate();
        return;
      }
      this.$router.push({ name });
    },
    async getUserWallet() {
      try {
        const res = await axios.get(api.userInfo);
        if (res) {
          this.userInfo = res.data.userInfo;
        }
        const resWallet = await axios.get(api.userWallet);
        if (resWallet.data) {
          // 更新钱包数据
          this.walletList = this.walletList.map((wallet) => {
            const coin = resWallet.data.coinList.find(
              (item) => item.name_en === wallet.type
            );
            if (coin) {
              return {
                ...wallet,
                num: coin.num,
                price: coin.price,
              };
            }
            return wallet;
          });
        }
      } catch (e) {
        console.error(e);
        this.$toast(e.msg || "连接服务器失败");
      } finally {
        this.pageLoading = false;
      }
    },
    onLoginOut() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "确定要退出登录吗？",
        })
        .then(() => {
          this.$store.commit("tabs/ACCOUNT_LOGOUT_FAILURE", true);
        })
        .catch(() => {});
    },
    loadMore() {
      axios
        .get(api.receiveList)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            this.recommendRecords = res.data.map((item) => {
              return item.recom_num;
            });
          }
          this.loading = false;
          this.refreshing = false;
          this.finished = true;
        })
        .catch((err) => {
          this.loading = false;
          this.refreshing = false;
          err.msg && this.$toast(err.msg);
        });
    },
    handleSignIn() {
      if (!this.userInfo.is_identify) {
        this.$dialog
          .alert({
            title: "提示",
            message: "请先完成实名认证",
          })
          .then(() => {
            this.$router.push({ name: "realNameAuth" });
          });
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
      axios
        .post(api.signIn)
        .then((res) => {
          this.$dialog.alert({
            title: "提示",
            message: res.msg || "签到成功",
            theme: "round-button",
          });
        })
        .catch((err) => {
          if (err.code === 430) {
            this.$dialog
              .alert({
                message: err.msg || "请先完成实名认证",
                confirmButtonText: "去认证",
              })
              .then(() => {
                this.$router.push({ name: "realNameAuth" });
              });
          } else {
            err.msg &&
              this.$dialog.alert({
                title: "提示",
                message: err.msg,
                theme: "round-button",
              });
          }
        });
    },
    onCopyText() {
      console.log("复制邀请链接", this.userInfo);
      const text = `${this.$config.WEB_URL}/register?code=${this.userInfo.code}`;
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, input.value.length),
        document.execCommand("Copy");
      document.body.removeChild(input);
      this.$toast("复制成功！");
    },
    async getAssetList() {
      this.pageLoading = true;
      const res = await axios.get(api.myGoldList);
      if (res.data.status_1_num > 0) {
        this.$dialog
          .confirm({
            message: "您的金条已打包完毕。",
            confirmButtonText: "立即发货",
          })
          .then(() => {
            this.$router.push({ name: "goldRecord" });
          });
      }
    },
    onRefresh() {
      this.refreshing = true;
      this.pageLoading = true;
      Promise.all([this.loadData()]).finally(() => {
        this.refreshing = false;
        this.pageLoading = false;
      });
    },
    onSignSuccess() {
      this.showCoupon = true;
      this.loadData();
    },
    handleFunctionClick(item) {
      if (item.route === "logout") {
        this.onLoginOut();
      } else {
        this.jumpToPage(item.route);
      }
    },
    handleCustomerService() {
      if (this.systemInfo?.customerService) {
        window.location.href = this.systemInfo.customerService;
      }
    },
    handleRealNameClick() {
      this.showRealNamePopup = false;
      this.$router.push({ name: "realNameAuth" });
    },
  },
};
</script>
<style lang="less" scoped>
.bg-mine {
  background: linear-gradient(180deg, #d10300 0%, #f6f6f6 60%);
}

.profile-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #f5f5f5;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}

.profile-scroll-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  z-index: 2;
}

.profile-scroll-content {
  position: relative;
  min-height: 100%;
  padding-bottom: calc(env(safe-area-inset-bottom) + 60px);
}

.user-info-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-avatar-bg {
  width: 81px;
  height: 81px;
  flex-shrink: 0;
  background-color: #fff;
  border-radius: 50%;
  flex: 0 0 auto;
  display: flex;
  items-center: center;
  shadow-custom: 0px 2px 2.6px rgba(0, 0, 0, 0.13);
}

.user-name {
  color: #333;
  font-family: "Noto Sans Bengali UI";
  font-size: 13.06px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.verified-text {
  color: #333;
  font-family: "Noto Sans Bengali UI";
  font-size: 13.06px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.user-phone {
  color: #333;
  font-family: "Noto Sans Bengali UI";
  font-size: 18.056px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.user-invite-code {
  color: #333;
  leading-trim: both;
  text-edge: cap;
  font-family: "Noto Sans Bengali UI";
  font-size: 12.5px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.sign-in-btn {
  border-radius: 50px;
  border: 1px solid #fff;
  background: #f08500;
  color: #fff;
  font-family: "HarmonyOS Sans SC";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  cursor: pointer;
}

.invite-link-text {
  color: #333;
  font-family: "HarmonyOS Sans SC";
  font-size: 11.111px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
}

.wallet-title {
  color: #5e5e5e;
  font-family: "HarmonyOS Sans SC";
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0.9px;
}

.project-period {
  border-radius: 2.97px;
  background: #ffcf87;
  color: #705c2d;
  text-align: center;
  font-family: "HarmonyOS Sans";
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.period-number {
  font-size: 12px;
}

.wallet-item {
  position: relative;
}

.wallet-divider {
  width: 1px;
  background-color: #ebebeb;
  margin: 0 10px;
}

.wallet-item-title {
  color: #6a4d4d;
  font-feature-settings: "liga" off, "clig" off;
  font-family: "HarmonyOS Sans SC";
  font-size: 11px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0px;
}

.wallet-item-amount {
  color: #ca2e2e;
  font-feature-settings: "liga" off, "clig" off;
  font-family: FZXiaoBiaoSong-B05T;
  font-size: 17px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 1px;
  margin: 5px 0;
}

.wallet-item-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  width: 100%;
}
.wallet-item-buttons2 {
  display: flex;
  gap: 8px;
  width: 100%;
}

.wallet-item-detail-btn {
  border-radius: 4px;
  background: #ffe7e7;
  color: #fa4949;
  font-family: "HarmonyOS Sans SC";
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  cursor: pointer;
  padding: 2px 12px;
  min-width: 45px;
  text-align: center;
}

.wallet-item-btn {
  border-radius: 4px;
  background: #fa4949;
  color: #f5f5f5;
  font-family: "HarmonyOS Sans SC";
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  cursor: pointer;
  min-width: 45px;
  text-align: center;
}

.health-title,
.tools-title {
  color: #5e5e5e;
  font-family: "HarmonyOS Sans SC";
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0.9px;
}

.shadow-custom {
  filter: drop-shadow(0px 2px 2.6px rgba(0, 0, 0, 0.13));
}

// 钱包Flex布局样式
.wallet-flex-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.wallet-row {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 15px;
}
.wallet-row2 {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 15px;
}

.wallet-flex-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}
.wallet-flex-item2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wallet-divider {
  width: 1px;
  height: 32px;
  flex-shrink: 0;
  background: linear-gradient(0deg, #e0e0e0 0%, #e0e0e0 100%), var(---, #edeff2);
}

// 保留原有service-section样式
.service-section {
  background: #fff;
  padding: 16px;

  .section-title {
    color: #000;
    font-family: "HarmonyOS Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin-bottom: 16px;
  }

  .service-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    padding: 8px;

    .service-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      .service-icon {
        width: 24px;
        height: 24px;
      }

      .service-name {
        color: #333;
        text-align: center;
        font-family: "HarmonyOS Sans SC";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }
  }
}

.member-badge {
  position: relative;
  width: 65.5px;
  height: 16px;
  flex-shrink: 0;
}

.member-badge-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.member-badge-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-icon {
  width: 12px;
  height: 12px;
  margin-right: 2px;
}

.member-text {
  font-family: "HarmonyOS Sans SC";
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.member-text-pending {
  color: #999999;
}

.member-text:not(.member-text-pending) {
  color: #f0c6a2;
}

/* 股东等级标识样式 */
.stock-vip-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  position: relative;
  z-index: 1;
  border-radius: 10px;
  padding: 0 10px;
  max-width: fit-content;
}

/* 黄金股东样式 */
.gold-vip {
  background: linear-gradient(90deg, #ffd700 0%, #ffa500 100%);
}

/* 钻石股东样式 */
.diamond-vip {
  background: linear-gradient(90deg, #00bfff 0%, #1e90ff 100%);
}

/* 荣誉股东样式 */
.honor-vip {
  background: linear-gradient(90deg, #ff4500 0%, #ff0000 100%);
}

.stock-vip-text {
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  line-height: 20px;
  text-align: center;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
}
</style>
