/**
 * 认证相关API接口
 */

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

// Mock 数据
const mockUser: UserInfo = {
	id: 'user_001',
	phone: '13800138000',
	nickname: '叨叨用户',
	avatar: '/static/default-avatar.png',
	gender: 1,
	userType: 'NORMAL',
	status: 'ACTIVE'
}

const mockToken = 'mock_jwt_token_' + Date.now()
const mockRefreshToken = 'mock_refresh_token_' + Date.now()

/**
 * 发送验证码
 */
export function sendCode(phone: string, type: 'login' | 'register' | 'bind' = 'login') {
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log(`[Mock] 发送验证码到 ${phone}，类型：${type}`)
			resolve({
				code: 0,
				message: '验证码已发送',
				data: {
					phone,
					expiresIn: 300 // 5分钟有效期
				}
			})
		}, 500)
	})
}

/**
 * 用户注册
 */
export function register(data: RegisterParams): Promise<LoginResponse> {
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log('[Mock] 用户注册:', data)
			resolve({
				token: mockToken,
				refreshToken: mockRefreshToken,
				user: {
					...mockUser,
					phone: data.phone,
					nickname: data.nickname || mockUser.nickname,
					avatar: data.avatar || mockUser.avatar
				}
			})
		}, 800)
	})
}

/**
 * 密码登录
 */
export function login(params: LoginParams): Promise<LoginResponse> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('[Mock] 密码登录:', params)
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
					phone: params.phone
				}
			})
		}, 800)
	})
}

/**
 * 验证码登录
 */
export function loginWithCode(phone: string, code: string): Promise<LoginResponse> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('[Mock] 验证码登录:', { phone, code })
			// 模拟验证码验证
			if (code.length !== 6) {
				reject({
					code: 400,
					message: '验证码错误'
				})
				return
			}
			resolve({
				token: mockToken,
				refreshToken: mockRefreshToken,
				user: {
					...mockUser,
					phone
				}
			})
		}, 800)
	})
}

/**
 * 微信授权登录
 */
export function wechatLogin(params: WechatLoginParams): Promise<LoginResponse> {
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log('[Mock] 微信授权登录:', params)
			resolve({
				token: mockToken,
				refreshToken: mockRefreshToken,
				user: {
					...mockUser,
					nickname: '微信用户',
					avatar: '/static/default-avatar.png'
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
			console.log('[Mock] 支付宝授权登录:', params)
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
			console.log('[Mock] 抖音授权登录:', params)
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
			console.log('[Mock] 用户名密码登录:', params)
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
			console.log('[Mock] 绑定手机号:', params)
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
			console.log('[Mock] 刷新Token:', refreshToken)
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
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log('[Mock] 获取用户信息')
			resolve(mockUser)
		}, 500)
	})
}

/**
 * 更新用户资料
 */
export function updateUserProfile(data: Partial<UserInfo>): Promise<UserInfo> {
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log('[Mock] 更新用户资料:', data)
			resolve({
				...mockUser,
				...data
			})
		}, 800)
	})
}

/**
 * 退出登录
 */
export function logout(): Promise<{ success: boolean }> {
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log('[Mock] 退出登录')
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
			console.log('[Mock] 检查登录状态:', { hasToken: !!token, hasUserInfo: !!parsedUser })
			resolve({
				isLoggedIn: !!token,
				user: parsedUser || undefined
			})
		}, 300)
	})
}
