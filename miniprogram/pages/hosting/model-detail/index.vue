<template>
	<view class="model-detail-page">
		<!-- 图片轮播 (沉浸式) -->
		<swiper class="image-swiper"
			:indicator-dots="true"
			:autoplay="false"
			:circular="true"
			indicator-color="rgba(255,255,255,0.6)"
			indicator-active-color="#FF9F29"
			:duration="500"
		>
			<swiper-item v-for="(image, index) in model.images" :key="index">
				<image class="swiper-image" :src="image" mode="aspectFill"></image>
			</swiper-item>
		</swiper>

		<!-- 返回按钮 (悬浮) -->
		<view class="back-btn" :style="{ top: statusBarHeight + 8 + 'px' }" @tap="goBack">
			<u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
		</view>

		<!-- 分享按钮 (悬浮) -->
		<view class="share-btn" :style="{ top: statusBarHeight + 8 + 'px' }">
			<u-icon name="share" size="20" color="#FFFFFF"></u-icon>
		</view>

		<scroll-view scroll-y class="detail-scroll">
			<!-- 内容容器 -->
			<view class="content-container">
				<!-- 基本信息卡片 -->
				<view class="info-card">
					<view class="header-row">
						<view class="title-wrap">
							<text class="model-name">{{ model.name }}</text>
							<view class="brand-tag">
								<text>{{ model.brand }}</text>
							</view>
						</view>
					</view>

					<view class="divider"></view>

					<view class="price-row">
						<view class="price-item">
							<text class="price-label">购车价格</text>
							<view class="price-value">
								<text class="currency">¥</text>
								<text class="price">{{ formatPrice(model.price) }}</text>
							</view>
						</view>
						<view class="price-item">
							<text class="price-label">月供参考</text>
							<view class="price-value">
								<text class="currency">¥</text>
								<text class="price">{{ model.monthlyPayment }}</text>
								<text class="unit">/月</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 核心规格 (Grid) -->
				<view class="specs-grid">
					<view class="spec-box">
						<view class="spec-icon bg-blue">
							<u-icon name="account-fill" size="20" color="#2196F3"></u-icon>
						</view>
						<text class="spec-val">{{ model.specs.seats }}座</text>
						<text class="spec-label">座位</text>
					</view>
					<view class="spec-box">
						<view class="spec-icon bg-green">
							<u-icon name="home-fill" size="20" color="#4CAF50"></u-icon>
						</view>
						<text class="spec-val">{{ model.specs.beds }}卧</text>
						<text class="spec-label">床位</text>
					</view>
					<view class="spec-box">
						<view class="spec-icon bg-orange">
							<u-icon name="setting-fill" size="20" color="#FF9800"></u-icon>
						</view>
						<text class="spec-val">{{ model.specs.transmission }}</text>
						<text class="spec-label">排挡</text>
					</view>
					<view class="spec-box">
						<view class="spec-icon bg-purple">
							<u-icon name="car-fill" size="20" color="#9C27B0"></u-icon>
						</view>
						<text class="spec-val">{{ model.specs.length }}mm</text>
						<text class="spec-label">车长</text>
					</view>
				</view>

				<!-- 车辆配置 -->
				<view class="section-card">
					<view class="section-header">
						<text class="section-title">车辆配置</text>
					</view>
					<view class="features-grid">
						<view v-for="(feature, index) in model.detailedFeatures" :key="index" class="feature-item">
							<u-icon name="checkmark-circle-fill" size="16" color="#FF9F29"></u-icon>
							<text class="feature-text">{{ feature }}</text>
						</view>
					</view>
				</view>

				<!-- 托管收益说明 -->
				<view class="section-card hosting-info-card">
					<view class="section-header">
						<text class="section-title">托管收益说明</text>
					</view>
					<view class="hosting-info">
						<view class="info-row">
							<view class="info-item">
								<text class="info-label">保底收益</text>
								<text class="info-value highlight">¥{{ model.hostingInfo.minMonthlyIncome }}/月</text>
							</view>
							<view class="info-item">
								<text class="info-label">超额分成</text>
								<text class="info-value highlight">{{ model.hostingInfo.profitShare }}%</text>
							</view>
						</view>
						<view class="info-row">
							<view class="info-item">
								<text class="info-label">预估年收益</text>
								<text class="info-value">¥{{ formatPrice(model.hostingInfo.estimatedYearlyIncome) }}+</text>
							</view>
						</view>
						<view class="policy-list">
							<view class="policy-item">
								<u-icon name="checkmark-circle" size="16" color="#4CAF50"></u-icon>
								<text>{{ model.hostingInfo.subsidyPolicy }}</text>
							</view>
							<view class="policy-item">
								<u-icon name="checkmark-circle" size="16" color="#4CAF50"></u-icon>
								<text>{{ model.hostingInfo.insurance }}</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 车辆详情 -->
				<view class="section-card">
					<view class="section-header">
						<text class="section-title">车辆详情</text>
					</view>
					<view class="description">
						<text class="description-text">{{ model.description }}</text>
					</view>
				</view>

				<!-- 规格参数 -->
				<view class="section-card">
					<view class="section-header">
						<text class="section-title">规格参数</text>
					</view>
					<view class="specs-list">
						<view class="specs-item">
							<text class="specs-label">车身尺寸</text>
							<text class="specs-value">{{ model.specs.length }}×{{ model.specs.width }}×{{ model.specs.height }}mm</text>
						</view>
						<view class="specs-item">
							<text class="specs-label">整备质量</text>
							<text class="specs-value">{{ model.specs.weight }}kg</text>
						</view>
						<view class="specs-item">
							<text class="specs-label">燃油类型</text>
							<text class="specs-value">{{ model.specs.fuelType }}</text>
						</view>
						<view class="specs-item">
							<text class="specs-label">排量</text>
							<text class="specs-value">{{ model.specs.displacement }}</text>
						</view>
						<view class="specs-item">
							<text class="specs-label">变速箱</text>
							<text class="specs-value">{{ model.specs.transmission }}</text>
						</view>
					</view>
				</view>

				<!-- 底部安全区 -->
				<view class="safe-area-bottom"></view>
			</view>
		</scroll-view>

		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<view class="bar-left">
				<view class="action-btn">
					<u-icon name="kefu-ermai" size="24" color="#666"></u-icon>
					<text>客服</text>
				</view>
				<view class="action-btn">
					<u-icon name="star-fill" size="24" color="#666"></u-icon>
					<text>收藏</text>
				</view>
			</view>
			<view class="bar-right">
				<button class="booking-btn" @click="showBookingPopup = true">立即预定</button>
			</view>
		</view>

		<!-- 预定弹窗 -->
		<u-popup v-model="showBookingPopup" mode="bottom" :round="20" :closeable="true">
			<view class="booking-popup">
				<view class="popup-header">
					<text class="popup-title">预定购车托管</text>
				</view>

				<view class="popup-model-info">
					<text class="model-name">{{ model.name }}</text>
					<text class="model-price">¥{{ formatPrice(model.price) }}</text>
				</view>

				<view class="popup-form">
					<view class="form-item">
						<text class="form-label">预定人</text>
						<input class="form-input" v-model="bookingForm.name" placeholder="请输入姓名" />
					</view>
					<view class="form-item">
						<text class="form-label">联系电话</text>
						<input class="form-input" v-model="bookingForm.phone" type="number" placeholder="请输入手机号" />
					</view>
					<view class="form-item">
						<text class="form-label">意向城市</text>
						<input class="form-input" v-model="bookingForm.city" placeholder="请选择城市（可选）" />
					</view>
					<view class="form-item">
						<text class="form-label">备注</text>
						<textarea class="form-textarea" v-model="bookingForm.remark" placeholder="其他需求说明（可选）" />
					</view>
				</view>

				<view class="popup-actions">
					<button class="cancel-btn" @click="showBookingPopup = false">取消</button>
					<button class="submit-btn" @click="submitBooking">确认提交</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { logger } from '@/utils/logger';
import { getModelDetail, submitModelBooking } from '@/api/hosting'

export default {
	data() {
		return {
			statusBarHeight: 0,
			modelId: 0,
			model: {
				id: 0,
				name: '',
				brand: '',
				image: '',
				images: [],
				price: 0,
				monthlyPayment: 0,
				description: '',
				specs: {
					length: 0,
					width: 0,
					height: 0,
					weight: 0,
					fuelType: '',
					displacement: '',
					seats: 0,
					beds: 0,
					transmission: ''
				},
				hostingInfo: {
					minMonthlyIncome: 0,
					profitShare: 0,
					estimatedYearlyIncome: 0,
					subsidyPolicy: '',
					insurance: ''
				},
				detailedFeatures: []
			},
			showBookingPopup: false,
			bookingForm: {
				name: '',
				phone: '',
				city: '',
				remark: ''
			}
		}
	},
	onLoad(options) {
		// 获取状态栏高度
		const systemInfo = uni.getSystemInfoSync()
		this.statusBarHeight = systemInfo.statusBarHeight || 0

		// 获取车型ID
		if (options.id) {
			this.modelId = parseInt(options.id)
			this.loadModelDetail()
		}
	},
	methods: {
		async loadModelDetail() {
			try {
				uni.showLoading({ title: '加载中...' })
				const data = await getModelDetail(this.modelId)
				this.model = data
				uni.hideLoading()
			} catch (error) {
				logger.error('加载车型详情失败:', error)
				uni.hideLoading()
				uni.showToast({ title: '加载失败', icon: 'none' })
			}
		},
		goBack() {
			uni.navigateBack()
		},
		formatPrice(price) {
			return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		},
		async submitBooking() {
			// 表单验证
			if (!this.bookingForm.name) {
				uni.showToast({ title: '请输入姓名', icon: 'none' })
				return
			}

			if (!this.bookingForm.phone) {
				uni.showToast({ title: '请输入手机号', icon: 'none' })
				return
			}

			if (!/^1[3-9]\d{9}$/.test(this.bookingForm.phone)) {
				uni.showToast({ title: '手机号格式不正确', icon: 'none' })
				return
			}

			try {
				uni.showLoading({ title: '提交中...' })
				const res = await submitModelBooking({
					modelId: this.modelId,
					...this.bookingForm
				})
				uni.hideLoading()

				if (res.success) {
					uni.showToast({
						title: res.message,
						icon: 'success',
						duration: 2000
					})
					this.showBookingPopup = false
					// 重置表单
					this.bookingForm = { name: '', phone: '', city: '', remark: '' }
				}
			} catch (error) {
				logger.error('提交预定失败:', error)
				uni.hideLoading()
				uni.showToast({ title: '提交失败', icon: 'none' })
			}
		}
	}
}
</script>

<style scoped>
.model-detail-page { min-height: 100vh; background: #F5F5F5; }

/* 图片轮播 */
.image-swiper { width: 100%; height: 500rpx; }
.swiper-image { width: 100%; height: 100%; }

/* 悬浮按钮 */
.back-btn, .share-btn { position: fixed; width: 64rpx; height: 64rpx; background: rgba(0, 0, 0, 0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 100; }
.back-btn { left: 24rpx; }
.share-btn { right: 24rpx; }

/* 滚动容器 */
.detail-scroll { height: calc(100vh - 500rpx - 120rpx); }
.content-container { padding-bottom: 32rpx; }

/* 基本信息卡片 */
.info-card { background: #FFF; padding: 32rpx; margin-bottom: 24rpx; }
.header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24rpx; }
.title-wrap { flex: 1; }
.model-name { display: block; font-size: 36rpx; font-weight: 600; color: #333; margin-bottom: 16rpx; }
.brand-tag { display: inline-block; padding: 8rpx 16rpx; background: #FFF3E0; color: #FF9F29; font-size: 24rpx; border-radius: 8rpx; }
.divider { height: 1rpx; background: #F5F5F5; margin: 24rpx 0; }
.price-row { display: flex; justify-content: space-between; }
.price-item { flex: 1; }
.price-label { display: block; font-size: 24rpx; color: #999; margin-bottom: 12rpx; }
.price-value { display: flex; align-items: baseline; }
.currency { font-size: 28rpx; color: #FF9F29; margin-right: 4rpx; }
.price { font-size: 40rpx; font-weight: 600; color: #FF9F29; }
.unit { font-size: 24rpx; color: #FF9F29; margin-left: 4rpx; }

/* 核心规格 Grid */
.specs-grid { display: flex; background: #FFF; padding: 32rpx; margin-bottom: 24rpx; }
.spec-box { flex: 1; display: flex; flex-direction: column; align-items: center; }
.spec-icon { width: 72rpx; height: 72rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 16rpx; }
.spec-icon.bg-blue { background: #E3F2FD; }
.spec-icon.bg-green { background: #E8F5E9; }
.spec-icon.bg-orange { background: #FFF3E0; }
.spec-icon.bg-purple { background: #F3E5F5; }
.spec-val { font-size: 28rpx; font-weight: 600; color: #333; margin-bottom: 8rpx; }
.spec-label { font-size: 24rpx; color: #999; }

/* 通用卡片 */
.section-card { background: #FFF; padding: 32rpx; margin-bottom: 24rpx; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24rpx; }
.section-title { font-size: 32rpx; font-weight: 600; color: #333; }

/* 车辆配置 */
.features-grid { display: flex; flex-wrap: wrap; }
.feature-item { width: 50%; display: flex; align-items: center; margin-bottom: 20rpx; }
.feature-text { font-size: 28rpx; color: #666; margin-left: 12rpx; }

/* 托管收益说明 */
.hosting-info-card { background: linear-gradient(135deg, #FFF9F0 0%, #FFF 100%); }
.hosting-info { }
.info-row { display: flex; margin-bottom: 24rpx; }
.info-item { flex: 1; }
.info-label { display: block; font-size: 24rpx; color: #999; margin-bottom: 12rpx; }
.info-value { display: block; font-size: 32rpx; font-weight: 600; color: #333; }
.info-value.highlight { color: #FF9F29; }
.policy-list { margin-top: 16rpx; }
.policy-item { display: flex; align-items: center; margin-bottom: 16rpx; font-size: 28rpx; color: #666; }
.policy-item text { margin-left: 12rpx; }

/* 车辆详情 */
.description { }
.description-text { font-size: 28rpx; color: #666; line-height: 1.8; white-space: pre-wrap; }

/* 规格参数 */
.specs-list { }
.specs-item { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid #F5F5F5; }
.specs-item:last-child { border-bottom: none; }
.specs-label { font-size: 28rpx; color: #666; }
.specs-value { font-size: 28rpx; color: #333; font-weight: 500; }

/* 底部安全区 */
.safe-area-bottom { height: 120rpx; }

/* 底部操作栏 */
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 120rpx; background: #FFF; border-top: 1rpx solid #F5F5F5; display: flex; align-items: center; padding: 0 32rpx; z-index: 100; }
.bar-left { display: flex; gap: 48rpx; }
.action-btn { display: flex; flex-direction: column; align-items: center; font-size: 20rpx; color: #666; }
.action-btn text { margin-top: 8rpx; }
.bar-right { flex: 1; display: flex; justify-content: flex-end; }
.booking-btn { width: 240rpx; height: 72rpx; background: linear-gradient(135deg, #FF9F29 0%, #FF7A00 100%); color: #FFF; border-radius: 48rpx; font-size: 28rpx; font-weight: 600; border: none; }

/* 预定弹窗 */
.booking-popup { background: #FFF; padding: 32rpx; border-radius: 24rpx 24rpx 0 0; }
.popup-header { text-align: center; margin-bottom: 32rpx; }
.popup-title { font-size: 32rpx; font-weight: 600; color: #333; }
.popup-model-info { background: #F5F5F5; padding: 24rpx; border-radius: 12rpx; margin-bottom: 32rpx; display: flex; justify-content: space-between; align-items: center; }
.popup-model-info .model-name { font-size: 28rpx; color: #333; font-weight: 500; }
.popup-model-info .model-price { font-size: 28rpx; color: #FF9F29; font-weight: 600; }
.popup-form { margin-bottom: 32rpx; }
.form-item { margin-bottom: 24rpx; }
.form-label { display: block; font-size: 28rpx; color: #333; margin-bottom: 12rpx; }
.form-input, .form-textarea { width: 100%; padding: 24rpx; background: #F5F5F5; border-radius: 12rpx; font-size: 28rpx; border: none; box-sizing: border-box; }
.form-textarea { height: 160rpx; }
.popup-actions { display: flex; gap: 24rpx; }
.cancel-btn, .submit-btn { flex: 1; height: 88rpx; border-radius: 48rpx; font-size: 28rpx; font-weight: 600; border: none; }
.cancel-btn { background: #F5F5F5; color: #666; }
.submit-btn { background: linear-gradient(135deg, #FF9F29 0%, #FF7A00 100%); color: #FFF; }
</style>
