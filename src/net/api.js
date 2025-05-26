export default {
  login: "/api/auth/login", //登录
  register: "/api/auth/register", //注册
  navList: "/api/navigation/list", //菜单
  getBanner: "/api/index/banner", //获取banner
  signIn: "/api/user/sign", //用户签到
  systemInfo: "/api/index/configInfo", //获取系统信息
  userInfo: "/api/user/userInfo", //获取用户信息
  realAuth: "/api/user/identify", //实名认证
  identifyInfo: "/api/user/identifyLog", //实名认证信息获取
  bindBankCard: "/api/user/addBank", //添加或修改银行卡
  bankCardInfo: "/api/user/myBank", //获取银行卡信息
  teamList: "/api/user/teamList", //团队列表
  uploadAvatar: "/api/user/updateHeadImg", //上传头像
  uploadImage: "/api/basic/upload", //上传图片
  balanceLog: "/api/assets/moneyRecord", //资金明细
  newsList: "/api/index/notice", //新闻列表
  newsDetails: "/api/index/noticeDetail", //新闻详情
  userWallet: "/api/assets/myAssets", //我的资产
  drawNum: "/api/turntable/prizes", //剩余抽奖次数
  luckNum: "/api/turntable/join", //抽奖
  drawRecord: "/api/turntable/joinLog", //抽奖记录
  userWithdrawal: "/api/assets/withdraw", //用户提现
  withdrawalRecordList: "/api/assets/withdrawLog", //提现记录
  myHouse: "/api/user/my-house", //我的房产
  receiveList: "/api/user/myInviteAward", //我的邀请奖励数据
  levelList: "/api/user/levelList", //工会数据
  receiveAward: "/api/user/getInviteAward", //领取奖励
  receiveNote: "/api/user/receive-note", //领取本票
  cardAddressList: "/api/user/card-address-list ", //卡包
  welfareList: "/api/ido/idoList", //项目列表
  balancePay: "/api/pay/pay", //支付
  balanceRecharge: "/api/pay/recharge", //余额充值
  rechargePay: "/api/ido/joinIdo", //余额支付
  buyBonusList: "/api/ido/myInvestList", //项目列表
  reviceReg: "/api/user/receive-reg", //注册领取奖励
  addressList: "/api/user/myAddress ", //地址列表
  addressDetail: "/api/address/detail", //地址详情
  addAddress: "/api/address/add", //添加地址
  editAddress: "/api/address/edit", //编辑地址
  deleteAddress: "/api/address/del", //删除地址
  modifyPwd: "/api/auth/passwordByIdCardNo", //修改密码
  siteCode: "/api/auth/captchaImg", //验证码
  addOrder: "/api/pay/add-order", //生成订单
  uploadPaymentImg: "/api/pay/payment", //上传支付凭证
  awardList: "/api/turntable/awardList", //中奖记录
  getAward: "/api/turntable/getAward", //领取中奖奖励
  myAddress: "/api/user/myAddress", //我的地址
  addGoldAddress: "/api/user/addAddress", //添加/修改地址
  activeInvite: "/api/user/activeInvite", //邀请激活
  inviteProvinceUserList: "/api/user/inviteProvinceUserList", //邀请省份明细
  myInvestment: "/api/assets/myInvestment", //投资中心
  editBankOrderSec: "/api/user/editBankOrderSec", //黑金卡申请
  myBankOrder: "/api/user/myBankOrder", //我的黑金卡信息
  user_settled_apply: "/api/user/user_settled_apply", //资产清算
  myInviteVipCardAward: "/api/user/myInviteVipCardAward", //我的黑金卡直推奖励数据
  getVipInviteAward: "/api/user/getVipInviteAward", //领取邀请黑金卡奖励
  user_settled_apply_record: "/api/user/user_settled_apply_record", //申请记录
  assetList: "/api/asset/list", //资产列表
  assetTransfer: "/api/asset/transfer", //资产转移
  assetAdd: "/api/asset/add", //资产新增
  getMyBank: "/api/user/getMyBank", //领取卡
  mergeBankCard: "/api/user/mergeBankCard", //合并银行卡
  updateUserInfo: "/api/user/updateUserInfo", //绑定微信或支付宝
  editBankOrder: "/api/user/editBankOrder", //修改银行卡订单收货信息
  receiveMemberCertificate: "/api/user/receiveMemberCertificate", //领取会员凭证
  transIn: "/api/assets/bank_wallet_transfer", //转入
  myCoupon: "/api/turntable/myCoupon", //我的优惠券
  // 获取国债详情
  getBondDetail: '/api/ido/idoDetail',

  // 获取国债走势数据
  getBondTrend: '/api/ido/trendList',

  // 我的化债申请
  myDebtApply: '/api/user/myDebtApply',
  //添加/修改化债申请
  addDebtApply: '/api/user/addDebtApply',
  //购买光伏或机器人
  buy: '/api/pay/buy',
  //我的邀请银行卡数据
  myVipCardAward: '/api/user/myVipCardAward',
  //领取银行卡
  getVipCardAward: '/api/user/getVipCardAward',
  //助农补贴列表
  myInviteVipAward: '/api/user/myInviteVipAward',
  //领取助农补贴
  getInviteVipAward: '/api/user/getInviteVipAward',
  //签到天数
  sign_days: '/api/user/sign_days',
    //房产列表
  myHouseList: '/api/user/myHouseList',
  //领取房产
  fetchHouse: '/api/user/getHouseSec',
  //我的车产列表
  myCarList: '/api/user/myCarList',
  //领取车辆
  getCar: '/api/user/getCar',
  //项目详情
  idoDetail: '/api/ido/idoDetail',
  //现金额度转入银行卡额度
  exchange: '/api/assets/exchange',
  //房产详情
  houseDetail: '/api/user/houseDetail',
  //车辆详情
  carDetail: '/api/user/carDetail',
  stock: '/api/index/stock',
  day_stock_log: '/api/index/day_stock_log',
  member_apply: '/api/user/member_apply',
  myHouseListSec: '/api/user/myHouseListSec',
  myHouseOrderList: '/api/user/myHouseOrderList',
  myStock: '/api/user/myStock',
  editHouseOrder: '/api/user/editHouseOrder',
  myVipCardOrder: '/api/user/myVipCardOrder',
  vipCardDetail: '/api/user/vipCardDetail',
  houseFreeTransfer: '/api/user/houseFreeTransfer',
  freeActiveVipCard: '/api/user/freeActiveVipCard',
  houseFreeFixAsset: '/api/user/houseFreeFixAsset',
  myGoldList: '/api/ido/myGoldList',
  mailGold: '/api/ido/mailGold',
};
