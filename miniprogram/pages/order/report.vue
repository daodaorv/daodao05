<template>
	<view class="report-page">
		<view class="form-section">
			<view class="section-title">申报类型</view>
			<view class="type-options">
				<view 
					class="type-item" 
					:class="{ active: reportType === 'accident' }"
					@tap="reportType = 'accident'"
				>
					<u-icon name="info-circle-fill" size="24" :color="reportType === 'accident' ? '#FF4D4F' : '#999'"></u-icon>
					<text>交通事故</text>
				</view>
				<view 
					class="type-item" 
					:class="{ active: reportType === 'breakdown' }"
					@tap="reportType = 'breakdown'"
				>
					<u-icon name="setting-fill" size="24" :color="reportType === 'breakdown' ? '#FF9F29' : '#999'"></u-icon>
					<text>车辆故障</text>
				</view>
			</view>
		</view>

		<view class="form-section">
			<view class="section-title">情况描述</view>
			<uni-easyinput 
				name="textarea" 
				v-model="description" 
				placeholder="请详细描述发生的情况..." 
				:maxlength="200"
				autoHeight
			></uni-easyinput>
		</view>

		<view class="form-section">
			<view class="section-title">现场照片</view>
			<uni-file-picker 
				v-model="imageValue" 
				fileMedianame="image" 
				mode="grid" 
				:limit="9"
				title="最多上传9张照片"
			></uni-file-picker>
		</view>

		<view class="form-section">
			<view class="section-title">联系信息</view>
			<uni-easyinput 
				v-model="contactPhone" 
				placeholder="请输入联系电话" 
				name="number"
			></uni-easyinput>
		</view>

		<view class="form-section">
			<view class="section-title">当前位置</view>
			<view class="location-box" @tap="chooseLocation">
				<view class="location-info">
					<u-icon name="location-fill" size="20" color="#FF9F29"></u-icon>
					<text class="address">{{ currentAddress || '点击获取当前位置' }}</text>
				</view>
				<u-icon name="right" size="16" color="#999"></u-icon>
			</view>
		</view>

		<view class="submit-section">
			<button class="btn-submit" @tap="submitReport">提交申报</button>
			<view class="tips">
				<u-icon name="info" size="14" color="#999"></u-icon>
				<text>提交后，我们的客服人员将尽快与您联系</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const reportType = ref('accident'); // accident, breakdown
const description = ref('');
const imageValue = ref([]);
const contactPhone = ref('');
const currentAddress = ref('');
const currentLocation = ref({ latitude: 0, longitude: 0 });

const chooseLocation = () => {
	uni.chooseLocation({
		success: (res) => {
			currentAddress.value = res.address;
			currentLocation.value = {
				latitude: res.latitude,
				longitude: res.longitude
			};
		},
		fail: (err) => {
			console.error('选择位置失败', err);
			// 如果选择失败，尝试获取当前位置
			uni.getLocation({
				type: 'gcj02',
				success: (res) => {
					currentLocation.value = {
						latitude: res.latitude,
						longitude: res.longitude
					};
					currentAddress.value = '已获取当前位置坐标';
				}
			});
		}
	});
};

const submitReport = () => {
	if (!description.value) {
		uni.showToast({ title: '请填写情况描述', icon: 'none' });
		return;
	}
	if (!contactPhone.value) {
		uni.showToast({ title: '请填写联系电话', icon: 'none' });
		return;
	}

	uni.showLoading({ title: '提交中...' });
	
	// 模拟提交
	setTimeout(() => {
		uni.hideLoading();
		uni.showModal({
			title: '申报提交成功',
			content: '我们要收到您的申报，客服人员将尽快与您联系处理。请保持电话畅通。',
			showCancel: false,
			success: () => {
				uni.navigateBack();
			}
		});
	}, 1500);
};
</script>

<style scoped lang="scss">
.report-page {
	min-height: 100vh;
	background-color: #F8F8F8;
	padding: 20rpx;
	padding-bottom: 120rpx;
}

.form-section {
	background-color: #FFFFFF;
	border-radius: 12rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 24rpx;
	border-left: 6rpx solid #FF9F29;
	padding-left: 16rpx;
}

.type-options {
	display: flex;
	gap: 30rpx;
}

.type-item {
	flex: 1;
	height: 160rpx;
	background-color: #F9F9F9;
	border: 2rpx solid #EEE;
	border-radius: 12rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 16rpx;
	transition: all 0.3s;
	
	&.active {
		background-color: #FFF9F0;
		border-color: #FF9F29;
		
		text {
			color: #FF9F29;
			font-weight: bold;
		}
	}
	
	text {
		font-size: 28rpx;
		color: #666;
	}
}

.location-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx;
	background-color: #F9F9F9;
	border-radius: 8rpx;
}

.location-info {
	display: flex;
	align-items: center;
	gap: 12rpx;
	flex: 1;
}

.address {
	font-size: 28rpx;
	color: #333;
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.submit-section {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx 32rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	background-color: #FFFFFF;
	box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.04);
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.btn-submit {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: bold;
	border-radius: 44rpx;
	margin: 0;
	
	&::after {
		border: none;
	}
}

.tips {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	
	text {
		font-size: 24rpx;
		color: #999;
	}
}
</style>
