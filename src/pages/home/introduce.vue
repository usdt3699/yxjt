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
            <span class="group-title">集团介绍</span>
          </div>

          <!-- 介绍图 -->
          <div class="intro-image-container">
            <img src="@/assets/img/home/group_intro_banner.png" alt="集团介绍" class="w-full">
          </div>

          <!-- 文字内容 -->
          <div class="intro-content p-4">
            {{ groupIntroContent }}
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
  name: "GroupIntroduce",
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
      groupIntroContent: '越秀集团于1985年在香港成立，是广州市资产规模最大的国有企业之一。越秀集团以金融、房地产、交通基建、食品为四大主业，构建了横跨一二三产业的“4+X”现代产业体系，是国务院国企改革“双百企业”，旗下拥有越秀资本、越秀地产、越秀交通基建、越秀房产基金、越秀服务、华夏越秀高速REIT等6家上市平台。2024年位列“中国企业500强”第208位和“中国100大跨国公司”第11位。2023年，越秀集团统计口径资产总额突破万亿，达到10681亿元人民币，实现营业收入1314亿元人民币，利润总额147亿元人民币。\n' +
          '越秀地产于1983年成立，是全国第一批综合性房地产开发企业。2009年，越秀地产开始全国化布局，目前战略布局30个核心城市，土地储备超过5000万㎡，2022年合同销售额1250亿元，行业排名跃升至第16位，权益销售金额进入行业前10。积极布局TOD、养老、长租、城市更新等新兴业务，其中TOD领域引入广州地铁作为战略股东，已落地8个项目，并于2022年获取杭州地铁勾庄项目，TOD模式走出广州迈向全国；开启“小投入、大体量”三旧改造模式，获取里仁洞村及东流村旧村改造资格，并获取广州首个旧城混合改造项目南洋电器厂；越秀康养形成“7城19项目7400床位”的规模态势，进入行业第一梯队。坚持“商住并举”战略，拥有广州国际金融中心在内的40多个优质商业物业，涵盖写字楼、零售商场、专业市场、酒店公寓等多种业态，越秀房产基金是全球首只投资于中国内地物业的上市房地产投资信托基金，规模跻身亚洲一线房托基金行列。\n' +
          '越秀资本是国内首家地方上市金控平台，目前控股广州资产、越秀租赁、越秀产业基金、广州期货、越秀金控资本、广州担保、越秀金科等多个金融业务平台，是中信证券第二大股东。 创兴银行创立于1948年，在香港设有超过30家分行，在“打造跨境特色的综合性商业银行”战略引领下积极拓展内地业务，先后在广州、深圳、上海、北京、汕头开设分行，形成了“5分行+9支行”的内地布局，实现北上广深一线城市全覆盖，正在积极推进内地法人银行筹建工作。\n' +
          '越秀交通于1997年在香港联交所上市，为首支在香港上市的国内基建股。交通板块旗下共19个高速公路（桥梁、码头）项目，总收费里程约1064公里。打造上市公司、公募REITs、项目孵化3大平台，华夏越秀高速REIT成功上市，积极向交通基建资产管理公司转型。\n' +
          '广州越秀食品集团有限公司始建于1949年，前身为广州市农场管理局、广州市国营农工商联合总公司、广州市农工商集团有限公司。2018年，原广州风行集团划入越秀集团并通过布局生猪养殖业务、重组辉山乳业、整合广州食品产业等，成为集团食品板块。目前已形成乳业、农牧食品、食品流通业务的产业布局，拥有辉山乳业、风行乳业、皇上皇、趣香、五羊、孔旺记等一批知名品牌。\n'
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
  margin: 16px 0 8px;
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

.intro-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}
</style>
