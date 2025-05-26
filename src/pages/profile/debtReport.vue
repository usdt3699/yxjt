<template>
  <div class="debt-report-page">
    <div class="background-container">
      <img src="@/assets/img/debtReport/bg_red.png" class="bg-image" alt="背景图" />
    </div>

    <van-nav-bar
      title=""
      left-arrow
      @click-left="onClickLeft"
      class="custom-nav"
      :border="false"
      fixed
    />

    <!-- 客服入口 -->
    <div class="customer-service" @click="contactCustomerService">
      <img src="@/assets/img/debtReport/customer_service.png" alt="联系客服咨询办理" />
    </div>

    <div class="content-container">


      <div class="id-upload-section">
        <div class="header">
          <div class="emblem">
            <img src="@/assets/img/debtReport/emblem.png" alt="国徽" />
          </div>
          <div class="title">精准助农官方化债特办处</div>
        </div>

        <div class="subtitle">中国居民化债网上申请窗口：</div>
        <div class="id-card-container">
          <div class="id-card-wrapper">
            <div class="id-card">
              <van-uploader
                v-model="frontIdList"
                :max-count="1"
                :after-read="afterReadFront"
                :before-read="beforeRead"
                class="uploader"
              >
                <img v-if="frontIdList.length === 0" src="@/assets/img/debtReport/id_front.png" alt="身份证正面" />
              </van-uploader>
            </div>
            <div class="upload-text">
              <van-icon name="photograph" />
              <span>上传申请人身份证正面照片</span>
            </div>
          </div>

          <div class="id-card-wrapper">
            <div class="id-card">
              <van-uploader
                v-model="backIdList"
                :max-count="1"
                :after-read="afterReadBack"
                :before-read="beforeRead"
                class="uploader"
              >
                <img v-if="backIdList.length === 0" src="@/assets/img/debtReport/id_back.png" alt="身份证反面" />
              </van-uploader>
            </div>
            <div class="upload-text">
              <van-icon name="photograph" />
              <span>上传申请人身份证反面照片</span>
            </div>
          </div>
        </div>

        <van-button type="danger" block class="submit-btn" @click="onSubmit">提交</van-button>
      </div>

      <div class="instructions">
        <div class="instruction-item">
          <div class="item-number">1、</div>
          <div class="item-content">准备材料：申请人需要准备相关的材料，包括身份证、户口本、经济收入情况证明、债务情况说明，如残疾或疾病，还需要提供相应的证明材料，向客服提供相关证明，由客服工作人员提供相关材料至申请人所在地方政府审核报备。</div>
        </div>

        <div class="instruction-item">
          <div class="item-number">2、</div>
          <div class="item-content">初步审核：地方政府收到化债申请材料后，由多个镇人民政府或街道办事处对申请材料进行初步审核，如果材料不齐全或不符合要求，会告知申请人补充或修改。申请过程中，可能会进行入户调查、邻里走访、信息核查等方式，核实申请人的家庭经济状况。</div>
        </div>

        <div class="instruction-item">
          <div class="item-number">3、</div>
          <div class="item-content">对符合条件的申请人，县市级政务部门会给予发放化债优惠券；不符合化债条件的申请人，会收到书面通知并说明理由。</div>
        </div>

        <div class="footer-text">国务院办公厅</div>
        <div class="footer-date">2024.12.17</div>
      </div>

      <!-- 收货地址绑定区域 -->
      <div class="address-section">
        <div class="address-binding">
          <div class="address-form">
            <div class="form-item">
              <div class="label">姓名：</div>
              <div class="input-wrapper">
                <input type="text" v-model="addressForm.name" placeholder="输入姓名" class="custom-input" />
              </div>
            </div>
            <div class="form-item">
              <div class="label">电话：</div>
              <div class="input-wrapper">
                <input type="text" v-model="addressForm.phone" placeholder="输入电话号码" class="custom-input" />
              </div>
            </div>
            <div class="form-item">
              <div class="label">邮寄地址：</div>
              <div class="input-wrapper">
                <input type="text" v-model="addressForm.address" placeholder="输入收货地址" class="custom-input" />
              </div>
            </div>
          </div>
        </div>
        <van-button block class="address-submit-btn" @click="onSubmitAddress">提交绑定</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Field, Form, NavBar, Icon, Dialog, Toast, Uploader } from 'vant';
import axios from '@/net/axios';
import api from '@/net/api';
import { mapState } from 'vuex';

export default {
  name: 'DebtReport',
  components: {
    [Button.name]: Button,
    [Field.name]: Field,
    [Form.name]: Form,
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Uploader.name]: Uploader,
  },
  computed: {
    ...mapState('systemInfo', ['systemInfo']),
  },
  data() {
    return {
      frontIdList: [],
      backIdList: [],
      loading: false,
      applyInfo: null, // 存储申请信息
      addressForm: {
        name: '',
        phone: '',
        address: ''
      }
    };
  },
  mounted() {
    // 页面加载时获取申请信息
    this.getDebtApplyInfo();
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    contactCustomerService() {
      // 使用系统配置的客服链接
      if (this.systemInfo && this.systemInfo.customerService) {
        window.location.href = this.systemInfo.customerService;
      } else {
        Dialog.alert({
          title: '提示',
          message: '客服系统正在维护中，请稍后再试',
        });
      }
    },
    // 获取申请信息
    getDebtApplyInfo() {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });

      axios.get(api.myDebtApply)
        .then(res => {
          this.applyInfo = res.data;

          // 如果有已上传的图片，回显到界面上
          if (this.applyInfo && this.applyInfo.face_img) {
            this.frontIdList = [{
              url: this.applyInfo.face_img,
              isImage: true
            }];
          }

          if (this.applyInfo && this.applyInfo.back_img) {
            this.backIdList = [{
              url: this.applyInfo.back_img,
              isImage: true
            }];
          }

          Toast.clear();
        })
        .catch(err => {
          Toast.clear();
          Dialog.alert({
            title: '提示',
            message: err.message || '获取申请信息失败',
          });
        });
    },
    beforeRead(file) {
      // 检查文件类型
      if (!/\.(jpg|jpeg|png|gif)$/i.test(file.name)) {
        Toast('请上传jpg、jpeg、png格式图片');
        return false;
      }
      return true;
    },
    afterReadFront(file) {
      // 处理身份证正面照片上传
      console.log('身份证正面上传', file);

      // 显示上传中提示
      Toast.loading({
        message: '上传中...',
        forbidClick: true,
        duration: 0,
      });

      // 准备表单数据
      const formData = new FormData();
      formData.append('image', file.file);

      // 调用上传接口
      axios.post(api.uploadImage, formData)
        .then(res => {
          // 上传成功后，更新图片URL
          if (res.data && res.data.img_path) {
            this.frontIdList[0].url = res.data.img_path;
            // 保存图片路径用于提交
            this.frontIdList[0].path = res.data.path;
            Toast.success('上传成功');
          } else {
            throw new Error('上传失败，返回数据格式错误');
          }
        })
        .catch(err => {
          // 上传失败，移除图片
          this.frontIdList = [];
          Dialog.alert({
            title: '提示',
            message: err.message || '上传失败',
          });
        })
        .finally(() => {
          Toast.clear();
        });
    },
    afterReadBack(file) {
      // 处理身份证反面照片上传
      console.log('身份证反面上传', file);

      // 显示上传中提示
      Toast.loading({
        message: '上传中...',
        forbidClick: true,
        duration: 0,
      });

      // 准备表单数据
      const formData = new FormData();
      formData.append('image', file.file);

      // 调用上传接口
      axios.post(api.uploadImage, formData)
        .then(res => {
          // 上传成功后，更新图片URL
          if (res.data && res.data.img_path) {
            this.backIdList[0].url = res.data.img_path;
            // 保存图片路径用于提交
            this.backIdList[0].path = res.data.path;
            Toast.success('上传成功');
          } else {
            throw new Error('上传失败，返回数据格式错误');
          }
        })
        .catch(err => {
          // 上传失败，移除图片
          this.backIdList = [];
          Dialog.alert({
            title: '提示',
            message: err.message || '上传失败',
          });
        })
        .finally(() => {
          Toast.clear();
        });
    },
    onSubmit() {
      if (this.frontIdList.length === 0 || this.backIdList.length === 0) {
        Dialog.alert({
          title: '提示',
          message: '请上传身份证正反面照片',
        });
        return;
      }

      // 显示加载提示
      Toast.loading({
        message: '提交中...',
        forbidClick: true,
        duration: 0,
      });

      // 准备表单数据
      const formData = new FormData();

      // 使用上传后返回的图片路径
      if (this.frontIdList[0].path) {
        formData.append('face_img', this.frontIdList[0].path);
      } else if (this.frontIdList[0].url) {
        // 如果是从接口获取的已有图片，直接使用url
        formData.append('face_img', this.frontIdList[0].url);
      }

      if (this.backIdList[0].path) {
        formData.append('back_img', this.backIdList[0].path);
      } else if (this.backIdList[0].url) {
        // 如果是从接口获取的已有图片，直接使用url
        formData.append('back_img', this.backIdList[0].url);
      }

      // 提交申请
      axios.post(api.addDebtApply, formData)
        .then(res => {
          Toast.success('提交成功');
          // 提交成功后返回上一页
          setTimeout(() => {
            this.$router.back();
          }, 1500);
        })
        .catch(err => {
          Dialog.alert({
            title: '提示',
            message: err.message || '提交失败',
          });
        })
        .finally(() => {
          Toast.clear();
        });
    },
    onSubmitAddress() {
      Dialog.alert({
        title: '提示',
        message: '你还未收到化债专属卡',
      });
    }
  },
};
</script>

<style lang="less" scoped>
.debt-report-page {
  min-height: 100vh;
  position: relative;
  color: #333;
}

.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

.custom-nav {
  background-color: transparent;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;

  /deep/ .van-nav-bar__title {
    color: #fff;
    font-weight: bold;
  }

  /deep/ .van-icon {
    color: #fff;
  }
}

.content-container {
  padding: 16px;
  padding-top: 56px; /* 导航栏高度 */
  position: relative;
  z-index: 1;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;

  .emblem {
    width: 60px;
    height: 60px;
    margin-bottom: 10px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .title {
    font-size: 18px;
    font-weight: bold;
    color: #d40000;
    text-align: center;
  }
}

.subtitle {
  font-size: 16px;
  margin-bottom: 20px;
  text-align: center;
}

.id-upload-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.id-card-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 10px;
}

.id-card-wrapper {
  width: 48%;
  display: flex;
  flex-direction: column;
}

.id-card {
  width: 100%;
  height: 86px;
  border: 1px dashed #ddd;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  margin-bottom: 5px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .uploader {
    width: 100%;
    height: 100%;

    /deep/ .van-uploader__wrapper {
      width: 100%;
      height: 100%;
    }

    /deep/ .van-uploader__upload {
      width: 100%;
      height: 100%;
      margin: 0;
      background-color: transparent;
    }

    /deep/ .van-uploader__preview {
      width: 100%;
      height: 100%;
      margin: 0;
    }

    /deep/ .van-uploader__preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.upload-text {
  width: 100%;
  color: #666;
  font-size: 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;

  .van-icon {
    margin-right: 4px;
    color: #1989fa;
    font-size: 14px;
  }
}

.submit-btn {
  height: 44px;
  font-size: 16px;
  font-weight: bold;
  background-color: #e4393c;
  border: none;
}

.instructions {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.instruction-item {
  display: flex;
  margin-bottom: 15px;

  .item-number {
    flex-shrink: 0;
    font-weight: bold;
  }

  .item-content {
    flex: 1;
    font-size: 14px;
    line-height: 1.5;
  }
}

.footer-text {
  text-align: right;
  font-weight: bold;
  margin-top: 20px;
}

.footer-date {
  text-align: right;
  margin-top: 5px;
}

.customer-service {
  position: fixed;
  right: 20px;
  top: 60px;
  z-index: 1000;
  width: 60px;
  height: 60px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.address-section {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.address-binding {
  width: 100%;
  background: url('~@/assets/img/debtReport/address_bg.png') no-repeat;
  background-size: contain;
  padding: 20px;
  aspect-ratio: 350/206;
  position: relative;
}

.address-form {
  position: absolute;
  bottom: 30px;
  left: 20px;
  right: 20px;
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  .label {
    width: 70px;
    color: #333;
    font-size: 14px;
    flex-shrink: 0;
  }

  .input-wrapper {
    flex: 1;
    background: #E5C28F;
    border-radius: 4px;
    height: 32px;
    padding: 0 8px;
    display: flex;
    align-items: center;
  }

  .custom-input {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    color: #333;

    &::placeholder {
      color: rgba(51, 51, 51, 0.6);
    }
  }
}

.address-submit-btn {
  display: flex;
  width: 344px;
  height: 33px;
  padding: 14px 24px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-top: 20px;

  border-radius: 8px;
  background: linear-gradient(180deg, #FFF 0%, #FFECB0 100%);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  border: none;

  /deep/ .van-button__text {
    color: #333;
    font-weight: normal;
  }
}
</style>
