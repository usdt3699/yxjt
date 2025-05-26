<template>
  <div class="page-container h-screen bg">
    <nav-bar
      title="收货地址"
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
import { AddressEdit, NavBar } from "vant";
import axios from "@/net/axios";
import api from "@/net/api";
import { isNullOrEmpty } from "@/utils";

export default {
  components: { AddressEdit, NavBar },
  mounted() {
    this.getAddressDetail();
  },
  data() {
    return {
      id: this.$route.params.id,
      title: this.$route.query.id > 0 ? "编辑地址" : "新增地址",
      address: {
        name: "",
        tel: "",
        addressDetail: "",
        isDefault: false,
      },
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },

    onSave(content) {
      console.log("onSave", content);
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

      if (this.id > 0) {
        formData.append("id", this.id);
      }
      this.$toast.loading({
        message: "提交中...",
        forbidClick: true,
      });
      axios
        .post(api.addGoldAddress, formData)
        .then(() => {
          this.$toast.clear();
          this.$toast("保存成功");
          this.$router.go(-1);
        })
        .catch((error) => {
          this.$toast.clear();
          console.log(error);
          error.msg && this.$toast(error.msg);
        });
    },
    onDelete() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "确定删除该地址吗？",
        })
        .then(() => {
          axios
            .get(api.deleteAddress, {
              params: {
                id: this.id,
              },
            })
            .then(() => {
              this.$toast("删除成功");
              this.$router.go(-1);
            })
            .catch((error) => {
              console.log(error);
              error.msg && this.$toast(error.msg);
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    getAddressDetail() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      axios
        .get(api.myAddress)
        .then((response) => {
          this.$toast.clear();
          if (response.data) {
            const data = response.data;
            this.address = {
              name: data.name,
              tel: data.phone,
              addressDetail: data.detail_address,
              isDefault: data.status === 1, // 1:默认地址, 0:非默认地址
            };
          }
        })
        .catch((error) => {
          this.$toast.clear();
          console.log(error);
        });
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

.page-container /deep/ .van-button--danger {
  background-color: #F91126;
  border-color: #F91126;
}

.bg {
  background: linear-gradient(180deg, #d5e6ff 0%, #ffffff 100%);
}
</style>
