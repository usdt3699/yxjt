<template>
  <div class="min-h-screen relative overflow-y-auto">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common2.png" alt="背景" class="w-full">
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <TitleBar :logoSrc="require('@/assets/img/home/yuexiu_logo.png')" @back="$router.back()"/>
        <!-- 描述区域 -->
        <div class="flex items-center justify-center mb-4">
          <img src="@/assets/img/stock/security_icon.png" alt="安全图标" class="mr-2 h-[18px]">
          <span class="description-text">银行存管已接入，资金更安全</span>
        </div>
        <!-- 内容区域 -->
        <div class="content-container p-2">
          <!-- 标题和市值 -->
          <div class="flex justify-between items-center">
            <div class="title-tag">{{ item.name }}详情</div>
            <div class="market-value ml-auto">项目周期<span class="number">{{ item.total_day }}</span>天</div>
          </div>

          <!-- 内容区 - 添加明确的class -->
          <div class="content-container inner-content p-4 relative">
            <!-- 限时抢购标记 -->
            <div v-if="item.id == 7" class="limited-time-tag">限时3天抢购</div>
            
            <div class="flex">
              <!-- 左侧图片区 -->
              <div class="left-images flex flex-col items-center mr-4">
                <img :src="item.img" class="w-[130px] h-[80px] object-cover mb-2 rounded-[5px]">
                <img v-if="hasBrandLogo(item)" :src="getBrandLogo(item)" class="h-[38px] w-auto">
              </div>

              <!-- 右侧信息区 -->
              <div class="flex-1">
                <div class="title-text mb-1">{{ item.name }}</div>
                <div class="subtitle-text mb-3">全球优选的持续稳健收益路</div>

                <div class="flex flex-row justify-between">
                  <div class="info-row mb-2">
                    <div class="info-label">收益率</div>
                    <div class="info-value">{{ item.day_rate || '0' }}%</div>
                  </div>
                  <div class="info-row ml-10">
<!--                    <div class="info-label">赠送原始股权</div>-->
<!--                    <div class="info-value">{{ item.gift_coin_num || '0' }}</div>-->
                  </div>
                </div>

                <div class="flex flex-row justify-between">
                  <div class="info-row mb-2">
                    <div class="info-label">日收益</div>
                    <div class="info-value">{{ Math.floor(item.day_income || 0) }}<span class="text-sm">元</span></div>
                  </div>
                  <div class="info-row ml-10">
                    <div class="info-label">现金额度</div>
                    <div class="info-value" v-if="item.id == 7">
                      <span class="original-price">30万元</span>
                      <span>60万元</span>
                    </div>
                    <div class="info-value" v-else>
                      {{ Math.floor(item.gift_coin_num_sec|| 0) }}<span class="text-sm">元</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 新增项目基本信息 -->
          <div class="project-info">
<!--            <div class="project-info-title mb-3">-->
<!--              {{item.content}}-->
<!--            </div>-->

            <div class="project-details" v-if="item.content">
                <div class="content-text" v-html="item.content" @click="handleImageClick"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {Button, Dialog, Icon, Loading, Overlay} from "vant";
import TitleBar from "@/components/common/TitleBar.vue";
import {mapActions} from "vuex";
import api from "@/net/api";
import axios from "@/net/axios";

export default {
  name: "GroupIntroduce",
  components: {
    TitleBar,
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
  },
  data() {
    return {
      pageLoading: false,
      customerServicePos: {
        right: 15,
        bottom: 80
      },
      item: {},
      id: null,
      showImagePreview: false,
      previewImages: [],
      previewIndex: 0,
    };
  },

  mounted() {
    this.getSystemInfo();
    if (this.$route.query) {
      this.id = this.$route.query.id;
    }
    this.getDetails();
  },

  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),
    // 处理图片点击事件
    handleImageClick(e) {
      if (e.target.tagName.toLowerCase() === 'img') {
        const src = e.target.src;
        const index = this.previewImages.findIndex(img => img === src);

        if (index !== -1) {
          this.previewIndex = index;
          this.showImagePreview = true;
        } else {
          // 如果在列表中找不到，则单独预览
          this.previewImages = [src];
          this.previewIndex = 0;
          this.showImagePreview = true;
        }
      }
    },
    handleCustomerService() {
      if (this.systemInfo?.customerService) {
        window.location.href = this.systemInfo.customerService;
      }
    },
    getBrandLogo(item) {
      const type = item.id || '1';
      try {
        return require(`@/assets/img/project/brand_logo_${type}.png`);
      } catch (e) {
        return null;
      }
    },
    hasBrandLogo(item) {
      const type = item.id || '1';
      try {
        require(`@/assets/img/project/brand_logo_${type}.png`);
        return true;
      } catch (e) {
        return false;
      }
    },
    async getDetails() {
      try {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
        });
        const res = await axios.get(api.idoDetail, {params: {id: this.id}})
        if (res.data) {
          this.item = res.data;
        }
      } catch (err) {
        console.log(err)
        err.msg && this.$toast(err.msg);
      } finally {
        this.$toast.clear();
      }
    }
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

/* 主容器样式 */
.content-container {
  background: #FFF;
  overflow: hidden;
  margin-top: 24px;
  position: relative;
  border-radius: 5px;
}

/* 标题标签样式 */
.title-tag {
  position: absolute;
  top: -3px;
  left: 10px;
  padding: 4px 10px;
  border-radius: 0px 0px 3px 3px;
  background: linear-gradient(180deg, #FF002D 0%, #FF7D28 100%);
  color: #FFF;
  font-family: "HarmonyOS Sans SC";
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
  z-index: 2;
}

/* 内容区容器样式 - 修改这里 */
.content-container .content-container {
  border-radius: 5px;
  background: linear-gradient(180deg, #FFEDD2 2%, #FFF 51%);
}

/* 市值文本样式 */
.market-value {
  border-radius: 2.97px;
  background: #FFCF87;
  padding: 2px 8px;
  color: #705C2D;
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

/* 标题和副标题样式 */
.title-text {
  color: #33374D;
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
  color: #FFA400;
  font-family: "HarmonyOS Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

/* 项目信息区域 */
.project-info {
  padding: 0 16px 16px;
}

.project-info-title {
  color: #5E5E5E;
  font-family: "HarmonyOS Sans SC";
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: 17px; /* 130.769% */
  letter-spacing: 0.9px;
}

.project-details {
  color: #5E5E5E;
  font-family: "HarmonyOS Sans SC";
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 17px;
}

.project-details h3 {
  font-weight: 500;
}

.project-details-list {
  list-style-type: disc;
  padding-left: 16px;
}

.project-details-list li {
  margin-bottom: 4px;
}

/* 添加特定的内容区样式 */
.inner-content {
  border-radius: 5px;
  background: linear-gradient(180deg, #FFEDD2 2%, #FFF 51%) !important;
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

/* 原价划线样式 */
.original-price {
  text-decoration: line-through;
  font-size: 12px;
  color: #999;
  margin-right: 5px;
  position: relative;
}

/* 限时抢购标签样式 */
.limited-time-tag {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px 8px;
  background: linear-gradient(to right, #FF5722, #FF9800);
  color: white;
  font-family: "HarmonyOS Sans SC";
  font-size: 12px;
  font-weight: 500;
  border-radius: 0 5px 0 8px;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}
</style>
