import { get, post, put } from '@/utils/request'

// 是否使用Mock数据
const USE_MOCK = true

// Mock数据
const mockTickets = [
  {
    id: 1,
    ticketNo: 'TK20251206001',
    title: '车辆GPS定位异常',
    description: '车辆编号为A001的房车GPS定位显示异常，无法实时查看车辆位置，请尽快处理。',
    type: 'technical',
    status: 'pending',
    priority: 'high',
    creatorName: '张三',
    createTime: '2025-12-06 09:30:00',
    replyCount: 0,
    attachments: []
  },
  {
    id: 2,
    ticketNo: 'TK20251206002',
    title: '订单支付问题咨询',
    description: '客户反馈订单支付后未收到确认短信，订单号为ORD20251206001，请协助查询。',
    type: 'business',
    status: 'processing',
    priority: 'normal',
    creatorName: '李四',
    assigneeName: '王五',
    createTime: '2025-12-06 10:15:00',
    replyCount: 3,
    attachments: []
  },
  {
    id: 3,
    ticketNo: 'TK20251205001',
    title: '建议增加车辆预约功能',
    description: '建议在小程序端增加车辆预约功能，方便用户提前预约热门车型。',
    type: 'feature',
    status: 'completed',
    priority: 'low',
    creatorName: '赵六',
    assigneeName: '王五',
    createTime: '2025-12-05 14:20:00',
    replyCount: 5,
    attachments: []
  }
]

const mockTicketDetail = {
  id: 1,
  ticketNo: 'TK20251206001',
  title: '车辆GPS定位异常',
  description: '车辆编号为A001的房车GPS定位显示异常，无法实时查看车辆位置，请尽快处理。',
  type: 'technical',
  status: 'pending',
  priority: 'high',
  creatorName: '张三',
  createTime: '2025-12-06 09:30:00',
  attachments: [],
  records: [
    {
      id: 1,
      action: 'create',
      userName: '张三',
      createTime: '2025-12-06 09:30:00',
      content: '创建工单'
    }
  ]
}

/**
 * 获取工单列表
 * @param {Object} params - 查询参数
 * @param {string} params.status - 工单状态（pending/processing/completed/closed）
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 */
export function getTicketList(params) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...mockTickets]

        // 按状态筛选
        if (params.status) {
          list = list.filter(ticket => ticket.status === params.status)
        }

        resolve({
          list,
          total: list.length,
          page: params.page || 1,
          pageSize: params.pageSize || 20
        })
      }, 500)
    })
  }

  return get('/api/v1/tickets', params)
}

/**
 * 获取工单统计
 */
export function getTicketStats() {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          total: mockTickets.length,
          pending: mockTickets.filter(t => t.status === 'pending').length,
          processing: mockTickets.filter(t => t.status === 'processing').length,
          completed: mockTickets.filter(t => t.status === 'completed').length,
          closed: mockTickets.filter(t => t.status === 'closed').length
        })
      }, 300)
    })
  }

  return get('/api/v1/tickets/stats')
}

/**
 * 获取工单详情
 * @param {string|number} id - 工单ID
 */
export function getTicketDetail(id) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTicketDetail)
      }, 500)
    })
  }

  return get(`/api/v1/tickets/${id}`)
}

/**
 * 创建工单
 * @param {Object} data - 工单数据
 * @param {string} data.title - 工单标题
 * @param {string} data.type - 工单类型
 * @param {string} data.priority - 优先级
 * @param {string} data.description - 问题描述
 * @param {Array} data.images - 附件图片
 */
export function createTicket(data) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTicket = {
          id: mockTickets.length + 1,
          ticketNo: `TK${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(mockTickets.length + 1).padStart(3, '0')}`,
          ...data,
          status: 'pending',
          creatorName: '当前用户',
          createTime: new Date().toISOString(),
          replyCount: 0,
          attachments: data.images || []
        }
        mockTickets.unshift(newTicket)
        resolve(newTicket)
      }, 800)
    })
  }

  return post('/api/v1/tickets', data)
}

/**
 * 更新工单状态
 * @param {string|number} id - 工单ID
 * @param {string} status - 新状态（processing/completed/closed）
 */
export function updateTicketStatus(id, status) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticket = mockTickets.find(t => t.id === id)
        if (ticket) {
          ticket.status = status
        }
        resolve({ success: true })
      }, 500)
    })
  }

  return put(`/api/v1/tickets/${id}/status`, { status })
}

/**
 * 添加工单回复
 * @param {string|number} id - 工单ID
 * @param {Object} data - 回复数据
 * @param {string} data.content - 回复内容
 * @param {Array} data.images - 回复图片
 */
export function addTicketReply(id, data) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRecord = {
          id: Date.now(),
          action: 'reply',
          userName: '当前用户',
          createTime: new Date().toISOString(),
          content: data.content,
          images: data.images || []
        }

        if (mockTicketDetail.id === id) {
          mockTicketDetail.records.push(newRecord)
        }

        resolve(newRecord)
      }, 800)
    })
  }

  return post(`/api/v1/tickets/${id}/replies`, data)
}
