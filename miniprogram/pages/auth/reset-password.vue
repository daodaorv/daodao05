<template>
	<view class="reset-password-page">
		<!-- 顶部 -->
		<view class="header">
			<text class="title">重置密码</text>
			<text class="subtitle">请输入手机号验证身份</text>
		</view>

		<!-- 重置表单 -->
		<view class="reset-form">
			<!-- 手机号 -->
			<view class="form-item">
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

			<!-- 验证码 -->
			<view class="form-item">
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

			<!-- 新密码 -->
			<view class="form-item">
				<view class="input-wrapper">
					<u-icon name="locked" size="20" color="#999999" />
					<input
						v-model="formData.newPassword"
						:password="!showPassword"
						placeholder="请输入新密码（6-20位）"
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

			<!-- 确认密码 -->
			<view class="form-item">
				<view class="input-wrapper">
					<u-icon name="locked" size="20" color="#999999" />
					<input
						v-model="formData.confirmPassword"
						:password="!showConfirmPassword"
						placeholder="请再次输入新密码"
						class="input"
					/>
					<u-icon
						:name="showConfirmPassword ? 'eye-filled' : 'eye-slash-filled'"
						size="20"
						color="#999999"
						@click="showConfirmPassword = !showConfirmPassword"
					/>
				</view>
			</view>

			<!-- 提交按钮 -->
			<button class="submit-btn" :disabled="!canSubmit" @click="handleSubmit">
				{{ loading ? '提交中...' : '确认重置' }}
			</button>

			<!-- 返回登录 -->
			<view class="back-tip">
				<text class="link-text" @click="goToLogin">返回登录</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { sendCode } from '@/api/auth'

// 表单数据
const formData = ref({
	phone: '',
	code: '',
	newPassword: '',
	confirmPassword: ''
})

// 状态
const loading = ref(false)
const codeSending = ref(false)
const countdown = ref(0)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 验证码按钮文本
const codeButtonText = computed(() => {
	if (codeSending.value) return '发送中...'
	if (countdown.value > 0) return `${countdown.value}s`
	return '获取验证码'
})

// 是否可以提交
const canSubmit = computed(() => {
	return (
		formData.value.phone.length === 11 &&
		formData.value.code.length === 6 &&
		formData.value.newPassword.length >= 6 &&
		formData.value.newPassword.length <= 20 &&
		formData.value.confirmPassword === formData.value.newPassword
	)
})

// 发送验证码
const handleSendCode = async () => {
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

// 提交重置
const handleSubmit = async () => {
	// 验证两次密码是否一致
	if (formData.value.newPassword !== formData.value.confirmPassword) {
		uni.showToast({
			title: '两次密码输入不一致',
			icon: 'none'
		})
		return
	}

	try {
		loading.value = true

		// Mock: 模拟重置密码
		await new Promise((resolve) => setTimeout(resolve, 1000))

		uni.showToast({
			title: '密码重置成功',
			icon: 'success'
		})

		// 延迟跳转到登录页
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
	} catch (error: any) {
		uni.showToast({
			title: error.message || '重置失败',
			icon: 'none'
		})
	} finally {
		loading.value = false
	}
}

// 返回登录
const goToLogin = () => {
	uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.reset-password-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #FFF5E6 0%, #FFFFFF 50%);
	padding: 0 48rpx;
}

.header {
	padding: 120rpx 0 80rpx;

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

.reset-form {
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

	.submit-btn {
		width: 100%;
		height: 88rpx;
		background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);
		color: #FFFFFF;
		font-size: 32rpx;
		font-weight: 500;
		border-radius: 44rpx;
		border: none;
		margin-top: 16rpx;
		margin-bottom: 32rpx;

		&[disabled] {
			background: #CCCCCC;
		}
	}

	.back-tip {
		text-align: center;
		font-size: 24rpx;
	}
}

.link-text {
	color: #FF9F29;
	cursor: pointer;
}
</style>
