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
			<button class="oneclick-btn" @click="handleOneClickLogin">
				<image class="platform-icon" :src="platformIcon" mode="aspectFit" />
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
						<u-icon name="chatboxes" size="20" color="#999999" />
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
						<u-icon name="locked" size="20" color="#999999" />
						<input
							v-model="phoneForm.password"
							:password="!showPassword"
							placeholder="请输入密码"
							class="input"
						/>
						<u-icon
							:name="showPassword ? 'eye-filled' : 'eye-slash-filled'"
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
						<u-icon name="person" size="20" color="#999999" />
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
						<u-icon name="locked" size="20" color="#999999" />
						<input
							v-model="usernameForm.password"
							:password="!showPassword"
							placeholder="请输入密码"
							class="input"
						/>
						<u-icon
							:name="showPassword ? 'eye-filled' : 'eye-slash-filled'"
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
import { ref, computed, onMounted } from 'vue'
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
	console.log('[登录页面] 当前平台:', platform.value, '支持一键登录:', showOneClickLogin.value)
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
		const timer = setInterval(() => {
			countdown.value--
			if (countdown.value <= 0) {
				clearInterval(timer)
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

// 一键登录
const handleOneClickLogin = async () => {
	if (!agreed.value) {
		uni.showToast({
			title: '请先同意用户协议和隐私政策',
			icon: 'none'
		})
		return
	}

	try {
		loading.value = true

		// 根据平台调用不同的登录方法
		let result
		if (platform.value === 'weixin') {
			// 微信登录
			const loginRes = await uni.login({ provider: 'weixin' })
			if (!loginRes[1] || !loginRes[1].code) {
				throw new Error('获取微信授权失败')
			}
			result = await wechatLogin({ code: loginRes[1].code })
		} else if (platform.value === 'alipay') {
			// 支付宝登录
			const loginRes = await uni.login({ provider: 'alipay' })
			if (!loginRes[1] || !loginRes[1].code) {
				throw new Error('获取支付宝授权失败')
			}
			result = await alipayLogin({ code: loginRes[1].code })
		} else if (platform.value === 'douyin') {
			// 抖音登录
			const loginRes = await uni.login({ provider: 'toutiao' })
			if (!loginRes[1] || !loginRes[1].code) {
				throw new Error('获取抖音授权失败')
			}
			result = await douyinLogin({ code: loginRes[1].code })
		}

		if (!result) {
			throw new Error('登录失败')
		}

		// 检查是否需要绑定手机号
		if (!result.user.phone) {
			// 保存临时token
			uni.setStorageSync('tempToken', result.token)
			uni.setStorageSync('tempUserInfo', result.user)
			// 跳转到手机绑定页面
			uni.navigateTo({
				url: '/pages/auth/bind-phone'
			})
			return
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
	// TODO: H5环境的第三方登录
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
	// TODO: 跳转到协议页面
}
</script>

<style lang="scss" scoped>
.login-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #FFF5E6 0%, #FFFFFF 50%);
	padding: 0 48rpx;
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
		margin-bottom: 32rpx;
	}

	.app-name {
		font-size: 48rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 16rpx;
	}

	.slogan {
		font-size: 24rpx;
		color: #999999;
	}
}

// 一键登录
.oneclick-section {
	margin-bottom: 32rpx;

	.oneclick-btn {
		width: 100%;
		height: 88rpx;
		background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);
		color: #FFFFFF;
		font-size: 32rpx;
		font-weight: 500;
		border-radius: 44rpx;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16rpx;
		margin-bottom: 32rpx;

		.platform-icon {
			width: 40rpx;
			height: 40rpx;
		}
	}

	.divider {
		display: flex;
		align-items: center;
		gap: 16rpx;

		.line {
			flex: 1;
			height: 1rpx;
			background: #E5E5E5;
		}

		.text {
			font-size: 24rpx;
			color: #999999;
		}
	}
}

// 登录方式切换
.login-tabs {
	display: flex;
	gap: 48rpx;
	margin-bottom: 32rpx;

	.tab-item {
		font-size: 32rpx;
		color: #999999;
		padding-bottom: 16rpx;
		position: relative;
		cursor: pointer;

		&.active {
			color: #333333;
			font-weight: 500;

			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 4rpx;
				background: #FF9F29;
				border-radius: 2rpx;
			}
		}
	}
}

// 子标签切换
.sub-tabs {
	display: flex;
	gap: 32rpx;
	margin-bottom: 24rpx;

	.sub-tab {
		font-size: 28rpx;
		color: #999999;
		padding: 8rpx 24rpx;
		border-radius: 8rpx;
		cursor: pointer;

		&.active {
			color: #FF9F29;
			background: #FFF5E6;
		}
	}
}

// 登录表单
.login-form {
	.form-item {
		margin-bottom: 32rpx;

		.input-wrapper {
			display: flex;
			align-items: center;
			gap: 16rpx;
			padding: 24rpx 32rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);

			.input {
				flex: 1;
				font-size: 28rpx;
				color: #333333;
			}

			.code-btn {
				padding: 8rpx 24rpx;
				background: #FF9F29;
				color: #FFFFFF;
				font-size: 24rpx;
				border-radius: 8rpx;
				border: none;
				line-height: 1;

				&[disabled] {
					background: #CCCCCC;
				}
			}
		}
	}

	.form-extra {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 32rpx;
	}

	.login-btn {
		width: 100%;
		height: 88rpx;
		background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);
		color: #FFFFFF;
		font-size: 32rpx;
		font-weight: 500;
		border-radius: 44rpx;
		border: none;
		margin-bottom: 32rpx;

		&[disabled] {
			background: #CCCCCC;
		}
	}

	.register-tip {
		text-align: center;
		font-size: 24rpx;

		.tip-text {
			color: #999999;
		}
	}
}

// 第三方登录
.third-party-login {
	margin-top: 60rpx;

	.divider {
		display: flex;
		align-items: center;
		gap: 16rpx;
		margin-bottom: 48rpx;

		.line {
			flex: 1;
			height: 1rpx;
			background: #E5E5E5;
		}

		.text {
			font-size: 24rpx;
			color: #999999;
		}
	}

	.login-methods {
		display: flex;
		justify-content: center;
		gap: 64rpx;

		.method-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 16rpx;

			.method-icon {
				width: 80rpx;
				height: 80rpx;
			}

			.method-text {
				font-size: 24rpx;
				color: #666666;
			}
		}
	}
}

// 用户协议
.agreement {
	position: fixed;
	bottom: 48rpx;
	left: 48rpx;
	right: 48rpx;

	.agreement-label {
		display: flex;
		align-items: flex-start;
		gap: 8rpx;

		.agreement-text {
			flex: 1;
			font-size: 22rpx;
			color: #999999;
			line-height: 1.6;
		}
	}
}

// 链接文本
.link-text {
	color: #FF9F29;
	cursor: pointer;
}
</style>
