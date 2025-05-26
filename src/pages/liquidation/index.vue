<template>
  <div class="h-full w-full">
    <nav-bar
        :title="title"
        left-text=""
        :left-arrow="false"
        :safe-area-inset-top="true"
    />
    <div class="flex-grow overflow-hidden w-full">
      <div class="page-content flex flex-col px-4 ">
        <PullRefresh v-model="refreshing" @refresh="refreshData" class="h-full">

            <div class="flex flex-row items-center text-base mt-2 ">
              <div class="rounded-full bg-C3A3DFF w-1 h-3 mr-1 "></div>
              <span class="text-C3A3DFF">退还个人所得税总览</span>
            </div>
            <div class="flex flex-row flex-wrap">
              <div v-for="(item,index) in typeList" :key="index" class="flex w-1/2 justify-center items-center mt-2">
                <div class="item flex-col text-sm text-white">
                  <div class="text-xxl">{{ item.title }}</div>
                  <div class="text-opacity-25">{{ item.subTitle }}</div>
                </div>
              </div>
            </div>
          <list
              v-model="loading"
              :finished="finished"
              :finished-text="list.length>10?'没有更多了':''"
              @load="loadMore"
              @refresh="refreshData"
          >
            <div v-for="(item, index) in list" :key="index" class="flex flex-row items-center bg-white p-2 border-line"
                 :class="{ 'border-b': index !== list.length - 1 }">
              <van-image
                  round
                  width="42px"
                  height="42px"
                  :src="item.avatar?userInfo.item: require('@/assets/img/home/default_avatar.png')"
              />
              <div class="flex flex-col ml-1 flex-1">
                <div class="text-base font-bold text-b333">{{ item.realname ? item.realname : '未实名' }}</div>
                <div class="text-sm text-b666">{{ item.mobile }}</div>
              </div>
              <div class="flex flex-col ml-1">
                <div class="text-sm text-b333"><span>业绩</span>：<span
                    class="text-red-500"> {{ item.rjmoney ? item.rjmoney : '0.00' }}</span></div>
                <div class="text-sm text-b666">加入：{{ item.regTime | formatTimestamp('YYYY.MM.DD HH:mm') }}</div>
              </div>
            </div>
          </list>
          <Empty v-if="list.length === 0" description="暂无数据"/>
        </PullRefresh>
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
      totalPage: 0,
      pageSize: 10,
      pageNo: 1,
      typeList: [
        {
          id: 1,
          title: '1730亿+',
          subTitle: '退还资金累计',
        },
        {
          id: 2,
          title: '120亿+',
          subTitle: '退还交项目所得税累计',
        },
        {
          id: 3,
          title: '180亿+',
          subTitle: '退还养老金累计',
        },
        {
          id: 4,
          title: '980亿+',
          subTitle: '退还五险一金累计',
        }
      ],
      loading: false,
      finished: false,
      refreshing: false,
      list: [],
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
.item {
  background: linear-gradient(136deg, #4B49FF 0%, #7D9AFF 100%);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  width: 95%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
