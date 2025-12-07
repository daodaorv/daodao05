/**
 * 帮助中心相关API
 */
import { get, post } from '@/utils/request'

// 是否使用Mock数据
const USE_MOCK = true

/**
 * Mock数据
 */
const mockData = {
  guides: [
    {
      id: 1,
      icon: '📋',
      title: '订单管理指南',
      description: '如何创建、查看和管理订单',
      category: 'order',
      content: '详细的订单管理操作指南...'
    },
    {
      id: 2,
      icon: '🚗',
      title: '车辆管理指南',
      description: '车辆信息维护和状态管理',
      category: 'vehicle',
      content: '详细的车辆管理操作指南...'
    },
    {
      id: 3,
      icon: '🏠',
      title: '托管服务指南',
      description: '托管申请审核和车辆管理',
      category: 'hosting',
      content: '详细的托管服务操作指南...'
    },
    {
      id: 4,
      icon: '💬',
      title: '消息通知指南',
      description: '工单处理和在线客服使用',
      category: 'message',
      content: '详细的消息通知操作指南...'
    }
  ],

  hotQuestions: [
    {
      id: 1,
      question: '如何创建新订单？',
      answer: '在订单管理页面点击"创建订单"按钮，填写客户信息、选择车辆和租期，确认后提交即可创建新订单。系统会自动生成订单号并发送通知。',
      category: 'order',
      helpfulCount: 128
    },
    {
      id: 2,
      question: '如何处理还车流程？',
      answer: '在订单详情页点击"还车"按钮，进入还车流程。需要检查车辆状态、拍照记录、确认里程数，最后完成还车确认。系统会自动计算费用并更新订单状态。',
      category: 'order',
      helpfulCount: 95
    },
    {
      id: 3,
      question: '如何查看车辆位置？',
      answer: '在车辆管理页面点击"车辆位置"，可以在地图上查看所有车辆的实时位置。点击车辆标记可以查看详细信息和历史轨迹。',
      category: 'vehicle',
      helpfulCount: 87
    },
    {
      id: 4,
      question: '如何审核托管申请？',
      answer: '在托管管理页面查看待审核申请，点击进入详情页。审核时需要检查车主资料、车辆信息和相关证件，确认无误后可以通过或驳回申请。',
      category: 'hosting',
      helpfulCount: 76
    },
    {
      id: 5,
      question: '如何处理工单？',
      answer: '在消息通知页面点击"工单列表"，选择待处理工单进入详情。可以查看工单内容、添加回复、上传图片，处理完成后更新工单状态。',
      category: 'message',
      helpfulCount: 64
    }
  ],

  faqList: [
    {
      id: 1,
      question: '如何创建新订单？',
      answer: '在订单管理页面点击"创建订单"按钮，填写客户信息、选择车辆和租期，确认后提交即可创建新订单。系统会自动生成订单号并发送通知。',
      category: 'order',
      helpfulCount: 128
    },
    {
      id: 2,
      question: '如何处理还车流程？',
      answer: '在订单详情页点击"还车"按钮，进入还车流程。需要检查车辆状态、拍照记录、确认里程数，最后完成还车确认。系统会自动计算费用并更新订单状态。',
      category: 'order',
      helpfulCount: 95
    },
    {
      id: 3,
      question: '订单状态有哪些？',
      answer: '订单状态包括：待确认、已确认、进行中、已完成、已取消。每个状态对应不同的操作权限和业务流程。',
      category: 'order',
      helpfulCount: 82
    },
    {
      id: 4,
      question: '如何查看车辆位置？',
      answer: '在车辆管理页面点击"车辆位置"，可以在地图上查看所有车辆的实时位置。点击车辆标记可以查看详细信息和历史轨迹。',
      category: 'vehicle',
      helpfulCount: 87
    },
    {
      id: 5,
      question: '如何添加车辆维保记录？',
      answer: '在车辆详情页点击"添加维保记录"，填写维保类型、费用、维保内容等信息，可以上传相关照片和文档。提交后会自动更新车辆维保历史。',
      category: 'vehicle',
      helpfulCount: 71
    },
    {
      id: 6,
      question: '车辆状态有哪些？',
      answer: '车辆状态包括：可用、使用中、维护中、停用。不同状态的车辆有不同的操作限制，例如维护中的车辆不能分配给新订单。',
      category: 'vehicle',
      helpfulCount: 68
    },
    {
      id: 7,
      question: '如何审核托管申请？',
      answer: '在托管管理页面查看待审核申请，点击进入详情页。审核时需要检查车主资料、车辆信息和相关证件，确认无误后可以通过或驳回申请。',
      category: 'hosting',
      helpfulCount: 76
    },
    {
      id: 8,
      question: '托管车辆如何管理？',
      answer: '托管车辆在"托管车辆"页面统一管理，可以查看车辆状态、收益情况、使用记录等。支持设置车主自用时段和维护计划。',
      category: 'hosting',
      helpfulCount: 59
    },
    {
      id: 9,
      question: '如何处理工单？',
      answer: '在消息通知页面点击"工单列表"，选择待处理工单进入详情。可以查看工单内容、添加回复、上传图片，处理完成后更新工单状态。',
      category: 'message',
      helpfulCount: 64
    },
    {
      id: 10,
      question: '如何使用在线客服？',
      answer: '在消息通知页面点击"在线客服"，可以与客服人员实时沟通。支持发送文字和图片消息，客服会及时回复您的问题。',
      category: 'message',
      helpfulCount: 55
    },
    {
      id: 11,
      question: '如何修改登录密码？',
      answer: '在个人中心点击"账号安全"，选择"修改密码"。需要输入当前密码和新密码，确认后即可修改。建议定期更换密码以保证账号安全。',
      category: 'account',
      helpfulCount: 92
    },
    {
      id: 12,
      question: '忘记密码怎么办？',
      answer: '在登录页面点击"忘记密码"，通过手机号验证码或邮箱验证重置密码。如果无法通过验证，请联系管理员协助处理。',
      category: 'account',
      helpfulCount: 78
    },
    {
      id: 13,
      question: '如何设置通知提醒？',
      answer: '在系统设置中点击"通知设置"，可以自定义各类通知的开关、提醒方式（声音、振动）和免打扰时段。',
      category: 'other',
      helpfulCount: 48
    },
    {
      id: 14,
      question: '如何清除缓存？',
      answer: '在系统设置中点击"清除缓存"，确认后会清除应用缓存数据。注意：清除缓存不会删除登录信息和重要设置。',
      category: 'other',
      helpfulCount: 42
    },
    {
      id: 15,
      question: '应用闪退怎么办？',
      answer: '首先尝试清除缓存并重启应用。如果问题依然存在，请检查应用版本是否为最新版本。如果仍无法解决，请通过意见反馈联系我们。',
      category: 'other',
      helpfulCount: 36
    }
  ],

  feedbackHistory: [
    {
      id: 1,
      type: 'bug',
      content: '订单列表加载速度较慢，希望能优化一下',
      status: 'completed',
      createTime: '2025-12-05 14:30:00',
      reply: '感谢您的反馈，我们已经优化了订单列表的加载速度，请更新到最新版本体验。'
    },
    {
      id: 2,
      type: 'suggestion',
      content: '建议增加批量导出订单功能',
      status: 'processing',
      createTime: '2025-12-04 10:15:00',
      reply: '您的建议很好，我们正在评估开发计划，预计下个版本会加入此功能。'
    },
    {
      id: 3,
      type: 'complaint',
      content: '车辆位置更新不及时',
      status: 'completed',
      createTime: '2025-12-03 16:45:00',
      reply: '问题已修复，车辆位置现在会实时更新。感谢您的反馈。'
    }
  ]
}

/**
 * 获取使用指南列表
 * @returns {Promise}
 */
export function getHelpGuides() {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '获取成功',
      data: {
        list: mockData.guides,
        total: mockData.guides.length
      }
    })
  }
  return get('/api/v1/help/guides')
}

/**
 * 获取热门问题列表
 * @returns {Promise}
 */
export function getHotQuestions() {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '获取成功',
      data: {
        list: mockData.hotQuestions,
        total: mockData.hotQuestions.length
      }
    })
  }
  return get('/api/v1/help/hot-questions')
}

/**
 * 搜索帮助内容
 * @param {Object} params - 搜索参数
 * @param {string} params.keyword - 搜索关键词
 * @returns {Promise}
 */
export function searchHelp(params) {
  if (USE_MOCK) {
    const keyword = params.keyword.toLowerCase()
    const results = [
      ...mockData.guides.filter(item =>
        item.title.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword)
      ),
      ...mockData.faqList.filter(item =>
        item.question.toLowerCase().includes(keyword) ||
        item.answer.toLowerCase().includes(keyword)
      )
    ]

    return Promise.resolve({
      code: 200,
      message: '搜索成功',
      data: {
        list: results,
        total: results.length
      }
    })
  }
  return get('/api/v1/help/search', params)
}

/**
 * 获取常见问题列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getFaqList(params = {}) {
  if (USE_MOCK) {
    let list = mockData.faqList

    // 按分类筛选
    if (params.category && params.category !== 'all') {
      list = list.filter(item => item.category === params.category)
    }

    return Promise.resolve({
      code: 200,
      message: '获取成功',
      data: {
        list: list,
        total: list.length
      }
    })
  }
  return get('/api/v1/help/faq', params)
}

/**
 * 获取常见问题分类
 * @returns {Promise}
 */
export function getFaqCategories() {
  if (USE_MOCK) {
    const categories = [
      { id: 'all', name: '全部' },
      { id: 'order', name: '订单相关' },
      { id: 'vehicle', name: '车辆管理' },
      { id: 'hosting', name: '托管服务' },
      { id: 'payment', name: '支付问题' },
      { id: 'account', name: '账号安全' },
      { id: 'other', name: '其他问题' }
    ]

    return Promise.resolve({
      code: 200,
      message: '获取成功',
      data: {
        list: categories
      }
    })
  }
  return get('/api/v1/help/faq/categories')
}

/**
 * 标记问题是否有帮助
 * @param {Object} data - 标记数据
 * @param {number} data.faqId - 问题ID
 * @param {boolean} data.helpful - 是否有帮助
 * @returns {Promise}
 */
export function markFaqHelpful(data) {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '标记成功'
    })
  }
  return post('/api/v1/help/faq/helpful', data)
}

/**
 * 提交反馈
 * @param {Object} data - 反馈数据
 * @param {string} data.type - 反馈类型
 * @param {string} data.content - 反馈内容
 * @param {Array} data.images - 图片列表
 * @param {string} data.phone - 联系电话
 * @param {string} data.email - 联系邮箱
 * @returns {Promise}
 */
export function submitFeedback(data) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '提交成功',
          data: {
            id: Date.now(),
            ...data,
            status: 'pending',
            createTime: new Date().toISOString()
          }
        })
      }, 1000)
    })
  }
  return post('/api/v1/help/feedback', data)
}

/**
 * 获取反馈历史
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getFeedbackHistory(params = {}) {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '获取成功',
      data: {
        list: mockData.feedbackHistory,
        total: mockData.feedbackHistory.length
      }
    })
  }
  return get('/api/v1/help/feedback/history', params)
}

/**
 * 获取反馈详情
 * @param {number} id - 反馈ID
 * @returns {Promise}
 */
export function getFeedbackDetail(id) {
  if (USE_MOCK) {
    const feedback = mockData.feedbackHistory.find(item => item.id === id)
    return Promise.resolve({
      code: 200,
      message: '获取成功',
      data: feedback || null
    })
  }
  return get(`/api/v1/help/feedback/${id}`)
}

export default {
  getHelpGuides,
  getHotQuestions,
  searchHelp,
  getFaqList,
  getFaqCategories,
  markFaqHelpful,
  submitFeedback,
  getFeedbackHistory,
  getFeedbackDetail
}
