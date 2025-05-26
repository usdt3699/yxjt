<template>
  <div class="min-h-screen relative overflow-y-auto">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common2.png" alt="背景" class="w-full">
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <TitleBar :logoSrc="require('@/assets/img/home/yuexiu_logo.png')" @back="$router.back()"/>

        <!-- 主要内容区域 -->
        <div class="pt-[15px] pb-[55px] relative z-10">
          <!-- 越秀地产区域 -->
          <div class="relative mb-4 bg-white">
            <!-- 标题 -->
            <div class="title-tag">我的车辆</div>

            <!-- 列表项容器 - 增加上边距 -->
            <div class="pt-[60px] pb-2 px-[15px]">
              <!-- 空视图显示 -->
              <div v-if="assetList.length === 0" class="empty-container">
                <van-empty
                  description="暂未领取"
                  image="search"
                >
                  <van-button
                    round
                    type="danger"
                    class="empty-btn"
                    @click="goToCarList"
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
<!--                  <button class="free-button mx-2" @click="jumpToReceipt(item)">{{item.car_detail.status==1?'立即缴纳':'查看收据'}}</button>-->
                  <button class="free-button" @click="viewCenterImage(item)">查看凭证</button>
                </div>
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
    </div>
    <!-- 使用证书预览组件 -->
    <vehicle-certificate-preview :card-detail="cardDetail"
                                 :show.sync="showCertificatePreview"></vehicle-certificate-preview>
  </div>
</template>

<script>
import {Button, Dialog, Empty, Icon, ImagePreview, Loading, Overlay} from "vant";
import TitleBar from "@/components/common/TitleBar.vue";
import axios from "@/net/axios";
import api from "@/net/api";
import VehicleCertificatePreview from "@/components/bank/VehicleCertificatePreview.vue";

export default {
  name: "HouseDetails",
  components: {
    VehicleCertificatePreview,
    TitleBar,
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [ImagePreview.Component.name]: ImagePreview.Component,
    [Empty.name]: Empty,
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
      pageLoading: false,
      houseName: '',
      houseContent: '',
      showImagePreview: false,
      assetList: [],
      previewImages: [],
      previewIndex: 0,
      showCertificatePreview: false,
      cardDetail: null, // 存储银行卡详情数据
    };
  },

  mounted() {
    this.getAssetList();
  },

  methods: {
    // 跳转到汽车申领页面
    goToCarList() {
      this.$router.push({ name: 'carList' });
    },
    jumpToReceipt(item){
      this.$router.push({
        name: 'carReceipt', query: {
          id: item.id,
          receiverName: item.car_detail.real_name,
          deposit: item.deposit,
          status: item.car_detail.status,
          pay_time: item.car_detail.pay_time,
          name: item.name,
        }
      });
    },
    viewCenterImage(item) {
      this.cardDetail = item;
      this.showCertificatePreview = true;
    },
    async getAssetList() {
      try {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
        });
        const res = await axios.get(api.myCarList);
        if (res.code === 200 && res.data?.carList) {
          this.assetList = res.data.carList.filter(item=>item.status==3);
        }
      } catch (error) {
        Dialog.alert({
          title: "提示",
          message: error.msg || "获取失败",
          confirmButtonText: "确定",
          confirmButtonColor: "#F23D30",
        });
      } finally {
        this.$toast.clear()
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
  background-color: #F23D30;
  border: none;
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

.content-container {
  background: #FFF;
  stroke-width: 1px;
  stroke: rgba(195, 159, 122, 0.13);
  filter: drop-shadow(0px 0px 8px #F2F4F7);
  border: 1px solid rgba(195, 159, 122, 0.13);
  overflow: hidden;
  margin-top: 0;
  position: relative;
  border-radius: 8px;
  margin-bottom: 20px;
}

.house-title {
  color: #1F1F1F;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.9px;
}

.project-name {
  color: #F33;
  text-align: right;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.3px;
}

.content-title {
  color: #1F1F1F;
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
/* 添加图片样式 */
.content-text :deep(img) {
  max-width: 100%;
  height: auto;
  cursor: pointer;
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
.house-layout-image {
  width: 100%;
  text-align: center;
}

.title-container {
  width: 92.712px;
  height: 30px;
  flex-shrink: 0;
  background: linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%);
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
  color: #FFF;
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
