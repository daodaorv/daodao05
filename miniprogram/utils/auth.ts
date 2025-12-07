/**
 * 登录状态管理工具
 * 提供登录检查、登录拦截、Token管理等功能
 */

import { checkLoginStatus, type UserInfo } from '@/api/auth'

/**
 * 检查是否已登录
 */
export function isLoggedIn(): boolean {
	const token = uni.getStorageSync('token')
	const userInfo = uni.getStorageSync('userInfo')
	return !!(token && userInfo)
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser(): UserInfo | null {
	try {
		const userInfo = uni.getStorageSync('userInfo')
		if (!userInfo) return null
		if (typeof userInfo === 'string') {
			return JSON.parse(userInfo)
		}
		return userInfo
	} catch (error) {
		console.error('[Auth] 获取用户信息失败:', error)
		return null
	}
}

/**
 * 获取Token
 */
export function getToken(): string | null {
	try {
		const token = uni.getStorageSync('token')
		return token || null
	} catch (error) {
		console.error('[Auth] 获取Token失败:', error)
		return null
	}
}

/**
 * 保存登录信息
 */
export function saveLoginInfo(token: string, refreshToken: string, userInfo: UserInfo): void {
	try {
		uni.setStorageSync('token', token)
		uni.setStorageSync('refreshToken', refreshToken)
		uni.setStorageSync('userInfo', JSON.stringify(userInfo))
		console.log('[Auth] 登录信息已保存')
	} catch (error) {
		console.error('[Auth] 保存登录信息失败:', error)
	}
}

/**
 * 清除登录信息
 */
export function clearLoginInfo(): void {
	try {
		uni.removeStorageSync('token')
		uni.removeStorageSync('refreshToken')
		uni.removeStorageSync('userInfo')
		console.log('[Auth] 登录信息已清除')
	} catch (error) {
		console.error('[Auth] 清除登录信息失败:', error)
	}
}

/**
 * 登录拦截 - 检查登录状态，未登录则跳转登录页
 * @param redirectUrl 登录成功后要跳转的页面（可选）
 * @returns 是否已登录
 */
export function requireLogin(redirectUrl?: string): boolean {
	if (isLoggedIn()) {
		return true
	}

	// 保存当前页面路径，登录成功后返回
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const currentRoute = currentPage ? `/${currentPage.route}` : ''

	// 如果指定了重定向URL，使用指定的；否则使用当前页面
	const redirect = redirectUrl || currentRoute

	// 跳转到登录页
	uni.navigateTo({
		url: `/pages/auth/login?redirect=${encodeURIComponent(redirect)}`,
		fail: () => {
			// 如果跳转失败（可能已经在登录页），显示提示
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
		}
	})

	return false
}

export function buildRedirectUrl(path: string, params?: Record<string, any>): string {
	const entries = Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== null && value !== '')
	if (entries.length === 0) {
		return path
	}
	const query = entries
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
		.join('&')
	return `${path}?${query}`
}

/**
 * 显示登录提示并跳转
 * @param message 提示信息
 * @param redirectUrl 登录成功后要跳转的页面（可选）
 */
export function showLoginTip(message: string = '请先登录', redirectUrl?: string): void {
	uni.showModal({
		title: '提示',
		content: message,
		confirmText: '去登录',
		cancelText: '取消',
		success: (res) => {
			if (res.confirm) {
				requireLogin(redirectUrl)
			}
		}
	})
}

/**
 * 检查并更新登录状态（异步）
 * 用于应用启动时验证Token有效性
 */
export async function checkAndUpdateLoginStatus(): Promise<boolean> {
	if (!isLoggedIn()) {
		return false
	}

	try {
		const result = await checkLoginStatus()
		if (!result.isLoggedIn) {
			// Token已失效，清除登录信息
			clearLoginInfo()
			return false
		}

		// 更新用户信息
		if (result.user) {
			uni.setStorageSync('userInfo', JSON.stringify(result.user))
		}

		return true
	} catch (error) {
		console.error('[Auth] 检查登录状态失败:', error)
		// 发生错误时，保持当前登录状态
		return isLoggedIn()
	}
}

/**
 * 退出登录
 */
export async function logout(): Promise<void> {
	try {
		// 调用退出登录API
		const { logout: logoutApi } = await import('@/api/auth')
		await logoutApi()
	} catch (error) {
		console.error('[Auth] 退出登录API调用失败:', error)
	} finally {
		// 无论API调用是否成功，都清除本地登录信息
		clearLoginInfo()

		// 跳转到首页
		uni.reLaunch({
			url: '/pages/index/index'
		})
	}
}

/**
 * 获取登录后的重定向URL
 * 从URL参数中获取redirect参数
 */
export function getRedirectUrl(): string {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]

	if (!currentPage) {
		return '/pages/index/index'
	}

	// 获取页面参数
	const options = (currentPage as any).options || {}
	const redirect = options.redirect

	if (redirect) {
		return decodeURIComponent(redirect)
	}

	return '/pages/index/index'
}

/**
 * 登录成功后的跳转处理
 */
export function handleLoginSuccess(): void {
	const redirectUrl = getRedirectUrl()

	// 如果重定向URL是登录页或注册页，跳转到首页
	if (redirectUrl.includes('/pages/auth/')) {
		uni.switchTab({
			url: '/pages/index/index'
		})
		return
	}

	// 检查是否有上一页
	const pages = getCurrentPages()
	if (pages.length > 1) {
		// 返回上一页
		uni.navigateBack({
			fail: () => {
				// 返回失败，跳转到重定向URL或首页
				if (redirectUrl && redirectUrl !== '/pages/index/index') {
					uni.redirectTo({
						url: redirectUrl,
						fail: () => {
							uni.switchTab({
								url: '/pages/index/index'
							})
						}
					})
				} else {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
			}
		})
	} else {
		// 没有上一页，跳转到重定向URL或首页
		if (redirectUrl && redirectUrl !== '/pages/index/index') {
			uni.redirectTo({
				url: redirectUrl,
				fail: () => {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
			})
		} else {
			uni.switchTab({
				url: '/pages/index/index'
			})
		}
	}
}

export default {
	isLoggedIn,
	getCurrentUser,
	getToken,
	saveLoginInfo,
	clearLoginInfo,
	requireLogin,
	buildRedirectUrl,
	showLoginTip,
	checkAndUpdateLoginStatus,
	logout,
	getRedirectUrl,
	handleLoginSuccess
}
