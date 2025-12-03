<template>
	<view class="invite-center">
		<!-- 邀请统计卡片 -->
		<view class="stats-card">
			<view class="card-header">
				<text class="header-title">我的邀请</text>
				<text class="header-subtitle">邀请好友，双方都得优惠券</text>
			</view>
			<view class="stats-grid">
				<view class="stat-item">
					<text class="stat-value">{{ stats.totalInvites }}</text>
					<text class="stat-label">累计邀请</text>
				</view>
				<view class="stat-item">
					<text class="stat-value">{{ stats.successfulRegistrations }}</text>
					<text class="stat-label">成功注册</text>
				</view>
				<view class="stat-item">
					<text class="stat-value">{{ stats.completedFirstOrders }}</text>
					<text class="stat-label">完成首单</text>
				</view>
				<view class="stat-item">
					<text class="stat-value">{{ stats.totalRewards }}</text>
					<text class="stat-label">累计奖励</text>
				</view>
			</view>
		</view>

		<!-- 邀请方式 -->
		<view class="invite-methods">
			<view class="section-title">
				<u-icon name="gift" size="20" color="#FF9F29"></u-icon>
				<text class="title-text">邀请方式</text>
			</view>

			<!-- 邀请码 -->
			<view class="invite-code-card">
				<view class="code-left">
					<text class="code-label">我的邀请码</text>
					<text class="code-value">{{ inviteCode }}</text>
				</view>
				<view class="code-right">
					<button class="copy-btn" @tap="copyInviteCode">
						<u-icon name="copy" size="16" color="#FF9F29"></u-icon>
						<text class="btn-text">复制</text>
					</button>
				</view>
			</view>

			<!-- 分享按钮 -->
			<view class="share-buttons">
				<button class="share-btn primary" @tap="generatePoster">
					<u-icon name="image" size="20" color="#FFFFFF"></u-icon>
					<text class="btn-text">生成邀请海报</text>
				</button>
				<button class="share-btn" @tap="shareToWechat">
					<u-icon name="chat" size="20" color="#FF9F29"></u-icon>
					<text class="btn-text">分享给好友</text>
				</button>
			</view>
		</view>

		<!-- 奖励规则 -->
		<view class="reward-rules">
			<view class="section-title">
				<u-icon name="help" size="20" color="#FF9F29"></u-icon>
				<text class="title-text">奖励规则</text>
			</view>
			<view class="rules-content">
				<view class="rule-item" v-for="(rule, index) in rewardRules" :key="index">
					<view class="rule-icon">
						<text class="icon-number">{{ index + 1 }}</text>
					</view>
					<view class="rule-text">
						<text class="rule-title">{{ rule.title }}</text>
						<text class="rule-desc">{{ rule.description }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 邀请记录 -->
		<view class="invite-records">
			<view class="section-title">
				<u-icon name="list" size="20" color="#FF9F29"></u-icon>
				<text class="title-text">邀请记录</text>
			</view>

			<view v-if="inviteRecords.length === 0" class="empty-state">
				<u-icon name="person" size="80" color="#CCCCCC"></u-icon>
				<text class="empty-text">暂无邀请记录</text>
				<text class="empty-hint">快去邀请好友吧</text>
			</view>

			<view v-else class="records-list">
				<view class="record-item" v-for="record in inviteRecords" :key="record.id">
					<view class="record-left">
						<view class="user-avatar">
							<image v-if="record.avatar" :src="record.avatar" mode="aspectFill"></image>
							<u-icon v-else name="person" size="24" color="#999"></u-icon>
						</view>
						<view class="user-info">
							<text class="user-name">{{ maskUsername(record.username) }}</text>
							<text class="register-time">{{ formatDate(record.registerTime) }}</text>
						</view>
					</view>
					<view class="record-right">
						<view class="status-badge" :class="getStatusClass(record.status)">
							<text class="status-text">{{ getStatusText(record.status) }}</text>
						</view>
						<view class="reward-info" v-if="record.rewardStatus === 'granted'">
							<u-icon name="checkbox-mark" size="14" color="#52C41A"></u-icon>
							<text class="reward-text">已发放</text>
						</view>
						<view class="reward-info pending" v-else-if="record.rewardStatus === 'pending'">
							<u-icon name="clock" size="14" color="#FF9F29"></u-icon>
							<text class="reward-text">待发放</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 邀请海报弹窗 -->
		<uni-popup ref="posterPopup" name="center">
			<view class="poster-dialog">
				<view class="poster-header">
					<text class="poster-title">邀请海报</text>
					<view class="close-btn" @tap="closePoster">
						<u-icon name="close" size="24" color="#999"></u-icon>
					</view>
				</view>
				<view class="poster-content">
					<view class="poster-preview">
						<image src="/static/invite-poster.jpg" mode="aspectFit" class="poster-image"></image>
						<view class="poster-code">
							<text class="code-text">邀请码：{{ inviteCode }}</text>
						</view>
					</view>
				</view>
				<view class="poster-actions">
					<button class="action-btn" @tap="savePoster">
						<u-icon name="download" size="18" color="#FFFFFF"></u-icon>
						<text class="btn-text">保存到相册</text>
					</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 类型定义
interface Stats {
	totalInvites: number;
	successfulRegistrations: number;
	completedFirstOrders: number;
	totalRewards: number;
}

interface RewardRule {
	title: string;
	description: string;
}

interface InviteRecord {
	id: string;
	username: string;
	avatar?: string;
	registerTime: string;
	status: 'registered' | 'first_order_completed';
	rewardStatus: 'pending' | 'granted';
}

// 响应式数据
const inviteCode = ref('DAODAO2025');
const posterPopup = ref(null);

// 邀请统计
const stats = ref<Stats>({
	totalInvites: 12,
	successfulRegistrations: 8,
	completedFirstOrders: 5,
	totalRewards: 15
});

// 奖励规则
const rewardRules = ref<RewardRule[]>([
	{
		title: '好友注册成功',
		description: '好友通过您的邀请码注册成功后，您将获得新人专享券1张'
	},
	{
		title: '好友完成首单',
		description: '好友完成首次订单并支付成功后，您将获得多张优惠券奖励（满减券、折扣券等）'
	},
	{
		title: '好友也有奖励',
		description: '被邀请的好友注册成功后也将获得新人专享券包，双方都有优惠'
	},
	{
		title: '奖励自动发放',
		description: '奖励将在好友完成相应操作后自动发放到"我的优惠券"，无需手动领取'
	},
	{
		title: '无邀请上限',
		description: '邀请人数和奖励次数无上限，邀请越多，奖励越多'
	}
]);

// 邀请记录
const inviteRecords = ref<InviteRecord[]>([
	{
		id: '1',
		username: '张三',
		avatar: '',
		registerTime: '2025-11-28 10:30:00',
		status: 'first_order_completed',
		rewardStatus: 'granted'
	},
	{
		id: '2',
		username: '李四',
		avatar: '',
		registerTime: '2025-11-27 15:20:00',
		status: 'first_order_completed',
		rewardStatus: 'granted'
	},
	{
		id: '3',
		username: '王五',
		avatar: '',
		registerTime: '2025-11-26 09:15:00',
		status: 'registered',
		rewardStatus: 'granted'
	},
	{
		id: '4',
		username: '赵六',
		avatar: '',
		registerTime: '2025-11-25 14:45:00',
		status: 'first_order_completed',
		rewardStatus: 'granted'
	},
	{
		id: '5',
		username: '孙七',
		avatar: '',
		registerTime: '2025-11-24 11:00:00',
		status: 'registered',
		rewardStatus: 'granted'
	}
]);

// 方法
const maskUsername = (username: string) => {
	if (username.length <= 2) {
		return username[0] + '*';
	}
	return username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
};

const formatDate = (dateStr: string) => {
	const date = new Date(dateStr);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const getStatusClass = (status: string) => {
	return status === 'first_order_completed' ? 'completed' : 'registered';
};

const getStatusText = (status: string) => {
	return status === 'first_order_completed' ? '已完成首单' : '已注册';
};

const copyInviteCode = () => {
	uni.setClipboardData({
		data: inviteCode.value,
		success: () => {
			uni.showToast({
				title: '邀请码已复制',
				icon: 'success'
			});
		}
	});
};

const generatePoster = () => {
	posterPopup.value?.open();
};

const closePoster = () => {
	posterPopup.value?.close();
};

const savePoster = () => {
	uni.showLoading({
		title: '保存中...'
	});

	// TODO: 实际保存海报到相册
	setTimeout(() => {
		uni.hideLoading();
		uni.showToast({
			title: '保存成功',
			icon: 'success'
		});
		closePoster();
	}, 1000);
};

const shareToWechat = () => {
	uni.showActionSheet({
		itemList: ['分享给微信好友', '分享到微信群'],
		success: (res) => {
			if (res.tapIndex === 0) {
				uni.showToast({
					title: '分享给微信好友',
					icon: 'none'
				});
			} else if (res.tapIndex === 1) {
				uni.showToast({
					title: '分享到微信群',
					icon: 'none'
				});
			}
		}
	});
};

// 生命周期
onMounted(() => {
	// 加载邀请数据
	// TODO: 调用API加载真实数据
});
</script>

<style scoped lang="scss">
.invite-center {
	min-height: 100vh;
	background-color: #F5F5F5;
	padding-bottom: 24rpx;
}

// 统计卡片
.stats-card {
	margin: 24rpx;
	padding: 32rpx;
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	border-radius: 24rpx;
	box-shadow: 0 8rpx 24rpx rgba(255, 159, 41, 0.3);
}

.card-header {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	margin-bottom: 32rpx;
}

.header-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #FFFFFF;
}

.header-subtitle {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.9);
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 24rpx;
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
}

.stat-value {
	font-size: 48rpx;
	font-weight: bold;
	color: #FFFFFF;
}

.stat-label {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.9);
}

// 邀请方式
.invite-methods {
	margin: 0 24rpx 24rpx;
	padding: 32rpx;
	background-color: #FFFFFF;
	border-radius: 24rpx;
}

.section-title {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 24rpx;
}

.title-text {
	font-size: 32rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.invite-code-card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx;
	background-color: #F5F5F5;
	border-radius: 16rpx;
	margin-bottom: 24rpx;
}

.code-left {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.code-label {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
}

.code-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #FF9F29;
	letter-spacing: 4rpx;
}

.code-right {
	flex-shrink: 0;
}

.copy-btn {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 16rpx 24rpx;
	background-color: #FFFFFF;
	border: 2rpx solid #FF9F29;
	border-radius: 48rpx;
	font-size: 26rpx;
	color: #FF9F29;

	&::after {
		border: none;
	}
}

.share-buttons {
	display: flex;
	gap: 16rpx;
}

.share-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	padding: 24rpx;
	background-color: #F5F5F5;
	border: none;
	border-radius: 16rpx;
	font-size: 28rpx;
	color: #FF9F29;

	&.primary {
		background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
		color: #FFFFFF;
	}

	&::after {
		border: none;
	}
}

.btn-text {
	color: inherit;
}

// 奖励规则
.reward-rules {
	margin: 0 24rpx 24rpx;
	padding: 32rpx;
	background-color: #FFFFFF;
	border-radius: 24rpx;
}

.rules-content {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.rule-item {
	display: flex;
	gap: 16rpx;
}

.rule-icon {
	flex-shrink: 0;
	width: 48rpx;
	height: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #FF9F29;
	border-radius: 50%;
}

.icon-number {
	font-size: 24rpx;
	font-weight: bold;
	color: #FFFFFF;
}

.rule-text {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.rule-title {
	font-size: 28rpx;
	font-weight: 500;
	color: $uni-text-color;
}

.rule-desc {
	font-size: 26rpx;
	color: $uni-text-color-secondary;
	line-height: 1.6;
}

// 邀请记录
.invite-records {
	margin: 0 24rpx 24rpx;
	padding: 32rpx;
	background-color: #FFFFFF;
	border-radius: 24rpx;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80rpx 0;
	gap: 16rpx;
}

.empty-text {
	font-size: 28rpx;
	color: $uni-text-color-secondary;
}

.empty-hint {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
}

.records-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.record-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx;
	background-color: #F5F5F5;
	border-radius: 16rpx;
}

.record-left {
	display: flex;
	align-items: center;
	gap: 16rpx;
	flex: 1;
}

.user-avatar {
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #E0E0E0;
	border-radius: 50%;
	overflow: hidden;

	image {
		width: 100%;
		height: 100%;
	}
}

.user-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.user-name {
	font-size: 28rpx;
	font-weight: 500;
	color: $uni-text-color;
}

.register-time {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
}

.record-right {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 8rpx;
}

.status-badge {
	padding: 8rpx 16rpx;
	border-radius: 24rpx;
	font-size: 22rpx;

	&.registered {
		background-color: rgba(255, 159, 41, 0.1);
		color: #FF9F29;
	}

	&.completed {
		background-color: rgba(82, 196, 26, 0.1);
		color: #52C41A;
	}
}

.status-text {
	color: inherit;
}

.reward-info {
	display: flex;
	align-items: center;
	gap: 4rpx;
	font-size: 22rpx;
	color: #52C41A;

	&.pending {
		color: #FF9F29;
	}
}

.reward-text {
	color: inherit;
}

// 海报弹窗
.poster-dialog {
	width: 600rpx;
	background-color: #FFFFFF;
	border-radius: 24rpx;
	overflow: hidden;
}

.poster-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx;
	border-bottom: 1rpx solid #F0F0F0;
}

.poster-title {
	font-size: 32rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.close-btn {
	padding: 8rpx;
}

.poster-content {
	padding: 32rpx;
}

.poster-preview {
	position: relative;
	width: 100%;
	aspect-ratio: 3/4;
	background-color: #F5F5F5;
	border-radius: 16rpx;
	overflow: hidden;
}

.poster-image {
	width: 100%;
	height: 100%;
}

.poster-code {
	position: absolute;
	bottom: 32rpx;
	left: 50%;
	transform: translateX(-50%);
	padding: 16rpx 32rpx;
	background-color: rgba(255, 255, 255, 0.95);
	border-radius: 48rpx;
}

.code-text {
	font-size: 28rpx;
	font-weight: bold;
	color: #FF9F29;
}

.poster-actions {
	padding: 0 32rpx 32rpx;
}

.action-btn {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	padding: 24rpx;
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	color: #FFFFFF;
	font-size: 30rpx;
	font-weight: 500;
	border-radius: 48rpx;
	border: none;

	&::after {
		border: none;
	}
}
</style>
