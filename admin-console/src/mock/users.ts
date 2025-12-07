/**
 * 用户管理 Mock 数据
 * 注意：此文件只包含小程序注册的客户用户，管理员用户已移至员工管理系统
 */
import type { UserInfo, UserListResponse } from '@/api/user'

// Mock 用户列表数据（只包含客户用户）
export const mockUserList: UserInfo[] = [
  {
    id: 1,
    username: '张三',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    userType: 'customer',
    status: 'active',
    realName: '张三',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-05T10:30:00.000Z',
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-12-05T10:30:00.000Z',
  },
  {
    id: 2,
    username: '李四',
    phone: '13800138001',
    email: 'lisi@example.com',
    userType: 'customer',
    status: 'active',
    realName: '李四',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-04T15:20:00.000Z',
    createdAt: '2024-02-10T09:00:00.000Z',
    updatedAt: '2024-12-04T15:20:00.000Z',
  },
  {
    id: 3,
    username: '王五',
    phone: '13800138002',
    email: 'wangwu@example.com',
    userType: 'customer',
    status: 'inactive',
    realName: '王五',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-11-20T12:00:00.000Z',
    createdAt: '2024-03-05T10:00:00.000Z',
    updatedAt: '2024-11-20T12:00:00.000Z',
  },
  {
    id: 4,
    username: '周八',
    phone: '13800138005',
    email: 'zhouba@example.com',
    userType: 'customer',
    status: 'banned',
    realName: '周八',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-11-15T14:00:00.000Z',
    createdAt: '2024-06-01T08:00:00.000Z',
    updatedAt: '2024-11-25T10:00:00.000Z',
  },
  {
    id: 5,
    username: '吴九',
    phone: '13800138006',
    email: 'wujiu@example.com',
    userType: 'customer',
    status: 'active',
    realName: '吴九',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-05T08:30:00.000Z',
    createdAt: '2024-11-15T08:00:00.000Z',
    updatedAt: '2024-12-05T08:30:00.000Z',
  },
  {
    id: 6,
    username: '郑十',
    phone: '13800138007',
    email: 'zhengshi@example.com',
    userType: 'customer',
    status: 'active',
    realName: '郑十',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-04T16:00:00.000Z',
    createdAt: '2024-08-20T08:00:00.000Z',
    updatedAt: '2024-12-04T16:00:00.000Z',
  },
  {
    id: 7,
    username: '陈十一',
    phone: '13900139000',
    email: 'chenshiyi@example.com',
    userType: 'customer',
    status: 'active',
    realName: '陈十一',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-05T14:00:00.000Z',
    createdAt: '2024-09-01T08:00:00.000Z',
    updatedAt: '2024-12-05T14:00:00.000Z',
  },
  {
    id: 8,
    username: '黄十三',
    phone: '13900139002',
    email: 'huangshisan@example.com',
    userType: 'customer',
    status: 'inactive',
    realName: '黄十三',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [],
    lastLoginAt: '2024-11-10T10:00:00.000Z',
    createdAt: '2024-10-01T08:00:00.000Z',
    updatedAt: '2024-11-10T10:00:00.000Z',
  },
  {
    id: 9,
    username: '赵敏',
    phone: '13900139010',
    email: 'zhaomin@example.com',
    userType: 'customer',
    status: 'active',
    realName: '赵敏',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-05T09:00:00.000Z',
    createdAt: '2024-03-20T08:00:00.000Z',
    updatedAt: '2024-12-05T09:00:00.000Z',
  },
  {
    id: 10,
    username: '周芷若',
    phone: '13900139011',
    email: 'zhouzhiruo@example.com',
    userType: 'customer',
    status: 'active',
    realName: '周芷若',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-05T11:00:00.000Z',
    createdAt: '2024-04-10T08:00:00.000Z',
    updatedAt: '2024-12-05T11:00:00.000Z',
  },
  {
    id: 11,
    username: '张无忌',
    phone: '13900139012',
    email: 'zhangwuji@example.com',
    userType: 'customer',
    status: 'active',
    realName: '张无忌',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-05T13:00:00.000Z',
    createdAt: '2024-02-15T08:00:00.000Z',
    updatedAt: '2024-12-05T13:00:00.000Z',
  },
  {
    id: 12,
    username: '杨过',
    phone: '13900139013',
    email: 'yangguo@example.com',
    userType: 'customer',
    status: 'active',
    realName: '杨过',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-04T10:00:00.000Z',
    createdAt: '2024-05-20T08:00:00.000Z',
    updatedAt: '2024-12-04T10:00:00.000Z',
  },
  {
    id: 13,
    username: '小龙女',
    phone: '13900139014',
    email: 'xiaolongnv@example.com',
    userType: 'customer',
    status: 'active',
    realName: '小龙女',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-05T15:00:00.000Z',
    createdAt: '2024-11-20T08:00:00.000Z',
    updatedAt: '2024-12-05T15:00:00.000Z',
  },
  {
    id: 14,
    username: '郭靖',
    phone: '13900139015',
    email: 'guojing@example.com',
    userType: 'customer',
    status: 'active',
    realName: '郭靖',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-05T12:00:00.000Z',
    createdAt: '2024-01-20T08:00:00.000Z',
    updatedAt: '2024-12-05T12:00:00.000Z',
  },
  {
    id: 15,
    username: '黄蓉',
    phone: '13900139016',
    email: 'huangrong@example.com',
    userType: 'customer',
    status: 'active',
    realName: '黄蓉',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-05T14:30:00.000Z',
    createdAt: '2024-01-25T08:00:00.000Z',
    updatedAt: '2024-12-05T14:30:00.000Z',
  },
  {
    id: 16,
    username: '令狐冲',
    phone: '13900139017',
    email: 'linghuchong@example.com',
    userType: 'customer',
    status: 'active',
    realName: '令狐冲',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-04T09:00:00.000Z',
    createdAt: '2024-06-15T08:00:00.000Z',
    updatedAt: '2024-12-04T09:00:00.000Z',
  },
  {
    id: 17,
    username: '任盈盈',
    phone: '13900139018',
    email: 'renyingying@example.com',
    userType: 'customer',
    status: 'active',
    realName: '任盈盈',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-05T10:00:00.000Z',
    createdAt: '2024-06-20T08:00:00.000Z',
    updatedAt: '2024-12-05T10:00:00.000Z',
  },
  {
    id: 18,
    username: '韦小宝',
    phone: '13900139019',
    email: 'weixiaobao@example.com',
    userType: 'customer',
    status: 'active',
    realName: '韦小宝',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-05T16:00:00.000Z',
    createdAt: '2024-07-10T08:00:00.000Z',
    updatedAt: '2024-12-05T16:00:00.000Z',
  },
  {
    id: 19,
    username: '段誉',
    phone: '13900139020',
    email: 'duanyu@example.com',
    userType: 'customer',
    status: 'active',
    realName: '段誉',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-05T11:30:00.000Z',
    createdAt: '2024-11-10T08:00:00.000Z',
    updatedAt: '2024-12-05T11:30:00.000Z',
  },
  {
    id: 20,
    username: '虚竹',
    phone: '13900139021',
    email: 'xuzhu@example.com',
    userType: 'customer',
    status: 'active',
    realName: '虚竹',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-05T13:30:00.000Z',
    createdAt: '2024-11-15T08:00:00.000Z',
    updatedAt: '2024-12-05T13:30:00.000Z',
  },
  {
    id: 21,
    username: '乔峰',
    phone: '13900139022',
    email: 'qiaofeng@example.com',
    userType: 'customer',
    status: 'active',
    realName: '乔峰',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-12-05T15:30:00.000Z',
    createdAt: '2024-03-01T08:00:00.000Z',
    updatedAt: '2024-12-05T15:30:00.000Z',
  },
  {
    id: 22,
    username: '慕容复',
    phone: '13900139023',
    email: 'murongfu@example.com',
    userType: 'customer',
    status: 'inactive',
    realName: '慕容复',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [], // 标签数据已移至 tags.ts，避免循环依赖
    lastLoginAt: '2024-10-15T10:00:00.000Z',
    createdAt: '2024-04-20T08:00:00.000Z',
    updatedAt: '2024-10-15T10:00:00.000Z',
  },
]

// Mock 获取用户列表
export const mockGetUserList = (params: {
  page?: number
  pageSize?: number
  phone?: string
  username?: string
  userType?: string
  status?: string
  tagId?: number
}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { page = 1, pageSize = 10, phone, username, userType, status, tagId } = params

      // 过滤数据
      let filteredList = [...mockUserList]

      if (phone) {
        filteredList = filteredList.filter(user => user.phone.includes(phone))
      }

      if (username) {
        filteredList = filteredList.filter(user => user.username.includes(username))
      }

      if (userType) {
        filteredList = filteredList.filter(user => user.userType === userType)
      }

      if (status) {
        filteredList = filteredList.filter(user => user.status === status)
      }

      // 按标签筛选
      if (tagId) {
        filteredList = filteredList.filter(user =>
          user.tags?.some(tag => tag.id === tagId)
        )
      }

      // 分页
      const total = filteredList.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredList.slice(start, end)

      const response: UserListResponse = {
        list,
        total,
        page,
        pageSize,
      }

      resolve({
        code: 200,
        message: '获取成功',
        data: response,
      })
    }, 300)
  })
}

// Mock 获取用户详情
export const mockGetUserDetail = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUserList.find(u => u.id === id)

      if (!user) {
        reject({
          code: 404,
          message: '用户不存在',
        })
        return
      }

      resolve({
        code: 200,
        message: '获取成功',
        data: user,
      })
    }, 200)
  })
}

// Mock 创建用户
export const mockCreateUser = (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: UserInfo = {
        id: mockUserList.length + 1,
        username: data.username,
        phone: data.phone,
        email: data.email,
        userType: 'customer',  // 强制设置为 customer
        status: 'active',
        realName: data.realName,
        avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockUserList.push(newUser)

      resolve({
        code: 200,
        message: '创建成功',
        data: newUser,
      })
    }, 500)
  })
}

// Mock 更新用户
export const mockUpdateUser = (data: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockUserList.findIndex(u => u.id === data.id)

      if (index === -1) {
        reject({
          code: 404,
          message: '用户不存在',
        })
        return
      }

      mockUserList[index] = {
        ...mockUserList[index],
        ...data,
        userType: 'customer',  // 确保 userType 始终为 customer
        updatedAt: new Date().toISOString(),
      }

      resolve({
        code: 200,
        message: '更新成功',
        data: mockUserList[index],
      })
    }, 500)
  })
}

// Mock 删除用户
export const mockDeleteUser = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockUserList.findIndex(u => u.id === id)

      if (index === -1) {
        reject({
          code: 404,
          message: '用户不存在',
        })
        return
      }

      mockUserList.splice(index, 1)

      resolve({
        code: 200,
        message: '删除成功',
      })
    }, 500)
  })
}

// Mock 更改用户状态
export const mockChangeUserStatus = (id: number, status: 'active' | 'inactive' | 'banned') => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUserList.find(u => u.id === id)

      if (!user) {
        reject({
          code: 404,
          message: '用户不存在',
        })
        return
      }

      user.status = status
      user.updatedAt = new Date().toISOString()

      resolve({
        code: 200,
        message: '状态更新成功',
      })
    }, 300)
  })
}
