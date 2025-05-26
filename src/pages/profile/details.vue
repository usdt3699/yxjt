<template>
  <div class="page-container h-screen">
    <nav-bar
        :title="title"
        left-text=""
        left-arrow
        @click-left="onClickLeft"
        :safe-area-inset-top="true"
        class="w-full"
    />
    <div class="flex-grow overflow-hidden w-full">
      <div class="overflow-y-auto h-full">
        <cell-group class="rounded-md m-2" :border="false">
          <cell title="头像" class="flex flex-row items-center">
            <template #default>
              <uploader :after-read="uploadAvatar">
                <img class="rounded-full h-10 w-10"
                     :src="avatar?avatar:userInfo.head_img?userInfo.head_img:require('@/assets/img/home/default_avatar.png')">
              </uploader>
            </template>

          </cell>
          <cell title="姓名" :value="userInfo.real_name"/>
          <cell title="手机号" :value="userInfo.name"/>
          <cell title="邀请码" :value="userInfo.code" class="flex flex-row items-center"
                @click="copy(userInfo.code)">
            <template #right-icon>
              <icon name="orders-o" class="orders-icon ml-1"/>
            </template>
          </cell>
          <cell title="修改密码" :border="false" is-link to="/modifyPwd"/>
        </cell-group>
      </div>
    </div>
  </div>
</template>
<script>

import TitleBar from "@/components/TitleBar";
import {mapActions, mapState} from "vuex";
import {NavBar, CellGroup, Cell, Icon, Uploader} from "vant";
import axios from "@/net/axios";
import api from "@/net/api";

export default {
  name: "ContactUs",
  components: {TitleBar, NavBar, CellGroup, Cell, Icon, Uploader},
  computed: {
    ...mapState("user", ["userInfo"]),
    ...mapState("systemInfo", ["systemInfo"]),
    title() {
      return this.$route.meta.title; // 获取路由的meta属性的key值
    }
  },
  mounted() {
    this.getUserInfo();
    this.getSystemInfo();
  },
  data() {
    return {
      avatar: "",
    }
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    ...mapActions("systemInfo", ["getSystemInfo"]),
    onClickLeft() {
      // 点击左侧返回按钮返回上一页
      this.$router.go(-1);
    },
    copy(message) {
      const input = document.createElement("input");
      input.value = message;
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, input.value.length), document.execCommand('Copy');
      document.body.removeChild(input);
      this.$toast.success('复制成功!');
    },

    async uploadAvatar(file) {
      console.log('文件内容',file)
      this.avatar = file.content;
      const formFileData = new FormData();
      formFileData.append('image', file.file);

      try {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
        });
        const res = await axios.post(api.uploadImage, formFileData);
        if (res.code === 200) {

          const formData = new FormData();
          formData.append('head_img', res.data.path);

          const resUpload = await axios.post(api.uploadAvatar, formData)
          if (resUpload.code === 200) {
            this.getUserInfo();
          }
        }
      } catch (e) {
        e.msg&&this.$toast(e.msg);
      } finally {
        this.$toast.clear();
      }
    },
  }
}
</script>

<style scoped lang="less">
img {
  max-width: 100%;
}

.enTitle {
  font-size: 30px;
  color: #F91126;
  letter-spacing: -3px;
  text-transform: uppercase;
}

.contentBox {
  width: 90%;
  padding: 10px;
  margin: 20px auto;
  background-color: #fff;
}

.contentBox .title {
  font-size: 30px;
  color: #bc8f4b;
}

.contentBox .content > h1 {
  color: #3f3e55;
  font-size: 30px;
}

.contentBox .content > h2 {
  color: #3f3e55;
  font-size: 18px;
  opacity: 0.9;
  padding-bottom: 25px;
}

.contentBox .content > p {
  font-size: 14px;
  line-height: 24px;
  color: #b1b1b1;
  padding-bottom: 20px;
}

.content {
  line-height: 1.8rem;
}
</style>
