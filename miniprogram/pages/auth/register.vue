<template>
	<view class="register-page">
		<!-- 顶部标题 -->
		<view class="header">
			<text class="title">注册账号</text>
			<text class="subtitle">欢迎加入叨叨房车</text>
		</view>

		<!-- 注册表单 -->
		<view class="register-form">
			<!-- 手机号输入 -->
			<view class="form-item">
				<view class="label">
					<text class="label-text">手机号</text>
					<text class="required">*</text>
				</view>
				<view class="input-wrapper">
					<u-icon name="phone" size="20" color="#999999" />
					<input
						v-model="formData.phone"
						name="number"
						maxlength="11"
						placeholder="请输入手机号"
						class="input"
					/>
				</view>
			</view>

			<!-- 验证码输入 -->
			<view class="form-item">
				<view class="label">
					<text class="label-text">验证码</text>
					<text class="required">*</text>
				</view>
				<view class="input-wrapper">
					<u-icon name="chatboxes" size="20" color="#999999" />
					<input
						v-model="formData.code"
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
			<view class="form-item">
				<view class="label">
					<text class="label-text">设置密码</text>
					<text class="optional">（可选）</text>
				</view>
				<view class="input-wrapper">
					<u-icon name="locked" size="20" color="#999999" />
					<input
						v-model="formData.password"
						:password="!showPassword"
						placeholder="6-20位字母、数字或符号"
						class="input"
					/>
					<u-icon
						:name="showPassword ? 'eye-filled' : 'eye-slash-filled'"
						size="20"
						color="#999999"
						@click="showPassword = !showPassword"
					/>
				</view>
				<view class="hint">设置密码后可使用密码登录</view>
			</view>

			<!-- 昵称输入 -->
			<view class="form-item">
				<view class="label">
					<text class="label-text">昵称</text>
					<text class="optional">（可选）</text>
				</view>
				<view class="input-wrapper">
					<u-icon name="person" size="20" color="#999999" />
					<input
						v-model="formData.nickname"
						maxlength="20"
						placeholder="请输入昵称"
						class="input"
					/>
				</view>
			</view>

			<!-- 邀请码输入 -->
			<view class="form-item">
				<view class="label">
					<text class="label-text">邀请码</text>
					<text class="optional">（可选）</text>
				</view>
				<view class="input-wrapper">
					<u-icon name="gift" size="20" color="#999999" />
					<input
						v-model="formData.inviteCode"
						maxlength="8"
						placeholder="请输入邀请码"
						class="input"
					/>
				</view>
				<view class="hint">填写邀请码可获得额外积分奖励</view>
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

			<!-- 注册按钮 -->
			<button class="register-btn" :disabled="!canSubmit" @click="handleRegister">
				{{ loading ? '注册中...' : '立即注册' }}
			</button>

			<!-- 登录提示 -->
			<view class="login-tip">
				<text class="tip-text">已有账号？</text>
				<text class="link-text" @click="goToLogin">立即登录</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { register, sendCode, type RegisterParams } from '@/api/auth'
import { saveLoginInfo, handleLoginSuccess } from '@/utils/auth'

// 表单数据
const formData = ref({
	phone: '',
	code: '',
	password: '',
	nickname: '',
	inviteCode: ''
})

// 状态
const loading = ref(false)
const codeSending = ref(false)
const countdown = ref(0)
const showPassword = ref(false)
const agreed = ref(false)

// 验证码按钮文本
const codeButtonText = computed(() => {
	if (codeSending.value) return '发送中...'
	if (countdown.value > 0) return `${countdown.value}s`
	return '获取验证码'
})

// 是否可以提交
const canSubmit = computed(() => {
	if (!agreed.value) return false
	if (!formData.value.phone || formData.value.phone.length !== 11) return false
	if (!formData.value.code || formData.value.code.length !== 6) return false
	// 如果填写了密码，需要验证密码长度
	if (formData.value.password && formData.value.password.length < 6) return false
	return true
})

// 发送验证码
const handleSendCode = async () => {
	// 验证手机号
	if (!formData.value.phone || formData.value.phone.length !== 11) {
		uni.showToast({
			title: '请输入正确的手机号',
			icon: 'none'
		})
		return
	}

	try {
		codeSending.value = true
		await sendCode(formData.value.phone, 'register')
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

// 注册
const handleRegister = async () => {
	if (!agreed.value) {
		uni.showToast({
			title: '请先同意用户协议和隐私政策',
			icon: 'none'
		})
		return
	}

	// 验证密码长度（如果填写了密码）
	if (formData.value.password && formData.value.password.length < 6) {
		uni.showToast({
			title: '密码长度不能少于6位',
			icon: 'none'
		})
		return
	}

	try {
		loading.value = true

		// 构建注册参数
		const params: RegisterParams = {
			phone: formData.value.phone,
			code: formData.value.code
		}

		// 可选参数
		if (formData.value.password) {
			params.password = formData.value.password
		}
		if (formData.value.nickname) {
			params.nickname = formData.value.nickname
		}
		if (formData.value.inviteCode) {
			params.inviteCode = formData.value.inviteCode
		}

		// 调用注册接口
		const result = await register(params)

		// 保存登录信息
		saveLoginInfo(result.token, result.refreshToken, result.user)

		uni.showToast({
			title: '注册成功',
			icon: 'success'
		})

		// 延迟跳转
		setTimeout(() => {
			handleLoginSuccess()
		}, 1500)
	} catch (error: any) {
		uni.showToast({
			title: error.message || '注册失败',
			icon: 'none'
		})
	} finally {
		loading.value = false
	}
}

// 去登录
const goToLogin = () => {
	uni.navigateBack()
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
.register-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #FFF5E6 0%, #FFFFFF 50%);
	padding: 0 48rpx;
}

// 顶部标题
.header {
	padding: 80rpx 0 64rpx;

	.title {
		display: block;
		font-size: 48rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 16rpx;
	}

	.subtitle {
		display: block;
		font-size: 24rpx;
		color: #999999;
	}
}

// 注册表单
.register-form {
	.form-item {
		margin-bottom: 32rpx;

		.label {
			display: flex;
			align-items: center;
			margin-bottom: 16rpx;

			.label-text {
				font-size: 28rpx;
				color: #333333;
			}

			.required {
				color: #FF4D4F;
				margin-left: 4rpx;
			}

			.optional {
				font-size: 24rpx;
				color: #999999;
				margin-left: 8rpx;
			}
		}

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

		.hint {
			margin-top: 12rpx;
			font-size: 22rpx;
			color: #999999;
			padding-left: 16rpx;
		}
	}

	.agreement {
		margin: 48rpx 0 32rpx;

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

	.register-btn {
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

	.login-tip {
		text-align: center;
		font-size: 24rpx;

		.tip-text {
			color: #999999;
		}
	}
}

// 链接文本
.link-text {
	color: #FF9F29;
	cursor: pointer;
}
</style>
