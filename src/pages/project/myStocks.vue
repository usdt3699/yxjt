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
        <!-- 描述区域 -->
        <div class="flex items-center justify-center mb-4">
          <img
            src="@/assets/img/stock/security_icon.png"
            alt="安全图标"
            class="mr-2 h-[18px]"
          />
          <span class="description-text">银行存管已接入，资金更安全</span>
        </div>
        <!-- 主要内容区域 -->
        <div class="pt-[15px] pb-[55px] relative z-10">
          <!-- 越秀原始股区域 -->
          <div class="relative mb-4 bg-white">
            <!--            &lt;!&ndash; 标题 &ndash;&gt;-->
            <div class="title-tag">越秀原始股</div>

            <!--            &lt;!&ndash; 股票信息卡片 &ndash;&gt;-->
            <div class="pt-[30px] pb-2 px-4">
              <div v-if="loading" class="flex justify-center py-8">
                <van-loading color="#FF7D28" size="24px">加载中...</van-loading>
              </div>

              <div v-else class="stock-card">
                <!--                &lt;!&ndash; 股票信息头部 &ndash;&gt;-->
                <div class="stock-card-header">
                  <div class="stock-title">越秀原始股</div>
                  <div class="stock-date">{{ currentDate }}</div>
                </div>

                <!--                &lt;!&ndash; 股票信息内容 &ndash;&gt;-->
                <div class="stock-card-content">
                  <div class="flex justify-between">
                    <!--                  &lt;!&ndash; 每股单价 &ndash;&gt;-->
                    <div class="stock-info-item w-[48%]">
                      <div class="info-label">每股单价</div>
                      <div class="price-value">
                        {{ originalStockData.price }}
                        <span class="unit">元</span>
                      </div>
                      <div class="price-change flex justify-between">
                        <span>+{{ originalStockData.increase_num }}</span>
                        <span>+{{ originalStockData.increase_rate }}%</span>
                      </div>
                    </div>

                    <!--                  &lt;!&ndash; 开放信息 &ndash;&gt;-->
                    <div class="stock-info-item w-[48%]">
                      <div class="info-label">开放状态</div>
                      <div class="status-value">
                        {{ originalStockData.remark || "[24小时开放]" }}
                      </div>
                    </div>
                  </div>
                  <div class="flex justify-between">
                    <div class="stock-info-item w-[48%]">
                      <div class="info-label">拥有原始股</div>
                      <div class="status-value" style="color: #000">
                        {{ Number(coinList.stock_right?.num) || 0 }}股
                      </div>
                    </div>
                    <div class="stock-info-item w-[48%] total-amount">
                      <div class="info-label">总价值</div>
                      <div class="status-value" style="color: red">
                        {{ Number(coinList.stock_right?.value) || 0 }}元
                      </div>
                    </div>
                  </div>
                  <!--                  &lt;!&ndash; 股票说明 &ndash;&gt;-->
                  <div class="stock-info-item description-item">
                    <div class="info-label">股票说明</div>
                    <div class="description-list">
                      <p
                        v-for="(item, index) in stockDescList"
                        :key="index"
                        class="description-item-text"
                      >
                        {{ item }}
                      </p>
                    </div>
                  </div>
                </div>

                <!--                &lt;!&ndash; 购买按钮 &ndash;&gt;-->
                <!-- <div class="sell-button-container">
                  <van-button
                    type="danger"
                    class="sell-button w-[80%]"
                    @click="handlePurchase"
                    >立即抢购</van-button
                  >
                </div> -->
                <template v-if="originalStockData?.stock_sales_num > 0">
                  <div class="sell-button-container">
                    <van-button
                      type="danger"
                      class="sell-button w-[80%]"
                      @click="handleYsgqb"
                      >出售全部原始股</van-button
                    >
                  </div>
                  <div class="sell-button-container">
                    <van-button
                      type="danger"
                      class="sell-button w-[80%]"
                      @click="zsShow = true"
                      >查看证书</van-button
                    >
                  </div>
                </template>
                <div class="flex justify-between" v-else>
                  <van-button
                    type="danger"
                    class="sell-button w-[48%]"
                    @click="handleYsgyb"
                    >出售一半原始股</van-button
                  >
                  <van-button
                    type="danger"
                    class="sell-button w-[48%]"
                    @click="handleYsgqb"
                    >出售全部原始股</van-button
                  >
                </div>

                <!--                &lt;!&ndash; 底部提示 &ndash;&gt;-->
                <div class="stock-card-footer">
                  <van-icon name="info-o" size="14" color="#999" />
                  <span>股票价格实时更新，请以实际交易为准</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 越秀地产区域 -->
          <div class="relative mb-4 bg-white">
            <!-- 标题 -->
            <div class="title-tag">我的股票</div>

            <!-- 股票信息卡片 -->
            <div class="pt-[30px] pb-2 px-4">
              <div v-if="loading" class="flex justify-center py-8">
                <van-loading color="#FF7D28" size="24px">加载中...</van-loading>
              </div>

              <div v-else class="stock-card">
                <!-- 股票信息头部 -->
                <div class="stock-card-header">
                  <div class="stock-title">越秀地产股票</div>
                  <div class="stock-date">{{ currentDate }}</div>
                </div>

                <!-- 股票信息内容 -->
                <div class="stock-card-content">
                  <div class="flex justify-between">
                    <!-- 每股单价 -->
                    <div class="stock-info-item w-[48%]">
                      <div class="info-label">每股单价</div>
                      <div class="price-value">
                        {{ Number(stockData.last_day_price)
                        }}<span class="unit">元</span>
                      </div>
                    </div>
                    <div class="stock-info-item w-[48%]">
                      <div class="info-label">开放状态</div>
                      <div class="status-value">
                        {{ originalStockData.remark || "[24小时开放]" }}
                      </div>
                    </div>
                    <!-- 持有数量 -->
                  </div>
                  <div class="flex justify-between">
                    <div class="stock-info-item w-[48%]">
                      <div class="info-label">持有数量</div>
                      <div class="status-value" style="color: #000">
                        {{ Number(stockData.num) }}<span class="unit">股</span>
                      </div>
                    </div>
                    <div class="stock-info-item w-[48%] total-amount">
                      <div class="info-label">总价值</div>
                      <div class="status-value" style="color: red">
                        {{ Number(stockData.total_price) }}元
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 出售按钮 -->
                <div class="sell-button-container">
                  <van-button
                    type="danger"
                    class="sell-button w-[80%]"
                    @click="handleSell"
                    >立即出售</van-button
                  >
                  <!-- <van-button
                    type="danger"
                    class="sell-button"
                    @click="handleSell"
                    >立即出售</van-button
                  > -->
                </div>

                <!-- 底部提示 -->
                <div class="stock-card-footer">
                  <van-icon name="info-o" size="14" color="#999" />
                  <span>股票价格每日更新，请以实际交易为准</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <payment-dialog
      v-model="showPayment"
      :amount="price"
      :coupon="null"
      tip="说明：出售原始股需要缴纳1000元个人所得税，费用是由国家金融监督管理总局收取。出售成功后该笔款项将会在3个工作日内打款。"
      @confirm="handlePayConfirm"
    />
    <!-- :card-detail="selectedCardDetail" -->
    <ZsCavas
      :userInfo="{ ...originalStockData, ...userInfo }"
      :show.sync="zsShow"
    />
  </div>
</template>

<script>
import { Button, Dialog, Icon, ImagePreview, Loading, Overlay } from "vant";
import TitleBar from "@/components/common/TitleBar.vue";
import axios from "@/net/axios";
import api from "@/net/api";
import PaymentDialog from "@/components/common/PaymentDialog.vue";
import ZsCavas from "@/components/ZsCavas.vue";

export default {
  name: "MyStocks",
  components: {
    PaymentDialog,
    TitleBar,
    ZsCavas,
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  data() {
    return {
      showPayment: false,
      price: 0,
      loading: true,
      source: 0,
      zsShow: false,
      stockData: {
        num: "0",
        last_day_price: "0",
        total_price: "0",
      },
      originalStockData: {
        price: "119.68",
        increase_num: "6.34",
        increase_rate: "5.6",
        remark: "[24小时开放]",
      },
      showImagePreview: false,
      previewImages: [],
      previewIndex: 0,
      coinList: {},
      userInfo: {},
    };
  },

  computed: {
    displayName() {
      if (!this.userInfo) {
        return "";
      }
      return this.userInfo.real_name || this.userInfo.name;
    },
    currentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    stockDescList() {
      if (!this.originalStockData.desc)
        return ["• 集团内部股份，享有更多福利", "• 持续上涨，实现财富自由"];
      return this.originalStockData.desc.split(",");
    },
  },
  mounted() {
    this.getUserWallet();
    this.getStockData();
    this.getOriginalStockData();
  },
  methods: {
    handleYsgqb() {
      //       Number(coinList.stock_right?.num)
      // Number(coinList.stock_right?.value)
      this.$dialog
        .confirm({
          title: "确认出售",
          message: `确定要出售全部原始股吗？\n出售数量：${Number(
            this.coinList.stock_right?.num
          )}股\n预计获得：${Number(this.coinList.stock_right?.value)}元`,
          confirmButtonText: "确认出售",
        })
        .then(() => {
          this.showPayment = true;
          this.price = 1500;
          this.source = 18;
        })
        .catch(() => {});
    },
    handleYsgyb() {
      this.$dialog
        .confirm({
          title: "确认出售",
          message: `确定要出售一半原始股吗？\n出售数量：${
            Number(this.coinList.stock_right?.num) / 2
          }股\n预计获得：${Number(this.coinList.stock_right?.value) / 2}元`,
          confirmButtonText: "确认出售",
        })
        .then(() => {
          this.showPayment = true;
          this.price = 1000;
          this.source = 17;
        })
        .catch(() => {});
    },
    getUserWallet() {
      axios.get(api.userInfo).then((res) => {
        if (res) {
          this.userInfo = res.data.userInfo;
        }
      });
      axios
        .get(api.userWallet)
        .then((res) => {
          const params = {};
          res.data.coinList.forEach((item) => {
            params[item.name_en] = item;
          });
          this.coinList = params;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getStockData() {
      try {
        this.loading = true;
        const res = await axios.get(api.myStock);

        if (res.code === 200 && res.data) {
          this.stockData = res.data;
        }
      } catch (error) {
        Dialog.alert({
          title: "提示",
          message: error.msg || "获取失败",
          confirmButtonText: "确定",
          confirmButtonColor: "#F23D30",
        });
      } finally {
        this.loading = false;
      }
    },
    async getOriginalStockData() {
      try {
        const res = await axios.get(api.stock);
        if (res.code === 200 && res.data) {
          this.originalStockData = res.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    handleSell() {
      // 跳转到出售页面
      this.$router.push({
        name: "withdrawal",
        query: {
          type: "stock",
          num: this.stockData.num,
          title: "越秀地产股票",
          actionText: "出售",
        },
      });
    },

    async handlePayConfirm({ pay_type, channel_type }) {
      const params = {
        pay_type,
        channel_type,
        project_id: this.id,
        source: this.source,
        amount: this.price || 300,
      };

      try {
        const res = await axios.post(api.balancePay, params);
        this.showPayment = false;

        if (pay_type === 9) {
          // 余额支付
          await Dialog.alert({
            title: "提示",
            message: "出售成功！",
            theme: "round-button",
            confirmButtonText: "确定",
            confirmButtonColor: "#EB6400",
          });
          // 点击确定后返回上一页
          this.$router.back();
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
    handlePurchase() {
      this.$router.push({ name: "projectList" });
    },
  },
};
</script>

<style scoped lang="less">
/* 项目信息区域 */
.project-info {
  padding: 0 16px 16px;
}

.project-info-title {
  color: #5e5e5e;
  font-family: "HarmonyOS Sans";
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: 17px; /* 130.769% */
  letter-spacing: 0.9px;
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
}

/* 市值文本样式 */
.market-value {
  border-radius: 2.97px;
  background: #ffcf87;
  padding: 2px 8px;
  color: #705c2d;
  text-align: center;
  font-family: "HarmonyOS Sans";
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-right: 10px;

  .number {
    font-size: 12px;
  }
}
/* 列表项容器样式 */
.list-item-container {
  border-radius: 5px;
  border: 1px solid #fff;
  background: rgba(255, 255, 255, 0.5);
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
  z-index: 10;
}

/* 描述文本样式 */
.description-text {
  color: #a16e00;
  font-family: "HarmonyOS Sans SC";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

/* 股票卡片样式 */
.stock-card {
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 股票卡片头部样式 */
.stock-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #eeeeee;
}

.stock-title {
  color: #333333;
  font-family: "HarmonyOS Sans SC";
  font-size: 18px;
  font-weight: 600;
}

.stock-date {
  color: #999999;
  font-family: "HarmonyOS Sans";
  font-size: 14px;
}

/* 股票信息内容样式 */
.stock-card-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.stock-info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 15px;
  border-radius: 8px;
  background: rgba(255, 125, 40, 0.05);
}

.info-label {
  color: #666666;
  font-family: "HarmonyOS Sans";
  font-size: 14px;
  font-weight: 400;
}

.price-value,
.num-value,
.total-value {
  font-family: "HarmonyOS Sans";
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: baseline;
}

.price-value {
  color: #ff7d28;
}

.num-value {
  color: #333333;
}

.total-value {
  color: #ff002d;
  font-size: 28px;
}

.unit {
  font-size: 14px;
  margin-left: 4px;
  font-weight: 400;
}

/* 总金额特殊样式 */
.total-amount {
  background: rgba(255, 0, 45, 0.05);
  border-left: 4px solid #ff002d;
}

/* 股票卡片底部样式 */
.stock-card-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #999999;
  font-size: 12px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #eeeeee;
}

/* 车辆标题样式 */
.car-title {
  font-family: "HarmonyOS Sans SC";
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.3px;
  background: var(
    --Style,
    linear-gradient(147deg, #eb6400 20.81%, #f49f00 92.21%)
  );
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
  background: var(
    --Style,
    linear-gradient(147deg, #eb6400 20.81%, #f49f00 92.21%)
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
/* 添加图片样式 */
.content-text :deep(img) {
  max-width: 100%;
  height: auto;
  cursor: pointer;
}

.view-button,
.free-button {
  width: 48%;
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
  display: flex;
  margin-top: 10px;
}

.view-button {
  background: linear-gradient(180deg, #59caff 0%, #0055c7 100%);
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

/* 出售按钮容器 */
.sell-button-container {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.sell-button {
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(147deg, #eb6400 20.81%, #f49f00 92.21%);
  border: none;

  &:active {
    opacity: 0.9;
  }
}

/* 原始股价格区域样式 */
.original-stock-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #eeeeee;
}

.original-stock-price-section {
  display: flex;
  align-items: baseline;
  margin-bottom: 5px;
}

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

.open-info {
  color: #ff7100;
  font-family: "HarmonyOS Sans SC";
  font-size: 15px;
  font-weight: 500;
  line-height: normal;
}

.original-stock-info {
  margin: 15px 0;
  padding: 15px;
  border-radius: 8px;
  background: rgba(255, 125, 40, 0.05);
}

.info-text {
  color: #757575;
  font-family: "HarmonyOS Sans SC";
  font-size: 15px;
  font-weight: 400;
  line-height: 21px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}

/* 价格变化样式 */
.price-change {
  color: #e42121;
  font-size: 16px;
  margin-left: 10px;
  font-weight: 400;
}

/* 开放状态值样式 */
.status-value {
  color: #ff7100;
  font-family: "HarmonyOS Sans SC";
  font-size: 16px;
  font-weight: 600;
}

/* 描述项样式 */
.description-item {
  background: rgba(255, 125, 40, 0.05);
}

.description-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.description-item-text {
  color: #666666;
  font-family: "HarmonyOS Sans SC";
  font-size: 15px;
  line-height: 21px;
}
</style>
