<template>
  <div class="min-h-screen relative pb-[260px]">
    <div class="w-full relative">
      <img
        src="@/assets/img/home/bg_common3.png"
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
        </div>

        <!-- 主要内容区域 -->
        <div class="pt-[15px] pb-[55px] relative z-10">
          <!-- 描述区域 -->
          <div class="flex items-center justify-center mb-4">
            <img
              src="@/assets/img/stock/security_icon.png"
              alt="安全图标"
              class="mr-2 h-[18px]"
            />
            <span class="description-text">银行存管已接入，资金更安全</span>
          </div>

          <!-- &lt;!&ndash; 越秀原始股区域 &ndash;&gt; -->
          <div class="stock-container relative">
            <!-- &lt;!&ndash; 标题和市值 &ndash;&gt; -->
            <div class="flex justify-between items-center">
              <div class="title-tag">越秀原始股</div>
              <div class="market-value">1867亿市值</div>
            </div>

            <!-- &lt;!&ndash; 股票价格 &ndash;&gt; -->
            <div class="price-section mt-4">
              <span class="original-stock-price">{{
                stock.price || "119.68"
              }}</span>
              <span class="original-stock-unit">元</span>
              <span class="original-stock-change"
                >+{{ stock.increase_num || "6.34" }} +{{
                  stock.increase_rate || "5.6"
                }}%</span
              >
            </div>

            <!-- &lt;!&ndash; 开放信息 &ndash;&gt; -->
            <div class="open-info">{{ stock.remark || "[24小时开放]" }}</div>

            <!-- &lt;!&ndash; 原始股说明和历史股价按钮 &ndash;&gt; -->
            <div class="flex justify-between items-start mt-4">
              <div class="original-stock-info">
                <p
                  class="info-text"
                  v-for="(item, index) in stockDescList"
                  :key="index"
                >
                  {{ item }}
                </p>
              </div>
              <!--              <button class="history-price-button">历史股价</button>-->
            </div>
          </div>

          <!-- 项目列表 -->
          <div class="bg-[#FBD5B8] pb-2">
            <div
              v-for="(item, index) in assetList"
              :key="index"
              class="list-item-container mb-2 relative mx-4"
            >
              <!-- 限时抢购标记 -->
              <div v-if="item.id == 7" class="limited-time-tag">
                限时3天抢购
              </div>

              <!-- 标题区 -->
              <div class="flex justify-between items-center p-4">
                <img
                  src="@/assets/img/home/logo.png"
                  alt="logo"
                  class="h-[20px] w-auto"
                />
                <div class="info-row mx-1">
                  <div class="info-label">项目周期</div>
                  <div class="info-value">{{ item.total_day || "" }}天</div>
                </div>
                <div class="price-tag" :class="{ 'mt-6': item.id == 7 }">
                  <div v-if="multiplier > 1" class="welfare-tag">
                    {{ multiplier }}倍福利
                  </div>
                  <span class="price-symbol">¥</span>
                  <span class="price-value">{{ item.price }}</span>
                </div>
              </div>

              <!-- 内容区 -->
              <div class="content-container p-2">
                <div class="flex">
                  <!-- 左侧图片区 -->
                  <div class="left-images flex flex-col items-center mr-4">
                    <img
                      :src="item.img"
                      class="w-[130px] h-[80px] object-cover mb-2 rounded-[5px]"
                    />
                    <img
                      v-if="hasBrandLogo(item)"
                      :src="getBrandLogo(item)"
                      class="h-[38px] w-auto"
                    />
                  </div>

                  <!-- 右侧信息区 -->
                  <div class="flex-1">
                    <div class="title-text mb-1">{{ item.name }}</div>
                    <div class="subtitle-text mb-3">
                      全球优选的持续稳健收益路
                    </div>

                    <div class="flex flex-row justify-between">
                      <div class="info-row mb-2">
                        <div class="info-label">收益率</div>
                        <div class="info-value">
                          <div v-if="multiplier > 1" class="original-price">
                            {{
                              calculateMultipliedIncome(item.day_rate) || "5"
                            }}%
                          </div>
                        </div>
                      </div>
                      <div class="info-row mb-2">
                        <div class="info-label">日收益</div>
                        <div class="info-value">
                          <div v-if="multiplier > 1" class="original-price">
                            {{ calculateMultipliedIncome(item.day_income || "")
                            }}<span class="text-sm">元</span>
                          </div>
                          <div>
                            {{ item.day_income || ""
                            }}<span class="text-sm">元</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-row justify-between">
                      <div class="info-row mb-2">
                        <div class="info-label">越秀原始股</div>
                        <div class="info-value">
                          <div v-if="multiplier > 1" class="original-price">
                            {{
                              calculateMultipliedStocks(
                                item.gift_coin_num || 0
                              )
                            }}<span class="text-sm">股</span>
                          </div>
                          <div>
                            {{ item.gift_coin_num || 0
                            }}<span class="text-sm">股</span>
                          </div>
                        </div>
                      </div>
                      <div class="info-row">
                        <div class="info-label">现金额度</div>
                        <div class="info-value" v-if="item.id == 7">
                          <span class="original-price">30万元</span>
                          <span>60万元</span>
                        </div>
                        <div class="info-value" v-else>
                          <div v-if="multiplier > 1" class="original-price">
                            {{
                              Number(
                                calculateMultipliedCash(item.gift_coin_num_sec)
                              )
                            }}<span class="text-sm">元</span>
                          </div>
                          <div>
                            {{ item.gift_coin_num_sec || ""
                            }}<span class="text-sm">元</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 按钮区域 - 保持不变 -->
                <div class="flex justify-between px-[10px] pb-4">
                  <button class="view-button" @click="jumpToPage(item)">
                    查看详情
                  </button>
                  <button class="free-button" @click="handleAssetClick(item)">
                    立即购买
                  </button>
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
      <payment-dialog
        v-model="showPayment"
        :amount="selectedItem?.price"
        @confirm="handlePayConfirm"
      />
      <DkZsCavas :userInfo="{ ...userInfo }" :show.sync="zsShow" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import CustomerService from "@/components/CustomerService.vue";
import axios from "@/net/axios";
import api from "@/net/api";
import { Dialog, Toast } from "vant";
import PaymentDialog from "@/components/common/PaymentDialog.vue";
import DkZsCavas from "@/components/dkZsCavas.vue";

export default {
  name: "index",
  components: {
    DkZsCavas,
    PaymentDialog,
    CustomerService,
  },
  computed: {
    ...mapState("systemInfo", ["systemInfo"]),
    title() {
      return this.$route.meta.title;
    },
    stockDescList() {
      if (!this.stock.desc)
        return ["• 集团内部股份，享有更多福利", "• 持续上涨，实现财富自由"];
      return this.stock.desc.split(",");
    },
  },
  data() {
    return {
      customerServicePos: {
        right: 15,
        bottom: 80,
      },
      assetList: [],
      showPayment: false,
      zsShow: false,
      userInfo: {},
      selectedItem: null,
      stock: {},
      multiplier: 1,
    };
  },

  created() {},
  mounted() {
    this.getSystemInfo();
    this.getUserInfoData();
    this.getAssetList();
  },
  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),
    // 计算乘以倍数后的收益率
    calculateMultipliedRate(rate) {
      // 移除可能存在的百分号，将字符串转为数字
      let numRate = rate ? parseFloat(rate.toString().replace("%", "")) : 5;
      return (numRate * this.multiplier).toFixed(1);
    },
    // 计算乘以倍数后的日收益
    calculateMultipliedIncome(income) {
      let numIncome = income ? parseFloat(income) : 0;
      return (numIncome / this.multiplier).toFixed(2);
    },
    // 计算乘以倍数后的越秀原始股
    calculateMultipliedStocks(stocks) {
      let numStocks = stocks ? parseFloat(stocks) : 0;
      return Math.floor(numStocks / this.multiplier);
    },
    // 计算乘以倍数后的现金额度
    calculateMultipliedCash(cash) {
      let numCash = cash ? parseFloat(cash) : 0;
      return (numCash / this.multiplier).toFixed(2);
    },
    handleCustomerService() {
      console.log("点击客服", this.systemInfo?.customerService);
      if (this.systemInfo?.customerService) {
        window.location.href = this.systemInfo.customerService;
      }
    },
    jumpToPage(item) {
      this.$router.push({ name: "projectDetails", query: { id: item.id } });
    },
    async getUserInfoData() {
      try {
        const resUser = await axios.get(api.userInfo);
        if (resUser) {
          this.userInfo = resUser.data.userInfo;
        }
        const res2 = await axios.get(api.stock);
        if (res2) {
          this.stock = res2.data;
          if (res2.data.multiplier !== undefined) {
            this.multiplier = Number(res2.data.multiplier);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getAssetList() {
      try {
        this.pageLoading = true;
        const res = await axios.get(api.welfareList, {
          params: {
            type: 2,
          },
        });
        if (res.code === 200 && res.data?.idoList) {
          this.assetList = res.data.idoList;
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
    async handleAssetClick(item) {
      if (!this.userInfo?.is_identify) {
        await Dialog.alert({
          message: "请先完成实名认证",
          confirmButtonText: "去认证",
        });
        this.$router.push({ name: "realNameAuth" });
        return;
      }
      this.selectedItem = item;
      this.showPayment = true;
    },
    async handlePayConfirm({ pay_type, channel_type }) {
      const params = {
        pay_type,
        channel_type,
        project_id: this.selectedItem.id,
        source: 2,
        amount: this.selectedItem.price,
      };

      try {
        const res = await axios.post(api.balancePay, params);
        this.showPayment = false;
        if (pay_type === 9) {
          await this.$dialog.alert({
            title: "提示",
            message: "购买成功！",
            theme: "round-button",
            confirmButtonText: "确定",
            confirmButtonColor: "#F52735",
          });
          this.zsShow = true;
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
    getBrandLogo(item) {
      const type = item.id || "1";
      try {
        return require(`@/assets/img/project/brand_logo_${type}.png`);
      } catch (e) {
        return null;
      }
    },
    hasBrandLogo(item) {
      const type = item.id || "1";
      try {
        require(`@/assets/img/project/brand_logo_${type}.png`);
        return true;
      } catch (e) {
        return false;
      }
    },
  },
};
</script>

<style scoped lang="less">
.bg-windBg {
  background-color: #f9b48e !important;
}
/* 描述文字样式 */
.description-text {
  color: #a16e00;
  font-family: "HarmonyOS Sans SC";
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
}

/* 股票容器样式 */
.stock-container {
  background: #fff;
  padding: 0 20px 15px;
  margin-top: 25px;
  margin-bottom: 10px;
}

/* 标题标签样式 */
.title-tag {
  padding: 4px 10px;
  border-radius: 0px 0px 3px 3px;
  background: linear-gradient(180deg, #ff002d 0%, #ff7d28 100%);
  color: #fff;
  font-family: "HarmonyOS Sans SC";
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
}

/* 市值样式 */
.market-value {
  color: #f70;
  text-align: right;
  font-family: "HarmonyOS Sans SC";
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 21px;
}

/* 原始股价格样式 */
.original-stock-price {
  color: #e42121;
  font-family: "HarmonyOS Sans SC";
  font-size: 41px;
  font-weight: 400;
  line-height: normal;
}

.original-stock-unit {
  color: #e42121;
  font-family: "HarmonyOS Sans SC";
  font-size: 17px;
  font-weight: 400;
  line-height: normal;
  margin-left: 5px;
}

.original-stock-change {
  color: #e42121;
  font-family: "HarmonyOS Sans SC";
  font-size: 17px;
  font-weight: 400;
  line-height: normal;
  margin-left: 10px;
}

/* 24小时开放标记 */
.open-info {
  color: #ff7100;
  font-family: "HarmonyOS Sans SC";
  font-size: 15px;
  font-weight: 500;
  line-height: normal;
  margin-top: 5px;
  margin-left: 10px;
}

/* 原始股说明文字 */
.original-stock-info {
  max-width: 70%;
}

.info-text {
  color: #757575;
  font-family: "HarmonyOS Sans SC";
  font-size: 13px;
  font-weight: 400;
  line-height: 21px;
  margin-bottom: 5px;
}

/* 历史股价按钮 */
.history-price-button {
  padding: 4px 10px;
  border-radius: 5px;
  background: linear-gradient(180deg, #59caff 0%, #0055c7 100%);
  color: #f7f7f8;
  font-family: "HarmonyOS Sans SC";
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
}

/* 列表项容器样式 */
.list-item-container {
  border-radius: 5px;
  border: 1px solid #fff;
  background: rgba(255, 255, 255, 0.5);
}

/* 价格标签样式 */
.price-tag {
  color: #ff5353;
  font-family: "HarmonyOS Sans";
  font-weight: 700;
  line-height: normal;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

/* 福利标签样式 */
.welfare-tag {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(90deg, #ff6a00 0%, #ff0000 100%);
  padding: 2px 6px;
  border-radius: 10px;
  position: absolute;
  top: -26px;
  right: -18px;
  white-space: nowrap;
}

.price-symbol {
  font-size: 15px;
}

.price-value {
  font-size: 20px;
}

/* 内容容器样式 */
.content-container {
  border-radius: 5px;
  background: linear-gradient(180deg, #ffedd2 2%, #fff 51%);
}

/* 标题和副标题样式 */
.title-text {
  color: #33374d;
  font-family: "HarmonyOS Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.subtitle-text {
  color: #999;
  font-family: "HarmonyOS Sans";
  font-size: 11.2px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

/* 信息行样式 */
.info-row {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-label {
  color: #464646;
  font-family: "HarmonyOS Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.info-value {
  color: #ffa400;
  font-family: "HarmonyOS Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  display: flex;
  // align-items: center;
  flex-direction: column;
  flex-wrap: wrap;
  // justify-content: center;
}

/* 按钮区域样式 */
.view-button,
.free-button,
.purchase-button {
  display: flex;
  height: 34.713px;
  padding: 4.339px;
  justify-content: center;
  align-items: center;
  border-radius: 5.207px;
  color: #f7f7f8;
  text-align: center;
  font-family: "HarmonyOS Sans SC";
  font-size: 17.356px;
  font-weight: 500;
  line-height: 17.356px;
}

.view-button {
  background: linear-gradient(180deg, #59caff 0%, #0055c7 100%);
  width: 48%;
}

.free-button,
.purchase-button {
  background: linear-gradient(147deg, #eb6400 20.81%, #f49f00 92.21%);
  width: 48%;
}

.purchase-button {
  width: 146.661px;
}

/* 限时抢购标签样式 */
.limited-time-tag {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px 8px;
  background: linear-gradient(to right, #ff5722, #ff9800);
  color: white;
  font-family: "HarmonyOS Sans SC";
  font-size: 12px;
  font-weight: 500;
  border-radius: 0 5px 0 8px;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

/* 原价划线样式 */
.original-price {
  text-decoration: line-through;
  font-size: 12px;
  color: #999;
  margin-right: 5px;
  position: relative;
  display: inline-block;
  transform: scale(0.9);
  transform-origin: left center;
}
</style>
