<template>
	<view class="order-confirm-page">
		<scroll-view scroll-y class="content-scroll">
			<!-- 车辆信息 -->
			<view class="section">
				<view class="section-title">车辆信息</view>
				<view class="vehicle-info">
					<image class="vehicle-image" :src="orderData.vehicleImage" mode="aspectFill"></image>
					<view class="vehicle-details">
						<text class="vehicle-name">{{ orderData.vehicleName }}</text>
						<text class="vehicle-spec">{{ orderData.vehicleType }} | {{ orderData.seats }}座{{ orderData.beds }}卧</text>
					</view>
				</view>
			</view>

			<!-- 租赁信息 -->
			<view class="section">
				<view class="section-title">租赁信息</view>
				<view class="rental-info">
					<!-- 租期概览 -->
					<view class="rental-duration">
						<view class="duration-icon">
							<u-icon name="calendar-fill" size="20" color="#FF9F29"></u-icon>
						</view>
						<view class="duration-info">
							<text class="duration-label">租期</text>
							<text class="duration-value">{{ rentalDays }}天</text>
							<text v-if="isSpecialOffer" class="duration-tip">(固定租期)</text>
						</view>
					</view>

					<!-- 特惠套餐：取车时间选择 -->
					<view v-if="isSpecialOffer" class="pickup-time-selector">
						<view class="selector-title">
							<u-icon name="calendar" size="18" color="#FF9F29"></u-icon>
							<text class="title-text">选择取车时间</text>
						</view>
						<view class="selector-tip">
							<u-icon name="info" size="14" color="#999"></u-icon>
							<text class="tip-text">可选时间段：{{ formatDateRange(specialOfferData.availableTimeRange) }}</text>
						</view>

						<!-- 日期选择 -->
						<picker
							mode="date"
							:value="orderData.pickupDate"
							:start="specialOfferData.availableTimeRange.start"
							:end="specialOfferData.availableTimeRange.end"
							@change="onDateChange"
						>
							<view class="time-picker-row">
								<view class="picker-label">
									<u-icon name="calendar" size="16" color="#666"></u-icon>
									<text class="label-text">取车日期</text>
								</view>
								<view class="picker-value">
									<text class="value-text">{{ orderData.pickupDate }}</text>
									<u-icon name="right" size="16" color="#999"></u-icon>
								</view>
							</view>
						</picker>

						<!-- 时间选择 -->
						<picker
							mode="time"
							:value="orderData.pickupTime"
							@change="onTimeChange"
						>
							<view class="time-picker-row">
								<view class="picker-label">
									<u-icon name="clock" size="16" color="#666"></u-icon>
									<text class="label-text">取车时间</text>
								</view>
								<view class="picker-value">
									<text class="value-text">{{ orderData.pickupTime }}</text>
									<u-icon name="right" size="16" color="#999"></u-icon>
								</view>
							</view>
						</picker>

						<!-- 自动计算提示 -->
						<view class="auto-calc-tip">
							<u-icon name="info-circle-fill" size="16" color="#4CAF50"></u-icon>
							<text class="calc-tip-text">还车时间：{{ orderData.returnDate }} {{ orderData.returnTime }}</text>
						</view>
					</view>

					<!-- 取还车时间线 -->
					<view class="rental-timeline">
						<!-- 取车信息 -->
						<view class="timeline-item pickup">
							<view class="timeline-dot">
								<view class="dot-inner"></view>
							</view>
							<view class="timeline-content">
								<view class="timeline-header">
									<u-icon name="flag-fill" size="18" color="#4CAF50"></u-icon>
									<text class="timeline-title">取车</text>
									<text v-if="isSpecialOffer" class="timeline-badge">固定门店</text>
								</view>
								<view class="timeline-detail">
									<view class="detail-item">
										<u-icon name="location" size="14" color="#999"></u-icon>
										<text class="detail-text">{{ orderData.pickupLocation }}</text>
									</view>
									<view class="detail-item">
										<u-icon name="calendar" size="14" color="#999"></u-icon>
										<text class="detail-text">{{ orderData.pickupDate }} {{ orderData.pickupTime }}</text>
									</view>
								</view>
							</view>
						</view>

						<!-- 还车信息 -->
						<view class="timeline-item return">
							<view class="timeline-dot">
								<view class="dot-inner"></view>
							</view>
							<view class="timeline-content">
								<view class="timeline-header">
									<u-icon name="checkbox-mark" size="18" color="#FF9F29"></u-icon>
									<text class="timeline-title">还车</text>
									<text v-if="isSpecialOffer" class="timeline-badge">固定门店</text>
								</view>
								<view class="timeline-detail">
									<view class="detail-item">
										<u-icon name="location" size="14" color="#999"></u-icon>
										<text class="detail-text">{{ orderData.returnLocation }}</text>
									</view>
									<view class="detail-item">
										<u-icon name="calendar" size="14" color="#999"></u-icon>
										<text class="detail-text">{{ orderData.returnDate }} {{ orderData.returnTime }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>

					<!-- 特惠套餐重要提示 -->
					<view v-if="isSpecialOffer" class="special-notice">
						<u-icon name="info-circle-fill" size="16" color="#FF9F29"></u-icon>
						<text class="notice-text">取车门店、还车门店、租期均为固定，不可更改。如需改变行程，订单将转为常规订单按原价计费。</text>
					</view>
				</view>
			</view>

			<!-- 保险方案 -->
			<view class="section">
				<view class="section-title">选择保险方案</view>
				<view class="insurance-list">
					<view 
						v-for="(plan, index) in insurancePlans" 
						:key="index"
						class="insurance-item"
						:class="{ selected: selectedInsurance === index }"
						@tap="selectInsurance(index)"
					>
						<view class="insurance-header">
							<view class="insurance-name-box">
								<text class="insurance-name">{{ plan.name }}</text>
								<text class="insurance-price">+¥{{ plan.price }}/天</text>
							</view>
							<u-icon 
								:name="selectedInsurance === index ? 'checkmarkempty' : 'circle'" 
								size="20" 
								:color="selectedInsurance === index ? '#FF9F29' : '#DDD'">
							</u-icon>
						</view>
						<text class="insurance-desc">{{ plan.description }}</text>
					</view>
				</view>
			</view>

			<!-- 附加服务 -->
			<view class="section">
				<view class="section-title">附加服务(可选)</view>
				<view class="services-list">
					<view 
						v-for="(service, index) in additionalServices" 
						:key="index"
						class="service-item"
						@tap="toggleService(index)"
					>
						<view class="service-info">
							<text class="service-name">{{ service.name }}</text>
							<text class="service-price">+¥{{ service.price }}/{{ service.unit }}</text>
						</view>
						<u-icon 
							:name="service.selected ? 'checkbox-filled' : 'checkbox'" 
							size="20" 
							:color="service.selected ? '#FF9F29' : '#DDD'">
						</u-icon>
					</view>
				</view>
			</view>

			<!-- 优惠券 -->
			<view class="section coupon-section" @tap="selectCoupon">
				<view class="coupon-row">
					<text class="section-title">优惠券</text>
					<view class="coupon-value">
						<text class="coupon-text">{{ selectedCoupon ? selectedCoupon.name : '请选择' }}</text>
						<u-icon name="right" size="16" color="#999"></u-icon>
					</view>
				</view>
				<!-- 节省金额提示 -->
				<view v-if="selectedCoupon" class="savings-tip">
					<u-icon name="checkbox-mark" size="16" color="#52C41A"></u-icon>
					<text class="savings-text">已为您节省 ¥{{ couponDiscount }}</text>
				</view>
			</view>

			<!-- 价格明细 -->
			<view class="section">
				<view class="section-title">价格明细</view>
				<view class="price-detail">
					<view class="detail-row">
						<text class="detail-label">租金({{ rentalDays }}天 × ¥{{ orderData.dailyPrice }})</text>
						<text class="detail-value">¥{{ basePrice }}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">保险费用</text>
						<text class="detail-value">¥{{ insurancePrice }}</text>
					</view>
					<view v-if="servicesPrice > 0" class="detail-row">
						<text class="detail-label">附加服务</text>
						<text class="detail-value">¥{{ servicesPrice }}</text>
					</view>
					<view v-if="selectedCoupon" class="detail-row discount">
						<text class="detail-label">优惠券抵扣</text>
						<text class="detail-value">-¥{{ couponDiscount }}</text>
					</view>
					<view class="detail-row total">
						<text class="detail-label">合计</text>
						<text class="detail-value">¥{{ totalPrice }}</text>
					</view>
				</view>
			</view>

			<!-- 底部占位 -->
			<view class="bottom-placeholder"></view>
		</scroll-view>

		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<view class="total-info">
				<text class="total-label">总计</text>
				<view class="total-price">
					<text class="currency">¥</text>
					<text class="price">{{ totalPrice }}</text>
				</view>
			</view>
			<button class="submit-btn" @tap="handleSubmit">提交订单</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 订单类型
const orderType = ref<'normal' | 'special-offer'>('normal');
const isSpecialOffer = computed(() => orderType.value === 'special-offer');

// 特惠套餐数据
const specialOfferData = ref({
	offerId: '',
	fixedRentalDays: 5, // 固定租期（天）
	packagePrice: 0, // 套餐价格
	originalPrice: 0, // 原价
	availableTimeRange: {
		start: '2025-12-05',
		end: '2025-12-30'
	}
});

// 订单数据
const orderData = ref({
	vehicleId: '',
	vehicleName: '上汽大通RG10',
	vehicleType: 'C型房车',
	vehicleImage: '/static/场景推荐2.jpg',
	seats: 6,
	beds: 4,
	dailyPrice: 680,
	pickupLocation: '成都市武侯区天府大道中段',
	pickupDate: '2024-12-01',
	pickupTime: '09:00',
	returnLocation: '成都市武侯区天府大道中段',
	returnDate: '2024-12-05',
	returnTime: '18:00'
});

// 保险方案
const insurancePlans = ref([
	{
		name: '基础险',
		price: 50,
		description: '第三者责任险,保障第三方人身和财产损失'
	},
	{
		name: '标准险',
		price: 100,
		description: '基础险+车辆损失险(80%赔付),更全面的保障'
	},
	{
		name: '全险',
		price: 150,
		description: '标准险+车辆损失险(100%赔付)+驾意险,无忧出行'
	}
]);

const selectedInsurance = ref(0); // 默认选择基础险

// 附加服务
const additionalServices = ref([
	{ name: 'GPS导航', price: 20, unit: '天', selected: false },
	{ name: '儿童安全座椅', price: 30, unit: '天', selected: false },
	{ name: '车载WiFi', price: 15, unit: '天', selected: false },
	{ name: '异地还车', price: 500, unit: '次', selected: false }
]);

// 优惠券
const selectedCoupon = ref<any>(null);

// 计算租赁天数
const rentalDays = computed(() => {
	if (isSpecialOffer.value) {
		// 特惠套餐使用固定租期
		return specialOfferData.value.fixedRentalDays;
	}
	// 常规订单计算租期
	const pickup = new Date(orderData.value.pickupDate);
	const returnDate = new Date(orderData.value.returnDate);
	const days = Math.ceil((returnDate.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
	return days > 0 ? days : 1;
});

// 计算基础租金
const basePrice = computed(() => {
	if (isSpecialOffer.value) {
		// 特惠套餐使用套餐价格
		return specialOfferData.value.packagePrice;
	}
	return orderData.value.dailyPrice * rentalDays.value;
});

// 计算保险费用
const insurancePrice = computed(() => {
	return insurancePlans.value[selectedInsurance.value].price * rentalDays.value;
});

// 计算附加服务费用
const servicesPrice = computed(() => {
	return additionalServices.value.reduce((total, service) => {
		if (service.selected) {
			return total + (service.unit === '天' ? service.price * rentalDays.value : service.price);
		}
		return total;
	}, 0);
});

// 计算优惠券抵扣
const couponDiscount = computed(() => {
	if (!selectedCoupon.value) return 0;
	return selectedCoupon.value.discount || 0;
});

// 计算总价
const totalPrice = computed(() => {
	const total = basePrice.value + insurancePrice.value + servicesPrice.value - couponDiscount.value;
	return Math.max(total, 0);
});

// 自动计算还车时间（特惠套餐）
const calculateReturnDateTime = () => {
	if (!isSpecialOffer.value) return;

	const pickupDateTime = new Date(`${orderData.value.pickupDate} ${orderData.value.pickupTime}`);
	const returnDateTime = new Date(pickupDateTime.getTime() + specialOfferData.value.fixedRentalDays * 24 * 60 * 60 * 1000);

	const year = returnDateTime.getFullYear();
	const month = String(returnDateTime.getMonth() + 1).padStart(2, '0');
	const day = String(returnDateTime.getDate()).padStart(2, '0');
	const hours = String(returnDateTime.getHours()).padStart(2, '0');
	const minutes = String(returnDateTime.getMinutes()).padStart(2, '0');

	orderData.value.returnDate = `${year}-${month}-${day}`;
	orderData.value.returnTime = `${hours}:${minutes}`;
};

// 监听取车日期和时间变化，自动计算还车时间
watch([() => orderData.value.pickupDate, () => orderData.value.pickupTime], () => {
	if (isSpecialOffer.value) {
		calculateReturnDateTime();
	}
});

// 格式化日期范围
const formatDateRange = (range: { start: string; end: string }) => {
	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
	};
	return `${formatDate(range.start)} - ${formatDate(range.end)}`;
};

// 日期选择变化
const onDateChange = (e: any) => {
	orderData.value.pickupDate = e.detail.value;
};

// 时间选择变化
const onTimeChange = (e: any) => {
	orderData.value.pickupTime = e.detail.value;
};

// 加载特惠套餐数据
const loadSpecialOfferData = async (offerId: string) => {
	try {
		uni.showLoading({ title: '加载中...' });

		// TODO: 调用API加载特惠套餐详情
		// const response = await getSpecialOfferDetail(offerId);

		// Mock数据
		const mockData = {
			offerId: offerId,
			fixedRentalDays: 5,
			packagePrice: 1280,
			originalPrice: 3400,
			vehicle: {
				name: '依维柯欧胜C型房车',
				type: 'C型房车',
				image: '/static/场景推荐2.jpg',
				seats: 6,
				beds: 4
			},
			pickupStore: {
				name: '北京大新门店',
				address: '北京市朝阳区大新路123号'
			},
			returnStore: {
				name: '西安鼓楼门店',
				address: '陕西省西安市碑林区鼓楼街88号'
			},
			availableTimeRange: {
				start: '2025-12-05',
				end: '2025-12-30'
			}
		};

		// 更新特惠套餐数据
		specialOfferData.value = {
			offerId: mockData.offerId,
			fixedRentalDays: mockData.fixedRentalDays,
			packagePrice: mockData.packagePrice,
			originalPrice: mockData.originalPrice,
			availableTimeRange: mockData.availableTimeRange
		};

		// 更新订单数据
		orderData.value.vehicleName = mockData.vehicle.name;
		orderData.value.vehicleType = mockData.vehicle.type;
		orderData.value.vehicleImage = mockData.vehicle.image;
		orderData.value.seats = mockData.vehicle.seats;
		orderData.value.beds = mockData.vehicle.beds;
		orderData.value.pickupLocation = `${mockData.pickupStore.name} - ${mockData.pickupStore.address}`;
		orderData.value.returnLocation = `${mockData.returnStore.name} - ${mockData.returnStore.address}`;

		// 设置默认取车时间为可选时间段的第一天
		orderData.value.pickupDate = mockData.availableTimeRange.start;
		orderData.value.pickupTime = '09:00';

		// 计算还车时间
		calculateReturnDateTime();

		uni.hideLoading();
	} catch (error) {
		console.error('加载特惠套餐失败:', error);
		uni.hideLoading();
		uni.showToast({
			title: '加载失败',
			icon: 'none'
		});
	}
};

onLoad((options: any) => {
	// 判断订单类型
	if (options.type === 'special-offer' && options.offerId) {
		orderType.value = 'special-offer';
		loadSpecialOfferData(options.offerId);
	} else if (options.vehicleId) {
		orderType.value = 'normal';
		orderData.value.vehicleId = options.vehicleId;
		// TODO: 根据vehicleId加载车辆信息
		console.log('加载常规订单确认页:', options.vehicleId);
	}

	// 监听优惠券选择事件
	uni.$on('couponSelected', (coupon: any) => {
		selectedCoupon.value = coupon;
		console.log('选中优惠券:', coupon);
	});
});

// 页面卸载时移除监听
onUnmounted(() => {
	uni.$off('couponSelected');
});

const selectInsurance = (index: number) => {
	selectedInsurance.value = index;
};

const toggleService = (index: number) => {
	additionalServices.value[index].selected = !additionalServices.value[index].selected;
};

const selectCoupon = () => {
	// 跳转到优惠券选择页面
	uni.navigateTo({
		url: `/pages/order/select-coupon?amount=${totalPrice.value}&selectedId=${selectedCoupon.value?.id || ''}`
	});
};

const handleSubmit = () => {
	// 特惠套餐验证取车时间
	if (isSpecialOffer.value) {
		const pickupDate = new Date(orderData.value.pickupDate);
		const startDate = new Date(specialOfferData.value.availableTimeRange.start);
		const endDate = new Date(specialOfferData.value.availableTimeRange.end);

		if (pickupDate < startDate || pickupDate > endDate) {
			uni.showToast({
				title: '请选择有效的取车日期',
				icon: 'none'
			});
			return;
		}
	}

	// 模拟生成订单号
	const orderNo = 'DD' + Date.now();

	uni.showLoading({ title: '提交中...' });

	setTimeout(() => {
		uni.hideLoading();

		// 跳转到支付页面
		uni.navigateTo({
			url: `/pages/order/pay?orderNo=${orderNo}&amount=${totalPrice.value}`
		});
	}, 1000);
};
</script>

<style scoped lang="scss">
.order-confirm-page {
	min-height: 100vh;
	background-color: #F8F8F8;
	display: flex;
	flex-direction: column;
}

.content-scroll {
	flex: 1;
	height: 0;
}

.section {
	background-color: #FFFFFF;
	padding: 32rpx;
	margin-bottom: 16rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 24rpx;
	position: relative;
	padding-left: 16rpx;
	
	&::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 6rpx;
		height: 28rpx;
		background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
		border-radius: 3rpx;
	}
}

// 车辆信息
.vehicle-info {
	display: flex;
	gap: 24rpx;
	padding: 20rpx;
	background: linear-gradient(135deg, #FFF9F0 0%, #FFFFFF 100%);
	border-radius: 12rpx;
	border: 1rpx solid #FFE8CC;
}

.vehicle-image {
	width: 160rpx;
	height: 120rpx;
	border-radius: 12rpx;
	background-color: #F5F5F5;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.vehicle-details {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 12rpx;
}

.vehicle-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
}

.vehicle-spec {
	font-size: 24rpx;
	color: #999;
}

// 租赁信息
.rental-info {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

// 租期概览
.rental-duration {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 20rpx;
	background: linear-gradient(135deg, #FFF5E9 0%, #FFFBF5 100%);
	border-radius: 12rpx;
	border: 2rpx solid #FFE4C4;
}

.duration-icon {
	width: 48rpx;
	height: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	border-radius: 50%;
	box-shadow: 0 4rpx 12rpx rgba(255, 159, 41, 0.3);
}

.duration-info {
	flex: 1;
	display: flex;
	align-items: baseline;
	gap: 12rpx;
	flex-wrap: wrap;
}

.duration-label {
	font-size: 26rpx;
	color: #666;
}

.duration-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #FF9F29;
}

.duration-tip {
	font-size: 22rpx;
	color: #999;
	margin-left: 8rpx;
}

// 取车时间选择器（特惠套餐）
.pickup-time-selector {
	margin-top: 24rpx;
	padding: 24rpx;
	background: linear-gradient(135deg, #FFF9F0 0%, #FFFFFF 100%);
	border-radius: 12rpx;
	border: 2rpx solid #FFE8CC;
}

.selector-title {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-bottom: 12rpx;
}

.title-text {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.selector-tip {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-bottom: 20rpx;
	padding: 12rpx;
	background-color: rgba(255, 159, 41, 0.1);
	border-radius: 8rpx;
}

.tip-text {
	font-size: 24rpx;
	color: #666;
	line-height: 1.5;
}

.time-picker-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx;
	margin-bottom: 12rpx;
	background-color: #FFFFFF;
	border-radius: 12rpx;
	border: 1rpx solid #E0E0E0;
	transition: all 0.3s ease;

	&:active {
		background-color: #F8F8F8;
		border-color: #FF9F29;
	}

	&:last-of-type {
		margin-bottom: 0;
	}
}

.picker-label {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.label-text {
	font-size: 28rpx;
	color: #666;
}

.picker-value {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.value-text {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.auto-calc-tip {
	display: flex;
	align-items: flex-start;
	gap: 8rpx;
	margin-top: 16rpx;
	padding: 12rpx;
	background-color: rgba(76, 175, 80, 0.1);
	border-radius: 8rpx;
	border-left: 4rpx solid #4CAF50;
}

.calc-tip-text {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	line-height: 1.5;
	font-weight: 500;
}

// 时间线
.rental-timeline {
	display: flex;
	flex-direction: column;
	gap: 0;
	margin-top: 24rpx;
}

.timeline-item {
	display: flex;
	gap: 16rpx;
	position: relative;
	padding-bottom: 32rpx;
	
	&:last-child {
		padding-bottom: 0;
		
		.timeline-dot::after {
			display: none;
		}
	}
}

.timeline-dot {
	width: 32rpx;
	height: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	flex-shrink: 0;
	margin-top: 4rpx;
	
	&::after {
		content: '';
		position: absolute;
		top: 32rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 2rpx;
		height: 100%;
		background: linear-gradient(180deg, #E0E0E0 0%, #F5F5F5 100%);
	}
}

.dot-inner {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
	box-shadow: 0 0 0 4rpx rgba(76, 175, 80, 0.15);
}

.timeline-item.return .dot-inner {
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	box-shadow: 0 0 0 4rpx rgba(255, 159, 41, 0.15);
}

.timeline-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.timeline-header {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.timeline-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.timeline-badge {
	margin-left: 8rpx;
	padding: 4rpx 12rpx;
	font-size: 20rpx;
	color: #FF9F29;
	background-color: rgba(255, 159, 41, 0.1);
	border-radius: 6rpx;
	font-weight: 500;
}

.timeline-detail {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	padding-left: 26rpx;
}

.detail-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.detail-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
}

// 特惠套餐重要提示
.special-notice {
	display: flex;
	align-items: flex-start;
	gap: 8rpx;
	margin-top: 24rpx;
	padding: 16rpx;
	background: linear-gradient(135deg, rgba(255, 159, 41, 0.1) 0%, rgba(255, 184, 77, 0.05) 100%);
	border-radius: 12rpx;
	border-left: 4rpx solid #FF9F29;
}

.notice-text {
	flex: 1;
	font-size: 24rpx;
	color: #666;
	line-height: 1.6;
}

// 保险方案
.insurance-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.insurance-item {
	padding: 24rpx;
	border: 2rpx solid #E0E0E0;
	border-radius: 12rpx;
	background-color: #FFFFFF;
	transition: all 0.3s ease;
	
	&.selected {
		border-color: transparent;
		background: linear-gradient(white, white) padding-box,
		            linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%) border-box;
		box-shadow: 0 4rpx 16rpx rgba(255, 159, 41, 0.15);
		
		.insurance-name {
			color: #FF9F29;
		}
	}
}

.insurance-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8rpx;
}

.insurance-name-box {
	display: flex;
	align-items: baseline;
	gap: 12rpx;
}

.insurance-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	transition: color 0.3s ease;
}

.insurance-price {
	font-size: 24rpx;
	color: $uni-color-primary;
	font-weight: 600;
}

.insurance-desc {
	font-size: 24rpx;
	color: #999;
	line-height: 1.6;
}

// 附加服务
.services-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.service-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
	
	&:last-child {
		border-bottom: none;
	}
}

.service-info {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.service-name {
	font-size: 28rpx;
	color: #333;
}

.service-price {
	font-size: 24rpx;
	color: #999;
}

// 优惠券
.coupon-section {
	padding: 24rpx 32rpx;
}

.coupon-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.coupon-value {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.coupon-text {
	font-size: 28rpx;
	color: #999;
}

.savings-tip {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-top: 16rpx;
	padding: 12rpx 16rpx;
	background: linear-gradient(135deg, rgba(82, 196, 26, 0.1) 0%, rgba(82, 196, 26, 0.05) 100%);
	border-radius: 8rpx;
	border-left: 4rpx solid #52C41A;
}

.savings-text {
	font-size: 26rpx;
	color: #52C41A;
	font-weight: 500;
}

// 价格明细
.price-detail {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.detail-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	
	&.discount {
		.detail-value {
			color: #F44336;
		}
	}
	
	&.total {
		padding-top: 16rpx;
		border-top: 1rpx solid #E0E0E0;
		
		.detail-label {
			font-size: 32rpx;
			font-weight: bold;
		}
		
		.detail-value {
			font-size: 36rpx;
			font-weight: bold;
			color: $uni-color-primary;
		}
	}
}

.detail-label {
	font-size: 28rpx;
	color: #666;
}

.detail-value {
	font-size: 28rpx;
	color: #333;
}

.bottom-placeholder {
	height: 180rpx;
}

// 底部操作栏
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 32rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 1) 100%);
	backdrop-filter: blur(20rpx);
	border-top: 1rpx solid rgba(0, 0, 0, 0.05);
	box-shadow: 0 -8rpx 24rpx rgba(0, 0, 0, 0.08);
	z-index: 100;
}

.total-info {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.total-label {
	font-size: 24rpx;
	color: #999;
}

.total-price {
	display: flex;
	align-items: baseline;
	color: $uni-color-primary;
	
	.currency {
		font-size: 24rpx;
		font-weight: bold;
	}
	
	.price {
		font-size: 40rpx;
		font-weight: bold;
		margin-left: 4rpx;
	}
}

.submit-btn {
	margin: 0;
	padding: 0 56rpx;
	height: 88rpx;
	line-height: 88rpx;
	font-size: 32rpx;
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	color: #FFFFFF;
	border-radius: 44rpx;
	font-weight: bold;
	box-shadow: 0 8rpx 24rpx rgba(255, 159, 41, 0.35);
	transition: all 0.3s ease;
	
	&::after {
		border: none;
	}
	
	&:active {
		transform: scale(0.98);
		box-shadow: 0 4rpx 16rpx rgba(255, 159, 41, 0.3);
	}
}
</style>
