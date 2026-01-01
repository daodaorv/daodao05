/**
 * 业务常量
 */

export const BUSINESS = {
  // 提现
  MIN_WITHDRAW_AMOUNT: 100, // 最小提现金额（元）

  // 请求超时
  REQUEST_TIMEOUT: 10000, // 请求超时时间（毫秒）

  // 分页
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,

  // 租期
  MIN_RENTAL_DAYS: 1,
  MAX_RENTAL_DAYS: 90,

  // 押金
  DEFAULT_DEPOSIT: 3000, // 默认押金（元）

  // 图片上传
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png'],
} as const;

export const UI = {
  // 状态栏高度（默认值，实际会动态获取）
  DEFAULT_STATUS_BAR_HEIGHT: 44,

  // 导航栏高度
  NAVBAR_HEIGHT: 44,

  // 底部安全区高度
  SAFE_AREA_BOTTOM: 34,

  // 动画时长
  ANIMATION_DURATION: 300, // 毫秒

  // 防抖延迟
  DEBOUNCE_DELAY: 300, // 毫秒

  // Toast 显示时长
  TOAST_DURATION: 2000, // 毫秒
} as const;
