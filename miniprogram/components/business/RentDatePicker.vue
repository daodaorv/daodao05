<template>
	<u-popup :show="show" @close="close" mode="bottom" :closeable="false" :z-index="11000" :safe-area-inset-bottom="true" :safe-area-inset-top="true">
		<view class="rent-date-picker">
			<!-- 顶部标题栏 -->
			<view class="popup-header">
				<text class="cancel-text" @tap="close">取消</text>
				<text class="popup-title">{{ props.titleText }}</text>
				<text class="confirm-text" @tap="confirm">确定</text>
			</view>

			<view class="picker-body">
				<!-- 日历选择区域 -->
				<view class="calendar-header">
					<view class="date-info">
						<text class="label">{{ pickupLabelText }}</text>
						<text class="value" :class="{ placeholder: !tempPickupDate }">{{ formatDate(tempPickupDate) || '选择日期' }}</text>
					</view>
					<view class="duration-info" v-if="duration > 0">
						<text class="duration-tag">共{{ duration }}{{ durationUnitText }}</text>
					</view>
					<view class="date-info right">
						<text class="label">{{ returnLabelText }}</text>
						<text class="value" :class="{ placeholder: !tempReturnDate }">{{ formatDate(tempReturnDate) || '选择日期' }}</text>
					</view>
				</view>

				<scroll-view scroll-y class="calendar-scroll">
					<view class="calendar-container">
						<view v-for="(month, mIndex) in calendarData" :key="mIndex" class="month-block">
							<view class="month-title">{{ month.year }}年 {{ month.month }}月</view>
							<view class="weekdays">
								<text v-for="day in ['日','一','二','三','四','五','六']" :key="day" class="weekday">{{ day }}</text>
							</view>
							<view class="days-grid">
								<view
									v-for="(day, dIndex) in month.days"
									:key="dIndex"
									class="day-cell"
									:class="{
										'empty': !day.date,
										'disabled': day.disabled,
										'selected': isSelected(day),
										'start': isStartDate(day),
										'end': isEndDate(day),
										'in-range': isInRange(day)
									}"
									@tap="onDayClick(day)"
								>
									<view class="day-content" v-if="day.date">
										<text class="day-number">{{ day.day }}</text>
										<text v-if="isStartDate(day)" class="day-tag">{{ pickupLabelText }}</text>
										<text v-if="isEndDate(day)" class="day-tag">{{ returnLabelText }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>

				<!-- 时间选择区域 -->
				<view v-if="props.showTimeSelection" class="time-section">
					<view class="section-header">
						<text class="section-title">{{ pickupTimeTitle }}</text>
						<text class="section-desc">{{ returnTimeDesc }}</text>
					</view>
					<scroll-view scroll-x class="time-scroll" show-scrollbar="false">
						<view class="time-list">
							<view
								v-for="(time, index) in timeList"
								:key="index"
								class="time-chip"
								:class="{ active: tempTime === time }"
								@tap="onTimeClick(time)"
							>
								<text class="time-text">{{ time }}</text>
								<u-icon v-if="tempTime === time" name="checkbox-mark" size="12" color="#FFFFFF" class="check-icon"></u-icon>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import dayjs from 'dayjs';

// 定义接口
interface Day {
	date: string;
	day: number | string;
	disabled?: boolean;
}

interface Month {
	year: number;
	month: number;
	days: Day[];
}

interface Props {
	disabledDates?: string[];
	titleText?: string;
	pickupLabel?: string;
	returnLabel?: string;
	showTimeSelection?: boolean;
	defaultTime?: string;
	durationUnit?: string;
}

const props = withDefaults(defineProps<Props>(), {
	disabledDates: () => [],
	titleText: '选择取还车时间',
	pickupLabel: '取车',
	returnLabel: '还车',
	showTimeSelection: true,
	defaultTime: '10:00',
	durationUnit: '天'
});
const emit = defineEmits(['confirm']);
const show = ref(false);
const calendarData = ref<Month[]>([]);
const timeList = ref<string[]>([]);

const tempPickupDate = ref('');
const tempReturnDate = ref('');
const tempTime = ref('');
const disabledDateSet = computed(() => new Set(props.disabledDates || []));
const pickupLabelText = computed(() => {
	const label = props.pickupLabel?.trim();
	return label && label.length > 0 ? label : '取车';
});
const returnLabelText = computed(() => {
	const label = props.returnLabel?.trim();
	return label && label.length > 0 ? label : '还车';
});
const durationUnitText = computed(() => {
	const unit = props.durationUnit?.trim();
	return unit && unit.length > 0 ? unit : '天';
});
const pickupTimeTitle = computed(() => `${pickupLabelText.value}时间`);
const returnTimeDesc = computed(() => `${returnLabelText.value}时间将自动同步`);
const minimumDurationText = computed(() => `1${durationUnitText.value}`);

onMounted(() => {
	initCalendar();
	initTimeList();
});

watch(
	() => props.disabledDates,
	() => {
		initCalendar();
	},
	{ deep: true }
);

const duration = computed(() => {
	if (!tempPickupDate.value || !tempReturnDate.value) return 0;
	const start = dayjs(tempPickupDate.value);
	const end = dayjs(tempReturnDate.value);
	return end.diff(start, 'day');
});

const initCalendar = () => {
	const today = dayjs();
	const months: Month[] = [];

	for (let i = 0; i < 6; i++) {
		const current = today.add(i, 'month');
		const year = current.year();
		const month = current.month() + 1;
		const daysInMonth = current.daysInMonth();
		const firstDayOfWeek = current.startOf('month').day();

		const days: Day[] = [];
		// 填充空白日期
		for (let j = 0; j < firstDayOfWeek; j++) {
			days.push({ date: '', day: '' });
		}
		// 填充实际日期
		for (let d = 1; d <= daysInMonth; d++) {
			const dateObj = current.date(d);
			const dateStr = dateObj.format('YYYY-MM-DD');
			// 简单的字符串比较通常足够，因为格式是固定的 YYYY-MM-DD
			// 但为了准确性，这里保留 dayjs 比较，只在初始化时运行一次，不影响渲染性能
			const isBeforeToday = dateObj.isBefore(today, 'day');

			const isDisabledFromProps = disabledDateSet.value.has(dateStr);
			days.push({
				date: dateStr,
				day: d,
				disabled: isBeforeToday || isDisabledFromProps
			});
		}
		months.push({ year, month, days });
	}
	calendarData.value = months;
};

const initTimeList = () => {
	const times: string[] = [];
	for (let i = 9; i <= 18; i++) {
		times.push(`${i.toString().padStart(2, '0')}:00`);
	}
	timeList.value = times;
};

const formatDate = (date: string) => {
	if (!date) return '';
	return dayjs(date).format('MM月DD日');
};

const isSelected = (day: Day) => {
	if (!day.date) return false;
	return day.date === tempPickupDate.value || day.date === tempReturnDate.value;
};

const isStartDate = (day: Day) => {
	if (!day.date) return false;
	return day.date === tempPickupDate.value;
};

const isEndDate = (day: Day) => {
	if (!day.date) return false;
	return day.date === tempReturnDate.value;
};

// 性能优化：使用字符串比较代替 dayjs
const isInRange = (day: Day) => {
	if (!tempPickupDate.value || !tempReturnDate.value || !day.date) return false;
	// 字符串比较 YYYY-MM-DD 是安全的
	return day.date > tempPickupDate.value && day.date < tempReturnDate.value;
};

const onDayClick = (day: Day) => {
	if (!day.date || day.disabled) return;

	const date = day.date;

	if (!tempPickupDate.value || (tempPickupDate.value && tempReturnDate.value)) {
		// 新的选择开始
		tempPickupDate.value = date;
		tempReturnDate.value = '';
	} else {
		// 选择结束日期
		if (date < tempPickupDate.value) {
			// 如果选的日期早于开始日期，则交换
			tempReturnDate.value = tempPickupDate.value;
			tempPickupDate.value = date;
		} else if (date === tempPickupDate.value) {
			uni.showToast({ title: `至少${minimumDurationText.value}`, icon: 'none' });
			return;
		} else {
			tempReturnDate.value = date;
		}
	}
};

const onTimeClick = (time: string) => {
	tempTime.value = time;
};

const open = (pickupDate?: string, returnDate?: string, time?: string) => {
	console.log('🔍 RentDatePicker open 被调用:', pickupDate, returnDate, time);
	tempPickupDate.value = pickupDate || '';
	tempReturnDate.value = returnDate || '';
	tempTime.value = time || props.defaultTime;
	show.value = true;
	console.log('🔍 show.value 已设置为:', show.value);
};

const close = () => {
	show.value = false;
};

const confirm = () => {
	console.log('Confirming selection:', tempPickupDate.value, tempReturnDate.value, tempTime.value);
	if (!tempPickupDate.value) {
		uni.showToast({ title: `请选择${pickupLabelText.value}日期`, icon: 'none' });
		return;
	}
	if (!tempReturnDate.value) {
		uni.showToast({ title: `请选择${returnLabelText.value}日期`, icon: 'none' });
		return;
	}
	if (props.showTimeSelection && !tempTime.value) {
		uni.showToast({ title: `请选择${pickupLabelText.value}时间`, icon: 'none' });
		return;
	}

	emit('confirm', {
		pickupDate: tempPickupDate.value,
		returnDate: tempReturnDate.value,
		time: tempTime.value
	});
	close();
};

defineExpose({ open, close });
</script>

<style scoped lang="scss">
.rent-date-picker {
	background-color: #FFFFFF;
	border-radius: 32rpx 32rpx 0 0;
	max-height: 70vh;
	display: flex;
	flex-direction: column;
	padding-bottom: env(safe-area-inset-bottom);
	overflow: hidden;
}

.popup-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx;
	border-bottom: 1rpx solid #EEE;
	background-color: #FFFFFF;
	position: sticky;
	top: 0;
	z-index: 10076;
	flex-shrink: 0;
	min-height: 96rpx;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	flex: 1;
	text-align: center;
}

.cancel-text {
	font-size: 28rpx;
	color: #999;
	padding: 10rpx 20rpx;
	cursor: pointer;
}

.confirm-text {
	font-size: 28rpx;
	color: $uni-color-primary;
	font-weight: bold;
	padding: 10rpx 20rpx;
	cursor: pointer;
}

.picker-body {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.calendar-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 32rpx;
	background-color: #FFF;
	border-bottom: 1rpx solid #F5F5F5;
}

.date-info {
	display: flex;
	flex-direction: column;

	&.right {
		align-items: flex-end;
	}
}

.date-info .label {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 4rpx;
}

.date-info .value {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;

	&.placeholder {
		color: #CCC;
		font-weight: normal;
	}
}

.duration-info {
	display: flex;
	align-items: center;
	justify-content: center;
}

.duration-tag {
	font-size: 24rpx;
	color: $uni-color-primary;
	background-color: #FFF9F0;
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
	font-weight: 500;
}

.calendar-scroll {
	flex: 1;
	height: 0;
}

.calendar-container {
	padding: 0 32rpx 32rpx;
}

.month-block {
	margin-bottom: 40rpx;
}

.month-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	text-align: center;
	padding: 32rpx 0;
}

.weekdays {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	margin-bottom: 16rpx;
}

.weekday {
	text-align: center;
	font-size: 24rpx;
	color: #999;
}

.days-grid {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 16rpx 0;
}

.day-cell {
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;

	&.selected {
		background-color: $uni-color-primary;
		color: #FFF;

		&.start {
			border-top-left-radius: 50%;
			border-bottom-left-radius: 50%;
		}
		&.end {
			border-top-right-radius: 50%;
			border-bottom-right-radius: 50%;
		}
		// 单选时
		&:not(.in-range):not(.start):not(.end) {
			border-radius: 50%;
		}
	}

	&.in-range {
		background-color: rgba(255, 159, 41, 0.1);
		color: #333;
	}

	&.disabled {
		opacity: 0.3;
	}
}

.day-content {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.day-number {
	font-size: 28rpx;
	font-weight: 500;
}

.day-tag {
	font-size: 20rpx;
	margin-top: 4rpx;
}

.time-section {
	border-top: 1rpx solid #F5F5F5;
	padding: 24rpx 32rpx;
	background-color: #FFF;
}

.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.section-desc {
	font-size: 24rpx;
	color: #999;
}

.time-scroll {
	white-space: nowrap;
	width: 100%;
}

.time-list {
	display: flex;
	gap: 20rpx;
	padding-bottom: 10rpx; /* 预留滚动条空间 */
}

/* 现代化时间选择样式 */
.time-chip {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 120rpx;
	height: 80rpx;
	background-color: #FFFFFF;
	border: 1rpx solid #E0E0E0;
	border-radius: 16rpx;
	margin-right: 16rpx;
	position: relative;
	transition: all 0.2s;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.02);

	&:last-child {
		margin-right: 32rpx; /* 右侧留白 */
	}

	&.active {
		background-color: $uni-color-primary;
		border-color: $uni-color-primary;
		box-shadow: 0 4rpx 12rpx rgba(255, 159, 41, 0.3);
		transform: translateY(-2rpx);

		.time-text {
			color: #FFFFFF;
			font-weight: bold;
		}
	}
}

.time-text {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
}

.check-icon {
	position: absolute;
	right: 6rpx;
	top: 6rpx;
}
</style>
