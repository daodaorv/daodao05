/**
 * 支付配置
 */

export const paymentConfig = {
  // 是否使用Mock支付
  useMock: true,

  // 支付超时时间（分钟）
  timeout: 15,

  // 支持的支付方式
  methods: {
    wxpay: {
      enabled: true,
      name: '微信支付',
      icon: 'wechat',
      // 真实支付时需要配置
      // appId: 'wx...',
      // mchId: '...'
    },
    alipay: {
      enabled: true,
      name: '支付宝支付',
      icon: 'alipay'
    },
    balance: {
      enabled: true,
      name: '余额支付',
      icon: 'wallet'
    }
  },

  // 余额支付配置
  balance: {
    // 是否需要支付密码
    requirePassword: false, // 暂时不需要
    // 单笔限额
    singleLimit: 50000,
    // 日限额
    dailyLimit: 100000
  }
};

export default paymentConfig;
