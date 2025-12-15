/**
 * 认证相关Mock数据
 */

// 默认头像（1x1 透明 PNG）
const DEFAULT_AVATAR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    name: '张经理',
    phone: '13800138000',
    role: 'manager',
    avatar: DEFAULT_AVATAR
  },
  {
    id: 2,
    username: 'staff',
    password: '123456',
    name: '李员工',
    phone: '13800138001',
    role: 'staff',
    avatar: DEFAULT_AVATAR
  }
]

/**
 * 登录
 */
export function login(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { username, password } = data
      const user = mockUsers.find(u => u.username === username && u.password === password)

      if (user) {
        resolve({
          token: 'mock_token_' + Date.now(),
          userInfo: {
            id: user.id,
            username: user.username,
            name: user.name,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar
          }
        })
      } else {
        reject({
          code: 400,
          message: '用户名或密码错误'
        })
      }
    }, 500)
  })
}

/**
 * 登出
 */
export function logout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: '登出成功' })
    }, 300)
  })
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        username: 'admin',
        name: '张经理',
        phone: '13800138000',
        role: 'manager',
        avatar: DEFAULT_AVATAR,
        permissions: ['order:view', 'order:edit', 'vehicle:view', 'vehicle:edit']
      })
    }, 300)
  })
}

/**
 * 刷新Token
 */
export function refreshToken() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: 'mock_token_' + Date.now()
      })
    }, 300)
  })
}

export default {
  login,
  logout,
  getUserInfo,
  refreshToken
}
