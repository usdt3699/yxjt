<template>
  <div class="min-h-screen bg-[#630505] relative overflow-y-auto  pb-[60px]">
    <nav-bar
        title=""
        left-text=""
        left-arrow
        @click-left="onClickLeft"
        :safe-area-inset-top="true"
        class="w-full fixed-header"
        :border="false"
    />
    <!-- 背景图，需要随页面滚动 -->
    <div class="w-full relative">
      <img src="@/assets/img/invite/bg_hzk.png" alt="邀请背景" class="w-full">

      <!-- 邀请方式区域 -->
      <div class="absolute top-[200px] left-0 right-0 px-4">
            <!-- 补贴列表 -->
            <div class="subsidy-list w-full">
              <!-- 页面标题 -->
              <div class="page-title">助力越秀集团补贴申请</div>
              <!-- 顶部标题图片 -->
              <div class="relative">
                <img src="@/assets/img/invite/ic_btfs.png" alt="补贴放送" class="subsidy-title-image"/>
              </div>
              <div class="subsidy-container rounded-[8.609px] bg-[rgba(255,242,242,0.92)]">
                <!-- 补贴信息 -->
                <div class="subsidy-item mb-3" v-if="subsidyInfo">
                  <div class="p-3 flex">
                    <img
                        :src="subsidyInfo.img || '@/assets/img/icon_invest.png'"
                        class="subsidy-icon"
                    />
                    <div class="flex-1 ml-3">
                      <div class="flex justify-between items-start">
                        <span class="farmer-count">实名人数达到</span>
                        <span class="farmer-count">{{ subsidyInfo.invite_identity_user || 0 }}人</span>
                      </div>
                      <div class="flex justify-between items-end mt-2">
                        <div class="flex flex-col">
                          <div class="subsidy-amount">{{ subsidyInfo.invite_award_num || '0' }}元</div>
                          <div class="subsidy-text">补贴</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 表单内容 -->
                <div class="form-content">
                  <div class="form-item">
                    <div class="form-label">真实姓名</div>
                    <input
                        v-model="formData.real_name"
                        placeholder="请输入真实姓名"
                        class="form-input"
                    />
                  </div>
                  <div class="form-item">
                    <div class="form-label">银行名称</div>
                    <input
                        v-model="formData.bank_name"
                        placeholder="请输入银行名称"
                        class="form-input"
                    />
                  </div>
                  <div class="form-item">
                    <div class="form-label">银行卡号</div>
                    <input
                        v-model="formData.bank_no"
                        placeholder="请输入银行卡号"
                        class="form-input"
                    />
                  </div>

                  <div class="mt-8">
                    <button class="submit-btn w-full" @click="handleSubmit">立即申请</button>
                  </div>
                </div>
              </div>
            </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Button, Dialog, Loading, NavBar, Overlay, Toast} from "vant";
import axios from "@/net/axios";
import api from "@/net/api";
import {mapActions} from "vuex";

export default {
  name: "index",
  components: {
    NavBar,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Toast.name]: Toast,
    [Dialog.name]: Dialog,
    [Button.name]: Button,
  },
  data() {
    return {
      pageLoading: true,
      userInfo: {},
      formData: {
        real_name: '',
        bank_name: '',
        bank_no: ''
      },
      subsidyInfo: null
    };
  },
  mounted() {
    this.getSystemInfo();
    this.getBankDetail();
    this.getUserInfoData();
    // 获取路由参数
    this.subsidyInfo = this.$route.query;
  },
  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),

    onClickLeft() {
      this.$router.go(-1);
    },
    getBankDetail() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      axios.get(api.myBankOrder, {
        params: {type: 1},
      })
          .then((response) => {
            this.$toast.clear();
            if (response.data) {
              this.bankInfo = response.data;
            }
          })
          .catch((error) => {
            this.$toast.clear();
            console.log(error);
          });
    },

    async getUserInfoData() {
      try {
        const resUser = await axios.get(api.userInfo);
        if (resUser) {
          this.userInfo = resUser.data.userInfo;
        }
      } catch (err) {
        console.log(err);
      }
    },

    async handleSubmit() {
      // 表单验证
      if (!this.formData.real_name) {
        this.$toast('请输入真实姓名');
        return;
      }
      if (!this.formData.bank_name) {
        this.$toast('请输入银行名称');
        return;
      }
      if (!this.formData.bank_no) {
        this.$toast('请输入银行卡号');
        return;
      }

      try {
        this.$toast.loading({
          message: '提交中...',
          forbidClick: true
        });

        const formData = new FormData();
        formData.append('id', this.subsidyInfo.id);
        formData.append('real_name', this.formData.real_name);
        formData.append('bank_name', this.formData.bank_name);
        formData.append('bank_no', this.formData.bank_no);

        const res = await axios.post(api.getInviteVipAward, formData);

        this.$toast.clear();

        if (res.code === 200) {
          await Dialog.alert({
            title: '提示',
            message: '提交成功',
          });
          this.$router.go(-1);
        }
      } catch (error) {
        this.$toast.clear();
        Dialog.alert({
          title: '提示',
          message: error.message || '提交失败',
        });
      }
    }
  },
};
</script>

<style scoped>
.page-title {
  color: #FFEA00;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-family: WDCHT;
  font-size: 42px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
  margin-bottom: 40px;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

:deep(.van-nav-bar) {
  background-color: transparent;

  .van-nav-bar__title {
    color: #414141;
    text-align: center;
    font-family: "HarmonyOS Sans";
    font-size: 23px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
  }

  .van-icon {
    color: #414141;
  }
}

.subsidy-title-image {
  position: absolute;
  left: 0;
  top: -30px;
  z-index: 10;
  width: 160px;
  height: auto;
}

.subsidy-container {
  padding: 20px 15px 10px 15px;
  position: relative;
}

.subsidy-item {
  background: #FFF;
  border-radius: 8px;
  margin-bottom: 12px;
}

.subsidy-icon {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.farmer-count {
  color: #252626;
  font-family: "HarmonyOS Sans SC";
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.323px;
}

.subsidy-amount {
  color: #FF1D1D;
  font-family: Alata;
  font-size: 17.217px;
  font-weight: 400;
  letter-spacing: -0.323px;
}

.subsidy-text {
  color: #969799;
  font-family: "HarmonyOS Sans SC";
  font-size: 13px;
  font-weight: 400;
}

.form-content {
  padding: 0 15px;
}

.form-item {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(102, 102, 102, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-label {
  color: #373737;
  font-family: "HarmonyOS Sans SC";
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.9px;
  flex-shrink: 0;
}

.form-input {
  width: 70%;
  text-align: right;
  border: none;
  padding: 0;
  outline: none;
  background: transparent;
  font-family: "HarmonyOS Sans SC";
  font-size: 15px;
  color: #373737;
}

.form-input::placeholder {
  color: #999;
}

.submit-btn {
  border-radius: 4.304px;
  background: linear-gradient(90deg, #F23D30 0%, #FF6A57 48.44%, #F23D30 100%);
  color: #FFF;
  text-align: center;
  font-family: "HarmonyOS Sans SC";
  font-size: 15.065px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.323px;
  padding: 12px;
  width: 100%;
  border: none;
}

/* 自定义弹窗样式 */
:deep(.van-dialog__header) {
  color: #F23D30;
  font-weight: bold;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

:deep(.van-button--danger) {
  background-color: #F23D30;
  border-color: #F23D30;
}
</style>
