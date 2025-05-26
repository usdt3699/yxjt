<template>
  <div>
    <div class="textBox">
      <img src="@/assets/img/profile/ic_notice.png" alt="" style="height: 20px;margin-right: 10px;">
      <transition name="slide">
        <p class="text" :key="text.id">
          {{ text?.val?.title }}</p>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'scroll',
  data() {
    return {
      textArr: [
        {tag: '精彩推荐', title: '百姓保障上线啦、为了保障每位用户每天有一'},
        {tag: '热门推荐', title: '份额外收益满足百姓的基础生活需求、开发各'},
        {tag: '热门推荐', title: '种利好政策利国利民、百姓富国家才富'},
      ],
      number: 0
    }
  },
  computed: {
    text() {
      return {
        id: this.number,
        val: this.textArr[this.number]
      }
    }
  },
  mounted() {
    this.startMove()
  },
  methods: {
    startMove() {
      // eslint-disable-next-line
      this.timer = setTimeout(() => {
        if (this.number === this.textArr.length) {
          this.number = 0;
        } else {
          this.number += 1;
        }
        this.startMove();
      }, 2500); // 滚动不需要停顿则将2000改成动画持续时间
    }
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer);
  }
}
</script>

<style scoped>
.textBox {
  width: 100%;
  height: 40px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  box-shadow: 0px 0px 11.6px 0px rgba(193, 193, 193, 0.25);
  display: flex;
  flew-direction: row;
  align-items: center;
  padding: 0 10px;
}

.text {
  width: 100%;
  position: absolute;
  bottom: 10px;
  color: #F91126;
  font-size: 14px;
  margin-left: 40px;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.5s linear;
}

.slide-enter {
  transform: translateY(20px) scale(1);
  opacity: 1;
}

.slide-leave-to {
  transform: translateY(-20px) scale(0.8);
  opacity: 0;
}
</style>
