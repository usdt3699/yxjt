<template>
  <van-popup
    v-model="showPopup"
    round
    :closeable="false"
    :style="{ width: '90%' }"
    class="coupon-popup"
    @click="handleClick"
  >
    <img
      :src="imageUrl"
      class="coupon-img"
      alt="优惠券"
    />
  </van-popup>
</template>

<script>
export default {
  name: "Coupon",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
      required: true,
      // 图片地址
      default: ''
    }
  },
  data() {
    return {
      showPopup: this.value,
    };
  },
  watch: {
    value(newVal) {
      this.showPopup = newVal;
    },
    showPopup(newVal) {
      this.$emit("input", newVal);
    },
  },
  methods: {
    handleClick() {
      this.$emit("click");
      this.showPopup = false;
    },
  },
};
</script>

<style scoped lang="less">
.coupon-popup {
  text-align: center;
  background: transparent;

  .coupon-img {
    width: 100%;
    height: auto;
  }
}

:deep(.van-popup) {
  background: transparent;
}

:deep(.van-popup__close-icon) {
  color: #fff;
  font-size: 24px;
  top: 0;
  right: 0;
}
</style>
