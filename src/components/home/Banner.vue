<template>
  <div class="banner-container w-full rounded-[10px] relative" v-if="adList.length">
    <swipe
        :autoplay="3000"
        indicator-color="#01BD5D"
        class="banner-swipe"
    >
      <swipe-item
          v-for="(item,index) in adList"
          :key="index"
          class="banner-item"
      >
        <div class="relative w-full">
          <img
              v-lazy="item.banner_url"
              class="w-full rounded-[10px]"
          />
        </div>
      </swipe-item>
    </swipe>
  </div>
</template>

<script>
import axios from "../../net/axios";
import api from "../../net/api";
import {Swipe, SwipeItem} from "vant";

export default {
  name: "Banner",
  components: {Swipe, SwipeItem},
  props: {},
  data() {
    return {
      adList: [],
    };
  },
  mounted: function () {
    this.getAdList();
  },
  methods: {
    getAdList: function () {
      axios
          .get(api.getBanner)
          .then((res) => {
            this.adList = res.data.bannerList;
          })
          .catch((err) => {
            err.msg && this.$toast(err.msg);
          });
    },
  },
};
</script>
<style scoped lang="less">
.banner-container {
  width: 100%;
  overflow: hidden;
}

.banner-swipe {
  width: 100%;
}

.banner-item {
  width: 100%;
}

:deep(.van-swipe__indicator) {
  width: 8px;
  height: 8px;
  opacity: 0.6;
}

:deep(.van-swipe__indicator--active) {
  opacity: 1;
  background-color: #01BD5D;
}
</style>
