<template>
  <div class="page-container h-screen w-screen ">
    <nav-bar
        :title="details.title"
        left-text=""
        left-arrow
        @click-left="onClickLeft"
        :safe-area-inset-top="true"
        class="w-full"
        :border="false"
    />
    <div class="flex-grow overflow-hidden w-full">
      <div class="overflow-y-auto h-full">
        <div class="contentBox">
          <div class="topBox">
            <p class="enTitle">NEWS</p>
            <p class="title">新闻动态</p>
          </div>
          <img style="margin: 10px 0;width: 100%;" :src="details.thumb" alt="">
          <div v-html="details.content" class="content" @click="handleImageClick">
          </div>
        </div>
      </div>
    </div>
    <!-- 添加图片预览组件 -->
    <van-image-preview
      v-model="showImagePreview"
      :images="previewImages"
      :start-position="previewIndex"
      :show-indicators="false"
    />
  </div>
</template>
<script>

import axios from "../../net/axios";
import api from "../../net/api";
import {NavBar, ImagePreview} from "vant";

export default {
  name: "NewsDetails",
  components: {
    NavBar,
    [ImagePreview.Component.name]: ImagePreview.Component
  },
  data() {
    return {
      details: {},
      id: this.$route.params.id,
      showImagePreview: false,
      previewImages: [],
      previewIndex: 0,
    }
  },
  methods: {
    onClickLeft() {
      // 点击左侧返回按钮返回上一页
      this.$router.go(-1);
    },
    getData(id) {
      axios.get(api.newsDetails, {params: {id}})
          .then(res => {
            console.log('新闻详情', res)
            this.details = res.data
            // 提取图片
            this.extractImages()
          })
          .catch(e => {
            console.log(e)
          })
    },
    // 从内容中提取图片URL
    extractImages() {
      const imgRegex = /<img.*?src="(.*?)".*?>/g;
      let images = [];
      let match;

      while ((match = imgRegex.exec(this.details.content)) !== null) {
        images.push(match[1]);
      }
      this.previewImages = images;
    },
    // 处理图片点击
    handleImageClick(e) {
      if (e.target.tagName.toLowerCase() === 'img') {
        const src = e.target.src;
        const index = this.previewImages.findIndex(img => img === src);
        if (index !== -1) {
          this.previewIndex = index;
          this.showImagePreview = true;
        }
      }
    }
  },

  watch: {
    id: {
      immediate: true, //初始化时让handler调用一下
      handler(value) {
        this.getData(value)
      }
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (to.path != from.path) {
      this.id = to.params.id;
    }
    next()  // 一定要有next
  }

}
</script>

<style scoped lang="less">
img {
  max-width: 100%;
}

.enTitle {
  font-size: 30px;
  color: #F91126;
  letter-spacing: -3px;
  text-transform: uppercase;
}

.contentBox {
  width: 90%;
  padding: 10px;
  margin: 20px auto;
  background-color: #fff;
}

.contentBox .title {
  font-size: 30px;
  color: #bc8f4b;
}

.contentBox .content > h1 {
  color: #3f3e55;
  font-size: 30px;
}

.contentBox .content > h2 {
  color: #3f3e55;
  font-size: 18px;
  opacity: 0.9;
  padding-bottom: 25px;
}

.contentBox .content > p {
  font-size: 14px;
  line-height: 24px;
  color: #b1b1b1;
  padding-bottom: 20px;
}

.content {
  line-height: 1.8rem;
  
  :deep(img) {
    max-width: 100% !important;
    height: auto !important;
    display: block !important;
    margin: 10px auto !important;
    cursor: pointer;
    width: auto !important;
    vertical-align: middle !important;
  }

  :deep(section) {
    max-width: 100% !important;
    box-sizing: border-box;
    
    img {
      width: 100% !important;
      height: auto !important;
    }
  }
}
</style>
