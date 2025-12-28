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
	isNewUser?: boolean // 新增：标识是否为新用户（用于判断是否需要完善信息）
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
	phoneCode?: string // 手机号授权code（基础库2.21.2+）
	encryptedData?: string // 已废弃，保留用于兼容旧版本
	iv?: string // 已废弃，保留用于兼容旧版本
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
	logger.debug('微信授权登录', params)
	return post('/auth/wechat-login', params).then((response: any) => {
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
 * 支付宝授权登录
 */
export function alipayLogin(params: AlipayLoginParams): Promise<LoginResponse> {
	logger.debug('支付宝授权登录', params)
	return post('/auth/alipay-login', params).then((response: any) => {
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
 * 抖音授权登录
 */
export function douyinLogin(params: DouyinLoginParams): Promise<LoginResponse> {
	logger.debug('抖音授权登录', params)
	return post('/auth/douyin-login', params).then((response: any) => {
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
 * 用户名密码登录
 */
export function loginWithUsername(params: UsernameLoginParams): Promise<LoginResponse> {
	logger.debug('用户名密码登录', params)
	return post('/auth/username-login', params).then((response: any) => {
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
	logger.debug('绑定手机号', params)
	return post('/auth/bind-phone', params).then((response: any) => {
		return response.data
	})
}

/**
 * 刷新Token
 */
export function refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
	logger.debug('刷新Token', { refreshToken })
	return post('/auth/refresh-token', { refreshToken }).then((response: any) => {
		// 保存新的token到本地存储
		if (response.data?.token) {
			uni.setStorageSync('token', response.data.token)
			uni.setStorageSync('refreshToken', response.data.refreshToken)
		}
		return response.data
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
	logger.debug('退出登录')
	return post('/auth/logout').then((response: any) => {
		// 清除本地存储的token
		uni.removeStorageSync('token')
		uni.removeStorageSync('refreshToken')
		uni.removeStorageSync('userInfo')
		return response.data
	})
}

/**
 * 检查登录状态
 */
export function checkLoginStatus(): Promise<{ isLoggedIn: boolean; user?: UserInfo }> {
	const token = uni.getStorageSync('token')
	const storedUser = uni.getStorageSync('userInfo')

	// 如果没有 token，直接返回未登录
	if (!token) {
		logger.debug('检查登录状态', { hasToken: false })
		return Promise.resolve({
			isLoggedIn: false
		})
	}

	// 解析本地用户信息
	let parsedUser = storedUser
	if (typeof storedUser === 'string') {
		try {
			parsedUser = JSON.parse(storedUser)
		} catch (error) {
			parsedUser = undefined
		}
	}

	logger.debug('检查登录状态', { hasToken: true, hasUserInfo: !!parsedUser })

	// 返回本地登录状态（后端联调时可以调用 /auth/check 接口验证 token）
	return Promise.resolve({
		isLoggedIn: true,
		user: parsedUser || undefined
	})
}
