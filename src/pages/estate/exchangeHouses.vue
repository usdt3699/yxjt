<template>
  <div class="min-h-screen relative overflow-y-auto">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common2.png" alt="背景" class="w-full">
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <TitleBar :logoSrc="require('@/assets/img/home/yuexiu_logo.png')" @back="$router.back()"/>

        <!-- 主要内容区域 -->
        <div class="pt-[15px] pb-[55px] relative z-10">
          <!-- 越秀地产区域 -->
          <div class="relative mb-4 bg-white">
            <!-- 标题 -->
            <div class="title-tag">房产置换</div>

            <!-- 列表项容器 - 增加上边距 -->
            <div class="pt-[60px] pb-2 px-[15px]">
              <!-- 空视图显示 -->
              <div v-if="assetList.length === 0" class="empty-container">
                <van-empty
                    description="暂无房产"
                    image="search"
                >
                  <van-button
                      round
                      type="danger"
                      class="empty-btn"
                      @click="goToEstate"
                  >
                    立即去领取
                  </van-button>
                </van-empty>
              </div>

              <!-- 有数据时显示列表 -->
              <template v-else>
                <div
                    v-for="(item, index) in assetList"
                    :key="index"
                    class="mb-4"
                >
                  <!-- 内容区域 - 移除白色背景 -->
                  <div class="mb-1">
                    <div class="flex">
                      <!-- 左侧产品图片 -->
                      <div class="flex-shrink-0 mr-4">
                        <img
                            :src="item.house_detail.img"
                            class="w-[172.183px] h-[102px] rounded-[6px] object-cover"
                        />
                      </div>

                      <!-- 右侧信息 -->
                      <div class="flex-1 flex flex-col">
                        <!-- 标题 -->
                        <div class="text-[#F33] font-bold text-[16px] mb-1 leading-normal tracking-[-0.3px]">{{
                            item.house_detail.name
                          }}
                        </div>

                        <!-- 房产信息 -->
                        <div class="text-[#252626] text-[13px] font-medium leading-[20px] tracking-[-0.3px]">售价:
                          {{ (item.house_detail.price / 10000).toFixed(0) }}万
                        </div>
                        <div class="text-[#252626] text-[13px] font-medium leading-[20px] tracking-[-0.3px]">户型:
                          {{ item.house_detail.house_type }}
                        </div>
                        <div class="text-[#252626] text-[13px] font-medium leading-[20px] tracking-[-0.3px]">朝向:
                          {{ item.house_detail.face }}
                        </div>
                        <div class="text-[#252626] text-[13px] font-medium leading-[20px] tracking-[-0.3px]">面积:
                          {{ item.house_detail.area }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 按钮区域 - 添加左右边距 -->
                  <div class="flex justify-between pr-[10px]">
                    <!--                    <div class="flex gap-2" style="width: 48%;">-->
                    <!--                      <div class="selected-area flex-1" @click="showAreaPicker(item)">-->
                    <!--                        <span v-if="item.get_province" class="area-text">{{ item.get_province }}</span>-->
                    <!--                        <span v-else class="placeholder">省</span>-->
                    <!--                        <van-icon name="arrow-down" />-->
                    <!--                      </div>-->
                    <!--                      <div class="selected-area flex-1" @click="showAreaPicker(item)">-->
                    <!--                        <span v-if="item.get_city" class="area-text">{{ item.get_city }}</span>-->
                    <!--                        <span v-else class="placeholder">市</span>-->
                    <!--                        <van-icon name="arrow-down" />-->
                    <!--                      </div>-->
                    <!--                    </div>-->
                    <button
                        class="free-button"
                        style="width: 48%;"
                        @click="handleApplyButton(item)"
                    >
                      {{ item.zhihuan_status == 0 ? '立即置换' : '查看凭证' }}
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- 省市选择弹窗 -->
      <van-popup v-model="showAreaPickerDialog" position="bottom">
        <van-area
            :area-list="areaList"
            :columns-num="3"
            @confirm="onAreaConfirm"
            @cancel="showAreaPickerDialog = false"
        />
      </van-popup>

      <!-- 图片预览 -->
      <van-image-preview
          v-model="showImagePreview"
          :images="previewImages"
          :start-position="previewIndex"
          :show-indicators="false"
      />

      <van-overlay :show="showDialog" class="flex items-center justify-center z-50">
        <div class="invite-dialog bg-white rounded-lg w-[80%] py-8 px-6 flex flex-col items-center">
          <!-- 图标 -->
          <img src="@/assets/img/estate/ic_invite_tip.png" alt="邀请提示" class="w-[80px] h-[80px] mb-4">

          <!-- 提示文字 -->
          <div class="text-[#999] text-center text-[21.88px] font-normal leading-[157.9%] mb-2">
            需要邀请 ({{ selectedAsset?.has_recommend_identify_num || 0 }}/{{
              selectedAsset?.zhihuan_recommend_num || 0
            }}) 人
          </div>
          <div class="text-[#999] text-center text-[17.88px] font-normal leading-[157.9%] mb-6">
            进行实名注册即可置换
          </div>

          <!-- 按钮 -->
          <button class="invite-btn w-[140px] h-[37.373px] rounded-[18.686px] border-[1.068px] border-[#EB6400]"
                  @click="goToInvite">
            去邀请
          </button>
        </div>
      </van-overlay>

      <!-- 使用证书预览组件 -->
      <exchange-certificate-preview :card-detail="cardDetail"
                                    :show.sync="showCertificatePreview"></exchange-certificate-preview>
    </div>
  </div>
</template>

<script>
import {Button, Dialog, Icon, ImagePreview, Loading, Overlay, Area, Popup, Empty} from "vant";
import TitleBar from "@/components/common/TitleBar.vue";
import axios from "@/net/axios";
import api from "@/net/api";
import {areaList} from '@vant/area-data';
import ExchangeCertificatePreview from "@/components/bank/ExchangeCertificatePreview.vue";

export default {
  name: "HouseDetails",
  components: {
    TitleBar,
    ExchangeCertificatePreview,
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [ImagePreview.Component.name]: ImagePreview.Component,
    [Area.name]: Area,
    [Popup.name]: Popup,
    [Empty.name]: Empty,
  },
  data() {
    return {
      pageLoading: false,
      houseName: '',
      houseContent: '',
      showImagePreview: false,
      assetList: [],
      previewImages: [],
      previewIndex: 0,
      showAreaPickerDialog: false,
      areaList,
      currentItem: null,
      selectedAsset: null,
      showDialog: false, // 添加邀请弹窗控制
      showCertificatePreview: false,
      cardDetail: null, // 存储银行卡详情数据
    };
  },

  mounted() {
    this.getAssetList();
  },

  methods: {
    showAreaPicker(item) {
      this.currentItem = item;
      this.showAreaPickerDialog = true;
    },

    async onAreaConfirm(values) {
      if (!this.currentItem) return;

      // 更新当前项的省市数据
      this.currentItem.get_province = values[0].name;
      this.currentItem.get_city = values[1].name;
      this.currentItem.get_district = values[2].name;
      this.showAreaPickerDialog = false;

      const item = this.currentItem;
      // 校验是否已选择省市
      if (!this.validateArea(item)) return;
      this.selectedAsset = item;

      try {
        this.$toast.loading({
          message: "提交中...",
          forbidClick: true,
        });
        const res = await axios.post(api.editHouseOrder, {
          id: item.id,
          province: item.get_province,
          city: item.get_city,
          district: item.get_district,
        });
        Dialog.alert({
          title: "提示",
          message: res.msg || "提交成功",
          confirmButtonText: "确定",
          confirmButtonColor: "#F23D30",
        }).then(() => {
          this.getAssetList(this.currentItem);
        });
      } catch (error) {
        Dialog.alert({
          title: "提示",
          message: error.msg || "提交失败",
          confirmButtonText: "确定",
          confirmButtonColor: "#F23D30",
        });
      } finally {
        this.$toast.clear();
      }

    },

    validateArea(item) {
      if (!item.get_province || !item.get_city) {
        Dialog.alert({
          message: '请选择省市',
          confirmButtonText: '确定',
          confirmButtonColor: '#F23D30',
        });
        return false;
      }
      return true;
    },

    // 添加去邀请方法
    goToInvite() {
      this.showDialog = false;
      this.$router.push({name: 'userInvite'});
    },
    async handleApplyButton(item) {
      if (item.zhihuan_status == 1) {
        //生成和预览凭证
        this.cardDetail = item;
        this.showCertificatePreview = true;
        return
      }
      this.currentItem = item;
      this.selectedAsset = item;
      // 判断是否需要邀请
      if (item.has_recommend_identify_num < item.zhihuan_recommend_num) {
        this.showDialog = true;
        return;
      }
      this.showAreaPicker(item);
    },

    async getAssetList(data) {
      try {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
        });
        const res = await axios.get(api.myHouseOrderList, {params: {page: 1, size: 100}});
        this.assetList = res.data.list
        if (data) {
          this.cardDetail = this.assetList.find(item => item.id == data.id);
          this.showCertificatePreview = true;
        }
      } catch (error) {
        Dialog.alert({
          title: "提示",
          message: error.msg || "获取失败",
          confirmButtonText: "确定",
          confirmButtonColor: "#F23D30",
        });
      } finally {
        this.$toast.clear()
      }
    },

    goToEstate() {
      this.$router.push({name: 'estate'});
    },

  },
};
</script>

<style scoped lang="less">
.view-button, .free-button {
  width: 48%;
  height: 34.713px;
  padding: 4.339px;
  justify-content: center;
  align-items: center;
  border-radius: 5.207px;
  color: #F7F7F8;
  text-align: center;
  font-family: "HarmonyOS Sans SC";
  font-size: 17.356px;
  font-weight: 500;
  line-height: 17.356px;
  display: flex;
  margin-top: 10px;
}

.view-button {
  background: linear-gradient(180deg, #59CAFF 0%, #0055C7 100%);
}

.free-button {
  background: linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%);
}

/* 标题标签样式 */
.title-tag {
  position: absolute;
  top: -3px;
  left: 20px;
  padding: 4px 10px;
  border-radius: 0px 0px 3px 3px;
  background: linear-gradient(180deg, #FF002D 0%, #FF7D28 100%);
  color: #FFF;
  font-family: "HarmonyOS Sans SC";
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
}

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
  margin-bottom: 20px;
}

.house-title {
  color: #1F1F1F;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.9px;
}

.project-name {
  color: #F33;
  text-align: right;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.3px;
}

.content-title {
  color: #1F1F1F;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.content-text {
  color: #333;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 14px;
  line-height: 1.6;
  padding: 0 10px;
}

/* 添加图片样式 */
.content-text :deep(img) {
  max-width: 100%;
  height: auto;
  cursor: pointer;
}

.house-content {
  background-color: #FAFAFA;
  padding: 15px;
  border-radius: 8px;
  margin: 0 5px;
}

.vr-button {
  border-radius: 5.207px;
  background: linear-gradient(147deg, #EB6400 20.81%, #F49F00 92.21%);
  color: #F7F7F8;
  text-align: center;
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-size: 17.356px;
  font-weight: 500;
  line-height: 17.356px;
  padding: 10px 20px;
  border: none;
  width: 180px;
}

.house-layout-image {
  width: 100%;
  text-align: center;
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

.selected-area {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(180deg, #59CAFF 0%, #0055C7 100%);
  border-radius: 5.207px;
  color: #F7F7F8;
  font-family: "HarmonyOS Sans SC";
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  padding: 8.678px 4.339px;
  margin-top: 10px;
  cursor: pointer;
  min-width: 0;
}

.area-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 20px); // 减去图标的宽度
}

.placeholder {
  color: #F7F7F8;
}

.van-icon {
  margin-left: 4px;
  font-size: 12px;
  flex-shrink: 0;
}

/* 添加空视图样式 */
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 250px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.empty-btn {
  width: 140px;
  height: 40px;
  font-size: 16px;
  margin-top: 16px;
  background-color: #F23D30;
  border: none;
}
</style>
