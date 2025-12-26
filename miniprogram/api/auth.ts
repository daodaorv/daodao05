/**
 * 认证相关API接口
 */

import { get, post, put } from '@/utils/request'
import { logger } from '@/utils/logger'

// 类型定义
export interface LoginResponse {
	token: string
	refreshToken: string
	user: UserInfo
}

export interface UserInfo {
	id: string
	phone: string
	nickname: string
	avatar: string
	gender?: number
	birthday?: string
	email?: string
	userType: 'NORMAL' | 'PLUS' | 'HOST'
	tags: string[]  // 用户标签列表（如：['PLUS会员', 'VIP用户']）
	status: 'ACTIVE' | 'INACTIVE' | 'BANNED'
}

export interface RegisterParams {
	phone: string
	code: string
	password?: string
	nickname?: string
	avatar?: string
	inviteCode?: string
}

export interface LoginParams {
	phone: string
	password: string
}

export interface WechatLoginParams {
	code: string
	encryptedData?: string
	iv?: string
}

export interface AlipayLoginParams {
	code: string
	authCode?: string
}

export interface DouyinLoginParams {
	code: string
	anonymousCode?: string
}

export interface UsernameLoginParams {
	username: string
	password: string
}

export interface BindPhoneParams {
	phone: string
	code: string
}

// 平台类型
export type PlatformType = 'weixin' | 'alipay' | 'douyin' | 'h5'

// 登录方式类型
export type LoginMethodType = 'oneclick' | 'phone' | 'password' | 'username'

// Mock 数据 - 普通用户
const mockUser: UserInfo = {
	id: 'user_001',
	phone: '13800138000',
	nickname: '叨叨用户',
	avatar: '/static/default-avatar.png',
	gender: 1,
	userType: 'NORMAL',
	tags: [],  // 普通用户无标签
	status: 'ACTIVE'
}

// Mock 数据 - PLUS会员用户
const mockPlusUser: UserInfo = {
	id: 'user_002',
	phone: '13900139000',
	nickname: 'PLUS会员用户',
	avatar: '/static/default-avatar.png',
	gender: 1,
	userType: 'PLUS',
	tags: ['PLUS会员', '活跃用户'],  // PLUS会员标签
	status: 'ACTIVE'
}

const mockToken = 'mock_jwt_token_' + Date.now()
const mockRefreshToken = 'mock_refresh_token_' + Date.now()

/**
 * 发送验证码
 */
export function sendCode(phone: string, type: 'login' | 'register' | 'bind' = 'login') {
	logger.debug('发送验证码', { phone, type })
	return post('/auth/send-code', { phone, type })
}

/**
 * 用户注册
 */
export function register(data: RegisterParams): Promise<LoginResponse> {
	logger.debug('用户注册', data)
	return post('/auth/register', data).then((response: any) => {
		// 保存token到本地存储
		if (response.data?.token) {
			uni.setStorageSync('token', response.data.token)
			uni.setStorageSync('refreshToken', response.data.refreshToken)
			uni.setStorageSync('userInfo', JSON.stringify(response.data.user))
		}
		return response.data
	})
}

/**
 * 密码登录
 */
export function login(params: LoginParams): Promise<LoginResponse> {
	logger.debug('密码登录', params)
	return post('/auth/login', params).then((response: any) => {
		// 保存token到本地存储
		if (response.data?.token) {
			uni.setStorageSync('token', response.data.token)
			uni.setStorageSync('refreshToken', response.data.refreshToken)
			uni.setStorageSync('userInfo', JSON.stringify(response.data.user))
		}
		return response.data
	})
}

/**
 * 验证码登录
 */
export function loginWithCode(phone: string, code: string): Promise<LoginResponse> {
	logger.debug('验证码登录', { phone, code })
	return post('/auth/login-with-code', { phone, code }).then((response: any) => {
		// 保存token到本地存储
		if (response.data?.token) {
			uni.setStorageSync('token', response.data.token)
			uni.setStorageSync('refreshToken', response.data.refreshToken)
			uni.setStorageSync('userInfo', JSON.stringify(response.data.user))
		}
		return response.data
	})
}

/**
 * 微信授权登录
 */
export function wechatLogin(params: WechatLoginParams): Promise<LoginResponse> {
	return new Promise((resolve) => {
		setTimeout(() => {
			logger.debug('微信授权登录', params)

			// 模拟首次登录：返回空的昵称和头像，触发完善信息流程
			// 如果有 encryptedData，说明获取了手机号，但首次登录用户信息为空
			const isFirstLogin = !!params.encryptedData

			resolve({
				token: mockToken,
				refreshToken: mockRefreshToken,
				user: {
					...mockUser,
					// 首次登录返回空昵称和头像，需要用户完善信息
					nickname: isFirstLogin ? '' : '微信用户',
					avatar: isFirstLogin ? '' : '/static/default-avatar.png',
					// 如果有 encryptedData，模拟后端解密后获取的手机号
					phone: params.encryptedData ? '13800138000' : mockUser.phone
				}
			})
		}, 1000)
	})
}

/**
 * 支付宝授权登录
 */
export function alipayLogin(params: AlipayLoginParams): Promise<LoginResponse> {
	return new Promise((resolve) => {
		setTimeout(() => {
			logger.debug('支付宝授权登录', params)
			resolve({
				token: mockToken,
				refreshToken: mockRefreshToken,
				user: {
					...mockUser,
					nickname: '支付宝用户',
					avatar: '/static/default-avatar.png'
				}
			})
		}, 1000)
	})
}

/**
 * 抖音授权登录
 */
export function douyinLogin(params: DouyinLoginParams): Promise<LoginResponse> {
	return new Promise((resolve) => {
		setTimeout(() => {
			logger.debug('抖音授权登录', params)
			resolve({
				token: mockToken,
				refreshToken: mockRefreshToken,
				user: {
					...mockUser,
					nickname: '抖音用户',
					avatar: '/static/default-avatar.png'
				}
			})
		}, 1000)
	})
}

/**
 * 用户名密码登录
 */
export function loginWithUsername(params: UsernameLoginParams): Promise<LoginResponse> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			logger.debug('用户名密码登录', params)
			// 模拟密码验证
			if (params.password.length < 6) {
				reject({
					code: 400,
					message: '密码错误'
				})
				return
			}
			resolve({
				token: mockToken,
				refreshToken: mockRefreshToken,
				user: {
					...mockUser,
					nickname: params.username
				}
			})
		}, 800)
	})
}

/**
 * 获取当前平台类型
 */
export function getPlatform(): PlatformType {
	// #ifdef MP-WEIXIN
	return 'weixin'
	// #endif
	// #ifdef MP-ALIPAY
	return 'alipay'
	// #endif
	// #ifdef MP-TOUTIAO
	return 'douyin'
	// #endif
	// #ifdef H5
	return 'h5'
	// #endif
	return 'h5' // 默认返回H5
}

/**
 * 检查平台是否支持一键登录
 */
export function supportOneClickLogin(): boolean {
	const platform = getPlatform()
	// 微信、支付宝、抖音小程序都支持一键登录
	return ['weixin', 'alipay', 'douyin'].includes(platform)
}

/**
 * 绑定手机号
 */
export function bindPhone(params: BindPhoneParams): Promise<{ success: boolean }> {
	return new Promise((resolve) => {
		setTimeout(() => {
			logger.debug('绑定手机号', params)
			resolve({
				success: true
			})
		}, 800)
	})
}

/**
 * 刷新Token
 */
export function refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
	return new Promise((resolve) => {
		setTimeout(() => {
			logger.debug('刷新Token', { refreshToken })
			resolve({
				token: 'new_mock_token_' + Date.now(),
				refreshToken: 'new_mock_refresh_token_' + Date.now()
			})
		}, 500)
	})
}

/**
 * 获取用户信息
 */
export function getUserProfile(): Promise<UserInfo> {
	logger.debug('获取用户信息')
	return get('/users/profile').then((response: any) => {
		return response.data
	})
}

/**
 * 更新用户资料
 */
export function updateUserProfile(data: Partial<UserInfo>): Promise<UserInfo> {
	logger.debug('更新用户资料', data)
	return put('/users/profile', data).then((response: any) => {
		// 更新本地存储的用户信息
		try {
			const userInfo = uni.getStorageSync('userInfo')
			if (userInfo) {
				// 安全解析 userInfo，防止 JSON.parse 失败或返回 null
				const parsedUserInfo = typeof userInfo === 'string'
					? JSON.parse(userInfo)
					: userInfo

				// 确保 parsedUserInfo 和 response.data 都是有效对象
				if (parsedUserInfo && typeof parsedUserInfo === 'object' && response.data) {
					const updatedUser = { ...parsedUserInfo, ...response.data }
					uni.setStorageSync('userInfo', JSON.stringify(updatedUser))
				}
			}
		} catch (error) {
			logger.error('更新本地用户信息失败', error)
		}
		return response.data
	})
}

/**
 * 退出登录
 */
export function logout(): Promise<{ success: boolean }> {
	return new Promise((resolve) => {
		setTimeout(() => {
			logger.debug('退出登录')
			// 清除本地存储的token
			uni.removeStorageSync('token')
			uni.removeStorageSync('refreshToken')
			uni.removeStorageSync('userInfo')
			resolve({
				success: true
			})
		}, 500)
	})
}

/**
 * 检查登录状态
 */
export function checkLoginStatus(): Promise<{ isLoggedIn: boolean; user?: UserInfo }> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const token = uni.getStorageSync('token')
			const storedUser = uni.getStorageSync('userInfo')
			let parsedUser = storedUser
			if (typeof storedUser === 'string') {
				try {
					parsedUser = JSON.parse(storedUser)
				} catch (error) {
					parsedUser = undefined
				}
			}
			logger.debug('检查登录状态', { hasToken: !!token, hasUserInfo: !!parsedUser })
			resolve({
				isLoggedIn: !!token,
				user: parsedUser || undefined
			})
		}, 300)
	})
}
