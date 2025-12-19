<template>
	<view class="model-list-page">
		<!-- 列表内容 -->
		<scroll-view scroll-y class="list-scroll" @scrolltolower="loadMore">
			<view class="list-container">
				<!-- 骨架屏加载 -->
				<view v-if="loading" class="skeleton-list">
					<view v-for="i in 3" :key="i" class="skeleton-card">
						<view class="skeleton-image"></view>
						<view class="skeleton-content">
							<view class="skeleton-line"></view>
							<view class="skeleton-line short"></view>
						</view>
					</view>
				</view>

				<!-- 空状态 -->
				<view v-else-if="!loading && models.length === 0" class="empty-state">
					<u-icon name="car" size="80" color="#CCC"></u-icon>
					<text class="empty-text">暂无车型</text>
				</view>

				<!-- 车型列表 -->
				<template v-else>
					<view v-for="model in models" :key="model.id" class="model-card" @click="goToDetail(model)">
						<image :src="model.image" class="model-image" mode="aspectFill"></image>
						<view class="model-content">
							<view class="model-header">
								<text class="model-name">{{ model.name }}</text>
								<view class="brand-tag">{{ model.brand }}</view>
							</view>
							<view class="model-price">
								<view class="price-item">
									<text class="price-label">购车价格</text>
									<text class="price-value">¥{{ formatPrice(model.price) }}</text>
								</view>
								<view class="price-divider"></view>
								<view class="price-item">
									<text class="price-label">月供参考</text>
									<text class="price-value">¥{{ model.monthlyPayment }}/月</text>
								</view>
							</view>
							<view class="model-specs">
								<text class="spec-item">{{ model.seats }}座{{ model.beds }}卧</text>
								<text class="spec-divider">|</text>
								<text class="spec-item">{{ model.transmission }}</text>
								<text class="spec-divider">|</text>
								<text class="spec-item">{{ model.length }}mm</text>
							</view>
							<view class="model-features">
								<text v-for="(feature, index) in model.features.slice(0, 3)" :key="index" class="feature-tag">
									{{ feature }}
								</text>
							</view>
						</view>
					</view>

					<!-- 底部安全区 -->
					<view class="safe-area-bottom"></view>
				</template>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { logger } from '@/utils/logger';
import { getPopularModels } from '@/api/hosting'

export default {
	data() {
		return {
			loading: false,
			models: []
		}
	},
	onLoad() {
		this.loadModels()
	},
	onPullDownRefresh() {
		this.loadModels()
	},
	methods: {
		async loadModels() {
			try {
				this.loading = true
				const data = await getPopularModels()
				this.models = data
				this.loading = false
				uni.stopPullDownRefresh()
			} catch (error) {
				logger.error('加载车型列表失败:', error)
				this.loading = false
				uni.stopPullDownRefresh()
				uni.showToast({ title: '加载失败', icon: 'none' })
			}
		},
		loadMore() {
			// 预留分页加载功能
			logger.debug('加载更多')
		},
		goToDetail(model) {
			uni.navigateTo({
				url: `/pages/hosting/model-detail/index?id=${model.id}`
			})
		},
		formatPrice(price) {
			return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		}
	}
}
</script>

<style scoped>
.model-list-page { min-height: 100vh; background: #F5F5F5; }

/* 列表滚动容器 */
.list-scroll { height: 100vh; }
.list-container { padding: 24rpx 32rpx; }

/* 骨架屏 */
.skeleton-list { }
.skeleton-card { background: #FFF; border-radius: 16rpx; margin-bottom: 24rpx; overflow: hidden; }
.skeleton-image { width: 100%; height: 360rpx; background: linear-gradient(90deg, #F0F0F0 25%, #E0E0E0 50%, #F0F0F0 75%); background-size: 200% 100%; animation: skeleton-loading 1.5s infinite; }
.skeleton-content { padding: 24rpx; }
.skeleton-line { height: 32rpx; background: linear-gradient(90deg, #F0F0F0 25%, #E0E0E0 50%, #F0F0F0 75%); background-size: 200% 100%; animation: skeleton-loading 1.5s infinite; border-radius: 8rpx; margin-bottom: 16rpx; }
.skeleton-line.short { width: 60%; }

@keyframes skeleton-loading {
	0% { background-position: 200% 0; }
	100% { background-position: -200% 0; }
}

/* 空状态 */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 160rpx 0; }
.empty-text { font-size: 28rpx; color: #999; margin-top: 24rpx; }

/* 车型卡片 */
.model-card { background: #FFF; border-radius: 16rpx; margin-bottom: 24rpx; overflow: hidden; }
.model-image { width: 100%; height: 360rpx; }
.model-content { padding: 24rpx; }

/* 车型头部 */
.model-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.model-name { font-size: 32rpx; font-weight: 600; color: #333; }
.brand-tag { padding: 6rpx 16rpx; background: #FFF3E0; color: #FF9F29; font-size: 22rpx; border-radius: 8rpx; }

/* 价格信息 */
.model-price { display: flex; align-items: center; padding: 20rpx 0; margin-bottom: 16rpx; border-top: 1rpx solid #F5F5F5; border-bottom: 1rpx solid #F5F5F5; }
.price-item { flex: 1; }
.price-label { display: block; font-size: 24rpx; color: #999; margin-bottom: 8rpx; }
.price-value { display: block; font-size: 28rpx; font-weight: 600; color: #FF9F29; }
.price-divider { width: 1rpx; height: 60rpx; background: #F5F5F5; }

/* 规格信息 */
.model-specs { display: flex; align-items: center; margin-bottom: 16rpx; }
.spec-item { font-size: 26rpx; color: #666; }
.spec-divider { margin: 0 16rpx; color: #DDD; }

/* 特色标签 */
.model-features { display: flex; flex-wrap: wrap; gap: 12rpx; }
.feature-tag { padding: 8rpx 16rpx; background: #F5F5F5; color: #666; font-size: 24rpx; border-radius: 8rpx; }

/* 底部安全区 */
.safe-area-bottom { height: 40rpx; }
</style>
