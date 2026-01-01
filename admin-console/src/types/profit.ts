/**
 * 分润管理类型定义
 */

// ==================== 枚举定义 ====================

/**
 * 产品类型
 */
export enum ProductType {
  VEHICLE_RENTAL = 'vehicle_rental', // 房车租赁
  CAMPSITE = 'campsite', // 营地产品
  TOUR = 'tour', // 房车旅游
}

/**
 * 托管类型
 */
export enum HostingType {
  OWN_CAR = 'own_car', // 自有车托管
  NEW_CAR = 'new_car', // 购车托管
  CROWDFUNDING = 'crowdfunding', // 众筹托管
}

/**
 * 用户角色类型
 */
export enum UserRoleType {
  NORMAL_USER = 'normal_user', // 普通用户
  PLUS_MEMBER = 'plus_member', // PLUS会员
  OWN_CAR_OWNER = 'own_car_owner', // 自有车托管车主
  NEW_CAR_OWNER = 'new_car_owner', // 购车托管车主
  CROWDFUNDING_OWNER = 'crowdfunding_owner', // 众筹托管车主
  EMPLOYEE = 'employee', // 平台员工
  PARTNER = 'partner', // 加盟商
}

/**
 * 分润状态
 */
export enum ProfitStatus {
  PENDING = 'pending', // 待结算
  CALCULATED = 'calculated', // 已计算
  PAID = 'paid', // 已支付
  FROZEN = 'frozen', // 已冻结（风控）
  CANCELLED = 'cancelled', // 已取消
}

/**
 * 提现状态
 */
export enum WithdrawalStatus {
  PENDING = 'pending', // 待审核
  APPROVED = 'approved', // 已通过
  REJECTED = 'rejected', // 已拒绝
  PROCESSING = 'processing', // 处理中
  COMPLETED = 'completed', // 已完成
  FAILED = 'failed', // 失败
}

/**
 * 推广级别
 */
export enum PromotionLevel {
  LEVEL_1 = 1, // 一级推广
  LEVEL_2 = 2, // 二级推广
}

/**
 * 风险等级
 */
export enum RiskLevel {
  LOW = 'low', // 低风险
  MEDIUM = 'medium', // 中风险
  HIGH = 'high', // 高风险
  CRITICAL = 'critical', // 严重风险
}

/**
 * 风控动作
 */
export enum RiskAction {
  PASS = 'pass', // 通过
  REVIEW = 'review', // 人工审核
  FREEZE = 'freeze', // 冻结分润
  REJECT = 'reject', // 拒绝订单
}

// ==================== 推广分润相关 ====================

/**
 * 推广关系
 */
export interface PromotionRelation {
  id: string
  userId: string // 被推广用户ID
  userName: string // 被推广用户名称
  level1PromoterUserId?: string // 一级推广者ID
  level1PromoterUserName?: string // 一级推广者名称
  level2PromoterUserId?: string // 二级推广者ID
  level2PromoterUserName?: string // 二级推广者名称
  profitAmount?: number // 分润金额
  createdAt: string // 建立时间
}

/**
 * 推广分润配置
 */
export interface PromotionProfitConfig {
  id: string
  productType: ProductType // 产品类型
  level1Ratio: number // 一级推广佣金比例（%）
  level2Ratio: number // 二级推广佣金比例（%）
  plusMemberDirectReward: number // PLUS会员直推奖励（元）
  plusMemberAssistReward: number // PLUS会员助力奖励（元）
  milestoneRewards: MilestoneReward[] // 累计推广门槛奖励
  enabled: boolean // 是否启用
  updatedAt: string
}

/**
 * 累计推广门槛奖励
 */
export interface MilestoneReward {
  orderCount: number // 累计有效订单数
  reward: number // 奖励金额（元）
}

/**
 * 推广分润记录
 */
export interface PromotionProfitRecord {
  id: string
  orderId: string // 订单ID
  orderNo: string // 订单号
  productType: ProductType // 产品类型
  orderAmount: number // 订单金额
  orderProfit: number // 订单利润
  promoterUserId: string // 推广者ID
  promoterUserName: string // 推广者名称
  promotionLevel: PromotionLevel // 推广级别
  profitRatio: number // 分润比例（%）
  profitAmount: number // 分润金额
  status: ProfitStatus // 分润状态
  isPlusMemberReward: boolean // 是否PLUS会员奖励
  createdAt: string
  paidAt?: string
}

// ==================== 房车租赁订单分润相关 ====================

/**
 * 托管车主分润配置
 */
export interface HostingProfitConfig {
  id: string
  hostingType: HostingType // 托管类型
  baseRatio: number // 基础分成比例（%）
  performanceBonus: PerformanceBonus[] // 绩效加成
  subsidyRules: SubsidyRule[] // 补贴规则
  enabled: boolean
  updatedAt: string
}

/**
 * 绩效加成
 */
export interface PerformanceBonus {
  metric: string // 指标名称（如：满意度、出租率）
  threshold: number // 阈值
  bonusRatio: number // 加成比例（%）
}

/**
 * 补贴规则
 */
export interface SubsidyRule {
  hostingType: HostingType // 托管类型
  startDate: string // 开始日期（MM-DD）
  endDate: string // 结束日期（MM-DD）
  minMonthlyProfit: number // 最低月分润（元）
  description: string // 说明
}

/**
 * 托管车主分润记录
 */
export interface HostingProfitRecord {
  id: string
  orderId: string
  orderNo: string
  vehicleId: string // 车辆ID
  vehicleName: string // 车辆名称
  ownerId: string // 车主ID
  ownerName: string // 车主名称
  hostingType: HostingType // 托管类型
  orderAmount: number // 订单金额
  directCost: number // 直接成本
  orderProfit: number // 订单利润
  baseRatio: number // 基础分成比例
  performanceBonus: number // 绩效加成
  finalRatio: number // 最终分成比例
  profitAmount: number // 分润金额
  subsidyAmount: number // 补贴金额
  totalAmount: number // 总金额
  status: ProfitStatus
  createdAt: string
  paidAt?: string
}

// ==================== 营地产品分润相关 ====================

/**
 * 营地合作类型
 */
export enum CampsiteCooperationType {
  GROUND_COOPERATION = 'ground_cooperation', // 地面合作
  VENUE_RENTAL = 'venue_rental', // 场地租赁
}

/**
 * 营地分润配置
 */
export interface CampsiteProfitConfig {
  id: string
  cooperationType: CampsiteCooperationType // 合作类型
  baseRatio: number // 基础分成比例（%）
  bundleBonus: number // 捆绑销售加成（%）
  enabled: boolean
  updatedAt: string
}

/**
 * 营地分润记录
 */
export interface CampsiteProfitRecord {
  id: string
  orderId: string
  orderNo: string
  campsiteId: string // 营地ID
  campsiteName: string // 营地名称
  ownerId: string // 业主ID
  ownerName: string // 业主名称
  cooperationType: CampsiteCooperationType
  orderAmount: number
  directCost: number
  orderProfit: number
  baseRatio: number
  bundleBonus: number // 捆绑销售加成
  finalRatio: number
  profitAmount: number
  isBundled: boolean // 是否捆绑销售
  bundledOrderId?: string // 捆绑的订单ID
  status: ProfitStatus
  createdAt: string
  paidAt?: string
}

// ==================== 房车旅游产品分润相关 ====================

/**
 * 旅游产品类型
 */
export enum TourProductType {
  SELF_DRIVE = 'self_drive', // 自驾线路
  BUTLER_ROUTE = 'butler_route', // 管家路线
}

/**
 * 旅游分润配置
 */
export interface TourProfitConfig {
  id: string
  productType: TourProductType // 产品类型
  baseRatio: number // 基础分成比例（%）
  satisfactionBonus: SatisfactionBonus[] // 满意度加成
  crowdfundingRatio: number // 众筹参与者分成比例（%）
  enabled: boolean
  updatedAt: string
}

/**
 * 满意度加成
 */
export interface SatisfactionBonus {
  minRating: number // 最低评分
  bonusRatio: number // 加成比例（%）
}

/**
 * 旅游分润记录
 */
export interface TourProfitRecord {
  id: string
  orderId: string
  orderNo: string
  tourId: string // 旅游产品ID
  tourName: string // 旅游产品名称
  providerId: string // 提供者ID（导游、司机等）
  providerName: string // 提供者名称
  productType: TourProductType
  orderAmount: number
  directCost: number
  orderProfit: number
  baseRatio: number
  satisfactionBonus: number // 满意度加成
  finalRatio: number
  profitAmount: number
  rating?: number // 评分
  isCrowdfunding: boolean // 是否众筹
  crowdfundingRecords?: CrowdfundingProfitRecord[] // 众筹分润记录
  status: ProfitStatus
  createdAt: string
  paidAt?: string
}

/**
 * 众筹分润记录
 */
export interface CrowdfundingProfitRecord {
  userId: string // 众筹参与者ID
  userName: string // 众筹参与者名称
  investmentRatio: number // 出资比例（%）
  profitAmount: number // 分润金额
}

// ==================== 通用功能相关 ====================

/**
 * 分润计算日志
 */
export interface ProfitCalculationLog {
  id: string
  orderId: string
  orderNo: string
  productType: ProductType
  orderAmount: number
  directCost: number
  orderProfit: number
  profitRecords: ProfitDistribution[] // 分润分配明细
  platformProfit: number // 平台利润
  totalDistributed: number // 总分配金额
  isBalanced: boolean // 是否平衡
  calculatedAt: string
  appliedRules: string[] // 应用的规则说明
}

/**
 * 分润分配明细
 */
export interface ProfitDistribution {
  recipientId: string // 接收者ID
  recipientName: string // 接收者名称
  recipientType: string // 接收者类型
  profitAmount: number // 分润金额
  ratio: number // 分润比例
  description: string // 说明
}

/**
 * 分润模拟器输入
 */
export interface ProfitSimulatorInput {
  productType: ProductType
  orderAmount: number
  directCost: number
  hostingType?: HostingType
  cooperationType?: CampsiteCooperationType
  tourProductType?: TourProductType
  hasPromoter: boolean
  promotionLevel?: PromotionLevel
  isBundled?: boolean
  isCrowdfunding?: boolean
  rating?: number
}

/**
 * 分润模拟器输出
 */
export interface ProfitSimulatorOutput {
  orderProfit: number
  profitRecords: ProfitDistribution[]
  platformProfit: number
  totalDistributed: number
  isBalanced: boolean
  appliedRules: string[]
}

/**
 * 余额记录
 */
export interface BalanceRecord {
  id: string
  userId: string
  userName: string
  balance: number // 当前余额
  frozenBalance: number // 冻结余额
  totalIncome: number // 累计收入
  totalWithdrawal: number // 累计提现
  updatedAt: string
}

/**
 * 提现申请
 */
export interface WithdrawalRequest {
  id: string
  userId: string
  userName: string
  amount: number // 提现金额
  fee: number // 手续费
  actualAmount: number // 实际到账金额
  status: WithdrawalStatus
  bankAccount: string // 银行账户
  bankName: string // 银行名称
  reason?: string // 拒绝原因
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
  completedAt?: string
}

/**
 * 风控规则
 */
export interface RiskControlRule {
  id: string
  name: string // 规则名称
  type: 'device_limit' | 'ip_limit' | 'order_frequency' | 'amount_threshold' // 规则类型
  threshold: number // 阈值
  action: 'freeze' | 'alert' | 'reject' // 动作
  enabled: boolean
  description: string
  updatedAt: string
}

/**
 * 风控记录
 */
export interface RiskControlRecord {
  id: string
  orderId: string
  orderNo: string
  userId: string
  userName: string
  ruleId: string
  ruleName: string
  riskLevel: 'low' | 'medium' | 'high' // 风险级别
  action: string // 执行的动作
  reason: string // 原因
  status: 'pending' | 'confirmed' | 'dismissed' // 状态
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
}

/**
 * 风险评估结果
 */
export interface RiskAssessment {
  riskLevel: RiskLevel // 风险等级
  action: RiskAction // 建议动作
  reasons: string[] // 风险原因列表
  score: number // 风险评分 (0-100)
  triggeredRules: string[] // 触发的规则ID列表
}

/**
 * 分润统计
 */
export interface ProfitStatistics {
  totalProfit: number // 总分润
  vehicleRentalProfit: number // 房车租赁分润
  campsiteProfit: number // 营地分润
  tourProfit: number // 旅游分润
  promotionProfit: number // 推广分润
  platformProfit: number // 平台利润
  platformAmount: number // 平台金额
  ownerAmount: number // 车主金额
  promoterAmount: number // 推广者金额
  storeAmount: number // 门店金额
  period: string // 统计周期
}

/**
 * 用户分润排行
 */
export interface UserProfitRanking {
  rank: number // 排名
  userId: string
  userName: string
  userType: UserRoleType
  totalProfit: number // 总分润
  orderCount: number // 订单数
  period: string // 统计周期
}
