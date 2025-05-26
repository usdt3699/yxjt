<template>
  <van-popup
    v-model="show"
    class="member-certificate-dialog"
    round
    closeable
    :close-on-click-overlay="false"
    close-icon-position="top-right"
    @click-close="$emit('update:modelValue', false)"
  >
    <div
      ref="certificateRef"
      class="certificate-content relative"
    >
      <img
        src="@/assets/img/certificate_bg.png"
        class="w-full h-full object-contain"
        alt="certificate background"
      />

      <!-- Content overlay -->
      <div class="absolute inset-0 flex flex-col items-center px-8">
        <!-- Main content -->
        <div class="text-white mt-[55%]  px-8 py-6">
          <div class=" leading-loose text-left">
            <div class="text-2xl indent-[2em] text-center mb-4">
              预备会员凭证
            </div>
            <div class="indent-[2em] whitespace-pre-line">
              恭喜<span class="mx-2 font-bold">{{ userName }}</span>成功获得由越秀集团
              颁发的预备会员凭证书，凭此凭证即
              可享受越秀集团的所有福利及活动。
            </div>

            <div class="mt-4 indent-[2em]">
              请每位家人把此凭证保存发送到
              官方群聊进行分享！
            </div>
          </div>

          <!-- Date -->
          <div class="mt-8 text-xl text-right relative">
            <span>日期：{{ currentDate }}</span>
            <img
              src="@/assets/img/gz.png"
              class="absolute right-[10px] top-[-30px] w-[100px] h-[100px] object-contain opacity-80"
              alt="official seal"
            />
          </div>
        </div>
      </div>

      <!-- Save button -->
      <div class="absolute bottom-6 left-6 right-6">
        <div
          class="w-full py-3 bg-[#4361EE] rounded-full text-white text-xl font-medium text-center"
          @click="saveAsImage"
        >
          保存凭证
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import html2canvas from "html2canvas";
import { Popup } from "vant";
import moment from "moment";

export default {
  name: "MemberCertificateDialog",
  components: {
    [Popup.name]: Popup,
  },
  props: {
    value: Boolean,
    userName: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    currentDate() {
      return moment().format("YYYY/MM/DD");
    },
  },
  methods: {
    async saveAsImage() {
      try {
        const element = this.$refs.certificateRef;
        // Hide save button before capturing
        const saveButton = element.querySelector(".bottom-6");
        if (saveButton) {
          saveButton.style.display = "none";
        }

        const canvas = await html2canvas(element, {
          useCORS: true,
          scale: 2,
          backgroundColor: null,
        });

        // Restore save button
        if (saveButton) {
          saveButton.style.display = "";
        }

        const link = document.createElement("a");
        link.download = "预备会员凭证.png";
        link.href = canvas.toDataURL("image/png");
        link.click();

        // Close dialog after saving
        setTimeout(() => {
          this.show = false;
        }, 500);
      } catch (error) {
        console.error("保存图片失败:", error);
      }
    },
  },
};
</script>

<style scoped lang="less">
.member-certificate-dialog {
  width: 100%;
  max-width: 375px;
  background: transparent;

  :deep(.van-popup__close-icon) {
    color: #fff;
    font-size: 24px;
    margin: 16px;
  }
}

.certificate-content {
  width: 100%;
  aspect-ratio: 0.52; // Matches the design image ratio
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
}
</style>
