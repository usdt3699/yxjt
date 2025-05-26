<template>
  <div class="h-full w-full bg-white">
    <div class="overflow-hidden w-full">
      <div class="page-content-2 pb-safe">
        <PullRefresh v-model="refreshing" @refresh="refreshData" class="h-full">
          <div class="w-full top-container flex flex-col">
            <div class="limit-content text-primary text-base ">
              活动只限人数:100000人领取
            </div>
<!--            <CountDown @onFinished="this.onFinished"/>-->
          </div>
          <list
              v-model="loading"
              :finished="true"
              @load="loadMore"
              @refresh="refreshData"
          >
            <div class="px-2 pt-2">
              <div class="bg-white rounded-md p-2 mb-2">
                <div class="flex flex-row items-stretch mb-2" v-for="(item,index) in list" :key="index">
                  <div class="flex-1 item-left py-2 relative">
                    <img src="@/assets/img/invite/ic_money.png" style="width: 52px"/>
                    <div class="ml-2 flex-1">
                      <div class="text-lg" style="color: #5B3B12;">邀请{{ item.recommendNum }}位实名注册</div>
                      <div class="text-base text-T4E4E4E">每日领取<span class="text-primary">{{ item.amount*multiple }}</span>元
                      </div>
                    </div>
                    <img   src="@/assets/img/invite/double.png" class="absolute right-0 top-0" alt="grade-icon" style="width: 40px;"/>
                  </div>
                  <div class="item-right px-4">
                    <button class="bg-primary text-white text-sm rounded py-1 px-2"
                            @click="jumpToPage(item,index)"
                    >{{ getFormatLabel(index, item.recommendNum) }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </list>
        </PullRefresh>
      </div>
    </div>
  </div>
</template>

<script>


import {List, PullRefresh,} from "vant";
import axios from "@/net/axios";
import api from "@/net/api";
import {isNullOrEmpty} from "@/utils";
import {mapActions, mapState} from "vuex";
import CountDown from "@/components/CountDown";

export default {
  name: "index",
  components: { List, PullRefresh, CountDown},
  data() {
    return {
      type: 0,
      dialog: false,
      name: '',
      phone: '',
      address: '',
      list: [
        {
          id: 1,
          recommendNum: 2,
          amount: 40000,
        },
        {
          id: 2,
          recommendNum: 6,
          amount: 120000,
        },
        {
          id: 3,
          recommendNum: 15,
          amount: 300000,
        },
        {
          id: 4,
          recommendNum: 30,
          amount: 600000,
        },
        {
          id: 5,
          recommendNum: 90,
          amount: 1800000,
        },
        {
          id: 6,
          recommendNum: 200,
          amount: 4000000,
        },
      ],
      recommendRecords: [],
      tjnum: 0,
      is_reg_give: 0,
      loading: false,
      finished: false,
      refreshing: false,
      multiple:2,
    };
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    title() {
      return this.$route.meta.title; // 获取路由的meta属性的key值
    }
  },
  mounted() {
    this.loadMore()
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    onFinished(status) {
      this.multiple = status? 1:3;
    },
    jumpToPage(item, index) {
      if (isNullOrEmpty(this.userInfo.auth)) {
        this.$dialog.confirm({
          title: '提示',
          message: '请先实名认证',
          confirmButtonText: '去认证',
          cancelButtonText: '取消'
        }).then(() => {
          this.$router.push({name: 'realNameAuth'})
        });
        return;
      }
      if (index == 0) {
        if (this.is_reg_give == 1) {
          this.$toast('该奖项已被领取');
          return;
        }
        this.reviceReg()
        return
      }
      if (this.recommendRecords.includes(item.recommendNum)) {
        this.$toast('该奖项已被领取');
        return;
      }
      if (this.tjnum >= item.recommendNum) {
        this.receiveAward(item.recommendNum)
      } else {
        this.$router.push({name: 'inviteUser', query: {code: this.userInfo.code}});
      }
    },
    refreshData() {
      this.refreshing = true
      this.loadMore()
    },
    loadMore() {
      const request1 = axios.get(api.userInfo);
      const request2 = axios.get(api.receiveList);
      // 合并请求
      axios.all([request1, request2])
          .then(axios.spread((response1, response2) => {
            // 处理请求1的响应
            //"is_reg_give": 0表示未领取，1表示已领取
            this.is_reg_give = response1.data.is_reg_give;
            //已领取
            if (response2.data && response2.data.reclist && response2.data.reclist.length > 0) {
              this.recommendRecords = response2.data.reclist.map(item => {
                return item.recom_num
              })
            }
            //推荐总人数
            this.tjnum = response1.data.tjnum;
            this.loading = false
            this.refreshing = false
          }))
          .catch(err => {
            this.loading = false
            this.refreshing = true
            err.msg && this.$toast(err.msg);
          });
    },
    receiveAward(level) {
      console.log(level)
      axios
          .get(api.receiveAward, {params: {level}})
          .then(() => {
            this.$toast("领取成功");
            this.loadMore();
            this.dialog = false;
          })
          .catch((err) => {
            this.dialog = false;
            err.msg && this.$toast(err.msg);
          });
    },
    reviceReg() {
      axios
          .get(api.reviceReg)
          .then(() => {
            this.$toast("领取成功");
            this.loadMore();
          })
          .catch((err) => {
            err.msg && this.$toast(err.msg);
          });
    },
    getFormatLabel(index, inviteNum) {
      if (this.tjnum >= inviteNum) {
        return "已达标";
      } else {
        return "未达标";
      }
    },
    isReceived(index, recommendNum) {
      if (index == 0) {
        if (this.is_reg_give == 1) {
          return true;
        }
        return false;
      } else {
        if (this.recommendRecords?.includes(recommendNum)) {
          return true;
        }
        return false;
      }
    }
  },
};
</script>

<style scoped lang="less">
.van-nav-bar {
  background-color: #B41212;
}

.van-nav-bar /deep/ .van-nav-bar__title {
  color: #fff;
}

.grade-icon {
  height: 46px;
}

.get-icon {
  height: 46px;
}

.title-icon {
  width: 220px;
}

.page-content /deep/ .van-loading__text {
  color: #fff;
}

.page-content /deep/ .van-pull-refresh__head {
  color: #fff;
}

.page-content /deep/ .van-empty__description {
  color: #fff;
}

.top-container {
  background-image: url('../../assets/img/invite/bg_invite.png');
  background-size: 100%;
  background-repeat: no-repeat;
  height: 260px;
  padding-top: 190px;
  padding-left: 10px;
  padding-right: 10px;
}

.limit-content {
  background: linear-gradient(90deg, rgba(255, 238, 89, 0) 0%, #FFEE59 20%, #FFEE59 80%, rgba(255, 238, 89, 0) 100%);
  justify-content: center;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item-left {
  background: linear-gradient(270deg, #FFE7CB 0%, #FFDBAF 100%);
  border-radius: 3px 6px 6px 3px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item-right {
  background: linear-gradient(270deg, #FFE7CB 0%, #FFDBAF 100%);
  border-radius: 6px 3px 3px 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
