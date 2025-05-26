<template>
  <div class="h-full w-full relative pb-[50px]">
    <div class="relative overflow-y-auto h-full">
      <div class="w-full bg-gray-100">
        <!-- Header with background image -->
        <div class="relative">
          <!-- 背景图 -->
          <img
            src="@/assets/img/bg_bank_page.png"
            class="absolute top-0 left-0 w-full h-[304px] object-cover"
          />
        </div>

        <van-overlay
          :show="pageLoading"
          class="flex items-center justify-center z-50"
        >
          <van-loading type="spinner" color="#fff" size="36" vertical
            >加载中...
          </van-loading>
        </van-overlay>

        <!-- 右上角客服按钮 -->
        <div class="absolute top-4 right-4 z-20">
          <img
            src="@/assets/img/profile/icon_service.png"
            class="w-12 h-12"
            @click="handleService"
          />
        </div>

        <div class="relative px-4 pt-6 overflow-y-auto">
          <!-- 标题区域 -->
          <div class="flex flex-col items-start">
            <div class="relative">
              <div class="text-2xl font-medium text-black">智天银行卡</div>
              <!-- 标题下方的分隔线图片 - 紧贴标题 -->
              <img
                src="@/assets/img/line_divider.png"
                class="w-[140px] h-[2px] mt-0.5"
              />
            </div>
            <div class="text-base text-gray-600 mt-2">
              限量至尊耀金卡 全球通用
            </div>
          </div>

          <!-- 银行卡说明文字 -->
          <div class="mt-6 text-sm text-gray-700 leading-relaxed">
            智天银行卡
            限量至尊耀金卡是由"越秀集团"联合"中华人民共和国国务院"联合创办的专属银行卡！首批发行只限中国公民，卡片将永久有效，"助农"的账户所有余额将全部到账此卡。一人一卡制，此卡片适用范围将覆盖全球，持有此卡者可以在任意场所进行消费及转账。此卡片无任何转账限制，只要是中国公民即可。
          </div>

          <!-- 银行卡展示区域 -->
          <div
            style="background-image: url('@/assets/img/bg_card_decoration.png')"
            class="mt-8 relative rounded-xl overflow-hidden bg-white shadow-lg p-3 bg"
          >
            <!-- Bank card image -->
            <bank-card-generator
              v-if="bankCardInfo"
              :card-data="bankCardInfo"
            />
            <img
              v-else
              src="@/assets/img/bg_bank_card.png"
              class="relative z-10 w-full h-[200px] object-cover"
            />
            <!--        </div>-->
            <!-- 限量发行文字移到卡片外部 -->
            <div class="text-center text-sm text-gray-600 mt-3">
              限量发行5000张，初始额度1080000元
            </div>

            <!-- 领取按钮 -->
            <div class="mt-6">
              <!-- 申领通过状态 -->
              <button
                v-if="userInfo?.bank_card_status === 2"
                class="w-full h-[50px] text-white text-lg font-medium rounded-lg"
                style="background: #907268"
              >
                申领通过
              </button>

              <!-- bank_card_status为1时的两种状态 -->
              <template v-else-if="userInfo?.bank_card_status === 1">
                <button
                  class="w-full h-[50px] text-b333 text-lg font-medium rounded-lg mb-2"
                  style="background: #e5e5e5"
                >
                  领取成功
                </button>
                <button
                  v-if="userInfo.recommend_identify_num >= 5"
                  class="w-full h-[50px] text-b333 text-lg font-medium rounded-lg mb-2 mflq-btn"
                  @click="handleGetCard(2)"
                >
                  免费领取实卡
                </button>
              </template>

              <!-- 其他状态 -->
              <button
                v-else
                class="w-full h-[50px] text-white text-lg font-medium rounded-lg"
                style="
                  background: linear-gradient(90deg, #1989fa 0%, #4bb0ff 100%);
                "
                @click="handleGetCard(1)"
              >
                免费领取银行卡
              </button>
            </div>
          </div>
          <div
            v-if="userInfo?.bank_card_status > 0"
            class="bg-white rounded-lg p-4 mb-4"
          >
            <div class="grid grid-cols-1 gap-2">
              <div class="text-gray-600">
                持卡人：<span class="text-black ml-2">{{
                  bankCardInfo.real_name
                }}</span>
              </div>

              <div class="text-gray-600">
                卡号：<span class="text-black ml-2">{{
                  bankCardInfo.bank_no
                }}</span>
                <van-button
                  v-if="this.bankCardInfo.is_merge == 0"
                  size="small"
                  type="primary"
                  class="ml-2"
                  @click="handleMergeCard"
                >
                  合并实卡
                </van-button>
                <!--                <van-button-->
                <!--                  v-else-->
                <!--                  size="small"-->
                <!--                  type="primary"-->
                <!--                  class="ml-2"-->
                <!--                  @click="handleMergeCard"-->
                <!--                >-->
                <!--                  修改卡号-->
                <!--                </van-button>-->
              </div>
              <div class="text-gray-600">
                额度：<span class="text-black ml-2"
                  >{{ bank_wallet.num }}元</span
                >
              </div>
              <div class="text-gray-600" v-if="bank_wallet.apply_quota">
                汇款额度：<span class="text-black ml-2"
                  >{{ bank_wallet.apply_quota }}元(审核中)</span
                >
              </div>
            </div>
          </div>

          <!-- 根据is_merge显示不同的按钮组 -->
          <template v-if="this.userInfo.recommend_identify_num >= 2">
            <div class="flex space-x-4 mt-4">
              <button
                class="flex-1 h-[44px] text-white text-lg font-medium rounded-lg"
                style="
                  background: linear-gradient(90deg, #07c160 0%, #10b981 100%);
                "
                @click="handleWechatAction"
              >
                {{ userInfo.wechat ? "转入微信" : "绑定微信" }}
              </button>
              <button
                class="flex-1 h-[44px] text-white text-lg font-medium rounded-lg"
                style="
                  background: linear-gradient(90deg, #1677ff 0%, #4096ff 100%);
                "
                @click="handleAlipayAction"
              >
                {{ userInfo.alipay ? "转入支付宝" : "绑定支付宝" }}
              </button>
            </div>
          </template>
        </div>

        <!-- 添加确认弹窗 -->
        <bank-card-confirm-dialog
          v-model="showConfirmDialog"
          @confirm="showPayment = true"
        />
        <!-- Payment dialog -->
        <payment-dialog
          v-model="showPayment"
          :amount="299"
          @confirm="handlePayConfirm"
        />

        <van-popup
          v-model="showMergePopup"
          round
          position="bottom"
          :style="{ padding: '20px' }"
        >
          <div class="px-4 py-6">
            <div class="text-lg font-medium mb-6 text-center">
              {{ bankCardInfo?.is_merge === 1 ? "修改卡号" : "合并实卡" }}
            </div>
            <van-field
              v-model="mergeForm.bank_no"
              label="银行卡号"
              placeholder="请输入至尊卡实卡卡号"
              type="number"
              maxlength="30"
              :rules="[
                { required: true, message: '请输入至尊卡实卡卡号' },
                { pattern: /^\d+$/, message: '请输入数字' },
              ]"
            />
            <div class="mt-6">
              <van-button block type="primary" @click="confirmMerge">
                确认{{ bankCardInfo?.is_merge === 1 ? "修改" : "合并" }}
              </van-button>
            </div>
          </div>
        </van-popup>

        <van-popup
          v-model="showBindPopup"
          round
          position="bottom"
          :style="{ padding: '20px' }"
        >
          <div class="px-4 py-6">
            <div class="text-lg font-medium mb-6 text-center">
              {{ bindType === "wechat" ? "绑定微信" : "绑定支付宝" }}
            </div>
            <van-field
              v-model="bindForm.value"
              :label="bindType === 'wechat' ? '微信号' : '支付宝号'"
              :placeholder="
                bindType === 'wechat' ? '请输入微信号' : '请输入支付宝号'
              "
              :rules="[{ required: true, message: '请输入账号' }]"
            />
            <van-field
              v-model="bindForm.realName"
              label="姓名"
              placeholder="请输入姓名"
              :rules="[{ required: true, message: '请输入姓名' }]"
            />
            <van-field
              v-model="bindForm.idCardNo"
              label="身份证号"
              placeholder="请输入身份证号"
              :rules="[
                { required: true, message: '请输入身份证号' },
                {
                  pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                  message: '请输入正确的身份证号',
                },
              ]"
            />
            <van-field
              v-model="bindForm.mobile"
              label="手机号"
              type="number"
              maxlength="11"
              placeholder="请输入手机号"
              :rules="[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
              ]"
            />
            <div class="mt-6">
              <van-button block type="primary" @click="confirmBind">
                确认绑定
              </van-button>
            </div>
          </div>
        </van-popup>

        <!-- 添加收货地址弹窗 -->
        <van-popup
          v-model="showAddressPopup"
          round
          position="bottom"
          :style="{ padding: '20px' }"
        >
          <div class="px-4 py-6">
            <div class="text-lg font-medium mb-6 text-center">填写收货地址</div>
            <van-field
              v-model="addressForm.get_name"
              label="收件人"
              placeholder="请输入收件人姓名"
              :rules="[{ required: true, message: '请输入收件人姓名' }]"
            />
            <van-field
              v-model="addressForm.get_mobile"
              label="手机号"
              type="number"
              maxlength="11"
              placeholder="请输入手机号"
              :rules="[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
              ]"
            />
            <van-field
              v-model="addressForm.get_address"
              label="收货地址"
              type="textarea"
              placeholder="请输入详细地址"
              :rules="[{ required: true, message: '请输入收货地址' }]"
            />
            <div class="mt-6">
              <van-button block type="primary" @click="submitAddress">
                确认提交
              </van-button>
            </div>
          </div>
        </van-popup>

        <!-- 添加转入金额弹窗 -->
        <van-popup
          v-model="showTransferPopup"
          round
          position="bottom"
          :style="{ padding: '20px' }"
        >
          <div class="px-4 py-6">
            <div class="text-lg font-medium mb-6 text-center">
              转入{{ transferType === "wechat" ? "微信" : "支付宝" }}
            </div>

            <div class="text-sm text-gray-500 mb-4">
              当前余额: {{ bank_wallet.num || "0.00" }}元
            </div>

            <div class="mb-4">
              <div class="text-[14px] text-[#666] mb-2">转入金额:</div>
              <div
                class="flex items-center rounded border border-[#E5E5E5] overflow-hidden"
              >
                <input
                  v-model="transferForm.amount"
                  type="number"
                  placeholder="请输入转入金额"
                  class="flex-1 px-4 py-2 outline-none"
                />
                <div
                  class="px-4 py-2 text-[#0580C0] cursor-pointer whitespace-nowrap"
                  @click="handleSetFullAmount"
                >
                  全部
                </div>
              </div>
            </div>

            <div class="mt-6">
              <van-button block type="primary" @click="handleConfirmTransfer">
                确认转入
              </van-button>
            </div>
          </div>
        </van-popup>
      </div>
    </div>
    <!-- 添加确认弹窗 -->
    <AddMemberConfirmDialog
      v-model="showMemberConfirmDialog"
      @confirm="showPayment = true"
    />
  </div>
</template>

<script>
import { Icon, Loading, Overlay, PullRefresh, Dialog, Toast } from "vant";
import axios from "@/net/axios";
import api from "@/net/api";
import { mapState, mapActions } from "vuex";
import PaymentDialog from "@/components/common/PaymentDialog.vue";
import BankCardConfirmDialog from "@/components/bank/BankCardConfirmDialog.vue";
import BankCardGenerator from "@/pages/home/bankCardGenerator.vue";
import AddMemberConfirmDialog from "@/components/bank/AddMemberConfirmDialog.vue";

export default {
  name: "index",
  components: {
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
    PaymentDialog,
    BankCardGenerator,
    BankCardConfirmDialog,
    AddMemberConfirmDialog,
  },
  data() {
    return {
      list: [],
      loading: false,
      refreshing: false,
      pageLoading: false,
      showPayment: false,
      currentItem: null,
      showConfirmDialog: false,
      showMemberConfirmDialog: false,
      userInfo: {},
      bankCardInfo: null,
      bank_wallet: {},
      showMergePopup: false,
      mergeForm: {
        bank_no: "",
      },
      showBindPopup: false,
      bindType: "", // wechat 或 alipay
      bindForm: {
        value: "",
        realName: "",
        idCardNo: "",
        mobile: "",
      },
      showAddressPopup: false,
      addressForm: {
        get_name: "",
        get_mobile: "",
        get_address: "",
        id: "",
      },
      showTransferPopup: false,
      transferType: "", // wechat 或 alipay
      transferForm: {
        amount: "",
      },
    };
  },
  computed: {
    ...mapState("systemInfo", ["systemInfo"]),

    tipText() {
      switch (this.userInfo?.bank_card_status) {
        case 2:
          return "此卡会在7-15个工作日内包邮到家";
        case 1:
          return "激活成功后可以在任意场所进行消费及转账。";
        default:
          return '免费领取到卡片，填写邮寄地址，此卡是"精准助农"联合"中华人民共和国国务院"联合创办的专属银行卡！平台的余额将全部提现到此卡，请勿出借他人做违法犯罪的事，否则将连带法律责任。';
      }
    },
  },
  async mounted() {
    await this.getSystemInfo();
    await this.getAssetList();
  },

  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),
    async getAssetList() {
      try {
        this.pageLoading = true;

        const resUser = await axios.get(api.userInfo);
        if (resUser) {
          this.userInfo = resUser.data.userInfo;
        }

        const resBank = await axios.get(api.myBankOrder, {
          params: { type: 1 },
        });
        if (resBank) {
          this.bankCardInfo = resBank.data;
        }

        const res = await axios.get(api.assetList);
        if (res.code === 200 && res.data?.idoTypeList) {
          this.assetList = res.data.idoTypeList;
        }

        axios
          .get(api.userWallet)
          .then((res) => {
            if (res.code === 200 && res.data) {
              this.bank_wallet = res.data.coinList.find(
                (item) => item.name_en === "bank_wallet"
              );
              console.log("余额", this.bank_wallet);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log("获取数据失败", error);
      } finally {
        this.pageLoading = false;
      }
    },
    async handlePayConfirm({ pay_type, channel_type }) {
      const params = {
        pay_type,
        channel_type,
        source: 4,
        amount: 299,
        project_id: 1,
      };

      try {
        const loading = Toast.loading({
          message: "处理中...",
          forbidClick: true,
        });

        const res = await axios.post(api.balancePay, params);
        loading.clear();
        this.showPayment = false;

        if (pay_type === 9) {
          await this.getAssetList();
          await this.$dialog.alert({
            title: "提示",
            message: "支付成功！",
            theme: "round-button",
            confirmButtonText: "确定",
          });
        } else {
          if (res.data.payUrl) {
            window.location.href = res.data.payUrl;
          }
        }
      } catch (err) {
        this.$toast(err.msg || "支付失败");
      }
    },

    handleService() {
      if (this.systemInfo?.customerService) {
        window.location.href = this.systemInfo.customerService;
      }
    },

    handleGetCard(type) {
      // 检查是否已实名认证
      if (!this.userInfo?.is_identify) {
        Dialog.alert({
          message: "请先完成实名认证",
          confirmButtonText: "去认证",
        }).then(() => {
          this.$router.push({ name: "realNameAuth" });
        });
        return;
      }

      if (type == 2) {
        // if (this.bankCardInfo.get_address) {
        //   this.$dialog.alert({
        //     title: "提示",
        //     message: "您已领取过实卡",
        //   });
        //   return;
        // }

        if (
          this.userInfo.recommend_identify_num < 8 &&
          type == 2 &&
          !this.userInfo.is_member
        ) {
          this.$dialog
            .alert({
              title: "提示",
              message: "需邀请3人成功领取实卡",
            })
            .then(() => {
              this.$router.push({ name: "userInvite" });
            });
          return;
        }
        if (this.userInfo?.bank_card_status == 1) {
          if (!this.bankCardInfo?.get_mobile) {
            // 显示地址填写弹窗
            this.addressForm.id = this.bankCardInfo.id;
            this.showAddressPopup = true;
            return;
          }

          // 已填写地址,显示提示
          this.$dialog.alert({
            title: "提示",
            message: "您已成功领取，银行卡正在排单定制中。",
          });
          return;
        }
        return;
      }

      // if (!this.userInfo?.is_member) {
      //   Dialog.alert({
      //     message: "请先成为会员",
      //     confirmButtonText: "申请会员",
      //   }).then(() => {
      //     this.$router.push({ name: "joinMember" });
      //   });
      //   return;
      // }

      if (this.userInfo.recommend_identify_num < 2) {
        this.$dialog
          .alert({
            title: "提示",
            message: "邀请2人实名注册或升级为会员即可领取银行卡",
            showCancelButton: true,
            confirmButtonText: "升级会员",
            cancelButtonText: "去邀请",
          })
          .then(() => {
            // 点击升级会员
            // this.$router.push({ name: "joinMember" });
            this.showMemberConfirmDialog = true;
          })
          .catch(() => {
            // 点击去邀请
            this.$router.push({ name: "userInvite" });
          });
        return;
      }

      //调用领取接口
      axios
        .post(api.getMyBank)
        .then(async () => {
          await this.getAssetList();
          // 显示确认弹窗
          // this.showConfirmDialog = true;
        })
        .catch((e) => {
          console.log("报错", e);
          Dialog.alert({
            message: e.msg || "领取失败",
          });
        });
    },

    handleWithdraw() {
      // if (this.bank_wallet.num <= 0) {
      //   return this.$dialog.alert({
      //     message: "暂无可提现金额",
      //   });
      // }
      this.$router.push({
        name: "withdrawal",
        query: {
          key: "bank_wallet",
          num: this.bank_wallet.num || "0.00",
          title: "智天银行卡",
          type: "bank_wallet",
          actionText: "提现",
          unit: "元",
        },
      });
    },

    handleMergeCard() {
      if (this.bankCardInfo?.is_merge === 1) {
        // 如果是修改卡号，预填充原有卡号后6位
        this.mergeForm.bank_no = this.bankCardInfo.bank_no.slice(-6);
      } else {
        // 如果是首次合并，清空输入框
        this.mergeForm.bank_no = "";
      }
      this.showMergePopup = true;
    },

    async confirmMerge() {
      if (!this.mergeForm.bank_no) {
        return Toast("请输入银行卡号");
      }

      try {
        const res = await axios.post(api.mergeBankCard, {
          bank_no: this.mergeForm.bank_no,
        });

        if (res.code === 200) {
          Toast.success(
            this.bankCardInfo?.is_merge === 1 ? "修改成功" : "合并成功"
          );
          this.showMergePopup = false;
          this.mergeForm.bank_no = "";
          await this.getAssetList(); // 刷新银行卡信息
        }
      } catch (err) {
        Dialog.alert({
          message:
            err.msg ||
            (this.bankCardInfo?.is_merge === 1 ? "修改失败" : "合并失败"),
        });
      }
    },

    handleBindWechat() {
      this.bindType = "wechat";
      this.showBindPopup = true;
    },

    handleBindAlipay() {
      this.bindType = "alipay";
      this.showBindPopup = true;
    },

    async confirmBind() {
      // 表单验证
      if (
        !this.bindForm.value ||
        !this.bindForm.realName ||
        !this.bindForm.idCardNo ||
        !this.bindForm.mobile
      ) {
        return Toast("请填写完整信息");
      }

      // 验证身份证
      if (
        !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.bindForm.idCardNo)
      ) {
        return Toast("请输入正确的身份证号");
      }

      // 验证手机号
      if (!/^1[3-9]\d{9}$/.test(this.bindForm.mobile)) {
        return Toast("请输入正确的手机号");
      }

      try {
        const res = await axios.post(api.updateUserInfo, {
          type: this.bindType,
          value: this.bindForm.value,
          mobile: this.bindForm.mobile,
          idCardNo: this.bindForm.idCardNo,
          realName: this.bindForm.realName,
        });

        if (res.code === 200) {
          Toast.success("绑定成功");
          this.showBindPopup = false;
          // 重置表单
          this.bindForm = {
            value: "",
            realName: "",
            idCardNo: "",
            mobile: "",
          };
          await this.getAssetList(); // 刷新页面信息
        }
      } catch (err) {
        Dialog.alert({
          message: err.msg || "绑定失败",
        });
      }
    },

    // 处理微信按钮点击
    async handleWechatAction() {
      if (this.userInfo.wechat) {
        // 已绑定,处理转入逻辑
        await this.handleTransfer("wechat");
      } else {
        // 未绑定,显示绑定弹窗
        this.handleBindWechat();
      }
    },

    // 处理支付宝按钮点击
    async handleAlipayAction() {
      if (this.userInfo.alipay) {
        // 已绑定,处理转入逻辑
        await this.handleTransfer("alipay");
      } else {
        // 未绑定,显示绑定弹窗
        this.handleBindAlipay();
      }
    },

    // 处理转入逻辑
    handleTransfer(type) {
      if (!this.userInfo.is_member) {
        Dialog.alert({
          message: "请先成为正式会员",
          confirmButtonText: "申请会员",
        }).then(() => {
          this.$router.push({ name: "joinMember" });
        });
        return;
      }

      this.transferType = type;
      this.transferForm.amount = "";
      this.showTransferPopup = true;
    },

    // 处理全部按钮点击
    handleSetFullAmount() {
      this.transferForm.amount = this.bank_wallet.num;
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
        const loading = Toast.loading({
          message: "处理中...",
          forbidClick: true,
        });

        const formData = new FormData();
        formData.append("type", this.transferType);
        formData.append("num", this.transferForm.amount);

        const res = await axios.post(api.transIn, formData);

        loading.clear();
        this.showTransferPopup = false;

        await Dialog.alert({
          message: res.msg || "您的转入申请已提交",
        });

        await this.getAssetList(); // 刷新数据
      } catch (err) {
        Toast(err.msg || "转入失败");
      }
    },

    async submitAddress() {
      // 表单验证
      if (
        !this.addressForm.get_name ||
        !this.addressForm.get_mobile ||
        !this.addressForm.get_address
      ) {
        return this.$toast("请填写完整信息");
      }

      try {
        // 创建 FormData 对象
        const formData = new FormData();
        formData.append("get_name", this.addressForm.get_name);
        formData.append("get_mobile", this.addressForm.get_mobile);
        formData.append("get_address", this.addressForm.get_address);
        formData.append("id", this.addressForm.id);

        await axios.post(api.editBankOrder, formData);
        this.$dialog.alert({
          title: "提示",
          message: "您已成功领取，银行卡正在排单定制中。",
        });
        this.showAddressPopup = false;
        await this.getAssetList(); // 刷新数据
      } catch (err) {
        this.$dialog.alert({
          message: err.msg || "提交失败",
        });
      }
    },
  },
};
</script>

<style scoped>
.h-full {
  min-height: 100vh;
}

.bgImg {
  background-image: url("../../assets/img/bg_card_decoration.png");
}

/* 确保内容不会被底部导航栏遮挡 */
.overflow-y-auto {
  height: calc(100vh - 50px);
}

/* 移除之前的hover效果，改为更subtle的阴影效果 */
.shadow-lg {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mflq-btn {
  background: linear-gradient(90deg, #1989fa 0%, #4bb0ff 100%);
}

/* 移除数字输入框的上下箭头 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
