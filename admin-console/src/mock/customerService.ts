/**
 * 客服管理 Mock 数据
 */

// 工单状态
export type TicketStatus = 'pending' | 'processing' | 'resolved' | 'closed' | 'reopened'

// 工单优先级
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

// 工单类型
export type TicketType = 'consultation' | 'complaint' | 'suggestion' | 'technical' | 'refund' | 'other'

// 客服技能
export type ServiceSkill = 'vehicle' | 'order' | 'payment' | 'technical' | 'complaint' | 'general'

// 客服状态
export type ServiceStatus = 'online' | 'busy' | 'offline' | 'break'

// 知识库分类
export type KnowledgeCategory = 'faq' | 'guide' | 'policy' | 'technical' | 'other'

// 工单记录
export interface Ticket {
  id: number
  ticketNo: string
  type: TicketType
  title: string
  description: string
  priority: TicketPriority
  status: TicketStatus
  userId: number
  userName: string
  userPhone: string
  assigneeId: number | null
  assigneeName: string | null
  tags: string[]
  attachments: string[]
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  closedAt: string | null
  responseTime: number | null  // 响应时长（分钟）
  resolveTime: number | null   // 解决时长（小时）
  satisfaction: number | null  // 满意度评分 1-5
  satisfactionComment: string
}

// 工单统计
export interface TicketStats {
  totalTickets: number
  pendingTickets: number
  processingTickets: number
  resolvedTickets: number
  closedTickets: number
  avgResponseTime: number      // 平均响应时长（分钟）
  avgResolveTime: number       // 平均解决时长（小时）
  avgSatisfaction: number      // 平均满意度
  todayTickets: number
}

// 客服人员
export interface ServiceAgent {
  id: number
  name: string
  avatar: string
  status: ServiceStatus
  skills: ServiceSkill[]
  maxConcurrent: number        // 最大并发工单数
  currentTickets: number       // 当前处理工单数
  totalTickets: number         // 累计处理工单数
  avgSatisfaction: number      // 平均满意度
  avgResponseTime: number      // 平均响应时长（分钟）
  onlineTime: number           // 今日在线时长（小时）
  createdAt: string
}

// 智能路由配置
export interface RoutingConfig {
  id: number
  enableAutoRouting: boolean   // 启用自动路由
  routingStrategy: 'skill' | 'load' | 'priority' | 'round_robin'
  skillMatching: boolean       // 技能匹配
  loadBalancing: boolean       // 负载均衡
  priorityFirst: boolean       // 优先级优先
  maxWaitTime: number          // 最大等待时间（分钟）
  autoEscalate: boolean        // 自动升级
  escalateTime: number         // 升级时间（分钟）
  workingHours: {
    start: string
    end: string
  }
  updatedAt: string
}

// 知识库文章
export interface KnowledgeArticle {
  id: number
  title: string
  content: string
  category: KnowledgeCategory
  tags: string[]
  viewCount: number
  likeCount: number
  isPublished: boolean
  authorId: number
  authorName: string
  createdAt: string
  updatedAt: string
}

// 知识库统计
export interface KnowledgeStats {
  totalArticles: number
  publishedArticles: number
  totalViews: number
  totalLikes: number
  avgViewsPerArticle: number
  topArticles: Array<{
    id: number
    title: string
    viewCount: number
  }>
}

// Mock 工单数据
const mockTickets: Ticket[] = [
  {
    id: 1,
    ticketNo: 'TK202512030001',
    type: 'consultation',
    title: '如何预订房车？',
    description: '我是新用户，想了解一下如何在小程序上预订房车，需要准备什么材料？',
    priority: 'medium',
    status: 'resolved',
    userId: 1001,
    userName: '张三',
    userPhone: '13800138001',
    assigneeId: 1,
    assigneeName: '客服小王',
    tags: ['预订', '新手'],
    attachments: [],
    createdAt: '2025-12-03 09:00:00',
    updatedAt: '2025-12-03 09:30:00',
    resolvedAt: '2025-12-03 09:30:00',
    closedAt: '2025-12-03 10:00:00',
    responseTime: 5,
    resolveTime: 0.5,
    satisfaction: 5,
    satisfactionComment: '回复很及时，解答很详细',
  },
  {
    id: 2,
    ticketNo: 'TK202512030002',
    type: 'complaint',
    title: '车辆有异味',
    description: '我租的房车里有很重的烟味，影响使用体验，要求换车或退款',
    priority: 'high',
    status: 'processing',
    userId: 1002,
    userName: '李四',
    userPhone: '13800138002',
    assigneeId: 2,
    assigneeName: '客服小李',
    tags: ['投诉', '车辆问题'],
    attachments: ['https://picsum.photos/400/300?random=20'],
    createdAt: '2025-12-03 10:00:00',
    updatedAt: '2025-12-03 10:30:00',
    resolvedAt: null,
    closedAt: null,
    responseTime: 10,
    resolveTime: null,
    satisfaction: null,
    satisfactionComment: '',
  },
  {
    id: 3,
    ticketNo: 'TK202512030003',
    type: 'technical',
    title: '小程序支付失败',
    description: '我在支付订单时一直提示"支付失败"，但是钱已经扣了',
    priority: 'urgent',
    status: 'pending',
    userId: 1003,
    userName: '王五',
    userPhone: '13800138003',
    assigneeId: null,
    assigneeName: null,
    tags: ['支付', '技术问题'],
    attachments: ['https://picsum.photos/400/300?random=21'],
    createdAt: '2025-12-03 11:00:00',
    updatedAt: '2025-12-03 11:00:00',
    resolvedAt: null,
    closedAt: null,
    responseTime: null,
    resolveTime: null,
    satisfaction: null,
    satisfactionComment: '',
  },
  {
    id: 4,
    ticketNo: 'TK202512030004',
    type: 'refund',
    title: '申请退款',
    description: '因为临时有事无法出行，申请退款',
    priority: 'medium',
    status: 'resolved',
    userId: 1004,
    userName: '赵六',
    userPhone: '13800138004',
    assigneeId: 1,
    assigneeName: '客服小王',
    tags: ['退款'],
    attachments: [],
    createdAt: '2025-12-02 14:00:00',
    updatedAt: '2025-12-02 16:00:00',
    resolvedAt: '2025-12-02 16:00:00',
    closedAt: '2025-12-02 17:00:00',
    responseTime: 15,
    resolveTime: 2,
    satisfaction: 4,
    satisfactionComment: '处理速度还可以',
  },
  {
    id: 5,
    ticketNo: 'TK202512030005',
    type: 'suggestion',
    title: '建议增加车型',
    description: '希望能增加一些小型房车，适合2-3人的家庭出游',
    priority: 'low',
    status: 'closed',
    userId: 1005,
    userName: '孙七',
    userPhone: '13800138005',
    assigneeId: 3,
    assigneeName: '客服小张',
    tags: ['建议', '车型'],
    attachments: [],
    createdAt: '2025-12-01 10:00:00',
    updatedAt: '2025-12-01 11:00:00',
    resolvedAt: '2025-12-01 11:00:00',
    closedAt: '2025-12-01 11:30:00',
    responseTime: 20,
    resolveTime: 1,
    satisfaction: 5,
    satisfactionComment: '感谢反馈',
  },
]

// Mock 客服人员数据
const mockServiceAgents: ServiceAgent[] = [
  {
    id: 1,
    name: '客服小王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent1',
    status: 'online',
    skills: ['vehicle', 'order', 'general'],
    maxConcurrent: 5,
    currentTickets: 2,
    totalTickets: 156,
    avgSatisfaction: 4.8,
    avgResponseTime: 8,
    onlineTime: 6.5,
    createdAt: '2025-01-01 00:00:00',
  },
  {
    id: 2,
    name: '客服小李',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent2',
    status: 'busy',
    skills: ['complaint', 'refund', 'general'],
    maxConcurrent: 5,
    currentTickets: 5,
    totalTickets: 203,
    avgSatisfaction: 4.6,
    avgResponseTime: 10,
    onlineTime: 7.2,
    createdAt: '2025-01-01 00:00:00',
  },
  {
    id: 3,
    name: '客服小张',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent3',
    status: 'online',
    skills: ['technical', 'payment', 'general'],
    maxConcurrent: 3,
    currentTickets: 1,
    totalTickets: 98,
    avgSatisfaction: 4.9,
    avgResponseTime: 6,
    onlineTime: 5.8,
    createdAt: '2025-02-01 00:00:00',
  },
  {
    id: 4,
    name: '客服小刘',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent4',
    status: 'break',
    skills: ['vehicle', 'technical', 'general'],
    maxConcurrent: 4,
    currentTickets: 0,
    totalTickets: 134,
    avgSatisfaction: 4.7,
    avgResponseTime: 9,
    onlineTime: 4.5,
    createdAt: '2025-01-15 00:00:00',
  },
  {
    id: 5,
    name: '客服小陈',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent5',
    status: 'offline',
    skills: ['order', 'refund', 'general'],
    maxConcurrent: 5,
    currentTickets: 0,
    totalTickets: 187,
    avgSatisfaction: 4.5,
    avgResponseTime: 12,
    onlineTime: 0,
    createdAt: '2025-01-10 00:00:00',
  },
]

// Mock 智能路由配置
let mockRoutingConfig: RoutingConfig = {
  id: 1,
  enableAutoRouting: true,
  routingStrategy: 'skill',
  skillMatching: true,
  loadBalancing: true,
  priorityFirst: true,
  maxWaitTime: 5,
  autoEscalate: true,
  escalateTime: 30,
  workingHours: {
    start: '09:00',
    end: '18:00',
  },
  updatedAt: '2025-12-03 10:00:00',
}

// Mock 知识库数据
const mockKnowledgeArticles: KnowledgeArticle[] = [
  {
    id: 1,
    title: '如何预订房车？',
    content: '# 房车预订流程\n\n1. 打开小程序\n2. 选择车型\n3. 选择日期\n4. 填写信息\n5. 支付订单',
    category: 'guide',
    tags: ['预订', '新手'],
    viewCount: 1250,
    likeCount: 98,
    isPublished: true,
    authorId: 1,
    authorName: '管理员',
    createdAt: '2025-01-01 00:00:00',
    updatedAt: '2025-12-01 10:00:00',
  },
  {
    id: 2,
    title: '房车驾驶注意事项',
    content: '# 房车驾驶安全指南\n\n1. 控制车速\n2. 注意转弯半径\n3. 检查车况\n4. 遵守交通规则',
    category: 'guide',
    tags: ['驾驶', '安全'],
    viewCount: 980,
    likeCount: 76,
    isPublished: true,
    authorId: 1,
    authorName: '管理员',
    createdAt: '2025-01-05 00:00:00',
    updatedAt: '2025-11-20 10:00:00',
  },
  {
    id: 3,
    title: '退款政策说明',
    content: '# 退款政策\n\n## 全额退款\n- 提前7天以上取消\n\n## 部分退款\n- 提前3-7天取消，退款50%\n\n## 不予退款\n- 提前3天内取消',
    category: 'policy',
    tags: ['退款', '政策'],
    viewCount: 2100,
    likeCount: 145,
    isPublished: true,
    authorId: 1,
    authorName: '管理员',
    createdAt: '2025-01-01 00:00:00',
    updatedAt: '2025-12-01 10:00:00',
  },
  {
    id: 4,
    title: '常见技术问题解答',
    content: '# 技术问题FAQ\n\n## 支付失败怎么办？\n1. 检查网络\n2. 检查余额\n3. 联系客服\n\n## 无法登录怎么办？\n1. 检查手机号\n2. 重置密码\n3. 联系客服',
    category: 'faq',
    tags: ['技术', 'FAQ'],
    viewCount: 1560,
    likeCount: 112,
    isPublished: true,
    authorId: 2,
    authorName: '技术支持',
    createdAt: '2025-01-10 00:00:00',
    updatedAt: '2025-11-25 10:00:00',
  },
  {
    id: 5,
    title: '房车保险说明',
    content: '# 房车保险\n\n我们为每辆房车购买了全险，包括：\n- 车损险\n- 第三者责任险\n- 司乘险\n- 盗抢险',
    category: 'policy',
    tags: ['保险', '政策'],
    viewCount: 890,
    likeCount: 67,
    isPublished: true,
    authorId: 1,
    authorName: '管理员',
    createdAt: '2025-01-01 00:00:00',
    updatedAt: '2025-10-15 10:00:00',
  },
]

// API 函数

/**
 * 获取工单列表
 */
export function getTickets(params: {
  page: number
  pageSize: number
  status?: TicketStatus
  type?: TicketType
  priority?: TicketPriority
  assigneeId?: number
  keyword?: string
}): Promise<{ list: Ticket[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockTickets]

      // 筛选
      if (params.status) {
        filteredList = filteredList.filter((item) => item.status === params.status)
      }
      if (params.type) {
        filteredList = filteredList.filter((item) => item.type === params.type)
      }
      if (params.priority) {
        filteredList = filteredList.filter((item) => item.priority === params.priority)
      }
      if (params.assigneeId) {
        filteredList = filteredList.filter((item) => item.assigneeId === params.assigneeId)
      }
      if (params.keyword) {
        filteredList = filteredList.filter(
          (item) =>
            item.ticketNo.includes(params.keyword!) ||
            item.title.includes(params.keyword!) ||
            item.userName.includes(params.keyword!)
        )
      }

      // 分页
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = filteredList.slice(start, end)

      resolve({
        list,
        total: filteredList.length,
      })
    }, 300)
  })
}

/**
 * 获取工单统计
 */
export function getTicketStats(): Promise<TicketStats> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: TicketStats = {
        totalTickets: mockTickets.length,
        pendingTickets: mockTickets.filter((item) => item.status === 'pending').length,
        processingTickets: mockTickets.filter((item) => item.status === 'processing').length,
        resolvedTickets: mockTickets.filter((item) => item.status === 'resolved').length,
        closedTickets: mockTickets.filter((item) => item.status === 'closed').length,
        avgResponseTime: 11.6,
        avgResolveTime: 1.1,
        avgSatisfaction: 4.6,
        todayTickets: 3,
      }
      resolve(stats)
    }, 200)
  })
}

/**
 * 分配工单
 */
export function assignTicket(id: number, assigneeId: number, assigneeName: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockTickets.findIndex((item) => item.id === id)
      if (index !== -1) {
        mockTickets[index].assigneeId = assigneeId
        mockTickets[index].assigneeName = assigneeName
        mockTickets[index].status = 'processing'
        mockTickets[index].updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
      resolve()
    }, 300)
  })
}

/**
 * 更新工单状态
 */
export function updateTicketStatus(id: number, status: TicketStatus): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockTickets.findIndex((item) => item.id === id)
      if (index !== -1) {
        mockTickets[index].status = status
        mockTickets[index].updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
        if (status === 'resolved') {
          mockTickets[index].resolvedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
        } else if (status === 'closed') {
          mockTickets[index].closedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
        }
      }
      resolve()
    }, 300)
  })
}

/**
 * 获取客服人员列表
 */
export function getServiceAgents(params?: {
  status?: ServiceStatus
  skill?: ServiceSkill
}): Promise<ServiceAgent[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockServiceAgents]

      if (params?.status) {
        filteredList = filteredList.filter((item) => item.status === params.status)
      }
      if (params?.skill) {
        filteredList = filteredList.filter((item) => item.skills.includes(params.skill!))
      }

      resolve(filteredList)
    }, 200)
  })
}

/**
 * 更新客服状态
 */
export function updateServiceAgentStatus(id: number, status: ServiceStatus): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockServiceAgents.findIndex((item) => item.id === id)
      if (index !== -1) {
        mockServiceAgents[index].status = status
      }
      resolve()
    }, 300)
  })
}

/**
 * 获取智能路由配置
 */
export function getRoutingConfig(): Promise<RoutingConfig> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRoutingConfig)
    }, 200)
  })
}

/**
 * 更新智能路由配置
 */
export function updateRoutingConfig(data: Partial<RoutingConfig>): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockRoutingConfig = {
        ...mockRoutingConfig,
        ...data,
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }
      resolve()
    }, 300)
  })
}

/**
 * 获取知识库文章列表
 */
export function getKnowledgeArticles(params: {
  page: number
  pageSize: number
  category?: KnowledgeCategory
  isPublished?: boolean
  keyword?: string
}): Promise<{ list: KnowledgeArticle[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockKnowledgeArticles]

      // 筛选
      if (params.category) {
        filteredList = filteredList.filter((item) => item.category === params.category)
      }
      if (params.isPublished !== undefined) {
        filteredList = filteredList.filter((item) => item.isPublished === params.isPublished)
      }
      if (params.keyword) {
        filteredList = filteredList.filter(
          (item) =>
            item.title.includes(params.keyword!) || item.content.includes(params.keyword!)
        )
      }

      // 分页
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = filteredList.slice(start, end)

      resolve({
        list,
        total: filteredList.length,
      })
    }, 300)
  })
}

/**
 * 获取知识库统计
 */
export function getKnowledgeStats(): Promise<KnowledgeStats> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: KnowledgeStats = {
        totalArticles: mockKnowledgeArticles.length,
        publishedArticles: mockKnowledgeArticles.filter((item) => item.isPublished).length,
        totalViews: mockKnowledgeArticles.reduce((sum, item) => sum + item.viewCount, 0),
        totalLikes: mockKnowledgeArticles.reduce((sum, item) => sum + item.likeCount, 0),
        avgViewsPerArticle: 1356,
        topArticles: mockKnowledgeArticles
          .sort((a, b) => b.viewCount - a.viewCount)
          .slice(0, 5)
          .map((item) => ({
            id: item.id,
            title: item.title,
            viewCount: item.viewCount,
          })),
      }
      resolve(stats)
    }, 200)
  })
}

/**
 * 创建知识库文章
 */
export function createKnowledgeArticle(
  data: Partial<KnowledgeArticle>
): Promise<KnowledgeArticle> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newArticle: KnowledgeArticle = {
        id: mockKnowledgeArticles.length + 1,
        title: data.title!,
        content: data.content!,
        category: data.category || 'other',
        tags: data.tags || [],
        viewCount: 0,
        likeCount: 0,
        isPublished: data.isPublished ?? false,
        authorId: 1,
        authorName: '当前管理员',
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }
      mockKnowledgeArticles.push(newArticle)
      resolve(newArticle)
    }, 300)
  })
}

/**
 * 更新知识库文章
 */
export function updateKnowledgeArticle(
  id: number,
  data: Partial<KnowledgeArticle>
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockKnowledgeArticles.findIndex((item) => item.id === id)
      if (index !== -1) {
        mockKnowledgeArticles[index] = {
          ...mockKnowledgeArticles[index],
          ...data,
          updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }
      }
      resolve()
    }, 300)
  })
}

/**
 * 删除知识库文章
 */
export function deleteKnowledgeArticle(id: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockKnowledgeArticles.findIndex((item) => item.id === id)
      if (index !== -1) {
        mockKnowledgeArticles.splice(index, 1)
      }
      resolve()
    }, 300)
  })
}
