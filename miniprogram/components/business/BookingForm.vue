<template>
	<view class="booking-form-card">
		<!-- 顶部切换 (可选，未来扩展) -->
		<view class="form-header">
			<view class="tab-item active">国内租车</view>
			<!-- <view class="tab-item">企业用车</view> -->
		</view>

		<!-- 取车选择区域 -->
		<view class="location-selection-section">
			<view class="section-header">
				<text class="label">取车</text>
				<!-- 异地还车开关 -->
				<view class="diff-loc-switch" @tap.stop="toggleDifferentLocation">
					<text class="switch-text" :class="{ active: isDifferentLocation }">异地还车</text>
					<u-icon :name="isDifferentLocation ? 'checkmark-circle-fill' : 'checkmark-circle'"
							:color="isDifferentLocation ? '#FF9F29' : '#CCCCCC'" size="16"></u-icon>
				</view>
			</view>

			<!-- 取车城市/门店选择 -->
			<view class="city-store-row">
				<view class="city-selector" @tap.stop="openCityPicker('pickup')">
					<text class="city-name" :class="{ placeholder: !pickupCity }">
						{{ pickupCity || '选择城市' }}
					</text>
				</view>
				<view class="store-selector" @tap.stop="openStorePicker('pickup')">
					<text class="store-name" :class="{ placeholder: !pickupStore }">
						{{ pickupStore || '选择门店' }}
					</text>
				</view>
			</view>
		</view>

		<!-- 还车选择区域（异地还车时显示）-->
		<view class="location-selection-section return-section" :class="{ show: isDifferentLocation }">
			<view class="section-header">
				<text class="label">还车</text>
			</view>

			<!-- 还车城市/门店选择 -->
			<view class="city-store-row">
				<view class="city-selector" @tap.stop="openCityPicker('return')">
					<text class="city-name" :class="{ placeholder: !returnCity }">
						{{ returnCity || '选择城市' }}
					</text>
				</view>
				<view class="store-selector" @tap.stop="openStorePicker('return')">
					<text class="store-name" :class="{ placeholder: !returnStore }">
						{{ returnStore || '选择门店' }}
					</text>
				</view>
			</view>
		</view>

		<view class="divider-line"></view>

		<!-- 日期选择行 -->
		<view class="date-selection-row" @tap="openDatePicker">
			<view class="date-block">
				<view class="date-main">
					<text class="month-day">{{ formatDate(pickupDate, 'MM月DD日') }}</text>
					<text class="week">{{ formatDate(pickupDate, 'ddd') }}</text>
				</view>
				<view class="time">{{ pickupTime }}</view>
			</view>

			<view class="duration-indicator">
				<view class="line"></view>
				<view class="day-badge">{{ duration }}天</view>
				<view class="line"></view>
			</view>

			<view class="date-block right">
				<view class="date-main">
					<text class="month-day">{{ formatDate(returnDate, 'MM月DD日') }}</text>
					<text class="week">{{ formatDate(returnDate, 'ddd') }}</text>
				</view>
				<view class="time">{{ returnTime }}</view>
			</view>
		</view>

		<!-- 查询按钮 -->
		<button
			class="submit-btn"
			hover-class="submit-btn-hover"
			@tap="handleSearch"
		>
			立即去选车
		</button>

		<!-- 弹窗组件 -->
		<CityStorePicker
			ref="cityStorePicker"
			:type="pickerType"
			:title="pickerTitle"
			:data="pickerData"
			:selected-id="currentSelectedId"
			:user-location="userLocation"
			@confirm="onPickerConfirm"
		/>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import CityStorePicker from './CityStorePicker.vue';
import {
	getUserLocation,
	reverseGeocode,
	findNearestStore,
	sortStoresByDistance,
	sortStoresByName
} from '../../utils/location';
import { logger } from '@/utils/logger';

dayjs.locale('zh-cn');

const emit = defineEmits(['search', 'open-date-picker']);

// --- Mock Data ---
const cities = [
	{ id: '1', name: '北京' },
	{ id: '2', name: '上海' },
	{ id: '3', name: '成都' },
	{ id: '4', name: '深圳' },
	{ id: '5', name: '广州' },
	{ id: '6', name: '杭州' },
	{ id: '7', name: '重庆' },
	{ id: '8', name: '西安' },
	{ id: '9', name: '武汉' },
	{ id: '10', name: '长沙' },
	{ id: '11', name: '南京' },
	{ id: '12', name: '苏州' },
	{ id: '13', name: '天津' },
	{ id: '14', name: '青岛' },
	{ id: '15', name: '厦门' },
	{ id: '16', name: '昆明' },
	{ id: '17', name: '三亚' },
	{ id: '18', name: '海口' }
];

const stores = {
	'1': [{ id: '101', name: '北京朝阳店' }, { id: '102', name: '北京海淀店' }, { id: '103', name: '北京大兴店' }],
	'2': [{ id: '201', name: '上海虹桥店' }, { id: '202', name: '上海浦东店' }, { id: '203', name: '上海嘉定店' }],
	'3': [{ id: '301', name: '成都双流店' }, { id: '302', name: '成都高新店' }, { id: '303', name: '成都天府店' }],
	'4': [{ id: '401', name: '深圳宝安店' }, { id: '402', name: '深圳南山店' }, { id: '403', name: '深圳龙岗店' }],
	'5': [{ id: '501', name: '广州白云店' }, { id: '502', name: '广州天河店' }, { id: '503', name: '广州番禺店' }],
	'6': [{ id: '601', name: '杭州萧山店' }, { id: '602', name: '杭州西湖店' }],
	'7': [{ id: '701', name: '重庆江北店' }, { id: '702', name: '重庆渝北店' }],
	'8': [{ id: '801', name: '西安未央店' }, { id: '802', name: '西安雁塔店' }],
	'9': [{ id: '901', name: '武汉洪山店' }, { id: '902', name: '武汉江汉店' }],
	'10': [{ id: '1001', name: '长沙岳麓店' }, { id: '1002', name: '长沙雨花店' }],
	'11': [{ id: '1101', name: '南京江宁店' }, { id: '1102', name: '南京鼓楼店' }],
	'12': [{ id: '1201', name: '苏州吴中店' }, { id: '1202', name: '苏州工业园店' }],
	'13': [{ id: '1301', name: '天津滨海店' }, { id: '1302', name: '天津南开店' }],
	'14': [{ id: '1401', name: '青岛市南店' }, { id: '1402', name: '青岛崂山店' }],
	'15': [{ id: '1501', name: '厦门思明店' }, { id: '1502', name: '厦门湖里店' }],
	'16': [{ id: '1601', name: '昆明官渡店' }, { id: '1602', name: '昆明盘龙店' }],
	'17': [{ id: '1701', name: '三亚凤凰店' }, { id: '1702', name: '三亚海棠湾店' }],
	'18': [{ id: '1801', name: '海口美兰店' }, { id: '1802', name: '海口龙华店' }]
};

// --- State ---
const pickupCity = ref('');
const pickupCityId = ref('');
const pickupStore = ref('');
const pickupStoreId = ref('');

const returnCity = ref('');
const returnCityId = ref('');
const returnStore = ref('');
const returnStoreId = ref('');

const pickupDate = ref('');
const pickupTime = ref('10:00');
const returnDate = ref('');
const returnTime = ref('10:00');

const isDifferentLocation = ref(false);

// 新增：定位相关状态
const userLocation = ref<{ lat: number; lng: number } | null>(null);
const isLocating = ref(false);

// --- Picker State ---
const cityStorePicker = ref();
const pickerType = ref<'city' | 'store'>('city');
const pickerTitle = ref('');
const pickerData = ref<any[]>([]);
const currentPickerTarget = ref<'pickup' | 'return'>('pickup');
const currentSelectedId = ref('');

// --- Computed ---
const duration = computed(() => {
	if (!pickupDate.value || !returnDate.value) return 0;
	const start = dayjs(`${pickupDate.value} ${pickupTime.value}`);
	const end = dayjs(`${returnDate.value} ${returnTime.value}`);
	const diffHours = end.diff(start, 'hour');
	return Math.max(1, Math.ceil(diffHours / 24));
});

// --- Lifecycle ---
onMounted(async () => {
	const hasCache = loadFromStorage();

	// 获取用户定位
	try {
		isLocating.value = true;
		const location = await getUserLocation({
			type: 'gcj02',
			showLoading: false,
			timeout: 10000
		});
		userLocation.value = {
			lat: location.latitude,
			lng: location.longitude
		};
		logger.debug('获取定位成功', { location: userLocation.value });

		// 如果没有缓存数据，或者缓存的城市与定位城市不一致，则更新
		if (!hasCache || !pickupCity.value) {
			await initDefaultLocation();
		} else {
			// 有缓存数据，但检查是否需要更新门店（选择最近的门店）
			const cityName = await reverseGeocode(
				userLocation.value.lat,
				userLocation.value.lng
			);

			// 如果定位城市与缓存城市一致，更新为最近的门店
			if (cityName === pickupCity.value && pickupCityId.value) {
				const cityStores = (stores as any)[pickupCityId.value] || [];
				if (cityStores.length > 0) {
					const nearest = findNearestStore(cityStores, userLocation.value);
					if (nearest && nearest.id !== pickupStoreId.value) {
						logger.debug('更新为最近的门店', { storeName: nearest.name });
						pickupStore.value = nearest.name;
						pickupStoreId.value = nearest.id;
						if (!isDifferentLocation.value) {
							returnStore.value = nearest.name;
							returnStoreId.value = nearest.id;
						}
						saveToStorage();
					}
				}
			}
			// 如果定位城市与缓存城市不一致，更新城市和门店
			else if (cityName !== pickupCity.value) {
				logger.debug('定位城市变化', { from: pickupCity.value, to: cityName });
				await initDefaultLocation();
			}
		}
	} catch (error) {
		logger.error('获取定位失败', error);
		userLocation.value = null;

		// 定位失败，如果没有缓存数据，使用默认位置
		if (!hasCache || !pickupCity.value) {
			await initDefaultLocation();
		}
	} finally {
		isLocating.value = false;
	}
});

// --- Methods ---

// 初始化默认位置
async function initDefaultLocation() {
	let defaultCity = '北京';
	let defaultCityId = '1';

	// 如果有定位，尝试匹配城市
	if (userLocation.value) {
		const cityName = await reverseGeocode(
			userLocation.value.lat,
			userLocation.value.lng
		);
		const city = cities.find(c => c.name === cityName);
		if (city) {
			defaultCity = city.name;
			defaultCityId = city.id;
		}
	}

	// 设置城市
	pickupCity.value = defaultCity;
	pickupCityId.value = defaultCityId;

	// 获取门店列表并选择最近的
	const cityStores = (stores as any)[defaultCityId] || [];
	if (cityStores.length > 0) {
		let selectedStore = cityStores[0];

		// 如果有定位，选择最近的门店
		if (userLocation.value) {
			const nearest = findNearestStore(cityStores, userLocation.value);
			if (nearest) selectedStore = nearest;
		}

		pickupStore.value = selectedStore.name;
		pickupStoreId.value = selectedStore.id;
	}

	// 设置默认日期
	const now = dayjs();
	pickupDate.value = now.add(2, 'hour').format('YYYY-MM-DD');
	returnDate.value = now.add(2, 'day').add(2, 'hour').format('YYYY-MM-DD');

	saveToStorage();
}

const formatDate = (date: string, template: string) => {
	if (!date) return '';
	return dayjs(date).format(template);
};

// Picker Handlers
const openCityPicker = (target: 'pickup' | 'return') => {
	logger.debug('openCityPicker 被调用', { target });
	currentPickerTarget.value = target;
	pickerType.value = 'city';
	pickerTitle.value = target === 'pickup' ? '选择取车城市' : '选择还车城市';
	pickerData.value = cities;
	currentSelectedId.value = target === 'pickup' ? pickupCityId.value : returnCityId.value;
	cityStorePicker.value?.open();
};

const openStorePicker = (target: 'pickup' | 'return') => {
	logger.debug('openStorePicker 被调用', { target });

	const cityId = target === 'pickup' ? pickupCityId.value : returnCityId.value;
	if (!cityId) {
		uni.showToast({ title: '请先选择城市', icon: 'none' });
		return;
	}

	currentPickerTarget.value = target;
	pickerType.value = 'store';
	pickerTitle.value = target === 'pickup' ? '选择取车门店' : '选择还车门店';

	// 获取门店列表
	let cityStores = (stores as any)[cityId] || [];

	// 根据是否有定位进行排序
	if (userLocation.value) {
		pickerData.value = sortStoresByDistance(cityStores, userLocation.value);
	} else {
		pickerData.value = sortStoresByName(cityStores);
	}

	currentSelectedId.value = target === 'pickup' ? pickupStoreId.value : returnStoreId.value;
	cityStorePicker.value?.open();
};

const onPickerConfirm = (item: any) => {
	if (pickerType.value === 'city') {
		if (currentPickerTarget.value === 'pickup') {
			pickupCity.value = item.name;
			pickupCityId.value = item.id;

			// 自动填充门店
			const cityStores = (stores as any)[item.id] || [];
			if (cityStores.length > 0) {
				let selectedStore = cityStores[0];

				// 如果有定位，选择最近的门店
				if (userLocation.value) {
					const nearest = findNearestStore(cityStores, userLocation.value);
					if (nearest) selectedStore = nearest;
				}

				pickupStore.value = selectedStore.name;
				pickupStoreId.value = selectedStore.id;

				// 如果未开启异地还车，还车门店也跟随变化
				if (!isDifferentLocation.value) {
					returnStore.value = selectedStore.name;
					returnStoreId.value = selectedStore.id;
				}
			} else {
				// 如果该城市没有门店，清空门店信息
				pickupStore.value = '';
				pickupStoreId.value = '';
			}

			// 如果未开启异地还车，还车城市跟随变化
			if (!isDifferentLocation.value) {
				returnCity.value = item.name;
				returnCityId.value = item.id;
			}
		} else {
			returnCity.value = item.name;
			returnCityId.value = item.id;

			// 自动填充还车门店
			const cityStores = (stores as any)[item.id] || [];
			if (cityStores.length > 0) {
				let selectedStore = cityStores[0];

				// 如果有定位，选择最近的门店
				if (userLocation.value) {
					const nearest = findNearestStore(cityStores, userLocation.value);
					if (nearest) selectedStore = nearest;
				}

				returnStore.value = selectedStore.name;
				returnStoreId.value = selectedStore.id;
			} else {
				returnStore.value = '';
				returnStoreId.value = '';
			}
		}
	} else {
		if (currentPickerTarget.value === 'pickup') {
			pickupStore.value = item.name;
			pickupStoreId.value = item.id;
			if (!isDifferentLocation.value) {
				returnStore.value = item.name;
				returnStoreId.value = item.id;
			}
		} else {
			returnStore.value = item.name;
			returnStoreId.value = item.id;
		}
	}
	saveToStorage();
};

// Date Picker Handlers
const openDatePicker = () => {
	logger.debug('openDatePicker 被调用');
	emit('open-date-picker', {
		pickupDate: pickupDate.value,
		returnDate: returnDate.value,
		time: pickupTime.value
	});
};

const onDateConfirm = (data: any) => {
	logger.debug('日期选择确认', data);
	pickupDate.value = data.pickupDate;
	returnDate.value = data.returnDate;
	pickupTime.value = data.time;
	returnTime.value = data.time;
	saveToStorage();
};

const toggleDifferentLocation = () => {
	isDifferentLocation.value = !isDifferentLocation.value;
	if (!isDifferentLocation.value) {
		// 清空还车信息
		returnCity.value = '';
		returnCityId.value = '';
		returnStore.value = '';
		returnStoreId.value = '';
	} else {
		// 开启时，默认还车地点等于取车地点
		returnCity.value = pickupCity.value;
		returnCityId.value = pickupCityId.value;
		returnStore.value = pickupStore.value;
		returnStoreId.value = pickupStoreId.value;
	}
	saveToStorage();
};

const handleSearch = () => {
	// 验证
	if (!pickupCityId.value || !pickupStoreId.value) {
		uni.showToast({ title: '请选择取车城市和门店', icon: 'none' });
		return;
	}
	if (!pickupDate.value || !returnDate.value) {
		uni.showToast({ title: '请选择取还车时间', icon: 'none' });
		return;
	}
	if (isDifferentLocation.value && (!returnCityId.value || !returnStoreId.value)) {
		uni.showToast({ title: '请选择还车城市和门店', icon: 'none' });
		return;
	}

	const params = {
		pickupCity: pickupCity.value,
		pickupStore: pickupStore.value,
		pickupDate: pickupDate.value,
		pickupTime: pickupTime.value,
		returnDate: returnDate.value,
		returnTime: returnTime.value,
		isDifferentLocation: isDifferentLocation.value,
		returnCity: isDifferentLocation.value ? returnCity.value : pickupCity.value,
		returnStore: isDifferentLocation.value ? returnStore.value : pickupStore.value,
		duration: duration.value
	};

	logger.debug('搜索参数', params);
	emit('search', params);
};

// Storage
const saveToStorage = () => {
	const data = {
		pickupCity: pickupCity.value,
		pickupCityId: pickupCityId.value,
		pickupStore: pickupStore.value,
		pickupStoreId: pickupStoreId.value,
		pickupDate: pickupDate.value,
		pickupTime: pickupTime.value,
		returnDate: returnDate.value,
		returnTime: returnTime.value,
		isDifferentLocation: isDifferentLocation.value,
		returnCity: returnCity.value,
		returnCityId: returnCityId.value,
		returnStore: returnStore.value,
		returnStoreId: returnStoreId.value
	};
	uni.setStorageSync('booking_form_data', data);
};

const loadFromStorage = (): boolean => {
	const data = uni.getStorageSync('booking_form_data');
	if (data) {
		pickupCity.value = data.pickupCity;
		pickupCityId.value = data.pickupCityId;
		pickupStore.value = data.pickupStore;
		pickupStoreId.value = data.pickupStoreId;
		pickupDate.value = data.pickupDate;
		pickupTime.value = data.pickupTime;
		returnDate.value = data.returnDate;
		returnTime.value = data.returnTime;
		isDifferentLocation.value = data.isDifferentLocation;
		returnCity.value = data.returnCity;
		returnCityId.value = data.returnCityId;
		returnStore.value = data.returnStore;
		returnStoreId.value = data.returnStoreId;
		return true;
	}
	return false;
};

defineExpose({ onDateConfirm });
</script>

<style scoped lang="scss">
.booking-form-card {
	background-color: #FFFFFF;
	border-radius: $uni-radius-lg;
	padding: 32rpx;
	box-shadow: $uni-shadow-float;
	position: relative;
	overflow: hidden;
}

.form-header {
	display: flex;
	margin-bottom: 32rpx;

	.tab-item {
		font-size: 32rpx;
		font-weight: bold;
		color: $uni-text-color-secondary;
		margin-right: 40rpx;
		position: relative;
		transition: all 0.3s;

		&.active {
			color: $uni-text-color;
			font-size: 36rpx;

			&::after {
				content: '';
				position: absolute;
				bottom: -8rpx;
				left: 0;
				width: 40rpx;
				height: 6rpx;
				background-color: $uni-color-primary;
				border-radius: 3rpx;
			}
		}
	}
}

// 位置选择区域
.location-selection-section {
	padding: 16rpx 0;

	&.return-section {
		max-height: 0;
		overflow: hidden;
		opacity: 0;
		transition: all 0.3s ease-in-out;

		&.show {
			max-height: 200rpx;
			opacity: 1;
			padding: 16rpx 0;
		}
	}
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;

	.label {
		font-size: 24rpx;
		color: $uni-text-color-secondary;
	}
}

// 城市门店选择行
.city-store-row {
	display: flex;
	gap: 16rpx;

	.city-selector {
		flex: 0 0 35%;
		background: $uni-bg-color;
		border-radius: 12rpx;
		padding: 20rpx 16rpx;
		cursor: pointer;
		transition: opacity 0.2s;

		&:active {
			opacity: 0.7;
		}

		.city-name {
			font-size: 32rpx;
			font-weight: bold;
			color: $uni-text-color;

			&.placeholder {
				color: $uni-text-color-placeholder;
				font-size: 28rpx;
				font-weight: normal;
			}
		}
	}

	.store-selector {
		flex: 1;
		background: $uni-bg-color;
		border-radius: 12rpx;
		padding: 20rpx 16rpx;
		cursor: pointer;
		transition: opacity 0.2s;

		&:active {
			opacity: 0.7;
		}

		.store-name {
			font-size: 28rpx;
			color: $uni-text-color;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;

			&.placeholder {
				color: $uni-text-color-placeholder;
			}
		}
	}
}

// 异地还车开关
.diff-loc-switch {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 4rpx 12rpx;
	background-color: $uni-bg-color;
	border-radius: 20rpx;
	cursor: pointer;

	.switch-text {
		font-size: 24rpx;
		color: $uni-text-color-secondary;

		&.active {
			color: $uni-color-primary;
			font-weight: 500;
		}
	}
}

.divider-line {
	height: 1rpx;
	background-color: $uni-border-color-light;
	margin: 0 0 24rpx;
}

.date-selection-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 40rpx;
}

.date-block {
	display: flex;
	flex-direction: column;

	.date-main {
		display: flex;
		align-items: baseline;
		gap: 8rpx;
		margin-bottom: 4rpx;
	}

	.month-day {
		font-size: 36rpx;
		font-weight: bold;
		color: $uni-text-color;
		font-family: 'DIN Alternate', sans-serif;
	}

	.week {
		font-size: 24rpx;
		color: $uni-text-color-secondary;
	}

	.time {
		font-size: 24rpx;
		color: $uni-text-color-placeholder;
	}

	&.right {
		align-items: flex-end;
	}
}

.duration-indicator {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	padding: 0 20rpx;

	.line {
		height: 1rpx;
		flex: 1;
		background-color: #E5E6EB;
	}

	.day-badge {
		font-size: 20rpx;
		color: $uni-text-color-secondary;
		background-color: $uni-bg-color;
		padding: 4rpx 16rpx;
		border-radius: 20rpx;
	}
}

.submit-btn {
	background: $uni-color-primary-gradient;
	color: #FFFFFF;
	font-size: 34rpx;
	font-weight: bold;
	height: 96rpx;
	line-height: 96rpx;
	border-radius: $uni-radius-btn;
	box-shadow: $uni-shadow-glow;
	border: none;

	&::after {
		border: none;
	}
}

.submit-btn-hover {
	opacity: 0.9;
	transform: scale(0.99);
}
</style>
