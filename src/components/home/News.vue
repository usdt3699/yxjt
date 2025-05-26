<template>
<div class="news-container">
  <!-- 新闻列表 - 水平滑动 -->
  <van-swipe
    ref="swipe"
    :loop="false"
    :show-indicators="false"
    :width="280"
    :height="200"
    :touchable="true"
    class="news-swipe"
    @change="onSwipeChange"
  >
    <van-swipe-item v-for="(item, index) in newsList" :key="index" class="news-swipe-item mr-4" @click="jumpToPage(item.id)">
      <div class="bg-white rounded-[10px] p-3 h-full">
        <!-- 标题 -->
        <div class="news-title text-[15.953px] font-normal text-black mb-2">{{item.title}}</div>

        <!-- 来源 -->
        <div class="news-source text-[12.962px] font-normal text-[#EDB60B] mb-2">{{item.source || '人民日报'}}</div>

        <!-- 内容 -->
        <div class="news-content text-[13.959px] font-normal text-black leading-[21.936px] mb-3 line-clamp-4">
          {{filterContent(item.content)}}
        </div>

        <!-- 点赞和阅读量 -->
        <div class="flex items-center text-[13.959px] font-normal text-[#ACB0B7]">
          <div class="flex items-center mr-4">
            <img src="@/assets/img/home/like.svg" class="w-4 h-4 mr-1" />
            <span>{{item.like_num || 100}}</span>
          </div>
          <div class="flex items-center">
            <img src="@/assets/img/home/view.svg" class="w-4 h-4 mr-1" />
            <span>{{item.view_num || 2010}}</span>
          </div>
        </div>
      </div>
    </van-swipe-item>
  </van-swipe>

  <!-- 自定义指示器 -->
  <div class="custom-indicators flex justify-center">
    <div
      v-for="(_, index) in newsList"
      :key="index"
      :class="['custom-indicator', { active: index === activeIndex }]"
      @click="setActive(index)"
    ></div>
  </div>
</div>
</template>

<script>
import axios from "@/net/axios";
import api from "@/net/api";
import { Swipe, SwipeItem } from "vant";

export default {
  name: "News",
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem
  },
  data() {
    return {
      newsList: [],
      currentType: 5, // 默认显示新闻
      activeIndex: 0 // 当前激活的卡片索引
    };
  },
  mounted() {
    this.getNewsList();
  },
  methods: {
    jumpToPage(id) {
      this.$router.push({
        name: "newsDetails",
        params: {
          id,
        },
      });
    },

    onSwipeChange(index) {
      this.activeIndex = index;
    },

    setActive(index) {
      this.activeIndex = index;
      if (this.$refs.swipe) {
        this.$refs.swipe.swipeTo(index);
      }
    },

    getNewsList() {
      axios
        .get(api.newsList, {
          params: {
            type: this.currentType,
            index_status: 0,
          },
        })
        .then((res) => {
          this.newsList = res.data;
        })
        .catch((err) => {
          err.msg && this.$toast(err.msg);
        });
    },

    filterContent(html) {
      if (!html) return "";
      // 创建临时DOM元素
      const div = document.createElement("div");
      div.innerHTML = html;
      // 移除所有图片标签
      const images = div.getElementsByTagName("img");
      while (images.length > 0) {
        images[0].parentNode.removeChild(images[0]);
      }
      // 返回纯文本内容并删除HTML标签
      const text = div.textContent || div.innerText || "";
      return text.replace(/\s+/g, ' ').trim();
    },
  }
};
</script>

<style scoped lang="less">
.news-container {
  padding-bottom: 20px;
}

.news-swipe {
  height: 200px;

  .news-swipe-item {
    height: 100%;
    width: 280px;
    box-sizing: border-box;
  }
}

// 自定义指示器样式
.custom-indicators {
  margin-top: 15px;
}

.custom-indicator {
  width: 6px;
  height: 6px;
  background-color: #ccc;
  opacity: 0.4;
  border-radius: 3px;
  margin: 0 3px;
  cursor: pointer;
  transition: all 0.3s;

  &.active {
    width: 12px;
    opacity: 1;
    background-color: #01BD5D;
  }
}

.news-title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.news-content {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
</style>
