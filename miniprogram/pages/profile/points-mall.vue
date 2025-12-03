<template>
	<view class="points-mall-page">
		<!-- 顶部积分余额 -->
		<view class="balance-bar">
			<view class="balance-info">
				<text class="balance-label">我的积分</text>
				<text class="balance-value">{{ balance }}</text>
			</view>
			<button class="records-btn" @click="goToRecords">
				<text>兑换记录</text>
				<u-icon name="right" size="14" color="#FF9F29" />
			</button>
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

		<!-- 商品列表 -->
		<view class="items-list">
			<view v-if="items.length === 0" class="empty-state">
				<u-icon name="shop" size="60" color="#CCCCCC" />
				<text class="empty-text">暂无可兑换商品</text>
			</view>
			<view v-else class="items-grid">
				<view v-for="item in items" :key="item.id" class="item-card" @click="handleItemClick(item)">
					<!-- 商品图片 -->
					<view class="item-image-wrapper">
						<image class="item-image" :src="item.image" mode="aspectFill" />
						<view v-if="item.isHot" class="hot-badge">
							<text class="badge-text">热门</text>
						</view>
						<view v-if="item.isRecommended" class="recommend-badge">
							<text class="badge-text">推荐</text>
						</view>
					</view>

					<!-- 商品信息 -->
					<view class="item-info">
						<text class="item-name">{{ item.name }}</text>
						<text class="item-desc">{{ item.description }}</text>

						<!-- 价格和库存 -->
						<view class="item-footer">
							<view class="price-section">
								<text class="points-value">{{ item.points }}</text>
								<text class="points-unit">积分</text>
								<text class="value-tag">价值{{ item.value }}元</text>
							</view>
							<view class="stock-section">
								<text class="stock-text">剩余{{ item.stock }}</text>
							</view>
						</view>

						<!-- 兑换按钮 -->
						<button
							class="exchange-btn"
							:disabled="balance < item.points || item.stock === 0"
							@click.stop="handleExchange(item)"
						>
							{{ item.stock === 0 ? '已兑完' : balance < item.points ? '积分不足' : '立即兑换' }}
						</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 加载更多 -->
		<view v-if="hasMore" class="load-more" @click="loadMoreItems">
			<text class="load-more-text">{{ loading ? '加载中...' : '加载更多' }}</text>
		</view>
		<view v-else-if="items.length > 0" class="no-more">
			<text class="no-more-text">没有更多了</text>
		</view>

		<!-- 兑换确认弹窗 -->
		<uni-popup ref="exchangePopup" name="center">
			<view class="exchange-popup">
				<view class="popup-header">
					<text class="popup-title">确认兑换</text>
					<u-icon name="close" size="24" color="#999999" @click="closeExchangePopup" />
				</view>
				<view v-if="selectedItem" class="popup-content">
					<image class="popup-image" :src="selectedItem.image" mode="aspectFill" />
					<text class="popup-item-name">{{ selectedItem.name }}</text>
					<text class="popup-item-desc">{{ selectedItem.description }}</text>
					<view class="popup-points">
						<text class="points-label">需要积分：</text>
						<text class="points-value">{{ selectedItem.points }}</text>
						<text class="points-unit">积分</text>
					</view>
					<view class="popup-balance">
						<text class="balance-label">当前积分：</text>
						<text class="balance-value">{{ balance }}</text>
						<text class="balance-unit">积分</text>
					</view>
					<view class="popup-after">
						<text class="after-label">兑换后剩余：</text>
						<text class="after-value">{{ balance - selectedItem.points }}</text>
						<text class="after-unit">积分</text>
					</view>
				</view>
				<view class="popup-actions">
					<button class="cancel-btn" @click="closeExchangePopup">取消</button>
					<button class="confirm-btn" @click="confirmExchange">确认兑换</button>
				</view>
			</view>
		</uni-popup>

		<!-- 兑换记录弹窗 -->
		<uni-popup ref="recordsPopup" name="bottom">
			<view class="records-popup">
				<view class="popup-header">
					<text class="popup-title">兑换记录</text>
					<u-icon name="close" size="24" color="#999999" @click="closeRecordsPopup" />
				</view>
				<view class="records-list">
					<view v-if="exchangeRecords.length === 0" class="empty-state">
						<u-icon name="info" size="60" color="#CCCCCC" />
						<text class="empty-text">暂无兑换记录</text>
					</view>
					<view v-else>
						<view v-for="record in exchangeRecords" :key="record.id" class="record-item">
							<view class="record-left">
								<text class="record-name">{{ record.itemName }}</text>
								<text class="record-time">{{ record.exchangedAt }}</text>
							</view>
							<view class="record-right">
								<text class="record-points">-{{ record.points }}积分</text>
								<view class="record-status" :class="getStatusClass(record.status)">
									<text class="status-text">{{ getStatusText(record.status) }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
	getPointsBalance,
	getExchangeItems,
	getExchangeRecords,
	exchangeItem,
	type ExchangeItem,
	type ExchangeItemType,
	type ExchangeRecord
} from '@/api/points'

// 积分余额
const balance = ref(0)

// Tab状态
const activeTab = ref<ExchangeItemType | 'ALL'>('ALL')
const tabs = [
	{ label: '全部', value: 'ALL' },
	{ label: '优惠券', value: 'COUPON' },
	{ label: '礼品', value: 'GIFT' },
	{ label: '服务', value: 'SERVICE' }
]

// 商品列表
const items = ref<ExchangeItem[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const hasMore = ref(true)
const loading = ref(false)

// 选中的商品
const selectedItem = ref<ExchangeItem | null>(null)

// 兑换记录
const exchangeRecords = ref<ExchangeRecord[]>([])

// 弹窗引用
const exchangePopup = ref()
const recordsPopup = ref()

// 页面加载
onMounted(() => {
	loadBalance()
	loadItems()
})

// 加载积分余额
const loadBalance = async () => {
	try {
		const result = await getPointsBalance()
		balance.value = result.balance
	} catch (error: any) {
		uni.showToast({
			title: error.message || '加载失败',
			icon: 'none'
		})
	}
}

// 加载商品列表
const loadItems = async (append: boolean = false) => {
	if (loading.value) return

	try {
		loading.value = true
		const type = activeTab.value === 'ALL' ? undefined : (activeTab.value as ExchangeItemType)
		const result = await getExchangeItems(type, currentPage.value, pageSize.value)

		if (append) {
			items.value = [...items.value, ...result.items]
		} else {
			items.value = result.items
		}

		hasMore.value = items.value.length < result.total
	} catch (error: any) {
		uni.showToast({
			title: error.message || '加载失败',
			icon: 'none'
		})
	} finally {
		loading.value = false
	}
}

// 加载更多商品
const loadMoreItems = () => {
	if (loading.value || !hasMore.value) return
	currentPage.value++
	loadItems(true)
}

// 加载兑换记录
const loadExchangeRecords = async () => {
	try {
		const result = await getExchangeRecords()
		exchangeRecords.value = result.records
	} catch (error: any) {
		uni.showToast({
			title: error.message || '加载失败',
			icon: 'none'
		})
	}
}

// Tab切换
const handleTabChange = (tab: ExchangeItemType | 'ALL') => {
	activeTab.value = tab
	currentPage.value = 1
	loadItems()
}

// 商品点击
const handleItemClick = (item: ExchangeItem) => {
	// 显示商品详情或直接兑换
	handleExchange(item)
}

// 兑换商品
const handleExchange = (item: ExchangeItem) => {
	if (item.stock === 0) {
		uni.showToast({
			title: '商品已兑完',
			icon: 'none'
		})
		return
	}

	if (balance.value < item.points) {
		uni.showToast({
			title: '积分不足',
			icon: 'none'
		})
		return
	}

	selectedItem.value = item
	exchangePopup.value.open()
}

// 确认兑换
const confirmExchange = async () => {
	if (!selectedItem.value) return

	try {
		uni.showLoading({
			title: '兑换中...'
		})

		await exchangeItem(selectedItem.value.id)

		uni.hideLoading()
		uni.showToast({
			title: '兑换成功',
			icon: 'success'
		})

		// 更新积分余额
		balance.value -= selectedItem.value.points

		// 更新商品库存
		const item = items.value.find(i => i.id === selectedItem.value!.id)
		if (item) {
			item.stock--
			item.exchangedCount++
		}

		// 关闭弹窗
		closeExchangePopup()

		// 刷新兑换记录
		loadExchangeRecords()
	} catch (error: any) {
		uni.hideLoading()
		uni.showToast({
			title: error.message || '兑换失败',
			icon: 'none'
		})
	}
}

// 关闭兑换弹窗
const closeExchangePopup = () => {
	exchangePopup.value.close()
	selectedItem.value = null
}

// 打开兑换记录
const goToRecords = () => {
	loadExchangeRecords()
	recordsPopup.value.open()
}

// 关闭兑换记录弹窗
const closeRecordsPopup = () => {
	recordsPopup.value.close()
}

// 获取状态文本
const getStatusText = (status: string): string => {
	const statusMap: Record<string, string> = {
		PENDING: '待发放',
		SUCCESS: '已发放',
		FAILED: '失败',
		USED: '已使用',
		EXPIRED: '已过期'
	}
	return statusMap[status] || status
}

// 获取状态样式类
const getStatusClass = (status: string): string => {
	const classMap: Record<string, string> = {
		PENDING: 'pending',
		SUCCESS: 'success',
		FAILED: 'failed',
		USED: 'used',
		EXPIRED: 'expired'
	}
	return classMap[status] || ''
}
</script>

<style lang="scss" scoped>
.points-mall-page {
	min-height: 100vh;
	background: #F5F5F5;
	padding-bottom: 32rpx;
}

// 积分余额栏
.balance-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx;
	margin: 32rpx;
	background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);
	border-radius: 16rpx;

	.balance-info {
		display: flex;
		flex-direction: column;
		gap: 8rpx;

		.balance-label {
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.8);
		}

		.balance-value {
			font-size: 48rpx;
			font-weight: bold;
			color: #FFFFFF;
		}
	}

	.records-btn {
		display: flex;
		align-items: center;
		gap: 4rpx;
		padding: 12rpx 24rpx;
		background: rgba(255, 255, 255, 0.2);
		color: #FFFFFF;
		font-size: 24rpx;
		border-radius: 48rpx;
		border: 1rpx solid rgba(255, 255, 255, 0.3);
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

// 商品列表
.items-list {
	padding: 0 32rpx;

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

	.items-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16rpx;

		.item-card {
			background: #FFFFFF;
			border-radius: 16rpx;
			overflow: hidden;

			.item-image-wrapper {
				position: relative;
				width: 100%;
				height: 280rpx;

				.item-image {
					width: 100%;
					height: 100%;
				}

				.hot-badge,
				.recommend-badge {
					position: absolute;
					top: 16rpx;
					left: 16rpx;
					padding: 4rpx 16rpx;
					border-radius: 24rpx;

					.badge-text {
						font-size: 20rpx;
						color: #FFFFFF;
					}
				}

				.hot-badge {
					background: linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%);
				}

				.recommend-badge {
					background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);
					left: auto;
					right: 16rpx;
				}
			}

			.item-info {
				padding: 24rpx;

				.item-name {
					display: block;
					font-size: 28rpx;
					font-weight: 500;
					color: #333333;
					margin-bottom: 8rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.item-desc {
					display: block;
					font-size: 22rpx;
					color: #999999;
					margin-bottom: 16rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.item-footer {
					display: flex;
					align-items: flex-end;
					justify-content: space-between;
					margin-bottom: 16rpx;

					.price-section {
						display: flex;
						align-items: baseline;
						gap: 4rpx;

						.points-value {
							font-size: 32rpx;
							font-weight: bold;
							color: #FF9F29;
						}

						.points-unit {
							font-size: 22rpx;
							color: #FF9F29;
						}

						.value-tag {
							font-size: 20rpx;
							color: #999999;
							margin-left: 8rpx;
						}
					}

					.stock-section {
						.stock-text {
							font-size: 22rpx;
							color: #999999;
						}
					}
				}

				.exchange-btn {
					width: 100%;
					height: 64rpx;
					background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);
					color: #FFFFFF;
					font-size: 24rpx;
					font-weight: 500;
					border-radius: 32rpx;
					border: none;

					&[disabled] {
						background: #CCCCCC;
					}
				}
			}
		}
	}
}

// 加载更多
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

// 兑换确认弹窗
.exchange-popup {
	width: 600rpx;
	background: #FFFFFF;
	border-radius: 24rpx;
	overflow: hidden;

	.popup-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx;
		border-bottom: 1rpx solid #F5F5F5;

		.popup-title {
			font-size: 32rpx;
			font-weight: 500;
			color: #333333;
		}
	}

	.popup-content {
		padding: 32rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.popup-image {
			width: 200rpx;
			height: 200rpx;
			border-radius: 16rpx;
			margin-bottom: 24rpx;
		}

		.popup-item-name {
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
			margin-bottom: 12rpx;
		}

		.popup-item-desc {
			font-size: 24rpx;
			color: #999999;
			text-align: center;
			margin-bottom: 32rpx;
		}

		.popup-points,
		.popup-balance,
		.popup-after {
			display: flex;
			align-items: baseline;
			gap: 8rpx;
			width: 100%;
			padding: 16rpx 24rpx;
			background: #F5F5F5;
			border-radius: 12rpx;
			margin-bottom: 12rpx;

			.points-label,
			.balance-label,
			.after-label {
				font-size: 24rpx;
				color: #666666;
			}

			.points-value,
			.balance-value,
			.after-value {
				flex: 1;
				text-align: right;
				font-size: 32rpx;
				font-weight: bold;
				color: #FF9F29;
			}

			.points-unit,
			.balance-unit,
			.after-unit {
				font-size: 22rpx;
				color: #FF9F29;
			}
		}

		.popup-after {
			margin-bottom: 0;

			.after-value {
				color: #333333;
			}

			.after-unit {
				color: #333333;
			}
		}
	}

	.popup-actions {
		display: flex;
		gap: 16rpx;
		padding: 32rpx;
		border-top: 1rpx solid #F5F5F5;

		.cancel-btn,
		.confirm-btn {
			flex: 1;
			height: 80rpx;
			font-size: 28rpx;
			border-radius: 40rpx;
			border: none;
		}

		.cancel-btn {
			background: #F5F5F5;
			color: #666666;
		}

		.confirm-btn {
			background: linear-gradient(135deg, #FF9F29 0%, #FF6B00 100%);
			color: #FFFFFF;
		}
	}
}

// 兑换记录弹窗
.records-popup {
	background: #FFFFFF;
	border-radius: 24rpx 24rpx 0 0;
	max-height: 80vh;

	.popup-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx;
		border-bottom: 1rpx solid #F5F5F5;

		.popup-title {
			font-size: 32rpx;
			font-weight: 500;
			color: #333333;
		}
	}

	.records-list {
		max-height: 60vh;
		overflow-y: auto;

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
			border-bottom: 1rpx solid #F5F5F5;

			&:last-child {
				border-bottom: none;
			}

			.record-left {
				flex: 1;
				display: flex;
				flex-direction: column;
				gap: 8rpx;

				.record-name {
					font-size: 28rpx;
					color: #333333;
				}

				.record-time {
					font-size: 22rpx;
					color: #999999;
				}
			}

			.record-right {
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				gap: 8rpx;

				.record-points {
					font-size: 28rpx;
					font-weight: bold;
					color: #FF9F29;
				}

				.record-status {
					padding: 4rpx 16rpx;
					border-radius: 24rpx;
					font-size: 20rpx;

					&.pending {
						background: #FFF5E6;
						color: #FF9F29;
					}

					&.success {
						background: #E6F7FF;
						color: #1890FF;
					}

					&.failed {
						background: #FFF1F0;
						color: #FF4D4F;
					}

					&.used {
						background: #F6FFED;
						color: #52C41A;
					}

					&.expired {
						background: #F5F5F5;
						color: #999999;
					}
				}
			}
		}
	}
}
</style>
