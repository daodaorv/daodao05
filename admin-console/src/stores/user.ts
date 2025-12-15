import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginForm } from '@/types/user'
import { authApi } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || 'guest')

  // 登录
  const login = async (loginForm: LoginForm) => {
    const response = await authApi.login(loginForm)
    const { token: newToken, user: userData } = response.data

    token.value = newToken
    user.value = userData

    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))

    return response
  }

  // 登出
  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 获取用户信息
  const getUserInfo = async () => {
    try {
      const response = await authApi.getUserInfo()
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
      return response
    } catch (error) {
      logout()
      throw error
    }
  }

  // 初始化用户信息
  const initUserInfo = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        logout()
      }
    }
  }

  // 检查权限
  const hasPermission = (permission: string) => {
    if (!user.value || !user.value.permissions) {
      return false
    }
    return user.value.permissions.includes(permission)
  }

  // 检查角色
  const hasRole = (role: string) => {
    return userRole.value === role
  }

  return {
    user,
    token,
    isAuthenticated,
    userRole,
    login,
    logout,
    getUserInfo,
    initUserInfo,
    hasPermission,
    hasRole,
  }
})