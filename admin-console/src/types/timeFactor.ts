/**
 * 时间因子相关类型定义
 */

/**
 * 调整方式
 */
export type AdjustmentType = 'percentage' | 'fixed'

/**
 * 法定节假日类型
 */
export type HolidayType = 'national' | 'custom'

/**
 * 法定节假日状态
 */
export type HolidayStatus = 'active' | 'inactive'

/**
 * 自定义时间规则类型
 */
export type TimeRuleType = 'date_range' | 'periodic' | 'specific_date'

/**
 * 自定义时间规则状态
 */
export type TimeRuleStatus = 'active' | 'inactive'

/**
 * 周期类型
 */
export type PeriodicType = 'weekly' | 'monthly' | 'yearly'

/**
 * 法定节假日
 */
export interface NationalHoliday {
  id: number
  name: string // 节假日名称（如：春节、国庆节）
  type: HolidayType // 节假日类型
  year: number // 年份
  startDate: string // 开始日期 YYYY-MM-DD
  endDate: string // 结束日期 YYYY-MM-DD
  adjustmentType: AdjustmentType // 调整方式
  adjustmentValue: number // 调整值
  remark: string // 备注
  status: HolidayStatus // 状态
  createdBy: string // 创建人
  createdAt: string
  updatedAt: string

  // 🆕 固定优先级
  priority: 90 // 法定节假日固定优先级90，不可调整

  // 🆕 数据来源追踪
  dataSource?: string // 数据来源（如："国务院办公厅"）
  syncTime?: string // 同步时间
}

/**
 * 法定节假日列表项
 */
export interface NationalHolidayListItem extends NationalHoliday {
  daysCount: number // 天数
}

/**
 * 法定节假日表单数据
 */
export interface NationalHolidayFormData {
  name: string
  type: HolidayType
  year: number
  startDate: string
  endDate: string
  adjustmentType: AdjustmentType
  adjustmentValue: number
  remark: string
  status: HolidayStatus
}

/**
 * 自定义时间规则
 */
export interface CustomTimeRule {
  id: number
  ruleName: string // 规则名称
  ruleType: TimeRuleType // 规则类型
  priority: number // 优先级（1-10，数字越大优先级越高）
  adjustmentType: AdjustmentType // 调整方式
  adjustmentValue: number // 调整值

  // 日期范围配置（ruleType = 'date_range'）
  dateRangeConfig?: {
    startDate: string // 开始日期
    endDate: string // 结束日期
    isYearlyRepeat?: boolean // 🆕 是否年度重复
  }

  // 周期配置（ruleType = 'periodic'）
  periodicConfig?: {
    periodicType: PeriodicType // 周期类型
    weekdays?: number[] // 星期几（1-7，周一到周日）
    monthDays?: number[] // 每月的哪几天（1-31）
    months?: number[] // 哪几个月（1-12）
    startDate?: string // 周期开始日期
    endDate?: string // 周期结束日期
  }

  // 特定日期配置（ruleType = 'specific_date'）
  specificDateConfig?: {
    dates: string[] // 特定日期列表
    isYearlyRepeat?: boolean // 🆕 是否年度重复
  }

  status: TimeRuleStatus // 状态
  remark: string // 备注
  createdBy: string // 创建人
  createdAt: string
  updatedAt: string
}

/**
 * 自定义时间规则列表项
 */
export interface CustomTimeRuleListItem extends CustomTimeRule {
  configSummary: string // 配置摘要（用于列表显示）
}

/**
 * 自定义时间规则表单数据
 */
export interface CustomTimeRuleFormData {
  ruleName: string
  ruleType: TimeRuleType
  priority: number
  adjustmentType: AdjustmentType
  adjustmentValue: number
  dateRangeConfig?: {
    startDate: string
    endDate: string
  }
  periodicConfig?: {
    periodicType: PeriodicType
    weekdays?: number[]
    monthDays?: number[]
    months?: number[]
    startDate?: string
    endDate?: string
  }
  specificDateConfig?: {
    dates: string[]
  }
  status: TimeRuleStatus
  remark: string
}

/**
 * 时间因子日历项
 */
export interface TimeFactorCalendarItem {
  date: string // 日期 YYYY-MM-DD
  isHoliday: boolean // 是否节假日
  holidayName?: string // 节假日名称
  appliedRules: Array<{
    ruleId: number
    ruleName: string
    ruleType: 'holiday' | 'custom'
    adjustmentType: AdjustmentType
    adjustmentValue: number
    priority: number
  }> // 应用的规则列表
  finalAdjustmentType?: AdjustmentType // 最终调整方式
  finalAdjustmentValue?: number // 最终调整值
}

/**
 * 法定节假日列表查询参数
 */
export interface NationalHolidayListParams {
  page?: number
  pageSize?: number
  year?: number
  type?: HolidayType
  status?: HolidayStatus
  keyword?: string
}

/**
 * 自定义时间规则列表查询参数
 */
export interface CustomTimeRuleListParams {
  page?: number
  pageSize?: number
  ruleType?: TimeRuleType
  status?: TimeRuleStatus
  keyword?: string
}

/**
 * 时间因子日历查询参数
 */
export interface TimeFactorCalendarParams {
  startDate: string // 开始日期 YYYY-MM-DD
  endDate: string // 结束日期 YYYY-MM-DD
}

/**
 * 法定节假日列表响应
 */
export interface NationalHolidayListResponse {
  list: NationalHolidayListItem[]
  total: number
  page: number
  pageSize: number
}

/**
 * 自定义时间规则列表响应
 */
export interface CustomTimeRuleListResponse {
  list: CustomTimeRuleListItem[]
  total: number
  page: number
  pageSize: number
}

/**
 * 时间因子日历响应
 */
export interface TimeFactorCalendarResponse {
  calendar: TimeFactorCalendarItem[]
  summary: {
    totalDays: number // 总天数
    holidayDays: number // 节假日天数
    customRuleDays: number // 自定义规则天数
    normalDays: number // 普通天数
  }
}

/**
 * 年份列表响应
 */
export interface YearListResponse {
  years: number[]
}

/**
 * 同步法定节假日请求数据
 */
export interface SyncNationalHolidayRequest {
  year: number
  forceOverwrite?: boolean // 是否强制覆盖已有数据
}

/**
 * 同步法定节假日响应
 */
export interface SyncNationalHolidayResponse {
  success: boolean
  message: string
  syncedCount: number // 同步成功的数量
  skippedCount: number // 跳过的数量
  failedCount: number // 失败的数量
}

/**
 * 节假日数据同步日志
 * 用途：记录每次节假日数据同步的结果
 */
export interface HolidaySyncLog {
  id: number
  year: number // 同步的年份
  syncStatus: 'success' | 'failed' | 'partial' // 同步状态
  syncedCount: number // 同步成功的数量
  skippedCount: number // 跳过的数量
  failedCount: number // 失败的数量
  errorMessage?: string // 错误信息
  dataSource: string // 数据来源
  syncedBy: string // 同步人（system=自动同步）
  syncedAt: string // 同步时间
}
