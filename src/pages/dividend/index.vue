<template>
  <div class=" h-full w-full relative">
    <img
        src="@/assets/img/dividend/bg.png"
        class="fixed top-0 left-0  object-cover h-full w-full "
    />
    <!-- 替换原来的返回按钮 -->
    <van-nav-bar
        title=""
        left-text="返回"
        left-arrow
        fixed
        @click-left="$router.back()"
        class="bg-transparent"
        :border="false"
    />
    <!-- Header Section -->
    <div class="header-section absolute w-full px-2 mt-16  ">
      <div class="flex flex-col bg-white rounded-[10px] px-4 pb-10 mt-10">
        <div class="text-red-500 guozai relative mt-2 mb-4">
          {{ bondTitle }}
        </div>
        <!-- Stats Display -->
        <div class="flex justify-between items-center text-black text-center ">
          <div class="value text-red-500 text-[1.5rem] font-bold">{{ bondInfo.dayRate }}%</div>
          <div class="text-black">{{ bondInfo.netValue }}</div>
          <div class="value text-red-500">{{ bondInfo.yearRate }}%</div>
        </div>

        <div class="flex justify-between items-center text-center  border-b-[1px] border-gray-200 ">
          <div class="label">日涨跌幅</div>
          <div class="label">单位净值(03-18)</div>
          <div class="label">近一年涨跌幅</div>
        </div>

        <!-- Tags -->
        <div class="flex justify-between items-center text-center text-black py-2 w-1/2 text-[12px]">
          <span class="tag  bg-[#FFF7DC] text-[#DF8A0A]">{{ bondInfo.startAmount }}元起</span>
          <span class="tag  bg-[#FFF0F0] text-[#F23D30]">{{ bondInfo.type }}</span>
          <span class="tag  bg-[#F0F3FF] text-[#5D77FF]">{{ bondInfo.riskLevel }}</span>
        </div>

        <!-- Labels -->
        <div
            class="flex  items-center justify-between text-center border-blue-500 text-blue-500 pb-2 w-[50%] text-[14px]">
          <span class="px-1 border border-blue-500 rounded">中国银行担保</span>
          <span class="px-1 border border-blue-500 rounded">国家背书</span>
        </div>
        <div
            class="trend-chart mb-4"
            ref="chartRef"
        ></div>
        <!--        tab-->
        <div class="flex w-full justify-between items-center bg-[#F2F4F7] text-gray-500 px-2 py-1 rounded">
          <span
              v-for="(tab, index) in tabs"
              :key="index"
              :class="['tab', {'text-blue-500': currentTab === index}]"
              @click="changeTab(index)"
          >
            {{ tab.name }}
          </span>
        </div>

      </div>

    </div>

  </div>
</template>


<script>
import axios from "@/net/axios";
import api from "@/net/api";
import {NavBar} from "vant";
import {isNullOrEmpty} from "@/utils";
import * as echarts from "echarts";

export default {
  name: "index",
  components: {[NavBar.name]: NavBar},
  data() {
    return {
      active: 0,
      isNullOrEmpty,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      walletInfo: {},
      bondInfo: {
        dayRate: 0,
        netValue: 0,
        yearRate: 0,
        startAmount: 500,
        riskLevel: "低风险",
        type: "原理型",
      },
      tabs: [
        {name: "近1月", value: 1},
        {name: "近3月", value: 3},
        {name: "近6月", value: 6},
        {name: "近1年", value: 12},
      ],
      currentTab: 0,
      trendData: [],
      bondTitle: "国债逆回购7天", // 默认标题
      id: null,
    };
  },
  mounted() {
    // 从路由参数获取天数和名称
    const {days, name, id} = this.$route.query;
    if (days) {
      this.bondTitle = `${name || "国债逆回购"}${days}天`;
    }
    this.id = id;
    this.getBondDetail();
    this.getTrendData();
  },
  filters: {
    formatDecimal(value) {
      return parseFloat(value).toFixed(1);
    },
    formatDecimal2(value) {
      return parseFloat(value).toFixed(0);
    },
    formatDecimal3(value) {
      if (!value) return "0";
      return (parseFloat(value) / 10000).toFixed(0);
    },
  },
  computed: {
    title() {
      return this.$route.meta.title; // 获取路由的meta属性的title值
    },
  },
  methods: {
    refreshData() {
      this.refreshing = true;
      this.loadMore();
    },

    loadMore() {
      axios
          .get(api.welfareList)
          .then((res) => {
            this.list = res.data.filter((item) => item.ntype == 2);
            this.loading = false;
            this.refreshing = false;
            this.finished = true;
          })
          .catch((err) => {
            this.loading = false;
            this.finished = true;
            this.refreshing = false;
            err.msg && this.$toast(err.msg);
          });
    },
    jumpToPay(data) {
      this.$router.push({
        name: "buyDividend",
        query: {
          id: data.id,
          stock: data.stock,
          price: data.price,
          title: "国债期货",
          unit: "股",
        },
      });
    },
    // 获取国债详情
    async getBondDetail() {
      try {
        const data = await axios.get(api.getBondDetail, {params: {id: this.id}})
        if (data.code === 200) {
          this.bondInfo = data.data;
        }
      } catch (err) {
        this.$toast(err.message);
      }
    },

    // 获取走势数据
    async getTrendData() {
      try {
        const months = this.tabs[this.currentTab].value;

        // 生成模拟数据
        const generateMockData = (months) => {
          const data = [];
          const now = new Date();
          const points = 20; // 数据点数量

          for (let i = 0; i < points; i++) {
            const date = new Date(
                now - months * 30 * 24 * 60 * 60 * 1000 * (1 - i / points)
            );
            data.push({
              date: date.toISOString().split("T")[0],
              value1: (20 + Math.random() * 5).toFixed(2), // 收益率 20-25之间
              value2: (18 + Math.random() * 5).toFixed(2), // 参考收益 18-23之间
            });
          }
          return data;
        };

        const mockData = {
          code: 200,
          data: generateMockData(months),
        };

        console.log(JSON.stringify(mockData));
        if (mockData.code === 200) {
          this.trendData = mockData.data;
          // 更新图表的x轴数据
          this.renderChart();
        }
      } catch (err) {
        this.$toast(err.message);
      }
    },

    // 切换时间tab
    changeTab(index) {
      this.currentTab = index;
      this.getTrendData();
    },

    // 渲染图表方法 - 这里需要引入你选择的图表库实现
    renderChart() {
      const chartDom = this.$refs.chartRef;
      const myChart = echarts.init(chartDom);

      const option = {
        grid: {
          top: "15%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.trendData.map((item) => item.date),
          axisLine: {
            lineStyle: {
              color: "#999",
            },
          },
          axisLabel: {
            color: "#999",
            fontSize: 12,
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}%",
            color: "#999",
            fontSize: 12,
          },
          splitLine: {
            lineStyle: {
              color: "#eee",
            },
          },
        },
        series: [
          {
            name: "收益率",
            type: "line",
            smooth: true,
            symbol: "none",
            data: this.trendData?.map((item) => item.value1) || [],
            lineStyle: {
              color: "#5470c6",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(84,112,198,0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(84,112,198,0.1)",
                },
              ]),
            },
          },
          {
            name: "参考收益",
            type: "line",
            smooth: true,
            symbol: "none",
            data: this.trendData?.map((item) => item.value2) || [],
            lineStyle: {
              color: "#ee6666",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(238,102,102,0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(238,102,102,0.1)",
                },
              ]),
            },
          },
        ],
      };

      myChart.setOption(option);

      // 监听窗口大小变化
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
  },

  // 组件销毁时移除事件监听
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped lang="less">
.bg-wrapper {
  background-image: url("../../assets/img/dividend/bg.png");
  background-repeat: no-repeat;
}

.header-section {
  color: white;

  .guozai {
    font-size: 14px;
    font-weight: bold;
  }

  .guozai:after {
    content: ""; /* 必须设置 content 属性才能生效 */
    width: 48px; /* 下划线长度*/
    height: 3px; /* 下划线高度*/
    background-color: red; /* 下划线颜色*/
    position: absolute; /* 下划线位置*/
    left: 20px; /* 下划线位置*/
    top: 24px; /* 下划线位置，可以参考行高来设置*/
  }

  .stats-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    background: white;
  }

  .tag {
    padding: 2px;
    border-radius: 4px;
    font-size: 12px;
  }
}

.label {
  font-size: 14px;
  color: gray;
}

.list-section {
  margin-top: 20px;

  .item-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 15px;

    .card-header {
      background: #e7ca98;
      color: #8a5f4d;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
    }

    .card-body {
      padding: 15px;
      position: relative;

      .tag-limited {
        position: absolute;
        left: 0;
        top: 0;
        background: #ff4444;
        color: white;
        padding: 2px 8px;
        border-bottom-right-radius: 8px;
        font-size: 12px;
      }

      .info-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;

        .info-item {
          text-align: center;

          &.center {
            flex: 1;
          }

          .label {
            font-size: 14px;
            color: #333;
          }

          .value {
            color: #ff4444;
            font-weight: bold;
          }
        }

        .buy-btn {
          background: #e7ca98;
          color: #724a07;
          padding: 6px 20px;
          border-radius: 20px;
          font-weight: bold;
        }
      }
    }
  }
}

// 添加 nav-bar 样式覆盖
:deep(.van-nav-bar) {
  background-color: transparent;

  .van-nav-bar__text {
    color: white;
  }

  .van-icon {
    color: white;
  }

  // 去掉底部边框
  .van-nav-bar__content {
    border-bottom: none;
  }
}

.trend-chart {
  width: 100%;
  height: 180px;
  margin: 10px 0;
}

// 可以添加tab的样式让它们分布更均匀
.tab {
  flex: 1;
  text-align: center;
  padding: 4px 0;
}
</style>
