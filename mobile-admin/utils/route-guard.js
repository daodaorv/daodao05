/**
 * 路由守卫
 * 在页面跳转前进行权限验证
 */

import { canAccessRoute, getCurrentUser } from './permission'

// 公开路由，无需登录即可访问
const PUBLIC_ROUTES = [
  '/pages/login/index',
  '/pages/index/index'
]

// 需要登录的路由白名单（tabbar页面）
const AUTH_ROUTES = [
  '/pages/dashboard/index',
  '/pages/orders/index',
  '/pages/vehicles/index',
  '/pages/messages/index',
  '/pages/profile/index'
]

/**
 * 检查是否是公开路由
 * @param {string} path - 路由路径
 * @returns {boolean}
 */
function isPublicRoute(path) {
  return PUBLIC_ROUTES.some(route => path.startsWith(route))
}

/**
 * 检查用户是否已登录
 * @returns {boolean}
 */
function isLoggedIn() {
  const user = getCurrentUser()
  return !!user
}

/**
 * 跳转到登录页
 * @param {string} redirectUrl - 登录后重定向的URL
 */
function redirectToLogin(redirectUrl) {
  const url = redirectUrl ? `/pages/login/index?redirect=${encodeURIComponent(redirectUrl)}` : '/pages/login/index'

  uni.reLaunch({
    url
  })
}

/**
 * 显示权限不足提示
 */
function showPermissionDenied() {
  uni.showModal({
    title: '权限不足',
    content: '您没有权限访问此页面',
    showCancel: false,
    success: () => {
      uni.navigateBack({
        fail: () => {
          // 如果无法返回，跳转到首页
          uni.reLaunch({
            url: '/pages/dashboard/index'
          })
        }
      })
    }
  })
}

/**
 * 路由守卫主函数
 * @param {Object} options - 页面参数
 * @param {string} options.path - 页面路径
 * @returns {boolean} 是否允许访问
 */
export function routeGuard(options = {}) {
  const path = options.path || ''

  // 公开路由，直接放行
  if (isPublicRoute(path)) {
    return true
  }

  // 检查是否已登录
  if (!isLoggedIn()) {
    console.warn('用户未登录，跳转到登录页')
    redirectToLogin(path)
    return false
  }

  // 检查路由权限
  if (!canAccessRoute(path)) {
    console.warn('用户无权限访问此页面:', path)
    showPermissionDenied()
    return false
  }

  return true
}

/**
 * 在页面 onLoad 中调用的守卫函数
 * @param {Object} context - 页面上下文（this）
 * @param {Object} options - 页面参数
 * @returns {boolean} 是否允许访问
 */
export function pageGuard(context, options = {}) {
  // 获取当前页面路径
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const path = '/' + currentPage.route

  return routeGuard({ ...options, path })
}

/**
 * 拦截 uni.navigateTo
 */
export function interceptNavigateTo() {
  const originalNavigateTo = uni.navigateTo

  uni.navigateTo = function(options) {
    const { url } = options
    const path = url.split('?')[0]

    // 检查权限
    if (!canAccessRoute(path)) {
      if (!isLoggedIn()) {
        redirectToLogin(url)
      } else {
        showPermissionDenied()
      }
      return
    }

    // 调用原始方法
    return originalNavigateTo.call(this, options)
  }
}

/**
 * 拦截 uni.redirectTo
 */
export function interceptRedirectTo() {
  const originalRedirectTo = uni.redirectTo

  uni.redirectTo = function(options) {
    const { url } = options
    const path = url.split('?')[0]

    // 检查权限
    if (!canAccessRoute(path)) {
      if (!isLoggedIn()) {
        redirectToLogin(url)
      } else {
        showPermissionDenied()
      }
      return
    }

    // 调用原始方法
    return originalRedirectTo.call(this, options)
  }
}

/**
 * 拦截 uni.switchTab
 */
export function interceptSwitchTab() {
  const originalSwitchTab = uni.switchTab

  uni.switchTab = function(options) {
    const { url } = options
    const path = url.split('?')[0]

    // 检查权限
    if (!canAccessRoute(path)) {
      if (!isLoggedIn()) {
        redirectToLogin(url)
      } else {
        showPermissionDenied()
      }
      return
    }

    // 调用原始方法
    return originalSwitchTab.call(this, options)
  }
}

/**
 * 初始化路由守卫
 * 在 main.js 中调用
 */
export function initRouteGuard() {
  console.log('初始化路由守卫')

  // 拦截路由跳转方法
  interceptNavigateTo()
  interceptRedirectTo()
  interceptSwitchTab()
}

export default {
  routeGuard,
  pageGuard,
  initRouteGuard,
  isPublicRoute,
  isLoggedIn
}
