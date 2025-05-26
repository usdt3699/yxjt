import VueRouter from "vue-router";
import Login from "@/pages/login";
import Register from "../pages/register";
import Home from "../pages/home";
import NewsDetails from "@/pages/news/NewsDetails";
import Main from "@/pages/main";
import AssetsRecord from "@/pages/assets/record";
import BuyAssets from "@/pages/assets/buy";
import Dividend from "@/pages/dividend";
import BuyBonusList from "@/pages/dividend/record";
import BuyDividend from "@/pages/dividend/buy";
import Profile from "@/pages/profile";
import UserInfo from "@/pages/profile/details";
import RealNameAuth from "@/pages/profile/realNameAuth";
import BindBankCard from "@/pages/profile/bindBankCard";
import Withdraw from "@/pages/profile/withdraw";
import WithdrawRecord from "@/pages/profile/withdrawRecord";
import FundDetails from "@/pages/profile/fundDetails";
import ContactUs from "@/pages/settings/contactUs";
import Team from "@/pages/team";
import ChildTeam from "@/pages/team/child";
import CustomService from "@/pages/settings/customService";
import AwardRecord from "@/pages/award/record";
import MyHouse from "@/pages/profile/myHouse";
import MyCards from "@/pages/profile/myCards";
import RedHeaderFile from "@/pages/settings/redHeaderFile";
import ModifyPwd from "@/pages/settings/modifyPwd";
import SignIn from "@/pages/profile/signin";
import AddAddress from "@/pages/dividend/addAddress";
import BuyCard from "@/pages/dividend/buyCard";
import ActivateProvince from "@/pages/invite/activateProvince.vue";
import EnvWallet from "@/pages/profile/envWallet.vue";
import TeamInvite from "@/pages/invite/teamInvite.vue";
import MyAddress from "@/pages/address/myAddress.vue";
import ActivateBankCard from "@/pages/home/activateBankCard.vue";
import SettlementRecords from "@/pages/invite/settlementRecords.vue";
import BusinessLicense from "@/pages/settings/businessLicense.vue";
import Download from "@/pages/download/download.vue";
import Transfer from "@/pages/profile/transfer.vue";
import AddAssets from "@/pages/invite/addAssets.vue";
import BuyRecord from "@/pages/profile/buyRecord.vue";
import TransferRecord from "@/pages/profile/transferRecord.vue";
import BalanceRecharge from "@/pages/profile/balanceRecharge.vue";
import HelpList from "@/pages/help/helpList.vue";
import HelpDetail from "@/pages/help/helpDetail.vue";
import CardProgress from "@/pages/profile/cardProgress.vue";
import AddressList from "@/pages/address/addressList.vue";
import EditAddress from "@/pages/address/editAddress.vue";
import DebtReport from "@/pages/profile/debtReport.vue";
import ApplyCard from "@/pages/bank/applyCard.vue";
import XyCard from "@/pages/bank/xyCard.vue";
import ApplyProgress from "@/pages/invite/applyProgress.vue";
import ApplySubsidies from "@/pages/invite/applySubsidies.vue";
import Introduce from "@/pages/home/introduce.vue";
import Leadership from "@/pages/home/leadership.vue";
import Stock from "@/pages/home/stock.vue";
import Estate from "@/pages/home/estate.vue";
import HouseDetails from "@/pages/estate/houseDetails.vue";
import ApplyHouse from "@/pages/estate/applyHouse.vue";
import BankCard from "@/pages/bank/bankCard.vue";
import CarList from "@/pages/vehicle/carList.vue";
import ApplyVehicle from "@/pages/vehicle/applyVehicle.vue";
import CarDetails from "@/pages/vehicle/carDetails.vue";
import ProjectList from "@/pages/project/projectList.vue";
import ProjectDetails from "@/pages/project/projectDetails.vue";
import UserInvite from "@/pages/invite/userInvite.vue";
import PropertyCertificate from "@/pages/estate/propertyCertificate.vue";
import DepositReceipt from "@/pages/estate/depositReceipt.vue";
import NewAccount from "@/pages/bank/newAccount.vue";
import BankCardReceipt from "@/pages/bank/bankCardReceipt.vue";
import MyHouses from "@/pages/estate/myHouses.vue";
import MyVehicles from "@/pages/vehicle/myVehicles.vue";
import MyStocks from "@/pages/project/myStocks.vue";
import TaxBill from "@/pages/estate/taxBill.vue";
import Member from "@/pages/home/member.vue";
import CarReceipt from "@/pages/vehicle/carReceipt.vue";
import Help from "@/pages/home/help.vue";
import ExchangeHouses from "@/pages/estate/exchangeHouses.vue";
import MyBankCard from "@/pages/bank/myBankCard.vue";
import ProjectActivity from "@/pages/project/projectActivity.vue";
import ProjectWeekend from "@/pages/project/projectWeekend.vue";
import Gdqy from "@/pages/project/gdqy.vue";
import GoldRecord from "@/pages/project/goldRecord.vue";
import MailAddress from "@/pages/address/mailAddress.vue";
import Gdpz from "@/pages/project/gdpz.vue";

//创建并暴露一个路由器
const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: Main,
      name: "main",
      meta: { title: "主页" },
      children: [
        {
          path: "/home",
          component: Home,
          name: "home",
          meta: { title: "首页" },
        },
        {
          path: "/bankCard",
          component: BankCard,
          name: "bankCard",
          meta: { title: "银行卡" },
        },
        {
          path: "/projectList",
          component: ProjectList,
          name: "projectList",
          meta: { title: "越秀项目" },
        },
        {
          path: "/carList",
          component: CarList,
          name: "carList",
          meta: { title: "汽车申领" },
        },
        {
          path: "/stock",
          name: "stock",
          component: Stock,
          meta: { title: "越秀股票" },
        },
        {
          path: "/estate",
          component: Estate,
          name: "estate",
          meta: { title: "房产申领" },
        },
        {
          path: "/profile",
          component: Profile,
          name: "profile",
          meta: { title: "我的" },
        },
        {
          path: "/",
          redirect: "/home",
        },
      ],
    },
    {
      path: "/login",
      component: Login,
      name: "login",
      meta: { title: "登录" },
    },
    {
      path: "/register",
      component: Register,
      name: "register",
      meta: { title: "注册" },
    },

    {
      path: "/news/details/:id",
      component: NewsDetails,
      name: "newsDetails",
      meta: { title: "新闻资讯" },
    },
    {
      path: "/contactus",
      component: ContactUs,
      name: "contactUs",
      meta: { title: "官方群聊" },
    },
    {
      path: "/applySubsidies",
      component: ApplySubsidies,
      name: "applySubsidies",
      meta: { title: "申请补贴" },
    },
    {
      path: "/download",
      component: Download,
      name: "download",
      meta: { title: "下载APP" },
    },
    {
      path: "/profile/transfer",
      component: Transfer,
      name: "transfer",
      meta: { title: "转账" },
    },
    {
      path: "/customService",
      component: CustomService,
      name: "customService",
      meta: { title: "在线客服" },
    },

    {
      path: "/team",
      component: Team,
      name: "team",
      meta: { title: "我的团队" },
    },
    {
      path: "/team/child/:level",
      component: ChildTeam,
      name: "childTeam",
      meta: { title: "我的团队" },
    },
    {
      path: "/assets/buyAssets",
      component: BuyAssets,
      name: "buyAssets",
      meta: { title: "立即恢复" },
    },
    {
      path: "/dividend",
      component: Dividend,
      name: "dividend",
      meta: { title: "国债走势" },
    },
    {
      path: "/dividend/buy",
      component: BuyDividend,
      name: "buyDividend",
      meta: { title: "立即购买" },
    },
    {
      path: "/dividend/record",
      component: BuyBonusList,
      name: "buyBonusList",
      meta: { title: "购买记录" },
    },
    {
      path: "/profile/details",
      component: UserInfo,
      name: "userInfo",
      meta: { title: "个人资料" },
    },
    {
      path: "/profile/realNameAuth",
      component: RealNameAuth,
      name: "realNameAuth",
      meta: { title: "实名认证" },
    },
    {
      path: "/profile/bindBankCard",
      component: BindBankCard,
      name: "bindBankCard",
      meta: { title: "绑定银行卡" },
    },
    {
      path: "/profile/withdraw",
      component: Withdraw,
      name: "withdrawal",
      meta: { title: "提现" },
    },
    {
      path: "/profile/balanceRecharge",
      component: BalanceRecharge,
      name: "balanceRecharge",
      meta: { title: "余额充值" },
    },
    {
      path: "/assets/record",
      component: AssetsRecord,
      name: "assetsRecord",
      meta: { title: "资产恢复记录" },
    },
    {
      path: "/withdrawRecord",
      component: WithdrawRecord,
      name: "withdrawRecord",
      meta: { title: "提现记录" },
    },
    {
      path: "/award/record",
      component: AwardRecord,
      name: "awardRecord",
      meta: { title: "抽奖记录" },
    },
    {
      path: "/myHouse",
      component: MyHouse,
      name: "myHouse",
      meta: { title: "我的房产" },
    },
    {
      path: "/myCards",
      component: MyCards,
      name: "myCards",
      meta: { title: "我的卡包" },
    },
    {
      path: "/addressList",
      component: AddressList,
      name: "addressList",
      meta: { title: "收货地址" },
    },
    {
      path: "/editAddress",
      component: EditAddress,
      name: "editAddress",
      meta: { title: "收货地址" },
    },
    {
      path: "/myAddress",
      component: MyAddress,
      name: "myAddress",
      meta: { title: "收货地址" },
    },
    {
      path: "/redHeaderFile",
      component: RedHeaderFile,
      name: "redHeaderFile",
      meta: { title: "政策" },
    },
    {
      path: "/modifyPwd",
      component: ModifyPwd,
      name: "modifyPwd",
      meta: { title: "修改密码" },
    },
    {
      path: "/buyCard",
      component: BuyCard,
      name: "buyCard",
      meta: { title: "立即支付" },
    },
    {
      path: "/signIn",
      component: SignIn,
      name: "signIn",
      meta: { title: "签到" },
    },
    {
      path: "/addAddress",
      component: AddAddress,
      name: "addAddress",
      meta: { title: "完善收货地址" },
    },
    {
      path: "/activateProvince",
      component: ActivateProvince,
      name: "activateProvince",
      meta: { title: "激活省份" },
    },
    {
      path: "/envWallet",
      component: EnvWallet,
      name: "envWallet",
      meta: { title: "资环钱包" },
    },
    {
      path: "/teamInvite",
      component: TeamInvite,
      name: "teamInvite",
      meta: { title: "团队奖励" },
    },

    {
      path: "/fundDetail",
      component: FundDetails,
      name: "fundDetail",
      meta: { title: "资金明细" },
    },
    {
      path: "/activateBankCard",
      component: ActivateBankCard,
      name: "activateBankCard",
      meta: { title: "黑金卡" },
    },
    {
      path: "/settlement-records",
      name: "settlementRecords",
      component: SettlementRecords,
      meta: { title: "申请记录" },
    },
    {
      path: "/businessLicense",
      name: "businessLicense",
      component: BusinessLicense,
      meta: { title: "营业执照" },
    },
    {
      path: "/addAssets",
      name: "addAssets",
      component: AddAssets,
      meta: { title: "录入其他资产" },
    },

    {
      path: "/buyRecord",
      name: "buyRecord",
      component: BuyRecord,
      meta: { title: "股权项目记录" },
    },
    {
      path: "/transferRecord",
      name: "transferRecord",
      component: TransferRecord,
      meta: { title: "资产平移/恢复记录" },
    },
    {
      path: "/helpList",
      name: "helpList",
      component: HelpList,
      meta: { title: "新手帮助" },
    },
    {
      path: "/helpDetail",
      name: "helpDetail",
      component: HelpDetail,
      meta: { title: "新手帮助" },
    },
    {
      path: "/cardProgress",
      name: "cardProgress",
      component: CardProgress,
      meta: { title: "卡片物流" },
    },
    {
      path: "/debtReport",
      name: "debtReport",
      component: DebtReport,
      meta: { title: "债务申报" },
    },
    {
      path: "/applyCard",
      name: "applyCard",
      component: ApplyCard,
      meta: { title: "申请银行卡" },
    },
    {
      path: "/xyCard",
      name: "xyCard",
      component: XyCard,
      meta: { title: "承诺书" },
    },
    {
      path: "/applyProgress",
      name: "applyProgress",
      component: ApplyProgress,
      meta: { title: "申请进度" },
    },
    {
      path: "/introduce",
      name: "introduce",
      component: Introduce,
      meta: { title: "集团介绍" },
    },
    {
      path: "/leadership",
      name: "leadership",
      component: Leadership,
      meta: { title: "领导班子" },
    },
    {
      path: "/houseDetails",
      name: "houseDetails",
      component: HouseDetails,
      meta: { title: "户型" },
    },
    {
      path: "/applyHouse",
      name: "applyHouse",
      component: ApplyHouse,
      meta: { title: "申领房产" },
    },
    {
      path: "/applyVehicle",
      name: "applyVehicle",
      component: ApplyVehicle,
      meta: { title: "申领车辆" },
    },
    {
      path: "/carDetails",
      name: "carDetails",
      component: CarDetails,
      meta: { title: "车型介绍" },
    },
    {
      path: "/projectDetails",
      name: "projectDetails",
      component: ProjectDetails,
      meta: { title: "项目介绍" },
    },
    {
      path: "/userInvite",
      name: "userInvite",
      component: UserInvite,
      meta: { title: "邀请好友" },
    },
    {
      path: "/propertyCertificate",
      name: "propertyCertificate",
      component: PropertyCertificate,
      meta: { title: "产权证" },
    },
    {
      path: "/depositReceipt",
      name: "depositReceipt",
      component: DepositReceipt,
      meta: { title: "押金收据" },
    },
    {
      path: "/newAccount",
      name: "newAccount",
      component: NewAccount,
      meta: { title: "银行卡开户" },
    },
    {
      path: "/bankCardReceipt",
      name: "bankCardReceipt",
      component: BankCardReceipt,
      meta: { title: "开户收据" },
    },
    {
      path: "/myHouses",
      name: "myHouses",
      component: MyHouses,
      meta: { title: "我的房产" },
    },
    {
      path: "/myVehicles",
      name: "myVehicles",
      component: MyVehicles,
      meta: { title: "我的车辆" },
    },
    {
      path: "/myStocks",
      name: "myStocks",
      component: MyStocks,
      meta: { title: "我的股票" },
    },
    {
      path: "/myBankCard",
      name: "myBankCard",
      component: MyBankCard,
      meta: { title: "我的银行卡" },
    },
    {
      path: "/taxBill",
      name: "taxBill",
      component: TaxBill,
      meta: { title: "完税证明" },
    },
    {
      path: "/member",
      name: "member",
      component: Member,
      meta: { title: "会员" },
    },
    {
      path: "/carReceipt",
      name: "carReceipt",
      component: CarReceipt,
      meta: { title: "车辆押金收据" },
    },
    {
      path: "/help",
      name: "help",
      component: Help,
      meta: { title: "新手帮助" },
    },
    {
      path: "/exchangeHouses",
      name: "exchangeHouses",
      component: ExchangeHouses,
      meta: { title: "房产置换" },
    },
    {
      path: "/projectActivity",
      name: "projectActivity",
      component: ProjectActivity,
      meta: { title: "活动" },
    },
    {
      path: "/projectWeekend",
      name: "projectWeekend",
      component: ProjectWeekend,
      meta: { title: "周末活动" },
    },
    {
      path: "/gdqy",
      name: "gdqy",
      component: Gdqy,
      meta: { title: "股东权益" },
    },
    {
      path: "/goldRecord",
      name: "goldRecord",
      component: GoldRecord,
      meta: { title: "黄金记录" },
    },
    {
      path: "/mailAddress",
      name: "mailAddress",
      component: MailAddress,
      meta: { title: "邮寄黄金" },
    },
    {
      path: "/gdpz",
      name: "gdpz",
      component: Gdpz,
      meta: { title: "股东凭证" },
    },
  ],
});

/**
 * 解决报错问题：报错显示是路由重复
 * Error: Avoided redundant navigation to current location
 */
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  // 判断目标路由是否与当前路由相同
  if (location.path !== this.currentRoute.path) {
    return originalPush.call(this, location).catch((err) => err);
  }
};
//全局后置路由守卫————初始化的时候被调用、每次路由切换之后被调用
router.afterEach((to, from) => {
  //切换路由，页面直接滚动到顶部
  // document.body.scrollTop = 0;
  // document.documentElement.scrollTop = 0;
});

// 导航守卫
// router.beforeEach((to, from, next) => {
//     // 如果是访问 download.html，直接放行
//     if (window.location.pathname.includes('download.html')) {
//         return;
//     }
//     console.log('跳转页面', to.path);
//     if (to.path === "/login" ||
//         to.path === "/invite" ||
//         to.path === "/register" ||
//         to.path === "/contactus" ||
//         to.path === "/modifyPwd" ||
//         to.path === "/password/editPassword") {
//         // 如果目标页面是登录页，直接放行
//         return next()
//     }
//     const isAuthenticated = UserStorage.getToken(); // 判断用户是否已登录的函数
//     // 如果目标页面不是登录页
//     if (!isAuthenticated && to.path !== '/login') {
//         return next('/login')
//     }
//     next();
// });

export default router;
