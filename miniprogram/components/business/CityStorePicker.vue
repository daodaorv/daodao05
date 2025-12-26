<template>
	<u-popup :show="show" @close="close" mode="bottom" :closeable="false" :z-index="10075" :safe-area-inset-bottom="true">
		<view class="picker-popup">
			<!-- 顶部标题栏 -->
			<view class="popup-header">
				<text class="popup-title">{{ title }}</text>
				<view class="close-btn" @tap="close">
					<u-icon name="close" size="24" color="#999"></u-icon>
				</view>
			</view>

			<!-- 搜索栏 (仅城市模式) -->
			<view v-if="type === 'city'" class="search-bar">
				<view class="search-input-box">
					<u-icon name="search" size="18" color="#999"></u-icon>
					<input
						class="search-input"
						type="text"
						v-model="searchText"
						placeholder="搜索城市"
						placeholder-class="placeholder"
					/>
					<u-icon v-if="searchText" name="close" size="18" color="#CCC" @tap="searchText = ''"></u-icon>
				</view>
			</view>

			<!-- 内容区域 -->
			<scroll-view scroll-y class="popup-content">
				<!-- 城市列表 -->
				<block v-if="type === 'city'">
					<!-- 热门城市 -->
					<view class="section" v-if="!searchText">
						<text class="section-title">热门城市</text>
						<view class="hot-cities">
							<view 
								v-for="city in hotCities" 
								:key="city.id" 
								class="hot-city-tag"
								@tap="selectItem(city)"
							>
								{{ city.name }}
							</view>
						</view>
					</view>

					<!-- 全部城市 -->
					<view class="section">
						<text class="section-title" v-if="!searchText">全部城市</text>
						<view class="city-list">
							<view 
								v-for="city in filteredCities" 
								:key="city.id" 
								class="list-item"
								@tap="selectItem(city)"
							>
								<text class="item-name">{{ city.name }}</text>
								<u-icon v-if="selectedId === city.id" name="checkbox-mark" size="20" color="#FF9F29"></u-icon>
							</view>
							<view v-if="filteredCities.length === 0" class="empty-tip">
								未找到相关城市
							</view>
						</view>
					</view>
				</block>

				<!-- 门店列表 -->
				<block v-else>
					<view class="store-list">
						<view
							v-for="store in safeData"
							:key="store.id"
							class="list-item"
							@tap="selectItem(store)"
						>
							<text class="item-name">{{ store.name }}</text>
							<u-icon v-if="selectedId === store.id" name="checkbox-mark" size="20" color="#FF9F29"></u-icon>
						</view>
						<view v-if="safeData.length === 0" class="empty-tip">
							该城市暂无门店
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</u-popup>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Item {
	id: string;
	name: string;
	[key: string]: any;
}

const props = defineProps<{
	type: 'city' | 'store';
	title: string;
	data?: Item[];
	selectedId?: string;
}>();

const emit = defineEmits(['confirm']);
const show = ref(false);
const searchText = ref('');

// 确保 data 始终是数组
const safeData = computed(() => {
	return Array.isArray(props.data) ? props.data : [];
});

// 模拟热门城市 (实际应从props或配置获取)
const hotCities = computed(() => {
	return safeData.value.filter(city => ['北京', '上海', '成都', '深圳', '广州', '杭州', '三亚', '西安', '重庆'].includes(city.name));
});

const filteredCities = computed(() => {
	if (!searchText.value) return safeData.value;
	return safeData.value.filter(city => city.name.includes(searchText.value));
});

const selectItem = (item: Item) => {
	emit('confirm', item);
	close();
};

const open = () => {
	searchText.value = '';
	show.value = true;
};

const close = () => {
	show.value = false;
};

defineExpose({ open, close });
</script>

<style scoped lang="scss">
.picker-popup {
	background-color: #FFFFFF;
	border-radius: 32rpx 32rpx 0 0;
	height: 70vh;
	display: flex;
	flex-direction: column;
	padding-bottom: env(safe-area-inset-bottom);
}

.popup-header {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 32rpx;
	position: relative;
	border-bottom: 1rpx solid #F5F5F5;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.close-btn {
	position: absolute;
	right: 32rpx;
	top: 50%;
	transform: translateY(-50%);
	padding: 10rpx;
}

.search-bar {
	padding: 20rpx 32rpx;
	background-color: #FFF;
}

.search-input-box {
	display: flex;
	align-items: center;
	gap: 16rpx;
	height: 72rpx;
	background-color: #F5F5F5;
	border-radius: 36rpx;
	padding: 0 24rpx;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.placeholder {
	color: #999;
}

.popup-content {
	flex: 1;
	height: 0;
}

.section {
	padding: 32rpx;
}

.section-title {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 24rpx;
	display: block;
}

.hot-cities {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.hot-city-tag {
	width: 160rpx;
	height: 64rpx;
	background-color: #F8F8F8;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #333;
	
	&:active {
		background-color: #F0F0F0;
	}
}

.list-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
	border-bottom: 1rpx solid #F5F5F5;
	
	&:last-child {
		border-bottom: none;
	}
	
	&:active {
		background-color: #F9F9F9;
	}
}

.item-name {
	font-size: 30rpx;
	color: #333;
}

.empty-tip {
	text-align: center;
	color: #999;
	font-size: 28rpx;
	padding: 60rpx 0;
}

.store-list {
	padding: 0 32rpx;
}
</style>
