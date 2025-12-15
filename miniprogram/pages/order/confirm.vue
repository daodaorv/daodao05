<template>
	<view class="order-confirm-page">
		<scroll-view scroll-y class="content-scroll">
			<!-- 车辆信息 -->
			<view class="section">
				<view class="section-title">车辆信息</view>
				<view class="vehicle-info">
					<image class="vehicle-image" :src="orderData.vehicleImage" mode="aspectFill"></image>
					<view class="vehicle-details">
						<text class="vehicle-name">{{ orderData.vehicleName }}</text>
						<text class="vehicle-spec">{{ orderData.vehicleType }} | {{ orderData.seats }}座{{ orderData.beds }}卧</text>
					</view>
				</view>
			</view>

			<!-- 租赁信息 -->
			<view class="section">
				<view class="section-title">租赁信息</view>
				<view class="rental-info">
					<!-- 租期概览 -->
					<view class="rental-duration">
						<view class="duration-icon">
							<u-icon name="calendar-fill" size="20" color="#FF9F29"></u-icon>
						</view>
						<view class="duration-info">
							<text class="duration-label">租期</text>
							<text class="duration-value">{{ rentalDays }}天</text>
							<text v-if="isSpecialOffer" class="duration-tip">(固定租期)</text>
						</view>
					</view>

					<!-- 特惠套餐：取车时间选择 -->
					<view v-if="isSpecialOffer" class="pickup-time-selector">
						<view class="selector-title">
							<u-icon name="calendar" size="18" color="#FF9F29"></u-icon>
							<text class="title-text">选择取车时间</text>
						</view>
						<view class="selector-tip">
							<u-icon name="info" size="14" color="#999"></u-icon>
							<text class="tip-text">可选时间段：{{ formatDateRange(specialOfferData.availableTimeRange) }}</text>
						</view>

						<!-- 日期选择 -->
						<picker
							mode="date"
							:value="orderData.pickupDate"
							:start="specialOfferData.availableTimeRange.start"
							:end="specialOfferData.availableTimeRange.end"
							@change="onDateChange"
						>
							<view class="time-picker-row">
								<view class="picker-label">
									<u-icon name="calendar" size="16" color="#666"></u-icon>
									<text class="label-text">取车日期</text>
								</view>
								<view class="picker-value">
									<text class="value-text">{{ orderData.pickupDate }}</text>
									<u-icon name="arrow-right" size="16" color="#999"></u-icon>
								</view>
							</view>
						</picker>

						<!-- 时间选择 -->
						<picker
							mode="time"
							:value="orderData.pickupTime"
							@change="onTimeChange"
						>
							<view class="time-picker-row">
								<view class="picker-label">
									<u-icon name="clock" size="16" color="#666"></u-icon>
									<text class="label-text">取车时间</text>
								</view>
								<view class="picker-value">
									<text class="value-text">{{ orderData.pickupTime }}</text>
									<u-icon name="arrow-right" size="16" color="#999"></u-icon>
								</view>
							</view>
						</picker>

						<!-- 自动计算提示 -->
						<view class="auto-calc-tip">
							<u-icon name="info-circle-fill" size="16" color="#4CAF50"></u-icon>
							<text class="calc-tip-text">还车时间：{{ orderData.returnDate }} {{ orderData.returnTime }}</text>
						</view>
					</view>

					<!-- 取还车时间线 -->
					<view class="rental-timeline">
						<!-- 取车信息 -->
						<view class="timeline-item pickup">
							<view class="timeline-dot">
								<view class="dot-inner"></view>
							</view>
							<view class="timeline-content">
								<view class="timeline-header">
									<u-icon name="pushpin-fill" size="18" color="#4CAF50"></u-icon>
									<text class="timeline-title">取车</text>
									<text v-if="isSpecialOffer" class="timeline-badge">固定门店</text>
								</view>
								<view class="timeline-detail">
									<view class="detail-item">
										<u-icon name="map" size="14" color="#999"></u-icon>
										<text class="detail-text">{{ orderData.pickupLocation }}</text>
									</view>
									<view class="detail-item">
										<u-icon name="calendar" size="14" color="#999"></u-icon>
										<text class="detail-text">{{ orderData.pickupDate }} {{ orderData.pickupTime }}</text>
									</view>
								</view>
							</view>
						</view>

						<!-- 还车信息 -->
						<view class="timeline-item return">
							<view class="timeline-dot">
								<view class="dot-inner"></view>
							</view>
							<view class="timeline-content">
								<view class="timeline-header">
									<u-icon name="checkbox-mark" size="18" color="#FF9F29"></u-icon>
									<text class="timeline-title">还车</text>
									<text v-if="isSpecialOffer" class="timeline-badge">固定门店</text>
								</view>
								<view class="timeline-detail">
									<view class="detail-item">
										<u-icon name="map" size="14" color="#999"></u-icon>
										<text class="detail-text">{{ orderData.returnLocation }}</text>
									</view>
									<view class="detail-item">
										<u-icon name="calendar" size="14" color="#999"></u-icon>
										<text class="detail-text">{{ orderData.returnDate }} {{ orderData.returnTime }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>

					<!-- 特惠套餐重要提示 -->
					<view v-if="isSpecialOffer" class="special-notice">
						<u-icon name="info-circle-fill" size="16" color="#FF9F29"></u-icon>
						<text class="notice-text">取车门店、还车门店、租期均为固定，不可更改。如需改变行程，订单将转为常规订单按原价计费。</text>
					</view>
				</view>
			</view>

			<!-- 保险方案 -->
			<view class="section">
				<view class="section-title">选择保险方案</view>
				<view class="insurance-list">
					<view 
						v-for="(plan, index) in insurancePlans" 
						:key="index"
						class="insurance-item"
						:class="{ selected: selectedInsurance === index }"
						@tap="selectInsurance(index)"
					>
						<view class="insurance-select">
							<u-icon 
								:name="selectedInsurance === index ? 'checkmark-circle-fill' : 'checkmark-circle'" 
								size="22" 
								:color="selectedInsurance === index ? '#FF9F29' : '#DDD'">
							</u-icon>
						</view>
						<view class="insurance-main">
							<view class="insurance-name-box">
								<text class="insurance-name">{{ plan.name }}</text>
								<text class="insurance-price">+¥{{ plan.price }}/天</text>
							</view>
							<text class="insurance-desc">{{ plan.description }}</text>
						</view>
						<view class="insurance-detail-trigger" @tap.stop="openDetailPopup({
							title: plan.name,
							subtitle: `+¥${plan.price}/天`,
							content: plan.description
						})">
							<u-icon name="info-circle" size="20" color="#999"></u-icon>
							<text class="insurance-detail-text">详情</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 附加服务 -->
			<view class="section">
				<view class="section-title">附加服务(可选)</view>
				<view class="services-list">
					<view 
						v-for="(service, index) in additionalServices" 
						:key="index"
						class="service-item"
						@tap="toggleService(index)"
					>
						<view class="service-select">
							<u-icon 
								:name="service.selected ? 'checkmark-circle-fill' : 'checkmark-circle'" 
								size="22" 
								:color="service.selected ? '#FF9F29' : '#DDD'">
							</u-icon>
						</view>
						<view class="service-info">
							<text class="service-name">{{ service.name }}</text>
							<text class="service-price">+¥{{ service.price }}/{{ service.unit }}</text>
						</view>
						<view class="service-detail-trigger" @tap.stop="openDetailPopup({
							title: service.name,
							subtitle: `+¥${service.price}/${service.unit}`,
							content: service.description || '暂无详情信息'
						})">
							<u-icon name="info-circle" size="20" color="#999"></u-icon>
							<text class="service-detail-text">详情</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 租车人资料 -->
			<view class="section renter-section">
				<view class="section-title">租车人资料</view>
				<view class="contact-selector">
					<view class="selector-left">
						<u-icon name="server-man" size="20" color="#FF9F29"></u-icon>
						<text class="selector-label">常用联系人</text>
					</view>
					<view class="selector-action" @tap="openContactSelector">
						<text class="action-text">{{ contactDisplayText }}</text>
						<u-icon name="arrow-right" size="16" color="#999"></u-icon>
					</view>
				</view>
				<view class="contact-helper">
					<text class="helper-link" @tap="goToContactManage">管理常用联系人</text>
					<text class="helper-tip">首次手动填写将自动保存</text>
				</view>
				<view class="renter-form">
					<view class="form-item">
						<text class="form-label">租车人姓名</text>
						<u-input
							v-model="renterForm.name"
							placeholder="请输入真实姓名"
							clearable
							@input="onRenterFieldInput('name', $event)"
						></u-input>
					</view>
					<view class="form-item">
						<text class="form-label">联系电话</text>
						<u-input
							v-model="renterForm.phone"
							placeholder="请输入手机号"
							type="number"
							maxlength="11"
							clearable
							@input="onRenterFieldInput('phone', $event)"
						></u-input>
					</view>
					<view class="form-item">
						<text class="form-label">驾驶证号</text>
						<u-input
							v-model="renterForm.driverLicenseNo"
							placeholder="请输入驾驶证号码"
							maxlength="20"
							clearable
							@input="onRenterFieldInput('driverLicenseNo', $event)"
						></u-input>
					</view>
				</view>
				<view class="license-upload">
					<view class="license-grid">
						<view
							class="upload-item"
							v-for="field in licenseFields"
							:key="field.type"
						>
							<view class="upload-label">
								<text>{{ field.label }}</text>
								<text class="upload-tip">需清晰可辨识</text>
							</view>
							<view class="license-card">
								<view
									class="license-content"
									@tap="licensePreview[field.type] ? previewLicense(field.type) : handleChooseLicense(field.type)"
								>
									<image
										v-if="licensePreview[field.type]"
										:src="licensePreview[field.type]"
										class="license-image"
										mode="aspectFill"
									></image>
									<view v-else class="license-placeholder">
										<u-icon name="camera-fill" size="34" color="#FF9F29"></u-icon>
										<text>{{ field.placeholder }}</text>
									</view>
									<view v-if="licenseUploading[field.type]" class="license-mask">
										<u-loading-icon mode="circle" size="26" color="#FFFFFF"></u-loading-icon>
										<text>上传中...</text>
									</view>
								</view>
								<view class="license-ops" v-if="licensePreview[field.type]">
									<text class="op-link" @tap.stop="previewLicense(field.type)">预览</text>
									<text class="op-link" @tap.stop="handleChooseLicense(field.type)">重新上传</text>
									<text class="op-link danger" @tap.stop="removeLicense(field.type)">删除</text>
								</view>
								<view v-else class="license-ops">
									<text class="op-link" @tap.stop="handleChooseLicense(field.type)">选择照片</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 租车须知 -->
			<view class="section notice-section">
				<view class="notice-brief">
					<view class="brief-info">
						<text class="brief-title">租车须知</text>
						<text v-if="rentalNotice.version" class="brief-version">版本 {{ rentalNotice.version }}</text>
					</view>
					<view class="brief-action" @tap="openNoticePopup">
						<template v-if="noticesLoading">
							<u-loading-icon mode="circle" size="18" color="#FF9F29"></u-loading-icon>
							<text class="action-text">加载中</text>
						</template>
						<template v-else>
							<u-icon name="file-text" size="18" color="#FF9F29"></u-icon>
							<text class="action-text">查看须知</text>
						</template>
						<u-icon name="arrow-right" size="16" color="#999"></u-icon>
					</view>
				</view>
				<view class="notice-agreement" @tap="toggleNoticeAgreement">
					<u-icon
						:name="noticeAgreed ? 'checkmark-circle-fill' : 'checkmark-circle'"
						size="22"
						:color="noticeAgreed ? '#FF9F29' : '#C0C4CC'"
					></u-icon>
					<text>我已阅读并同意租车须知及租车人责任条款</text>
				</view>
			</view>

			<!-- 优惠券（特惠套餐不支持） -->
			<view v-if="!isSpecialOffer" class="section coupon-section" @tap="selectCoupon">
				<view class="coupon-row">
					<text class="section-title">优惠券</text>
					<view class="coupon-value">
						<text class="coupon-text">{{ selectedCoupon ? selectedCoupon.name : '请选择' }}</text>
						<u-icon name="arrow-right" size="16" color="#999"></u-icon>
					</view>
				</view>
				<!-- 节省金额提示 -->
				<view v-if="selectedCoupon" class="savings-tip">
					<u-icon name="checkbox-mark" size="16" color="#52C41A"></u-icon>
					<text class="savings-text">已为您节省 ¥{{ couponDiscount }}</text>
				</view>
			</view>

			<!-- 价格明细 -->
			<view class="section">
				<view class="section-title">价格明细</view>
				<view class="price-detail">
					<view class="detail-row">
						<text class="detail-label">租金({{ rentalDays }}天 × ¥{{ orderData.dailyPrice }})</text>
						<text class="detail-value">¥{{ basePrice }}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">保险费用</text>
						<text class="detail-value">¥{{ insurancePrice }}</text>
					</view>
					<view v-if="servicesPrice > 0" class="detail-row">
						<text class="detail-label">附加服务</text>
						<text class="detail-value">¥{{ servicesPrice }}</text>
					</view>
					<view v-if="!isSpecialOffer && selectedCoupon" class="detail-row discount">
						<text class="detail-label">优惠券抵扣</text>
						<text class="detail-value">-¥{{ couponDiscount }}</text>
					</view>
					<view class="detail-row total">
						<text class="detail-label">合计</text>
						<text class="detail-value">¥{{ totalPrice }}</text>
					</view>
				</view>
			</view>

			<!-- 底部占位 -->
			<view class="bottom-placeholder"></view>
		</scroll-view>

		<!-- 功能详情弹窗 -->
		<view v-if="detailPopup.visible" class="detail-popup-overlay" @tap="closeDetailPopup">
			<view class="detail-popup-container" @tap.stop>
				<view class="detail-popup-header">
					<view class="detail-popup-title">
						<text class="popup-title-text">{{ detailPopup.title }}</text>
						<text v-if="detailPopup.subtitle" class="popup-subtitle-text">{{ detailPopup.subtitle }}</text>
					</view>
					<u-icon name="close" size="22" color="#999" @tap="closeDetailPopup"></u-icon>
				</view>
				<scroll-view scroll-y class="detail-popup-body">
					<text class="detail-popup-content">{{ detailPopup.content }}</text>
				</scroll-view>
				<button class="detail-popup-btn" @tap="closeDetailPopup">我知道了</button>
			</view>
		</view>

		<view v-if="noticePopupVisible" class="notice-popup-overlay" @tap="closeNoticePopup">
			<view class="notice-popup-container" @tap.stop>
				<view class="notice-popup-header">
					<text class="popup-title-text">租车须知</text>
					<u-icon name="close" size="22" color="#999" @tap="closeNoticePopup"></u-icon>
				</view>
				<scroll-view scroll-y class="notice-popup-body">
					<view v-if="noticesLoading" class="notice-loading">
						<u-loading-icon mode="circle" size="24" color="#FF9F29"></u-loading-icon>
						<text class="loading-text">正在加载须知...</text>
					</view>
					<view v-else-if="rentalNotice.sections.length" class="notice-list">
						<view class="notice-block" v-for="section in rentalNotice.sections" :key="section.id">
							<view class="notice-block-header">
								<text class="notice-block-title">{{ section.title }}</text>
								<text v-if="section.highlight" class="notice-highlight">{{ section.highlight }}</text>
							</view>
							<text v-if="section.summary" class="notice-summary">{{ section.summary }}</text>
							<view v-if="section.items && section.items.length" class="notice-items">
								<view class="notice-item" v-for="(item, index) in section.items" :key="index">
									<text class="item-badge">{{ item.title }}</text>
									<text class="item-desc">{{ item.description }}</text>
								</view>
							</view>
							<view
								v-if="section.paragraphs && section.paragraphs.length"
								class="notice-paragraphs"
							>
								<text
									v-for="(paragraph, idx) in section.paragraphs"
									:key="idx"
									class="paragraph-text"
								>
									{{ paragraph }}
								</text>
							</view>
						</view>
						<view class="notice-meta" v-if="rentalNotice.version">
							<text>规则版本：{{ rentalNotice.version }}</text>
						</view>
					</view>
					<view v-else class="notice-empty">
						<text>暂无须知内容，请稍后再试</text>
					</view>
				</scroll-view>
				<button class="notice-popup-btn" @tap="closeNoticePopup">我已阅读</button>
			</view>
		</view>

		<u-action-sheet
			:show="contactSheetVisible"
			:actions="contactActions"
			title="选择常用联系人"
			@select="handleContactSelect"
			@close="contactSheetVisible = false"
		></u-action-sheet>

		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<view class="total-info">
				<text class="total-label">总计</text>
				<view class="total-price">
					<text class="currency">¥</text>
					<text class="price">{{ totalPrice }}</text>
				</view>
			</view>
			<button class="submit-btn" @tap="handleSubmit">提交订单</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { requireLogin, isLoggedIn, buildRedirectUrl } from '@/utils/auth';
import { registerMockOrder } from '@/api/order';
import { useContactStore } from '@/stores/contact';
import { getRentalRules } from '@/api/rules';
import type { RentalRuleResponse } from '@/api/rules';
import { uploadDriverLicenseImage } from '@/api/upload';

// 订单类型
const orderType = ref<'normal' | 'special-offer'>('normal');
const isSpecialOffer = computed(() => orderType.value === 'special-offer');
const pageReady = ref(false);
const redirectUrl = ref('/pages/order/confirm');
let cachedRouteParams: Record<string, any> | null = null;
let couponListener: ((coupon: any) => void) | null = null;

// 特惠套餐数据
const specialOfferData = ref({
	offerId: '',
	fixedRentalDays: 5, // 固定租期（天）
	packagePrice: 0, // 套餐价格
	originalPrice: 0, // 原价
	availableTimeRange: {
		start: '2025-12-05',
		end: '2025-12-30'
	}
});

// 订单数据
const orderData = ref({
	vehicleId: '',
	vehicleName: '上汽大通RG10',
	vehicleType: 'C型房车',
	vehicleImage: '/static/场景推荐2.jpg',
	seats: 6,
	beds: 4,
	dailyPrice: 680,
	pickupLocation: '成都市武侯区天府大道中段',
	pickupDate: '2024-12-01',
	pickupTime: '09:00',
	returnLocation: '成都市武侯区天府大道中段',
	returnDate: '2024-12-05',
	returnTime: '18:00'
});

const contactStore = useContactStore();
const { contactList } = storeToRefs(contactStore);
type LicenseSide = 'front' | 'back';

const renterForm = ref({
	name: '',
	phone: '',
	driverLicenseNo: '',
	driverLicenseFront: '',
	driverLicenseBack: ''
});
type RenterFormKey = 'name' | 'phone' | 'driverLicenseNo';
const licensePreview = ref<Record<LicenseSide, string>>({ front: '', back: '' });
const selectedContactId = ref('');
const contactSheetVisible = ref(false);
const contactLoading = ref(false);
const licenseUploading = ref<Record<LicenseSide, boolean>>({ front: false, back: false });
const rentalNotice = ref<RentalRuleResponse>({
	productType: 'vehicle',
	version: '',
	sections: []
});
const noticesLoading = ref(false);
const noticeAgreed = ref(false);
const noticePopupVisible = ref(false);
const licenseFields: Array<{ type: LicenseSide; label: string; placeholder: string }> = [
	{ type: 'front', label: '驾驶证正面', placeholder: '上传驾驶证正面' },
	{ type: 'back', label: '驾驶证反面', placeholder: '上传驾驶证反面' }
] ;

// 保险方案
const insurancePlans = ref([
	{
		name: '基础险',
		price: 50,
		description: '第三者责任险,保障第三方人身和财产损失'
	},
	{
		name: '标准险',
		price: 100,
		description: '基础险+车辆损失险(80%赔付),更全面的保障'
	},
	{
		name: '全险',
		price: 150,
		description: '标准险+车辆损失险(100%赔付)+驾意险,无忧出行'
	}
]);

const selectedInsurance = ref(0); // 默认选择基础险

// 附加服务
const additionalServices = ref([
	{
		name: 'GPS导航',
		price: 20,
		unit: '天',
		selected: false,
		description: 'Portable navigation with up-to-date maps and offline fallback.'
	},
	{
		name: '儿童安全座椅',
		price: 30,
		unit: '天',
		selected: false,
		description: 'Certified child seat sized for 9-18kg with quick-latch harness.'
	},
	{
		name: '车载WiFi',
		price: 15,
		unit: '天',
		selected: false,
		description: 'Unlimited in-vehicle Wi-Fi hotspot supporting up to five devices.'
	},
	{
		name: '异地还车',
		price: 500,
		unit: '次',
		selected: false,
		description: 'Return the vehicle at a different city with concierge transfer.'
	}
]);

// 优惠券
const selectedCoupon = ref<any>(null);
// 详情弹窗
const detailPopup = ref({
	visible: false,
	title: '',
	subtitle: '',
	content: ''
});

// 计算租赁天数
const rentalDays = computed(() => {
	if (isSpecialOffer.value) {
		// 特惠套餐使用固定租期
		return specialOfferData.value.fixedRentalDays;
	}
	// 常规订单计算租期
	const pickup = new Date(orderData.value.pickupDate);
	const returnDate = new Date(orderData.value.returnDate);
	const days = Math.ceil((returnDate.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
	return days > 0 ? days : 1;
});

// 计算基础租金
const basePrice = computed(() => {
	if (isSpecialOffer.value) {
		// 特惠套餐使用套餐价格
		return specialOfferData.value.packagePrice;
	}
	return orderData.value.dailyPrice * rentalDays.value;
});

// 计算保险费用
const insurancePrice = computed(() => {
	return insurancePlans.value[selectedInsurance.value].price * rentalDays.value;
});

// 计算附加服务费用
const servicesPrice = computed(() => {
	return additionalServices.value.reduce((total, service) => {
		if (service.selected) {
			return total + (service.unit === '天' ? service.price * rentalDays.value : service.price);
		}
		return total;
	}, 0);
});

// 计算优惠券抵扣
const couponDiscount = computed(() => {
	if (!selectedCoupon.value || isSpecialOffer.value) return 0;
	// æŽ¥å—ç­¾çº¦é¥°ä¼˜æƒ åˆ¸æ—¶å¯èƒ½æŽ¨é€?discountæˆ–amount, å…ˆç”¨amountå?‡æ‹¹æ»?
	const coupon = selectedCoupon.value;
	if (typeof coupon.amount === 'number') {
		return coupon.amount;
	}
	if (typeof coupon.discount === 'number') {
		return coupon.discount;
	}
	return 0;
});

// 计算总价
const totalPrice = computed(() => {
	const total = basePrice.value + insurancePrice.value + servicesPrice.value - couponDiscount.value;
	return Math.max(total, 0);
});

const contactActions = computed(() => {
	return contactList.value.map((item: any) => ({
		name: item.name || '未命名联系人',
		subname: item.phone,
		id: item.id
	}));
});

const contactDisplayText = computed(() => {
	if (contactLoading.value) {
		return '联系人加载中...';
	}
	if (selectedContactId.value) {
		const target = contactList.value.find((item: any) => item.id === selectedContactId.value);
		if (target) {
			return `${target.name} · ${formatPhone(target.phone)}`;
		}
	}
	if (renterForm.value.name || renterForm.value.phone) {
		return '使用自定义信息';
	}
	return contactList.value.length > 0 ? '请选择联系人' : '暂无联系人';
});

// 自动计算还车时间（特惠套餐）
const calculateReturnDateTime = () => {
	if (!isSpecialOffer.value) return;

	const pickupDateTime = new Date(`${orderData.value.pickupDate} ${orderData.value.pickupTime}`);
	const returnDateTime = new Date(pickupDateTime.getTime() + specialOfferData.value.fixedRentalDays * 24 * 60 * 60 * 1000);

	const year = returnDateTime.getFullYear();
	const month = String(returnDateTime.getMonth() + 1).padStart(2, '0');
	const day = String(returnDateTime.getDate()).padStart(2, '0');
	const hours = String(returnDateTime.getHours()).padStart(2, '0');
	const minutes = String(returnDateTime.getMinutes()).padStart(2, '0');

	orderData.value.returnDate = `${year}-${month}-${day}`;
	orderData.value.returnTime = `${hours}:${minutes}`;
};

// 监听取车日期和时间变化，自动计算还车时间
watch([() => orderData.value.pickupDate, () => orderData.value.pickupTime], () => {
	if (isSpecialOffer.value) {
		calculateReturnDateTime();
	}
});

watch(() => isSpecialOffer.value, (val) => {
	if (val) {
		selectedCoupon.value = null;
	}
});

watch(contactList, () => {
	tryPrefillFromContacts();
});


const formatPhone = (phone?: string) => {
	if (!phone) return '无手机号';
	return phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
};

const resetRenterForm = () => {
	renterForm.value = {
		name: '',
		phone: '',
		driverLicenseNo: '',
		driverLicenseFront: '',
		driverLicenseBack: ''
	};
	selectedContactId.value = '';
	licensePreview.value = { front: '', back: '' };
};

const applyContactToForm = (contact: any) => {
	if (!contact) return;
	renterForm.value = {
		name: contact.name || '',
		phone: contact.phone || '',
		driverLicenseNo: contact.driverLicenseNo || '',
		driverLicenseFront: contact.driverLicenseFront || '',
		driverLicenseBack: contact.driverLicenseBack || ''
	};
	selectedContactId.value = contact.id || '';
	syncLicensePreview();
};

const tryPrefillFromContacts = () => {
	if (
		selectedContactId.value ||
		renterForm.value.name ||
		renterForm.value.phone ||
		!contactList.value.length
	) {
		return;
	}
	const defaultContact = contactList.value.find((item: any) => item.isDefault) || contactList.value[0];
	if (defaultContact) {
		applyContactToForm(defaultContact);
	}
};

const loadContacts = async () => {
	contactLoading.value = true;
	try {
		await contactStore.fetchContacts();
		tryPrefillFromContacts();
	} catch (error) {
		console.error('加载联系人失败', error);
	} finally {
		contactLoading.value = false;
	}
};

const openContactSelector = () => {
	if (contactLoading.value) {
		return;
	}
	if (!contactList.value.length) {
		uni.showModal({
			title: '提示',
			content: '暂无常用联系人，是否前往添加？',
			confirmText: '去添加',
			cancelText: '暂不',
			success: (res) => {
				if (res.confirm) {
					goToContactManage();
				}
			}
		});
		return;
	}
	contactSheetVisible.value = true;
};

const handleContactSelect = (action: any) => {
	const selected = contactList.value.find((item: any) => item.id === action.id);
	if (selected) {
		applyContactToForm(selected);
	}
	contactSheetVisible.value = false;
};

const goToContactManage = () => {
	uni.navigateTo({
		url: '/pages/profile/contacts'
	});
};

const onRenterFieldInput = (field: RenterFormKey, value: string) => {
	if (selectedContactId.value) {
		selectedContactId.value = '';
	}
	renterForm.value[field] = value;
};

const syncLicensePreview = () => {
	licensePreview.value = {
		front: renterForm.value.driverLicenseFront || '',
		back: renterForm.value.driverLicenseBack || ''
	};
};

const handleChooseLicense = (type: LicenseSide) => {
	if (licenseUploading.value[type]) return;
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['camera', 'album'],
		success: async (res) => {
			const tempPaths = res?.tempFilePaths || [];
			const tempFiles = res?.tempFiles || [];
			const path = tempPaths[0] || tempFiles[0]?.path || '';
			if (path) {
				licensePreview.value[type] = path;
				await uploadLicenseFile(type, path);
			}
		}
	});
};

const uploadLicenseFile = async (type: LicenseSide, localPath: string) => {
	licenseUploading.value[type] = true;
	uni.showLoading({ title: '上传中...' });
	try {
		const url = await uploadDriverLicenseImage(localPath, type);
		if (type === 'front') {
			renterForm.value.driverLicenseFront = url;
		} else {
			renterForm.value.driverLicenseBack = url;
		}
		licensePreview.value[type] = url;
		if (selectedContactId.value) {
			selectedContactId.value = '';
		}
		uni.showToast({ title: '上传成功', icon: 'success' });
	} catch (error) {
		console.error('上传驾驶证失败', error);
		uni.showToast({ title: '上传失败，请重试', icon: 'none' });
	} finally {
		licenseUploading.value[type] = false;
		uni.hideLoading();
	}
};

const removeLicense = (type: LicenseSide) => {
	if (type === 'front') {
		renterForm.value.driverLicenseFront = '';
	} else {
		renterForm.value.driverLicenseBack = '';
	}
	licensePreview.value[type] = '';
	if (selectedContactId.value) {
		selectedContactId.value = '';
	}
	uni.showToast({ title: '已删除', icon: 'none' });
};

const previewLicense = (type: LicenseSide) => {
	const url = type === 'front' ? licensePreview.value.front : licensePreview.value.back;
	if (!url) {
		uni.showToast({ title: '暂无图片', icon: 'none' });
		return;
	}
	uni.previewImage({
		current: url,
		urls: [url]
	});
};

const validateRenterForm = () => {
	if (!renterForm.value.name.trim()) {
		uni.showToast({ title: '请输入租车人姓名', icon: 'none' });
		return false;
	}
	if (!/^1[3-9]\d{9}$/.test(renterForm.value.phone)) {
		uni.showToast({ title: '请输入有效手机号', icon: 'none' });
		return false;
	}
	if (!/^[A-Za-z0-9]{6,20}$/.test(renterForm.value.driverLicenseNo)) {
		uni.showToast({ title: '请输入正确的驾驶证号', icon: 'none' });
		return false;
	}
	if (!renterForm.value.driverLicenseFront) {
		uni.showToast({ title: '请上传驾驶证正面', icon: 'none' });
		return false;
	}
	if (!renterForm.value.driverLicenseBack) {
		uni.showToast({ title: '请上传驾驶证反面', icon: 'none' });
		return false;
	}
	return true;
};

const persistContactIfNeeded = async () => {
	if (selectedContactId.value) {
		return selectedContactId.value;
	}
	const existing = contactList.value.find(
		(item: any) =>
			item.phone === renterForm.value.phone && item.driverLicenseNo === renterForm.value.driverLicenseNo
	);
	if (existing) {
		selectedContactId.value = existing.id;
		return existing.id;
	}
	const payload = {
		name: renterForm.value.name.trim(),
		phone: renterForm.value.phone.trim(),
		idCard: '',
		driverLicenseNo: renterForm.value.driverLicenseNo.trim(),
		driverLicenseFront: renterForm.value.driverLicenseFront,
		driverLicenseBack: renterForm.value.driverLicenseBack,
		isDefault: contactList.value.length === 0
	};
	const success = await contactStore.addContact(payload);
	if (success) {
		const latest = contactList.value.find(
			(item: any) =>
				item.phone === renterForm.value.phone && item.driverLicenseNo === renterForm.value.driverLicenseNo
		);
		if (latest) {
			selectedContactId.value = latest.id;
			return latest.id;
		}
	}
	return '';
};

const toggleNoticeAgreement = () => {
	noticeAgreed.value = !noticeAgreed.value;
};

const loadRentalNotices = async () => {
	noticesLoading.value = true;
	try {
		const res = await getRentalRules({
			productType: isSpecialOffer.value ? 'special-offer' : 'vehicle'
		});
		rentalNotice.value = res.data;
		noticeAgreed.value = false;
	} catch (error) {
		console.error('加载租车须知失败', error);
		uni.showToast({ title: '租车须知加载失败', icon: 'none' });
		rentalNotice.value = {
			productType: isSpecialOffer.value ? 'special-offer' : 'vehicle',
			version: '',
			sections: []
		};
	} finally {
		noticesLoading.value = false;
	}
};

const openNoticePopup = async () => {
	if (!rentalNotice.value.sections.length && !noticesLoading.value) {
		await loadRentalNotices();
	}
	noticePopupVisible.value = true;
};

const closeNoticePopup = () => {
	noticePopupVisible.value = false;
};

// 格式化日期范围
const formatDateRange = (range: { start: string; end: string }) => {
	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
	};
	return `${formatDate(range.start)} - ${formatDate(range.end)}`;
};

// 日期选择变化
const onDateChange = (e: any) => {
	orderData.value.pickupDate = e.detail.value;
};

// 时间选择变化
const onTimeChange = (e: any) => {
	orderData.value.pickupTime = e.detail.value;
};

// 加载特惠套餐数据
const loadSpecialOfferData = async (offerId: string) => {
	try {
		uni.showLoading({ title: '加载中...' });

		// TODO: 调用API加载特惠套餐详情
		// const response = await getSpecialOfferDetail(offerId);

		// Mock数据
		const mockData = {
			offerId: offerId,
			fixedRentalDays: 5,
			packagePrice: 1280,
			originalPrice: 3400,
			vehicle: {
				name: '依维柯欧胜C型房车',
				type: 'C型房车',
				image: '/static/场景推荐2.jpg',
				seats: 6,
				beds: 4
			},
			pickupStore: {
				name: '北京大新门店',
				address: '北京市朝阳区大新路123号'
			},
			returnStore: {
				name: '西安鼓楼门店',
				address: '陕西省西安市碑林区鼓楼街88号'
			},
			availableTimeRange: {
				start: '2025-12-05',
				end: '2025-12-30'
			}
		};

		// 更新特惠套餐数据
		specialOfferData.value = {
			offerId: mockData.offerId,
			fixedRentalDays: mockData.fixedRentalDays,
			packagePrice: mockData.packagePrice,
			originalPrice: mockData.originalPrice,
			availableTimeRange: mockData.availableTimeRange
		};

		// 更新订单数据
		orderData.value.vehicleName = mockData.vehicle.name;
		orderData.value.vehicleType = mockData.vehicle.type;
		orderData.value.vehicleImage = mockData.vehicle.image;
		orderData.value.seats = mockData.vehicle.seats;
		orderData.value.beds = mockData.vehicle.beds;
		orderData.value.pickupLocation = `${mockData.pickupStore.name} - ${mockData.pickupStore.address}`;
		orderData.value.returnLocation = `${mockData.returnStore.name} - ${mockData.returnStore.address}`;

		// 设置默认取车时间为可选时间段的第一天
		orderData.value.pickupDate = mockData.availableTimeRange.start;
		orderData.value.pickupTime = '09:00';

		// 计算还车时间
		calculateReturnDateTime();

		uni.hideLoading();
	} catch (error) {
		console.error('加载特惠套餐失败:', error);
		uni.hideLoading();
		uni.showToast({
			title: '加载失败',
			icon: 'none'
		});
	}
};

const handleCouponSelected = (coupon: any) => {
	if (isSpecialOffer.value) return;
	selectedCoupon.value = coupon || null;
	console.log('选中优惠券:', coupon);
};

const setupOrderPage = (options: any) => {
	if (options.type === 'special-offer' && options.offerId) {
		orderType.value = 'special-offer';
		loadSpecialOfferData(options.offerId);
		selectedCoupon.value = null;
	} else if (options.vehicleId) {
		orderType.value = 'normal';
		orderData.value.vehicleId = options.vehicleId;
		// TODO: 根据vehicleId加载车辆信息
		console.log('加载常规订单确认页:', options.vehicleId);
	}

	if (!couponListener) {
		couponListener = handleCouponSelected;
		uni.$on('couponSelected', couponListener);
	}

	resetRenterForm();
	if (contactList.value.length) {
		tryPrefillFromContacts();
	} else {
		loadContacts();
	}
	loadRentalNotices();
	noticeAgreed.value = false;

	pageReady.value = true;
};

const ensureAuth = (options: any) => {
	redirectUrl.value = buildRedirectUrl('/pages/order/confirm', options || {});
	if (isLoggedIn()) {
		return true;
	}
	return requireLogin(redirectUrl.value);
};

onLoad((options: any) => {
	cachedRouteParams = options || {};
	pageReady.value = false;
	if (!ensureAuth(cachedRouteParams)) {
		return;
	}
	setupOrderPage(cachedRouteParams);
});

onShow(() => {
	if (!pageReady.value && cachedRouteParams && isLoggedIn()) {
		setupOrderPage(cachedRouteParams);
	}
});

// 页面卸载时移除监听
onUnmounted(() => {
	if (couponListener) {
		uni.$off('couponSelected', couponListener);
		couponListener = null;
	}
});

const selectInsurance = (index: number) => {
	selectedInsurance.value = index;
};

const toggleService = (index: number) => {
	additionalServices.value[index].selected = !additionalServices.value[index].selected;
};

const openDetailPopup = (payload: { title: string; subtitle?: string; content: string }) => {
	detailPopup.value = {
		visible: true,
		title: payload.title,
		subtitle: payload.subtitle || '',
		content: payload.content || '暂无详情信息'
	};
};

const closeDetailPopup = () => {
	detailPopup.value.visible = false;
};

const selectCoupon = () => {
	if (isSpecialOffer.value) {
		uni.showToast({
			title: '特惠套餐不支持使用优惠券',
			icon: 'none'
		});
		return;
	}
	// 跳转到优惠券选择页面
	uni.navigateTo({
		url: `/pages/order/select-coupon?amount=${totalPrice.value}&selectedId=${selectedCoupon.value?.id || ''}&productType=vehicle`
	});
};

const handleSubmit = async () => {
	if (!isLoggedIn()) {
		requireLogin(redirectUrl.value);
		return;
	}
	if (!validateRenterForm()) {
		return;
	}
	if (!noticeAgreed.value) {
		uni.showToast({
			title: '请先阅读并同意租车须知',
			icon: 'none'
		});
		return;
	}
	// 特惠套餐验证取车时间
	if (isSpecialOffer.value) {
		const pickupDate = new Date(orderData.value.pickupDate);
		const startDate = new Date(specialOfferData.value.availableTimeRange.start);
		const endDate = new Date(specialOfferData.value.availableTimeRange.end);

		if (pickupDate < startDate || pickupDate > endDate) {
			uni.showToast({
				title: '请选择有效的取车日期',
				icon: 'none'
			});
			return;
		}
	}

	const contactId = await persistContactIfNeeded();
	const renterInfo = {
		id: contactId,
		contactId,
		name: renterForm.value.name.trim(),
		phone: renterForm.value.phone.trim(),
		driverLicenseNo: renterForm.value.driverLicenseNo.trim(),
		driverLicenseFront: renterForm.value.driverLicenseFront,
		driverLicenseBack: renterForm.value.driverLicenseBack
	};

	// 模拟生成订单号
	const now = Date.now();
	const orderNo = 'DD' + now;
	const mockOrder = {
		orderId: `mock-${now}`,
		orderNo,
		statusId: 1,
		status: { code: 'pending_payment', name: '待支付' },
		orderType: isSpecialOffer.value ? 'special-offer' : 'vehicle',
		pickupTime: `${orderData.value.pickupDate}T${orderData.value.pickupTime}:00`,
		returnTime: `${orderData.value.returnDate}T${orderData.value.returnTime}:00`,
		pickupStore: { name: orderData.value.pickupLocation },
		returnStore: { name: orderData.value.returnLocation },
		totalAmount: totalPrice.value,
		actualAmount: totalPrice.value,
		vehicle: {
			id: orderData.value.vehicleId,
			name: orderData.value.vehicleName,
			model: orderData.value.vehicleType,
			images: [orderData.value.vehicleImage]
		},
		contactInfo: renterInfo,
		agreements: {
			rentalNoticeVersion: rentalNotice.value.version,
			rentalNoticeAcceptedAt: new Date().toISOString()
		}
	};
	registerMockOrder(mockOrder);

	uni.showLoading({ title: '提交中...' });

	setTimeout(() => {
		uni.hideLoading();

		// 跳转到支付页面
		uni.navigateTo({
			url: `/pages/order/pay?orderNo=${orderNo}&amount=${totalPrice.value}`
		});
	}, 1000);
};
</script>

<style scoped lang="scss">
.order-confirm-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	display: flex;
	flex-direction: column;
}

.content-scroll {
	flex: 1;
	height: 0;
}

.section {
	background-color: #FFFFFF;
	padding: $uni-spacing-lg;
	margin-bottom: $uni-spacing-md;
	border-radius: $uni-radius-lg;
	box-shadow: $uni-shadow-card;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: $uni-text-color;
	margin-bottom: $uni-spacing-md;
	position: relative;
	padding-left: $uni-spacing-md;

	&::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 6rpx;
		height: 28rpx;
		background: $uni-color-primary-gradient;
		border-radius: 3rpx;
	}
}

// 车辆信息
.vehicle-info {
	display: flex;
	gap: $uni-spacing-md;
	padding: 20rpx;
	background: linear-gradient(135deg, #FFF9F0 0%, #FFFFFF 100%);
	border-radius: $uni-radius-sm;
	border: 1rpx solid #FFE8CC;
}

.vehicle-image {
	width: 160rpx;
	height: 120rpx;
	border-radius: $uni-radius-sm;
	background-color: #F5F5F5;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.vehicle-details {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: $uni-spacing-sm;
}

.vehicle-name {
	font-size: 30rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.vehicle-spec {
	font-size: 24rpx;
	color: $uni-text-color-placeholder;
}

// 租赁信息
.rental-info {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

// 租期概览
.rental-duration {
	display: flex;
	align-items: center;
	gap: $uni-spacing-md;
	padding: 20rpx;
	background: linear-gradient(135deg, #FFF5E9 0%, #FFFBF5 100%);
	border-radius: $uni-radius-sm;
	border: 2rpx solid #FFE4C4;
}

.duration-icon {
	width: 48rpx;
	height: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: $uni-color-primary-gradient;
	border-radius: 50%;
	box-shadow: 0 4rpx 12rpx rgba(255, 159, 41, 0.3);
}

.duration-info {
	flex: 1;
	display: flex;
	align-items: baseline;
	gap: $uni-spacing-sm;
	flex-wrap: wrap;
}

.duration-label {
	font-size: 26rpx;
	color: $uni-text-color-secondary;
}

.duration-value {
	font-size: 36rpx;
	font-weight: bold;
	color: $uni-color-primary;
}

.duration-tip {
	font-size: 22rpx;
	color: $uni-text-color-placeholder;
	margin-left: $uni-spacing-xs;
}

// 取车时间选择器（特惠套餐）
.pickup-time-selector {
	margin-top: $uni-spacing-md;
	padding: $uni-spacing-md;
	background: linear-gradient(135deg, #FFF9F0 0%, #FFFFFF 100%);
	border-radius: $uni-radius-sm;
	border: 2rpx solid #FFE8CC;
}

.selector-title {
	display: flex;
	align-items: center;
	gap: $uni-spacing-xs;
	margin-bottom: $uni-spacing-sm;
}

.title-text {
	font-size: 28rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.selector-tip {
	display: flex;
	align-items: center;
	gap: $uni-spacing-xs;
	margin-bottom: 20rpx;
	padding: $uni-spacing-sm;
	background-color: rgba(255, 159, 41, 0.1);
	border-radius: $uni-radius-xs;
}

.tip-text {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
	line-height: 1.5;
}

.time-picker-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx;
	margin-bottom: $uni-spacing-sm;
	background-color: #FFFFFF;
	border-radius: $uni-radius-sm;
	border: 1rpx solid $uni-border-color-light;
	transition: all 0.3s ease;

	&:active {
		background-color: $uni-bg-color;
		border-color: $uni-color-primary;
	}

	&:last-of-type {
		margin-bottom: 0;
	}
}

.picker-label {
	display: flex;
	align-items: center;
	gap: $uni-spacing-xs;
}

.label-text {
	font-size: 28rpx;
	color: $uni-text-color-secondary;
}

.picker-value {
	display: flex;
	align-items: center;
	gap: $uni-spacing-xs;
}

.value-text {
	font-size: 28rpx;
	color: $uni-text-color;
	font-weight: 500;
}

.auto-calc-tip {
	display: flex;
	align-items: flex-start;
	gap: 8rpx;
	margin-top: 16rpx;
	padding: 12rpx;
	background-color: rgba(76, 175, 80, 0.1);
	border-radius: 8rpx;
	border-left: 4rpx solid #4CAF50;
}

.calc-tip-text {
	flex: 1;
	font-size: 28rpx;
	color: $uni-text-color;
	line-height: 1.5;
	font-weight: 500;
}

// 时间线
.rental-timeline {
	display: flex;
	flex-direction: column;
	gap: 0;
	margin-top: 24rpx;
}

.timeline-item {
	display: flex;
	gap: 16rpx;
	position: relative;
	padding-bottom: 32rpx;
	
	&:last-child {
		padding-bottom: 0;
		
		.timeline-dot::after {
			display: none;
		}
	}
}

.timeline-dot {
	width: 32rpx;
	height: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	flex-shrink: 0;
	margin-top: 4rpx;
	
	&::after {
		content: '';
		position: absolute;
		top: 32rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 2rpx;
		height: 100%;
		background: linear-gradient(180deg, #E0E0E0 0%, #F5F5F5 100%);
	}
}

.dot-inner {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
	box-shadow: 0 0 0 4rpx rgba(76, 175, 80, 0.15);
}

.timeline-item.return .dot-inner {
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	box-shadow: 0 0 0 4rpx rgba(255, 159, 41, 0.15);
}

.timeline-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.timeline-header {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.timeline-title {
	font-size: 28rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.timeline-badge {
	margin-left: 8rpx;
	padding: 4rpx 12rpx;
	font-size: 20rpx;
	color: #FF9F29;
	background-color: rgba(255, 159, 41, 0.1);
	border-radius: 6rpx;
	font-weight: 500;
}

.timeline-detail {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	padding-left: 26rpx;
}

.detail-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.detail-text {
	font-size: 26rpx;
	color: $uni-text-color-secondary;
	line-height: 1.5;
}

// 特惠套餐重要提示
.special-notice {
	display: flex;
	align-items: flex-start;
	gap: 8rpx;
	margin-top: 24rpx;
	padding: 16rpx;
	background: linear-gradient(135deg, rgba(255, 159, 41, 0.1) 0%, rgba(255, 184, 77, 0.05) 100%);
	border-radius: $uni-radius-sm;
	border-left: 4rpx solid #FF9F29;
}

.notice-text {
	flex: 1;
	font-size: 24rpx;
	color: $uni-text-color-secondary;
	line-height: 1.6;
}

// 保险方案
.insurance-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.insurance-item {
	padding: 24rpx;
	display: flex;
	align-items: center;
	gap: 16rpx;
	border: 2rpx solid #E0E0E0;
	border-radius: $uni-radius-sm;
	background-color: #FFFFFF;
	transition: all 0.3s ease;
	
	&.selected {
		border-color: transparent;
		background: linear-gradient(white, white) padding-box,
		            linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%) border-box;
		box-shadow: 0 4rpx 16rpx rgba(255, 159, 41, 0.15);
		
		.insurance-name {
			color: #FF9F29;
		}
	}
}

.insurance-select {
	width: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.insurance-main {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.insurance-name-box {
	display: flex;
	align-items: baseline;
	gap: 12rpx;
}

.insurance-name {
	font-size: 28rpx;
	font-weight: bold;
	color: $uni-text-color;
	transition: color 0.3s ease;
}

.insurance-price {
	font-size: 24rpx;
	color: $uni-color-primary;
	font-weight: 600;
}

.insurance-desc {
	font-size: 24rpx;
	color: $uni-text-color-placeholder;
	line-height: 1.6;
}

.insurance-detail-trigger {
	display: flex;
	align-items: center;
	gap: 4rpx;
	color: $uni-text-color-placeholder;
	padding-left: 8rpx;
}

.insurance-detail-text {
	font-size: 24rpx;
	color: $uni-text-color-placeholder;
}

// 附加服务
.services-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.service-item {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
	
	&:last-child {
		border-bottom: none;
	}
}

.service-select {
	width: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.service-info {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
	flex: 1;
}

.service-name {
	font-size: 28rpx;
	color: $uni-text-color;
}

.service-price {
	font-size: 24rpx;
	color: $uni-text-color-placeholder;
}

.service-detail-trigger {
	display: flex;
	align-items: center;
	gap: 4rpx;
	color: $uni-text-color-placeholder;
	padding-left: 12rpx;
}

.service-detail-text {
	font-size: 24rpx;
	color: $uni-text-color-placeholder;
}

.renter-section {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.contact-selector {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 24rpx;
	background-color: #fff7ed;
	border-radius: $uni-radius-sm;
	border: 1rpx solid rgba(255, 159, 41, 0.3);
}

.selector-left {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.selector-label {
	font-size: 26rpx;
	color: $uni-text-color-secondary;
}

.selector-action {
	display: flex;
	align-items: center;
	gap: 8rpx;
	color: $uni-text-color;
	font-size: 26rpx;
	font-weight: 500;
}

.action-text {
	max-width: 320rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.contact-helper {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 24rpx;
	color: $uni-text-color-placeholder;
}

.helper-link {
	color: $uni-color-primary;
}

.helper-tip {
	color: $uni-text-color-placeholder;
}

.renter-form {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.form-item {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.form-label {
	font-size: 26rpx;
	color: $uni-text-color-secondary;
}

.license-upload {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.license-grid {
	display: flex;
	gap: 20rpx;
	flex-wrap: wrap;
}

.upload-item {
	flex: 1;
	min-width: 45%;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.upload-label {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 26rpx;
	color: $uni-text-color-secondary;
}

.upload-tip {
	font-size: 22rpx;
	color: $uni-text-color-placeholder;
}

.license-card {
	padding: 20rpx;
	border: 1rpx dashed rgba(255, 159, 41, 0.5);
	border-radius: $uni-radius-sm;
	background-color: #fffaf4;
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.license-content {
	position: relative;
	height: 180rpx;
	border-radius: $uni-radius-sm;
	overflow: hidden;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
}

.license-image {
	width: 100%;
	height: 100%;
}

.license-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	color: $uni-text-color-placeholder;
	font-size: 26rpx;
}

.license-mask {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.4);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	color: #fff;
	font-size: 24rpx;
}

.license-ops {
	display: flex;
	align-items: center;
	gap: 24rpx;
	flex-wrap: wrap;
	justify-content: flex-start;
	font-size: 24rpx;
	color: $uni-color-primary;
}

.op-link {
	color: $uni-color-primary;
}

.op-link.danger {
	color: #f56c6c;
}

.notice-section {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.notice-brief {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12rpx;
}

.brief-info {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.brief-title {
	font-size: 30rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.brief-version {
	font-size: 24rpx;
	color: $uni-text-color-placeholder;
}

.brief-action {
	display: flex;
	align-items: center;
	gap: 6rpx;
	font-size: 26rpx;
	color: $uni-color-primary;
	padding: 8rpx 12rpx;
	border-radius: 999rpx;
	background-color: rgba(255, 159, 41, 0.1);
}

.brief-action .action-text {
	font-size: 26rpx;
	color: inherit;
}

.notice-loading {
	display: flex;
	align-items: center;
	gap: 12rpx;
	font-size: 24rpx;
	color: $uni-text-color-placeholder;
}

.notice-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.notice-block {
	padding: 24rpx;
	border-radius: $uni-radius-sm;
	border: 1rpx solid #f0f0f0;
	background-color: #fdfdfd;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.notice-block-header {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.notice-block-title {
	font-size: 28rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.notice-highlight {
	font-size: 24rpx;
	color: #ff9f29;
	background-color: rgba(255, 159, 41, 0.12);
	padding: 6rpx 12rpx;
	border-radius: 8rpx;
}

.notice-summary {
	font-size: 24rpx;
	color: $uni-text-color-secondary;
	line-height: 1.5;
}

.notice-items {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.notice-item {
	display: flex;
	align-items: flex-start;
	gap: 12rpx;
}

.item-badge {
	font-size: 22rpx;
	color: #ff9f29;
	background-color: rgba(255, 159, 41, 0.15);
	padding: 4rpx 12rpx;
	border-radius: 999rpx;
}

.item-desc {
	flex: 1;
	font-size: 24rpx;
	color: #555;
	line-height: 1.6;
}

.notice-paragraphs {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.paragraph-text {
	font-size: 24rpx;
	color: #555;
	line-height: 1.6;
}

.notice-empty {
	padding: 24rpx;
	border-radius: $uni-radius-sm;
	background-color: #f9fafb;
	text-align: center;
	color: $uni-text-color-placeholder;
	font-size: 24rpx;
}

.notice-meta {
	font-size: 22rpx;
	color: $uni-text-color-placeholder;
	text-align: right;
}

.notice-agreement {
	display: flex;
	align-items: center;
	gap: 12rpx;
	padding: 20rpx;
	background-color: #fff7ed;
	border: 1rpx dashed rgba(255, 159, 41, 0.5);
	border-radius: $uni-radius-sm;
	font-size: 24rpx;
	color: #555;
}

.notice-agreement text {
	flex: 1;
	line-height: 1.5;
}

.notice-popup-overlay {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.4);
	display: flex;
	align-items: flex-end;
	justify-content: center;
	padding: 40rpx 32rpx;
	z-index: 210;
}

.notice-popup-container {
	width: 100%;
	background-color: #fff;
	border-radius: 24rpx 24rpx 0 0;
	padding: 32rpx;
	box-shadow: 0 -12rpx 24rpx rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	max-height: 90vh;
}

.notice-popup-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.notice-popup-body {
	flex: 1;
	max-height: 60vh;
}

.notice-popup-btn {
	width: 100%;
	height: 80rpx;
	line-height: 80rpx;
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	color: #FFFFFF;
	border-radius: 40rpx;
	font-size: 28rpx;
	font-weight: bold;
	border: none;
	
	&::after {
		border: none;
	}
}

// 功能详情弹窗
.detail-popup-overlay {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.4);
	display: flex;
	align-items: flex-end;
	justify-content: center;
	padding: 40rpx 32rpx;
	z-index: 200;
}

.detail-popup-container {
	width: 100%;
	background-color: #FFFFFF;
	border-radius: 24rpx 24rpx 0 0;
	padding: 32rpx;
	box-shadow: 0 -12rpx 24rpx rgba(0, 0, 0, 0.1);
}

.detail-popup-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.detail-popup-title {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.popup-title-text {
	font-size: 32rpx;
	font-weight: bold;
	color: $uni-text-color;
}

.popup-subtitle-text {
	font-size: 26rpx;
	color: #FF9F29;
}

.detail-popup-body {
	max-height: 300rpx;
	margin-bottom: 24rpx;
}

.detail-popup-content {
	font-size: 26rpx;
	color: $uni-text-color-secondary;
	line-height: 1.6;
}

.detail-popup-btn {
	width: 100%;
	height: 80rpx;
	line-height: 80rpx;
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	color: #FFFFFF;
	border-radius: 40rpx;
	font-size: 28rpx;
	font-weight: bold;
	border: none;
	
	&::after {
		border: none;
	}
}

// 优惠券
.coupon-section {
	padding: 24rpx 32rpx;
}

.coupon-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.coupon-value {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.coupon-text {
	font-size: 28rpx;
	color: $uni-text-color-placeholder;
}

.savings-tip {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-top: 16rpx;
	padding: 12rpx 16rpx;
	background: linear-gradient(135deg, rgba(82, 196, 26, 0.1) 0%, rgba(82, 196, 26, 0.05) 100%);
	border-radius: 8rpx;
	border-left: 4rpx solid #52C41A;
}

.savings-text {
	font-size: 26rpx;
	color: #52C41A;
	font-weight: 500;
}

// 价格明细
.price-detail {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.detail-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	
	&.discount {
		.detail-value {
			color: #F44336;
		}
	}
	
	&.total {
		padding-top: 16rpx;
		border-top: 1rpx solid #E0E0E0;
		
		.detail-label {
			font-size: 32rpx;
			font-weight: bold;
		}
		
		.detail-value {
			font-size: 36rpx;
			font-weight: bold;
			color: $uni-color-primary;
		}
	}
}

.detail-label {
	font-size: 28rpx;
	color: $uni-text-color-secondary;
}

.detail-value {
	font-size: 28rpx;
	color: $uni-text-color;
}

.bottom-placeholder {
	height: 180rpx;
}

// 底部操作栏
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 32rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 1) 100%);
	backdrop-filter: blur(20rpx);
	border-top: 1rpx solid rgba(0, 0, 0, 0.05);
	box-shadow: 0 -8rpx 24rpx rgba(0, 0, 0, 0.08);
	z-index: 100;
}

.total-info {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.total-label {
	font-size: 24rpx;
	color: $uni-text-color-placeholder;
}

.total-price {
	display: flex;
	align-items: baseline;
	color: $uni-color-primary;
	
	.currency {
		font-size: 24rpx;
		font-weight: bold;
	}
	
	.price {
		font-size: 40rpx;
		font-weight: bold;
		margin-left: 4rpx;
	}
}

.submit-btn {
	margin: 0;
	padding: 0 56rpx;
	height: 88rpx;
	line-height: 88rpx;
	font-size: 32rpx;
	background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
	color: #FFFFFF;
	border-radius: 44rpx;
	font-weight: bold;
	box-shadow: 0 8rpx 24rpx rgba(255, 159, 41, 0.35);
	transition: all 0.3s ease;
	
	&::after {
		border: none;
	}
	
	&:active {
		transform: scale(0.98);
		box-shadow: 0 4rpx 16rpx rgba(255, 159, 41, 0.3);
	}
}
</style>
