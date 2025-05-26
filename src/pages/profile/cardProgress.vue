<template>
  <div class="page-container h-screen bg">
    <nav-bar
      :title="title"
      left-text=""
      left-arrow
      @click-left="onClickLeft"
      :safe-area-inset-top="true"
      class="w-full"
      :border="false"
    />
    <div class="flex-grow overflow-hidden w-full">
      <div class="overflow-y-auto h-full p-4">
        <div class="bg-white rounded-lg p-4 shadow-md">
          <div class="flex items-center mb-4">
            <img
                src="@/assets/img/bg_bank_card.png"
                class="w-40 h-24 rounded-lg"
            />
            <div class="ml-4">
              <div class="text-base">智天银行卡</div>
              <div  class="text-sm text-gray-500 mt-1">限量发行5000张</div>
            </div>
          </div>

          <div class="text-sm text-gray-600 mb-4">领取时间 {{ bankCardInfo.created_at }}
          </div>

          <div class="mb-6">
            <div class="text-base">您的包裹正在运送中...</div>
            <div class="text-gray-500 text-sm mt-1">预计7-10天</div>
          </div>

          <div class="relative">
            <div class="absolute left-[6px] top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div class="space-y-8">
              <TimelineItem
                title="申领卡片"
                :dot-color="'#1989fa'"
              />
              <TimelineItem
                title="正在制作中"
                :dot-color="'#1989fa'"
                :active="true"
              />
<!--              <TimelineItem-->
<!--                title="已制卡，正在发货"-->
<!--                :dot-color="'#1989fa'"-->
<!--              />-->
<!--              <TimelineItem-->
<!--                title="已发货"-->
<!--                :dot-color="'#dcdee0'"-->
<!--              />-->
<!--              <TimelineItem-->
<!--                title="快件运送中"-->
<!--                :dot-color="'#dcdee0'"-->
<!--              />-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { NavBar } from "vant";
import axios from "@/net/axios";
import api from "@/net/api";
import TimelineItem from "@/components/TimelineItem";

export default {
  components: { NavBar, TimelineItem },
  data() {
    return {
      title: this.$route.meta.title,
      data: this.$route.query,
      bankCardInfo: {},
    };
  },

  mounted() {
    this.loadData();
  },

  methods: {
    ...mapActions("user", ["getUserInfo"]),
    onClickLeft() {
      this.$router.go(-1);
    },
   async loadData() {
      try{
        const resBank = await axios.get(api.myBankOrder, {
          params: { type: 1 },
        });
        if (resBank) {
          this.bankCardInfo = resBank.data;
        }
      }
      catch (e) {
        console.log(e)
      }

    },
  },
};
</script>

<style scoped lang="less">
.page-container /deep/ .van-field__label {
  font-weight: bold;
}

.van-nav-bar {
  background-color: transparent;
}

.van-nav-bar /deep/ .van-nav-bar__title {
  color: #333;
}

.van-nav-bar /deep/ .van-icon-arrow-left {
  color: #333;
}

.bg {
  background-image: url("../../assets/img/bg_bank_page.png");
  background-size: 100% auto;
  background-repeat: no-repeat;
}

.timeline-item {
  position: relative;
  padding-left: 24px;

  &__dot {
    position: absolute;
    left: 6px;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    z-index: 1;
  }

  &__content {
    margin-left: 8px;
  }
}
</style>
