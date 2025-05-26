<template>
  <div class="login_box">
    <!-- 背景图片 -->
    <img
      src="../assets/img/login/bg_login.png"
      alt="bg"
      class="fixed top-0 left-0 w-full h-auto object-cover"
    />

    <div class="page-container">
      <!-- 顶部标题区域 -->
      <div class="flex items-center justify-between px-[16px] pt-[80px]">
        <img
          src="../assets/img/home/yuexiu_logo.png"
          alt="logo"
          class="w-[189px] h-[47px] relative z-20"
        />
        <div class="text-right">
          <div class="top-title">欢迎使用</div>
          <div class="bottom-title">越秀集团APP</div>
        </div>
      </div>

      <!-- 登录表单部分 -->
      <div class="login-form-container">
        <div class="login-form">
          <!-- 登录/注册切换 -->
          <div class="tab-container">
            <div class="tab-item active">
              登录
              <div class="active-line"></div>
            </div>
            <div class="tab-item " @click="jumpToPage('register')">注册</div>
          </div>

          <!-- 手机号输入框 -->
          <div class="form-input-container">
            <div class="input-icon">
              <img src="../assets/img/login/ic_phone.png" alt="手机号" class="icon-img" />
            </div>
            <input
              class="form-input"
              v-model="mobile"
              maxlength="11"
              placeholder="手机号"
            >
          </div>

          <!-- 密码输入框 -->
          <div class="form-input-container">
            <div class="input-icon">
              <img src="../assets/img/login/ic_lock.png" alt="密码" class="icon-img" />
            </div>
            <input
              class="form-input"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="密码"
            >
          </div>
          <div class="register-link" @click="jumpToPage('register')">
            <span>没有账号？</span><span class="register-text">去注册</span>
          </div>
          <!-- 登录按钮 -->
          <div class="login-btn" @click="onLogin">登录</div>

          <!-- 底部区域 -->
          <div class="bottom-container">
            <div class="customer-service" @click="handleCustomerService">
              <img src="../assets/img/login/ic_service.png" alt="客服" class="service-icon" />
              <div class="service-text">客服</div>
            </div>
            <div class="customer-service" @click="getDownloadUrl">
              <img src="../assets/img/login/app_download.png" alt="客服" class="service-icon" />
              <div class="service-text">App下载</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部备案信息 -->
      <div class="beian-info">
        <p>Copyright © 广州越秀企业集团股份有限公司 </p>
        <p>粤ICP备15022219号
          <img
            src="../assets/img/login/ic_company_logo.png"
            alt="company logo"
            class="company-logo"
          />
          粤公网安备 44010602011620号
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../net/axios";
import api from "../net/api";
import { isNullOrEmpty } from "../utils";
import UserStorage from "@/utils/user_storage";
import { mapActions, mapState } from "vuex";

export default {
  name: "Login",
  computed: {
    ...mapState("systemInfo", ["systemInfo"]),
  },
  data() {
    return {
      mobile: "",
      password: "",
      loading: false,
      showPassword: false,
    };
  },
  mounted() {
    this.loginByToken();
    this.getSystemInfo();
  },
  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),
    loginByToken() {
      try {
        const token = this.$route.query.token;
        console.log('获取的token', token);
        if (token) {
          UserStorage.setToken(token);
          window.token = token;
          this.$router.replace({ name: "home" });
        }
      } catch (e) {
        console.log(e);
      }
    },
    onLogin() {
      if (isNullOrEmpty(this.mobile)) {
        this.$toast("请输入手机号");
        return;
      }
      if (isNullOrEmpty(this.password)) {
        this.$toast("请输入密码");
        return;
      }
      this.$toast.loading({
        message: "登录中...",
        forbidClick: true,
      });

      const formData = new FormData();
      formData.append("account", this.mobile);
      formData.append("password", this.password);
      axios
        .post(api.login, formData)
        .then((res) => {
          this.$toast.clear();
          console.log("登录成功", res);
          UserStorage.setToken(res.data.token);
          window.token = res.data.token;
          this.$router.replace({ name: "home" });
        })
        .catch((e) => {
          console.log("登录失败", e);
          this.$toast.clear();
          e.msg && this.$toast(e.msg);
        });
    },
    handleCustomerService() {
      console.log("点击客服");
      if (this.systemInfo?.customerService) {
        window.location.href = this.systemInfo.customerService;
      }
    },
    jumpToPage(name) {
      this.$router.push({ name });
    },
    getDownloadUrl() {
      const baseUrl = window.location.origin;
      window.open(`${baseUrl}/download.html`, "_blank");
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>
<style scoped lang="less">
.login_box {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;

  .page-container {
    position: relative;
    z-index: 10;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .top-title {
    background: var(--Style, linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: "HarmonyOS Sans SC";
    font-size: 30px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    letter-spacing: 2.254px;
  }

  .bottom-title {
    background: var(--Style, linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: "HarmonyOS Sans SC";
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  .login-form-container {
    position: relative;
    margin: 30px auto;
    width: 90%;
    max-width: 400px;
  }

  .login-form {
    border-radius: 5px;
    background: #FFF;
    box-shadow: 0px 2px 15px 0px #FEB692;
    padding: 30px 20px;
    position: relative;
  }

  .tab-container {
    display: flex;
    margin-bottom: 30px;
    align-items: center;
  }

  .tab-item {
    position: relative;
    margin-right: 20px;
    font-family: "HarmonyOS Sans SC";
    font-size: 15.759px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    color: #999;
    cursor: pointer;
    display: flex;
    align-items: center;

    &.active {
      color: #EB6400;
      font-size: 20px;
      letter-spacing: 2.955px;

      .active-line {
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 3px;
        border-radius: 5px;
        background: var(--Style, linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%));
      }
    }
  }

  .form-input-container {
    display: flex;
    align-items: center;
    border-radius: 23.884px;
    border: 0.492px solid #979797;
    padding: 10px 15px;
    margin-bottom: 20px;
  }

  .input-icon {
    margin-right: 10px;
    display: flex;
    align-items: center;
  }

  .icon-img {
    width: 20px;
    height: 20px;
  }

  .form-input {
    flex: 1;
    border: none;
    outline: none;
    color: #333;
    font-family: "HarmonyOS Sans SC";
    font-size: 16px;

    &::placeholder {
      color: #999;
    }
  }

  .login-btn {
    border-radius: 24.25px;
    background: var(--Style, linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%));
    box-shadow: 0px 7.5px 9px -1px rgba(255, 5, 5, 0.21);
    color: #FFF;
    text-align: center;
    text-shadow: 0px 1px 8px rgba(0, 0, 0, 0.14);
    font-family: "HarmonyOS Sans SC";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 3px;
    padding: 12px 0;
    margin-top: 30px;
    cursor: pointer;
  }

  .bottom-container {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    padding: 0 20px;
    margin-top: 40px;
  }

  .customer-service {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .service-icon {
    width: 30px;
    height: 30px;
  }

  .service-text {
    text-align: center;
    font-family: "HarmonyOS Sans SC";
    font-size: 11.18px;
    font-style: normal;
    font-weight: 700;
    line-height: 24.08px;
    background: var(--Style, linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .register-link {
    color: #999;
    text-align: right;
    font-family: "HarmonyOS Sans SC";
    font-size: 13.789px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .register-text {
      color: #EB6400;
    }
  }

  .beian-info {
    width: 100%;
    padding: 20px 0;
    color: #3F3F3F;
    text-align: center;
    font-family: "Noto Sans Bengali UI";
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    p {
      margin: 5px 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .company-logo {
      width: 18px;
      height: 18px;
      margin: 0 5px;
    }
  }
}
</style>
