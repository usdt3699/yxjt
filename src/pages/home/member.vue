<template>
  <div class="min-h-screen relative overflow-y-auto">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common2.png" alt="背景" class="w-full" />
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <TitleBar
          :logoSrc="require('@/assets/img/home/yuexiu_logo.png')"
          @back="$router.back()"
        />

        <!-- 内容区域 -->
        <div class="content-container mx-4 rounded-lg">
          <!-- banner图 -->
          <img
            src="@/assets/img/member/member_banner.png"
            alt="会员banner"
            class="w-full h-auto"
          />

          <!-- 会员信息展示区 -->
          <div class="member-info-container">
            <!-- 标题行 -->
            <div class="title-row">
              <img
                src="@/assets/img/member/diamond_icon.svg"
                alt="会员图标"
                class="title-icon"
              />
              <span class="title-text">会员权益</span>
            </div>

            <!-- 权益描述行 -->
            <div class="benefit-item">
              1
              邀请一位好友成为越秀集团正式会员立刻获得188元团队奖励！当天提现，当天到账。
            </div>
            <div class="benefit-item">
              2、成功加入越秀会员即可享受越秀集团特殊待遇，享受每月180000元月工资！
            </div>
            <div class="benefit-item">
              3、加入会员后，越秀集团旗下越秀地产免费赠送车位以及两年物业费。
            </div>
            <div class="benefit-item">
              4、享受每年越秀集团员工内部福利（含年终奖，购房优惠，购车优惠）。
            </div>

            <!-- 按钮区域 -->
            <div class="button-container">
              <!--              <button v-if="buttonStatus === 'member'" class="member-button">-->
              <!--                <img src="@/assets/img/member/member_check.png" alt="已是会员" class="member-icon">-->
              <!--                <span class="member-text">查看申请会员资格证</span>-->
              <!--              </button>-->
              <button
                v-if="buttonStatus === 'member'"
                class="apply-button"
                @click="handleShowCertificate"
              >
                查看会员证
              </button>
              <button
                v-else-if="buttonStatus === 'audit'"
                class="apply-button"
                @click="handleApplyMember"
              >
                立即成为升级会员
              </button>
              <button v-else class="apply-button" @click="handleApplyMember">
                立即成为升级会员
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 支付弹窗 -->
    <payment-dialog
      v-model="showPayment"
      :amount="memberPrice"
      :coupon="null"
      @confirm="handlePayConfirm"
    />

    <!-- 证书预览对话框 -->
    <van-popup
      v-model="showCertificateDialog"
      :show-confirm-button="false"
      close-on-click-overlay
      position="center"
      class="certificate-dialog"
    >
      <div class="certificate-preview">
        <img
          v-if="certificateImg"
          :src="certificateImg"
          class="certificate-img"
          alt="会员资格证"
        />
        <div v-else class="loading-container">
          <van-loading type="spinner" color="#0055C7" />
          <p>资格证生成中...</p>
        </div>
      </div>
      <div class="certificate-actions">
        <van-button type="primary" block @click="saveCertificate">
          <i class="van-icon van-icon-down"></i> 保存图片
        </van-button>
      </div>
    </van-popup>

    <!-- 隐藏的Canvas用于生成图片 -->
    <canvas
      ref="certificateCanvas"
      :width="canvasWidth"
      :height="canvasHeight"
      style="display: none"
    ></canvas>
    <member-certificate-preview
      :userInfo="userInfo"
      :show.sync="showMemberCertificatePreview"
    ></member-certificate-preview>
  </div>
</template>

<script>
import { Button, Dialog, Icon, Loading, Overlay, Toast } from "vant";
import TitleBar from "@/components/common/TitleBar.vue";
import axios from "@/net/axios";
import api from "@/net/api";
import PaymentDialog from "@/components/common/PaymentDialog.vue";
import MemberCertificatePreview from "@/components/bank/MemberCertificatePreview.vue";

export default {
  name: "MemberPage",
  components: {
    TitleBar,
    PaymentDialog,
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    MemberCertificatePreview,
  },
  data() {
    return {
      showPayment: false,
      showCertificateDialog: false,
      showMemberCertificatePreview: false,
      certificateImg: null,
      canvasWidth: 1190,
      canvasHeight: 1682,
      memberPrice: "300", // 会员费用
      inviteCount: 0, // 添加邀请人数统计
      auditDate: "4月15日", // 添加审核日期
      isGeneratingCertificate: false,
      userInfo: {},
    };
  },
  computed: {
    // 添加按钮状态计算属性
    buttonStatus() {
      if (this.userInfo?.is_member === 2) return "member";
      if (this.userInfo?.is_member === 1) return "audit";
      return "invite";
    },
  },
  async mounted() {
    await this.getUserInfoData();
  },
  methods: {
    // 后台生成证书
    startGenerateCertificate() {
      // 如果已经生成过或正在生成中，不重复生成
      if (this.certificateImg || this.isGeneratingCertificate) return;

      this.isGeneratingCertificate = true;

      // 静默生成证书，不显示加载提示
      this.generateCertificate().finally(() => {
        this.isGeneratingCertificate = false;
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

    // 点击查看资格证
    handleShowCertificate() {
      this.showMemberCertificatePreview = true;
      // 打开证书预览对话框
      // this.showCertificateDialog = true;

      // // 如果证书还未生成，先生成证书
      // if (!this.certificateImg && !this.isGeneratingCertificate) {
      //   this.isGeneratingCertificate = true;
      //
      //   this.generateCertificate()
      //     .finally(() => {
      //       this.isGeneratingCertificate = false;
      //     });
      // }
    },

    // 生成会员资格证
    generateCertificate() {
      return new Promise((resolve, reject) => {
        const canvas = this.$refs.certificateCanvas;
        if (!canvas) {
          reject(new Error("找不到Canvas元素"));
          return;
        }

        try {
          const ctx = canvas.getContext("2d");
          // 清除画布
          ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

          // 加载证书模板图片
          const templateImg = new Image();
          templateImg.crossOrigin = "anonymous"; // 解决跨域问题

          // 处理图片加载错误
          templateImg.onerror = () => {
            reject(new Error("证书模板图片加载失败"));
          };

          templateImg.onload = () => {
            try {
              // 启用图像平滑
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = "high";

              // 绘制模板图片 - 放大到2倍大小
              ctx.drawImage(
                templateImg,
                0,
                0,
                this.canvasWidth,
                this.canvasHeight
              );

              // 设置文字样式 - 放大字体
              ctx.fillStyle = "#000000";
              ctx.font = '32px "Microsoft YaHei"'; // 原16px的2倍
              ctx.textAlign = "left";

              // 绘制姓名 - 调整位置坐标为2倍
              const realName = this.userInfo?.real_name || "用户";
              ctx.fillText(realName, 180, 656); // 95*2, 338*2

              // 从日期字符串中提取年月日
              let year = "",
                month = "",
                day = "";
              if (this.userInfo?.created_at) {
                const dateStr = this.userInfo.created_at;
                const dateObj = new Date(dateStr);
                year = dateObj.getFullYear();
                month = dateObj.getMonth() + 1;
                day = dateObj.getDate();
              } else {
                const now = new Date();
                year = now.getFullYear();
                month = now.getMonth() + 1;
                day = now.getDate();
              }

              // 绘制日期 - 放大字体
              ctx.font = '36px "Microsoft YaHei"'; // 原18px的2倍
              ctx.textAlign = "center";
              ctx.fillText(year, 790, 1483); // 410*2, 710*2
              ctx.fillText(month, 890, 1483); // 462*2, 710*2
              ctx.fillText(day, 955, 1483); // 496*2, 710*2

              // 保存生成的图片 - 使用更高质量设置
              this.certificateImg = canvas.toDataURL("image/png", 1.0);
              resolve();
            } catch (error) {
              reject(error);
            }
          };

          // 设置图片源
          templateImg.src = require("@/assets/img/member/certificate_template.png");
        } catch (error) {
          reject(error);
        }
      });
    },

    // 保存证书图片
    saveCertificate() {
      if (!this.certificateImg) {
        Toast("请等待资格证生成完成");
        return;
      }

      // 创建一个链接并设置下载属性
      const link = document.createElement("a");
      link.href = this.certificateImg;
      link.download = "越秀集团会员资格证.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Toast("资格证已保存");
    },

    // 处理申请会员按钮点击
    async handleApplyMember() {
      if (!this.userInfo.is_identify) {
        this.$dialog
          .alert({
            title: "提示",
            message: "请先完成实名认证",
          })
          .then(() => {
            this.$router.push({ name: "realNameAuth" });
          });
        return;
      }
      if (this.buttonStatus === "invite") {
        try {
          // const res = await axios.post(api.member_apply)
          // res.msg && await this.$dialog.alert({
          //   message: res.msg,
          //   confirmButtonText: '确定',
          //   confirmButtonColor: '#0055C7',
          // }).then(async () => {
          //   // 支付成功后立即更新用户信息
          //   await this.getUserInfo();
          //   // 开始生成证书
          //   this.isGeneratingCertificate = true;
          //   try {
          //     await this.generateCertificate();
          //     // 显示证书预览对话框
          //     this.showCertificateDialog = true;
          //   } catch (error) {
          //     console.error('证书生成失败:', error);
          //   } finally {
          //     this.isGeneratingCertificate = false;
          //   }
          // });
          this.showPayment = true;
        } catch (e) {
          // 邀请认证逻辑
          e.msg &&
            (await this.$dialog
              .alert({
                message: e.msg,
                confirmButtonText: "去邀请",
                confirmButtonColor: "#0055C7",
              })
              .then(() => {
                this.$router.push({ name: "userInvite" });
              }));
        }
        return;
      }

      // if (this.buttonStatus === 'audit') {
      //   this.handleShowCertificate();
      //   return;
      // }

      this.showPayment = true;
    },

    // 处理支付确认
    async handlePayConfirm({ pay_type, channel_type }) {
      const params = {
        pay_type,
        channel_type,
        source: 6, // 会员支付类型
        amount: this.memberPrice,
      };

      try {
        const res = await axios.post(api.balancePay, params);
        this.showPayment = false;

        if (pay_type === 9) {
          await this.$dialog
            .alert({
              title: "恭喜",
              message:
                "您已正式成为越秀集团会员，请联系官方专员咨询月工资发放时间！",
              theme: "round-button",
              confirmButtonText: "确定",
              confirmButtonColor: "#F52735",
            })
            .then(async () => {
              // 支付成功后立即更新用户信息
              await this.getUserInfoData();
              this.showMemberCertificatePreview = true;
            });
        } else {
          if (res.data.payUrl) {
            window.location.href = res.data.payUrl;
          }
        }
      } catch (err) {
        this.showPayment = false;
        await this.$dialog.alert({
          title: "提示",
          message: err.msg || "支付失败",
          theme: "round-button",
          confirmButtonText: "确定",
          confirmButtonColor: "#F52735",
        });
      }
    },
  },
};
</script>

<style scoped lang="less">
.content-container {
  background: #fff;
  stroke-width: 1px;
  stroke: rgba(195, 159, 122, 0.13);
  filter: drop-shadow(0px 0px 8px #f2f4f7);
  border: 1px solid rgba(195, 159, 122, 0.13);
  overflow: hidden;
  margin-top: 0;
  position: relative;
  border-radius: 8px;
  margin-left: 16px;
  margin-right: 16px;
  padding: 0;
}

.member-info-container {
  background: linear-gradient(317deg, #f57322 0%, #ffcf69 193.7%),
    linear-gradient(90deg, #171722 0%, #0d0d19 100%);
  box-shadow: 0px 10px 20px 0px rgba(233, 156, 88, 0.22);
  padding: 20px 15px;
  border-radius: 0 0 8px 8px;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.title-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  margin-right: 8px;
}

.title-text {
  color: #fff;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: normal;
}

.benefit-item {
  color: #fff;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 14px;
  margin-bottom: 16px;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}

.apply-button {
  display: flex;
  width: 146.661px;
  height: 34.713px;
  padding: 4.339px;
  justify-content: center;
  align-items: center;
  gap: 4.339px;
  flex-shrink: 0;
  border-radius: 5.207px;
  background: linear-gradient(180deg, #59caff 0%, #0055c7 100%);
  border: none;
  color: #fff;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
}

.member-button {
  display: flex;
  width: 146.661px;
  height: 34.713px;
  padding: 4.339px;
  justify-content: center;
  align-items: center;
  gap: 4.339px;
  flex-shrink: 0;
  border-radius: 5.207px;
  background: linear-gradient(270deg, #413021 -80.69%, #353635 100%);
  border: none;
}

.member-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.member-text {
  color: #f0c6a2;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 14.74px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

// 证书预览对话框样式
:deep(.certificate-dialog) {
  width: 100%;
  border-radius: 9px;
  overflow: hidden;
  .van-dialog__content {
    padding: 0;
  }
}

.certificate-preview {
  position: relative;
  width: 100%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.certificate-img {
  max-width: 100%;
  max-height: 100vh;
  object-fit: contain;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  p {
    margin-top: 15px;
    color: #666;
    font-size: 14px;
  }
}

.certificate-actions {
  padding: 15px;

  .van-button {
    height: 44px;
    background: #0055c7;
    border-color: #0055c7;
    font-size: 16px;
    font-weight: 500;
    border-radius: 22px;

    i {
      margin-right: 5px;
      font-size: 18px;
    }
  }
}
</style>
