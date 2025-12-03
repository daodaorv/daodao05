<template>
	<view class="vehicle-filter">
		<!-- 顶部筛选栏 -->
		<view class="filter-bar">
			<view 
				class="filter-item" 
				:class="{ active: activeFilter === 'type' }"
				@tap="toggleFilter('type')"
			>
				<text>车型</text>
				<u-icon :name="activeFilter === 'type' ? 'arrow-up' : 'arrow-down'" size="12" :color="activeFilter === 'type' ? '#FF9F29' : '#333'"></u-icon>
			</view>
			<view
				class="filter-item"
				:class="{ active: activeFilter === 'price' }"
				@tap="toggleFilter('price')"
			>
				<text>价格</text>
				<u-icon :name="activeFilter === 'price' ? 'arrow-up' : 'arrow-down'" size="12" :color="activeFilter === 'price' ? '#FF9F29' : '#333'"></u-icon>
			</view>
			<view
				class="filter-item"
				:class="{ active: activeFilter === 'brand' }"
				@tap="toggleFilter('brand')"
			>
				<text>品牌</text>
				<u-icon :name="activeFilter === 'brand' ? 'arrow-up' : 'arrow-down'" size="12" :color="activeFilter === 'brand' ? '#FF9F29' : '#333'"></u-icon>
			</view>
			<view 
				class="filter-item" 
				:class="{ active: sortOrder !== 'default' }"
				@tap="toggleSort"
			>
				<text>排序</text>
				<view class="sort-icons">
					<u-icon name="arrow-up" size="10" :color="sortOrder === 'asc' ? '#FF9F29' : '#CCC'"></u-icon>
					<u-icon name="arrow-down" size="10" :color="sortOrder === 'desc' ? '#FF9F29' : '#CCC'"></u-icon>
				</view>
			</view>
		</view>

		<!-- 筛选弹窗 -->
		<u-popup v-model="showPopup" mode="top" @close="onPopupClose">
			<view class="filter-popup-content">
				<!-- 车型筛选 -->
				<view v-if="activeFilter === 'type'" class="filter-options">
					<view 
						v-for="(type, index) in typeOptions" 
						:key="index"
						class="option-item"
						:class="{ selected: selectedType === type.value }"
						@tap="selectType(type.value)"
					>
						{{ type.label }}
						<u-icon v-if="selectedType === type.value" name="checkbox-mark" size="16" color="#FF9F29"></u-icon>
					</view>
				</view>

				<!-- 价格筛选 -->
				<view v-if="activeFilter === 'price'" class="filter-options">
					<view 
						v-for="(price, index) in priceOptions" 
						:key="index"
						class="option-item"
						:class="{ selected: selectedPrice === price.value }"
						@tap="selectPrice(price.value)"
					>
						{{ price.label }}
						<u-icon v-if="selectedPrice === price.value" name="checkbox-mark" size="16" color="#FF9F29"></u-icon>
					</view>
				</view>

				<!-- 品牌筛选 -->
				<view v-if="activeFilter === 'brand'" class="filter-options">
					<view 
						v-for="(brand, index) in brandOptions" 
						:key="index"
						class="option-item"
						:class="{ selected: selectedBrand === brand.value }"
						@tap="selectBrand(brand.value)"
					>
						{{ brand.label }}
						<u-icon v-if="selectedBrand === brand.value" name="checkbox-mark" size="16" color="#FF9F29"></u-icon>
					</view>
				</view>
			</view>
			<!-- 遮罩层点击关闭由 u-popup 处理 -->
		</u-popup>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['filter', 'sort']);

// 状态
const activeFilter = ref('');
const showPopup = ref(false);
const sortOrder = ref<'default' | 'asc' | 'desc'>('default');

// 筛选选项
const typeOptions = [
	{ label: '不限', value: '' },
	{ label: 'C型房车', value: 'C型' },
	{ label: 'B型房车', value: 'B型' },
	{ label: '拖挂房车', value: '拖挂' }
];

const priceOptions = [
	{ label: '不限', value: '' },
	{ label: '500以下', value: '0-500' },
	{ label: '500-1000', value: '500-1000' },
	{ label: '1000以上', value: '1000-9999' }
];

const brandOptions = [
	{ label: '不限', value: '' },
	{ label: '上汽大通', value: '上汽大通' },
	{ label: '宇通房车', value: '宇通' },
	{ label: '览众房车', value: '览众' }
];

// 选中值
const selectedType = ref('');
const selectedPrice = ref('');
const selectedBrand = ref('');

// 方法
const toggleFilter = (filter: string) => {
	if (activeFilter.value === filter) {
		closePopup();
	} else {
		activeFilter.value = filter;
		showPopup.value = true;
	}
};

const closePopup = () => {
	activeFilter.value = '';
	showPopup.value = false;
};

const onPopupClose = () => {
	activeFilter.value = '';
};

const selectType = (value: string) => {
	selectedType.value = value;
	emitFilter();
	closePopup();
};

const selectPrice = (value: string) => {
	selectedPrice.value = value;
	emitFilter();
	closePopup();
};

const selectBrand = (value: string) => {
	selectedBrand.value = value;
	emitFilter();
	closePopup();
};

const toggleSort = () => {
	if (sortOrder.value === 'default') sortOrder.value = 'asc';
	else if (sortOrder.value === 'asc') sortOrder.value = 'desc';
	else sortOrder.value = 'default';
	
	emit('sort', sortOrder.value);
};

const emitFilter = () => {
	emit('filter', {
		type: selectedType.value,
		price: selectedPrice.value,
		brand: selectedBrand.value
	});
};
</script>

<style scoped lang="scss">
.vehicle-filter {
	position: sticky;
	top: 0;
	z-index: 100;
	background-color: #FFFFFF;
}

.filter-bar {
	display: flex;
	height: 88rpx;
	border-bottom: 1rpx solid #F5F5F5;
}

.filter-item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	color: #333;
	gap: 8rpx;
	
	&.active {
		color: $uni-color-primary;
		font-weight: bold;
	}
}

.sort-icons {
	display: flex;
	flex-direction: column;
	gap: -4rpx;
}

.filter-popup-content {
	background-color: #FFFFFF;
	padding: 0 32rpx;
	border-radius: 0 0 24rpx 24rpx;
}

.option-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
	border-bottom: 1rpx solid #F5F5F5;
	font-size: 28rpx;
	color: #333;
	
	&:last-child {
		border-bottom: none;
	}
	
	&.selected {
		color: $uni-color-primary;
		font-weight: bold;
	}
}
</style>
