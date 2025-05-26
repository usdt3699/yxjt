<template>
  <div class="h-full w-full page-content-bg bg-contain">
    <nav-bar
        :title="title"
        left-text=""
        :left-arrow="false"
        :border="false"
        :safe-area-inset-top="true"
    />
    <div class="overflow-hidden w-full">
      <div class="p-4 page-content h-full" style="padding-top: 160px;">
        <div class="remain-box">
          您今天还有 {{this.remain }} 次抽奖机会
        </div>
        <div class="body-content">
          <LuckyGrid
              ref="myLucky"
              width="330px"
              height="330px"
              :prizes="prizes"
              :blocks="blocks"
              :buttons="buttons"
              @start="startCallback"
              @end="endCallback"
              :defaultStyle="defaultStyle"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>


import {NavBar,} from "vant";
import {mapActions, mapState} from "vuex";
import api from "@/net/api";
import axios from "@/net/axios";

export default {
  name: "index",
  components: {NavBar},
  data() {
    return {
      remain: 0,
      blocks: [{}],
      prizes: [
        {
          x: 0, y: 0, imgs: [{
            src: require('@/assets/img/award/1.png'),
            width: '100%',
            height: '100%',
            bottom: '10%'
          }],
          title: '恭喜您获得一辆全新小米SU7轿车',
          type: 4,
        },
        {
          x: 0, y: 1, imgs: [{
            src: require('@/assets/img/award/4.png'),
            width: '100%',
            height: '100%',
            bottom: '10%'
          }],
          title: '恭喜您获得全新华为MATE60PRO手机一台',
          type: 7,
        },
        {
          x: 0, y: 2, imgs: [{
            src: require('@/assets/img/award/7.png'),
            width: '100%',
            height: '100%',
            bottom: '10%'
          }],
          title: '谢谢参与抽奖，邀请好友一起赢奖',
          type: 1,
        },
        {
          x: 1, y: 0, imgs: [{
            src: require('@/assets/img/award/2.png'),
            width: '100%',
            height: '100%',
            bottom: '10%'
          }],
          title: '恭喜您获得黄金100克',
          type: 5,
        },
        {
          x: 1, y: 2, imgs: [{
            src: require('@/assets/img/award/8.png'),
            width: '100%',
            height: '100%',
            bottom: '10%'
          }],
          title: '恭喜您获得飞天茅台一瓶',
          type: 2,
        },
        {
          x: 2, y: 0, imgs: [{
            src: require('@/assets/img/award/3.png'),
            width: '100%',
            height: '100%',
            bottom: '10%'
          }],
          title: '再接再厉，邀请更多好友一起赢奖',
          type: 2,
        },
        {
          x: 2, y: 1, imgs: [{
            src: require('@/assets/img/award/6.png'),
            width: '100%',
            height: '100%',
            bottom: '10%'
          }],
          title: '恭喜您获养老金50000元',
          type: 6,
        },
        {
          x: 2, y: 2, imgs: [{
            src: require('@/assets/img/award/9.png'),
            width: '100%',
            height: '100%',
            bottom: '10%'
          }],
          title: '恭喜您获得比亚迪汉一辆',
          type: 3,
        },

      ],
      defaultStyle: {
        borderRadius: '6px',
      },
      buttons: [{
        x: 1, y: 1,
        background: 'rgba(0,0,0,0)',
        fonts: [{text: '', top: '70%', fontSize: '10px', color: '#333'}],
        imgs: [{
          src: require('@/assets/img/award/5.png'),
          width: '100%',
          height: '100%',
          bottom: '10%'
        }],
      }],
      isSpinning: false,
      loading: false,
      finished: false,
      refreshing: false,
      isRunning: false,
    };
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    title() {
      return this.$route.meta.title; // 获取路由的meta属性的key值
    }
  },
  filters: {
    formatLabel(item, userInfo) {
      if (item.id === 1) {
        return '已领取'
      }
      if (userInfo?.tjnum >= item.recommendNum) {
        return '已领取'
      }
      return '立即邀请'
    }
  },
  mounted() {
    this.getUserInfo();
    this.getDrawNum();
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    // 点击抽奖按钮会触发star回调
    startCallback() {
      if (this.remain <= 0) {
        this.$dialog.alert({
          title: '提示',
          message: '抽奖机会已用完,邀请好友赢取更多奖励哦',
          theme: 'round-button',
        }).catch(err => {});
        return;
      }
      if (this.isRunning == true) {
        return;
      }
      this.isRunning = true;
      // 调用抽奖组件的play方法开始游戏
      this.$refs.myLucky.play()
      axios
          .get(api.luckNum)
          .then((res) => {
            const index = this.prizes.findIndex(item => item.type === res.data.type)
            this.$refs.myLucky.stop(index)
          })
          .catch((err) => {
            this.isRunning = false;
          });
    },
    // 抽奖结束会触发end回调
    endCallback(prize) {
      this.$dialog.alert({
        title: '中奖提示',
        message: prize.title,
        theme: 'round-button',
      }).then(() => {
        this.remain--;
        this.isRunning = false;
        this.getDrawNum();
      });
    },
    jumpToPage(item) {
      if (item.id === 1) {
        this.$toast('该奖项已被领取');
        return;
      }
      if (this.userInfo?.tjnum >= item.recommendNum) {
        this.$toast('该奖项已被领取');
        return;
      }
      this.$router.push({name: 'inviteUser'})

    },
    getDrawNum() {
      axios
          .get(api.drawNum)
          .then((res) => {
            console.log('剩余抽奖次数', res)
            this.remain = res.data;
            // this.buttons = [{
            //   x: 1, y: 1,
            //   background: 'rgba(0,0,0,0)',
            //   fonts: [{
            //     text: this.remain > 0 ? `还有${this.remain}次抽奖机会` : '抽奖机会已用完',
            //     top: '70%',
            //     fontSize: '10px',
            //     color: '#333'
            //   }],
            //   imgs: [{
            //     src: require('@/assets/img/award/djcj.png'),
            //     width: '100%',
            //     height: '100%',
            //     bottom: '10%'
            //   }],
            // }];
          })
          .catch((err) => {
            err.msg && this.$toast(err.msg);
          });
    },
  },
};
</script>

<style scoped lang="less">
.van-nav-bar{
  background-color: #B41212;
}
.van-nav-bar /deep/ .van-nav-bar__title{
  color: #fff;
}
.page-content-bg{
  background-color: #CE2D2B;
  background-image: url('../../assets/img/award/bg.png');
  background-repeat: no-repeat;
}
.remain-box{
  background-image: url('../../assets/img/award/top-award.png');
  background-size: 100% 60px;
  background-repeat: no-repeat;
  width: 100%;
  height: 60px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 16px;
  padding-bottom: 2px;
}
.body-content {
  background-image: url('../../assets/img/award/bg-arward.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 100%;
  flex-direction: column;
  padding:30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spin-animation {
  position: relative;
}

.light-source {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: yellow;
  opacity: 0.5;
  z-index: 1;
  transition: transform 2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes spin {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(200%);
  }
}

.page-content /deep/ .van-loading__text {
  color: #fff;
}

.page-content /deep/ .van-pull-refresh__head {
  color: #fff;
}

.page-content /deep/ .van-empty__description {
  color: #fff;
}

</style>
