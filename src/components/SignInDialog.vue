<template>
  <div class="sign-in-wrapper">
    <van-popup
      v-model="show"
      round
      class="sign-in-dialog"
      :style="{ width: '90%' }"
      position="center"
      :overlay-style="{ background: 'rgba(0, 0, 0, 0.7)' }"
      :overlay="false"
    >
    <div class="relative">
    <div class="sign-in-container mt-10 mb-14">

      <!-- 标题 -->
      <div class="sign-in-title">每日签到</div>

      <!-- 副标题 -->
      <div class="sign-in-subtitle">
        每日签到赠送<span class="amount">8000元</span>现金奖励
      </div>

      <!-- 签到内容 -->
      <div class="sign-in-days">
        <!-- 第一行 4个 -->
        <div class="sign-in-row">
          <div
            v-for="day in 4"
            :key="day"
            :class="['sign-in-day', getSignStatus(day) ? 'signed' : '']"
          >
            <div class="day-text">第{{ day }}天</div>
            <div class="day-icon">
              <img :src="require('@/assets/img/sign_in_day.png')" alt="签到" />
            </div>
          </div>
        </div>

        <!-- 第二行 3个 (第7天特殊处理) -->
        <div class="sign-in-row">
          <div
            v-for="day in [5, 6]"
            :key="day"
            :class="['sign-in-day', getSignStatus(day) ? 'signed' : '']"
          >
            <div class="day-text">第{{ day }}天</div>
            <div class="day-icon">
              <img :src="require('@/assets/img/sign_in_day.png')" alt="签到" />
            </div>
          </div>

          <!-- 第7天特殊样式 -->
          <div
            :class="['sign-in-day-seven', getSignStatus(7) ? 'signed' : '']"
          >
            <div class="day-text">第7天</div>
            <div class="day-icon">
              <img :src="require('@/assets/img/sign_in_day_7.png')" alt="签到" />
            </div>
          </div>
        </div>
      </div>

      <!-- 签到按钮 -->
      <div class="sign-in-action">
        <van-button
          :class="['sign-in-button', userInfo.today_isSign === 1 ? 'signed-button' : '']"
          :disabled="userInfo.today_isSign === 1"
          @click="handleSignIn"
        >
          {{ userInfo.today_isSign === 1 ? '已签到' : '立即签到' }}
        </van-button>
      </div>
    </div>
      <!-- 右上角橙色金币图标 -->
      <div class="coin-icon" v-show="show">
        <img :src="require('@/assets/img/sign_in_coin.png')" alt="金币" />
      </div>
      <!-- 底部关闭图标 -->
      <div class="close-icon" v-show="show" @click="show = false">
        <img :src="require('@/assets/img/close_circle.png')" alt="关闭" />
      </div>
    </div>
    </van-popup>


    <!-- 遮罩层 -->
    <div class="custom-overlay" v-show="show" @click="show = false"></div>


  </div>
</template>

<script>
import axios from "@/net/axios";
import api from "@/net/api";
import { Button, Popup, Dialog } from "vant";

export default {
  name: "SignInDialog",
  components: {
    [Button.name]: Button,
    [Popup.name]: Popup,
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      signDaysData: []
    };
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.getSignDays();
      }
    }
  },
  methods: {
    // 获取签到天数
    async getSignDays() {
      try {
        const res = await axios.post(api.sign_days);
        if (res && res.data) {
          this.signDaysData = res.data || [];
        }
      } catch (err) {
        Dialog.alert({
          message: err.msg || "获取签到数据失败"
        });
      }
    },

    // 获取指定天数的签到状态
    getSignStatus(day) {
      if (!this.signDaysData || this.signDaysData.length === 0) {
        return false;
      }

      const dayData = this.signDaysData.find(item => item.days === day);
      return dayData && dayData.is_sign === 1;
    },

    // 处理签到
    handleSignIn() {
      if (this.userInfo.today_isSign === 1) {
        return;
      }

      axios
        .post(api.signIn)
        .then(() => {
          this.$emit("sign-success");
          this.getSignDays();
        })
        .catch((err) => {
          if (err.code === 430) {
            Dialog.alert({
              message: err.msg || "请先完成实名认证",
              confirmButtonText: "去认证",
            }).then(() => {
              this.$router.push({name: "realNameAuth"});
            });
          } else {
            err.msg && this.$toast(err.msg);
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
.van-popup{
  background-color: transparent !important;
}
/* 签到对话框样式 */
.sign-in-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  pointer-events: none;
}

.sign-in-dialog {
  pointer-events: auto;
}

.custom-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1999;
  pointer-events: auto;
}

.sign-in-container {
  padding: 30px 20px;
  border-radius: 10px;
  background: #FFF;
}

.coin-icon {
  position: fixed;
  top: 0;
  right: 11%;
  z-index: 2002;
  pointer-events: none;

  img {
    width: 108px;
    height: 93px;
  }
}

.sign-in-title {
  color: #00B058;
  font-family: "HarmonyOS Sans SC";
  font-size: 24.57px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 10px;
}

.sign-in-subtitle {
  color: #33374D;
  font-family: "Noto Sans Bengali UI";
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 20px;

  .amount {
    color: #F00;
    font-family: "Noto Sans Bengali UI";
    font-size: 15px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
}

.sign-in-days {
  margin-bottom: 20px;
}

.sign-in-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.sign-in-day {
  width: 75px;
  height: 75px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4.855px;
  background: #F5FFFD;
  padding: 10px 0;

  &.signed {
    background: #69BB98;

    .day-text {
      color: #FFF;
    }
  }

  .day-text {
    font-size: 14px;
    margin-bottom: 5px;
    color: #333;
  }

  .day-icon {
    width: 30px;
    height: 30px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}

.sign-in-day-seven {
  width: 130px;
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 4.855px;
  background: #F5FFFD;
  padding: 10px;

  &.signed {
    background: #69BB98;

    .day-text {
      color: #FFF;
    }
  }

  .day-text {
    font-size: 14px;
    color: #333;
    margin-right: 10px;
  }

  .day-icon {
    width: 60px;
    height: 60px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}

.sign-in-action {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.sign-in-button {
  width: 80%;
  height: 44px;
  border-radius: 24.275px;
  background: #00B058;
  color: #FFF;
  text-align: center;
  font-family: "Noto Sans Bengali UI";
  font-size: 14.565px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  border: none;
}

.signed-button {
  background: #797979;
}

.close-icon {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2001;
  cursor: pointer;
  pointer-events: auto;

  img {
    width: 40px;
    height: 40px;
  }
}
</style>
