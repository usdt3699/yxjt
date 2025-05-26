<template>
  <div class="min-h-screen relative pb-[10px]">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common2.png" alt="背景" class="w-full" />
      <div class="absolute top-0 left-0 right-0 px-4">
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
        <div class="px-[10px] pt-[15px] pb-[55px] relative z-10">
          <!-- 描述区域 -->
          <div class="flex items-center justify-center mb-4">
            <img
              src="@/assets/img/stock/security_icon.png"
              alt="安全图标"
              class="mr-2 h-[18px]"
            />
            <span class="description-text">银行存管已接入，资金更安全</span>
          </div>

          <!-- 越秀原始股区域 -->
          <div class="stock-container relative">
            <!-- &lt;!&ndash; 标题 &ndash;&gt; -->
            <div class="title-tag">越秀原始股</div>

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

            <!-- &lt;!&ndash; 原始股说明 &ndash;&gt; -->
            <div class="original-stock-info">
              <p
                class="info-text"
                v-for="(item, index) in stockDescList"
                :key="index"
              >
                {{ item }}
              </p>
            </div>

            <!-- &lt;!&ndash; 按钮 &ndash;&gt; -->
            <div class="flex justify-end mt-4">
              <!-- <button class="purchase-button">暂未开放</button> -->
              <button class="purchase-button" @click="jumpToPage('myStocks')">
                立即出售
              </button>
              <!-- <button
                class="purchase-button"
                @click="jumpToPage('projectList')"
              >
                立即抢购
              </button> -->
            </div>
          </div>

          <!-- 越秀地产区域 -->
          <div class="stock-container relative mb-4">
            <!-- 标题 -->
            <div class="title-tag">越秀地产</div>
            <!-- 右上角标签 -->
            <div class="hot-corner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="39"
                height="41"
                viewBox="0 0 39 41"
                fill="none"
                class="corner-svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0.549316 0L40.7922 40.2262V21.4628L18.1024 0H0.549316Z"
                  fill="url(#paint0_linear_40_1495)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_40_1495"
                    x1="0.549316"
                    y1="0"
                    x2="0.549316"
                    y2="40.2262"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#FF002D" />
                    <stop offset="1" stop-color="#FF7D28" />
                  </linearGradient>
                </defs>
              </svg>
              <span class="hot-text">港交所</span>
            </div>

            <!-- 股票价格 -->
            <div class="price-section">
              <span class="stock-price">{{
                day_stock_log.yesterday_min_sale_price || "4.870"
              }}</span>
              <span class="currency">港元</span>
              <span class="price-change"
                >{{ formatIncrease(day_stock_log.yesterday_increase_value) }}
                {{ day_stock_log.yesterday_increase_rate || "-2.79%" }}</span
              >
            </div>

            <!-- 三行数据 -->
            <div class="data-section">
              <div class="data-row">
                <div class="data-item">
                  <div class="data-label">今开</div>
                  <div class="data-value">
                    {{ day_stock_log.today_open_sale_price || "5.030" }}
                  </div>
                </div>
                <div class="data-separator"></div>
                <div class="data-item">
                  <div class="data-label">最高</div>
                  <div class="data-value">
                    {{ day_stock_log.today_max_sale_price || "5.090" }}
                  </div>
                </div>
                <div class="data-separator"></div>
                <div class="data-item">
                  <div class="data-label">成交量</div>
                  <div class="data-value">
                    {{ day_stock_log.today_sale_nums || "1425万股" }}
                  </div>
                </div>
              </div>

              <div class="data-row">
                <div class="data-item">
                  <div class="data-label">昨收</div>
                  <div class="data-value">
                    {{ day_stock_log.yesterday_close_sale_price || "5.010" }}
                  </div>
                </div>
                <div class="data-separator"></div>
                <div class="data-item">
                  <div class="data-label">最低</div>
                  <div class="data-value">
                    {{ day_stock_log.yesterday_min_sale_price || "4.870" }}
                  </div>
                </div>
                <div class="data-separator"></div>
                <div class="data-item">
                  <div class="data-label">成交额</div>
                  <div class="data-value">
                    {{ day_stock_log.yesterday_sale_nums || "7092万" }}
                  </div>
                </div>
              </div>

              <div class="data-row">
                <div class="data-item">
                  <div class="data-label">涨幅率</div>
                  <div class="data-value">
                    {{ day_stock_log.increase_rate || "0.35%" }}
                  </div>
                </div>
                <div class="data-separator"></div>
                <div class="data-item">
                  <div class="data-label">市盈率(TTM)</div>
                  <div class="data-value">
                    {{ day_stock_log.ttm_rate || "6.30" }}
                  </div>
                </div>
                <div class="data-separator"></div>
                <div class="data-item">
                  <div class="data-label">市值</div>
                  <div class="data-value">
                    {{ day_stock_log.market_price || "196.04亿" }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 按钮区域 -->
            <div class="button-section">
              <button class="view-button" @click="jumpToPage('myStocks')">
                查看我的股票
              </button>
              <button class="free-button" @click="handleFreeStock">
                股票免费领取
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 客服组件 -->
      <CustomerService
        :position="customerServicePos"
        @contact="handleCustomerService"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import CustomerService from "@/components/CustomerService.vue";
import axios from "@/net/axios";
import api from "@/net/api";

export default {
  name: "index",
  components: {
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
      stock: {},
      day_stock_log: {},
    };
  },

  mounted() {
    this.getSystemInfo();
    this.getDetails();
  },
  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),
    handleCustomerService() {
      console.log("点击客服", this.systemInfo?.customerService);
      if (this.systemInfo?.customerService) {
        window.location.href = this.systemInfo.customerService;
      }
    },
    jumpToPage(name) {
      this.$router.push({ name });
    },
    formatIncrease(value) {
      if (!value) return "-0.14";
      return parseFloat(value).toFixed(2);
    },
    async getDetails() {
      try {
        const res = await axios.get(api.stock);
        if (res) {
          this.stock = res.data;
        }
        const res2 = await axios.get(api.day_stock_log);
        if (res2) {
          this.day_stock_log = res2.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    handleFreeStock() {
      // 使用vant的Dialog组件弹窗
      this.$dialog
        .alert({
          title: "免费领取股票",
          message: "邀请好友即可免费领取股票",
          confirmButtonText: "确定",
        })
        .then(() => {
          // 点击确定，跳转到邀请好友页面
          this.$router.push({ name: "userInvite" });
        })
        .catch(() => {
          // 点击取消，不做任何操作
        });
    },
  },
};
</script>

<style scoped lang="less">
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
  border-radius: 8px;
  padding: 20px 15px;
  margin-top: 25px;
}

/* 标题标签样式 */
.title-tag {
  position: absolute;
  top: -3px;
  left: 0;
  padding: 4px 10px;
  border-radius: 0px 0px 3px 3px;
  background: linear-gradient(180deg, #ff002d 0%, #ff7d28 100%);
  color: #fff;
  font-family: "HarmonyOS Sans SC";
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
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
  color: #fff;
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
  color: #008f67;
  font-family: "HarmonyOS Sans SC";
  font-size: 41px;
  font-weight: 400;
  line-height: normal;
}

.currency {
  color: #008f67;
  font-family: "HarmonyOS Sans SC";
  font-size: 16px;
  font-weight: 400;
  margin-left: 5px;
}

.price-change {
  color: #008f67;
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
  background-color: #ececec;
}

/* 按钮区域样式 */
.button-section {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

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
</style>
