<template>
	<view class="points-page">
		<!-- 顶部积分卡片 -->
		<view class="points-card">
			<view class="card-bg">
				<image class="bg-pattern" src="/static/images/points-bg.png" mode="aspectFill" />
			</view>
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
							<u-icon name="help" size="16" color="#FFFFFF" />
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
						<u-icon name="down" size="14" color="#999999" />
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
					<view v-if="rule.userTypeLimit && rule.userTypeLimit.length > 0" class="rule-limit">
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
		HOSTING_INCOME: 'wallet',
		RATING: 'star',
		SIGN_IN: 'calendar',
		ACTIVITY: 'gift',
		REFERRAL: 'person-add',
		RENTAL: 'cart',
		EXCHANGE: 'shop',
		EXPIRE: 'closeempty',
		REFUND: 'undo'
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
	background: #F5F5F5;
	padding-bottom: 32rpx;
}

// 积分卡片
.points-card {
	position: relative;
	margin: 32rpx;
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 8rpx 24rpx rgba(255, 159, 41, 0.2);

	.card-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);

		.bg-pattern {
			width: 100%;
			height: 100%;
			opacity: 0.1;
		}
	}

	.card-content {
		position: relative;
		padding: 48rpx 32rpx;
	}

	.balance-section {
		text-align: center;
		margin-bottom: 32rpx;

		.label {
			display: block;
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.8);
			margin-bottom: 16rpx;
		}

		.balance {
			display: block;
			font-size: 80rpx;
			font-weight: bold;
			color: #FFFFFF;
			line-height: 1;
			margin-bottom: 32rpx;
		}

		.balance-actions {
			display: flex;
			justify-content: center;
			gap: 24rpx;

			.action-btn {
				display: flex;
				align-items: center;
				gap: 8rpx;
				padding: 16rpx 32rpx;
				background: rgba(255, 255, 255, 0.2);
				color: #FFFFFF;
				font-size: 24rpx;
				border-radius: 48rpx;
				border: 1rpx solid rgba(255, 255, 255, 0.3);
			}
		}
	}

	.stats-section {
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding-top: 32rpx;
		border-top: 1rpx solid rgba(255, 255, 255, 0.2);

		.stat-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 8rpx;

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
	margin: 0 32rpx 32rpx;
	padding: 32rpx;
	background: #FFFFFF;
	border-radius: 16rpx;

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24rpx;

		.header-left {
			display: flex;
			align-items: center;
			gap: 8rpx;

			.header-title {
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
			}
		}

		.header-tip {
			font-size: 22rpx;
			color: #999999;
		}
	}

	.sign-in-card {
		.sign-in-btn {
			width: 100%;
			height: 88rpx;
			background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);
			color: #FFFFFF;
			font-size: 28rpx;
			font-weight: 500;
			border-radius: 44rpx;
			border: none;
			margin-bottom: 24rpx;

			&[disabled] {
				background: #CCCCCC;
			}
		}

		.sign-in-days {
			display: flex;
			justify-content: space-between;
			gap: 16rpx;

			.day-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 8rpx;
				padding: 16rpx 0;
				background: #F5F5F5;
				border-radius: 12rpx;

				&.active {
					background: #FFF5E6;

					.day-number {
						color: #FF9F29;
					}
				}

				&.today {
					background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);

					.day-number,
					.day-label {
						color: #FFFFFF;
					}
				}

				.day-number {
					font-size: 32rpx;
					font-weight: bold;
					color: #999999;
				}

				.day-label {
					font-size: 20rpx;
					color: #999999;
				}
			}
		}
	}
}

// Tab切换
.tabs {
	display: flex;
	background: #FFFFFF;
	margin: 0 32rpx 32rpx;
	border-radius: 16rpx;
	padding: 8rpx;

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 16rpx 0;
		border-radius: 12rpx;
		transition: all 0.3s;

		&.active {
			background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);

			.tab-text {
				color: #FFFFFF;
				font-weight: 500;
			}
		}

		.tab-text {
			font-size: 28rpx;
			color: #666666;
		}
	}
}

// 积分记录
.records-section {
	.filter-bar {
		padding: 0 32rpx 24rpx;

		.filter-btn {
			display: inline-flex;
			align-items: center;
			gap: 8rpx;
			padding: 12rpx 24rpx;
			background: #FFFFFF;
			border-radius: 48rpx;
			border: 1rpx solid #E5E5E5;

			.filter-text {
				font-size: 24rpx;
				color: #333333;
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
				margin-top: 24rpx;
				font-size: 24rpx;
				color: #999999;
			}
		}

		.record-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 32rpx;
			margin: 0 32rpx 16rpx;
			background: #FFFFFF;
			border-radius: 16rpx;

			.record-left {
				display: flex;
				align-items: center;
				gap: 24rpx;
				flex: 1;

				.record-icon {
					width: 80rpx;
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;

					&.positive {
						background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);
					}

					&.negative {
						background: linear-gradient(135deg, #999999 0%, #666666 100%);
					}
				}

				.record-info {
					flex: 1;
					display: flex;
					flex-direction: column;
					gap: 8rpx;

					.record-desc {
						font-size: 28rpx;
						color: #333333;
					}

					.record-time {
						font-size: 22rpx;
						color: #999999;
					}
				}
			}

			.record-right {
				.record-amount {
					font-size: 32rpx;
					font-weight: bold;
					color: #999999;

					&.positive {
						color: #FF9F29;
					}
				}
			}
		}
	}

	.load-more,
	.no-more {
		text-align: center;
		padding: 32rpx 0;

		.load-more-text,
		.no-more-text {
			font-size: 24rpx;
			color: #999999;
		}
	}
}

// 积分规则
.rules-section {
	padding: 0 32rpx;

	.rules-list {
		.rule-item {
			padding: 32rpx;
			margin-bottom: 16rpx;
			background: #FFFFFF;
			border-radius: 16rpx;

			.rule-header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 16rpx;

				.rule-title-wrapper {
					display: flex;
					align-items: center;
					gap: 12rpx;

					.rule-title {
						font-size: 28rpx;
						font-weight: 500;
						color: #333333;
					}
				}

				.rule-points {
					display: flex;
					align-items: baseline;
					gap: 4rpx;

					.points-text {
						font-size: 32rpx;
						font-weight: bold;
						color: #FF9F29;
					}

					.points-unit {
						font-size: 22rpx;
						color: #FF9F29;
					}
				}
			}

			.rule-desc {
				font-size: 24rpx;
				color: #666666;
				line-height: 1.6;
				margin-bottom: 12rpx;
			}

			.rule-limit {
				display: flex;
				align-items: center;
				gap: 8rpx;
				padding: 8rpx 16rpx;
				background: #FFF5E6;
				border-radius: 8rpx;

				.limit-text {
					font-size: 22rpx;
					color: #FF9F29;
				}
			}
		}
	}

	.usage-info {
		margin-top: 32rpx;
		padding: 32rpx;
		background: #FFFFFF;
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
					color: #FF9F29;
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
}
</style>
