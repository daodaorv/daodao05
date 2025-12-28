<template>
	<view class="login-page">
		<!-- 顶部Logo区域 -->
		<view class="logo-section">
			<image class="logo" src="/static/logo.png" mode="aspectFit" />
			<text class="app-name">叨叨房车</text>
			<text class="slogan">让房车旅行更简单</text>
		</view>

		<!-- 一键登录（仅小程序平台） -->
		<view v-if="showOneClickLogin" class="oneclick-section">
			<!-- 微信小程序使用 open-type 获取手机号 -->
			<button
				v-if="platform === 'weixin'"
				class="oneclick-btn"
				open-type="getPhoneNumber"
				@getphonenumber="handleWechatPhoneNumber"
			>
				<u-icon name="weixin-circle-fill" size="20" color="#FFFFFF"></u-icon>
				<text class="btn-text">{{ oneClickLoginText }}</text>
			</button>
			<!-- 支付宝和抖音使用普通点击 -->
			<button
				v-else
				class="oneclick-btn"
				@click="handleOneClickLogin"
			>
				<u-icon v-if="platform === 'alipay'" name="zhifubao-circle-fill" size="20" color="#FFFFFF"></u-icon>
				<u-icon v-else name="play-circle-fill" size="20" color="#FFFFFF"></u-icon>
				<text class="btn-text">{{ oneClickLoginText }}</text>
			</button>
			<view class="divider">
				<view class="line" />
				<text class="text">其他登录方式</text>
				<view class="line" />
			</view>
		</view>

		<!-- 登录方式切换 -->
		<view class="login-tabs">
			<view
				class="tab-item"
				:class="{ active: loginType === 'phone' }"
				@click="switchLoginType('phone')"
			>
				手机号登录
			</view>
			<view
				class="tab-item"
				:class="{ active: loginType === 'username' }"
				@click="switchLoginType('username')"
			>
				账号登录
			</view>
		</view>

		<!-- 登录表单 -->
		<view class="login-form">
			<!-- 手机号登录 -->
			<template v-if="loginType === 'phone'">
				<!-- 手机号输入 -->
				<view class="form-item">
					<view class="input-wrapper">
						<u-icon name="phone" size="20" color="#999999" />
						<input
							v-model="phoneForm.phone"
							name="number"
							maxlength="11"
							placeholder="请输入手机号"
							class="input"
						/>
					</view>
				</view>

				<!-- 验证码/密码切换 -->
				<view class="sub-tabs">
					<view
						class="sub-tab"
						:class="{ active: phoneLoginMethod === 'code' }"
						@click="phoneLoginMethod = 'code'"
					>
						验证码
					</view>
					<view
						class="sub-tab"
						:class="{ active: phoneLoginMethod === 'password' }"
						@click="phoneLoginMethod = 'password'"
					>
						密码
					</view>
				</view>

				<!-- 验证码输入 -->
				<view v-if="phoneLoginMethod === 'code'" class="form-item">
					<view class="input-wrapper">
						<u-icon name="chat" size="20" color="#999999" />
						<input
							v-model="phoneForm.code"
							name="number"
							maxlength="6"
							placeholder="请输入验证码"
							class="input"
						/>
						<button
							class="code-btn"
							:disabled="codeSending || countdown > 0"
							@click="handleSendCode"
						>
							{{ codeButtonText }}
						</button>
					</view>
				</view>

				<!-- 密码输入 -->
				<view v-if="phoneLoginMethod === 'password'" class="form-item">
					<view class="input-wrapper">
						<u-icon name="lock" size="20" color="#999999" />
						<input
							v-model="phoneForm.password"
							:password="!showPassword"
							placeholder="请输入密码"
							class="input"
						/>
						<u-icon
							:name="showPassword ? 'eye-fill' : 'eye-off'"
							size="20"
							color="#999999"
							@click="showPassword = !showPassword"
						/>
					</view>
				</view>

				<!-- 忘记密码 -->
				<view v-if="phoneLoginMethod === 'password'" class="form-extra">
					<text class="link-text" @click="handleForgetPassword">忘记密码？</text>
				</view>
			</template>

			<!-- 用户名登录 -->
			<template v-if="loginType === 'username'">
				<!-- 用户名输入 -->
				<view class="form-item">
					<view class="input-wrapper">
						<u-icon name="account-fill" size="20" color="#999999" />
						<input
							v-model="usernameForm.username"
							placeholder="请输入用户名/邮箱"
							class="input"
						/>
					</view>
				</view>

				<!-- 密码输入 -->
				<view class="form-item">
					<view class="input-wrapper">
						<u-icon name="lock" size="20" color="#999999" />
						<input
							v-model="usernameForm.password"
							:password="!showPassword"
							placeholder="请输入密码"
							class="input"
						/>
						<u-icon
							:name="showPassword ? 'eye-fill' : 'eye-off'"
							size="20"
							color="#999999"
							@click="showPassword = !showPassword"
						/>
					</view>
				</view>

				<!-- 忘记密码 -->
				<view class="form-extra">
					<text class="link-text" @click="handleForgetPassword">忘记密码？</text>
				</view>
			</template>

			<!-- 登录按钮 -->
			<button class="login-btn" :disabled="!canSubmit" @click="handleLogin">
				{{ loading ? '登录中...' : '登录' }}
			</button>

			<!-- 注册提示 -->
			<view class="register-tip">
				<text class="tip-text">还没有账号？</text>
				<text class="link-text" @click="goToRegister">立即注册</text>
			</view>
		</view>

		<!-- 第三方登录（H5环境） -->
		<view v-if="platform === 'h5'" class="third-party-login">
			<view class="divider">
				<view class="line" />
				<text class="text">第三方登录</text>
				<view class="line" />
			</view>

			<view class="login-methods">
				<view class="method-item" @click="handleThirdPartyLogin('wechat')">
					<image class="method-icon" src="/static/icons/wechat.png" mode="aspectFit" />
					<text class="method-text">微信</text>
				</view>
				<view class="method-item" @click="handleThirdPartyLogin('alipay')">
					<image class="method-icon" src="/static/icons/alipay.png" mode="aspectFit" />
					<text class="method-text">支付宝</text>
				</view>
			</view>
		</view>

		<!-- 用户协议 -->
		<view class="agreement">
			<checkbox-group @change="handleAgreementChange">
				<label class="agreement-label">
					<checkbox :checked="agreed" color="#FF9F29" />
					<text class="agreement-text">
						我已阅读并同意
						<text class="link-text" @click.stop="viewAgreement('user')">《用户协议》</text>
						和
						<text class="link-text" @click.stop="viewAgreement('privacy')">《隐私政策》</text>
					</text>
				</label>
			</checkbox-group>
		</view>
	</view>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger';
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
	login,
	loginWithCode,
	loginWithUsername,
	wechatLogin,
	alipayLogin,
	douyinLogin,
	sendCode,
	getPlatform,
	supportOneClickLogin,
	type PlatformType
} from '@/api/auth'
import { saveLoginInfo, handleLoginSuccess } from '@/utils/auth'

// 平台信息
const platform = ref<PlatformType>('h5')
const showOneClickLogin = ref(false)

// 登录类型：phone-手机号登录, username-用户名登录
const loginType = ref<'phone' | 'username'>('phone')

// 手机号登录方式：code-验证码, password-密码
const phoneLoginMethod = ref<'code' | 'password'>('code')

// 手机号登录表单
const phoneForm = ref({
	phone: '',
	code: '',
	password: ''
})

// 用户名登录表单
const usernameForm = ref({
	username: '',
	password: ''
})

// 状态
const loading = ref(false)
const codeSending = ref(false)
const countdown = ref(0)
const showPassword = ref(false)
const agreed = ref(false)

// 定时器引用（用于页面卸载时清理）
let countdownTimer: ReturnType<typeof setInterval> | null = null

// 平台图标和文案
const platformIcon = computed(() => {
	const icons: Record<PlatformType, string> = {
		weixin: '/static/icons/wechat.png',
		alipay: '/static/icons/alipay.png',
		douyin: '/static/icons/douyin.png',
		h5: ''
	}
	return icons[platform.value]
})

const oneClickLoginText = computed(() => {
	const texts: Record<PlatformType, string> = {
		weixin: '微信一键登录',
		alipay: '支付宝一键登录',
		douyin: '抖音一键登录',
		h5: ''
	}
	return texts[platform.value]
})

// 验证码按钮文本
const codeButtonText = computed(() => {
	if (codeSending.value) return '发送中...'
	if (countdown.value > 0) return `${countdown.value}s`
	return '获取验证码'
})

// 是否可以提交
const canSubmit = computed(() => {
	if (!agreed.value) return false

	if (loginType.value === 'phone') {
		// 手机号登录
		if (!phoneForm.value.phone || phoneForm.value.phone.length !== 11) return false
		if (phoneLoginMethod.value === 'code') {
			return phoneForm.value.code.length === 6
		} else {
			return phoneForm.value.password.length >= 6
		}
	} else {
		// 用户名登录
		return usernameForm.value.username.length > 0 && usernameForm.value.password.length >= 6
	}
})

// 初始化
onMounted(() => {
	platform.value = getPlatform()
	showOneClickLogin.value = supportOneClickLogin()
	logger.debug('[登录页面] 当前平台:', platform.value, '支持一键登录:', showOneClickLogin.value)
})

// 切换登录方式
const switchLoginType = (type: 'phone' | 'username') => {
	loginType.value = type
	// 清空表单
	phoneForm.value = { phone: '', code: '', password: '' }
	usernameForm.value = { username: '', password: '' }
	showPassword.value = false
}

// 发送验证码
const handleSendCode = async () => {
	// 验证手机号
	if (!phoneForm.value.phone || phoneForm.value.phone.length !== 11) {
		uni.showToast({
			title: '请输入正确的手机号',
			icon: 'none'
		})
		return
	}

	try {
		codeSending.value = true
		await sendCode(phoneForm.value.phone, 'login')
		uni.showToast({
			title: '验证码已发送',
			icon: 'success'
		})

		// 开始倒计时
		countdown.value = 60
		countdownTimer = setInterval(() => {
			countdown.value--
			if (countdown.value <= 0) {
				if (countdownTimer) {
					clearInterval(countdownTimer)
					countdownTimer = null
				}
			}
		}, 1000)
	} catch (error: any) {
		uni.showToast({
			title: error.message || '发送失败',
			icon: 'none'
		})
	} finally {
		codeSending.value = false
	}
}

// 登录
const handleLogin = async () => {
	if (!agreed.value) {
		uni.showToast({
			title: '请先同意用户协议和隐私政策',
			icon: 'none'
		})
		return
	}

	try {
		loading.value = true

		let result
		if (loginType.value === 'phone') {
			// 手机号登录
			if (phoneLoginMethod.value === 'code') {
				// 验证码登录
				result = await loginWithCode(phoneForm.value.phone, phoneForm.value.code)
			} else {
				// 密码登录
				result = await login({
					phone: phoneForm.value.phone,
					password: phoneForm.value.password
				})
			}
		} else {
			// 用户名登录
			result = await loginWithUsername({
				username: usernameForm.value.username,
				password: usernameForm.value.password
			})
		}

		// 保存登录信息
		saveLoginInfo(result.token, result.refreshToken, result.user)

		uni.showToast({
			title: '登录成功',
			icon: 'success'
		})

		// 延迟跳转
		setTimeout(() => {
			handleLoginSuccess()
		}, 1500)
	} catch (error: any) {
		uni.showToast({
			title: error.message || '登录失败',
			icon: 'none'
		})
	} finally {
		loading.value = false
	}
}

// 微信手机号授权回调
const handleWechatPhoneNumber = async (e: any) => {
	logger.debug('[微信手机号授权] 回调事件:', e)

	if (!agreed.value) {
		uni.showToast({
			title: '请先同意用户协议和隐私政策',
			icon: 'none'
		})
		return
	}

	// 用户拒绝授权
	if (e.detail.errMsg && e.detail.errMsg.indexOf('fail') !== -1) {
		logger.debug('[微信手机号授权] 用户拒绝授权')
		uni.showToast({
			title: '您拒绝了授权，请使用其他方式登录',
			icon: 'none'
		})
		return
	}

	// 用户同意授权
	if (e.detail.code) {
		loading.value = true

		try {
			// 先调用 uni.login 获取登录凭证
			uni.login({
				provider: 'weixin',
				success: async (loginRes) => {
					try {
						logger.debug('[微信登录] 获取code成功:', loginRes.code)
						logger.debug('[微信手机号] 获取手机号code成功:', e.detail.code)

						if (!loginRes.code) {
							throw new Error('获取微信登录code失败')
						}

						// 调用后端API进行登录，传递登录code和手机号code
						// 注意：从基础库2.21.2开始，使用code方式获取手机号
						const result = await wechatLogin({
							code: loginRes.code,
							phoneCode: e.detail.code // 手机号授权code（5分钟有效）
						})

						// 保存登录信息
						saveLoginInfo(result.token, result.refreshToken, result.user)

						// 检查是否为新用户，新用户需要完善信息
						if (result.isNewUser) {
							// 新用户，跳转到完善信息页面
							logger.debug('[微信登录] 新用户，需要完善用户信息')
							uni.showToast({
								title: '登录成功',
								icon: 'success',
								duration: 1500
							})

							setTimeout(() => {
								uni.redirectTo({
									url: '/pages/profile/complete-info?from=login'
								})
							}, 1500)
						} else {
							// 老用户，直接跳转首页
							logger.debug('[微信登录] 老用户，直接跳转首页')
							uni.showToast({
								title: '登录成功',
								icon: 'success'
							})

							setTimeout(() => {
								handleLoginSuccess()
							}, 1500)
						}
					} catch (error: any) {
						logger.error('[微信登录] 登录失败:', error)
						uni.showToast({
							title: error.message || '登录失败',
							icon: 'none'
						})
					} finally {
						loading.value = false
					}
				},
				fail: (err) => {
					logger.error('[微信登录] 获取授权失败:', err)
					uni.showToast({
						title: err.errMsg || '获取微信授权失败',
						icon: 'none'
					})
					loading.value = false
				}
			})
		} catch (error: any) {
			logger.error('[微信手机号授权] 处理失败:', error)
			uni.showToast({
				title: error.message || '授权失败',
				icon: 'none'
			})
			loading.value = false
		}
	} else {
		logger.error('[微信手机号授权] 未获取到code')
		uni.showToast({
			title: '获取手机号失败，请重试',
			icon: 'none'
		})
	}
}

// 一键登录（支付宝和抖音）
const handleOneClickLogin = () => {
	if (!agreed.value) {
		uni.showToast({
			title: '请先同意用户协议和隐私政策',
			icon: 'none'
		})
		return
	}

	loading.value = true

	// 根据平台调用不同的登录方法
	if (platform.value === 'alipay') {
		// 支付宝小程序登录
		uni.login({
			provider: 'alipay',
			success: async (loginRes) => {
				try {
					logger.debug('[支付宝登录] 获取code成功:', loginRes.code)

					if (!loginRes.code) {
						throw new Error('获取支付宝授权code失败')
					}

					// 调用后端API进行登录
					const result = await alipayLogin({ code: loginRes.code })

					// 检查是否需要绑定手机号
					if (!result.user.phone) {
						// 保存临时token
						uni.setStorageSync('tempToken', result.token)
						uni.setStorageSync('tempUserInfo', result.user)
						loading.value = false
						// 跳转到手机绑定页面
						uni.navigateTo({
							url: '/pages/auth/bind-phone'
						})
						return
					}

					// 保存登录信息
					saveLoginInfo(result.token, result.refreshToken, result.user)

					// 检查是否为新用户，新用户需要完善信息
					if (result.isNewUser) {
						logger.debug('[支付宝登录] 新用户，需要完善用户信息')
						uni.showToast({
							title: '登录成功',
							icon: 'success',
							duration: 1500
						})

						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/profile/complete-info?from=login'
							})
						}, 1500)
					} else {
						logger.debug('[支付宝登录] 老用户，直接跳转首页')
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						})

						setTimeout(() => {
							handleLoginSuccess()
						}, 1500)
					}
				} catch (error: any) {
					logger.error('[支付宝登录] 登录失败:', error)
					uni.showToast({
						title: error.message || '登录失败',
						icon: 'none'
					})
				} finally {
					loading.value = false
				}
			},
			fail: (err) => {
				logger.error('[支付宝登录] 获取授权失败:', err)
				uni.showToast({
					title: err.errMsg || '获取支付宝授权失败',
					icon: 'none'
				})
				loading.value = false
			}
		})
	} else if (platform.value === 'douyin') {
		// 抖音小程序登录
		uni.login({
			provider: 'toutiao',
			success: async (loginRes) => {
				try {
					logger.debug('[抖音登录] 获取code成功:', loginRes.code)

					if (!loginRes.code) {
						throw new Error('获取抖音授权code失败')
					}

					// 调用后端API进行登录
					const result = await douyinLogin({ code: loginRes.code })

					// 检查是否需要绑定手机号
					if (!result.user.phone) {
						// 保存临时token
						uni.setStorageSync('tempToken', result.token)
						uni.setStorageSync('tempUserInfo', result.user)
						loading.value = false
						// 跳转到手机绑定页面
						uni.navigateTo({
							url: '/pages/auth/bind-phone'
						})
						return
					}

					// 保存登录信息
					saveLoginInfo(result.token, result.refreshToken, result.user)

					// 检查是否为新用户，新用户需要完善信息
					if (result.isNewUser) {
						logger.debug('[抖音登录] 新用户，需要完善用户信息')
						uni.showToast({
							title: '登录成功',
							icon: 'success',
							duration: 1500
						})

						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/profile/complete-info?from=login'
							})
						}, 1500)
					} else {
						logger.debug('[抖音登录] 老用户，直接跳转首页')
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						})

						setTimeout(() => {
							handleLoginSuccess()
						}, 1500)
					}
				} catch (error: any) {
					logger.error('[抖音登录] 登录失败:', error)
					uni.showToast({
						title: error.message || '登录失败',
						icon: 'none'
					})
				} finally {
					loading.value = false
				}
			},
			fail: (err) => {
				logger.error('[抖音登录] 获取授权失败:', err)
				uni.showToast({
					title: err.errMsg || '获取抖音授权失败',
					icon: 'none'
				})
				loading.value = false
			}
		})
	} else {
		uni.showToast({
			title: '当前平台不支持一键登录',
			icon: 'none'
		})
		loading.value = false
	}
}

// H5第三方登录
const handleThirdPartyLogin = (type: 'wechat' | 'alipay') => {
	if (!agreed.value) {
		uni.showToast({
			title: '请先同意用户协议和隐私政策',
			icon: 'none'
		})
		return
	}

	uni.showToast({
		title: `${type === 'wechat' ? '微信' : '支付宝'}登录开发中`,
		icon: 'none'
	})
	// 功能开发中 - H5环境的第三方登录待实现
}

// 忘记密码
const handleForgetPassword = () => {
	uni.navigateTo({
		url: '/pages/auth/reset-password'
	})
}

// 去注册
const goToRegister = () => {
	uni.navigateTo({
		url: '/pages/auth/register'
	})
}

// 协议变更
const handleAgreementChange = (e: any) => {
	agreed.value = e.detail.value.length > 0
}

// 查看协议
const viewAgreement = (type: 'user' | 'privacy') => {
	const title = type === 'user' ? '用户协议' : '隐私政策'
	uni.showToast({
		title: `查看${title}`,
		icon: 'none'
	})
	// 功能开发中 - 协议页面待实现
}

// 页面卸载时清理定时器
onUnmounted(() => {
	if (countdownTimer) {
		clearInterval(countdownTimer)
		countdownTimer = null
	}
})
</script>

<style lang="scss" scoped>
.login-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #FFF8E1 0%, $uni-bg-color 50%);
	padding: 0 $uni-spacing-lg;
}

// Logo区域
.logo-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 80rpx 0 60rpx;

	.logo {
		width: 160rpx;
		height: 160rpx;
		margin-bottom: $uni-spacing-lg;
		border-radius: $uni-radius-lg;
		box-shadow: $uni-shadow-card;
	}

	.app-name {
		font-size: $uni-font-size-xxl;
		font-weight: 800;
		color: $uni-text-color;
		margin-bottom: $uni-spacing-sm;
	}

	.slogan {
		font-size: $uni-font-size-sm;
		color: $uni-text-color-placeholder;
	}
}

// 一键登录
.oneclick-section {
	margin-bottom: $uni-spacing-lg;

	.oneclick-btn {
		width: 100%;
		height: 96rpx;
		background: $uni-color-primary-gradient;
		color: $uni-text-color-inverse;
		font-size: $uni-font-size-md;
		font-weight: 600;
		border-radius: $uni-radius-btn;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: $uni-spacing-sm;
		margin-bottom: $uni-spacing-lg;
		box-shadow: $uni-shadow-glow;
		transition: transform 0.2s ease, opacity 0.2s ease;

		&:active {
			transform: scale(0.98);
			opacity: 0.9;
		}

		.platform-icon {
			width: 40rpx;
			height: 40rpx;
		}
	}

	.divider {
		display: flex;
		align-items: center;
		gap: $uni-spacing-sm;

		.line {
			flex: 1;
			height: 1rpx;
			background: $uni-border-color;
		}

		.text {
			font-size: $uni-font-size-sm;
			color: $uni-text-color-placeholder;
		}
	}
}

// 登录方式切换
.login-tabs {
	display: flex;
	gap: $uni-spacing-xl;
	margin-bottom: $uni-spacing-lg;

	.tab-item {
		font-size: $uni-font-size-md;
		color: $uni-text-color-placeholder;
		padding-bottom: $uni-spacing-sm;
		position: relative;
		transition: color 0.3s ease;

		&.active {
			color: $uni-text-color;
			font-weight: 600;

			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 6rpx;
				background: $uni-color-primary;
				border-radius: 3rpx;
			}
		}
	}
}

// 子标签切换
.sub-tabs {
	display: flex;
	gap: $uni-spacing-lg;
	margin-bottom: $uni-spacing-md;

	.sub-tab {
		font-size: $uni-font-size-base;
		color: $uni-text-color-placeholder;
		padding: $uni-spacing-xs $uni-spacing-md;
		border-radius: $uni-radius-sm;
		transition: all 0.2s ease;

		&.active {
			color: $uni-color-primary;
			background: rgba(255, 159, 41, 0.1);
			font-weight: 500;
		}
	}
}

// 登录表单
.login-form {
	.form-item {
		margin-bottom: $uni-spacing-md;

		.input-wrapper {
			display: flex;
			align-items: center;
			gap: $uni-spacing-sm;
			padding: $uni-spacing-md $uni-spacing-lg;
			background: $uni-bg-color-card;
			border-radius: $uni-radius-lg;
			box-shadow: $uni-shadow-card;
			transition: box-shadow 0.2s ease;

			&:focus-within {
				box-shadow: $uni-shadow-float;
			}

			.input {
				flex: 1;
				font-size: $uni-font-size-base;
				color: $uni-text-color;
			}

			.code-btn {
				padding: $uni-spacing-xs $uni-spacing-md;
				background: $uni-color-primary;
				color: $uni-text-color-inverse;
				font-size: $uni-font-size-sm;
				border-radius: $uni-radius-sm;
				border: none;
				line-height: 1.5;
				font-weight: 500;
				transition: opacity 0.2s ease;

				&:active {
					opacity: 0.8;
				}

				&[disabled] {
					background: $uni-border-color;
					color: $uni-text-color-placeholder;
				}
			}
		}
	}

	.form-extra {
		display: flex;
		justify-content: flex-end;
		margin-bottom: $uni-spacing-lg;
	}

	.login-btn {
		width: 100%;
		height: 96rpx;
		background: $uni-color-primary-gradient;
		color: $uni-text-color-inverse;
		font-size: $uni-font-size-md;
		font-weight: 600;
		border-radius: $uni-radius-btn;
		border: none;
		margin-bottom: $uni-spacing-lg;
		box-shadow: $uni-shadow-glow;
		transition: transform 0.2s ease, opacity 0.2s ease;

		&:active {
			transform: scale(0.98);
			opacity: 0.9;
		}

		&[disabled] {
			background: $uni-border-color;
			box-shadow: none;
		}
	}

	.register-tip {
		text-align: center;
		font-size: $uni-font-size-sm;

		.tip-text {
			color: $uni-text-color-placeholder;
		}
	}
}

// 第三方登录
.third-party-login {
	margin-top: 60rpx;

	.divider {
		display: flex;
		align-items: center;
		gap: $uni-spacing-sm;
		margin-bottom: $uni-spacing-xl;

		.line {
			flex: 1;
			height: 1rpx;
			background: $uni-border-color;
		}

		.text {
			font-size: $uni-font-size-sm;
			color: $uni-text-color-placeholder;
		}
	}

	.login-methods {
		display: flex;
		justify-content: center;
		gap: 80rpx;

		.method-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: $uni-spacing-sm;
			transition: transform 0.2s ease;

			&:active {
				transform: scale(0.95);
			}

			.method-icon {
				width: 88rpx;
				height: 88rpx;
				border-radius: $uni-radius-circle;
				box-shadow: $uni-shadow-sm;
			}

			.method-text {
				font-size: $uni-font-size-sm;
				color: $uni-text-color-secondary;
			}
		}
	}
}

// 用户协议
.agreement {
	position: fixed;
	bottom: $uni-spacing-xl;
	left: $uni-spacing-lg;
	right: $uni-spacing-lg;

	.agreement-label {
		display: flex;
		align-items: flex-start;
		gap: $uni-spacing-xs;

		.agreement-text {
			flex: 1;
			font-size: $uni-font-size-xs;
			color: $uni-text-color-placeholder;
			line-height: 1.6;
		}
	}
}

// 链接文本
.link-text {
	color: $uni-color-primary;
	font-weight: 500;
}
</style>
