/**
 * 规则执行日志 Mock 数据
 */

// 规则执行日志接口
export interface RuleExecutionLog {
  id: number
  tagId: number
  tagName: string
  executionTime: string
  triggerMode: 'realtime' | 'manual'
  ruleConditions: string
  matchedUserCount: number
  matchedUserIds: number[]
  executedBy: string
  status: 'success' | 'failed'
  errorMessage?: string
  duration: number  // 执行耗时(毫秒)
}

// Mock 规则执行日志数据
export const mockRuleExecutionLogs: RuleExecutionLog[] = [
  {
    id: 1,
    tagId: 1,
    tagName: 'VIP用户',
    executionTime: '2024-12-07T10:30:00.000Z',
    triggerMode: 'manual',
    ruleConditions: '订单数量大于等于10 且 消费总额大于等于10000',
    matchedUserCount: 5,
    matchedUserIds: [1, 2, 9, 14, 15],
    executedBy: '管理员-张三',
    status: 'success',
    duration: 1250
  },
  {
    id: 2,
    tagId: 2,
    tagName: '活跃用户',
    executionTime: '2024-12-07T09:15:00.000Z',
    triggerMode: 'manual',
    ruleConditions: '最后登录天数小于等于7',
    matchedUserCount: 12,
    matchedUserIds: [1, 2, 5, 6, 7, 9, 10, 11, 13, 14, 15, 18],
    executedBy: '管理员-张三',
    status: 'success',
    duration: 980
  },
  {
    id: 3,
    tagId: 3,
    tagName: '新用户',
    executionTime: '2024-12-07T08:00:00.000Z',
    triggerMode: 'realtime',
    ruleConditions: '注册天数小于等于30',
    matchedUserCount: 3,
    matchedUserIds: [5, 19, 20],
    executedBy: '系统自动',
    status: 'success',
    duration: 650
  },
  {
    id: 4,
    tagId: 6,
    tagName: '风险用户',
    executionTime: '2024-12-06T16:45:00.000Z',
    triggerMode: 'manual',
    ruleConditions: '违规次数大于等于3',
    matchedUserCount: 1,
    matchedUserIds: [4],
    executedBy: '管理员-李四',
    status: 'success',
    duration: 450
  },
  {
    id: 5,
    tagId: 4,
    tagName: '沉睡用户',
    executionTime: '2024-12-06T14:20:00.000Z',
    triggerMode: 'manual',
    ruleConditions: '最后登录天数大于30',
    matchedUserCount: 2,
    matchedUserIds: [3, 22],
    executedBy: '管理员-张三',
    status: 'success',
    duration: 820
  }
]

// Mock 获取规则执行日志列表
export const mockGetRuleExecutionLogs = (params: {
  page?: number
  pageSize?: number
  tagId?: number
  status?: string
  startDate?: string
  endDate?: string
}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockRuleExecutionLogs]

      // 按标签筛选
      if (params.tagId) {
        filtered = filtered.filter(log => log.tagId === params.tagId)
      }

      // 按状态筛选
      if (params.status) {
        filtered = filtered.filter(log => log.status === params.status)
      }

      // 按时间范围筛选
      if (params.startDate) {
        filtered = filtered.filter(log => log.executionTime >= params.startDate!)
      }
      if (params.endDate) {
        filtered = filtered.filter(log => log.executionTime <= params.endDate!)
      }

      // 按执行时间倒序排序
      filtered.sort((a, b) => new Date(b.executionTime).getTime() - new Date(a.executionTime).getTime())

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const list = filtered.slice(start, start + pageSize)

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: filtered.length,
          page,
          pageSize
        }
      })
    }, 300)
  })
}

// Mock 获取规则执行日志详情
export const mockGetRuleExecutionLogDetail = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const log = mockRuleExecutionLogs.find(l => l.id === id)
      if (!log) {
        reject({
          code: 404,
          message: '日志不存在'
        })
        return
      }

      resolve({
        code: 200,
        message: '获取成功',
        data: log
      })
    }, 200)
  })
}

// Mock 添加规则执行日志
export const mockAddRuleExecutionLog = (log: Omit<RuleExecutionLog, 'id'>) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newLog: RuleExecutionLog = {
        id: mockRuleExecutionLogs.length + 1,
        ...log
      }
      mockRuleExecutionLogs.unshift(newLog)

      resolve({
        code: 200,
        message: '添加成功',
        data: newLog
      })
    }, 200)
  })
}

// Mock 获取规则执行统计
export const mockGetRuleExecutionStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats = {
        totalExecutions: mockRuleExecutionLogs.length,
        successExecutions: mockRuleExecutionLogs.filter(l => l.status === 'success').length,
        failedExecutions: mockRuleExecutionLogs.filter(l => l.status === 'failed').length,
        totalMatchedUsers: mockRuleExecutionLogs.reduce((sum, l) => sum + l.matchedUserCount, 0),
        averageDuration: Math.round(
          mockRuleExecutionLogs.reduce((sum, l) => sum + l.duration, 0) / mockRuleExecutionLogs.length
        )
      }

      resolve({
        code: 200,
        message: '获取成功',
        data: stats
      })
    }, 200)
  })
}
