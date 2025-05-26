<template>
  <div class="flex flex-col h-screen">
    <!-- loading遮罩 -->
    <van-overlay :show="pageLoading" class="flex items-center justify-center">
      <van-loading type="spinner" color="#fff" size="36" vertical>加载中...</van-loading>
    </van-overlay>

    <!-- 标题栏 -->
    <div class="h-[44px] flex items-center px-4 relative" style="background: radial-gradient(352.65% 128.18% at 21.33% -5.63%, #FE462D 0%, #FF867D 58.53%, #F52735 100%);">
      <van-icon name="arrow-left" class="text-white" @click="onClickLeft" />
      <span class="text-white text-lg absolute left-1/2 -translate-x-1/2">激活省份</span>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 overflow-y-auto bg-[#B1130F] pb-16">
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
        <!-- 地图背景 -->
        <div class="py-3">
          <div class="h-[200px]" ref="mapChart"></div>
        </div>

        <!-- 选择区域 -->
        <div class="px-4 py-3">
          <div class="text-white text-lg mb-2">所在地区</div>
          <div class="bg-white rounded-[10px] p-3">
            <div class="border border-[#ECA9A9] rounded-[10px] p-3">
              <div class="flex justify-between items-center">
                <div class="flex-1">
                  <div class="text-[14px] text-[#484848] font-normal mb-2 text-center">省份</div>
                  <div class="relative w-full h-[32px] bg-[#F2F2F2] rounded-[3px] flex items-center justify-center text-[13px] text-[#484848]"
                       @click="showProvince">
                    <span>{{ selectedProvince || '请选择' }}</span>
                    <van-icon name="arrow-down" class="absolute right-2" size="14" color="#484848" />
                  </div>
                </div>
              </div>
              <div class="flex gap-3 mt-4">
                <button class="flex-1 h-[40px] border border-[#F34947] text-[#F34947] rounded text-base font-medium" @click="onActivate">激活</button>
                <button class="flex-1 h-[40px] bg-[#F34947] text-white rounded text-base font-medium" @click="onActivate">明细</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Picker组件 -->
        <van-popup v-model="showProvincePicker" position="bottom" round>
          <van-picker
            show-toolbar
            :columns="provinces"
            :title="'选择省份'"
            :confirm-button-text="'确认'"
            :cancel-button-text="'取消'"
            @confirm="onProvinceConfirm"
            @cancel="showProvincePicker = false"
          />
        </van-popup>

        <!-- 列表区域 -->
        <div class="px-4">
          <div class="bg-white rounded-[10px] overflow-hidden">
            <!-- 表头 -->
            <div class="flex text-[14px] h-[44px] items-center bg-[#F6F6F6]">
              <div class="flex-1 text-center text-[#666]">姓名</div>
              <div class="flex-1 text-center text-[#666]">电话</div>
              <div class="flex-1 text-center text-[#666]">激活地区</div>
              <div class="flex-1 text-center text-[#666]">获得收益</div>
            </div>

            <!-- van-list 移到这里 -->
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="loadMore"
              :immediate-check="true"
            >
              <!-- 列表项 -->
              <div v-for="(item, index) in activatedList" :key="index">
                <div class="flex text-[14px] h-[50px] items-center">
                  <div class="flex-1 text-center text-[#333]">{{ item.name }}</div>
                  <div class="flex-1 text-center text-[#333]">{{ item.phone }}</div>
                  <div class="flex-1 text-center text-[#333]">{{ item.area }}</div>
                  <div class="flex-1 text-center text-[#F52735] font-medium">{{ item.income }}元</div>
                </div>
                <div v-if="index !== activatedList.length - 1" class="h-[1px] bg-[#EEEEEE] mx-4"></div>
              </div>
            </van-list>
          </div>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
// 导入相关依赖
import * as echarts from 'echarts'
import chinaJson from '@/assets/china.json'
import giftData from '@/assets/user_gifts.json'
import {  Popup, Picker, Icon,  PullRefresh, Loading, Overlay, List } from "vant";
import axios from "@/net/axios";
import api from "@/net/api";
import { mapState, mapActions } from "vuex";

export default {
  name: "InviteUser",
  components: {
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Icon.name]: Icon,
    [PullRefresh.name]: PullRefresh,
    [Loading.name]: Loading,
    [Overlay.name]: Overlay,
    [List.name]: List,
  },
  data() {
    return {
      pageLoading: true,
      mapChart: null,
      mapData: [],
      showProvincePicker: false,
      selectedProvince: '',
      provinces: [],
      activatedList: [],
      refreshing: false,
      loadingIcon: 'loading',
      resizeObserver: null,
      page: 1,
      size: 10,
      loading: false,
      finished: false,
      usedIndexes: new Set(), // 用于记录已经使用过的数据索引
    };
  },

  computed: {
    ...mapState("user", ["userInfo"]),
  },

  async mounted() {
    try {
      echarts.registerMap('china', chinaJson)
      await this.getUserInfo()
      await this.getProvinceList()

      this.$nextTick(() => {
        this.initMap()
        this.resizeObserver = new ResizeObserver(() => {
          this.mapChart && this.mapChart.resize()
        })
        if (this.$refs.mapChart) {
          this.resizeObserver.observe(this.$refs.mapChart)
        }
      })
    } catch (error) {
      console.error('Map initialization error:', error)
    } finally {
      this.pageLoading = false
    }
  },

  methods: {
    ...mapActions("user", ["getUserInfo"]),

    initMap() {
      if (!this.$refs.mapChart) return;

      try {
        this.mapChart = echarts.init(this.$refs.mapChart, {
          backgroundColor: 'transparent',
          renderer: 'canvas'
        })

        const option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}'
          },
          series: [{
            name: '中国',
            type: 'map',
            map: 'china',
            roam: false,
            aspectScale: 0.90,
            layoutCenter: ['50%', '74%'],
            layoutSize: '160%',
            data: this.mapData,
            emphasis: {
              label: {
                show: true
              },
              itemStyle: {
                areaColor: '#472929'
              }
            }
          }]
        }

        this.mapChart.setOption(option)
      } catch (error) {
        console.error('Map initialization error:', error)
      }
    },

    formatProvinceName(name) {
      const suffixes = ['省', '市', '自治区', '特别行政区'];
      if(suffixes.some(suffix => name.endsWith(suffix))) {
        return name;
      }
      if(['内蒙古', '广西', '西藏', '宁夏', '新疆'].includes(name)) {
        return name + '自治区';
      }
      if(['北京', '天津', '上海', '重庆'].includes(name)) {
        return name + '市';
      }
      return name + '省';
    },

    // 获取省份列表
    async getProvinceList() {
      try {
        const response = await axios.get(api.receiveList, { params: { type: 1 }})
        if(response.data?.provinceList) {
          const allProvinces = chinaJson.features.map(feature => feature.properties.name);

          // 检查用户省份是否已激活
          const userProvince = this.userInfo?.province || '';
          const isUserProvinceActivated = response.data.provinceList.includes(userProvince);

          // 如果用户省份未激活，设置为默认选中
          if (userProvince && !isUserProvinceActivated) {
            this.selectedProvince = userProvince;
          }

          // 更新可选择的省份列表 - 过滤掉已激活的省份
          this.provinces = allProvinces.filter(name => {
            return !response.data.provinceList.includes(name);
          });

          // 更新地图数据
          this.mapData = allProvinces.map(name => {
            const isActive = response.data.provinceList.includes(name);
            return {
              name,
              value: 0,
              itemStyle: {
                normal: {
                  areaColor: isActive ? '#472929' : '#2EEA60',
                  borderColor: '#fff',
                  borderWidth: 1
                }
              }
            }
          });

          if(this.mapChart) {
            this.mapChart.setOption({
              series: [{
                data: this.mapData
              }]
            });
          }
        }
      } catch(err) {
        err.msg && this.$toast(err.msg)
      }
    },

    // 修改 loadMore 方法
    async loadMore() {
      try {
        this.loading = true;
        
        // 获取所有可用的索引（排除已使用的）
        const availableIndexes = Array.from(
          { length: giftData.length },
          (_, i) => i
        ).filter(index => !this.usedIndexes.has(index));

        // 如果没有更多可用数据，标记完成
        if (availableIndexes.length === 0) {
          this.finished = true;
          return;
        }

        // 随机选择本页需要显示的数据索引
        const pageSize = Math.min(this.size, availableIndexes.length);
        const selectedIndexes = [];
        
        for (let i = 0; i < pageSize; i++) {
          const randomIndex = Math.floor(Math.random() * availableIndexes.length);
          selectedIndexes.push(availableIndexes[randomIndex]);
          availableIndexes.splice(randomIndex, 1);
        }

        // 获取选中索引对应的数据
        const pageData = selectedIndexes.map(index => {
          this.usedIndexes.add(index);
          const item = giftData[index];
          return {
            name: item.real_name ? this.maskName(item.real_name) : '未实名',
            phone: item.username,
            area: item.province,
            income: item.gift_coin_num,
            user_id: index // 使用索引作为唯一标识
          };
        });

        if (this.refreshing) {
          this.activatedList = pageData;
          this.usedIndexes = new Set(selectedIndexes); // 刷新时重置已使用索引
        } else {
          this.activatedList = [...this.activatedList, ...pageData];
        }

        this.page++;
        // 当剩余可用数据小于页面大小时，标记为加载完成
        this.finished = this.usedIndexes.size >= giftData.length;
      } catch (err) {
        console.error('Error loading data:', err);
        this.finished = true;
      } finally {
        this.loading = false;
        this.refreshing = false;
      }
    },

    // 添加姓名脱敏方法
    maskName(name) {
      if (!name) return '未实名';
      if (name.length === 2) {
        return name.substr(0, 1) + '*';
      }
      return name.substr(0, 1) + '*'.repeat(name.length - 2) + name.substr(-1);
    },

    // 添加缺失的方法
    onClickLeft() {
      this.$router.go(-1);
    },

    // 修改刷新方法
    async onRefresh() {
      this.finished = false;
      this.page = 1;
      this.refreshing = true;
      this.usedIndexes.clear(); // 清空已使用的索引
      await this.loadMore();
    },

    showProvince() {
      if (!this.provinces.length) {
        this.$toast('暂无可选省份');
        return;
      }
      this.showProvincePicker = true;
    },

    async onActivate() {
      if (!this.selectedProvince) {
        this.$toast('请选择省份');
        return;
      }

      const loading = this.$toast.loading({
        message: '激活中...',
        forbidClick: true,
      });

      try {
        await axios.post(api.activeInvite, {
          province: this.selectedProvince
        });

        this.$toast.success('激活成功');
        this.selectedProvince = '';
        this.showProvincePicker = false;

        // 重新加载数据
        await this.getProvinceList();
        await this.loadMore();

      } catch (err) {
        if (err.code === 430) {
          await this.$dialog.alert({
            message: err.msg || '请先完成实名认证',
            confirmButtonText: '去认证',
            confirmButtonColor: '#F34947',
          });
          this.$router.push({name: 'realNameAuth'});
        } else {
          await this.$dialog.alert({
            message: err.msg || '激活失败',
            confirmButtonText: '确定',
            confirmButtonColor: '#F34947',
          });
        }
      } finally {
        loading.clear();
      }
    },

    onProvinceConfirm(value) {
      this.selectedProvince = value;
      this.showProvincePicker = false;
    },
  },

  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }

    if (this.mapChart) {
      this.mapChart.dispose()
      this.mapChart = null
    }
  }
}
</script>

<style scoped lang="less">
// 添加地图相关样式
.map-container {
  width: 100%;
  height: 200px;
  border-radius: 10px;
}

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
.page-body{
  background-image: url('../../assets/img/invite/bg_invite.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.def-box {

  background-color:#FFF7EC;
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
