<template>
  <div class="min-h-screen relative overflow-y-auto">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common2.png" alt="背景" class="w-full">
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <TitleBar :logoSrc="require('@/assets/img/home/yuexiu_logo.png')" @back="$router.back()" />

        <!-- 内容区域 -->
        <div class="content-container py-2">
          <!-- 添加内容显示 - 使用v-html渲染HTML内容 -->
          <div class="house-content mb-4" v-if="houseContent">
            <div class="content-text" v-html="houseContent" @click="handleImageClick"></div>
          </div>
        </div>
      </div>

      <!-- 加载遮罩 -->
      <van-overlay
          :show="pageLoading"
          class="flex items-center justify-center z-2"
      >
        <van-loading
            type="spinner"
            color="#fff"
            size="36"
            vertical
        >
          加载中...
        </van-loading>
      </van-overlay>

      <!-- 图片预览 -->
      <van-image-preview
        v-model="showImagePreview"
        :images="previewImages"
        :start-position="previewIndex"
        :show-indicators="false"
      />
    </div>
  </div>
</template>

<script>
import {Button, Dialog, Icon, ImagePreview, Loading, Overlay} from "vant";
import TitleBar from "@/components/common/TitleBar.vue";
import axios from "@/net/axios";
import api from "@/net/api";

export default {
  name: "HouseDetails",
  components: {
    TitleBar,
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  data() {
    return {
      pageLoading: false,
      houseName: '',
      houseContent: '',
      showImagePreview: false,
      previewImages: [],
      previewIndex: 0,
    };
  },

  mounted() {
    this.getRouteParams();
    this.getDetails();
  },

  methods: {
    getRouteParams() {
      // 获取路由参数
      if (this.$route.query) {
        this.houseName = this.$route.query.name || '';
        this.id = this.$route.query.id || '';
      }
    },

    async getDetails() {
      try {
        const res = await axios.get(api.carDetail,{params: {id:this.id}});
        if (res) {
          this.house = res.data;
          this.houseContent = res.data.content || '';
          // 从内容中解析出图片
          this.extractImages();
        }
      } catch (err) {
        console.log(err);
      }
    },

    // 从内容中提取图片URL
    extractImages() {
      const imgRegex = /<img.*?src="(.*?)".*?>/g;
      let images = [];
      let match;

      while ((match = imgRegex.exec(this.houseContent)) !== null) {
        images.push(match[1]);
      }

      this.previewImages = images;
    },

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
  },
};
</script>

<style scoped lang="less">
.content-container {
  overflow: hidden;
  margin-top: 0;
  position: relative;
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
}

/* 添加图片样式 */
.content-text :deep(img) {
  width: 100% !important; /* 强制宽度100% */
  height: auto !important; /* 高度自适应 */
  cursor: pointer;
  display: block; /* 块级显示消除间距 */
  margin: 0; /* 移除可能的外边距 */
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
