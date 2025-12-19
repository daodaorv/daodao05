<template>
	<view class="edit-profile-page">
		<view class="form-list">
			<!-- 头像 -->
			<view class="form-item avatar-item" @tap="chooseAvatar">
				<text class="label">头像</text>
				<view class="right-content">
					<image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
					<u-icon name="arrow-right" size="14" color="#CCC"></u-icon>
				</view>
			</view>
			
			<!-- 昵称 -->
			<view class="form-item">
				<text class="label">昵称</text>
				<input 
					class="input" 
					name="text" 
					v-model="userInfo.nickname" 
					placeholder="请输入昵称" 
					placeholder-class="placeholder"
				/>
			</view>
			
			<!-- 性别 -->
			<view class="form-item">
				<text class="label">性别</text>
				<picker 
					class="picker-box" 
					:range="genderOptions" 
					:value="genderIndex" 
					@change="onGenderChange"
				>
					<view class="picker-value">
						<text v-if="userInfo.gender">{{ userInfo.gender }}</text>
						<text v-else class="placeholder">请选择性别</text>
						<u-icon name="arrow-right" size="14" color="#CCC"></u-icon>
					</view>
				</picker>
			</view>
			
			<!-- 手机号 -->
			<view class="form-item">
				<text class="label">手机号</text>
				<view class="right-content">
					<text class="value">{{ userInfo.mobile || '未绑定' }}</text>
					<u-icon name="arrow-right" size="14" color="#CCC"></u-icon>
				</view>
			</view>
			
			<!-- 生日 -->
			<view class="form-item">
				<text class="label">生日</text>
				<picker 
					class="picker-box" 
					mode="date" 
					:value="userInfo.birthday" 
					@change="onBirthdayChange"
				>
					<view class="picker-value">
						<text v-if="userInfo.birthday">{{ userInfo.birthday }}</text>
						<text v-else class="placeholder">请选择生日</text>
						<u-icon name="arrow-right" size="14" color="#CCC"></u-icon>
					</view>
				</picker>
			</view>
		</view>
		
		<view class="btn-box">
			<button class="save-btn" @tap="handleSave" :loading="saving">保存</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const saving = ref(false);
const genderOptions = ['男', '女', '保密'];

const userInfo = ref({
	avatar: '/static/avatar.png',
	nickname: '房车旅行家',
	gender: '男',
	mobile: '138****8888',
	birthday: '1990-01-01'
});

const genderIndex = computed(() => {
	const index = genderOptions.indexOf(userInfo.value.gender);
	return index >= 0 ? index : 0;
});

const chooseAvatar = () => {
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			// 模拟上传
			uni.showLoading({ title: '上传中...' });
			setTimeout(() => {
				userInfo.value.avatar = res.tempFilePaths[0];
				uni.hideLoading();
				uni.showToast({ title: '上传成功', icon: 'none' });
			}, 1000);
		}
	});
};

const onGenderChange = (e: any) => {
	userInfo.value.gender = genderOptions[e.detail.value];
};

const onBirthdayChange = (e: any) => {
	userInfo.value.birthday = e.detail.value;
};

const handleSave = () => {
	if (!userInfo.value.nickname.trim()) {
		uni.showToast({ title: '请输入昵称', icon: 'none' });
		return;
	}
	
	saving.value = true;
	// 模拟保存接口
	setTimeout(() => {
		saving.value = false;
		uni.showToast({ title: '保存成功', icon: 'success' });
		setTimeout(() => {
			uni.navigateBack();
		}, 1500);
	}, 1000);
};

onLoad(() => {
	// Mock实现 - 待后端API开发
});
</script>

<style scoped lang="scss">
.edit-profile-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	padding-top: 20rpx;
}

.form-list {
	background-color: #FFFFFF;
	padding: 0 $uni-spacing-lg;
}

.form-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: $uni-spacing-lg 0;
	border-bottom: 1rpx solid $uni-border-color-light;

	&:last-child {
		border-bottom: none;
	}

	&.avatar-item {
		padding: 20rpx 0;
	}
}

.label {
	font-size: 30rpx;
	color: $uni-text-color;
	width: 160rpx;
}

.right-content {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: $uni-spacing-xs;
}

.avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background-color: $uni-bg-color;
}

.input {
	flex: 1;
	text-align: right;
	font-size: 30rpx;
	color: $uni-text-color;
}

.picker-box {
	flex: 1;
}

.picker-value {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: $uni-spacing-xs;
	font-size: 30rpx;
	color: $uni-text-color;
}

.placeholder {
	color: $uni-text-color-placeholder;
}

.value {
	font-size: 30rpx;
	color: $uni-text-color-placeholder;
}

.btn-box {
	margin: 60rpx $uni-spacing-lg;
}

.save-btn {
	background: $uni-color-primary-gradient;
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: bold;
	border-radius: $uni-radius-btn;
	transition: all 0.3s ease;

	&:active {
		opacity: 0.8;
		transform: scale(0.98);
	}

	&::after {
		border: none;
	}
}
</style>
