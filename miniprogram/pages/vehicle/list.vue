<template>
	<view class="vehicle-list-page">
		<!-- 筛选栏 -->
		<VehicleFilter @filter="handleFilter" @sort="handleSort" />

		<!-- 列表内容 -->
		<scroll-view scroll-y class="list-scroll">
			<view class="list-container">
				<!-- 骨架屏加载 -->
				<u-skeleton
					v-if="loading"
					:loading="true"
					:rows="3"
					:title="false"
					:avatar="false"
					:animate="true"
					:rowsHeight="[380, 120, 60]"
				></u-skeleton>

				<!-- 错误状态 -->
				<ErrorState
					v-else-if="error"
					:message="errorMessage"
					@retry="loadVehicles"
				/>

				<!-- 空状态 -->
				<EmptyState
					v-else-if="!loading && groupedVehicles.length === 0"
					mode="car"
					text="暂无符合条件的房车"
					buttonText="重置筛选"
					@button-click="resetFilter"
				/>

				<!-- 按门店分组 -->
				<template v-else>
					<view v-for="(group, index) in groupedVehicles" :key="index" class="store-group">
						<!-- 门店头 (Sticky Header) -->
						<view class="store-header">
							<view class="store-left">
								<view class="icon-box">
									<u-icon name="map-fill" size="14" color="#FFFFFF"></u-icon>
								</view>
								<text class="store-name">{{ group.storeName }}</text>
							</view>
							<text class="vehicle-count">{{ group.vehicles.length }}辆可用</text>
						</view>

						<view class="vehicle-list">
							<VehicleCard
								v-for="vehicle in group.vehicles"
								:key="vehicle.id"
								:data="vehicle"
								:showFavoriteButton="true"
								@click="goToDetail"
							/>
						</view>
					</view>

					<!-- 底部安全区 -->
					<view class="safe-area-bottom"></view>
				</template>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger';
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import VehicleCard, { type VehicleCardData } from '@/components/business/vehicle/VehicleCard.vue'
import VehicleFilter from '@/components/business/vehicle/VehicleFilter.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import ErrorState from '@/components/base/ErrorState.vue'

// 页面状态
const loading = ref(false)
const error = ref(false)
const errorMessage = ref('')

// 搜索参数
const searchParams = ref<any>({});

// Mock数据 (保持不变)
const allVehicles = ref<VehicleCardData[]>([
	{
		id: '1',
		name: '上汽大通RG10 生活家V90',
		image: '/static/场景推荐2.jpg',
		type: 'C型',
		seats: 6,
		beds: 4,
		transmission: '自动挡',
		price: 680,
		tags: ['热门', '新车', '独立卫浴'],
		features: ['独立卫浴', 'KTV'],
		brand: '上汽大通',
		storeId: '401',
		storeName: '深圳宝安店',
	},
	{
		id: '2',
		name: '宇通B530 舒适版',
		image: '/static/优惠政策.jpg',
		type: 'B型',
		seats: 4,
		beds: 2,
		transmission: '自动挡',
		price: 520,
		tags: ['经济实惠', '好停车'],
		brand: '宇通',
		storeId: '401',
		storeName: '深圳宝安店',
	},
	{
		id: '3',
		name: '览众C7 经典版',
		image: '/static/场景推荐2.jpg',
		type: 'C型',
		seats: 6,
		beds: 4,
		transmission: '手动挡',
		price: 580,
		tags: ['皮卡底盘', '动力强'],
		brand: '览众',
		storeId: '402',
		storeName: '深圳南山店',
	},
	{
		id: '4',
		name: '上汽大通V90 商务版',
		image: '/static/优惠政策.jpg',
		type: 'B型',
		seats: 4,
		beds: 2,
		transmission: '自动挡',
		price: 480,
		tags: [],
		brand: '上汽大通',
		storeId: '402',
		storeName: '深圳南山店',
	}
]);

// 筛选条件
const filterConditions = ref({
	type: '',
	price: '',
	brand: ''
});

const sortOrder = ref<'default' | 'asc' | 'desc'>('default');

// 筛选后的车辆
const filteredVehicles = computed(() => {
	let result = [...allVehicles.value];

	// 车型筛选
	if (filterConditions.value.type) {
		result = result.filter(v => v.type === filterConditions.value.type);
	}

	// 价格筛选
	if (filterConditions.value.price) {
		const [min, max] = filterConditions.value.price.split('-').map(Number);
		result = result.filter(v => {
			const p = Number(v.price);
			return p >= min && p <= max;
		});
	}

	// 品牌筛选
	if (filterConditions.value.brand) {
		result = result.filter(v => v.brand === filterConditions.value.brand);
	}

	// 排序
	if (sortOrder.value === 'asc') {
		result.sort((a, b) => Number(a.price) - Number(b.price));
	} else if (sortOrder.value === 'desc') {
		result.sort((a, b) => Number(b.price) - Number(a.price));
	}

	return result;
});

// 按门店分组
const groupedVehicles = computed(() => {
	const groups: any[] = [];
	const storeMap = new Map();

	filteredVehicles.value.forEach((vehicle: any) => {
		if (!storeMap.has(vehicle.storeId)) {
			storeMap.set(vehicle.storeId, {
				storeId: vehicle.storeId,
				storeName: vehicle.storeName,
				vehicles: []
			});
			groups.push(storeMap.get(vehicle.storeId));
		}
		storeMap.get(vehicle.storeId).vehicles.push(vehicle);
	});

	return groups;
});

onLoad((options: any) => {
	searchParams.value = options || {};
	logger.debug('搜索参数:', searchParams.value);
	loadVehicles();
});

// 加载车辆数据
const loadVehicles = async () => {
	loading.value = true;
	error.value = false;

	try {
		// 模拟 API 调用延迟
		await new Promise(resolve => setTimeout(resolve, 800));

		// 实际项目中这里应该调用 API
		// const res = await api.getVehicles(searchParams.value);
		// allVehicles.value = res.data;

		// 使用 Mock 数据（已在上面定义）
		logger.debug('车辆数据加载成功');
	} catch (e: any) {
		error.value = true;
		errorMessage.value = e.message || '加载失败，请重试';
	} finally {
		loading.value = false;
	}
};

const handleFilter = (conditions: any) => {
	filterConditions.value = conditions;
};

const handleSort = (order: 'default' | 'asc' | 'desc') => {
	sortOrder.value = order;
};

const resetFilter = () => {
	filterConditions.value = { type: '', price: '', brand: '' };
	sortOrder.value = 'default';
};

const goToDetail = (vehicle: VehicleCardData) => {
	uni.navigateTo({
		url: `/pages/vehicle/detail?id=${vehicle.id}`
	});
};
</script>

<style scoped lang="scss">
.vehicle-list-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	display: flex;
	flex-direction: column;
}

.list-scroll {
	flex: 1;
	height: 0;
}

.list-container {
	padding: 24rpx 32rpx;
}

.store-group {
	margin-bottom: 48rpx;
}

.store-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0;
	margin-bottom: 16rpx;
	position: sticky;
	top: 0;
	background-color: $uni-bg-color;
	z-index: 10;
	opacity: 0.95;
}

.store-left {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.icon-box {
	width: 40rpx;
	height: 40rpx;
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	border-radius: 10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2rpx 8rpx rgba(255, 159, 41, 0.3);
}

.store-name {
	font-size: 32rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.vehicle-count {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
	background-color: #FFFFFF;
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
	box-shadow: $uni-shadow-sm;
}

.vehicle-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.safe-area-bottom {
	height: env(safe-area-inset-bottom);
}
</style>
