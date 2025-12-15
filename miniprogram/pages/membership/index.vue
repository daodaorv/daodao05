<template>
	<view class="membership-page">
		<!-- 会员状态卡片 -->
		<view class="member-card" :class="isPlusMember ? 'plus-member' : 'normal-member'">
			<view class="card-bg">
				<image v-if="isPlusMember" src="/static/images/member-plus-bg.png" mode="aspectFill" class="bg-image"></image>
			</view>

			<view class="card-content">
				<view class="member-info">
					<view class="member-level">
						<text class="level-text">{{ isPlusMember ? 'PLUS会员' : '普通会员' }}</text>
						<image v-if="isPlusMember" src="/static/icons/crown.png" class="crown-icon"></image>
					</view>

					<view v-if="isPlusMember" class="member-validity">
						<text class="validity-label">有效期至：</text>
						<text class="validity-date">{{ formatDate(memberInfo.endDate) }}</text>
					</view>

					<view v-else class="upgrade-tip">
						<text>开通PLUS会员，享受更多专属权益</text>
					</view>
				</view>

				<view class="member-action">
					<button v-if="isPlusMember" class="action-btn renew-btn" @click="handleRenew">
						续费
					</button>
					<button v-else class="action-btn upgrade-btn" @click="handleUpgrade">
						立即开通
					</button>
				</view>
			</view>
		</view>

		<!-- 会员权益 -->
		<view class="benefits-section">
			<view class="section-title">
				<text class="title-text">会员权益</text>
				<text class="title-desc">{{ isPlusMember ? '您已享有以下权益' : '开通后即可享有' }}</text>
			</view>

			<view class="benefits-grid">
				<view
					v-for="benefit in benefits"
					:key="benefit.id"
					class="benefit-item"
					:class="isPlusMember ? 'active' : 'inactive'"
				>
					<view class="benefit-icon">
						<image :src="getBenefitIcon(benefit.icon)" mode="aspectFit"></image>
					</view>
					<view class="benefit-info">
						<text class="benefit-name">{{ benefit.name }}</text>
						<text class="benefit-desc">{{ benefit.description }}</text>
					</view>
					<view v-if="isPlusMember" class="benefit-badge">
						<text>已开通</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 会员说明 -->
		<view class="info-section">
			<view class="section-title">
				<text class="title-text">会员说明</text>
			</view>

			<view class="info-list">
				<view class="info-item">
					<view class="info-label">
						<text class="label-icon">•</text>
						<text class="label-text">会员费用</text>
					</view>
					<text class="info-value">年费99元</text>
				</view>

				<view class="info-item">
					<view class="info-label">
						<text class="label-icon">•</text>
						<text class="label-text">有效期</text>
					</view>
					<text class="info-value">12个月</text>
				</view>

				<view class="info-item">
					<view class="info-label">
						<text class="label-icon">•</text>
						<text class="label-text">自动续费</text>
					</view>
					<view class="info-value-row">
						<text class="info-value">{{ memberInfo.autoRenew ? '已开启' : '未开启' }}</text>
						<switch
							v-if="isPlusMember"
							:checked="memberInfo.autoRenew"
							@change="handleAutoRenewChange"
							color="#FF9F29"
						/>
					</view>
				</view>

				<view class="info-item">
					<view class="info-label">
						<text class="label-icon">•</text>
						<text class="label-text">退款政策</text>
					</view>
					<text class="info-value">购买后7天内可申请退款</text>
				</view>
			</view>
		</view>

		<!-- 常见问题 -->
		<view class="faq-section">
			<view class="section-title">
				<text class="title-text">常见问题</text>
			</view>

			<view class="faq-list">
				<view
					v-for="(faq, index) in faqs"
					:key="index"
					class="faq-item"
					@click="toggleFaq(index)"
				>
					<view class="faq-question">
						<text class="question-text">{{ faq.question }}</text>
						<text class="arrow-icon" :class="faq.expanded ? 'expanded' : ''">›</text>
					</view>
					<view v-if="faq.expanded" class="faq-answer">
						<text>{{ faq.answer }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view v-if="!isPlusMember" class="bottom-bar">
			<view class="price-info">
				<text class="price-label">年费</text>
				<text class="price-value">¥99</text>
				<text class="price-original">¥199</text>
			</view>
			<button class="purchase-btn" @click="handleUpgrade">
				立即开通
			</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { mockGetMembershipInfo, mockGetMembershipPackages, type MembershipInfo, type MemberBenefit } from '@/api/membership'
import { useUserStore } from '@/stores/user'

// 用户 Store
const userStore = useUserStore()

// 计算属性：是否为 PLUS 会员
const isPlusMember = computed(() => userStore.isPlusMember)

// 会员信息
const memberInfo = ref<MembershipInfo>({
	id: '',
	userId: '',
	tagName: 'PLUS会员',
	startDate: '',
	endDate: '',
	autoRenew: false,
	status: 'EXPIRED',
	benefits: []
})

// 会员权益列表
const benefits = ref<MemberBenefit[]>([])

// 常见问题
const faqs = ref([
	{
		question: 'PLUS会员有哪些权益？',
		answer: 'PLUS会员享有租车95折优惠、免费取消订单、专属客服、生日优惠券、积分翻倍、优先取车等6大专属权益。',
		expanded: false
	},
	{
		question: '会员费用如何计算？',
		answer: 'PLUS会员年费99元，有效期12个月。支持自动续费，续费价格与首次购买相同。',
		expanded: false
	},
	{
		question: '租车95折如何使用？',
		answer: '开通PLUS会员后，租车时系统自动应用95折优惠。注意：特惠套餐等特价商品不享受会员折扣。',
		expanded: false
	},
	{
		question: '可以退款吗？',
		answer: '购买后7天内，如未使用任何会员权益，可申请全额退款。超过7天或已使用权益则不支持退款。',
		expanded: false
	},
	{
		question: '自动续费如何取消？',
		answer: '在会员中心可随时关闭自动续费。关闭后，会员到期将不会自动扣费，需手动续费。',
		expanded: false
	}
])

// 格式化日期
const formatDate = (dateStr: string) => {
	if (!dateStr) return ''
	const date = new Date(dateStr)
	return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

// 获取权益图标
const getBenefitIcon = (icon: string) => {
	const iconMap: Record<string, string> = {
		discount: '/static/icons/benefit-discount.png',
		cancel: '/static/icons/benefit-cancel.png',
		service: '/static/icons/benefit-service.png',
		gift: '/static/icons/benefit-gift.png',
		points: '/static/icons/benefit-points.png',
		priority: '/static/icons/benefit-priority.png'
	}
	return iconMap[icon] || '/static/icons/benefit-default.png'
}

// 切换FAQ展开状态
const toggleFaq = (index: number) => {
	faqs.value[index].expanded = !faqs.value[index].expanded
}

// 处理续费
const handleRenew = () => {
	uni.navigateTo({
		url: '/pages/membership/purchase?type=renew'
	})
}

// 处理升级/开通
const handleUpgrade = () => {
	uni.navigateTo({
		url: '/pages/membership/purchase?type=purchase'
	})
}

// 处理自动续费开关
const handleAutoRenewChange = (e: any) => {
	const enabled = e.detail.value

	uni.showModal({
		title: enabled ? '开启自动续费' : '关闭自动续费',
		content: enabled
			? '开启后，会员到期前将自动续费，确保权益不中断。'
			: '关闭后，会员到期将不会自动扣费，需手动续费。',
		success: (res) => {
			if (res.confirm) {
				// TODO: 调用API更新自动续费状态
				memberInfo.value.autoRenew = enabled
				uni.showToast({
					title: enabled ? '已开启自动续费' : '已关闭自动续费',
					icon: 'success'
				})
			}
		}
	})
}

// 加载会员信息
const loadMembershipInfo = async () => {
	try {
		uni.showLoading({ title: '加载中...' })

		// 使用Mock数据
		const info = await mockGetMembershipInfo()
		memberInfo.value = info
		benefits.value = info.benefits

		uni.hideLoading()
	} catch (error) {
		console.error('加载会员信息失败:', error)
		uni.hideLoading()
		uni.showToast({
			title: '加载失败',
			icon: 'none'
		})
	}
}

onMounted(() => {
	loadMembershipInfo()
})
</script>

<style lang="scss" scoped>
.membership-page {
	min-height: 100vh;
	background: #F5F5F5;
	padding-bottom: 120rpx;
}

// 会员卡片
.member-card {
	position: relative;
	margin: 32rpx;
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);

	&.plus-member {
		background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
	}

	&.normal-member {
		background: linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%);
	}

	.card-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;

		.bg-image {
			width: 100%;
			height: 100%;
			opacity: 0.3;
		}
	}

	.card-content {
		position: relative;
		padding: 48rpx 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.member-info {
		flex: 1;

		.member-level {
			display: flex;
			align-items: center;
			margin-bottom: 16rpx;

			.level-text {
				font-size: 40rpx;
				font-weight: bold;
				color: #FFFFFF;
			}

			.crown-icon {
				width: 48rpx;
				height: 48rpx;
				margin-left: 16rpx;
			}
		}

		.member-validity {
			.validity-label {
				font-size: 24rpx;
				color: rgba(255, 255, 255, 0.8);
			}

			.validity-date {
				font-size: 28rpx;
				color: #FFFFFF;
				margin-left: 8rpx;
			}
		}

		.upgrade-tip {
			text {
				font-size: 24rpx;
				color: rgba(255, 255, 255, 0.9);
			}
		}
	}

	.member-action {
		.action-btn {
			padding: 16rpx 40rpx;
			border-radius: 48rpx;
			font-size: 28rpx;
			border: none;

			&.renew-btn {
				background: rgba(255, 255, 255, 0.3);
				color: #FFFFFF;
			}

			&.upgrade-btn {
				background: #FFFFFF;
				color: #FF9F29;
			}
		}
	}
}

// 权益区域
.benefits-section {
	margin: 32rpx;
	background: #FFFFFF;
	border-radius: 24rpx;
	padding: 32rpx;
}

.section-title {
	margin-bottom: 32rpx;

	.title-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
	}

	.title-desc {
		font-size: 24rpx;
		color: #999999;
		margin-left: 16rpx;
	}
}

.benefits-grid {
	.benefit-item {
		display: flex;
		align-items: flex-start;
		padding: 24rpx 0;
		border-bottom: 1rpx solid #F0F0F0;

		&:last-child {
			border-bottom: none;
		}

		&.inactive {
			opacity: 0.5;
		}

		.benefit-icon {
			width: 64rpx;
			height: 64rpx;
			margin-right: 24rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.benefit-info {
			flex: 1;

			.benefit-name {
				display: block;
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
				margin-bottom: 8rpx;
			}

			.benefit-desc {
				display: block;
				font-size: 24rpx;
				color: #999999;
				line-height: 1.5;
			}
		}

		.benefit-badge {
			padding: 4rpx 16rpx;
			background: #E8F5E9;
			border-radius: 8rpx;

			text {
				font-size: 20rpx;
				color: #4CAF50;
			}
		}
	}
}

// 会员说明
.info-section {
	margin: 32rpx;
	background: #FFFFFF;
	border-radius: 24rpx;
	padding: 32rpx;
}

.info-list {
	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 0;
		border-bottom: 1rpx solid #F0F0F0;

		&:last-child {
			border-bottom: none;
		}

		.info-label {
			display: flex;
			align-items: center;

			.label-icon {
				font-size: 32rpx;
				color: #FF9F29;
				margin-right: 16rpx;
			}

			.label-text {
				font-size: 28rpx;
				color: #333333;
			}
		}

		.info-value {
			font-size: 28rpx;
			color: #666666;
		}

		.info-value-row {
			display: flex;
			align-items: center;
			gap: 16rpx;
		}
	}
}

// 常见问题
.faq-section {
	margin: 32rpx;
	background: #FFFFFF;
	border-radius: 24rpx;
	padding: 32rpx;
}

.faq-list {
	.faq-item {
		padding: 24rpx 0;
		border-bottom: 1rpx solid #F0F0F0;

		&:last-child {
			border-bottom: none;
		}

		.faq-question {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.question-text {
				flex: 1;
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
			}

			.arrow-icon {
				font-size: 40rpx;
				color: #999999;
				transform: rotate(0deg);
				transition: transform 0.3s;

				&.expanded {
					transform: rotate(90deg);
				}
			}
		}

		.faq-answer {
			margin-top: 16rpx;
			padding: 16rpx;
			background: #F8F8F8;
			border-radius: 12rpx;

			text {
				font-size: 24rpx;
				color: #666666;
				line-height: 1.6;
			}
		}
	}
}

// 底部操作栏
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #FFFFFF;
	padding: 24rpx 32rpx;
	box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.08);
	display: flex;
	justify-content: space-between;
	align-items: center;
	z-index: 100;

	.price-info {
		display: flex;
		align-items: baseline;

		.price-label {
			font-size: 24rpx;
			color: #999999;
			margin-right: 8rpx;
		}

		.price-value {
			font-size: 40rpx;
			font-weight: bold;
			color: #FF9F29;
		}

		.price-original {
			font-size: 24rpx;
			color: #999999;
			text-decoration: line-through;
			margin-left: 16rpx;
		}
	}

	.purchase-btn {
		padding: 24rpx 64rpx;
		background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);
		color: #FFFFFF;
		border-radius: 48rpx;
		font-size: 32rpx;
		font-weight: bold;
		border: none;
	}
}
</style>
