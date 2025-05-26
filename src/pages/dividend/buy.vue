<template>
  <div class="page-container h-screen w-screen">
    <nav-bar
        left-text=""
        left-arrow
        :title="title"
        @click-left="onClickLeft"
        :safe-area-inset-top="true"
        class="w-full"
    />
    <div class="flex-grow overflow-hidden w-full">
      <div class="overflow-y-auto h-full">
        <div class="welfare-list">
          <div class="item">
            <p class="title" style="color: #fff;">{{query.title}}</p>
            <ul class="ul">
              <li v-if="query.subTitle">
                <p class="pre">{{query.stock}}</p>
                <p style="color: #fff;">{{query.subTitle}}</p>
              </li>
              <li v-if="query.subTitle2">
                <p class="pre">{{query.rate}}</p>
                <p style="color: #fff;">{{query.subTitle2}}</p>
              </li>
              <li>
                <p class="pre">{{query.price}}<span>元</span></p>
                <p style="color: #fff;">金额</p>
              </li>
            </ul>
          </div>
        </div>
        <radio-group v-model="payType">
          <cell-group title="支付方式" class="m-3 rounded-b">
            <cell v-for="(item, index) in paymentList"
                  :key="index"
                  clickable
                  :title="item.name"
                  @click="payType = item.type"
                  v-if="systemInfo[item.is_show]"
                  class="flex flex-row items-center"
            >
              <template #icon>
                <img :src="item.icon" class="h-5 mr-1">
              </template>
              <template #right-icon>
                <radio :name="item.type"/>
              </template>
            </cell>
          </cell-group>
        </radio-group>
        <div class="annius_S">
          <button type="button" @click="onPay">立即支付</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 购买分红股
 */
import {mapActions, mapState} from "vuex";
import {Cell, CellGroup, NavBar, Radio, RadioGroup} from "vant";
import axios from "@/net/axios";
import api from "@/net/api";

export default {
  components: { NavBar, CellGroup, Cell, RadioGroup, Radio},
  computed: {
    ...mapState("systemInfo", ["systemInfo"]),
    title() {
      return this.$route.meta.title; // 获取路由的meta属性的key值
    }
  },
  data() {
    return {
      query: this.$route.query,
      payType: 3,
      paymentList: [
        {
          name: '银联',
          icon: require('../../assets/img/payment/union.png'),
          type: 3,
          is_show: 'yun_pay_enable',
        },
        {
          name: '支付宝',
          icon: require('../../assets/img/payment/alipay.png'),
          type: 2,
          is_show: 'alipay_enable',
        },
        {
          name: '微信支付',
          icon: require('../../assets/img/payment/wxpay.png'),
          type: 1,
          is_show: 'wechat_enable',
        },
        {
          name: 'QQ支付',
          icon: require('../../assets/img/payment/qq.png'),
          type: 4,
          is_show: 'isQqpay',
        },
        {
          name: '银行卡',
          icon: require('../../assets/img/payment/alipay.png'),
          type: 5,
          is_show: 'bank_enable',
        },
        {
          name: '余额支付',
          icon: require('../../assets/img/payment/yue.png'),
          type: 7,
          is_show: 'balance_enable',
        },
      ],
    };
  },
  mounted() {
    this.getSystemInfo();
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    ...mapActions("systemInfo", ["getSystemInfo"]),
    onClickLeft() {
      // 点击左侧返回按钮返回上一页
      this.$router.go(-1);
    },
    onPay() {
      if (this.payType == 7) {
        this.rechargePay();
        return
      }
      let params = {
        source: this.query.source,
        pay_type: this.payType,
        project_id: this.query.id,
        amount: this.query.price,
      };
      this.$toast.loading({
        message: "支付中...",
        forbidClick: true,
      });
      axios
          .post(api.balancePay, params)
          .then((res) => {
            this.$toast.clear();
            if (res.data?.payUrl) {
              window.location.href = res.data.payUrl;
            }
          })
          .catch((err) => {
            this.$toast.clear();
            err.msg && this.$toast(err.msg);
          });
    },
    rechargePay() {
      let params = {
        id: this.query.id,
      };
      this.$toast.loading({
        message: "支付中...",
        forbidClick: true,
      });
      axios
          .post(api.rechargePay, params)
          .then((res) => {
            this.$toast.clear();
            this.$toast('购买成功！')
            this.getUserInfo();
            this.onClickLeft();
          })
          .catch((err) => {
            this.$toast.clear();
            err.msg && this.$toast(err.msg);
          });
    }
  },
}
</script>

<style scoped lang="less">

.welfare-list {
  padding: 15px 10px;
}

.welfare-list .item {
  background-color: #d3281d;
  border-radius: 12px;
  margin-bottom: 15px;
  padding: 15px 0px;
}

.welfare-list .item .title {
  padding-bottom: 15px;
  color: #1a1d27;
  font-size: 16px;
  font-weight: 550;
  text-align: center;
}

.welfare-list .item .ul {
  display: flex;
  align-items: center;
  justify-content: space-around;
  text-align: center;
}

.welfare-list .item .ul li {
  width: 33%;
}

.welfare-list .item .ul li+li {
  border-left: 1px solid #ffdeb6;
}

.welfare-list .item .pre {
  color: #FDE0B4;
  font-size: 16px;
  font-weight: 550;
  margin-bottom: 6px;
}



.welfare-list .item p {
  font-size: 14px;
  color: #7a726a;
}

.annius_S {
  text-align: center;
}

.annius_S button {
  background: linear-gradient(to right, #e32429, #e32429);
  border: none;
  margin: 20px auto auto;
  color: #fff;
  border-radius: 40px;
  width: 90%;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}

</style>
