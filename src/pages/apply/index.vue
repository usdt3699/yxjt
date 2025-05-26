<template>
  <div class="h-full w-full">
    <nav-bar
        :title="title"
        left-text=""
        :left-arrow="false"
        :safe-area-inset-top="true"
    />
    <div class="flex-grow overflow-hidden w-full">
      <div class="page-content flex flex-col ">
        <div class="flex flex-col items-center mb-4">
          <img src="@/assets/img/apply/ic_wait.png" class="w-40 mt-5 mb-1 object-cover" alt="">
          <span class="text-base text-t3E3E3E  mb-4">填写申请</span>
        </div>
        <div class="rounded bg-white p-3 m-4 flex flex-row items-center justify-evenly ">
          <div class="flex flex-col items-center">
            <img src="@/assets/img/apply/ic_one_e.png" class="w-38 mb-2">
            <span class="text-sm text-t3E3E3E">填写申请</span>
          </div>
          <div class="line"></div>
          <div class="flex flex-col items-center">
            <img src="@/assets/img/apply/ic_two.png" class="w-38 mb-2">
            <span class="text-sm text-t3E3E3E">审核成功</span>
          </div>
          <div class="line"></div>
          <div class="flex flex-col items-center">
            <img src="@/assets/img/apply/ic_three.png" class="w-38 mb-2">
            <span class="text-sm text-t3E3E3E">选择</span>
          </div>
        </div>
        <div class="bg-white p-3">
          <div class="flex flex-row items-center  text-base">
            <div class="rounded-full bg-C3A3DFF w-1 h-3 mr-1"></div>
            置换清算金额提现额度
          </div>
          <div class="flex flex-row items-center text-base justify-evenly my-5">
            <div v-for="(item,index) in list" :key="index" class="rounded-full border-gccc px-5 py-2" :class="{ 'bg-C3A3DFF': item.check,'border':!item.check,'text-white':item.check  }"
                 @click="changeItem(item)">{{ item.title }}
            </div>
          </div>
          <div class="flex flex-row justify-center">
            <div class="bg-C3A3DFF shadow-md rounded-full px-10 py-2 text-sm text-white w-auto">提现</div>
          </div>
        </div>
        <div class="bg-cyellow p-2 text-F7B500 text-sm">
          置换清算金额提现额度：300万300、500万500、900万900、七日退还避免套现
        </div>
      </div>
    </div>
  </div>
</template>

<script>


import TitleBar from "@/components/TitleBar";
import {Empty, List, NavBar, PullRefresh,} from "vant";
import {mapActions, mapState} from "vuex";

export default {
  name: "index",
  components: {TitleBar, NavBar, List, Empty, PullRefresh},
  data() {
    return {
      list: [
        {
          id: 1,
          title: '300万',
          amount: 10,
          check: true,
        },
        {
          id: 2,
          title: '500万',
          recommendNum: 10,
          check: false,
        },
        {
          id: 3,
          title: '900万',
          recommendNum: 20,
          check: false,
        }
      ],
      loading: false,
      finished: false,
      refreshing: false,
    };
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    title() {
      return this.$route.meta.title; // 获取路由的meta属性的key值
    }
  },
  filters: {
    formatLabel(item, userInfo) {
      if (item.id === 1) {
        return '已领取'
      }
      if (userInfo?.tjnum >= item.recommendNum) {
        return '已领取'
      }
      return '立即邀请'
    }
  },
  mounted() {
    // this.getUserInfo();
  },

  methods: {
    ...mapActions("user", ["getUserInfo"]),
    changeItem(item) {
      this.list.forEach(i => {
        if (i.id === item.id) {
          i.check = true
        } else {
          i.check = false
        }
      })
    },
    jumpToPage(item) {
      if (item.id === 1) {
        this.$toast('该奖项已被领取');
        return;
      }
      if (this.userInfo?.tjnum >= item.recommendNum) {
        this.$toast('该奖项已被领取');
        return;
      }
      this.$router.push({name: 'inviteUser'})

    },
    refreshData() {
      this.refreshing = true
      this.pageNo = 1
      this.loadMore()
    },
    loadMore() {
      this.loading = false
      this.refreshing = false
      // axios
      //     .get(api.teamList, {
      //       params: {
      //         page: this.pageNo,
      //         level: this.level
      //       }
      //     })
      //     .then((res) => {
      //
      //       if (this.pageNo === 1) {
      //         this.list = res.data.data;
      //         this.total = res.data.total;
      //         this.childCount = res.data.human;
      //         this.count = res.data.count;
      //       } else {
      //         this.list = this.list.concat(res.data.list);
      //       }
      //       this.loading = false
      //       this.refreshing = false
      //       if (this.list.length < this.count) {
      //         this.pageNo++;
      //       } else {
      //         this.finished = true;
      //       }
      //     })
      //     .catch((err) => {
      //       this.loading = false
      //       this.refreshing = false
      //       err.msg && this.$toast(err.msg);
      //     });
    },
  },
};
</script>

<style scoped lang="less">
.line {
  border: 1px dashed #A5A5A5;
  flex: 1;
  margin: 0 20px 20px;
}
</style>
