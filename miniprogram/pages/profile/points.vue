<template>
	<view class="points-page">
		<!-- 顶部积分卡片 -->
		<view class="points-card">
			<view class="card-bg"></view>
			<view class="card-content">
				<view class="balance-section">
					<text class="label">当前积分</text>
					<text class="balance">{{ balance.balance }}</text>
					<view class="balance-actions">
						<button class="action-btn" @click="goToMall">
							<u-icon name="gift" size="16" color="#FFFFFF" />
							<text>积分商城</text>
						</button>
						<button class="action-btn" @click="goToRules">
							<u-icon name="question-circle" size="16" color="#FFFFFF" />
							<text>积分规则</text>
						</button>
					</view>
				</view>
				<view class="stats-section">
					<view class="stat-item">
						<text class="stat-value">{{ balance.totalEarned }}</text>
						<text class="stat-label">累计获得</text>
					</view>
					<view class="stat-divider"></view>
					<view class="stat-item">
						<text class="stat-value">{{ balance.totalUsed }}</text>
						<text class="stat-label">累计使用</text>
					</view>
					<view class="stat-divider"></view>
					<view class="stat-item">
						<text class="stat-value">{{ balance.expiringSoon }}</text>
						<text class="stat-label">即将过期</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 签到区域 -->
		<view class="sign-in-section">
			<view class="section-header">
				<view class="header-left">
					<u-icon name="calendar" size="20" color="#FF9F29" />
					<text class="header-title">每日签到</text>
				</view>
				<text class="header-tip">连续签到7天额外奖励</text>
			</view>
			<view class="sign-in-card">
				<button class="sign-in-btn" :disabled="signedIn" @click="handleSignIn">
					{{ signedIn ? '今日已签到' : '立即签到 +2积分' }}
				</button>
				<view class="sign-in-days">
					<view
						v-for="day in 7"
						:key="day"
						class="day-item"
						:class="{ active: day <= continuousDays, today: day === continuousDays }"
					>
						<text class="day-number">{{ day }}</text>
						<text class="day-label">天</text>
					</view>
				</view>
			</view>
		</view>

		<!-- Tab切换 -->
		<view class="tabs">
			<view
				v-for="tab in tabs"
				:key="tab.value"
				class="tab-item"
				:class="{ active: activeTab === tab.value }"
				@click="handleTabChange(tab.value)"
			>
				<text class="tab-text">{{ tab.label }}</text>
			</view>
		</view>

		<!-- 积分记录列表 -->
		<view v-if="activeTab === 'records'" class="records-section">
			<!-- 筛选器 -->
			<view class="filter-bar">
				<picker mode="selector" :range="recordTypes" range-key="label" @change="handleTypeChange">
					<view class="filter-btn">
						<text class="filter-text">{{ selectedType.label }}</text>
						<u-icon name="arrow-down" size="14" color="#999999" />
					</view>
				</picker>
			</view>

			<!-- 记录列表 -->
			<view class="records-list">
				<view v-if="records.length === 0" class="empty-state">
					<u-icon name="info" size="60" color="#CCCCCC" />
					<text class="empty-text">暂无积分记录</text>
				</view>
				<view v-else>
					<view v-for="record in records" :key="record.id" class="record-item">
						<view class="record-left">
							<view class="record-icon" :class="getRecordIconClass(record.type)">
								<u-icon :name="getRecordIcon(record.type)" size="20" color="#FFFFFF" />
							</view>
							<view class="record-info">
								<text class="record-desc">{{ record.description }}</text>
								<text class="record-time">{{ record.createdAt }}</text>
							</view>
						</view>
						<view class="record-right">
							<text class="record-amount" :class="{ positive: record.amount > 0 }">
								{{ record.amount > 0 ? '+' : '' }}{{ record.amount }}
							</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 加载更多 -->
			<view v-if="hasMore" class="load-more" @click="loadMoreRecords">
				<text class="load-more-text">{{ loading ? '加载中...' : '加载更多' }}</text>
			</view>
			<view v-else-if="records.length > 0" class="no-more">
				<text class="no-more-text">没有更多了</text>
			</view>
		</view>

		<!-- 积分规则 -->
		<view v-if="activeTab === 'rules'" class="rules-section">
			<view class="rules-list">
				<view v-for="rule in rules" :key="rule.id" class="rule-item">
					<view class="rule-header">
						<view class="rule-title-wrapper">
							<u-icon :name="getRuleIcon(rule.type)" size="20" color="#FF9F29" />
							<text class="rule-title">{{ rule.name }}</text>
						</view>
						<view class="rule-points">
							<text class="points-text">{{ rule.points }}</text>
							<text class="points-unit">积分</text>
						</view>
					</view>
					<text class="rule-desc">{{ rule.description }}</text>
					<view v-if="rule.userTypeLimit && Array.isArray(rule.userTypeLimit) && rule.userTypeLimit.length > 0" class="rule-limit">
						<u-icon name="info" size="14" color="#999999" />
						<text class="limit-text">
							仅限{{ rule.userTypeLimit.map(t => getUserTypeName(t)).join('、') }}
						</text>
					</view>
				</view>
			</view>

			<!-- 积分使用说明 -->
			<view class="usage-info">
				<view class="info-title">
					<u-icon name="info-circle-fill" size="18" color="#FF9F29" />
					<text class="title-text">积分使用说明</text>
				</view>
				<view class="info-list">
					<view class="info-item">
						<text class="dot">•</text>
						<text class="info-text">1积分=1元，仅可在积分商城兑换优惠券</text>
					</view>
					<view class="info-item">
						<text class="dot">•</text>
						<text class="info-text">积分不可直接抵扣订单金额</text>
					</view>
					<view class="info-item">
						<text class="dot">•</text>
						<text class="info-text">积分根据用户身份获取，不设定有效期</text>
					</view>
					<view class="info-item">
						<text class="dot">•</text>
						<text class="info-text">积分不支持转让或赠送</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
	getPointsBalance,
	getPointsRecords,
	getPointsRules,
	dailySignIn,
	type PointsBalance,
	type PointsRecord,
	type PointsRule,
	type PointsRecordType
} from '@/api/points'

// 积分余额
const balance = ref<PointsBalance>({
	balance: 0,
	totalEarned: 0,
	totalUsed: 0,
	expiringSoon: 0
})

// 签到状态
const signedIn = ref(false)
const continuousDays = ref(0)

// Tab状态
const activeTab = ref<'records' | 'rules'>('records')
const tabs = [
	{ label: '积分记录', value: 'records' },
	{ label: '积分规则', value: 'rules' }
]

// 记录类型筛选
const recordTypes = [
	{ label: '全部类型', value: '' },
	{ label: '托管收益', value: 'HOSTING_INCOME' },
	{ label: '评价反馈', value: 'RATING' },
	{ label: '签到打卡', value: 'SIGN_IN' },
	{ label: '活动参与', value: 'ACTIVITY' },
	{ label: '推荐好友', value: 'REFERRAL' },
	{ label: '租车消费', value: 'RENTAL' },
	{ label: '积分兑换', value: 'EXCHANGE' }
]
const selectedType = ref(recordTypes[0])

// 积分记录
const records = ref<PointsRecord[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const hasMore = ref(true)
const loading = ref(false)

// 积分规则
const rules = ref<PointsRule[]>([])

// 页面加载
onMounted(() => {
	loadBalance()
	loadRecords()
	loadRules()
	checkSignInStatus()
})

// 加载积分余额
const loadBalance = async () => {
	try {
		balance.value = await getPointsBalance()
	} catch (error: any) {
		uni.showToast({
			title: error.message || '加载失败',
			icon: 'none'
		})
	}
}

// 加载积分记录
const loadRecords = async (append: boolean = false) => {
	if (loading.value) return

	try {
		loading.value = true
		const type = selectedType.value.value as PointsRecordType | undefined
		const result = await getPointsRecords(type || undefined, currentPage.value, pageSize.value)

		if (append) {
			records.value = [...records.value, ...result.records]
		} else {
			records.value = result.records
		}

		hasMore.value = records.value.length < result.total
	} catch (error: any) {
		uni.showToast({
			title: error.message || '加载失败',
			icon: 'none'
		})
	} finally {
		loading.value = false
	}
}

// 加载更多记录
const loadMoreRecords = () => {
	if (loading.value || !hasMore.value) return
	currentPage.value++
	loadRecords(true)
}

// 加载积分规则
const loadRules = async () => {
	try {
		rules.value = await getPointsRules()
	} catch (error: any) {
		uni.showToast({
			title: error.message || '加载失败',
			icon: 'none'
		})
	}
}

// 检查签到状态
const checkSignInStatus = () => {
	// 从本地存储检查今天是否已签到
	const today = new Date().toDateString()
	const lastSignIn = uni.getStorageSync('lastSignIn')
	signedIn.value = lastSignIn === today

	// 获取连续签到天数
	continuousDays.value = uni.getStorageSync('continuousDays') || 0
}

// 每日签到
const handleSignIn = async () => {
	try {
		const result = await dailySignIn()

		// 更新签到状态
		signedIn.value = true
		continuousDays.value = result.continuousDays
		const today = new Date().toDateString()
		uni.setStorageSync('lastSignIn', today)
		uni.setStorageSync('continuousDays', result.continuousDays)

		// 更新积分余额
		balance.value.balance += result.points
		balance.value.totalEarned += result.points

		uni.showToast({
			title: `签到成功，获得${result.points}积分`,
			icon: 'success'
		})

		// 刷新记录
		currentPage.value = 1
		loadRecords()
	} catch (error: any) {
		uni.showToast({
			title: error.message || '签到失败',
			icon: 'none'
		})
	}
}

// Tab切换
const handleTabChange = (tab: 'records' | 'rules') => {
	activeTab.value = tab
}

// 类型筛选
const handleTypeChange = (e: any) => {
	const index = e.detail.value
	selectedType.value = recordTypes[index]
	currentPage.value = 1
	loadRecords()
}

// 跳转到积分商城
const goToMall = () => {
	uni.navigateTo({
		url: '/pages/profile/points-mall'
	})
}

// 跳转到积分规则
const goToRules = () => {
	activeTab.value = 'rules'
}

// 获取记录图标
const getRecordIcon = (type: PointsRecordType): string => {
	const iconMap: Record<PointsRecordType, string> = {
		HOSTING_INCOME: 'rmb',
		RATING: 'star',
		SIGN_IN: 'calendar',
		ACTIVITY: 'gift',
		REFERRAL: 'man-add',
		RENTAL: 'shopping-cart',
		EXCHANGE: 'bag',
		EXPIRE: 'close-circle',
		REFUND: 'reload'
	}
	return iconMap[type] || 'info'
}

// 获取记录图标样式类
const getRecordIconClass = (type: PointsRecordType): string => {
	if (type === 'EXCHANGE' || type === 'EXPIRE') {
		return 'negative'
	}
	return 'positive'
}

// 获取规则图标
const getRuleIcon = (type: PointsRecordType): string => {
	return getRecordIcon(type)
}

// 获取用户类型名称
const getUserTypeName = (type: string): string => {
	const nameMap: Record<string, string> = {
		HOST: '托管车主',
		NORMAL: '普通用户',
		PLUS: 'PLUS会员'
	}
	return nameMap[type] || type
}
</script>

<style lang="scss" scoped>
.points-page {
	min-height: 100vh;
	background: $uni-bg-color;
	padding-bottom: $uni-spacing-lg;
}

// 积分卡片
.points-card {
	position: relative;
	margin: $uni-spacing-lg;
	border-radius: $uni-radius-lg;
	overflow: hidden;
	box-shadow: 0 8rpx 24rpx rgba(255, 159, 41, 0.2);

	.card-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: $uni-color-primary-gradient;

		/* 使用CSS创建装饰性图案 */
		&::before {
			content: '';
			position: absolute;
			top: -50%;
			right: -20%;
			width: 200%;
			height: 200%;
			background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
			opacity: 0.5;
		}
	}

	.card-content {
		position: relative;
		padding: 48rpx $uni-spacing-lg;
	}

	.balance-section {
		text-align: center;
		margin-bottom: $uni-spacing-lg;

		.label {
			display: block;
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.8);
			margin-bottom: $uni-spacing-md;
		}

		.balance {
			display: block;
			font-size: 80rpx;
			font-weight: bold;
			color: #FFFFFF;
			line-height: 1;
			margin-bottom: $uni-spacing-lg;
		}

		.balance-actions {
			display: flex;
			justify-content: center;
			gap: $uni-spacing-md;

			.action-btn {
				display: flex;
				align-items: center;
				gap: $uni-spacing-xs;
				padding: $uni-spacing-md $uni-spacing-lg;
				background: rgba(255, 255, 255, 0.2);
				color: #FFFFFF;
				font-size: 24rpx;
				border-radius: $uni-radius-btn;
				border: 1rpx solid rgba(255, 255, 255, 0.3);
				transition: all 0.3s ease;

				&:active {
					opacity: 0.8;
					transform: scale(0.98);
				}
			}
		}
	}

	.stats-section {
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding-top: $uni-spacing-lg;
		border-top: 1rpx solid rgba(255, 255, 255, 0.2);

		.stat-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: $uni-spacing-xs;

			.stat-value {
				font-size: 32rpx;
				font-weight: bold;
				color: #FFFFFF;
			}

			.stat-label {
				font-size: 22rpx;
				color: rgba(255, 255, 255, 0.8);
			}
		}

		.stat-divider {
			width: 1rpx;
			height: 48rpx;
			background: rgba(255, 255, 255, 0.2);
		}
	}
}

// 签到区域
.sign-in-section {
	margin: 0 $uni-spacing-lg $uni-spacing-lg;
	padding: $uni-spacing-lg;
	background: #FFFFFF;
	border-radius: $uni-radius-md;

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: $uni-spacing-md;

		.header-left {
			display: flex;
			align-items: center;
			gap: $uni-spacing-xs;

			.header-title {
				font-size: 28rpx;
				font-weight: 500;
				color: $uni-text-color;
			}
		}

		.header-tip {
			font-size: 22rpx;
			color: $uni-text-color-placeholder;
		}
	}

	.sign-in-card {
		.sign-in-btn {
			width: 100%;
			height: 88rpx;
			background: $uni-color-primary-gradient;
			color: #FFFFFF;
			font-size: 28rpx;
			font-weight: 500;
			border-radius: $uni-radius-btn;
			border: none;
			margin-bottom: $uni-spacing-md;
			transition: all 0.3s ease;

			&:not([disabled]):active {
				opacity: 0.8;
				transform: scale(0.98);
			}

			&[disabled] {
				background: #CCCCCC;
			}
		}

		.sign-in-days {
			display: flex;
			justify-content: space-between;
			gap: $uni-spacing-md;

			.day-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: $uni-spacing-xs;
				padding: $uni-spacing-md 0;
				background: $uni-bg-color;
				border-radius: $uni-radius-sm;

				&.active {
					background: #FFF5E6;

					.day-number {
						color: $uni-color-primary;
					}
				}

				&.today {
					background: $uni-color-primary-gradient;

					.day-number,
					.day-label {
						color: #FFFFFF;
					}
				}

				.day-number {
					font-size: 32rpx;
					font-weight: bold;
					color: $uni-text-color-placeholder;
				}

				.day-label {
					font-size: 20rpx;
					color: $uni-text-color-placeholder;
				}
			}
		}
	}
}

// Tab切换
.tabs {
	display: flex;
	background: #FFFFFF;
	margin: 0 $uni-spacing-lg $uni-spacing-lg;
	border-radius: $uni-radius-md;
	padding: $uni-spacing-xs;

	.tab-item {
		flex: 1;
		text-align: center;
		padding: $uni-spacing-md 0;
		border-radius: $uni-radius-sm;
		transition: all 0.3s ease;

		&.active {
			background: $uni-color-primary-gradient;

			.tab-text {
				color: #FFFFFF;
				font-weight: 500;
			}
		}

		.tab-text {
			font-size: 28rpx;
			color: $uni-text-color-secondary;
		}
	}
}

// 积分记录
.records-section {
	.filter-bar {
		padding: 0 $uni-spacing-lg $uni-spacing-md;

		.filter-btn {
			display: inline-flex;
			align-items: center;
			gap: $uni-spacing-xs;
			padding: $uni-spacing-sm $uni-spacing-md;
			background: #FFFFFF;
			border-radius: $uni-radius-btn;
			border: 1rpx solid $uni-border-color-light;
			transition: all 0.2s ease;

			&:active {
				opacity: 0.7;
			}

			.filter-text {
				font-size: 24rpx;
				color: $uni-text-color;
			}
		}
	}

	.records-list {
		.empty-state {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 120rpx 0;

			.empty-text {
				margin-top: $uni-spacing-md;
				font-size: 24rpx;
				color: $uni-text-color-placeholder;
			}
		}

		.record-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: $uni-spacing-lg;
			margin: 0 $uni-spacing-lg $uni-spacing-md;
			background: #FFFFFF;
			border-radius: $uni-radius-md;

			.record-left {
				display: flex;
				align-items: center;
				gap: $uni-spacing-md;
				flex: 1;

				.record-icon {
					width: 80rpx;
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;

					&.positive {
						background: $uni-color-primary-gradient;
					}

					&.negative {
						background: linear-gradient(135deg, #999999 0%, #666666 100%);
					}
				}

				.record-info {
					flex: 1;
					display: flex;
					flex-direction: column;
					gap: $uni-spacing-xs;

					.record-desc {
						font-size: 28rpx;
						color: $uni-text-color;
					}

					.record-time {
						font-size: 22rpx;
						color: $uni-text-color-placeholder;
					}
				}
			}

			.record-right {
				.record-amount {
					font-size: 32rpx;
					font-weight: bold;
					color: $uni-text-color-placeholder;

					&.positive {
						color: $uni-color-primary;
					}
				}
			}
		}
	}

	.load-more,
	.no-more {
		text-align: center;
		padding: $uni-spacing-lg 0;

		.load-more-text,
		.no-more-text {
			font-size: 24rpx;
			color: $uni-text-color-placeholder;
		}
	}
}

// 积分规则
.rules-section {
	padding: 0 $uni-spacing-lg;

	.rules-list {
		.rule-item {
			padding: $uni-spacing-lg;
			margin-bottom: $uni-spacing-md;
			background: #FFFFFF;
			border-radius: $uni-radius-md;

			.rule-header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: $uni-spacing-md;

				.rule-title-wrapper {
					display: flex;
					align-items: center;
					gap: $uni-spacing-sm;

					.rule-title {
						font-size: 28rpx;
						font-weight: 500;
						color: $uni-text-color;
					}
				}

				.rule-points {
					display: flex;
					align-items: baseline;
					gap: 4rpx;

					.points-text {
						font-size: 32rpx;
						font-weight: bold;
						color: $uni-color-primary;
					}

					.points-unit {
						font-size: 22rpx;
						color: $uni-color-primary;
					}
				}
			}

			.rule-desc {
				font-size: 24rpx;
				color: $uni-text-color-secondary;
				line-height: 1.6;
				margin-bottom: $uni-spacing-sm;
			}

			.rule-limit {
				display: flex;
				align-items: center;
				gap: $uni-spacing-xs;
				padding: $uni-spacing-xs $uni-spacing-md;
				background: #FFF5E6;
				border-radius: $uni-radius-xs;

				.limit-text {
					font-size: 22rpx;
					color: $uni-color-primary;
				}
			}
		}
	}

	.usage-info {
		margin-top: $uni-spacing-lg;
		padding: $uni-spacing-lg;
		background: #FFFFFF;
		border-radius: $uni-radius-md;

		.info-title {
			display: flex;
			align-items: center;
			gap: $uni-spacing-xs;
			margin-bottom: $uni-spacing-md;

			.title-text {
				font-size: 28rpx;
				font-weight: 500;
				color: $uni-text-color;
			}
		}

		.info-list {
			.info-item {
				display: flex;
				align-items: flex-start;
				gap: $uni-spacing-xs;
				margin-bottom: $uni-spacing-md;

				&:last-child {
					margin-bottom: 0;
				}

				.dot {
					color: $uni-color-primary;
					font-size: 24rpx;
					line-height: 1.6;
				}

				.info-text {
					flex: 1;
					font-size: 24rpx;
					color: $uni-text-color-secondary;
					line-height: 1.6;
				}
			}
		}
	}
}
</style>
