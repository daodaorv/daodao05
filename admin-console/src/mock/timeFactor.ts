// @ts-nocheck
/**
 * 时间因子Mock数据
 */

import type {
  NationalHoliday,
  NationalHolidayListItem,
  NationalHolidayListParams,
  NationalHolidayListResponse,
  NationalHolidayFormData,
  SyncNationalHolidayRequest,
  SyncNationalHolidayResponse,
  YearListResponse,
  CustomTimeRule,
  CustomTimeRuleListItem,
  CustomTimeRuleListParams,
  CustomTimeRuleListResponse,
  CustomTimeRuleFormData,
  TimeFactorCalendarParams,
  TimeFactorCalendarResponse,
  TimeFactorCalendarItem
} from '@/types/timeFactor'

/**
 * Mock法定节假日数据
 */
export const mockNationalHolidays: NationalHolidayListItem[] = [
  {
    id: 1,
    name: '元旦',
    type: 'national',
    year: 2025,
    startDate: '2025-01-01',
    endDate: '2025-01-01',
    adjustmentType: 'percentage',
    adjustmentValue: 15,
    remark: '2025年元旦假期，价格上浮15%',
    status: 'active',
    createdBy: '系统',
    createdAt: '2024-12-01 10:00:00',
    updatedAt: '2024-12-01 10:00:00',
    daysCount: 1
  },
  {
    id: 2,
    name: '春节',
    type: 'national',
    year: 2025,
    startDate: '2025-01-28',
    endDate: '2025-02-04',
    adjustmentType: 'percentage',
    adjustmentValue: 50,
    remark: '2025年春节假期（除夕至初六），价格上浮50%',
    status: 'active',
    createdBy: '系统',
    createdAt: '2024-12-01 10:00:00',
    updatedAt: '2024-12-01 10:00:00',
    daysCount: 8
  },
  {
    id: 3,
    name: '清明节',
    type: 'national',
    year: 2025,
    startDate: '2025-04-04',
    endDate: '2025-04-06',
    adjustmentType: 'percentage',
    adjustmentValue: 20,
    remark: '2025年清明节假期，价格上浮20%',
    status: 'active',
    createdBy: '系统',
    createdAt: '2024-12-01 10:00:00',
    updatedAt: '2024-12-01 10:00:00',
    daysCount: 3
  },
  {
    id: 4,
    name: '劳动节',
    type: 'national',
    year: 2025,
    startDate: '2025-05-01',
    endDate: '2025-05-05',
    adjustmentType: 'percentage',
    adjustmentValue: 30,
    remark: '2025年劳动节假期，价格上浮30%',
    status: 'active',
    createdBy: '系统',
    createdAt: '2024-12-01 10:00:00',
    updatedAt: '2024-12-01 10:00:00',
    daysCount: 5
  },
  {
    id: 5,
    name: '端午节',
    type: 'national',
    year: 2025,
    startDate: '2025-05-31',
    endDate: '2025-06-02',
    adjustmentType: 'percentage',
    adjustmentValue: 20,
    remark: '2025年端午节假期，价格上浮20%',
    status: 'active',
    createdBy: '系统',
    createdAt: '2024-12-01 10:00:00',
    updatedAt: '2024-12-01 10:00:00',
    daysCount: 3
  },
  {
    id: 6,
    name: '中秋节',
    type: 'national',
    year: 2025,
    startDate: '2025-10-06',
    endDate: '2025-10-08',
    adjustmentType: 'percentage',
    adjustmentValue: 25,
    remark: '2025年中秋节假期，价格上浮25%',
    status: 'active',
    createdBy: '系统',
    createdAt: '2024-12-01 10:00:00',
    updatedAt: '2024-12-01 10:00:00',
    daysCount: 3
  },
  {
    id: 7,
    name: '国庆节',
    type: 'national',
    year: 2025,
    startDate: '2025-10-01',
    endDate: '2025-10-07',
    adjustmentType: 'percentage',
    adjustmentValue: 40,
    remark: '2025年国庆节假期，价格上浮40%',
    status: 'active',
    createdBy: '系统',
    createdAt: '2024-12-01 10:00:00',
    updatedAt: '2024-12-01 10:00:00',
    daysCount: 7
  }
]

/**
 * Mock自定义时间规则数据
 */
export const mockCustomTimeRules: CustomTimeRuleListItem[] = [
  {
    id: 1,
    ruleName: '周末加价',
    ruleType: 'periodic',
    priority: 5,
    adjustmentType: 'percentage',
    adjustmentValue: 10,
    periodicConfig: {
      periodicType: 'weekly',
      weekdays: [6, 7], // 周六、周日
      startDate: '2025-01-01',
      endDate: '2025-12-31'
    },
    status: 'active',
    remark: '周末（周六、周日）价格上浮10%',
    createdBy: '管理员',
    createdAt: '2024-12-01 10:00:00',
    updatedAt: '2024-12-01 10:00:00',
    configSummary: '每周六、日'
  },
  {
    id: 2,
    ruleName: '暑期旺季',
    ruleType: 'date_range',
    priority: 7,
    adjustmentType: 'percentage',
    adjustmentValue: 25,
    dateRangeConfig: {
      startDate: '2025-07-01',
      endDate: '2025-08-31'
    },
    status: 'active',
    remark: '暑期旺季（7-8月），价格上浮25%',
    createdBy: '管理员',
    createdAt: '2024-12-01 10:00:00',
    updatedAt: '2024-12-01 10:00:00',
    configSummary: '2025-07-01 至 2025-08-31'
  },
  {
    id: 3,
    ruleName: '寒假旺季',
    ruleType: 'date_range',
    priority: 7,
    adjustmentType: 'percentage',
    adjustmentValue: 20,
    dateRangeConfig: {
      startDate: '2025-01-15',
      endDate: '2025-02-15'
    },
    status: 'active',
    remark: '寒假旺季，价格上浮20%',
    createdBy: '管理员',
    createdAt: '2024-12-01 10:00:00',
    updatedAt: '2024-12-01 10:00:00',
    configSummary: '2025-01-15 至 2025-02-15'
  },
  {
    id: 4,
    ruleName: '每月月初优惠',
    ruleType: 'periodic',
    priority: 3,
    adjustmentType: 'percentage',
    adjustmentValue: -5,
    periodicConfig: {
      periodicType: 'monthly',
      monthDays: [1, 2, 3], // 每月1-3号
      startDate: '2025-01-01',
      endDate: '2025-12-31'
    },
    status: 'active',
    remark: '每月1-3号优惠，价格下调5%',
    createdBy: '管理员',
    createdAt: '2024-12-01 10:00:00',
    updatedAt: '2024-12-01 10:00:00',
    configSummary: '每月1-3日'
  }
]

/**
 * 获取法定节假日列表
 */
export const mockGetNationalHolidayList = (params: NationalHolidayListParams): Promise<NationalHolidayListResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockNationalHolidays]

      // 年份筛选
      if (params.year) {
        filteredList = filteredList.filter(item => item.year === params.year)
      }

      // 类型筛选
      if (params.type) {
        filteredList = filteredList.filter(item => item.type === params.type)
      }

      // 状态筛选
      if (params.status) {
        filteredList = filteredList.filter(item => item.status === params.status)
      }

      // 关键词搜索
      if (params.keyword) {
        filteredList = filteredList.filter(item =>
          item.name.includes(params.keyword!) ||
          item.remark.includes(params.keyword!)
        )
      }

      const total = filteredList.length
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize

      resolve({
        list: filteredList.slice(start, end),
        total,
        page,
        pageSize
      })
    }, 300)
  })
}

/**
 * 获取法定节假日详情
 */
export const mockGetNationalHolidayDetail = (id: number): Promise<NationalHoliday> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const holiday = mockNationalHolidays.find(item => item.id === id)
      if (holiday) {
        resolve(holiday)
      } else {
        reject(new Error('节假日不存在'))
      }
    }, 300)
  })
}

/**
 * 创建法定节假日
 */
export const mockCreateNationalHoliday = (data: NationalHolidayFormData): Promise<NationalHoliday> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startDate = new Date(data.startDate)
      const endDate = new Date(data.endDate)
      const daysCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

      const newHoliday: NationalHolidayListItem = {
        id: mockNationalHolidays.length + 1,
        name: data.name,
        type: data.type,
        year: data.year,
        startDate: data.startDate,
        endDate: data.endDate,
        adjustmentType: data.adjustmentType,
        adjustmentValue: data.adjustmentValue,
        remark: data.remark,
        status: data.status,
        createdBy: '管理员',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        daysCount
      }
      mockNationalHolidays.push(newHoliday)
      resolve(newHoliday)
    }, 300)
  })
}

/**
 * 更新法定节假日
 */
export const mockUpdateNationalHoliday = (id: number, data: NationalHolidayFormData): Promise<NationalHoliday> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const holiday = mockNationalHolidays.find(item => item.id === id)
      if (holiday) {
        const startDate = new Date(data.startDate)
        const endDate = new Date(data.endDate)
        const daysCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

        holiday.name = data.name
        holiday.type = data.type
        holiday.year = data.year
        holiday.startDate = data.startDate
        holiday.endDate = data.endDate
        holiday.adjustmentType = data.adjustmentType
        holiday.adjustmentValue = data.adjustmentValue
        holiday.remark = data.remark
        holiday.status = data.status
        holiday.daysCount = daysCount
        holiday.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19)
        resolve(holiday)
      } else {
        reject(new Error('节假日不存在'))
      }
    }, 300)
  })
}

/**
 * 删除法定节假日
 */
export const mockDeleteNationalHoliday = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockNationalHolidays.findIndex(item => item.id === id)
      if (index !== -1) {
        mockNationalHolidays.splice(index, 1)
        resolve()
      } else {
        reject(new Error('节假日不存在'))
      }
    }, 300)
  })
}

/**
 * 同步法定节假日
 */
export const mockSyncNationalHoliday = (data: SyncNationalHolidayRequest): Promise<SyncNationalHolidayResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟同步逻辑
      const existingHolidays = mockNationalHolidays.filter(h => h.year === data.year)

      if (existingHolidays.length > 0 && !data.forceOverwrite) {
        resolve({
          success: false,
          message: `${data.year}年的节假日数据已存在，如需覆盖请勾选"强制覆盖"`,
          syncedCount: 0,
          skippedCount: existingHolidays.length,
          failedCount: 0
        })
      } else {
        // 模拟同步成功
        resolve({
          success: true,
          message: `成功同步${data.year}年的法定节假日数据`,
          syncedCount: 7,
          skippedCount: 0,
          failedCount: 0
        })
      }
    }, 1000)
  })
}

/**
 * 获取年份列表
 */
export const mockGetYearList = (): Promise<YearListResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentYear = new Date().getFullYear()
      const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2]
      resolve({ years })
    }, 300)
  })
}

/**
 * 获取自定义时间规则列表
 */
export const mockGetCustomTimeRuleList = (params: CustomTimeRuleListParams): Promise<CustomTimeRuleListResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockCustomTimeRules]

      // 规则类型筛选
      if (params.ruleType) {
        filteredList = filteredList.filter(item => item.ruleType === params.ruleType)
      }

      // 状态筛选
      if (params.status) {
        filteredList = filteredList.filter(item => item.status === params.status)
      }

      // 关键词搜索
      if (params.keyword) {
        filteredList = filteredList.filter(item =>
          item.ruleName.includes(params.keyword!) ||
          item.remark.includes(params.keyword!)
        )
      }

      const total = filteredList.length
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize

      resolve({
        list: filteredList.slice(start, end),
        total,
        page,
        pageSize
      })
    }, 300)
  })
}

/**
 * 获取自定义时间规则详情
 */
export const mockGetCustomTimeRuleDetail = (id: number): Promise<CustomTimeRule> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rule = mockCustomTimeRules.find(item => item.id === id)
      if (rule) {
        resolve(rule)
      } else {
        reject(new Error('时间规则不存在'))
      }
    }, 300)
  })
}

/**
 * 创建自定义时间规则
 */
export const mockCreateCustomTimeRule = (data: CustomTimeRuleFormData): Promise<CustomTimeRule> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 生成配置摘要
      let configSummary = ''
      if (data.ruleType === 'date_range' && data.dateRangeConfig) {
        configSummary = `${data.dateRangeConfig.startDate} 至 ${data.dateRangeConfig.endDate}`
      } else if (data.ruleType === 'periodic' && data.periodicConfig) {
        if (data.periodicConfig.periodicType === 'weekly') {
          const weekdayNames = ['一', '二', '三', '四', '五', '六', '日']
          const days = data.periodicConfig.weekdays?.map(d => `周${weekdayNames[d - 1]}`).join('、') || ''
          configSummary = `每${days}`
        } else if (data.periodicConfig.periodicType === 'monthly') {
          const days = data.periodicConfig.monthDays?.join('、') || ''
          configSummary = `每月${days}日`
        }
      } else if (data.ruleType === 'specific_date' && data.specificDateConfig) {
        configSummary = `特定日期：${data.specificDateConfig.dates.length}天`
      }

      const newRule: CustomTimeRuleListItem = {
        id: mockCustomTimeRules.length + 1,
        ruleName: data.ruleName,
        ruleType: data.ruleType,
        priority: data.priority,
        adjustmentType: data.adjustmentType,
        adjustmentValue: data.adjustmentValue,
        dateRangeConfig: data.dateRangeConfig,
        periodicConfig: data.periodicConfig,
        specificDateConfig: data.specificDateConfig,
        status: data.status,
        remark: data.remark,
        createdBy: '管理员',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        configSummary
      }
      mockCustomTimeRules.push(newRule)
      resolve(newRule)
    }, 300)
  })
}

/**
 * 更新自定义时间规则
 */
export const mockUpdateCustomTimeRule = (id: number, data: CustomTimeRuleFormData): Promise<CustomTimeRule> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rule = mockCustomTimeRules.find(item => item.id === id)
      if (rule) {
        // 生成配置摘要
        let configSummary = ''
        if (data.ruleType === 'date_range' && data.dateRangeConfig) {
          configSummary = `${data.dateRangeConfig.startDate} 至 ${data.dateRangeConfig.endDate}`
        } else if (data.ruleType === 'periodic' && data.periodicConfig) {
          if (data.periodicConfig.periodicType === 'weekly') {
            const weekdayNames = ['一', '二', '三', '四', '五', '六', '日']
            const days = data.periodicConfig.weekdays?.map(d => `周${weekdayNames[d - 1]}`).join('、') || ''
            configSummary = `每${days}`
          } else if (data.periodicConfig.periodicType === 'monthly') {
            const days = data.periodicConfig.monthDays?.join('、') || ''
            configSummary = `每月${days}日`
          }
        } else if (data.ruleType === 'specific_date' && data.specificDateConfig) {
          configSummary = `特定日期：${data.specificDateConfig.dates.length}天`
        }

        rule.ruleName = data.ruleName
        rule.ruleType = data.ruleType
        rule.priority = data.priority
        rule.adjustmentType = data.adjustmentType
        rule.adjustmentValue = data.adjustmentValue
        rule.dateRangeConfig = data.dateRangeConfig
        rule.periodicConfig = data.periodicConfig
        rule.specificDateConfig = data.specificDateConfig
        rule.status = data.status
        rule.remark = data.remark
        rule.configSummary = configSummary
        rule.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19)
        resolve(rule)
      } else {
        reject(new Error('时间规则不存在'))
      }
    }, 300)
  })
}

/**
 * 删除自定义时间规则
 */
export const mockDeleteCustomTimeRule = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockCustomTimeRules.findIndex(item => item.id === id)
      if (index !== -1) {
        mockCustomTimeRules.splice(index, 1)
        resolve()
      } else {
        reject(new Error('时间规则不存在'))
      }
    }, 300)
  })
}

/**
 * 获取时间因子日历
 */
export const mockGetTimeFactorCalendar = (params: TimeFactorCalendarParams): Promise<TimeFactorCalendarResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const calendar: TimeFactorCalendarItem[] = []
      const startDate = new Date(params.startDate)
      const endDate = new Date(params.endDate)

      let holidayDays = 0
      let customRuleDays = 0
      let normalDays = 0

      // 遍历日期范围
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]
        const appliedRules: any[] = []
        let isHoliday = false
        let holidayName = ''

        // 检查是否为法定节假日
        for (const holiday of mockNationalHolidays) {
          if (holiday.status === 'active' && dateStr >= holiday.startDate && dateStr <= holiday.endDate) {
            isHoliday = true
            holidayName = holiday.name
            appliedRules.push({
              ruleId: holiday.id,
              ruleName: holiday.name,
              ruleType: 'holiday',
              adjustmentType: holiday.adjustmentType,
              adjustmentValue: holiday.adjustmentValue,
              priority: 10 // 节假日优先级最高
            })
            break
          }
        }

        // 检查自定义时间规则
        for (const rule of mockCustomTimeRules) {
          if (rule.status === 'inactive') continue

          let isApplicable = false

          if (rule.ruleType === 'date_range' && rule.dateRangeConfig) {
            isApplicable = dateStr >= rule.dateRangeConfig.startDate && dateStr <= rule.dateRangeConfig.endDate
          } else if (rule.ruleType === 'periodic' && rule.periodicConfig) {
            if (rule.periodicConfig.periodicType === 'weekly') {
              const weekday = d.getDay() || 7 // 转换为1-7
              isApplicable = rule.periodicConfig.weekdays?.includes(weekday) || false
            } else if (rule.periodicConfig.periodicType === 'monthly') {
              const day = d.getDate()
              isApplicable = rule.periodicConfig.monthDays?.includes(day) || false
            }
          } else if (rule.ruleType === 'specific_date' && rule.specificDateConfig) {
            isApplicable = rule.specificDateConfig.dates.includes(dateStr)
          }

          if (isApplicable) {
            appliedRules.push({
              ruleId: rule.id,
              ruleName: rule.ruleName,
              ruleType: 'custom',
              adjustmentType: rule.adjustmentType,
              adjustmentValue: rule.adjustmentValue,
              priority: rule.priority
            })
          }
        }

        // 按优先级排序，取优先级最高的规则
        appliedRules.sort((a, b) => b.priority - a.priority)
        const finalRule = appliedRules[0]

        calendar.push({
          date: dateStr,
          isHoliday,
          holidayName: holidayName || undefined,
          appliedRules,
          finalAdjustmentType: finalRule?.adjustmentType,
          finalAdjustmentValue: finalRule?.adjustmentValue
        })

        // 统计
        if (isHoliday) {
          holidayDays++
        } else if (appliedRules.length > 0) {
          customRuleDays++
        } else {
          normalDays++
        }
      }

      resolve({
        calendar,
        summary: {
          totalDays: calendar.length,
          holidayDays,
          customRuleDays,
          normalDays
        }
      })
    }, 500)
  })
}
