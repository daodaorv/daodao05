import { get, post } from '@/utils/request'

// 是否使用Mock数据
const USE_MOCK = true

// Mock数据
const mockMessages = [
  {
    id: 1,
    conversationId: 'conv-001',
    type: 'text',
    content: '您好，请问有什么可以帮助您的吗？',
    isSelf: false,
    status: 'sent',
    createTime: '2025-12-06 09:00:00',
    avatar: '/static/avatar-service.png',
    senderName: '客服小王'
  },
  {
    id: 2,
    conversationId: 'conv-001',
    type: 'text',
    content: '您好，我想咨询一下订单的问题',
    isSelf: true,
    status: 'sent',
    createTime: '2025-12-06 09:01:00',
    avatar: '/static/avatar-default.png',
    senderName: '我'
  },
  {
    id: 3,
    conversationId: 'conv-001',
    type: 'text',
    content: '好的，请问您的订单号是多少？',
    isSelf: false,
    status: 'sent',
    createTime: '2025-12-06 09:01:30',
    avatar: '/static/avatar-service.png',
    senderName: '客服小王'
  },
  {
    id: 4,
    conversationId: 'conv-001',
    type: 'text',
    content: 'ORD20251206001',
    isSelf: true,
    status: 'sent',
    createTime: '2025-12-06 09:02:00',
    avatar: '/static/avatar-default.png',
    senderName: '我'
  },
  {
    id: 5,
    conversationId: 'conv-001',
    type: 'text',
    content: '好的，我帮您查询一下，请稍等...',
    isSelf: false,
    status: 'sent',
    createTime: '2025-12-06 09:02:15',
    avatar: '/static/avatar-service.png',
    senderName: '客服小王'
  }
]

/**
 * 获取聊天消息列表
 * @param {Object} params - 查询参数
 * @param {string} params.conversationId - 会话ID
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 */
export function getChatMessages(params) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { conversationId, page = 1, pageSize = 20 } = params

        // 筛选指定会话的消息
        let messages = mockMessages.filter(msg => msg.conversationId === conversationId)

        // 分页
        const start = (page - 1) * pageSize
        const end = start + pageSize
        const list = messages.slice(start, end)

        resolve({
          list,
          total: messages.length,
          page,
          pageSize,
          hasMore: end < messages.length
        })
      }, 500)
    })
  }

  return get('/api/v1/chat/messages', params)
}

/**
 * 发送聊天消息
 * @param {Object} data - 消息数据
 * @param {string} data.conversationId - 会话ID
 * @param {string} data.type - 消息类型（text/image）
 * @param {string} data.content - 消息内容
 */
export function sendChatMessage(data) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMessage = {
          id: mockMessages.length + 1,
          conversationId: data.conversationId,
          type: data.type,
          content: data.content,
          isSelf: true,
          status: 'sent',
          createTime: new Date().toISOString(),
          avatar: '/static/avatar-default.png',
          senderName: '我'
        }

        mockMessages.push(newMessage)

        // 模拟客服自动回复
        setTimeout(() => {
          const autoReply = {
            id: mockMessages.length + 1,
            conversationId: data.conversationId,
            type: 'text',
            content: '收到您的消息，我们会尽快处理。',
            isSelf: false,
            status: 'sent',
            createTime: new Date().toISOString(),
            avatar: '/static/avatar-service.png',
            senderName: '客服小王'
          }
          mockMessages.push(autoReply)
        }, 1000)

        resolve(newMessage)
      }, 800)
    })
  }

  return post('/api/v1/chat/messages', data)
}

/**
 * 获取会话列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 */
export function getConversationList(params) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockConversations = [
          {
            id: 'conv-001',
            title: '客服咨询',
            avatar: '/static/avatar-service.png',
            lastMessage: '收到您的消息，我们会尽快处理。',
            lastMessageTime: '2025-12-06 09:05:00',
            unreadCount: 2
          },
          {
            id: 'conv-002',
            title: '订单问题',
            avatar: '/static/avatar-service.png',
            lastMessage: '您的订单已经处理完成',
            lastMessageTime: '2025-12-05 16:30:00',
            unreadCount: 0
          }
        ]

        resolve({
          list: mockConversations,
          total: mockConversations.length,
          page: params.page || 1,
          pageSize: params.pageSize || 20
        })
      }, 500)
    })
  }

  return get('/api/v1/chat/conversations', params)
}

/**
 * 创建会话
 * @param {Object} data - 会话数据
 * @param {string} data.title - 会话标题
 * @param {string} data.type - 会话类型（customer_service/technical_support）
 */
export function createConversation(data) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newConversation = {
          id: `conv-${Date.now()}`,
          title: data.title,
          type: data.type,
          avatar: '/static/avatar-service.png',
          createTime: new Date().toISOString()
        }

        resolve(newConversation)
      }, 500)
    })
  }

  return post('/api/v1/chat/conversations', data)
}

/**
 * 标记消息已读
 * @param {string} conversationId - 会话ID
 */
export function markMessagesRead(conversationId) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  return post(`/api/v1/chat/conversations/${conversationId}/read`)
}
