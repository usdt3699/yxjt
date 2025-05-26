<template>
  <div class="min-h-screen relative overflow-y-auto bg-[#FFF5EB]">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common4.png" alt="背景" class="w-full">
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <div class="flex items-center p-4">
          <div class="text-black text-lg flex items-center" @click="$router.back()">
            <van-icon name="arrow-left" class="mr-1"/>
            返回
          </div>

          <img src="@/assets/img/home/yuexiu_logo.png" alt="越秀集团" class="h-8 ml-auto">
        </div>

        <!-- 内容区域 -->
        <div class="px-4 pt-4 pb-20">
          <!-- 空视图显示 -->
          <van-empty
            v-if="assetList.length === 0 && !pageLoading"
            class="custom-empty"
            image="search"
            description="暂无相关数据"
          />

          <!-- 列表内容 -->
          <div class="gold-record-card" v-for="(item, index) in assetList" :key="index">
            <!-- 卡片顶部信息区 -->
            <div class="gold-record-header">
              <div class="gold-record-image-container">
                <img :src="getGoldImageByLevel(item.stock_vip_level)" class="gold-record-image" alt="黄金图片">
              </div>
              <div class="gold-record-info">
                <div class="gold-record-title">{{ item.name }}</div>
                <div class="gold-record-time">获取时间：{{ item.created_at }}</div>
              </div>
            </div>

            <!-- 待邮寄状态下显示邮寄按钮 -->
            <div  class="mail-button-container">
              <van-button
                round
                color="#FF8800"
                class="mail-button"
                @click="handleMailGold(item)"
              >
                查看凭证
              </van-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 证书预览 -->
    <gold-certificate-preview :card-detail="selectedCardDetail" :show.sync="showActivityCertificatePreview"></gold-certificate-preview>
  </div>
</template>

<script>
import {Button, Dialog, Icon, Loading, Overlay, Empty} from "vant";
import {mapActions} from "vuex";
import api from "@/net/api";
import axios from "@/net/axios";
import GoldCertificatePreview from "@/components/bank/GoldCertificatePreview.vue";

export default {
  components: {

    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [Empty.name]: Empty,
    GoldCertificatePreview,
  },
  data() {
    return {
      pageLoading: false,
      customerServicePos: {
        right: 15,
        bottom: 80
      },
      assetList: [],
      id: 7,
      showImagePreview: false,
      previewImages: [],
      previewIndex: 0,
      showPayment: false,
      selectedItem: null, // 添加选中的项目
      userInfo: {},
      countdownText: '',
      timer: null,
      address:{},
      selectedCardDetail:{},
      showActivityCertificatePreview:false,
      endTime: new Date('2025-05-12 00:00:00').getTime()
    };
  },

  mounted() {
    this.getSystemInfo();
    this.getAssetList();
    this.getUserInfoData();

  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
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
      return num.toFixed(0);
    }
  },
  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),

    // 根据股东等级获取对应的图片
    getGoldImageByLevel(level) {
      if (level == 1) {
        return require('@/assets/img/invite/gd/1.jpg');
      } else if (level == 2) {
        return require('@/assets/img/invite/gd/2.jpg');
      } else if (level == 3) {
        return require('@/assets/img/invite/gd/3.jpg');
      } else {
        // 默认图片
        return require('@/assets/img/invite/gd/1.jpg');
      }
    },

    handleCustomerService() {
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
        const res = await axios.get(api.buyBonusList, {
          params: { type:3 }
        });

        if (res.code === 200) {
          this.assetList = res.data.idoList || [];
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
    handleBuy(item, index) {
      if (!this.userInfo?.is_identify) {
        Dialog.alert({
          message: "请先完成实名认证",
          confirmButtonText: "去认证",
        }).then(() => {
          this.$router.push({name: "realNameAuth"});
        });
        return;
      }
      // 设置选中的项目
      this.selectedItem = this.assetList[index];
      this.showPayment = true;
    },
    async handlePayConfirm({pay_type, channel_type}) {
      const params = {
        pay_type,
        channel_type,
        project_id: this.selectedItem.id,
        source: 2,
        amount: this.selectedItem ? this.selectedItem.price : 0,
      };

      try {
        const res = await axios.post(api.balancePay, params);
        this.showPayment = false;
        if (pay_type === 9) {
          await Dialog.alert({
            title: "提示",
            message: "支付成功！",
            theme: "round-button",
            confirmButtonText: "确定",
            confirmButtonColor: "#F52735",
          });
          this.$router.back();
        } else {
          if (res.data.payUrl) {
            window.location.href = res.data.payUrl;
          }
        }
      } catch (err) {
        this.showPayment = false;
        await Dialog.alert({
          title: "提示",
          message: err.msg || "支付失败",
          theme: "round-button",
          confirmButtonText: "确定",
          confirmButtonColor: "#F52735",
        });
      }
    },
    startCountdown() {
      this.updateCountdown();
      this.timer = setInterval(this.updateCountdown, 1000);
    },
    updateCountdown() {
      const now = new Date().getTime();
      const distance = this.endTime - now;

      if (distance < 0) {
        clearInterval(this.timer);
        this.countdownText = '已结束';
        return;
      }

      const totalHours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.countdownText = `${totalHours}时${minutes}分${seconds}秒`;
    },
    handleMailGold(item) {
      console.log('查看凭证', item);
      // 构造正确的数据结构，将item作为card_detail的一部分传递
      this.selectedCardDetail = {
        id: item.id,
        stock_vip_level: item.stock_vip_level, // 使用id作为证书等级
        card_detail: {
          real_name: this.userInfo.real_name,
          created_at: item.created_at,
          certificate_num:`YXG-2025-${item.certificate_num}` ,
        }
      };
      this.showActivityCertificatePreview = true;
    },
  },
};
</script>

<style scoped lang="less">
/* 整体背景色 */
.bg-\[#FFF5EB\] {
  background-color: #FFF5EB;
}

/* 标题样式 */
.title-text {
  font-size: 18px;
  font-weight: bold;
  color: #FF8800;
  display: flex;
  align-items: center;
  margin-left: 50px;
}

/* 黄金记录卡片样式 */
.gold-record-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* 卡片顶部样式 */
.gold-record-header {
  display: flex;
  margin-bottom: 15px;
}

.gold-record-image-container {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.gold-record-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gold-record-info {
  flex: 1;
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.gold-record-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.gold-record-time {
  font-size: 12px;
  color: #FF8800;
}

/* 状态信息样式 */
.gold-record-status {
  font-size: 14px;
  color: #666;
  padding: 10px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 15px;
}

.status-pending {
  color: #FF8800;
}

/* 用户信息区域样式 */
.gold-record-user-info {
  padding-top: 5px;
}

.gold-record-info-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 15px;
  color: #666;
}

.info-label {
  color: #666;
}

.info-value {
  color: #999;
  text-align: right;
}

/* 空视图样式 */
.custom-empty {
  padding: 40px 0;
  background: white;
  border-radius: 12px;
  margin-top: 20px;

  :deep(.van-empty__image) {
    width: 120px;
    height: 120px;
  }

  :deep(.van-empty__description) {
    color: #999;
    font-size: 14px;
    margin-top: 16px;
  }
}

/* 邮寄按钮样式 */
.mail-button-container {
  text-align: right;
  margin-top: 10px;
}

.mail-button {
  background-color: #FF8800;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #FFA500;
  }
}
</style>
