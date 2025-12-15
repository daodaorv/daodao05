/**
 * 社区管理 Mock 数据
 */

// 内容类型
export type ContentType = 'post' | 'comment' | 'reply' | 'image' | 'video'

// 审核状态
export type ReviewStatus = 'pending' | 'ai_approved' | 'ai_rejected' | 'manual_approved' | 'manual_rejected'

// 违规类型
export type ViolationType =
  | 'spam'              // 垃圾广告
  | 'pornography'       // 色情内容
  | 'violence'          // 暴力内容
  | 'politics'          // 政治敏感
  | 'illegal'           // 违法信息
  | 'fraud'             // 诈骗信息
  | 'harassment'        // 骚扰辱骂
  | 'copyright'         // 侵权内容
  | 'other'             // 其他违规

// 处理状态
export type HandleStatus = 'pending' | 'processing' | 'resolved' | 'rejected'

// 版块状态
export type SectionStatus = 'active' | 'inactive' | 'archived'

// 内容审核记录
export interface ContentReview {
  id: number
  contentId: number
  contentType: ContentType
  userId: number
  userName: string
  userAvatar: string
  title: string
  content: string
  images: string[]
  videos: string[]
  status: ReviewStatus
  aiScore: number              // AI审核分数 0-100
  aiReason: string             // AI审核原因
  violationType: ViolationType | null
  reviewerId: number | null
  reviewerName: string | null
  reviewReason: string
  createdAt: string
  reviewedAt: string | null
  sectionId: number
  sectionName: string
}

// 内容审核统计
export interface ContentReviewStats {
  totalPending: number
  aiApproved: number
  aiRejected: number
  manualApproved: number
  manualRejected: number
  todayReviewed: number
  avgReviewTime: number        // 平均审核时长（分钟）
}

// 社区版块
export interface CommunitySection {
  id: number
  name: string
  description: string
  icon: string
  sort: number
  status: SectionStatus
  postCount: number
  memberCount: number
  moderatorIds: number[]
  moderatorNames: string[]
  allowPost: boolean           // 是否允许发帖
  allowComment: boolean        // 是否允许评论
  requireReview: boolean       // 是否需要审核
  createdAt: string
  updatedAt: string
}

// 社区配置
export interface CommunityConfig {
  id: number
  enableAiReview: boolean      // 启用AI审核
  aiThreshold: number          // AI审核阈值 0-100
  enableManualReview: boolean  // 启用人工审核
  autoPublishScore: number     // 自动发布分数阈值
  sensitiveWords: string[]     // 敏感词列表
  maxPostLength: number        // 最大帖子长度
  maxImageCount: number        // 最大图片数量
  maxVideoCount: number        // 最大视频数量
  allowAnonymous: boolean      // 允许匿名发帖
  updatedAt: string
}

// 举报记录
export interface Report {
  id: number
  reportType: 'content' | 'user'
  targetId: number
  targetType: ContentType | 'user'
  targetContent: string
  targetUserId: number
  targetUserName: string
  reporterId: number
  reporterName: string
  reportReason: ViolationType
  reportDescription: string
  images: string[]
  status: HandleStatus
  handleResult: string
  handlerId: number | null
  handlerName: string | null
  createdAt: string
  handledAt: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

// 举报统计
export interface ReportStats {
  totalReports: number
  pendingReports: number
  processingReports: number
  resolvedReports: number
  rejectedReports: number
  avgHandleTime: number        // 平均处理时长（小时）
}

// Mock 内容审核数据
let mockContentReviews: ContentReview[] = [
  {
    id: 1,
    contentId: 1001,
    contentType: 'post',
    userId: 101,
    userName: '房车爱好者',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    title: '川藏线房车自驾游攻略分享',
    content: '刚从川藏线回来，分享一下这次房车自驾的经验和注意事项...',
    images: [
      'https://picsum.photos/400/300?random=1',
      'https://picsum.photos/400/300?random=2',
    ],
    videos: [],
    status: 'ai_approved',
    aiScore: 95,
    aiReason: '内容健康，无违规信息',
    violationType: null,
    reviewerId: null,
    reviewerName: null,
    reviewReason: '',
    createdAt: '2025-12-03 10:30:00',
    reviewedAt: '2025-12-03 10:30:05',
    sectionId: 1,
    sectionName: '旅游攻略',
  },
  {
    id: 2,
    contentId: 1002,
    contentType: 'post',
    userId: 102,
    userName: '自驾达人',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    title: '房车露营装备推荐',
    content: '给大家推荐一些实用的房车露营装备，某宝链接...',
    images: ['https://picsum.photos/400/300?random=3'],
    videos: [],
    status: 'ai_rejected',
    aiScore: 35,
    aiReason: '疑似广告内容，包含购物链接',
    violationType: 'spam',
    reviewerId: null,
    reviewerName: null,
    reviewReason: '',
    createdAt: '2025-12-03 11:15:00',
    reviewedAt: '2025-12-03 11:15:03',
    sectionId: 2,
    sectionName: '装备交流',
  },
  {
    id: 3,
    contentId: 1003,
    contentType: 'comment',
    userId: 103,
    userName: '新手上路',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    title: '',
    content: '楼主说得太好了，我也想去川藏线，有没有组队的？',
    images: [],
    videos: [],
    status: 'pending',
    aiScore: 88,
    aiReason: '内容正常，建议人工复核',
    violationType: null,
    reviewerId: null,
    reviewerName: null,
    reviewReason: '',
    createdAt: '2025-12-03 12:00:00',
    reviewedAt: null,
    sectionId: 1,
    sectionName: '旅游攻略',
  },
  {
    id: 4,
    contentId: 1004,
    contentType: 'post',
    userId: 104,
    userName: '营地推荐',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    title: '云南大理洱海边的绝美营地',
    content: '发现一个超美的营地，就在洱海边，风景绝了！',
    images: [
      'https://picsum.photos/400/300?random=4',
      'https://picsum.photos/400/300?random=5',
      'https://picsum.photos/400/300?random=6',
    ],
    videos: ['https://example.com/video1.mp4'],
    status: 'manual_approved',
    aiScore: 92,
    aiReason: '内容健康',
    violationType: null,
    reviewerId: 1,
    reviewerName: '审核员A',
    reviewReason: '内容优质，通过审核',
    createdAt: '2025-12-03 09:00:00',
    reviewedAt: '2025-12-03 09:10:00',
    sectionId: 3,
    sectionName: '营地推荐',
  },
  {
    id: 5,
    contentId: 1005,
    contentType: 'post',
    userId: 105,
    userName: '违规用户',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    title: '低价出售二手房车',
    content: '联系方式：微信xxxxx，电话xxxxx',
    images: [],
    videos: [],
    status: 'manual_rejected',
    aiScore: 25,
    aiReason: '疑似广告，包含联系方式',
    violationType: 'spam',
    reviewerId: 1,
    reviewerName: '审核员A',
    reviewReason: '违规广告，拒绝发布',
    createdAt: '2025-12-03 08:00:00',
    reviewedAt: '2025-12-03 08:05:00',
    sectionId: 2,
    sectionName: '装备交流',
  },
]

// Mock 社区版块数据
let mockSections: CommunitySection[] = [
  {
    id: 1,
    name: '旅游攻略',
    description: '分享房车旅游攻略、路线规划、景点推荐',
    icon: 'Map',
    sort: 1,
    status: 'active',
    postCount: 1250,
    memberCount: 3500,
    moderatorIds: [1, 2],
    moderatorNames: ['版主A', '版主B'],
    allowPost: true,
    allowComment: true,
    requireReview: true,
    createdAt: '2025-01-01 00:00:00',
    updatedAt: '2025-12-03 10:00:00',
  },
  {
    id: 2,
    name: '装备交流',
    description: '房车装备、露营用品、改装配件交流',
    icon: 'Box',
    sort: 2,
    status: 'active',
    postCount: 850,
    memberCount: 2800,
    moderatorIds: [1, 3],
    moderatorNames: ['版主A', '版主C'],
    allowPost: true,
    allowComment: true,
    requireReview: true,
    createdAt: '2025-01-01 00:00:00',
    updatedAt: '2025-12-03 10:00:00',
  },
  {
    id: 3,
    name: '营地推荐',
    description: '推荐优质营地、分享露营体验',
    icon: 'Place',
    sort: 3,
    status: 'active',
    postCount: 620,
    memberCount: 2200,
    moderatorIds: [2],
    moderatorNames: ['版主B'],
    allowPost: true,
    allowComment: true,
    requireReview: false,
    createdAt: '2025-01-01 00:00:00',
    updatedAt: '2025-12-03 10:00:00',
  },
  {
    id: 4,
    name: '新手入门',
    description: '新手问题解答、房车知识科普',
    icon: 'QuestionFilled',
    sort: 4,
    status: 'active',
    postCount: 980,
    memberCount: 4200,
    moderatorIds: [3],
    moderatorNames: ['版主C'],
    allowPost: true,
    allowComment: true,
    requireReview: false,
    createdAt: '2025-01-01 00:00:00',
    updatedAt: '2025-12-03 10:00:00',
  },
  {
    id: 5,
    name: '维修保养',
    description: '房车维修、保养经验分享',
    icon: 'Tools',
    sort: 5,
    status: 'active',
    postCount: 450,
    memberCount: 1800,
    moderatorIds: [1],
    moderatorNames: ['版主A'],
    allowPost: true,
    allowComment: true,
    requireReview: false,
    createdAt: '2025-01-01 00:00:00',
    updatedAt: '2025-12-03 10:00:00',
  },
]

// Mock 举报数据
let mockReports: Report[] = [
  {
    id: 1,
    reportType: 'content',
    targetId: 1002,
    targetType: 'post',
    targetContent: '房车露营装备推荐，某宝链接...',
    targetUserId: 102,
    targetUserName: '自驾达人',
    reporterId: 201,
    reporterName: '用户A',
    reportReason: 'spam',
    reportDescription: '这是广告帖，包含购物链接',
    images: ['https://picsum.photos/400/300?random=10'],
    status: 'resolved',
    handleResult: '确认为广告内容，已删除帖子并警告用户',
    handlerId: 1,
    handlerName: '管理员A',
    createdAt: '2025-12-03 11:20:00',
    handledAt: '2025-12-03 11:30:00',
    priority: 'medium',
  },
  {
    id: 2,
    reportType: 'user',
    targetId: 105,
    targetType: 'user',
    targetContent: '',
    targetUserId: 105,
    targetUserName: '违规用户',
    reporterId: 202,
    reporterName: '用户B',
    reportReason: 'spam',
    reportDescription: '该用户频繁发布广告信息',
    images: [],
    status: 'pending',
    handleResult: '',
    handlerId: null,
    handlerName: null,
    createdAt: '2025-12-03 12:00:00',
    handledAt: null,
    priority: 'high',
  },
  {
    id: 3,
    reportType: 'content',
    targetId: 1006,
    targetType: 'comment',
    targetContent: '你这个傻X，懂个屁！',
    targetUserId: 106,
    targetUserName: '暴躁老哥',
    reporterId: 203,
    reporterName: '用户C',
    reportReason: 'harassment',
    reportDescription: '恶意辱骂其他用户',
    images: [],
    status: 'processing',
    handleResult: '',
    handlerId: 2,
    handlerName: '管理员B',
    createdAt: '2025-12-03 10:00:00',
    handledAt: null,
    priority: 'urgent',
  },
  {
    id: 4,
    reportType: 'content',
    targetId: 1007,
    targetType: 'post',
    targetContent: '分享一些房车旅游的照片',
    targetUserId: 107,
    targetUserName: '摄影爱好者',
    reporterId: 204,
    reporterName: '用户D',
    reportReason: 'copyright',
    reportDescription: '这些照片是我拍的，他盗用了',
    images: ['https://picsum.photos/400/300?random=11'],
    status: 'rejected',
    handleResult: '经核实，举报人未能提供充分证据',
    handlerId: 1,
    handlerName: '管理员A',
    createdAt: '2025-12-02 15:00:00',
    handledAt: '2025-12-02 16:00:00',
    priority: 'low',
  },
]

// Mock 社区配置
let mockCommunityConfig: CommunityConfig = {
  id: 1,
  enableAiReview: true,
  aiThreshold: 60,
  enableManualReview: true,
  autoPublishScore: 90,
  sensitiveWords: ['广告', '微信', '电话', '加我', '联系方式'],
  maxPostLength: 5000,
  maxImageCount: 9,
  maxVideoCount: 3,
  allowAnonymous: false,
  updatedAt: '2025-12-03 10:00:00',
}

// API 函数

/**
 * 获取内容审核列表
 */
export function getContentReviews(params: {
  page: number
  pageSize: number
  status?: ReviewStatus
  contentType?: ContentType
  sectionId?: number
  keyword?: string
}): Promise<{ list: ContentReview[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockContentReviews]

      // 筛选
      if (params.status) {
        filteredList = filteredList.filter((item) => item.status === params.status)
      }
      if (params.contentType) {
        filteredList = filteredList.filter((item) => item.contentType === params.contentType)
      }
      if (params.sectionId) {
        filteredList = filteredList.filter((item) => item.sectionId === params.sectionId)
      }
      if (params.keyword) {
        filteredList = filteredList.filter(
          (item) =>
            item.title.includes(params.keyword!) ||
            item.content.includes(params.keyword!) ||
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
 * 获取内容审核统计
 */
export function getContentReviewStats(): Promise<ContentReviewStats> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: ContentReviewStats = {
        totalPending: mockContentReviews.filter((item) => item.status === 'pending').length,
        aiApproved: mockContentReviews.filter((item) => item.status === 'ai_approved').length,
        aiRejected: mockContentReviews.filter((item) => item.status === 'ai_rejected').length,
        manualApproved: mockContentReviews.filter((item) => item.status === 'manual_approved')
          .length,
        manualRejected: mockContentReviews.filter((item) => item.status === 'manual_rejected')
          .length,
        todayReviewed: 45,
        avgReviewTime: 5.2,
      }
      resolve(stats)
    }, 200)
  })
}

/**
 * 审核内容
 */
export function reviewContent(params: {
  id: number
  status: 'manual_approved' | 'manual_rejected'
  reason: string
  violationType?: ViolationType
}): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockContentReviews.findIndex((item) => item.id === params.id)
      if (index !== -1) {
        mockContentReviews[index].status = params.status
        mockContentReviews[index].reviewReason = params.reason
        mockContentReviews[index].reviewerId = 1
        mockContentReviews[index].reviewerName = '当前管理员'
        mockContentReviews[index].reviewedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
        if (params.violationType) {
          mockContentReviews[index].violationType = params.violationType
        }
      }
      resolve()
    }, 300)
  })
}

/**
 * 批量审核内容
 */
export function batchReviewContent(params: {
  ids: number[]
  status: 'manual_approved' | 'manual_rejected'
  reason: string
}): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      params.ids.forEach((id) => {
        const index = mockContentReviews.findIndex((item) => item.id === id)
        if (index !== -1) {
          mockContentReviews[index].status = params.status
          mockContentReviews[index].reviewReason = params.reason
          mockContentReviews[index].reviewerId = 1
          mockContentReviews[index].reviewerName = '当前管理员'
          mockContentReviews[index].reviewedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
        }
      })
      resolve()
    }, 500)
  })
}

/**
 * 获取社区版块列表
 */
export function getCommunitySections(params?: {
  status?: SectionStatus
  keyword?: string
}): Promise<CommunitySection[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockSections]

      if (params?.status) {
        filteredList = filteredList.filter((item) => item.status === params.status)
      }
      if (params?.keyword) {
        filteredList = filteredList.filter(
          (item) =>
            item.name.includes(params.keyword!) || item.description.includes(params.keyword!)
        )
      }

      resolve(filteredList)
    }, 200)
  })
}

/**
 * 创建社区版块
 */
export function createCommunitySection(data: Partial<CommunitySection>): Promise<CommunitySection> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newSection: CommunitySection = {
        id: mockSections.length + 1,
        name: data.name!,
        description: data.description!,
        icon: data.icon || 'Document',
        sort: data.sort || mockSections.length + 1,
        status: data.status || 'active',
        postCount: 0,
        memberCount: 0,
        moderatorIds: data.moderatorIds || [],
        moderatorNames: data.moderatorNames || [],
        allowPost: data.allowPost ?? true,
        allowComment: data.allowComment ?? true,
        requireReview: data.requireReview ?? false,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }
      mockSections.push(newSection)
      resolve(newSection)
    }, 300)
  })
}

/**
 * 更新社区版块
 */
export function updateCommunitySection(
  id: number,
  data: Partial<CommunitySection>
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockSections.findIndex((item) => item.id === id)
      if (index !== -1) {
        mockSections[index] = {
          ...mockSections[index],
          ...data,
          updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }
      }
      resolve()
    }, 300)
  })
}

/**
 * 删除社区版块
 */
export function deleteCommunitySection(id: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockSections.findIndex((item) => item.id === id)
      if (index !== -1) {
        mockSections.splice(index, 1)
      }
      resolve()
    }, 300)
  })
}

/**
 * 获取举报列表
 */
export function getReports(params: {
  page: number
  pageSize: number
  status?: HandleStatus
  reportType?: 'content' | 'user'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  keyword?: string
}): Promise<{ list: Report[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockReports]

      // 筛选
      if (params.status) {
        filteredList = filteredList.filter((item) => item.status === params.status)
      }
      if (params.reportType) {
        filteredList = filteredList.filter((item) => item.reportType === params.reportType)
      }
      if (params.priority) {
        filteredList = filteredList.filter((item) => item.priority === params.priority)
      }
      if (params.keyword) {
        filteredList = filteredList.filter(
          (item) =>
            item.targetContent.includes(params.keyword!) ||
            item.targetUserName.includes(params.keyword!) ||
            item.reporterName.includes(params.keyword!)
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
 * 获取举报统计
 */
export function getReportStats(): Promise<ReportStats> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: ReportStats = {
        totalReports: mockReports.length,
        pendingReports: mockReports.filter((item) => item.status === 'pending').length,
        processingReports: mockReports.filter((item) => item.status === 'processing').length,
        resolvedReports: mockReports.filter((item) => item.status === 'resolved').length,
        rejectedReports: mockReports.filter((item) => item.status === 'rejected').length,
        avgHandleTime: 2.5,
      }
      resolve(stats)
    }, 200)
  })
}

/**
 * 处理举报
 */
export function handleReport(params: {
  id: number
  status: 'resolved' | 'rejected'
  handleResult: string
}): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockReports.findIndex((item) => item.id === params.id)
      if (index !== -1) {
        mockReports[index].status = params.status
        mockReports[index].handleResult = params.handleResult
        mockReports[index].handlerId = 1
        mockReports[index].handlerName = '当前管理员'
        mockReports[index].handledAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
      resolve()
    }, 300)
  })
}

/**
 * 分配举报处理人
 */
export function assignReport(id: number, handlerId: number, handlerName: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockReports.findIndex((item) => item.id === id)
      if (index !== -1) {
        mockReports[index].status = 'processing'
        mockReports[index].handlerId = handlerId
        mockReports[index].handlerName = handlerName
      }
      resolve()
    }, 300)
  })
}

/**
 * 获取社区配置
 */
export function getCommunityConfig(): Promise<CommunityConfig> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCommunityConfig)
    }, 200)
  })
}

/**
 * 更新社区配置
 */
export function updateCommunityConfig(data: Partial<CommunityConfig>): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockCommunityConfig = {
        ...mockCommunityConfig,
        ...data,
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }
      resolve()
    }, 300)
  })
}
