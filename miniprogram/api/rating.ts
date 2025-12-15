/**
 * 评价反馈API
 * 提供服务评价相关的接口服务
 */

import { request } from '@/utils/request'

/**
 * 评价类型
 */
export type RatingType = 'VEHICLE' | 'CAMPSITE' | 'TOUR'

/**
 * 评价状态
 */
export type RatingStatus = 'PENDING' | 'PUBLISHED' | 'REJECTED'

/**
 * 评价信息
 */
export interface Rating {
  id: string
  userId: string
  userName: string
  userAvatar: string
  orderId: string
  type: RatingType
  targetId: string
  targetName: string
  rating: number // 1-5星
  content: string
  images: string[]
  tags: string[]
  status: RatingStatus
  rewardPoints: number
  createdAt: string
  updatedAt?: string
  reply?: RatingReply
}

/**
 * 评价回复
 */
export interface RatingReply {
  id: string
  content: string
  createdAt: string
}

/**
 * 创建评价请求参数
 */
export interface CreateRatingParams {
  orderId: string
  type: RatingType
  targetId: string
  rating: number
  content: string
  images?: string[]
  tags?: string[]
}

/**
 * 更新评价请求参数
 */
export interface UpdateRatingParams {
  rating?: number
  content?: string
  images?: string[]
  tags?: string[]
}

/**
 * 评价列表查询参数
 */
export interface RatingListParams {
  type?: RatingType
  status?: RatingStatus
  page?: number
  pageSize?: number
}

/**
 * 评价列表响应
 */
export interface RatingListResponse {
  list: Rating[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/**
 * 创建评价
 */
export const createRating = (data: CreateRatingParams) => {
  return request<Rating>({
    url: '/api/v1/ratings',
    method: 'POST',
    data
  })
}

/**
 * 获取我的评价列表
 */
export const getMyRatings = (params: RatingListParams) => {
  return request<RatingListResponse>({
    url: '/api/v1/ratings',
    method: 'GET',
    data: params
  })
}

/**
 * 获取评价详情
 */
export const getRatingDetail = (id: string) => {
  return request<Rating>({
    url: `/api/v1/ratings/${id}`,
    method: 'GET'
  })
}

/**
 * 更新评价
 */
export const updateRating = (id: string, data: UpdateRatingParams) => {
  return request<Rating>({
    url: `/api/v1/ratings/${id}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除评价
 */
export const deleteRating = (id: string) => {
  return request({
    url: `/api/v1/ratings/${id}`,
    method: 'DELETE'
  })
}

/**
 * 上传评价图片
 */
export const uploadRatingImage = (filePath: string) => {
  return new Promise<string>((resolve, reject) => {
    uni.uploadFile({
      url: '/api/v1/ratings/upload-image',
      filePath,
      name: 'file',
      success: (res) => {
        const data = JSON.parse(res.data)
        if (data.code === 0) {
          resolve(data.data.url)
        } else {
          reject(new Error(data.message))
        }
      },
      fail: reject
    })
  })
}

// ==================== Mock 数据 ====================

/**
 * Mock: 创建评价
 */
export const mockCreateRating = (data: CreateRatingParams): Promise<Rating> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 根据评分计算奖励积分
      let rewardPoints = 10
      if (data.rating >= 4) rewardPoints = 30
      if (data.images && data.images.length > 0) rewardPoints += 20

      resolve({
        id: 'rating_' + Date.now(),
        userId: 'user_001',
        userName: '房车旅行家',
        userAvatar: '/static/images/default-avatar.png',
        orderId: data.orderId,
        type: data.type,
        targetId: data.targetId,
        targetName: getTargetName(data.type),
        rating: data.rating,
        content: data.content,
        images: data.images || [],
        tags: data.tags || [],
        status: 'PUBLISHED',
        rewardPoints,
        createdAt: new Date().toISOString()
      })
    }, 800)
  })
}

/**
 * Mock: 获取我的评价列表
 */
export const mockGetMyRatings = (params: RatingListParams): Promise<RatingListResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockRatings: Rating[] = [
        {
          id: 'rating_001',
          userId: 'user_001',
          userName: '房车旅行家',
          userAvatar: '/static/images/default-avatar.png',
          orderId: 'order_001',
          type: 'VEHICLE',
          targetId: 'vehicle_001',
          targetName: '依维柯欧胜C型房车',
          rating: 5,
          content: '车况非常好，内部设施齐全，驾驶体验很棒！门店服务也很周到，取还车都很方便。强烈推荐给想要体验房车旅行的朋友们！',
          images: [
            '/static/images/rating-1.jpg',
            '/static/images/rating-2.jpg',
            '/static/images/rating-3.jpg'
          ],
          tags: ['车况好', '服务好', '性价比高'],
          status: 'PUBLISHED',
          rewardPoints: 50,
          createdAt: '2025-11-25T10:30:00+08:00',
          reply: {
            id: 'reply_001',
            content: '感谢您的好评！我们会继续努力为您提供更好的服务。',
            createdAt: '2025-11-25T14:20:00+08:00'
          }
        },
        {
          id: 'rating_002',
          userId: 'user_001',
          userName: '房车旅行家',
          userAvatar: '/static/images/default-avatar.png',
          orderId: 'order_002',
          type: 'CAMPSITE',
          targetId: 'campsite_001',
          targetName: '千岛湖房车营地',
          rating: 4.5,
          content: '营地环境很好，设施完善，工作人员服务态度也不错。唯一的小遗憾是周末人比较多，有点吵。',
          images: [
            '/static/images/campsite-1.jpg'
          ],
          tags: ['环境好', '设施完善'],
          status: 'PUBLISHED',
          rewardPoints: 50,
          createdAt: '2025-11-20T16:45:00+08:00'
        },
        {
          id: 'rating_003',
          userId: 'user_001',
          userName: '房车旅行家',
          userAvatar: '/static/images/default-avatar.png',
          orderId: 'order_003',
          type: 'TOUR',
          targetId: 'tour_001',
          targetName: '川西秘境·稻城亚丁房车深度游',
          rating: 5,
          content: '这次旅行太棒了！领队非常专业，行程安排合理，沿途风景美不胜收。房车住宿体验也很新鲜，强烈推荐！',
          images: [
            '/static/images/tour-1.jpg',
            '/static/images/tour-2.jpg'
          ],
          tags: ['行程好', '领队专业', '风景美'],
          status: 'PUBLISHED',
          rewardPoints: 50,
          createdAt: '2025-11-15T09:20:00+08:00'
        }
      ]

      // 根据参数筛选
      let filteredRatings = mockRatings
      if (params.type) {
        filteredRatings = filteredRatings.filter(r => r.type === params.type)
      }
      if (params.status) {
        filteredRatings = filteredRatings.filter(r => r.status === params.status)
      }

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredRatings.slice(start, end)

      resolve({
        list,
        total: filteredRatings.length,
        page,
        pageSize,
        hasMore: end < filteredRatings.length
      })
    }, 500)
  })
}

/**
 * Mock: 更新评价
 */
export const mockUpdateRating = (id: string, data: UpdateRatingParams): Promise<Rating> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        userId: 'user_001',
        userName: '房车旅行家',
        userAvatar: '/static/images/default-avatar.png',
        orderId: 'order_001',
        type: 'VEHICLE',
        targetId: 'vehicle_001',
        targetName: '依维柯欧胜C型房车',
        rating: data.rating || 5,
        content: data.content || '',
        images: data.images || [],
        tags: data.tags || [],
        status: 'PUBLISHED',
        rewardPoints: 50,
        createdAt: '2025-11-25T10:30:00+08:00',
        updatedAt: new Date().toISOString()
      })
    }, 800)
  })
}

/**
 * Mock: 上传评价图片
 */
export const mockUploadRatingImage = (filePath: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟上传成功，返回图片URL
      resolve(`https://example.com/images/${Date.now()}.jpg`)
    }, 1000)
  })
}

// 辅助函数：根据类型获取目标名称
function getTargetName(type: RatingType): string {
  const names: Record<RatingType, string> = {
    VEHICLE: '依维柯欧胜C型房车',
    CAMPSITE: '千岛湖房车营地',
    TOUR: '川西秘境·稻城亚丁房车深度游'
  }
  return names[type]
}
