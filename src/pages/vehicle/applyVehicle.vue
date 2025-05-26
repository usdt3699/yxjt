<template>
  <div class="min-h-screen relative overflow-y-auto">
    <div class="w-full relative">
      <img src="@/assets/img/home/bg_common2.png" alt="背景" class="w-full">
      <div class="absolute top-0 left-0 right-0 w-full">
        <!-- 标题栏 -->
        <TitleBar :logoSrc="require('@/assets/img/home/yuexiu_logo.png')" @back="$router.back()" />

        <!-- 内容区域 -->
        <div class="content-container mx-4 rounded-lg p-4">
          <!-- 标题 -->
          <div class="apply-title">申领车辆填写资料</div>

          <!-- 表单内容 -->
          <div class="form-container">
            <!-- 真实姓名 -->
            <div class="form-item">
              <div class="label">真实姓名<span class="required">*</span></div>
              <input type="text" class="input-field" placeholder="请输入姓名" v-model="formData.name">
            </div>

            <!-- 性别 -->
            <div class="form-item">
              <div class="label">性别<span class="required">*</span></div>
              <van-radio-group v-model="formData.sex" direction="horizontal" class="gender-group">
                <van-radio name="男" checked-color="#EB6400">男</van-radio>
                <van-radio name="女" checked-color="#EB6400">女</van-radio>
              </van-radio-group>
            </div>

            <!-- 证件号码 -->
            <div class="form-item">
              <div class="label">证件号码<span class="required">*</span></div>
              <input type="text" class="input-field" placeholder="请输入身份证号码" v-model="formData.id_card_no">
            </div>

            <!-- 电话号码 -->
            <div class="form-item">
              <div class="label">电话号码<span class="required">*</span></div>
              <input
                  type="tel"
                  class="input-field"
                  placeholder="请输入手机号码"
                  v-model="formData.mobile"
                  maxlength="11"
                  @input="validateMobile"
              >
            </div>
            <!-- 收货地址 -->
            <div class="form-item">
              <div class="label">所在地区<span class="required">*</span></div>
              <div class="address-container">
                <div class="selected-area" @click="showAreaPicker = true">
                  <span v-if="formData.province && formData.city">{{ formData.province }} {{ formData.city }}</span>
                  <span v-else class="placeholder">省 市</span>
                  <van-icon name="arrow-down"/>
                </div>
              </div>
            </div>

            <!-- 详细地址 -->
            <div class="form-item">
              <div class="label">收货地址<span class="required">*</span></div>
              <input type="text" class="input-field" placeholder="详细地址" v-model="formData.address">
            </div>


          </div>

          <!-- 按钮区域 -->
          <div class="flex justify-center mt-4">
            <button class="view-button" @click="submitForm('1')">立即申领</button>
            <!--            <button class="free-button" @click="submitForm('0')">代好友申领</button>-->
          </div>
        </div>
        <div class="agreement-text">收货信息将用于实名认证与法律法规规定的其他法定事项，您的个人信息将严格保密</div>
      </div>

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

      <!-- 添加底部弹出的选择器 -->
      <van-popup v-model="showAreaPicker" position="bottom">
        <van-area
            :area-list="areaList"
            :columns-num="2"
            @confirm="onAreaConfirm"
            @cancel="showAreaPicker = false"
        />
      </van-popup>

      <!-- 使用证书预览组件 -->
      <vehicle-certificate-preview :card-detail="cardDetail"
                                    :show.sync="showCertificatePreview"></vehicle-certificate-preview>
    </div>
  </div>
</template>

<script>
import {Button, Dialog, Icon, Loading, Overlay, RadioGroup, Radio, Area, Popup, Checkbox} from "vant";
import TitleBar from "@/components/common/TitleBar.vue";
import {mapActions} from "vuex";
import {areaList} from '@vant/area-data';
import axios from "../../net/axios";
import api from "../../net/api";
import VehicleCertificatePreview from "@/components/bank/VehicleCertificatePreview.vue";

export default {
  name: "ApplyVehicle",
  components: {
    VehicleCertificatePreview,
    TitleBar,
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
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
      areaList,
      showAreaPicker: false,
      formData: {
        name: '',
        sex: '男',
        id_card_no: '',
        mobile: '',
        province: '',
        city: '',
        address: '',
        id: '',
        is_self: '1'
      },
      showCertificatePreview: false,
      cardDetail: null, // 存储银行卡详情数据
    };
  },

  async mounted() {
    this.getSystemInfo();
    if (this.$route.query && this.$route.query.id) {
      this.formData.id = this.$route.query.id;
      // 获取身份信息
      try {
        const res = await axios.get(api.identifyInfo);
        if (res.data) {
          this.formData.name = res.data.name;
          this.formData.id_card_no = res.data.id_card_no;
          // 从身份证识别性别
          const sexNum = res.data.id_card_no.charAt(16);
          this.formData.sex = parseInt(sexNum) % 2 === 1 ? '男' : '女';
        }
      } catch (error) {

      }
    } else {
      Dialog.alert({
        message: '参数错误，请重新选择车辆',
        confirmButtonText: '确定',
        confirmButtonColor: '#EB6400'
      }).then(() => {
        this.$router.back();
      });
    }
  },

  methods: {
    ...mapActions("systemInfo", ["getSystemInfo"]),
    onAreaConfirm(values) {
      this.formData.province = values[0].name;
      this.formData.city = values[1].name;
      this.showAreaPicker = false;
    },

    validateMobile() {
      // 只允许输入数字
      this.formData.mobile = this.formData.mobile.replace(/\D/g, '');
    },

    validateForm() {
      if (!this.formData.id) {
        Dialog.alert({message: '参数错误，请重新选择'});
        return false;
      }
      if (!this.formData.name) {
        Dialog.alert({message: '请输入姓名'});
        return false;
      }
      if (!this.formData.id_card_no) {
        Dialog.alert({message: '请输入身份证号码'});
        return false;
      }
      if (!this.formData.mobile) {
        Dialog.alert({message: '请输入手机号码'});
        return false;
      }
      if (this.formData.mobile.length !== 11) {
        Dialog.alert({message: '请输入11位手机号码'});
        return false;
      }

      if (!this.formData.province || !this.formData.city) {
        Dialog.alert({message: '请选择地区'});
        return false;
      }
      if (!this.formData.address) {
        Dialog.alert({message: '请输入详细地址'});
        return false;
      }
      return true;
    },

    async submitForm(isSelf) {

      if (!this.validateForm()) return;

      try {
        this.pageLoading = true;

        // 创建FormData对象
        const formData = new FormData();

        // 添加表单字段
        formData.append('id', this.formData.id);
        formData.append('name', this.formData.name);
        formData.append('id_card_no', this.formData.id_card_no);
        formData.append('mobile', this.formData.mobile);
        formData.append('address', this.formData.address);
        formData.append('sex', this.formData.sex);
        formData.append('province', this.formData.province);
        formData.append('city', this.formData.city);
        formData.append('is_self', isSelf);

        // 发送请求
        await axios.post(api.getCar, formData);
        Dialog.alert({
          message: '申领成功',
          confirmButtonText: '确定',
          confirmButtonColor: '#EB6400'
        }).then(() => {
          this.getAssetList()
        });
      } catch (error) {
        Dialog.alert({
          message: error.msg || '申领失败',
          confirmButtonText: '确定',
          confirmButtonColor: '#EB6400'
        });
      } finally {
        this.pageLoading = false;
      }
    },
    async getAssetList() {
      try {
        const res = await axios.get(api.myCarList);
        if (res.code === 200 && res.data?.carList) {
          this.cardDetail = res.data.carList.find(item=> item.id === this.formData.id);
          this.showCertificatePreview=true
        }
      } catch (error) {
        console.log("获取资产列表失败:", error);
      } finally {
        this.pageLoading = false;
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
  margin:20px 15px;
}

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
</style>
