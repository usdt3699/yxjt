<template>
  <van-popup
    v-model="showPopup"
    round
    closeable
    :style="{ width: '90%' }"
    class="real-name-popup relative top-[300px] py-36 "
  >
    <img src="@/assets/img/profile/gift-box.png" class="absolute top-0 left-[33px]" alt=""/>
    <img src="@/assets/img/action-btn.png" class="absolute top-[253px] left-[60px] z-1" alt=""/>
    <div class="  relative z-1 top-[42px] left-0 ">
      <!-- Gift box image -->

      
      <!-- Title text -->
      <div class="title text-[#FF6C00]">
        实名注册赠送
      </div>
      
      <!-- Bonus amount -->
      <div class="bonus text-[#FF6C00]">
        国债体验券28.8元
      </div>


      <!-- Action button -->
      <button
        class="action-btn mt-12 text-[#AB5700] "
        @click="handleClick"
      >
        马上拿好礼
      </button>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'RealName',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPopup: this.value
    }
  },
  watch: {
    value(newVal) {
      this.showPopup = newVal;
    },
    showPopup(newVal) {
      this.$emit('input', newVal);
    }
  },
  methods: {
    handleClick() {
      this.$emit('click');
      this.showPopup = false;
    }
  }
}
</script>

<style scoped lang="less">
.real-name-popup {
  text-align: center;

  background: transparent;





  .title {
    font-size: 24px;
    font-weight: bold;

  }

  .bonus {
    font-size: 24px;
    font-weight: bold;

  }

  .action-btn {

    background: transparent;
    border: none;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    
    &::before {
      background: #FA4949;
    }
  }
}

// Override Vant popup styles
:deep(.van-popup) {
  border-radius: 16px;
}

:deep(.van-popup__close-icon) {
  color: #999;
  font-size: 20px;
  top: 16px;
  right: 16px;
}
</style>