<template>
  <div v-if="showCountdown" class="text-sm text-red-500 ml-1 flex  flex-row items-center" >
    <div class="flex flex-row items-center" v-if="days > 0"><p>{{ days }}</p>天</div>
    <div class="flex flex-row items-center" v-if="days > 0 || hours > 0"><p>{{ hours }}</p>小时</div>
    <div class="flex flex-row items-center" v-if="days > 0 || hours > 0 || minutes > 0"><p>{{ minutes }}</p>分</div>
    <div class="flex flex-row items-center"><p>{{ seconds }}</p>秒</div>
    <div>国家财务局自动发放到银行卡</div>
  </div>
</template>

<script>

export default {
  props: ['pageKey'],
  data() {
    return {
      targetDate: new Date('2024-07-20T00:00:00'),
      remainingTime: 0,
      showCountdown: false,
      timer: null,
    };
  },
  computed: {
    days() {
      return Math.floor(this.remainingTime / (1000 * 60 * 60 * 24));
    },
    hours() {
      return Math.floor((this.remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    },
    minutes() {
      return Math.floor((this.remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    },
    seconds() {
      return Math.floor((this.remainingTime % (1000 * 60)) / 1000);
    },
  },
  mounted() {
    this.startCountdown();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    startCountdown() {
      this.remainingTime = this.targetDate.getTime() - new Date().getTime();
      this.timer = setInterval(() => {
        this.remainingTime -= 1000;
        if (this.remainingTime <= 0) {
          clearInterval(this.timer);
          this.showCountdown = false;
          this.$emit('onFinished', true);
        }
      }, 1000);
      if(this.remainingTime > 0) {
        this.showCountdown = true;
        this.$emit('onFinished', false);
      }
      else {
        this.showCountdown = false;
        this.$emit('onFinished', true);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.countdown{
  justify-content: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 6px;
  div{
    display: flex;
    flexdirection: row;
    align-items: center;
    justify-content: center;
  }
}
.item-container{
  background: rgba(255, 238, 89, 1);
  color: #F91126;
  width: 30px;
  border-radius: 6px;
  display: flex;
  flexdirection: row;
  align-items: center;
  justify-content: center;
  margin:0 5px;
}
</style>
