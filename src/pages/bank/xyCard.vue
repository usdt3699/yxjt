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
        <div class="content-container mx-4 rounded-lg p-4">
          <!-- 标题 -->
          <div class="apply-title">申领银行卡填写资料</div>
          <img
            :src="certificateImage"
            alt="创兴银行银联卡凭证"
            class="certificate-preview-image"
            v-if="certificateImage"
          />
          <!-- 按钮区域 -->
          <div class="flex justify-center mt-4" v-if="$route.query.status == 1">
            <button class="view-button" @click="show = true">
              确认以上信息无误
            </button>
          </div>
          <template v-else>
            <div class="flex justify-center mt-4">
              <button class="view-button">签署成功</button>
            </div>
            <div class="flex justify-center mt-4">
              <div class="save-button" @click="saveCertificate">保存承诺书</div>
            </div>
          </template>
        </div>
      </div>
      <!-- showPayment = true -->
      <van-popup
        v-model:show="show"
        round
        closeable
        position="bottom"
        :style="{ height: '400px' }"
      >
        <div class="pt-[50px]">
          <van-form @submit="onSubmit">
            <van-cell-group inset>
              <van-field
                v-model="form.real_name"
                name="姓名"
                label="姓名"
                placeholder="姓名"
                :rules="[{ required: true, message: '请填写姓名' }]"
              />
              <van-field
                v-model="form.bank_name"
                name="开户行"
                label="开户行"
                placeholder="开户行"
                :rules="[{ required: true, message: '请填写开户行' }]"
              />
              <van-field
                v-model="form.bank_no"
                name="银行卡号"
                label="银行卡号"
                placeholder="银行卡号"
                :rules="[{ required: true, message: '请填写银行卡号' }]"
              />
            </van-cell-group>
            <div class="text-red-600" style="padding: 10px">
              注：请务必认真填写以上信息，48小时内退还保证金。
            </div>
            <div style="margin: 0 16px">
              <van-button round block type="primary" native-type="submit">
                提交
              </van-button>
            </div>
          </van-form>
        </div>
      </van-popup>

      <!-- 加载遮罩 -->
      <van-overlay
        :show="pageLoading"
        class="flex items-center justify-center z-2"
      >
        <van-loading type="spinner" color="#fff" size="36" vertical>
          加载中...
        </van-loading>
      </van-overlay>
    </div>

    <canvas ref="certificateCanvas" style="display: none"></canvas>

    <payment-dialog
      v-model="showPayment"
      :amount="$route.query.price || 0"
      tip="注：请务必认真填写以上信息，72小时内退还保证金。"
      @confirm="handlePayConfirm"
    />
  </div>
</template>

<script>
import {
  Button,
  Dialog,
  Icon,
  Loading,
  Overlay,
  RadioGroup,
  Radio,
  Area,
  Popup,
  Checkbox,
  Toast,
  Form,
} from "vant";
import TitleBar from "@/components/common/TitleBar.vue";
import CertificatePreview from "@/components/bank/CertificatePreview.vue";
import dayjs from "dayjs";
import PaymentDialog from "@/components/common/PaymentDialog.vue";
import axios from "@/net/axios";
import api from "@/net/api";
import router from "@/router";

export default {
  name: "ApplyHouse",
  components: {
    TitleBar,
    PaymentDialog,
    CertificatePreview,
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Form.name]: Form,
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Area.name]: Area,
    [Popup.name]: Popup,
    [Checkbox.name]: Checkbox,
  },
  data() {
    return {
      pageLoading: false,
      showPayment: false,
      show: false,
      certificateImage: null,
      showPreview: false,
      form: {
        real_name: "",
        bank_name: "",
        bank_no: "",
      },
    };
  },

  async mounted() {
    this.drawCertificate();
  },

  methods: {
    onSubmit() {
      axios.post("/api/user/vipCardApplyRecord", this.form);
      this.show = false;
      this.showPayment = true;
    },
    // 保存证书图片
    saveCertificate() {
      if (!this.certificateImage) {
        Toast("证书图片未生成");
        return;
      }

      // 创建一个临时链接
      const link = document.createElement("a");
      link.href = this.certificateImage;
      link.download = "创兴银行银联卡凭证.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Toast("证书保存成功");
    },

    // 绘制证书
    drawCertificate() {
      console.log("开始绘制证书");
      const canvas = this.$refs.certificateCanvas;
      if (!canvas) {
        console.error("找不到canvas元素");
        return;
      }

      // 设置高分辨率画布
      const dpr = window.devicePixelRatio || 1;
      const width = 660; // 缩放到适合手机屏幕的尺寸
      const height = 1182;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);

      // 加载证书模板图片
      const certificateImg = new Image();
      certificateImg.onload = () => {
        console.log("证书模板图片加载完成");
        // 绘制证书背景
        ctx.drawImage(certificateImg, 0, 0, width, height);

        // 获取卡详情数据

        // 设置字体样式
        ctx.textAlign = "left";

        const cardDetail = this.$route.query;
        // 绘制姓名（尊敬的后面）
        ctx.font = '32px "SimSun"';
        ctx.fillStyle = "#000";
        ctx.fillText(cardDetail.name || "", width - 200, height - 60);

        // 绘制底部日期（使用created_at）
        const day = dayjs(Number(cardDetail.credit_amount) || new Date());
        ctx.fillText(day.format("YYYY"), width - 380, height);
        ctx.fillText(day.format("MM"), width - 266, height);
        ctx.fillText(day.format("DD"), width - 190, height);

        // 保存绘制好的证书图片
        this.certificateImage = canvas.toDataURL("image/png");
        console.log(
          "证书图片生成完成",
          this.certificateImage ? "成功" : "失败"
        );
      };

      certificateImg.onerror = (error) => {
        console.error("图片加载失败:", error);
        Toast.fail("证书模板加载失败");
      };

      try {
        certificateImg.src = require("../../assets/img/Component1.png");
      } catch (error) {
        console.error("加载证书模板图片失败:", error);
        Toast.fail("证书模板加载失败");
      }
    },

    // 处理支付确认
    async handlePayConfirm({ pay_type, channel_type }) {
      const params = {
        pay_type,
        channel_type,
        project_id: this.$route.query.id,
        source: 11, // 银行卡激活的source值为1
        amount: this.$route.query.price,
      };

      try {
        const res = await axios.post(api.balancePay, params);
        this.showPayment = false;
        if (pay_type === 9) {
          await this.$dialog.alert({
            title: "提示",
            message: "支付成功！",
            theme: "round-button",
            confirmButtonText: "确定",
            confirmButtonColor: "#F52735",
          });
          this.$router.go(-1);
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
.van-overlay {
  z-index: 10;
}

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
}

.apply-title {
  color: #373737;
  font-family: "HarmonyOS Sans SC";
  font-size: 18px;
  font-weight: 700;
  padding: 8px 12px;
  text-align: left;
  margin-bottom: 15px;
}

.form-container {
  padding: 0 10px;
}

.form-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(102, 102, 102, 0.26);
  padding: 10px 0;
  margin-bottom: 5px;
}

.label {
  width: 30%;
  color: #373737;
  font-family: "HarmonyOS Sans SC";
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.9px;
  text-align: left;
}

.required {
  color: red;
  margin-left: 2px;
}

.input-field {
  flex: 1;
  text-align: right;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  padding: 5px 0;
}

.gender-group {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.address-container {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.selected-area {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  width: 100%;
}

.placeholder {
  color: #999;
}

.agreement-text {
  color: #734126;
  font-family: "HarmonyOS Sans SC";
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 123.077% */
  letter-spacing: -0.1px;
  margin: 20px 15px;
}

.view-button,
.free-button {
  width: 48%;
  height: 34.713px;
  padding: 4.339px;
  justify-content: center;
  align-items: center;
  border-radius: 5.207px;
  color: #f7f7f8;
  text-align: center;
  font-family: "HarmonyOS Sans SC";
  font-size: 17.356px;
  font-weight: 500;
  line-height: 17.356px;
  display: flex;
  margin-top: 10px;
}

.view-button {
  background: linear-gradient(180deg, #59caff 0%, #0055c7 100%);
}

.free-button {
  background: linear-gradient(147deg, #eb6400 20.81%, #f49f00 92.21%);
}

/* 证书预览弹窗样式 */
.certificate-preview-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
}

.certificate-preview-container {
  position: relative;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.certificate-preview-close {
  position: absolute;
  top: -40px;
  right: 0;
  z-index: 10;
  cursor: pointer;
}

.certificate-preview-content {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.certificate-preview-image {
  width: 100%;
  height: auto;
  display: block;
}

.certificate-preview-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

/* 保存按钮 */
.save-button {
  width: 154px;
  height: 39.484px;
  flex-shrink: 0;
  border-radius: 5px;
  background: linear-gradient(149deg, #28d87d 14.44%, #01bd5d 87.25%);
  color: #fff;
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 39.484px;
  cursor: pointer;
}
</style>
