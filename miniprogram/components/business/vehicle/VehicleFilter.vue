<template>
	<view class="vehicle-filter" :class="{ 'is-sticky': isSticky }">
		<!-- 顶部筛选栏 -->
		<view class="filter-bar">
			<view 
				v-for="(tab, index) in tabs" 
				:key="index"
				class="filter-tab"
				:class="{ active: activeTab === tab.key || hasValue(tab.key) }"
				@tap="handleTabClick(tab.key)"
			>
				<text>{{ getLabel(tab) }}</text>
				<u-icon 
					:name="activeTab === tab.key ? 'arrow-up-fill' : 'arrow-down-fill'" 
					size="10" 
					:color="activeTab === tab.key || hasValue(tab.key) ? '#FF9F29' : '#86909C'"
				></u-icon>
			</view>
			
			<!-- 排序独立按钮 -->
			<view class="filter-tab sort" @tap="toggleSort">
				<text :class="{ active: sortOrder !== 'default' }">排序</text>
				<view class="sort-icon-group">
					<u-icon name="arrow-up-fill" size="8" :color="sortOrder === 'asc' ? '#FF9F29' : '#CCC'"></u-icon>
					<u-icon name="arrow-down-fill" size="8" :color="sortOrder === 'desc' ? '#FF9F29' : '#CCC'"></u-icon>
				</view>
			</view>
		</view>

		<!-- 下拉面板 -->
		<u-popup :show="!!activeTab" @close="closePopup" mode="top" :safeAreaInsetTop="true" customStyle="top: 88rpx">
			<view class="popup-content">
				<view class="options-grid">
					<view 
						v-for="(opt, idx) in currentOptions" 
						:key="idx"
						class="option-chip"
						:class="{ selected: isSelected(opt.value) }"
						@tap="selectOption(opt.value)"
					>
						{{ opt.label }}
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const emit = defineEmits(['filter', 'sort']);

const isSticky = ref(false); // 可以通过页面滚动监听来改变样式
const activeTab = ref('');
const sortOrder = ref('default');

const tabs = [
	{ key: 'type', label: '车型', default: '车型' },
	{ key: 'price', label: '价格', default: '价格' },
	{ key: 'brand', label: '品牌', default: '品牌' }
];

const optionsMap: any = {
	type: [
		{ label: '不限', value: '' },
		{ label: 'C型房车', value: 'C型' },
		{ label: 'B型房车', value: 'B型' },
		{ label: '拖挂房车', value: '拖挂' },
		{ label: '皮卡房车', value: '皮卡' }
	],
	price: [
		{ label: '不限', value: '' },
		{ label: '¥500以下', value: '0-500' },
		{ label: '¥500-1000', value: '500-1000' },
		{ label: '¥1000以上', value: '1000-9999' }
	],
	brand: [
		{ label: '不限', value: '' },
		{ label: '上汽大通', value: '上汽大通' },
		{ label: '宇通房车', value: '宇通' },
		{ label: '览众房车', value: '览众' }
	]
};

const filters = ref<any>({
	type: '',
	price: '',
	brand: ''
});

const currentOptions = computed(() => {
	return optionsMap[activeTab.value] || [];
});

const hasValue = (key: string) => !!filters.value[key];

const getLabel = (tab: any) => {
	const val = filters.value[tab.key];
	if (!val) return tab.default;
	// 查找 label
	const opt = optionsMap[tab.key].find((o: any) => o.value === val);
	return opt ? opt.label : tab.default;
};

const isSelected = (val: string) => {
	return filters.value[activeTab.value] === val;
};

const handleTabClick = (key: string) => {
	if (activeTab.value === key) {
		activeTab.value = '';
	} else {
		activeTab.value = key;
	}
};

const closePopup = () => {
	activeTab.value = '';
};

const selectOption = (val: string) => {
	filters.value[activeTab.value] = val;
	emit('filter', { ...filters.value });
	closePopup();
};

const toggleSort = () => {
	if (sortOrder.value === 'default') sortOrder.value = 'asc';
	else if (sortOrder.value === 'asc') sortOrder.value = 'desc';
	else sortOrder.value = 'default';
	emit('sort', sortOrder.value);
};

</script>

<style scoped lang="scss">
.vehicle-filter {
	background-color: #FFFFFF;
	position: sticky;
	top: 0;
	z-index: 99;
	transition: box-shadow 0.3s;
	
	&.is-sticky {
		box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
	}
}

.filter-bar {
	display: flex;
	height: 88rpx;
	align-items: center;
	padding: 0 24rpx;
}

.filter-tab {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	font-size: 28rpx;
	color: #333;
	transition: all 0.2s;
	
	&.active {
		color: $uni-color-primary;
		font-weight: 600;
	}
	
	&.sort {
		flex: 0 0 120rpx;
		border-left: 1rpx solid #F2F3F5;
		height: 40rpx;
	}
}

.sort-icon-group {
	display: flex;
	flex-direction: column;
	gap: 2rpx;
}

.popup-content {
	background-color: #FFFFFF;
	padding: 32rpx;
	border-radius: 0 0 24rpx 24rpx;
	box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.05);
}

.options-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 24rpx;
}

.option-chip {
	padding: 16rpx 32rpx;
	background-color: #F7F8FA;
	border-radius: 8rpx;
	font-size: 26rpx;
	color: #333;
	border: 2rpx solid transparent;
	
	&.selected {
		background-color: rgba(255, 159, 41, 0.08);
		color: $uni-color-primary;
		border-color: $uni-color-primary;
		font-weight: bold;
	}
}
</style>