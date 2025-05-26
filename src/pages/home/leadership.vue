<template>
  <div class="min-h-screen relative overflow-y-auto">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common.png" alt="背景" class="w-full">
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <TitleBar :logoSrc="require('@/assets/img/home/yuexiu_logo.png')" @back="$router.back()" />

        <!-- 内容区域 -->
        <div class="content-container mx-4 rounded-lg p-2">
          <!-- 标题 -->
          <div class="title-container">
            <span class="group-title">领导班子</span>
          </div>

          <!-- 领导列表 -->
          <div class="leader-list">
            <div v-for="(leader, index) in leadershipList" :key="index" class="leader-item">
              <div class="leader-photo">
                <img :src="require(`@/assets/img/leaders/${leader.photo}`)" alt="领导照片">
              </div>
              <div class="leader-info">
                <div class="leader-name">{{leader.name}}先生</div>
                <div class="leader-description">{{leader.description}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 客服组件 -->
      <CustomerService
          :position="customerServicePos"
          @contact="handleCustomerService"
      />

      <!-- 加载遮罩 -->
      <van-overlay
          :show="pageLoading"
          class="flex items-center justify-center z-2"
      >
        <van-loading
            type="spinner"
            color="#fff"
            size="36"
            vertical
        >
          加载中...
        </van-loading>
      </van-overlay>
    </div>
  </div>
</template>

<script>
import {Button, Dialog, Icon, Loading, Overlay} from "vant";
import CustomerService from "@/components/CustomerService.vue";
import TitleBar from "@/components/common/TitleBar.vue";
import {mapActions} from "vuex";

export default {
  name: "Leadership",
  components: {
    TitleBar,
    CustomerService,
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
  },
  data() {
    return {
      pageLoading: false,
      customerServicePos: {
        right: 15,
        bottom: 80
      },
      leadershipList: [
        {
          name: "张招兴",
          photo: "01.png",
          description: "创兴银行有限公司董事主席 张招兴，男，汉族，浙江上虞人，1953年8月生，现任广州越秀集团股份有限公司，越秀企业（集团）有限公司党委书记、董事长，创兴银行董事会主席"
        },
        {
          name: "林昭远",
          photo: "02.png",
          description: "广州越秀集团股份有限公司党委副书记、总经理 林昭远，男，1969年8月生，中山大学经济学学士学位、工商管理硕士学位，高级经济师。历任越秀房地产开发有限公司副总经理、总经理，越秀地产有限公司副董事长，广州越秀集团股份有限公司董事、党委委员。"
        },
        {
          name: "余达峰",
          photo: "03.png",
          description: "越秀（北京）集团总法律顾问、董事会秘书"
        },
        {
          name: "潘湃淳",
          photo: "04.png",
          description: "越秀集团党委委员、总经书记、监察专员"
        },
        {
          name: "谢威东",
          photo: "05.png",
          description: "越秀集团党委委员、副总经理"
        },
        {
          name: "王智勇",
          photo: "06.png",
          description: "越秀集团党委宣传部部协同委员会副主任委员"
        }
      ]
    };
  },

  mounted() {
    this.getSystemInfo();
  },

  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),
    handleCustomerService() {
      if (this.systemInfo?.customerService) {
        window.location.href = this.systemInfo.customerService;
      }
    },
  },
};
</script>

<style scoped lang="less">
.content-container {
  background: #FFF;
  stroke-width: 1px;
  stroke: rgba(195, 159, 122, 0.13);
  filter: drop-shadow(0px 0px 8px #F2F4F7);
  border: 1px solid rgba(195, 159, 122, 0.13);
  overflow: hidden;
  margin-top: 0;
  position: relative;
  border-radius: 8px;
  margin-left: 16px;
  margin-right: 16px;
}

.title-container {
  width: 92.712px;
  height: 30px;
  flex-shrink: 0;
  background: linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%);
  text-align: center;
  border: 1px solid rgba(195, 159, 122, 0.13);
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.25));
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin: 16px 0;
  position: relative;
  z-index: 1;
}

.group-title {
  color: #FFF;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: rgba(195, 159, 122, 0.13);
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 17px;
  font-weight: 500;
  letter-spacing: -0.3px;
}

.leader-list {
  padding: 0 10px;
}

.leader-item {
  display: flex;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.leader-item:last-child {
  border-bottom: none;
}

.leader-photo {
  flex-shrink: 0;
  margin-right: 12px;

  img {
    width: 86.739px;
    height: 114px;
    flex-shrink: 0;
    object-fit: cover;
    border-radius: 2px;
  }
}

.leader-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.leader-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.leader-description {
  font-size: 14px;
  line-height: 1.5;
  color: #666;
}
</style>
