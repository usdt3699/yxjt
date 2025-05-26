<template>
  <div class="flex flex-col h-screen">
    <!-- loading遮罩 -->
    <van-overlay :show="pageLoading" class="flex items-center justify-center">
      <van-loading type="spinner" color="#fff" size="36" vertical>加载中...</van-loading>
    </van-overlay>

    <!-- 标题栏 -->
    <div class="h-[44px] flex items-center px-4 relative" style="background: radial-gradient(352.65% 128.18% at 21.33% -5.63%, #FE462D 0%, #FF867D 58.53%, #F52735 100%);">
      <van-icon name="arrow-left" class="text-white" @click="onClickLeft" />
      <span class="text-white text-lg absolute left-1/2 -translate-x-1/2">团队奖励</span>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 overflow-y-auto pb-16" style="background: linear-gradient(180deg, #FFB9B8 40%, #FFF 100%);">
      <van-pull-refresh
          v-model="refreshing"
          @refresh="onRefresh"
          head-height="50"
          loading-text="加载中..."
          pulling-text=""
          loosing-text=""
          success-text=""
          :loading-icon="loadingIcon"
          class="custom-loading"
      >
        <!-- 团队奖励列表 -->
        <div class="p-4">
          <div class="bg-white rounded-[10px] p-4">
            <div class="flex items-center mb-4">
              <div class="flex flex-col items-center">
                <span
                    class="text-[#F23D30]"
                    style="
                    font-family: 'Abhaya Libre Medium';
                    font-size: 16px;
                    font-weight: 500;
                    letter-spacing: -0.5px;
                  "
                >
                  团队奖励
                </span>
                <!-- 下划线装饰 -->
                <div
                    class="w-[20px] h-[3px] mt-1 rounded-[8px]"
                    style="background: #F23D30;"
                ></div>
              </div>
            </div>

            <!-- 奖励列表 -->
            <div class="space-y-3">
              <div v-for="(item, index) in rewardList" :key="index"
                   class="flex items-start bg-[#FFF7F7] rounded-[10px] p-3 relative">
                <img
                    :src="item.icon"
                    class="w-[81px] h-[81px] flex-shrink-0 rounded-[6px]"
                    style="background-position: -1.555px -1.442px; background-size: 150.095% 104.433%; background-repeat: no-repeat;"
                />
                <div class="flex-1 ml-3">
                  <div class="text-[#333333] text-[14px] whitespace-nowrap">
                    邀请激活任意资环中心 | {{ item.people }}人
                  </div>
                  <div class="flex flex-col mt-2">
                    <div class="flex items-baseline">
                      <span class="text-[#FF1D1D] font-[Alata] text-[16px] font-normal tracking-[-0.3px]">
                        {{ item.amount }}
                      </span>
                      <span class="text-[#FF1D1D] ml-1 font-[Alata] text-[14px] font-normal tracking-[-0.3px]">
                        元
                      </span>
                    </div>
                    <div class="text-[#999999] text-[12px] mt-[2px]">每日分红</div>
                  </div>
                </div>
                <button
                    @click="handleButtonClick(item)"
                    class="absolute right-3 bottom-3 w-[76.892px] h-[23.339px] flex items-center justify-center rounded-[4px]"
                    :class="getButtonClass(item.status)"
                >
                  <span
                      class="flex items-center justify-center w-full h-full text-white"
                      style="
                      font-family: 'PingFang SC';
                      font-size: 14px;
                      font-weight: 400;
                      letter-spacing: -0.3px;
                    "
                  >
                    {{ getButtonText(item.status) }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import {Icon, Picker, Popup, PullRefresh, Overlay, Loading} from "vant";
import axios from "@/net/axios";
import api from "@/net/api";
import {mapState} from "vuex";

export default {
  name: "InviteUser",
  components: {
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Icon.name]: Icon,
    [PullRefresh.name]: PullRefresh,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
  },
  data() {
    return {
      showProvincePicker: false,
      showCityPicker: false,
      selectedProvince: '',
      selectedCity: '',
      provinces: [],
      cities: {},
      refreshing: false,
      loadingIcon: 'loading',
      rewardList: [],
      loading: false,
      pageLoading: true,
    };
  },
  computed: {
    ...mapState("user", ["userInfo"]),
  },
  created() {
    this.getActivatedList()
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },

    jumpToPage(name) {
      this.$router.push({name});
    },

    onRefresh() {
      this.refreshData()
    },
    refreshData() {
      this.refreshing = true
      this.loadMore()
    },
    async loadMore() {
      // 重新获取数据
      await this.getActivatedList()
      this.refreshing = false
      this.pageLoading = false
    },

    // 获取激活列表数据
    async getActivatedList() {
      if (this.loading) return
      this.loading = true

      try {
        const res = await axios.get(api.receiveList, {params: {type: 3}})

        if (res.data?.inviteConfigList) {
          this.rewardList = res.data.inviteConfigList.map(item => ({
            icon: require('@/assets/img/invite/team_invite.png'),
            people: item.invite_identity_user,
            amount: item.gift_coin_num,
            envAmount: item.invite_award_num,
            status: item.status
          }))
        } else {
          this.$toast(res.msg || '获取数据失败')
        }
      } catch (e) {
        console.error('获取团队奖励列表失败:', e)
        this.$toast('网络错误,请稍后重试')
      } finally {
        this.loading = false
        this.pageLoading = false
      }
    },

    // 添加按钮状态和点击处理方法
    getButtonText(status) {
      switch (status) {
        case 1:
          return '去邀请'
        case 2:
          return '去领取'
        case 3:
          return '已领取'
        default:
          return '去邀请'
      }
    },

    getButtonClass(status) {
      switch (status) {
        case 1: // 去邀请 - 红色渐变
          return 'bg-gradient-to-r from-[#F23D30] via-[#FF6A57] to-[#F23D30]'
        case 2: // 去领取 - 绿色
          return 'bg-[#4CAF50]'
        case 3: // 已领取 - 灰色
          return 'bg-[#999999]'
        default:
          return 'bg-gradient-to-r from-[#F23D30] via-[#FF6A57] to-[#F23D30]'
      }
    },

    async handleButtonClick(item) {
      switch(item.status) {
        case 1: // 去邀请
        case 3: // 已领取
          this.$router.push({name: 'inviteUser', query: {code: this.userInfo.code}});
          break
        case 2: // 去领取
          try {
            const res = await axios.post(api.receiveAward, { id: item.id })
            if(res.code === 0) {
              this.$toast('领取成功')
              await this.getActivatedList() // 刷新列表
            } else {
              this.$toast(res.msg || '领取失败')
            }
          } catch(e) {
            console.error('领取奖励失败:', e)
            this.$toast(e.msg||'网络错误,请稍后重试')
          }
          break
      }
    }
  }
}
</script>

<style scoped lang="less">
.custom-loading {
  :deep(.van-pull-refresh__head) {
    .van-loading {
      .van-loading__spinner {
        color: #fff !important;
      }

      .van-loading__text {
        color: #fff !important;
      }
    }

    .van-pull-refresh__text {
      color: #fff !important;
    }
  }
}

.page-container {

}

.page-body {
  background-image: url('../../assets/img/invite/bg_invite.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.def-box {

  background-color: #FFF7EC;
  padding: 30px 15px;

  .left {
    width: 40%;
    text-align: center;
  }

  .right {
    display: flex;
    align-items: center;
    border-top: 1px dashed #AB0F13;;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .btn1 {
    display: block;
    background-image: linear-gradient(180deg, #FDE0B4 0%, #FFC771 100%);
    color: #AB0F13;
    border-radius: 4px;
    margin: 2rem auto .1rem;
    font-size: 14px;
    padding: 5px 10px;
  }

  .img {
    width: 60%;
    margin-top: 10px;
  }

  .text {
    color: #000;
    font-size: 16px;
  }
}

.share-address button {
  width: 45%;
  line-height: 35px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  background: rgba(255, 255, 255, .4);
  border-radius: 35px;
  display: block;
  margin: 0 auto;

  .btn1 {
    background-image: linear-gradient(180deg, #FDE0B4 0%, #FFC771 100%);
    width: 150px;
    margin-bottom: .1rem;
    color: #AB0F13;
  }
}


</style>
