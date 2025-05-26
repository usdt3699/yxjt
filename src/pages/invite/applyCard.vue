<template>
  <div class="page-container">
    <!-- 背景图 -->
    <img
        src="@/assets/img/bg_red_card.png"
        class="bg-image"
    />
    <van-nav-bar
        :title="pageTitle"
        left-arrow
        @click-left="onClickLeft"
        :border="false"
    />
    <div class="content-wrapper">
      <!-- 内容背景容器 -->
      <div class="content-bg">
        <!-- 卡片信息区域 -->
        <div class="card-info">
          <img :src="currentCard.example_img" class="card-example"/>
          <div class="card-title">
            <div class="title">共筑越秀集团 | {{ currentCard.name }}</div>
            <div class="limit">额度{{ formatAmount(currentCard.invite_award_num) }}万</div>
          </div>
        </div>

        <!-- 表单区域 -->
        <div class="form-container">
          <div class="form-item">
            <span class="label">姓名：</span>
            <div class="input-wrapper">
              <input
                  type="text"
                  v-model="form.name"
                  placeholder="输入姓名"
                  class="input-field"
              >
            </div>
          </div>

          <div class="form-item">
            <span class="label">身份证：</span>
            <div class="input-wrapper">
              <input
                  type="text"
                  v-model="form.id_card_no"
                  placeholder="输入身份证号码"
                  class="input-field"
                  maxlength="18"
              >
            </div>
          </div>

          <div class="form-item">
            <span class="label">电话：</span>
            <div class="input-wrapper">
              <input
                  type="tel"
                  v-model="form.mobile"
                  placeholder="输入电话号码"
                  class="input-field"
                  maxlength="11"
              >
            </div>
          </div>

          <div class="form-item">
            <span class="label">邮寄地址：</span>
            <div class="input-wrapper">
              <input
                  type="text"
                  v-model="form.address"
                  placeholder="输入收件地址"
                  class="input-field"
              >
            </div>
          </div>

          <div class="submit-btn" @click="handleSubmit">
            立即申请
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Button, Dialog, Loading, Overlay, Toast, Swipe, SwipeItem} from "vant";
import axios from "@/net/axios";
import api from "@/net/api";
import {mapActions} from "vuex";

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
  },
  data() {
    return {
      pageLoading: true,
      pageTitle: "申请" + this.$route.query.name,
      form: {
        name: "",
        id_card_no: "",
        mobile: "",
        address: "",
      },
      currentCard: this.$route.query,
    };
  },
  mounted() {
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    onClickLeft() {
      this.$router.go(-1);
    },

    async handleSubmit() {
      try {
        if (!this.form.name) {
          Toast('请输入姓名');
          return;
        }
        if (!this.form.id_card_no) {
          Toast('请输入身份证号码');
          return;
        }
        if (!this.form.mobile) {
          Toast('请输入手机号码');
          return;
        }
        if (!/^1[3-9]\d{9}$/.test(this.form.mobile)) {
          Toast('请输入正确的手机号码');
          return;
        }
        if (!this.form.address) {
          Toast('请输入邮寄地址');
          return;
        }

        const formData = new FormData();
        formData.append('id', this.currentCard.id);
        formData.append('name', this.form.name);
        formData.append('id_card_no', this.form.id_card_no);
        formData.append('mobile', this.form.mobile);
        formData.append('address', this.form.address);

        const res = await axios.post(api.getVipCardAward, formData);
        if (res.code === 200) {
          Toast.success('申请成功');
          setTimeout(() => {
            this.$router.go(-1);
          }, 1500);
        }
      } catch (error) {
        Dialog.alert({
          message: error.msg || '申请失败',
        });
      }
    },

    formatAmount(num) {
      return num ? (num / 10000).toFixed(0) : 0;
    }
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
  margin: 0 15px;
}

/* 卡片信息区域样式 */
.card-info {
  display: flex;
  margin-bottom: 20px;
  padding-top: 45px;
}

.card-example {
  width: 120px;
  height: 75px;
  object-fit: contain;
  margin-right: 15px;
  margin-left: 15px;
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
  text-align: left;
  padding-right: 10px;
  padding-left: 10px;
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
