export const GROUP_CHAT_URL = 'http://localhost:3000';
export const CUSTOME_SERVICE_CHAT_URL = 'http://localhost:3000';
// 服务器API
export const API_URL = 'https://api.zhonghuayangl.com';
//客服地址
export const CHAT_SERVICE_URL = 'http://kf.zhonghuayangl.com/im.htm?pid=2c9180918ffe3d8f01901234c570026d';

//申请提现类型
export const WithdrawalType = {
    BALANCE: 1,//余额
    REFERRAL: 2,//推荐奖励
    FP_BONUS: 3,//扶贫基金
    CASH: 4,//现金
};

export const PaymentType = {
    ALIPAY: 2,
    WECHAT_PAY: 1,
    UNIONPAY: 3,
    QQ_PAY: 4,
    BANK_CARD: 5,
    BALANCE_PAY: 7
};
//提现类型
export const NType = {
    BALANCE: 1,//余额
    REWARD: 2,//推荐奖
    POVERTY_FUND: 3,//扶贫基金
    CASH: 4,//现金(注册赠送)
};

export function getNTypeLabel(type) {
    switch (type) {
        case NType.BALANCE:
            return '余额';
        case NType.REWARD:
            return '推荐奖';
        case NType.POVERTY_FUND:
            return '扶贫基金';
        case NType.CASH:
            return '现金';
        default:
            return '未知';
    }
}

//审核状态
export const ReviewStatus = {
    PENDING: 0,
    PAID: 1,
    PAYMENT_FAILED: 2,
};

export function getReviewStatusLabel(status) {
    switch (status) {
        case 0:
            return '审核中';
        case 1:
            return '提现中';
        case 2:
            return '已打款';
        case 3:
            return '打款失败';
    }
}

export const MoldTypes = {
    BALANCE: 1,
    POVERTY_ALLEVIATION_FUND: 2,
    CREDIT_CARD: 3,
    GOLD: 4,
    EQUITY: 5
};

export function getMoldTypesLabel(status) {
    switch (status) {
        case MoldTypes.BALANCE:
            return '余额';
        case MoldTypes.POVERTY_ALLEVIATION_FUND:
            return '扶贫金';
        case MoldTypes.CREDIT_CARD:
            return '信用卡';
        case MoldTypes.GOLD:
            return '黄金';
        case MoldTypes.EQUITY:
            return '股权';
        default:
            return '未知';
    }
}

export const EnumOperations = {
    INCREASE: 1,
    DECREASE: 2
};

export const FundType = {
    CASH: 1,
    BALANCE: 2,
    EQUITY: 3,
    REFERRAL_BONUS: 4,
    BALANCE2: 5,
    DIVIDEND_STOCK: 6
}

export function getFundTypeLabel(status) {
    switch (status) {
        case FundType.CASH:
            return '现金';
        case FundType.BALANCE:
            return '余额';
        case FundType.EQUITY:
            return '股权';
        case FundType.REFERRAL_BONUS:
            return '推荐奖';
        case FundType.BALANCE2:
            return '余额';
        case FundType.DIVIDEND_STOCK:
            return '分红股';
        default:
            return '未知';
    }
}
