<template>
  <div class="title-bar w-full justify-between" :style="{ backgroundColor: bgColor }">
    <div
        @click="goBack()"
        v-if="leftIconVisible"
        class="left"
    >
      <van-icon
          name="arrow-left"
          :color="leftIconColor"
          size="24px"
      />
    </div>
    <div
        class="title"
        :style="{ color: titleColor }"
    >{{ title }}
    </div>
    <div
        v-if="leftIconVisible"
        class="left"
    >
      <van-icon
          name="arrow-left"
          color="transparent"
          size="24px"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bgColor: {
      type: String,
      default: "transparent",
    },
    leftIconColor: {
      type: String,
      default: "#333",
    },
    leftIconVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    titleColor: {
      type: String,
      default: "#333",
    },
  },
  data() {
    return {};
  },

  methods: {
    goBack() {
      this.$router.go(-1); // 使用Vue Router提供的go方法返回上一页
    }
  },
};
</script>

<style lang="less" scoped>
.title-bar {
  display: flex;
  align-items: center;
  height: 45px;
  line-height: 45px;
  border: none;
  position: relative;

  .left {
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .title {
    height: 45px;
    font-size: 18px;
    line-height: 45px;
    font-weight: 550;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
