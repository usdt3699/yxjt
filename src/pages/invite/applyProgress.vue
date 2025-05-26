<template>
  <div class="page-container">
    <!-- 背景图 -->
    <img
        src="@/assets/img/bg_red_card.png"
        class="bg-image"
    />
    <van-nav-bar
        title="卡片申请进度"
        left-arrow
        @click-left="onClickLeft"
        :border="false"
    />
    <div class="content-wrapper">
      <!-- 内容背景容器 -->
      <div class="content-bg" v-for="item in bankList" :key="item.id">
        <!-- 卡片信息区域 -->
        <div class="card-info">
          <div class="card-example-wrapper">
            <bank-card-generator
                v-if="item.card_detail"
                :card-data="item.card_detail"
                :background-img="cardModels[item.id]"
            />
            <img v-else :src="item.example_img" class="card-example"/>
          </div>
          <div class="card-title">
            <div class="title">共筑越秀集团 | {{ item.name }}</div>
            <div class="limit">额度{{ formatAmount(item.invite_award_num) }}万</div>
          </div>
        </div>

        <!-- 申请进度 -->
        <div class="progress-container">
          <div class="progress-item" v-for="(item, index) in progressList" :key="index">
            <div class="progress-status">
              <img v-if="item.status === 1" src="@/assets/img/apply/ic_wait.png" class="status-icon" />
              <img v-else-if="item.status === 0" src="@/assets/img/apply/ic_complete.png" class="status-icon" />
              <img v-else src="@/assets/img/apply/ic_wait.png" class="status-icon" />
            </div>
            <div class="progress-line" v-if="index < progressList.length - 1"></div>
            <div class="progress-info">
              <div class="progress-text" :class="{'active': item.status === 1, 'completed': item.status === 2}">{{ item.text }}</div>
              <div class="progress-time">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Button, Dialog, Loading, Overlay, Swipe, SwipeItem, Toast} from "vant";
import BankCardGenerator from '@/pages/home/bankCardGenerator.vue';
import {mapActions} from "vuex";
import axios from "@/net/axios";
import api from "@/net/api";
import jkModel from '@/assets/img/chinadream/jk-model.png';
import bjkModel from '@/assets/img/chinadream/bjk-model.png';
import hjkModel from '@/assets/img/chinadream/hjk-model.png';

export default {
  name: "index",
  components: {
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Toast.name]: Toast,
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    BankCardGenerator
  },
  data() {
    return {
      pageLoading: true,
      pageTitle: "申请" + this.$route.query.name,
      bankList: [],
      currentId: this.$route.query.id,
      progressList: [
        { text: "正在制卡中", time: "03-10 20:00", status: 1 },
        { text: "已制作完成，正在发货", time: "", status: 0 },
        { text: "正在发货中", time: "", status: 0 }
      ],
      cardModels: {
        1: jkModel,    // 金卡
        2: bjkModel,   // 白金卡
        3: hjkModel    // 黑金卡
      }
    };
  },
  mounted() {
    this.getBankList();
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    onClickLeft() {
      this.$router.go(-1);
    },

    formatAmount(num) {
      return num ? (num / 10000).toFixed(0) : 0;
    },
    async getBankList() {
      try {
        this.pageLoading = true;
        const res = await axios.get(api.myVipCardAward);
        if (res.code === 200 && res.data?.vipCardConfigList) {
          if(this.currentId){
            this.bankList = res.data.vipCardConfigList.filter(item => item.id === this.currentId)
            return
          }
          this.bankList = res.data.vipCardConfigList.filter(item=>item.status === 3)
        }
      } catch (error) {
        Dialog.alert({
          title: "提示",
          message: error.msg || "获取失败",
          confirmButtonText: "确定",
          confirmButtonColor: "#F23D30",
        });
      } finally {
        this.pageLoading = false;
      }
    },
  },

};
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
  background: #F23D30;
  overflow-x: hidden;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  object-fit: cover;
  object-position: top center;
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding-top: 19vh;
}

.content-bg {
  width: calc(100% - 30px);
  aspect-ratio: 515/668;
  background: url('~@/assets/img/card_content_bg.png') no-repeat center;
  background-size: contain;
  position: relative;
  margin: 0 15px 20px;
}

/* 卡片信息区域样式 */
.card-info {
  display: flex;
  margin-bottom: 20px;
  padding-top: 45px;
}

.card-example-wrapper {
  width: 180px;
  height: 85px;
  margin-left: 15px;
}

.card-example-wrapper :deep(.card-image) {
  width: 180px;
  height: 85px;
  object-fit: contain;
  border-radius: 6px;
}

.card-example {
  width: 120px;
  height: 75px;
  object-fit: contain;
  border-radius: 6px;
}

.card-title {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 20px;

}

.card-title .title {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8px;
}

.card-title .limit {
  font-size: 14px;
  color: #fff;
  font-weight: bold;
}

/* 进度条区域样式 */
.progress-container {
  padding: 20px 30px;
  margin-top: 20px;
}

.progress-item {
  display: flex;
  position: relative;
}

.progress-status {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.status-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.progress-line {
  position: absolute;
  left: 10px;
  top: 20px;
  width: 2px;
  height: 40px;
  border-left: 2px dashed #FFFFFF;
  z-index: 1;
}

.progress-info {
  margin-left: 15px;
  padding-bottom: 30px;
}

.progress-text {
  font-size: 14px;
  color: #fff;
  margin-bottom: 5px;
}

.progress-text.active {
  color: #fff;
  font-weight: bold;
}

.progress-text.completed {
  color: #333333;
}

.progress-time {
  font-size: 12px;
  color: #fff;
}

/* 表单区域样式 */
.form-container {
  padding: 0px 20px 20px;
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
}

.form-item .label {
  width: 90px;
  font-size: 14px;
  color: #333;
  text-align: right;
  padding-right: 10px;
}

.input-wrapper {
  flex: 1;
  background-color: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}


/* 提交按钮样式 */
.submit-btn {
  height: 44px;
  background-color: #f23d30;
  color: white;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  margin-top: 25px;
  box-shadow: 0 4px 8px rgba(242, 61, 48, 0.3);
  cursor: pointer;
}


/* 修改滑动组件样式 */
:deep(.van-swipe) {
  width: 300px !important;
  overflow: visible;
}

:deep(.van-swipe__track) {
  width: auto !important;
}


.advantage-content p {
  margin-bottom: 10px;
}


/* 添加导航栏样式 */
:deep(.van-nav-bar) {
  background-color: transparent;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
}

:deep(.van-nav-bar__title) {
  color: #fff;
}

:deep(.van-icon-arrow-left) {
  color: #fff !important;
}

:deep(.van-nav-bar .van-icon) {
  color: #fff;
}


.label {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #333;
  font-size: 14px;
  width: 70px;
}

.input-field {
  width: 100%;
  height: 44px;
  background: transparent;
  border: none;
  padding-left: 90px;
  font-size: 14px;
  color: #333;
  box-sizing: border-box;
}

.input-field::placeholder {
  color: #999;
}

.submit-btn {
  width: 90%;
  height: 44px;
  background: linear-gradient(90deg, #FF6347 0%, #F23D30 100%);
  border-radius: 22px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px auto 0;
}

.submit-btn:active {
  opacity: 0.9;
}
</style>
