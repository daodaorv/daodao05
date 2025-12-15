/**
 * 消息通知 Mock 数据
 */

// 模拟消息数据
const messages = [
  // 系统消息
  {
    id: 'msg_001',
    type: 'system',
    title: '系统升级通知',
    content: '系统将于今晚22:00-24:00进行升级维护，期间可能无法访问，请提前做好准备。',
    isRead: false,
    createTime: '2025-11-30 10:30:00',
    priority: 'high'
  },
  {
    id: 'msg_002',
    type: 'system',
    title: '新功能上线',
    content: '现场核验功能已上线，支持车辆检查、照片拍摄和电子签名，欢迎体验！',
    isRead: false,
    createTime: '2025-11-30 09:15:00',
    priority: 'normal'
  },
  {
    id: 'msg_003',
    type: 'system',
    title: '安全提醒',
    content: '请定期修改密码，确保账号安全。建议使用字母、数字和符号组合的强密码。',
    isRead: true,
    createTime: '2025-11-29 16:20:00',
    priority: 'normal'
  },

  // 订单消息
  {
    id: 'msg_004',
    type: 'order',
    title: '新订单待处理',
    content: '订单 #ORD20251130001 待确认，客户：张三，车辆：奔驰V260房车。',
    isRead: false,
    createTime: '2025-11-30 11:45:00',
    priority: 'high',
    relatedId: '1',
    relatedType: 'order'
  },
  {
    id: 'msg_005',
    type: 'order',
    title: '订单即将到期',
    content: '订单 #ORD20251125002 将于明天到期，请及时联系客户办理还车手续。',
    isRead: false,
    createTime: '2025-11-30 08:30:00',
    priority: 'high',
    relatedId: '2',
    relatedType: 'order'
  },
  {
    id: 'msg_006',
    type: 'order',
    title: '订单已完成',
    content: '订单 #ORD20251120003 已完成，客户评价：5星好评。',
    isRead: true,
    createTime: '2025-11-29 14:20:00',
    priority: 'normal',
    relatedId: '3',
    relatedType: 'order'
  },
  {
    id: 'msg_007',
    type: 'order',
    title: '订单取消通知',
    content: '订单 #ORD20251128004 已被客户取消，原因：行程变更。',
    isRead: true,
    createTime: '2025-11-28 10:15:00',
    priority: 'normal',
    relatedId: '4',
    relatedType: 'order'
  },

  // 工单消息
  {
    id: 'msg_008',
    type: 'ticket',
    title: '新工单待处理',
    content: '工单 #TKT20251130001：车辆空调故障，需要及时维修。',
    isRead: false,
    createTime: '2025-11-30 13:20:00',
    priority: 'urgent',
    relatedId: 'ticket_001',
    relatedType: 'ticket'
  },
  {
    id: 'msg_009',
    type: 'ticket',
    title: '工单已分配',
    content: '工单 #TKT20251129002 已分配给您，请及时处理。',
    isRead: false,
    createTime: '2025-11-29 15:40:00',
    priority: 'high',
    relatedId: 'ticket_002',
    relatedType: 'ticket'
  },
  {
    id: 'msg_010',
    type: 'ticket',
    title: '工单已完成',
    content: '工单 #TKT20251128003 已完成处理，客户已确认。',
    isRead: true,
    createTime: '2025-11-28 17:30:00',
    priority: 'normal',
    relatedId: 'ticket_003',
    relatedType: 'ticket'
  }
]

/**
 * 获取消息列表
 */
export function getMessageList(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { type, page = 1, pageSize = 20 } = params

      // 按类型筛选
      let filteredMessages = messages
      if (type && type !== 'all') {
        filteredMessages = messages.filter(msg => msg.type === type)
      }

      // 分页
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredMessages.slice(start, end)

      resolve({
        list,
        total: filteredMessages.length,
        page,
        pageSize,
        hasMore: end < filteredMessages.length
      })
    }, 300)
  })
}

/**
 * 获取消息详情
 */
export function getMessageDetail(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const message = messages.find(msg => msg.id === id)

      if (message) {
        resolve(message)
      } else {
        reject(new Error('消息不存在'))
      }
    }, 200)
  })
}

/**
 * 标记消息已读
 */
export function markMessageRead(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const message = messages.find(msg => msg.id === id)

      if (message) {
        message.isRead = true
        resolve({ success: true })
      } else {
        reject(new Error('消息不存在'))
      }
    }, 200)
  })
}

/**
 * 批量标记消息已读
 */
export function markMessagesRead(ids) {
  return new Promise((resolve) => {
    setTimeout(() => {
      ids.forEach(id => {
        const message = messages.find(msg => msg.id === id)
        if (message) {
          message.isRead = true
        }
      })

      resolve({ success: true, count: ids.length })
    }, 300)
  })
}

/**
 * 删除消息
 */
export function deleteMessage(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = messages.findIndex(msg => msg.id === id)

      if (index > -1) {
        messages.splice(index, 1)
        resolve({ success: true })
      } else {
        reject(new Error('消息不存在'))
      }
    }, 200)
  })
}

/**
 * 获取未读消息数量
 */
export function getUnreadCount() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const unreadCount = {
        total: messages.filter(msg => !msg.isRead).length,
        system: messages.filter(msg => msg.type === 'system' && !msg.isRead).length,
        order: messages.filter(msg => msg.type === 'order' && !msg.isRead).length,
        ticket: messages.filter(msg => msg.type === 'ticket' && !msg.isRead).length
      }

      resolve(unreadCount)
    }, 200)
  })
}

export default {
  getMessageList,
  getMessageDetail,
  markMessageRead,
  markMessagesRead,
  deleteMessage,
  getUnreadCount
}
