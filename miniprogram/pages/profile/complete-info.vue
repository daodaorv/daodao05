<template>
	<view class="complete-info-page">
		<!-- 顶部提示 -->
		<view class="header-tip">
			<text class="tip-title">完善个人信息</text>
			<text class="tip-desc">为了更好的服务体验，请完善您的个人信息</text>
		</view>

		<!-- 头像选择 -->
		<view class="info-section">
			<view class="section-title">头像</view>
			<view class="avatar-wrapper">
				<!-- 微信小程序使用 open-type="chooseAvatar" -->
				<button
					class="avatar-btn"
					open-type="chooseAvatar"
					@chooseavatar="handleChooseAvatar"
				>
					<image
						class="avatar-image"
						:src="userInfo.avatar || '/static/default-avatar.png'"
						mode="aspectFill"
					/>
					<view class="avatar-mask">
						<u-icon name="camera" size="32" color="#FFFFFF" />
						<text class="mask-text">点击更换</text>
					</view>
				</button>
			</view>
			<view class="section-tip">点击头像可以更换</view>
		</view>

		<!-- 昵称输入 -->
		<view class="info-section">
			<view class="section-title">昵称</view>
			<view class="nickname-wrapper">
				<!-- 微信小程序使用 type="nickname" -->
				<input
					type="nickname"
					class="nickname-input"
					v-model="userInfo.nickname"
					placeholder="请输入昵称"
					placeholder-class="placeholder"
					maxlength="20"
					@blur="handleNicknameBlur"
				/>
			</view>
			<view class="section-tip">请输入您的昵称（2-20个字符）</view>
		</view>

		<!-- 性别选择（可选） -->
		<view class="info-section">
			<view class="section-title">性别（可选）</view>
			<view class="gender-wrapper">
				<view
					class="gender-item"
					:class="{ active: userInfo.gender === 1 }"
					@click="handleGenderChange(1)"
				>
					<u-icon name="man" size="24" :color="userInfo.gender === 1 ? '#FF9F29' : '#999999'" />
					<text class="gender-text">男</text>
				</view>
				<view
					class="gender-item"
					:class="{ active: userInfo.gender === 2 }"
					@click="handleGenderChange(2)"
				>
					<u-icon name="woman" size="24" :color="userInfo.gender === 2 ? '#FF9F29' : '#999999'" />
					<text class="gender-text">女</text>
				</view>
			</view>
		</view>

		<!-- 保存按钮 -->
		<view class="button-wrapper">
			<button
				class="save-btn"
				:disabled="!canSubmit || loading"
				@click="handleSave"
			>
				{{ loading ? '保存中...' : '保存' }}
			</button>
			<button
				v-if="canSkip"
				class="skip-btn"
				:disabled="loading"
				@click="handleSkip"
			>
				{{ loading ? '处理中...' : '暂时跳过，使用默认信息' }}
			</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger';
import { ref, computed, onMounted } from 'vue'
import { updateUserProfile } from '@/api/auth'
import { onLoad } from '@dcloudio/uni-app'

// 用户信息
const userInfo = ref({
	avatar: '',
	nickname: '',
	gender: 0 // 0-未知, 1-男, 2-女
})

// 状态
const loading = ref(false)
const canSkip = ref(false)
const fromPage = ref('')

// 是否可以提交
const canSubmit = computed(() => {
	return userInfo.value.nickname.trim().length >= 2 && userInfo.value.avatar !== ''
})

// 页面加载
onLoad((options) => {
	logger.debug('[完善信息] 页面参数:', options)

	// 检查是否从登录页跳转
	if (options?.from === 'login') {
		fromPage.value = 'login'
		canSkip.value = true
	}

	// 尝试从缓存加载用户信息
	const cachedUserInfo = uni.getStorageSync('userInfo')
	if (cachedUserInfo) {
		try {
			const parsed = typeof cachedUserInfo === 'string'
				? JSON.parse(cachedUserInfo)
				: cachedUserInfo

			userInfo.value = {
				avatar: parsed.avatar || '',
				nickname: parsed.nickname || '',
				gender: parsed.gender || 0
			}
		} catch (error) {
			logger.error('[完善信息] 解析用户信息失败:', error)
		}
	}
})

// 选择头像回调
const handleChooseAvatar = (e: any) => {
	logger.debug('[选择头像] 回调事件:', e)

	if (e.detail.avatarUrl) {
		// 临时显示头像
		userInfo.value.avatar = e.detail.avatarUrl

		// 上传头像到服务器
		uploadAvatar(e.detail.avatarUrl)
	}
}

// 上传头像
const uploadAvatar = (tempFilePath: string) => {
	logger.debug('[上传头像] 开始上传，临时文件路径:', tempFilePath)

	// 当前使用 Mock 模式，直接使用微信临时头像
	// 等待后端上传接口开发完成后再对接
	logger.debug('[上传头像] Mock 模式：直接使用微信临时头像')

	uni.showToast({
		title: '头像已选择',
		icon: 'success',
		duration: 1500
	})

	// Mock: 直接使用微信返回的临时头像 URL
	// 实际场景中，这个 URL 会在保存时上传到服务器
	userInfo.value.avatar = tempFilePath

	/*
	// 后端接口开发完成后使用以下代码：
	uni.showLoading({
		title: '上传中...',
		mask: true
	})

	uni.uploadFile({
		url: 'https://api.daodao.com/upload/avatar', // 替换为实际接口
		filePath: tempFilePath,
		name: 'file',
		header: {
			'Authorization': `Bearer ${uni.getStorageSync('token')}`
		},
		success: (uploadRes) => {
			logger.debug('[上传头像] 服务器响应:', uploadRes)

			// 检查 HTTP 状态码
			if (uploadRes.statusCode !== 200) {
				throw new Error(`服务器错误: ${uploadRes.statusCode}`)
			}

			// 检查响应数据是否为空
			if (!uploadRes.data) {
				throw new Error('服务器返回空数据')
			}

			try {
				// 尝试解析 JSON
				const data = JSON.parse(uploadRes.data)

				if (data.code === 0 || data.success) {
					userInfo.value.avatar = data.url || data.data?.url
					logger.debug('[上传头像] 成功:', userInfo.value.avatar)
					uni.showToast({
						title: '头像上传成功',
						icon: 'success'
					})
				} else {
					throw new Error(data.message || '上传失败')
				}
			} catch (parseError: any) {
				logger.error('[上传头像] JSON 解析失败:', parseError)
				logger.error('[上传头像] 原始响应数据:', uploadRes.data)

				// 如果解析失败，显示原始错误信息
				const errorMsg = typeof uploadRes.data === 'string'
					? uploadRes.data.substring(0, 50)
					: '服务器返回格式错误'

				throw new Error(errorMsg)
			}
		},
		fail: (err) => {
			logger.error('[上传头像] 请求失败:', err)
			uni.showToast({
				title: err.errMsg || '上传失败',
				icon: 'none'
			})
			// 恢复默认头像
			userInfo.value.avatar = ''
		},
		complete: () => {
			uni.hideLoading()
		}
	})
	*/
}

// 昵称输入失焦
const handleNicknameBlur = (e: any) => {
	logger.debug('[昵称输入] 值:', e.detail.value)
	userInfo.value.nickname = e.detail.value.trim()
}

// 性别选择
const handleGenderChange = (gender: number) => {
	userInfo.value.gender = gender
	logger.debug('[性别选择] 值:', gender)
}

// 保存
const handleSave = async () => {
	// 验证昵称
	if (userInfo.value.nickname.trim().length < 2) {
		uni.showToast({
			title: '昵称至少2个字符',
			icon: 'none'
		})
		return
	}

	// 验证头像
	if (!userInfo.value.avatar) {
		uni.showToast({
			title: '请选择头像',
			icon: 'none'
		})
		return
	}

	try {
		loading.value = true

		// 调用更新用户资料接口
		const result = await updateUserProfile({
			nickname: userInfo.value.nickname,
			avatar: userInfo.value.avatar,
			gender: userInfo.value.gender
		})

		logger.debug('[完善信息] 保存成功:', result)

		// 更新本地缓存
		const cachedUserInfo = uni.getStorageSync('userInfo')
		if (cachedUserInfo) {
			const parsed = typeof cachedUserInfo === 'string'
				? JSON.parse(cachedUserInfo)
				: cachedUserInfo

			const updatedUserInfo = {
				...parsed,
				nickname: userInfo.value.nickname,
				avatar: userInfo.value.avatar,
				gender: userInfo.value.gender
			}

			uni.setStorageSync('userInfo', updatedUserInfo)
		}

		uni.showToast({
			title: '保存成功',
			icon: 'success'
		})

		// 延迟跳转
		setTimeout(() => {
			if (fromPage.value === 'login') {
				// 从登录页来的，跳转到首页
				uni.switchTab({
					url: '/pages/index/index'
				})
			} else {
				// 其他情况返回上一页
				uni.navigateBack()
			}
		}, 1500)
	} catch (error: any) {
		logger.error('[完善信息] 保存失败:', error)
		uni.showToast({
			title: error.message || '保存失败',
			icon: 'none'
		})
	} finally {
		loading.value = false
	}
}

// 跳过
const handleSkip = async () => {
	try {
		loading.value = true

		// 生成默认昵称和头像
		const cachedUserInfo = uni.getStorageSync('userInfo')
		const parsed = typeof cachedUserInfo === 'string'
			? JSON.parse(cachedUserInfo)
			: cachedUserInfo

		// 生成随机编号（3位数）
		const randomNum = Math.floor(Math.random() * 900) + 100
		const defaultNickname = `叨叨车友${randomNum}`
		const defaultAvatar = '/static/logo.png' // 使用叨叨房车logo作为默认头像

		logger.debug('[跳过完善信息] 生成默认信息:', { defaultNickname, defaultAvatar })

		// 调用后端API保存默认信息
		const result = await updateUserProfile({
			nickname: defaultNickname,
			avatar: defaultAvatar,
			gender: 0
		})

		// 更新本地缓存
		const updatedUserInfo = {
			...parsed,
			nickname: defaultNickname,
			avatar: defaultAvatar,
			gender: 0
		}
		uni.setStorageSync('userInfo', updatedUserInfo)

		logger.debug('[跳过完善信息] 保存成功，跳转首页')

		uni.showToast({
			title: '已使用默认信息',
			icon: 'success',
			duration: 1500
		})

		// 跳转到首页
		setTimeout(() => {
			uni.switchTab({
				url: '/pages/index/index'
			})
		}, 1500)
	} catch (error: any) {
		logger.error('[跳过完善信息] 保存失败:', error)
		uni.showToast({
			title: error.message || '操作失败',
			icon: 'none'
		})
	} finally {
		loading.value = false
	}
}
</script>

<style lang="scss" scoped>
.complete-info-page {
	min-height: 100vh;
	background: linear-gradient(180deg, rgba($uni-color-primary, 0.08) 0%, $uni-bg-color-card 30%);
	padding: 0 48rpx;
}

// 顶部提示
.header-tip {
	padding: 80rpx 0 60rpx;
	text-align: center;

	.tip-title {
		display: block;
		font-size: 48rpx;
		font-weight: bold;
		color: $uni-text-color;
		margin-bottom: $uni-spacing-lg;
	}

	.tip-desc {
		display: block;
		font-size: $uni-font-size-base;
		color: $uni-text-color-placeholder;
	}
}

// 信息区块
.info-section {
	margin-bottom: 48rpx;

	.section-title {
		font-size: $uni-font-size-lg;
		font-weight: 500;
		color: $uni-text-color;
		margin-bottom: $uni-spacing-xl;
	}

	.section-tip {
		font-size: $uni-font-size-xs;
		color: $uni-text-color-placeholder;
		margin-top: $uni-spacing-lg;
	}
}

// 头像选择
.avatar-wrapper {
	display: flex;
	justify-content: center;
	padding: $uni-spacing-xl 0;

	.avatar-btn {
		position: relative;
		width: 200rpx;
		height: 200rpx;
		border-radius: $uni-radius-circle;
		overflow: hidden;
		background: transparent;
		border: none;
		padding: 0;

		&::after {
			border: none;
		}

		.avatar-image {
			width: 100%;
			height: 100%;
			border-radius: $uni-radius-circle;
		}

		.avatar-mask {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.5);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			opacity: 0;
			transition: opacity 0.3s;

			.mask-text {
				font-size: $uni-font-size-xs;
				color: $uni-text-color-inverse;
				margin-top: $uni-spacing-sm;
			}
		}

		&:active .avatar-mask {
			opacity: 1;
		}
	}
}

// 昵称输入
.nickname-wrapper {
	background: $uni-bg-color-card;
	border-radius: $uni-radius-lg;
	padding: $uni-spacing-xl $uni-spacing-xl;
	box-shadow: $uni-shadow-card;

	.nickname-input {
		font-size: $uni-font-size-lg;
		color: $uni-text-color;
		width: 100%;

		.placeholder {
			color: $uni-text-color-placeholder;
		}
	}
}

// 性别选择
.gender-wrapper {
	display: flex;
	gap: $uni-spacing-xl;

	.gender-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: $uni-spacing-xl;
		background: $uni-bg-color-card;
		border-radius: $uni-radius-lg;
		box-shadow: $uni-shadow-card;
		border: 2rpx solid transparent;
		transition: all 0.3s;

		&.active {
			border-color: $uni-color-primary;
			background: rgba($uni-color-primary, 0.08);
		}

		.gender-text {
			font-size: $uni-font-size-base;
			color: $uni-text-color-secondary;
			margin-top: $uni-spacing-sm;
		}

		&.active .gender-text {
			color: $uni-color-primary;
			font-weight: 500;
		}
	}
}

// 按钮区域
.button-wrapper {
	margin-top: 80rpx;
	padding-bottom: 48rpx;

	.save-btn {
		width: 100%;
		height: 88rpx;
		background: $uni-color-primary-gradient;
		color: $uni-text-color-inverse;
		font-size: $uni-font-size-lg;
		font-weight: 500;
		border-radius: $uni-radius-btn;
		border: none;
		margin-bottom: $uni-spacing-xl;
		box-shadow: $uni-shadow-glow;
		transition: all 0.2s ease;

		&:active {
			transform: scale(0.98);
			opacity: 0.9;
		}

		&[disabled] {
			background: $uni-border-color;
			box-shadow: none;
		}
	}

	.skip-btn {
		width: 100%;
		height: 88rpx;
		background: transparent;
		color: $uni-text-color-placeholder;
		font-size: $uni-font-size-base;
		border-radius: $uni-radius-btn;
		border: 2rpx solid $uni-border-color-light;
		transition: all 0.2s ease;

		&:active {
			background: $uni-bg-color-grey;
		}
	}
}
</style>
