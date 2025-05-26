<template>
  <div class="min-h-screen relative overflow-y-auto">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common2.png" alt="背景" class="w-full" />
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <TitleBar
          :logoSrc="require('@/assets/img/home/yuexiu_logo.png')"
          @back="$router.back()"
        />

        <!-- 主要内容区域 -->
        <div class="pt-[15px] pb-[55px] relative z-10">
          <!-- 越秀地产区域 -->
          <div class="relative mb-4 bg-white">
            <!-- 标题 -->
            <div class="title-tag">我的房产</div>

            <!-- 列表项容器 - 增加上边距 -->
            <div class="pt-[60px] pb-2 px-[15px]">
              <!-- 空视图显示 -->
              <div v-if="assetList.length === 0" class="empty-container">
                <van-empty description="暂未领取" image="search">
                  <van-button
                    round
                    type="danger"
                    class="empty-btn"
                    @click="goToEstate"
                  >
                    立即去领取
                  </van-button>
                </van-empty>
              </div>

              <!-- 有数据时显示列表 -->
              <template v-else>
                <div
                  v-for="(item, index) in assetList"
                  :key="index"
                  class="mb-4"
                >
                  <!-- 内容区域 - 移除白色背景 -->
                  <div class="mb-1">
                    <div class="flex">
                      <!-- 左侧产品图片 -->
                      <div class="flex-shrink-0 mr-4">
                        <img
                          :src="item.house_detail.img"
                          class="w-[172.183px] h-[102px] rounded-[6px] object-cover"
                        />
                      </div>

                      <!-- 右侧信息 -->
                      <div class="flex-1 flex flex-col relative">
                        <!-- 状态标签 -->
                        <!--                      <div class="absolute top-0 right-0 px-[6px] py-[2px] rounded text-[10px] bg-[#FFF3E0] text-[#FF9800]">-->
                        <!--                        审批中-->
                        <!--                      </div>-->

                        <!-- 标题 -->
                        <div
                          class="text-[#F33] font-bold text-[16px] mb-1 leading-normal tracking-[-0.3px]"
                        >
                          {{ item.house_detail.name }}
                        </div>

                        <!-- 房产信息 -->
                        <div
                          class="text-[#252626] text-[13px] font-medium leading-[20px] tracking-[-0.3px]"
                        >
                          售价:
                          {{ (item.house_detail.price / 10000).toFixed(0) }}万
                        </div>
                        <div
                          class="text-[#252626] text-[13px] font-medium leading-[20px] tracking-[-0.3px]"
                        >
                          户型:
                          {{ item.house_detail.house_type }}
                        </div>
                        <div
                          class="text-[#252626] text-[13px] font-medium leading-[20px] tracking-[-0.3px]"
                        >
                          朝向:
                          {{ item.house_detail.face }}
                        </div>
                        <div
                          class="text-[#252626] text-[13px] font-medium leading-[20px] tracking-[-0.3px]"
                        >
                          面积:
                          {{ item.house_detail.area }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 按钮区域 - 使用grid布局 -->
                  <button
                    class="free-button"
                    v-if="item.status == 3"
                    @click="handleApplyButton(item, 3)"
                  >
                    现场领房产证
                  </button>
                  <button
                    v-if="item.status == 2"
                    class="free-button"
                    @click="handleApplyButton(item, 1)"
                  >
                    免费领取不动产权证
                  </button>
                  <div class="button-grid">
                    <button
                      v-if="item.status == 1"
                      class="free-button"
                      @click="houseFreeTransfer(item)"
                    >
                      立即免费过户
                    </button>
                    <!--                    <button-->
                    <!--                        v-if="item.status>=2"-->
                    <!--                        class="free-button"-->
                    <!--                        @click="handleApplyButton(item)"-->
                    <!--                    >-->
                    <!--                      权属登记-->
                    <!--                    </button>-->
                    <button
                      v-if="item.status >= 2"
                      class="view-button"
                      @click="handleApplyButton(item, 0)"
                    >
                      {{
                        item.status == 2
                          ? "立即领取不动产权证"
                          : "查看不动产权证"
                      }}
                    </button>

                    <button
                      v-if="item.status == 1"
                      class="view-button"
                      @click="toPay(item)"
                    >
                      立即缴费过户
                    </button>
                    <button
                      v-if="item.status >= 2"
                      class="view-button"
                      @click="viewCenterImage(item)"
                    >
                      查看过户凭证
                    </button>
                  </div>
                  <button
                    v-if="item.status >= 4"
                    class="view-button"
                    @click="viewCenterImage2(item)"
                  >
                    查看现场领房产证门票
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- 图片预览 -->
      <van-image-preview
        v-model="showImagePreview"
        :images="previewImages"
        :start-position="previewIndex"
        :show-indicators="false"
      />

      <!-- 支付弹窗 -->
      <payment-dialog
        v-model="showPayment"
        :amount="amount"
        @confirm="handlePayConfirm"
      />
      <!-- 使用证书预览组件 -->
      <house-certificate-preview
        :card-detail="cardDetail"
        :show.sync="showCertificatePreview"
      ></house-certificate-preview>
      <!-- 使用证书预览组件 -->
      <house-certificate-preview2
        :card-detail="cardDetail"
        :show.sync="showCertificatePreview2"
      ></house-certificate-preview2>
      <popup
        v-model="showNotice"
        position="center"
        class="w-[80%]"
        :closeable="true"
      >
        <div class="bg-white rounded-[20px] overflow-hidden w-full">
          <div
            class="notice-title flex items-center justify-center text-2xl py-4 border-b border-[#f5f5f5]"
          ></div>
          <div class="p-4 max-h-[400px] overflow-y-auto">
            <!-- <p v-html="notice.content" class="text-base"></p> -->
            需缴纳
            <span class="text-red-600">{{ amount }}元</span>
            费用(该费用包括您去领取房产证时的所有费用，酒店，机票)获取去现场参加领房产证仪式资格，<span
              class="text-red-600"
              >该笔款项将会在您到达场地后由工作人员统一返还。</span
            >
          </div>
          <div class="p-6 flex justify-center">
            <div
              @click="(showPayment = true), (showNotice = false)"
              class="bg-primary text-white px-12 py-2.5 rounded-full cursor-pointer hover:opacity-90"
            >
              立即缴纳
            </div>
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import {
  Button,
  Dialog,
  Empty,
  Icon,
  ImagePreview,
  Loading,
  Overlay,
  Popup,
} from "vant";
import TitleBar from "@/components/common/TitleBar.vue";
import axios from "@/net/axios";
import api from "@/net/api";
import PaymentDialog from "@/components/common/PaymentDialog.vue";
import HouseCertificatePreview from "@/components/bank/HouseCertificatePreview.vue";
import HouseCertificatePreview2 from "@/components/bank/HouseCertificatePreview2.vue";

export default {
  name: "HouseDetails",
  components: {
    HouseCertificatePreview,
    HouseCertificatePreview2,
    TitleBar,
    Popup,
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [ImagePreview.Component.name]: ImagePreview.Component,
    [Empty.name]: Empty,
    PaymentDialog,
  },
  data() {
    return {
      pageLoading: false,
      showNotice: false,
      houseName: "",
      houseContent: "",
      showImagePreview: false,
      showCertificatePreview2: false,
      itemList: {},
      amount: 1998,
      source: 15,
      assetList: [],
      previewImages: [],
      previewIndex: 0,
      showPayment: false,
      selectedItem: null,
      showCertificatePreview: false,
      cardDetail: null, // 存储银行卡详情数据
    };
  },

  mounted() {
    this.getAssetList();
  },

  methods: {
    viewCenterImage(item) {
      this.cardDetail = item;
      this.showCertificatePreview = true;
    },
    viewCenterImage2(item) {
      this.cardDetail = item;
      this.showCertificatePreview2 = true;
    },

    // 跳转到房产申领页面
    goToEstate() {
      this.$router.push({ name: "estate" });
    },
    toPay(item) {
      this.selectedItem = item;
      this.showPayment = true;
      this.amount = 1998;
      this.source = 15;
    },
    async handlePayConfirm({ pay_type, channel_type }) {
      const params = {
        pay_type,
        channel_type,
        project_id: this.selectedItem.id,
        source: this.source,
        amount: this.amount,
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
          this.getAssetList({ id: this.selectedItem.id }); // 刷新列表
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
    async houseFreeTransfer(item) {
      try {
        const res = await axios.post(api.houseFreeTransfer, { id: item.id });
        this.$dialog
          .alert({
            message: res.msg || "过户成功",
            theme: "round-button",
            confirmButtonText: "确定",
            confirmButtonColor: "#F23D30",
          })
          .then(() => {
            this.getAssetList(item); // 刷新列表
          });
      } catch (e) {
        this.$dialog
          .alert({
            message: e.msg || "需要认购任意越秀项目即可免费过户",
            theme: "round-button",
            confirmButtonText: "确定",
            confirmButtonColor: "#F23D30",
          })
          .then(() => {
            if (e.code == 533) {
              this.$router.push({ name: "projectList" });
            }
          });
      }
    },
    handleApplyButton(item, type) {
      // 如果是免费领取不动产权证按钮点击（status==2）
      if (type == 1 && item.status == 2) {
        axios
          .post(api.houseFreeFixAsset, { id: item.id })
          .then((res) => {
            this.$dialog
              .alert({
                message: res.msg || "领取成功",
                theme: "round-button",
                confirmButtonText: "确定",
                confirmButtonColor: "#F23D30",
              })
              .then(() => {
                this.$router.push({
                  name: "propertyCertificate",
                  query: {
                    id: item.id,
                    typeId: item.house_detail.id,
                    real_name: item.real_name,
                    price: 4992,
                    status: 3,
                    no: item.no,
                    taxes_pay_amount: item.taxes_pay_amount,
                    taxes_pay_time: item.taxes_pay_time,
                    fix_asset_num: item.fix_asset_num,
                    fix_asset_long_num: item.fix_asset_long_num,
                    needShow: true,
                  },
                });
              });
          })
          .catch((err) => {
            if (err.code == 533) {
              Dialog.alert({
                title: "提示",
                message:
                  '需要参与<span style="color: #F23D30;">越秀乳业</span>的项目即可<span style="color: #F23D30;">免费领取</span>不动产权证',
                confirmButtonText: "确定",
                messageAlign: "left",
                allowHtml: true,
              })
                .then(() => {
                  // 点击确定，跳转到项目列表
                  this.$router.push({ name: "projectList" });
                })
                .catch(() => {
                  // 点击取消，不做任何操作
                });
              return;
            }
            this.$dialog.alert({
              message: err.msg || "领取失败",
              theme: "round-button",
              confirmButtonText: "确定",
              confirmButtonColor: "#F23D30",
            });
          });
      } else if (type == 3) {
        this.showNotice = true;
        this.selectedItem = item;
        this.source = 20;
        this.amount = Number(item.tickets);
      } else {
        // 其他情况（如查看不动产权证）保持原有逻辑
        this.$router.push({
          name: "propertyCertificate",
          query: {
            id: item.id,
            typeId: item.house_detail.id,
            real_name: item.real_name,
            price: 4992,
            status: item.status,
            no: item.no,
            taxes_pay_amount: item.taxes_pay_amount,
            taxes_pay_time: item.taxes_pay_time,
            fix_asset_num: item.fix_asset_num,
            fix_asset_long_num: item.fix_asset_long_num,
          },
        });
      }
    },
    jumpToReceipt(item) {
      this.$router.push({
        name: "depositReceipt",
        query: {
          id: item.id,
          receiverName: item.real_name,
          deposit: item.price,
          status: item.status,
          pay_time: item.pay_time,
        },
      });
    },
    async getAssetList(data) {
      try {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
        });
        const res = await axios.get(api.myHouseOrderList, {
          params: { page: 1, size: 100 },
        });
        this.assetList = res.data.list;
        if (data) {
          const item = this.assetList.find((item) => item.id === data.id);
          if (this.source == 15) {
            this.viewCenterImage(item);
          }
          if (this.source == 20) {
            this.viewCenterImage2(item);
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
        this.$toast.clear();
      }
    },
    getStatusClass(status) {
      switch (status) {
        case 0:
          return "bg-[#FFF3E0] text-[#FF9800]"; // 待审核
        case 1:
          return "bg-[#E3F2FD] text-[#2196F3]"; // 审核通过
        case 2:
          return "bg-[#E8F5E9] text-[#4CAF50]"; // 已完成
        default:
          return "bg-[#FFEBEE] text-[#F44336]"; // 审核失败
      }
    },
    getStatusText(status) {
      switch (status) {
        case 0:
          return "待审核";
        case 1:
          return "审核通过";
        case 2:
          return "已完成";
        default:
          return "审核失败";
      }
    },
  },
};
</script>

<style scoped lang="less">
/* 空视图样式 */
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 250px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.empty-btn {
  width: 140px;
  height: 40px;
  font-size: 16px;
  margin-top: 16px;
  background-color: #f23d30;
  border: none;
}

.view-button,
.free-button {
  width: 100%;
  height: 34.713px;
  padding: 4.339px;
  justify-content: center;
  align-items: center;
  border-radius: 5.207px;
  color: #f7f7f8;
  text-align: center;
  font-family: "HarmonyOS Sans SC";
  font-size: 12px;
  font-weight: 500;
  line-height: 17.356px;
  display: flex;
  margin-bottom: 10px;
}

.view-button {
  background: linear-gradient(180deg, #59caff 0%, #0055c7 100%);
}

.free-button {
  background: linear-gradient(147deg, #eb6400 20.81%, #f49f00 92.21%);
}

/* 按钮网格布局 */
.button-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 10px;
}

/* 标题标签样式 */
.title-tag {
  position: absolute;
  top: -3px;
  left: 20px;
  padding: 4px 10px;
  border-radius: 0px 0px 3px 3px;
  background: linear-gradient(180deg, #ff002d 0%, #ff7d28 100%);
  color: #fff;
  font-family: "HarmonyOS Sans SC";
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
}

.content-container {
  background: #fff;
  stroke-width: 1px;
  stroke: rgba(195, 159, 122, 0.13);
  filter: drop-shadow(0px 0px 8px #f2f4f7);
  border: 1px solid rgba(195, 159, 122, 0.13);
  overflow: hidden;
  margin-top: 0;
  position: relative;
  border-radius: 8px;
  margin-bottom: 20px;
}

.house-title {
  color: #1f1f1f;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.9px;
}

.project-name {
  color: #f33;
  text-align: right;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.3px;
}

.content-title {
  color: #1f1f1f;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.content-text {
  color: #333;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 14px;
  line-height: 1.6;
  padding: 0 10px;
}

/* 添加图片样式 */
.content-text :deep(img) {
  max-width: 100%;
  height: auto;
  cursor: pointer;
}

.house-content {
  background-color: #fafafa;
  padding: 15px;
  border-radius: 8px;
  margin: 0 5px;
}

.vr-button {
  border-radius: 5.207px;
  background: linear-gradient(147deg, #eb6400 20.81%, #f49f00 92.21%);
  color: #f7f7f8;
  text-align: center;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 17.356px;
  font-weight: 500;
  line-height: 17.356px;
  padding: 10px 20px;
  border: none;
  width: 180px;
}

.house-layout-image {
  width: 100%;
  text-align: center;
}

.title-container {
  width: 92.712px;
  height: 30px;
  flex-shrink: 0;
  background: linear-gradient(147deg, #eb6400 20.81%, #f49f00 92.21%);
  text-align: center;
  border: 1px solid rgba(195, 159, 122, 0.13);
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.25));
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin: 16px 0 8px;
  position: relative;
  z-index: 1;
}

.group-title {
  color: #fff;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: rgba(195, 159, 122, 0.13);
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 17px;
  font-weight: 500;
  letter-spacing: -0.3px;
}

.intro-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}
</style>
