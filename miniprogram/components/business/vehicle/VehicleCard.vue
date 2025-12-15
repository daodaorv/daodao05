<template>
	<view class="vehicle-card" @tap="handleClick">
		<!-- 大图展示区域 -->
		<view class="image-wrapper">
			<image class="vehicle-image" :src="displayImage" mode="aspectFill"></image>
			<!-- 收藏按钮 (悬浮) -->
			<view v-if="showFavoriteButton" class="favorite-btn" @tap.stop="handleFavorite">
				<u-icon 
					:name="favoritedState ? 'heart-fill' : 'heart'" 
					size="20" 
					:color="favoritedState ? '#FF4D4F' : '#FFFFFF'"
				></u-icon>
			</view>
			<!-- 品牌Logo/水印 (可选) -->
			<view v-if="data.brand" class="brand-tag">{{ data.brand }}</view>
		</view>

		<!-- 信息区域 -->
		<view class="card-body">
			<view class="header-row">
				<text class="title">{{ displayName }}</text>
				<view class="price-box">
					<text class="currency">¥</text>
					<text class="amount">{{ displayPrice }}</text>
					<text class="unit">/日</text>
				</view>
			</view>

			<!-- 标签行 -->
			<view class="tags-row">
				<view v-for="(tag, index) in displayTags" :key="index" class="tag-item">
					{{ tag }}
				</view>
			</view>

			<!-- 规格参数 (图标化) -->
			<view class="specs-row">
				<view class="spec-item">
					<u-icon name="car" size="14" color="#86909C"></u-icon>
					<text class="spec-text">{{ displayType }}</text>
				</view>
				<view class="spec-item">
					<u-icon name="account" size="14" color="#86909C"></u-icon>
					<text class="spec-text">{{ seatBedText }}</text>
				</view>
				<view class="spec-item">
					<u-icon name="setting" size="14" color="#86909C"></u-icon>
					<text class="spec-text">{{ displayTransmission }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface VehicleCardData {
	id: string
	name?: string
	image?: string
	images?: string[]
	type?: string
	seats?: number
	beds?: number
	transmission?: string
	price?: number | string
	tags?: string[]
	brand?: string
	// 兼容字段
	dailyPrice?: number | string
	pricePerDay?: number | string
	basePrice?: number | string
	specs?: any
	specifications?: any
	features?: string[]
}

const props = defineProps<{
	data: VehicleCardData
	favorited?: boolean
	showFavoriteButton?: boolean
}>()

const emit = defineEmits(['click', 'favorite-change'])

const favoritedState = ref(!!props.favorited)

watch(() => props.favorited, (val) => { favoritedState.value = !!val }, { immediate: true })

const showFavoriteButton = computed(() => props.showFavoriteButton !== false)

const displayImage = computed(() => props.data.image || props.data.images?.[0] || '/static/default-vehicle.png')
const displayName = computed(() => props.data.name || '房车')

const displayType = computed(() => props.data.type || '房车')
const seatCount = computed(() => props.data.seats ?? props.data.specs?.seats)
const bedCount = computed(() => props.data.beds ?? props.data.specs?.beds)

const seatBedText = computed(() => {
	const s = seatCount.value;
	const b = bedCount.value;
	if (s && b) return `${s}座${b}卧`;
	if (s) return `${s}座`;
	return '配置待确认';
})

const displayTransmission = computed(() => props.data.transmission || '自动/手动')

const displayPrice = computed(() => {
	const p = props.data.price || props.data.dailyPrice || props.data.pricePerDay;
	return Number(p).toFixed(0) || '--';
})

const displayTags = computed(() => {
	// 优先显示自定义标签，否则显示自动生成的标签
	if (props.data.tags && props.data.tags.length) return props.data.tags.slice(0, 3);
	const tags = [];
	if (props.data.brand) tags.push(props.data.brand);
	return tags;
})

const handleClick = () => emit('click', props.data)
const handleFavorite = () => {
	favoritedState.value = !favoritedState.value
	emit('favorite-change', favoritedState.value)
}
</script>

<style scoped lang="scss">
.vehicle-card {
	background-color: #FFFFFF;
	border-radius: $uni-radius-lg;
	overflow: hidden;
	box-shadow: $uni-shadow-card;
	margin-bottom: 32rpx;
	position: relative;
	
	&:active {
		transform: scale(0.99);
		box-shadow: $uni-shadow-sm;
	}
}

.image-wrapper {
	position: relative;
	width: 100%;
	height: 380rpx; // 16:9 略高
}

.vehicle-image {
	width: 100%;
	height: 100%;
	background-color: #F2F3F5;
}

.favorite-btn {
	position: absolute;
	top: 24rpx;
	right: 24rpx;
	width: 64rpx;
	height: 64rpx;
	background: rgba(0,0,0,0.3);
	backdrop-filter: blur(4px);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.brand-tag {
	position: absolute;
	bottom: 24rpx;
	left: 24rpx;
	background: rgba(0,0,0,0.6);
	color: #FFF;
	font-size: 20rpx;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
	backdrop-filter: blur(4px);
}

.card-body {
	padding: 24rpx 32rpx;
}

.header-row {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 16rpx;
}

.title {
	font-size: 34rpx;
	font-weight: bold;
	color: $uni-text-color;
	line-height: 1.4;
	flex: 1;
	margin-right: 16rpx;
}

.price-box {
	display: flex;
	align-items: baseline;
	color: $uni-color-error; // 价格醒目
	flex-shrink: 0;
}

.currency {
	font-size: 24rpx;
	font-weight: bold;
}

.amount {
	font-size: 40rpx;
	font-weight: bold;
	font-family: 'DIN Alternate', sans-serif;
	margin: 0 2rpx;
}

.unit {
	font-size: 22rpx;
	color: $uni-text-color-secondary;
}

.tags-row {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
	margin-bottom: 20rpx;
}

.tag-item {
	font-size: 20rpx;
	color: $uni-text-color-secondary;
	background-color: $uni-bg-color;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
}

.specs-row {
	display: flex;
	align-items: center;
	gap: 24rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid $uni-border-color-light;
}

.spec-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.spec-text {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
}
</style>