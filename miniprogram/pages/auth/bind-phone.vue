<template>
	<view class="bind-phone-page">
		<!-- 顶部说明 -->
		<view class="header">
			<image class="icon" src="/static/icons/phone-bind.png" mode="aspectFit" />
			<text class="title">绑定手机号</text>
			<text class="subtitle">为了您的账号安全，请绑定手机号</text>
		</view>

		<!-- 绑定表单 -->
		<view class="bind-form">
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

			<!-- 提示信息 -->
			<view class="tips">
				<view class="tip-item">
					<u-icon name="info" size="16" color="#FF9F29" />
					<text class="tip-text">绑定手机号后可使用手机号登录</text>
				</view>
				<view class="tip-item">
					<u-icon name="info" size="16" color="#FF9F29" />
					<text class="tip-text">手机号将用于接收订单通知和重要信息</text>
				</view>
			</view>

			<!-- 绑定按钮 -->
			<button class="bind-btn" :disabled="!canSubmit" @click="handleBind">
				{{ loading ? '绑定中...' : '确认绑定' }}
			</button>

			<!-- 跳过按钮 -->
			<button class="skip-btn" @click="handleSkip">暂不绑定</button>
		</view>

		<!-- 安全说明 -->
		<view class="security-info">
			<view class="info-title">
				<u-icon name="locked" size="16" color="#4CAF50" />
				<text class="title-text">安全保障</text>
			</view>
			<view class="info-list">
				<view class="info-item">
					<text class="dot">•</text>
					<text class="info-text">您的手机号仅用于账号安全验证</text>
				</view>
				<view class="info-item">
					<text class="dot">•</text>
					<text class="info-text">我们承诺不会泄露您的个人信息</text>
				</view>
				<view class="info-item">
					<text class="dot">•</text>
					<text class="info-text">您可以随时在设置中修改绑定手机号</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { bindPhone, sendCode } from '@/api/auth'

// 表单数据
const formData = ref({
	phone: '',
	code: ''
})

// 状态
const loading = ref(false)
const codeSending = ref(false)
const countdown = ref(0)

// 验证码按钮文本
const codeButtonText = computed(() => {
	if (codeSending.value) return '发送中...'
	if (countdown.value > 0) return `${countdown.value}s`
	return '获取验证码'
})

// 是否可以提交
const canSubmit = computed(() => {
	return formData.value.phone.length === 11 && formData.value.code.length === 6
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
		await sendCode(formData.value.phone, 'bind')
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

// 绑定手机号
const handleBind = async () => {
	try {
		loading.value = true

		// 调用绑定接口
		await bindPhone({
			phone: formData.value.phone,
			code: formData.value.code
		})

		// 更新本地存储的用户信息
		const userInfo = uni.getStorageSync('userInfo')
		if (userInfo) {
			userInfo.phone = formData.value.phone
			uni.setStorageSync('userInfo', userInfo)
		}

		uni.showToast({
			title: '绑定成功',
			icon: 'success'
		})

		// 延迟跳转
		setTimeout(() => {
			// 获取来源页面
			const pages = getCurrentPages()
			if (pages.length > 1) {
				// 返回上一页
				uni.navigateBack()
			} else {
				// 跳转到首页
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}, 1500)
	} catch (error: any) {
		uni.showToast({
			title: error.message || '绑定失败',
			icon: 'none'
		})
	} finally {
		loading.value = false
	}
}

// 跳过绑定
const handleSkip = () => {
	uni.showModal({
		title: '提示',
		content: '暂不绑定手机号将无法进行预订等业务操作，确定要跳过吗？',
		confirmText: '确定跳过',
		cancelText: '继续绑定',
		success: (res) => {
			if (res.confirm) {
				// 跳转到首页
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}
	})
}
</script>

<style lang="scss" scoped>
.bind-phone-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #FFF5E6 0%, #FFFFFF 50%);
	padding: 0 48rpx;
}

// 顶部说明
.header {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 120rpx 0 80rpx;

	.icon {
		width: 160rpx;
		height: 160rpx;
		margin-bottom: 32rpx;
	}

	.title {
		font-size: 48rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 16rpx;
	}

	.subtitle {
		font-size: 24rpx;
		color: #999999;
		text-align: center;
	}
}

// 绑定表单
.bind-form {
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
	}

	.tips {
		margin: 32rpx 0 48rpx;
		padding: 24rpx;
		background: #FFF9F0;
		border-radius: 12rpx;

		.tip-item {
			display: flex;
			align-items: flex-start;
			gap: 8rpx;
			margin-bottom: 12rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.tip-text {
				flex: 1;
				font-size: 24rpx;
				color: #666666;
				line-height: 1.6;
			}
		}
	}

	.bind-btn {
		width: 100%;
		height: 88rpx;
		background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);
		color: #FFFFFF;
		font-size: 32rpx;
		font-weight: 500;
		border-radius: 44rpx;
		border: none;
		margin-bottom: 24rpx;

		&[disabled] {
			background: #CCCCCC;
		}
	}

	.skip-btn {
		width: 100%;
		height: 88rpx;
		background: transparent;
		color: #999999;
		font-size: 28rpx;
		border-radius: 44rpx;
		border: 1rpx solid #E5E5E5;
	}
}

// 安全说明
.security-info {
	margin-top: 80rpx;
	padding: 32rpx;
	background: #F5F5F5;
	border-radius: 16rpx;

	.info-title {
		display: flex;
		align-items: center;
		gap: 8rpx;
		margin-bottom: 24rpx;

		.title-text {
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
		}
	}

	.info-list {
		.info-item {
			display: flex;
			align-items: flex-start;
			gap: 8rpx;
			margin-bottom: 16rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.dot {
				color: #4CAF50;
				font-size: 24rpx;
				line-height: 1.6;
			}

			.info-text {
				flex: 1;
				font-size: 24rpx;
				color: #666666;
				line-height: 1.6;
			}
		}
	}
}
</style>
