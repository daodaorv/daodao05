<template>
	<view class="purchase-page">
		<!-- 会员套餐卡片 -->
		<view class="package-card">
			<view class="card-header">
				<view class="package-name">
					<text class="name-text">PLUS会员年卡</text>
					<image src="/static/icons/crown.png" class="crown-icon"></image>
				</view>
				<view class="package-tag">
					<text>限时优惠</text>
				</view>
			</view>

			<view class="card-body">
				<view class="price-section">
					<view class="current-price">
						<text class="currency">¥</text>
						<text class="price">{{ membershipPrice }}</text>
						<text class="unit">/年</text>
					</view>
					<view class="original-price">
						<text>原价¥199</text>
					</view>
				</view>

				<view class="validity-info">
					<text class="validity-text">有效期12个月</text>
					<text class="validity-desc">{{ purchaseType === 'renew' ? '续费后立即生效' : '开通后立即生效' }}</text>
				</view>
			</view>
		</view>

		<!-- 会员权益列表 -->
		<view class="benefits-section">
			<view class="section-title">
				<text>会员专属权益</text>
			</view>

			<view class="benefits-list">
				<view
					v-for="benefit in benefits"
					:key="benefit.id"
					class="benefit-item"
				>
					<view class="benefit-icon">
						<image :src="getBenefitIcon(benefit.icon)" mode="aspectFit"></image>
					</view>
					<view class="benefit-content">
						<text class="benefit-name">{{ benefit.name }}</text>
						<text class="benefit-desc">{{ benefit.description }}</text>
					</view>
					<view class="benefit-check">
						<text class="check-icon">✓</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 支付方式 -->
		<view class="payment-section">
			<view class="section-title">
				<text>支付方式</text>
			</view>
			<view class="payment-list">
				<view class="payment-item">
					<view class="payment-info">
						<view class="icon-box balance">
							<u-icon name="rmb-circle-fill" size="24" color="#FFFFFF"></u-icon>
						</view>
						<view class="payment-text">
							<text class="name">余额支付</text>
							<text class="desc">可用余额 ¥{{ userBalance }}</text>
						</view>
					</view>
					<view class="action-box">
						<text v-if="useBalance" class="deduction-text">-¥{{ deductionAmount }}</text>
						<switch
							:checked="useBalance"
							color="#FF9F29"
							style="transform:scale(0.8)"
							@change="toggleBalance"
							:disabled="userBalance <= 0"
						/>
					</view>
				</view>

				<!-- #ifdef MP-WEIXIN || APP-PLUS || H5 -->
				<view
					class="payment-item"
					:class="{ disabled: isBalanceCovered }"
					@tap="selectPaymentMethod('wxpay')"
				>
					<view class="payment-info">
						<view class="icon-box wechat">
							<u-icon name="weixin" size="24" color="#FFFFFF"></u-icon>
						</view>
						<view class="payment-text">
							<text class="name">微信支付</text>
							<text class="desc">推荐使用微信支付</text>
						</view>
					</view>
					<u-icon
						v-if="!isBalanceCovered"
						:name="selectedPayment === 'wxpay' ? 'checkmark-circle-fill' : 'checkmark-circle'"
						size="24"
						:color="selectedPayment === 'wxpay' ? '#FF9F29' : '#DDD'"
					></u-icon>
				</view>
				<!-- #endif -->

				<!-- #ifdef MP-ALIPAY || APP-PLUS || H5 -->
				<view
					class="payment-item"
					:class="{ disabled: isBalanceCovered }"
					@tap="selectPaymentMethod('alipay')"
				>
					<view class="payment-info">
						<view class="icon-box alipay">
							<text class="alipay-text">支</text>
						</view>
						<view class="payment-text">
							<text class="name">支付宝支付</text>
							<text class="desc">数亿用户的选择</text>
						</view>
					</view>
					<u-icon
						v-if="!isBalanceCovered"
						:name="selectedPayment === 'alipay' ? 'checkmark-circle-fill' : 'checkmark-circle'"
						size="24"
						:color="selectedPayment === 'alipay' ? '#FF9F29' : '#DDD'"
					></u-icon>
				</view>
				<!-- #endif -->
			</view>
		</view>

		<!-- 购买协议 -->
		<view class="agreement-section">
			<view class="agreement-checkbox" @click="toggleAgreement">
				<view class="checkmark-circle" :class="agreedToTerms ? 'checked' : ''">
					<text v-if="agreedToTerms" class="check-icon">✓</text>
				</view>
				<text class="agreement-text">
					我已阅读并同意
					<text class="link-text" @click.stop="viewAgreement">《PLUS会员服务协议》</text>
				</text>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<view class="total-price">
				<text class="label">实付金额</text>
				<text class="price">¥{{ cashAmount }}</text>
			</view>
			<button class="purchase-btn" @click="handlePurchase" :disabled="!agreedToTerms">
				{{ purchaseType === 'renew' ? '立即续费' : '立即开通' }}
			</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { mockGetMembershipPackages, mockPurchaseMembership, type MemberBenefit } from '@/api/membership'

// 页面参数
const purchaseType = ref<'purchase' | 'renew'>('purchase')

// 会员权益
const benefits = ref<MemberBenefit[]>([])

// 价格与支付信息
const membershipPrice = ref(99)
const userBalance = ref(300)
const useBalance = ref(false)
let defaultPayment: 'wxpay' | 'alipay' = 'wxpay'
// #ifdef MP-ALIPAY
defaultPayment = 'alipay'
// #endif
const selectedPayment = ref<'wxpay' | 'alipay' | ''>(defaultPayment)

const deductionAmount = computed(() => {
	if (!useBalance.value) return 0
	return Math.min(membershipPrice.value, userBalance.value)
})

const isBalanceCovered = computed(() => deductionAmount.value >= membershipPrice.value)

const cashAmount = computed(() => {
	const amount = membershipPrice.value - deductionAmount.value
	return amount > 0 ? amount.toFixed(2) : '0.00'
})

// 协议同意
const agreedToTerms = ref(false)

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

const toggleBalance = (e: any) => {
	useBalance.value = e.detail.value
	if (isBalanceCovered.value) {
		selectedPayment.value = ''
	} else if (!selectedPayment.value) {
		selectedPayment.value = defaultPayment
	}
}

const selectPaymentMethod = (method: 'wxpay' | 'alipay') => {
	if (isBalanceCovered.value) return
	selectedPayment.value = method
}

// 切换协议同意
const toggleAgreement = () => {
	agreedToTerms.value = !agreedToTerms.value
}

// 查看协议
const viewAgreement = () => {
	uni.showModal({
		title: 'PLUS会员服务协议',
		content: '这里是会员服务协议的内容...',
		showCancel: false
	})
}

// 处理购买
const handlePurchase = async () => {
	if (!agreedToTerms.value) {
		uni.showToast({
			title: '请先同意服务协议',
			icon: 'none'
		})
		return
	}

	if (!isBalanceCovered.value && !selectedPayment.value) {
		uni.showToast({
			title: '请选择支付方式',
			icon: 'none'
		})
		return
	}

	try {
		uni.showLoading({ title: '处理中...' })

		// 使用Mock数据
		const result = await mockPurchaseMembership({
			packageId: 'package_001',
			autoRenew: false,
			paymentMethod: isBalanceCovered.value
				? 'balance'
				: (selectedPayment.value === 'alipay' ? 'alipay' : 'wechat')
		})

		uni.hideLoading()

		// 模拟支付成功
		uni.showModal({
			title: '支付成功',
			content: purchaseType.value === 'renew' ? '会员续费成功！' : '恭喜您成为PLUS会员！',
			showCancel: false,
			success: () => {
				// 返回会员中心
				uni.navigateBack()
			}
		})
	} catch (error) {
		console.error('购买失败:', error)
		uni.hideLoading()
		uni.showToast({
			title: '购买失败',
			icon: 'none'
		})
	}
}

// 加载套餐信息
const loadPackageInfo = async () => {
	try {
		// 使用Mock数据
		const packages = await mockGetMembershipPackages()
		if (packages.length > 0) {
			benefits.value = packages[0].benefits
		}
	} catch (error) {
		console.error('加载套餐信息失败:', error)
	}
}

onMounted(() => {
	// 获取页面参数
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1] as any
	const options = currentPage.options || {}

	if (options.type) {
		purchaseType.value = options.type
	}

	loadPackageInfo()
})
</script>

<style lang="scss" scoped>
.purchase-page {
	min-height: 100vh;
	background: #F5F5F5;
	padding-bottom: 160rpx;
}

// 套餐卡片
.package-card {
	margin: 32rpx;
	background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
	border-radius: 24rpx;
	padding: 32rpx;
	box-shadow: 0 8rpx 24rpx rgba(255, 159, 41, 0.3);

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx;

		.package-name {
			display: flex;
			align-items: center;

			.name-text {
				font-size: 36rpx;
				font-weight: bold;
				color: #FFFFFF;
			}

			.crown-icon {
				width: 48rpx;
				height: 48rpx;
				margin-left: 16rpx;
			}
		}

		.package-tag {
			padding: 8rpx 16rpx;
			background: rgba(255, 255, 255, 0.3);
			border-radius: 8rpx;

			text {
				font-size: 20rpx;
				color: #FFFFFF;
			}
		}
	}

	.card-body {
		.price-section {
			display: flex;
			align-items: baseline;
			margin-bottom: 16rpx;

			.current-price {
				display: flex;
				align-items: baseline;

				.currency {
					font-size: 32rpx;
					color: #FFFFFF;
				}

				.price {
					font-size: 72rpx;
					font-weight: bold;
					color: #FFFFFF;
				}

				.unit {
					font-size: 28rpx;
					color: rgba(255, 255, 255, 0.9);
					margin-left: 8rpx;
				}
			}

			.original-price {
				margin-left: 24rpx;

				text {
					font-size: 24rpx;
					color: rgba(255, 255, 255, 0.7);
					text-decoration: line-through;
				}
			}
		}

		.validity-info {
			display: flex;
			align-items: center;
			gap: 16rpx;

			.validity-text {
				font-size: 24rpx;
				color: rgba(255, 255, 255, 0.9);
			}

			.validity-desc {
				font-size: 20rpx;
				color: rgba(255, 255, 255, 0.7);
			}
		}
	}
}

// 通用区块样式
.benefits-section,
.payment-section {
	margin: 32rpx;
	background: #FFFFFF;
	border-radius: 24rpx;
	padding: 32rpx;
}

.section-title {
	margin-bottom: 24rpx;

	text {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
	}
}

// 权益列表
.benefits-list {
	.benefit-item {
		display: flex;
		align-items: center;
		padding: 24rpx 0;
		border-bottom: 1rpx solid #F0F0F0;

		&:last-child {
			border-bottom: none;
		}

		.benefit-icon {
			width: 56rpx;
			height: 56rpx;
			margin-right: 24rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.benefit-content {
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
				line-height: 1.4;
			}
		}

		.benefit-check {
			width: 40rpx;
			height: 40rpx;
			background: #4CAF50;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;

			.check-icon {
				font-size: 24rpx;
				color: #FFFFFF;
			}
		}
	}
}

// 支付方式
.payment-list {
	background-color: #FFFFFF;
	border-radius: 16rpx;
}

.payment-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #F5F5F5;

	&:last-child {
		border-bottom: none;
	}

	&.disabled {
		opacity: 0.5;
		pointer-events: none;
	}
}

.payment-info {
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.icon-box {
	width: 64rpx;
	height: 64rpx;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;

	&.balance {
		background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	}

	&.wechat {
		background-color: #07C160;
	}

	&.alipay {
		background-color: #1677FF;
	}
}

.alipay-text {
	font-size: 28rpx;
	color: #FFFFFF;
	font-weight: bold;
}

.payment-text {
	display: flex;
	flex-direction: column;
	gap: 6rpx;

	.name {
		font-size: 30rpx;
		font-weight: 500;
		color: #333333;
	}

	.desc {
		font-size: 24rpx;
		color: #999999;
	}
}

.action-box {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.deduction-text {
	font-size: 28rpx;
	color: #FF9F29;
	font-weight: 500;
}

// 购买协议
.agreement-section {
	margin: 32rpx;

	.agreement-checkbox {
		display: flex;
		align-items: center;

		.checkbox {
			width: 36rpx;
			height: 36rpx;
			border: 2rpx solid #E0E0E0;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 16rpx;
			transition: all 0.3s;

			&.checked {
				background: #FF9F29;
				border-color: #FF9F29;

				.check-icon {
					font-size: 20rpx;
					color: #FFFFFF;
				}
			}
		}

		.agreement-text {
			font-size: 24rpx;
			color: #666666;

			.link-text {
				color: #FF9F29;
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

	.total-price {
		display: flex;
		flex-direction: column;

		.label {
			font-size: 24rpx;
			color: #999999;
			margin-bottom: 8rpx;
		}

		.price {
			font-size: 40rpx;
			font-weight: bold;
			color: #FF9F29;
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

		&[disabled] {
			opacity: 0.5;
		}
	}
}
</style>
