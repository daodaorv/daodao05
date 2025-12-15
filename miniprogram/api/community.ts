/**
 * 社区互动模块 API
 * 包含内容发布、详情、点赞、评论、收藏、关注等功能
 */

// ==================== TypeScript 类型定义 ====================

/**
 * 内容类型枚举
 */
export enum PostType {
  GUIDE = 'GUIDE',           // 攻略
  EXPERIENCE = 'EXPERIENCE', // 体验
  ACTIVITY = 'ACTIVITY',     // 活动
  QA = 'QA'                  // 问答
}

/**
 * 内容状态枚举
 */
export enum PostStatus {
  PENDING = 'PENDING',       // 待审核
  PUBLISHED = 'PUBLISHED',   // 已发布
  REJECTED = 'REJECTED'      // 已拒绝
}

/**
 * 社区帖子接口
 */
export interface CommunityPost {
  id: string
  userId: string
  userName: string
  userAvatar: string
  type: PostType
  title: string
  content: string
  images: string[]
  tags: string[]
  location?: string
  viewCount: number
  likeCount: number
  commentCount: number
  favoriteCount: number
  isLiked: boolean
  isFavorited: boolean
  status: PostStatus
  createdAt: string
}

/**
 * 发布内容请求参数
 */
export interface CreatePostParams {
  type: PostType
  title: string
  content: string
  images: string[]
  tags: string[]
  location?: string
}

/**
 * 评论接口
 */
export interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  replyToId?: string
  replyToUserId?: string
  replyToUserName?: string
  likeCount: number
  replyCount?: number
  createdAt: string
  replies?: Comment[]
}

/**
 * 评论请求参数
 */
export interface CommentParams {
  content: string
  replyToId?: string
  replyToUserId?: string
}

/**
 * 用户主页接口
 */
export interface UserProfile {
  id: string
  userName: string
  avatar: string
  bio: string
  postCount: number
  followerCount: number
  followingCount: number
  likeCount: number
  isFollowing: boolean
  posts: CommunityPost[]
}

// ==================== Mock 数据 ====================

/**
 * Mock 社区帖子数据
 */
const mockPosts: CommunityPost[] = [
  {
    id: 'post_001',
    userId: 'user_001',
    userName: '房车旅行家',
    userAvatar: '/static/images/default-avatar.png',
    type: PostType.GUIDE,
    title: '川西秘境·稻城亚丁房车自驾攻略',
    content: '# 川西秘境·稻城亚丁房车自驾攻略\n\n## 路线规划\n成都 → 雅安 → 康定 → 新都桥 → 稻城 → 亚丁\n\n## 注意事项\n1. 高原反应预防\n2. 路况信息\n3. 加油站分布\n\n详细攻略内容...',
    images: [
      '/static/images/post1.jpg',
      '/static/images/post2.jpg',
      '/static/images/post3.jpg'
    ],
    tags: ['川西', '稻城亚丁', '自驾攻略', '高原旅行'],
    location: '四川省甘孜藏族自治州',
    viewCount: 1250,
    likeCount: 89,
    commentCount: 23,
    favoriteCount: 45,
    isLiked: false,
    isFavorited: false,
    status: PostStatus.PUBLISHED,
    createdAt: '2025-11-25T10:00:00+08:00'
  },
  {
    id: 'post_002',
    userId: 'user_002',
    userName: '旅行达人',
    userAvatar: '/static/images/default-avatar.png',
    type: PostType.EXPERIENCE,
    title: '我的第一次房车旅行体验',
    content: '分享我第一次房车旅行的真实体验，从租车到还车的全过程...',
    images: ['/static/images/post4.jpg'],
    tags: ['房车体验', '新手指南'],
    location: '浙江省杭州市',
    viewCount: 856,
    likeCount: 67,
    commentCount: 15,
    favoriteCount: 32,
    isLiked: false,
    isFavorited: false,
    status: PostStatus.PUBLISHED,
    createdAt: '2025-11-26T14:30:00+08:00'
  }
]

/**
 * Mock 评论数据
 */
const mockComments: Comment[] = [
  {
    id: 'comment_001',
    postId: 'post_001',
    userId: 'user_002',
    userName: '旅行达人',
    userAvatar: '/static/images/default-avatar.png',
    content: '很棒的攻略！收藏了，准备下个月去',
    likeCount: 5,
    replyCount: 2,
    createdAt: '2025-11-26T10:00:00+08:00',
    replies: [
      {
        id: 'comment_002',
        postId: 'post_001',
        userId: 'user_001',
        userName: '房车旅行家',
        userAvatar: '/static/images/default-avatar.png',
        content: '谢谢支持！有问题随时问我',
        replyToId: 'comment_001',
        replyToUserId: 'user_002',
        replyToUserName: '旅行达人',
        likeCount: 2,
        createdAt: '2025-11-26T10:05:00+08:00'
      }
    ]
  }
]

/**
 * Mock 用户主页数据
 */
const mockUserProfile: UserProfile = {
  id: 'user_001',
  userName: '房车旅行家',
  avatar: '/static/images/default-avatar.png',
  bio: '热爱房车旅行，分享旅途故事和攻略',
  postCount: 25,
  followerCount: 1250,
  followingCount: 320,
  likeCount: 5680,
  isFollowing: false,
  posts: mockPosts
}

// ==================== API 函数 ====================

/**
 * 发布内容
 */
export const createPost = async (params: CreatePostParams): Promise<CommunityPost> => {
  // TODO: 替换为真实API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPost: CommunityPost = {
        id: `post_${Date.now()}`,
        userId: 'user_001',
        userName: '当前用户',
        userAvatar: '/static/images/default-avatar.png',
        type: params.type,
        title: params.title,
        content: params.content,
        images: params.images,
        tags: params.tags,
        location: params.location,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        favoriteCount: 0,
        isLiked: false,
        isFavorited: false,
        status: PostStatus.PENDING,
        createdAt: new Date().toISOString()
      }
      resolve(newPost)
    }, 500)
  })
}

/**
 * 获取内容详情
 */
export const getPostDetail = async (id: string): Promise<CommunityPost> => {
  // TODO: 替换为真实API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = mockPosts.find(p => p.id === id) || mockPosts[0]
      resolve(post)
    }, 300)
  })
}

/**
 * 点赞内容
 */
export const likePost = async (id: string): Promise<{ isLiked: boolean; likeCount: number }> => {
  // TODO: 替换为真实API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        isLiked: true,
        likeCount: 90
      })
    }, 300)
  })
}

/**
 * 取消点赞
 */
export const unlikePost = async (id: string): Promise<{ isLiked: boolean; likeCount: number }> => {
  // TODO: 替换为真实API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        isLiked: false,
        likeCount: 88
      })
    }, 300)
  })
}

/**
 * 评论内容
 */
export const commentPost = async (id: string, params: CommentParams): Promise<Comment> => {
  // TODO: 替换为真实API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      const newComment: Comment = {
        id: `comment_${Date.now()}`,
        postId: id,
        userId: 'user_001',
        userName: '当前用户',
        userAvatar: '/static/images/default-avatar.png',
        content: params.content,
        replyToId: params.replyToId,
        replyToUserId: params.replyToUserId,
        likeCount: 0,
        createdAt: new Date().toISOString()
      }
      resolve(newComment)
    }, 300)
  })
}

/**
 * 获取评论列表
 */
export const getComments = async (
  id: string,
  params: { page?: number; pageSize?: number } = {}
): Promise<{ list: Comment[]; total: number; hasMore: boolean }> => {
  // TODO: 替换为真实API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: mockComments,
        total: mockComments.length,
        hasMore: false
      })
    }, 300)
  })
}

/**
 * 收藏内容
 */
export const favoritePost = async (id: string): Promise<{ isFavorited: boolean; favoriteCount: number }> => {
  // TODO: 替换为真实API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        isFavorited: true,
        favoriteCount: 46
      })
    }, 300)
  })
}

/**
 * 取消收藏
 */
export const unfavoritePost = async (id: string): Promise<{ isFavorited: boolean; favoriteCount: number }> => {
  // TODO: 替换为真实API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        isFavorited: false,
        favoriteCount: 44
      })
    }, 300)
  })
}

/**
 * 获取用户主页
 */
export const getUserProfile = async (id: string): Promise<UserProfile> => {
  // TODO: 替换为真实API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUserProfile)
    }, 300)
  })
}

/**
 * 关注用户
 */
export const followUser = async (id: string): Promise<{ isFollowing: boolean; followerCount: number }> => {
  // TODO: 替换为真实API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        isFollowing: true,
        followerCount: 1251
      })
    }, 300)
  })
}

/**
 * 取消关注
 */
export const unfollowUser = async (id: string): Promise<{ isFollowing: boolean; followerCount: number }> => {
  // TODO: 替换为真实API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        isFollowing: false,
        followerCount: 1249
      })
    }, 300)
  })
}

/**
 * 上传图片
 */
export const uploadImage = async (filePath: string): Promise<{ url: string; thumbnail: string }> => {
  // TODO: 替换为真实API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟上传成功，返回图片URL
      resolve({
        url: filePath, // 实际应该返回服务器URL
        thumbnail: filePath
      })
    }, 1000)
  })
}

/**
 * Mock 获取帖子列表（用于社区首页）
 */
export const mockGetPosts = async (params: {
  type?: PostType
  page?: number
  pageSize?: number
}): Promise<{ list: CommunityPost[]; total: number; hasMore: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredPosts = mockPosts
      if (params.type) {
        filteredPosts = mockPosts.filter(p => p.type === params.type)
      }
      resolve({
        list: filteredPosts,
        total: filteredPosts.length,
        hasMore: false
      })
    }, 300)
  })
}
