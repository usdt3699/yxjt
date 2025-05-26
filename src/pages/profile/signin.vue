<template>
  <div class="page-container h-screen bg-white">
    <nav-bar
        :title="title"
        left-text=""
        left-arrow
        @click-left="onClickLeft"
        :safe-area-inset-top="true"
        class="w-full"
    />
    <div class="overflow-hidden w-full">
      <div class="overflow-y-auto h-full">
        <div class="flex flex-row items-center justify-between">
          <div class="pl-2">
            <p class="title">每日任务</p>
            <p class="text-T898989 text-base pl-2">完成日常任务奖励丰厚</p>
          </div>
          <img src="@/assets/img/signin/calendar.png" alt="" style="height: 129px">
        </div>
        <div class="signin-container pt-2 m-2">
          <div class="ml-2 mb-5 font-bold">连续签到领好礼</div>
          <div class="flex flex-row flex-wrap">
            <div class="w-1/5 flex items-center justify-center"
                 v-for="(item,index) in list"
                 :key="index">
              <div class="rounded text-T898989 text-sm mb-2 p-2 flex flex-col items-center"
                   :class="{'bg-primary':isComplete(index),'bg-white':!isComplete(index)}">
                <span :class="{'text-white':isComplete(index)}">{{ item.title }}</span>
                <img src="@/assets/img/signin/coin.png" alt="" style="height: 37px" class="my-2"/>
                <span class="font-bold"
                      :class="{'text-white':isComplete(index)}">{{ index == item.length - 1 ? '提现开启' : `+${item.reward}` }}</span>
              </div>
            </div>
          </div>
          <button class="rounded bg-primary py-2 mx-2 text-white my-3" @click="onSignIn">立即签到</button>
          <div class="flex flex-row items-center mx-4 my-2">
            <img src="@/assets/img/signin/help.png" alt="" style="height: 15px;">
            <span class="text-base ml-1">签到规则</span>
          </div>
          <div class="text-base text-T898989 mx-4 mb-4">
            截止2024年05月27日07时30分电子银行渠道可销售额度为1,104,880,000,00元，实际剩余额度以购买时系统控制为准。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import TitleBar from "@/components/TitleBar";
import {mapActions, mapState} from "vuex";
import {NavBar, CellGroup, Cell, Icon, Uploader} from "vant";
import axios from "@/net/axios";
import api from "@/net/api";

export default {
  name: "ContactUs",
  components: {TitleBar, NavBar, CellGroup, Cell, Icon, Uploader},
  computed: {
    ...mapState("user", ["userInfo"]),
    ...mapState("systemInfo", ["systemInfo"]),
    title() {
      return this.$route.meta.title; // 获取路由的meta属性的key值
    }
  },
  mounted() {
    this.getUserInfo();
  },
  data() {
    return {
      list: [
        {
          title: '第一天',
          reward: 10000,
          isComplete: true,
        },
        {
          title: '第二天',
          reward: 10000,
          isComplete: true,
        },
        {
          title: '第三天',
          reward: 10000,
          isComplete: false,
        },
        {
          title: '第四天',
          reward: 10000,
          isComplete: false,
        },
        {
          title: '第五天',
          reward: 10000,
          isComplete: false,
        },
        {
          title: '第六天',
          reward: 10000,
          isComplete: false,
        },
        {
          title: '第七天',
          reward: 10000,
          isComplete: false,
        },
        {
          title: '第八天',
          reward: 10000,
          isComplete: false,
        },
        {
          title: '第九天',
          reward: 10000,
          isComplete: false,
        },
        {
          title: '第十天',
          reward: 10000,
          isComplete: false,
        },
      ],
    }
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    onClickLeft() {
      // 点击左侧返回按钮返回上一页
      this.$router.go(-1);
    },
    onSignIn() {
      axios
          .get(api.signIn)
          .then((res) => {
            this.$toast.success('签到成功!');
            this.getUserInfo();
          })
          .catch((err) => {
            err.msg && this.$toast(err.msg);
          });
    },
    isComplete(index) {
      return  this.userInfo.signcount>=index+1
    }
  },
}
</script>

<style scoped lang="less">
.title {
  font-family: MiSans;
  font-size: 32px;
  font-weight: 700;
  line-height: 32px;
  text-align: center;
  color: #F91126;
}

.signin-container {
  background-image: url('../../assets/img/signin/bg.png');
  background-size: 100%;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
}
</style>
