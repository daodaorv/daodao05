/**
 * 枚举常量定义
 *
 * @description 统一管理所有枚举值和映射关系
 */

/**
 * 用户类型映射
 */
export const USER_TYPE_MAP: Record<string, string> = {
  customer: '普通用户',
  mobile_admin: '移动管理员',
  pc_admin: 'PC管理员'
} as const

/**
 * 用户状态映射
 */
export const USER_STATUS_MAP: Record<string, string> = {
  active: '正常',
  inactive: '禁用',
  pending: '待审核',
  suspended: '已冻结'
} as const

/**
 * 风险等级映射
 */
export const RISK_LEVEL_MAP: Record<string, string> = {
  high: '高风险',
  medium: '中风险',
  low: '低风险'
} as const

/**
 * 风险类型映射
 */
export const RISK_TYPE_MAP: Record<string, string> = {
  login: '登录风险',
  behavior: '行为风险',
  payment: '支付风险',
  credit: '信用风险'
} as const

/**
 * 风险状态映射
 */
export const RISK_STATUS_MAP: Record<string, string> = {
  pending: '待处理',
  processed: '已处理',
  ignored: '已忽略'
} as const

/**
 * 车辆状态映射
 */
export const VEHICLE_STATUS_MAP: Record<string, string> = {
  available: '可用',
  rented: '租用中',
  maintenance: '保养中',
  repair: '维修中',
  retired: '已退役'
} as const

/**
 * 车辆所有权类型映射
 */
export const VEHICLE_OWNERSHIP_TYPE_MAP: Record<string, string> = {
  self_owned: '自有',
  leased: '租赁',
  cooperative: '合作'
} as const

/**
 * 订单状态映射
 */
export const ORDER_STATUS_MAP: Record<string, string> = {
  pending: '待支付',
  paid: '已支付',
  confirmed: '已确认',
  in_progress: '进行中',
  completed: '已完成',
  cancelled: '已取消',
  refunded: '已退款'
} as const

/**
 * 支付状态映射
 */
export const PAYMENT_STATUS_MAP: Record<string, string> = {
  pending: '待支付',
  processing: '支付中',
  success: '支付成功',
  failed: '支付失败',
  refunded: '已退款',
  cancelled: '已取消'
} as const

/**
 * 支付方式映射
 */
export const PAYMENT_METHOD_MAP: Record<string, string> = {
  wechat: '微信支付',
  alipay: '支付宝',
  bank_card: '银行卡',
  cash: '现金',
  other: '其他'
} as const

/**
 * 性别映射
 */
export const GENDER_MAP: Record<string, string> = {
  male: '男',
  female: '女',
  unknown: '未知'
} as const

/**
 * 审核状态映射
 */
export const AUDIT_STATUS_MAP: Record<string, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝'
} as const

/**
 * 托管状态映射
 */
export const HOSTING_STATUS_MAP: Record<string, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝',
  active: '托管中',
  completed: '已完成',
  cancelled: '已取消'
} as const

/**
 * 提现状态映射
 */
export const WITHDRAWAL_STATUS_MAP: Record<string, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝',
  processing: '处理中',
  completed: '已完成',
  failed: '失败'
} as const

/**
 * 优惠券类型映射
 */
export const COUPON_TYPE_MAP: Record<string, string> = {
  discount: '折扣券',
  cash: '代金券',
  gift: '礼品券'
} as const

/**
 * 优惠券状态映射
 */
export const COUPON_STATUS_MAP: Record<string, string> = {
  unused: '未使用',
  used: '已使用',
  expired: '已过期'
} as const

/**
 * 保险状态映射
 */
export const INSURANCE_STATUS_MAP: Record<string, string> = {
  active: '有效',
  expired: '已过期',
  cancelled: '已取消'
} as const

/**
 * 违章状态映射
 */
export const VIOLATION_STATUS_MAP: Record<string, string> = {
  pending: '待处理',
  processing: '处理中',
  completed: '已处理',
  appealing: '申诉中'
} as const

/**
 * 保养类型映射
 */
export const MAINTENANCE_TYPE_MAP: Record<string, string> = {
  regular: '常规保养',
  major: '大保养',
  repair: '维修',
  inspection: '检查'
} as const

/**
 * 保养状态映射
 */
export const MAINTENANCE_STATUS_MAP: Record<string, string> = {
  scheduled: '已预约',
  in_progress: '进行中',
  completed: '已完成',
  cancelled: '已取消'
} as const

/**
 * 营地类型映射
 */
export const CAMPSITE_TYPE_MAP: Record<string, string> = {
  scenic: '景区营地',
  forest: '森林营地',
  lakeside: '湖畔营地',
  mountain: '山地营地',
  beach: '海滨营地',
  grassland: '草原营地'
} as const

/**
 * 营地设施映射
 */
export const CAMPSITE_FACILITY_MAP: Record<string, string> = {
  parking: '停车场',
  toilet: '卫生间',
  shower: '淋浴',
  electricity: '电源',
  water: '供水',
  wifi: 'WiFi',
  restaurant: '餐厅',
  shop: '商店'
} as const

/**
 * 旅游线路类型映射
 */
export const TOUR_TYPE_MAP: Record<string, string> = {
  self_drive: '自驾游',
  group: '跟团游',
  custom: '定制游'
} as const

/**
 * 旅游线路难度映射
 */
export const TOUR_DIFFICULTY_MAP: Record<string, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难'
} as const

/**
 * 权限类型映射
 */
export const PERMISSION_TYPE_MAP: Record<string, string> = {
  menu: '菜单权限',
  button: '按钮权限',
  api: 'API权限'
} as const

/**
 * 日志类型映射
 */
export const LOG_TYPE_MAP: Record<string, string> = {
  login: '登录日志',
  operation: '操作日志',
  error: '错误日志',
  system: '系统日志'
} as const

/**
 * 通知类型映射
 */
export const NOTIFICATION_TYPE_MAP: Record<string, string> = {
  system: '系统通知',
  order: '订单通知',
  payment: '支付通知',
  promotion: '促销通知'
} as const

/**
 * 通知状态映射
 */
export const NOTIFICATION_STATUS_MAP: Record<string, string> = {
  unread: '未读',
  read: '已读'
} as const
