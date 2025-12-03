<template>
	<view class="vehicle-list-page">
		<!-- 筛选栏 -->
		<VehicleFilter @filter="handleFilter" @sort="handleSort" />

		<!-- 列表内容 -->
		<scroll-view scroll-y class="list-scroll">
			<view class="list-container">
				<!-- 按门店分组 -->
				<view v-for="(group, index) in groupedVehicles" :key="index" class="store-group">
					<view class="store-header">
						<u-icon name="shop-fill" size="18" color="#FF9F29"></u-icon>
						<text class="store-name">{{ group.storeName }}</text>
						<text class="vehicle-count">{{ group.vehicles.length }}辆可租</text>
					</view>
					
					<view class="vehicle-list">
						<VehicleCard 
							v-for="vehicle in group.vehicles" 
							:key="vehicle.id"
							:data="vehicle"
							@click="goToDetail"
						/>
					</view>
				</view>

				<!-- 空状态 -->
				<view v-if="groupedVehicles.length === 0" class="empty-state">
					<u-icon name="info-circle-fill" size="48" color="#CCC"></u-icon>
					<text class="empty-text">暂无符合条件的房车</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import VehicleCard, { type Vehicle } from '@/components/business/vehicle/VehicleCard.vue';
import VehicleFilter from '@/components/business/vehicle/VehicleFilter.vue';

// 搜索参数
const searchParams = ref<any>({});

// Mock数据
const allVehicles = ref<Vehicle[]>([
	{
		id: '1',
		name: '上汽大通RG10',
		image: '/static/场景推荐2.jpg',
		type: 'C型',
		seats: 6,
		beds: 4,
		transmission: '自动挡',
		price: 680,
		tags: ['热门', '新车'],
		storeId: '401',
		storeName: '深圳宝安店',
		brand: '上汽大通'
	},
	{
		id: '2',
		name: '宇通B530',
		image: '/static/优惠政策.jpg',
		type: 'B型',
		seats: 4,
		beds: 2,
		transmission: '自动挡',
		price: 520,
		tags: ['经济实惠'],
		storeId: '401',
		storeName: '深圳宝安店',
		brand: '宇通'
	},
	{
		id: '3',
		name: '览众C7',
		image: '/static/场景推荐2.jpg',
		type: 'C型',
		seats: 6,
		beds: 4,
		transmission: '手动挡',
		price: 580,
		tags: ['性价比高'],
		storeId: '402',
		storeName: '深圳南山店',
		brand: '览众'
	},
	{
		id: '4',
		name: '上汽大通V90',
		image: '/static/优惠政策.jpg',
		type: 'B型',
		seats: 4,
		beds: 2,
		transmission: '自动挡',
		price: 480,
		tags: [],
		storeId: '402',
		storeName: '深圳南山店',
		brand: '上汽大通'
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
		result = result.filter(v => v.price >= min && v.price <= max);
	}

	// 品牌筛选
	if (filterConditions.value.brand) {
		result = result.filter(v => v.brand === filterConditions.value.brand);
	}

	// 排序
	if (sortOrder.value === 'asc') {
		result.sort((a, b) => a.price - b.price);
	} else if (sortOrder.value === 'desc') {
		result.sort((a, b) => b.price - a.price);
	}

	return result;
});

// 按门店分组
const groupedVehicles = computed(() => {
	const groups: any[] = [];
	const storeMap = new Map();

	filteredVehicles.value.forEach(vehicle => {
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
	console.log('搜索参数:', searchParams.value);
});

const handleFilter = (conditions: any) => {
	filterConditions.value = conditions;
};

const handleSort = (order: 'default' | 'asc' | 'desc') => {
	sortOrder.value = order;
};

const goToDetail = (vehicle: Vehicle) => {
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
	margin-bottom: 40rpx;
}

.store-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	padding: 20rpx 0;
	margin-bottom: 20rpx;
	position: sticky;
	top: 0;
	background-color: $uni-bg-color;
	z-index: 10;
}

.store-name {
	font-size: 30rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.vehicle-count {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
	margin-left: auto;
	background-color: rgba(0, 0, 0, 0.05);
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
}

.vehicle-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 160rpx 0;
	gap: 32rpx;
}

.empty-text {
	font-size: 28rpx;
	color: $uni-text-color-secondary;
}
</style>
