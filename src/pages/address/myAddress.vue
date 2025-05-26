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
      <div class="overflow-y-auto h-full">
        <address-edit
            :show-delete="false"
            :show-set-default="false"
            :show-area="false"
            @save="onSave"
            @delete="onDelete"
            :address-info="address"
        />
      </div>
    </div>
  </div>
</template>
<script>

import {AddressEdit, NavBar} from "vant";
import axios from "@/net/axios";
import api from "@/net/api";
import {isNullOrEmpty} from "@/utils";

export default {
  components: {AddressEdit, NavBar,},
  mounted() {
      this.getAddressDetail();
  },
  data() {
    return {
      title:'我的地址',
      address: {
        name: '',
        tel: '',
        addressDetail: '',
        id: '',
        isDefault: false,
      },
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onSave(content) {
      console.log('onSave', content)
      if (isNullOrEmpty(content.name)) {
        this.$toast("请填写收件人姓名");
        return;
      }
      if (isNullOrEmpty(content.tel)) {
        this.$toast("请填写收件人手机号");
        return;
      }
      if (isNullOrEmpty(content.addressDetail)) {
        this.$toast("请填写收件地址");
        return;
      }

      const formData = new FormData();
      formData.append("get_name", content.name);
      formData.append("get_mobile", content.tel);
      formData.append("get_address", content.addressDetail);
      formData.append("id", this.address.id);

      this.$toast.loading({
        message: "提交中...",
        forbidClick: true,
      });
      axios.post(api.editBankOrder, formData)
          .then(() => {
            this.$dialog.alert({
                title: '提示',
                message: '保存成功',
            }).then(() => {
                this.$router.go(-1);
            });
          })
          .catch((error) => {
            this.$toast.clear();
            console.log(error);
            error.msg && this.$toast(error.msg);
          });
    },
    onDelete() {

    },
    getAddressDetail() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      axios.get(api.myBankOrder, {
        params: { type: 1 },
      })
          .then((response) => {
            this.$toast.clear();
            if (response.data) {
              const data = response.data;
              this.address = {
                name: data.get_name,
                tel: data.get_mobile,
                addressDetail: data.get_address,
                id:data.id,
                isDefault: data.status === 1, // 1:默认地址, 0:非默认地址
              }
            }
          })
          .catch((error) => {
            this.$toast.clear();
            console.log(error);
          });
    }
  },
}
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
</style>
