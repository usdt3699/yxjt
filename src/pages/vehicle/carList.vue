<template>
  <div class="min-h-screen bg-[#F9B492] relative pb-[10px]">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common.png" alt="背景" class="w-full">
      <div class="absolute top-0 left-0 right-0">
        <!-- 顶部区域 -->
        <div class="flex justify-between items-center pt-[15px] px-[10px]">
          <!-- 左侧logo -->
          <img src="@/assets/img/home/logo.png" alt="越秀集团" class="h-[40px]">
        </div>

        <!-- 主要内容区域 -->
        <div class="pt-[15px] pb-[55px] relative z-10">
          <!-- 越秀地产区域 -->
          <div class="relative mb-4 bg-white">
            <!-- 标题 -->
            <div class="title-tag">汽车申领</div>

            <!-- 列表项容器 - 增加上边距 -->
            <div class="pt-[60px] pb-2 px-[15px]">
              <div
                  v-for="(item, index) in assetList"
                  :key="index"
                  class="mb-4"
              >
                <!-- 内容区域 - 上下结构 -->
                <div class="mb-1">
                  <!-- 顶部图片 -->
                  <img
                    :src="item.img"
                    class="w-full h-auto rounded-[6px] object-cover mb-2"
                  />

                  <!-- 信息介绍区域 -->
                  <div class="flex justify-between items-center mb-2">
                    <!-- 左侧标题 -->
                    <div class="car-title">{{ item.name }}</div>
                    <!-- 右侧价格 -->
                    <div class="car-price">售价: {{ item.price|formatDecimal }}元</div>
                  </div>
                </div>

                <!-- 按钮区域 - 添加左右边距 -->
                <div class="flex justify-between px-[10px]">
                  <button class="view-button" @click="jumpToPage('carDetails', item)">车型介绍</button>
                  <button
                    class="free-button"
                    @click="handleApplyButton(item)"
                  >
                    {{ item.status === 3 ? '我的车辆' : '立即申领' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Keep existing dialogs and overlays -->
<!--      <van-overlay-->
<!--          :show="pageLoading"-->
<!--          class="flex items-center justify-center z-2"-->
<!--      >-->
<!--        <van-loading-->
<!--            type="spinner"-->
<!--            color="#fff"-->
<!--            size="36"-->
<!--            vertical-->
<!--        >-->
<!--          加载中...-->
<!--        </van-loading>-->
<!--      </van-overlay>-->

      <!-- 客服组件 -->
      <CustomerService
          :position="customerServicePos"
          @contact="handleCustomerService"
      />

      <!-- 提示对话框 -->
      <van-overlay :show="showDialog" class="flex items-center justify-center z-50">
        <div class="invite-dialog bg-white rounded-lg w-[80%] py-8 px-6 flex flex-col items-center">
          <!-- 图标 -->
          <img src="@/assets/img/estate/ic_invite_tip.png" alt="邀请提示" class="w-[80px] h-[80px] mb-4">

          <!-- 提示文字 -->
          <div class="text-[#999] text-center text-[21.88px] font-normal leading-[157.9%] mb-2">
            需要邀请 ({{ selectedAsset?.has_recommend_identify_num||0}}/{{ selectedAsset?.invite_identity_user||0 }}) 人
          </div>
          <div class="text-[#999] text-center text-[17.88px] font-normal leading-[157.9%] mb-6">
            进行实名注册即可免费申领
          </div>

          <!-- 按钮 -->
          <button class="invite-btn w-[140px] h-[37.373px] rounded-[18.686px] border-[1.068px] border-[#EB6400]" @click="goToInvite">
            去邀请
          </button>
        </div>
      </van-overlay>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import CustomerService from "@/components/CustomerService.vue";
import axios from "@/net/axios";
import api from "@/net/api";
import {Dialog, Overlay} from "vant";

export default {
  name: "index",
  components: {
    CustomerService,
    [Overlay.name]: Overlay,
  },
  computed: {
    ...mapState("systemInfo", ["systemInfo"]),
    title() {
      return this.$route.meta.title;
    },
  },
  filters: {
    formatDecimal(value) {
      if (!value)
        return "0"
      return (parseFloat(value)).toFixed(0);
    },
  },
  data() {
    return {
      loading: false,
      pageLoading: false,
      userInfo: {},
      assetList: [],
      customerServicePos: {
        right: 15,
        bottom: 80
      },
      showDialog: false,
      selectedAsset: null,
    };
  },
  mounted() {
    this.getSystemInfo();
    this.getUserInfoData()
    this.getAssetList();
  },

  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),
    handleCustomerService() {
      console.log("点击客服", this.systemInfo?.customerService);
      if (this.systemInfo?.customerService) {
        window.location.href = this.systemInfo.customerService;
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
    async getAssetList() {
      try {
        this.pageLoading = true;
        const res = await axios.get(api.myCarList);
        if (res.code === 200 && res.data?.carList) {
          this.assetList = res.data.carList;
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
    jumpToPage(name, item) {
      if (name === 'carDetails') {
        this.$router.push({
          name,
          query: {
            name: item.name,
            id: item.id
          }
        });
      } else {
        this.$router.push({name});
      }
    },

    applyVehicle(item){
      this.$router.push({name: 'applyVehicle', query: { id: item.id }});
    },
    showApplyDialog(item) {
      this.selectedAsset = item;
      this.showDialog = true;
    },
    goToInvite() {
      this.showDialog = false;
      this.$router.push({ name: 'userInvite' });
    },
    handleApplyButton(item) {
      if (!this.userInfo.is_identify) {
        this.$dialog
            .alert({
              title: "提示",
              message: "请先完成实名认证",
            })
            .then(() => {
              this.$router.push({name: "realNameAuth"});
            });
        return;
      }
      if(!this.userInfo?.member_status){
        this.$dialog.alert({
          message: "请先申请会员",
          confirmButtonText: "立即申请",
        }).then(() => {
          this.$router.push({name: "member"});
        });
        return;
      }
      if (item.status === 1) {
        this.showApplyDialog(item);
      } else if (item.status === 2) {
        this.applyVehicle(item);
      }else if (item.status === 3) {
        this.$router.push({name: 'myVehicles'});
      }
      // 状态为3时按钮已禁用，不需要处理
    },
  },
};
</script>

<style scoped lang="less">
/* 描述文字样式 */
.description-text {
  color: #A16E00;
  font-family: "HarmonyOS Sans SC";
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
}

/* 股票容器样式 */
.stock-container {
  background: #FFF;
  padding: 20px 15px;
  margin-top: 25px;
}

/* 标题标签样式 */
.title-tag {
  position: absolute;
  top: -3px;
  left: 20px;
  padding: 4px 10px;
  border-radius: 0px 0px 3px 3px;
  background: linear-gradient(180deg, #FF002D 0%, #FF7D28 100%);
  color: #FFF;
  font-family: "HarmonyOS Sans SC";
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
}

/* 车辆标题样式 */
.car-title {
  font-family: "HarmonyOS Sans SC";
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.3px;
  background: var(--Style, linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 车辆价格样式 */
.car-price {
  text-align: right;
  font-family: "HarmonyOS Sans SC";
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 153.846% */
  letter-spacing: -0.3px;
  background: var(--Style, linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 热卖角标样式 */
.hot-corner {
  position: absolute;
  top: 0;
  right: 0;
  width: 39px;
  height: 41px;
  overflow: hidden;
}

.corner-svg {
  position: absolute;
  top: 0;
  right: 0;
}

.hot-text {
  position: absolute;
  top: 11px;
  right: 1px;
  color: #FFF;
  font-family: "HarmonyOS Sans SC";
  font-size: 10px;
  font-weight: 400;
  line-height: normal;
  transform: rotate(45deg) translateX(-3px) translateY(-3px);
  transform-origin: center;
  white-space: nowrap;
}

/* 价格区域样式 */
.price-section {
  margin-top: 15px;
  display: flex;
  align-items: baseline;
}

.stock-price {
  color: #008F67;
  font-family: "HarmonyOS Sans SC";
  font-size: 41px;
  font-weight: 400;
  line-height: normal;
}

.currency {
  color: #008F67;
  font-family: "HarmonyOS Sans SC";
  font-size: 16px;
  font-weight: 400;
  margin-left: 5px;
}

.price-change {
  color: #008F67;
  font-family: "HarmonyOS Sans SC";
  font-size: 16px;
  font-weight: 400;
  margin-left: 10px;
}

/* 数据区域样式 */
.data-section {
  margin-top: 15px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.data-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.data-label {
  color: #999;
  font-size: 12px;
}

.data-value {
  color: #333;
  font-size: 14px;
  margin-top: 3px;
}

.data-separator {
  width: 1px;
  height: 25px;
  background-color: #ECECEC;
}

/* 按钮区域样式 */
.button-section {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.view-button, .free-button {
  width: 48%;
  height: 34.713px;
  padding: 4.339px;
  justify-content: center;
  align-items: center;
  border-radius: 5.207px;
  color: #F7F7F8;
  text-align: center;
  font-family: "HarmonyOS Sans SC";
  font-size: 17.356px;
  font-weight: 500;
  line-height: 17.356px;
  display: flex;
  margin-top: 10px;
}

.view-button {
  background: linear-gradient(180deg, #59CAFF 0%, #0055C7 100%);
}

.free-button {
  background: linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%);
}
.free-button-disabled {
  background: #D1D4D8;
  color: #B0B3B7;
  cursor: not-allowed;
}

/* 原始股价格样式 */
.original-stock-price {
  color: #E42121;
  font-family: "HarmonyOS Sans SC";
  font-size: 41px;
  font-weight: 400;
  line-height: normal;
}

.original-stock-unit {
  color: #E42121;
  font-family: "HarmonyOS Sans SC";
  font-size: 17px;
  font-weight: 400;
  line-height: normal;
  margin-left: 5px;
}

.original-stock-change {
  color: #E42121;
  font-family: "HarmonyOS Sans SC";
  font-size: 17px;
  font-weight: 400;
  line-height: normal;
  margin-left: 10px;
}

/* 24小时开放标记 */
.open-info {
  color: #FF7100;
  font-family: "HarmonyOS Sans SC";
  font-size: 15px;
  font-weight: 500;
  line-height: normal;
  margin-top: 5px;
  margin-left: 10px;
}

/* 原始股说明文字 */
.original-stock-info {
  margin-top: 15px;
}

.info-text {
  color: #757575;
  font-family: "HarmonyOS Sans SC";
  font-size: 15px;
  font-weight: 400;
  line-height: 21px;
  margin-bottom: 5px;
}

/* 邀请按钮样式 */
.invite-btn {
  background: linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%);
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
</style>

