/**
 * 优惠券相关Mock数据
 */

// 优惠券类型定义
export interface CouponData {
	id: string;
	name: string;
	type: 'discount' | 'rate' | 'daily' | 'service' | 'special';
	amount: number;
	condition: string;
	scope: string;
	validity: string;
	description: string;
	stackRule: string;
	specialLimit?: string;
	price: number;
	pointsPrice: number;
	stock?: number;
	limitPerUser?: number;
	claimed: boolean;
	soldOut: boolean;
	isNew: boolean;
	isVip: boolean;
	isHot: boolean;
	badge?: string;
}

// 完整的优惠券数据库
export const mockCoupons: CouponData[] = [
	{
		id: '1',
		name: '房车租赁50元满减券',
		type: 'discount',
		amount: 50,
		condition: '满500元可用',
		scope: '适用于所有房车租赁订单',
		validity: '领取后30天内有效',
		description: '本优惠券适用于所有房车租赁订单,满500元即可使用,立减50元。新用户首次租车专享优惠,让您的房车之旅更加实惠。',
		stackRule: '不可与其他满减券叠加使用,可与会员折扣叠加',
		specialLimit: '仅限新用户首单使用,每人限领1次',
		price: 0,
		pointsPrice: 0,
		stock: 1000,
		limitPerUser: 1,
		claimed: false,
		soldOut: false,
		isNew: true,
		isVip: false,
		isHot: true,
		badge: '新人专享'
	},
	{
		id: '2',
		name: '房车租赁100元满减券',
		type: 'discount',
		amount: 100,
		condition: '满1000元可用',
		scope: '适用于所有房车租赁订单',
		validity: '领取后30天内有效',
		description: '本优惠券适用于所有房车租赁订单,满1000元即可使用,立减100元。适合长期租赁用户,让您的旅行更加经济实惠。',
		stackRule: '不可与其他满减券叠加使用,可与会员折扣叠加',
		price: 0,
		pointsPrice: 300,
		stock: 500,
		limitPerUser: 2,
		claimed: false,
		soldOut: false,
		isNew: false,
		isVip: false,
		isHot: true
	},
	{
		id: '3',
		name: '9折优惠券',
		type: 'rate',
		amount: 9,
		condition: '全场通用',
		scope: '所有订单',
		validity: '领取后15天内有效',
		description: '全场通用9折优惠券,适用于所有房车租赁订单。会员专属福利,让您享受更多优惠。折扣后价格更实惠,是长期租赁的最佳选择。',
		stackRule: '不可与其他折扣券叠加,可与满减券叠加使用',
		price: 0,
		pointsPrice: 200,
		limitPerUser: 1,
		claimed: false,
		soldOut: false,
		isNew: false,
		isVip: true,
		isHot: true,
		badge: '会员专属'
	},
	{
		id: '4',
		name: '8.5折优惠券',
		type: 'rate',
		amount: 8.5,
		condition: '全场通用',
		scope: '所有订单',
		validity: '领取后15天内有效',
		description: '全场通用8.5折优惠券,适用于所有房车租赁订单。高级会员专属福利,折扣力度更大,适合高端车型租赁。',
		stackRule: '不可与其他折扣券叠加,可与满减券叠加使用',
		specialLimit: '仅限高级会员使用',
		price: 0,
		pointsPrice: 500,
		limitPerUser: 1,
		claimed: false,
		soldOut: false,
		isNew: false,
		isVip: true,
		isHot: false
	},
	{
		id: '5',
		name: '日租抵扣券30元',
		type: 'daily',
		amount: 30,
		condition: '每日租金抵扣',
		scope: '房车租赁',
		validity: '领取后60天内有效',
		description: '每日租金抵扣30元,适用于所有房车租赁订单。可与其他优惠券叠加使用,让您的每一天都更实惠。长期租赁用户的最佳选择。',
		stackRule: '可与其他优惠券叠加使用',
		price: 0,
		pointsPrice: 150,
		limitPerUser: 3,
		claimed: false,
		soldOut: false,
		isNew: false,
		isVip: false,
		isHot: true
	},
	{
		id: '6',
		name: '门店服务费减免券',
		type: 'service',
		amount: 200,
		condition: '减免门店服务费',
		scope: '房车租赁',
		validity: '领取后90天内有效',
		description: '减免门店服务费200元,适用于所有房车租赁订单。包含车辆清洁、检查、交接等服务费用,让您的租车体验更加省心。',
		stackRule: '可与其他优惠券叠加使用',
		price: 0,
		pointsPrice: 400,
		limitPerUser: 1,
		claimed: false,
		soldOut: false,
		isNew: false,
		isVip: false,
		isHot: false
	},
	{
		id: '7',
		name: '异地还车费减免券',
		type: 'service',
		amount: 300,
		condition: '减免异地还车费',
		scope: '房车租赁',
		validity: '领取后90天内有效',
		description: '减免异地还车费300元,适用于跨城市还车的订单。让您的旅行路线更加灵活,不必担心额外的还车费用。',
		stackRule: '可与其他优惠券叠加使用',
		specialLimit: '仅限跨城市还车订单使用',
		price: 0,
		pointsPrice: 600,
		limitPerUser: 1,
		claimed: false,
		soldOut: false,
		isNew: false,
		isVip: false,
		isHot: false
	},
	{
		id: '8',
		name: '生日特权券',
		type: 'special',
		amount: 8,
		condition: '生日当月专属',
		scope: '所有订单',
		validity: '生日当月有效',
		description: '生日当月专属8折优惠券,是我们送给您的生日礼物。在您的生日月份享受特别优惠,让您的生日旅行更加难忘。',
		stackRule: '不可与其他折扣券叠加,可与满减券叠加使用',
		specialLimit: '仅限生日当月使用,需完成实名认证',
		price: 0,
		pointsPrice: 0,
		limitPerUser: 1,
		claimed: false,
		soldOut: false,
		isNew: false,
		isVip: false,
		isHot: false
	},
	{
		id: '9',
		name: '房车租赁200元满减券',
		type: 'discount',
		amount: 200,
		condition: '满2000元可用',
		scope: '房车租赁',
		validity: '领取后30天内有效',
		description: '本优惠券适用于所有房车租赁订单,满2000元即可使用,立减200元。适合长期租赁和高端车型,让您的旅行更加超值。',
		stackRule: '不可与其他满减券叠加使用,可与会员折扣叠加',
		price: 19.9,
		pointsPrice: 0,
		stock: 200,
		limitPerUser: 1,
		claimed: false,
		soldOut: false,
		isNew: false,
		isVip: false,
		isHot: true
	},
	{
		id: '10',
		name: '房车租赁150元满减券',
		type: 'discount',
		amount: 150,
		condition: '满1500元可用',
		scope: '房车租赁',
		validity: '领取后30天内有效',
		description: '本优惠券适用于所有房车租赁订单,满1500元即可使用,立减150元。组合购买更优惠,积分+现金的方式让您省钱又实惠。',
		stackRule: '不可与其他满减券叠加使用,可与会员折扣叠加',
		price: 9.9,
		pointsPrice: 100,
		stock: 300,
		limitPerUser: 2,
		claimed: false,
		soldOut: false,
		isNew: false,
		isVip: false,
		isHot: true
	}
];

/**
 * 根据ID获取优惠券详情
 */
export function getCouponById(id: string): CouponData | undefined {
	return mockCoupons.find(coupon => coupon.id === id);
}

/**
 * 根据类型筛选优惠券
 */
export function getCouponsByType(type: string): CouponData[] {
	if (type === 'all') {
		return mockCoupons;
	}
	return mockCoupons.filter(coupon => coupon.type === type);
}

/**
 * 获取热门优惠券
 */
export function getHotCoupons(): CouponData[] {
	return mockCoupons.filter(coupon => coupon.isHot);
}

/**
 * 获取新人专享优惠券
 */
export function getNewUserCoupons(): CouponData[] {
	return mockCoupons.filter(coupon => coupon.isNew);
}

/**
 * 获取会员专属优惠券
 */
export function getVipCoupons(): CouponData[] {
	return mockCoupons.filter(coupon => coupon.isVip);
}

/**
 * 模拟领取优惠券（免费领取）
 */
export function claimCoupon(id: string): boolean {
	const coupon = getCouponById(id);
	if (coupon && !coupon.claimed && !coupon.soldOut) {
		// 检查是否需要积分或现金
		if (coupon.price > 0 || coupon.pointsPrice > 0) {
			return false; // 需要购买，不能直接领取
		}

		coupon.claimed = true;
		if (coupon.stock !== undefined) {
			coupon.stock--;
			if (coupon.stock <= 0) {
				coupon.soldOut = true;
			}
		}
		return true;
	}
	return false;
}

/**
 * 模拟购买优惠券（现金购买）
 * @param id 优惠券ID
 * @param payAmount 支付金额
 * @returns 购买结果
 */
export function buyCoupon(id: string, payAmount: number): { success: boolean; message: string } {
	const coupon = getCouponById(id);

	if (!coupon) {
		return { success: false, message: '优惠券不存在' };
	}

	if (coupon.claimed) {
		return { success: false, message: '您已领取过该优惠券' };
	}

	if (coupon.soldOut) {
		return { success: false, message: '优惠券已售罄' };
	}

	// 检查支付金额是否正确
	if (coupon.price > 0 && payAmount < coupon.price) {
		return { success: false, message: `支付金额不足，需要支付¥${coupon.price}` };
	}

	// 购买成功
	coupon.claimed = true;
	if (coupon.stock !== undefined) {
		coupon.stock--;
		if (coupon.stock <= 0) {
			coupon.soldOut = true;
		}
	}

	return { success: true, message: '购买成功' };
}

/**
 * 模拟积分兑换优惠券
 * @param id 优惠券ID
 * @param userPoints 用户当前积分
 * @returns 兑换结果
 */
export function exchangeCouponWithPoints(id: string, userPoints: number): { success: boolean; message: string; pointsUsed?: number } {
	const coupon = getCouponById(id);

	if (!coupon) {
		return { success: false, message: '优惠券不存在' };
	}

	if (coupon.claimed) {
		return { success: false, message: '您已领取过该优惠券' };
	}

	if (coupon.soldOut) {
		return { success: false, message: '优惠券已售罄' };
	}

	// 检查积分是否足够
	if (coupon.pointsPrice > 0 && userPoints < coupon.pointsPrice) {
		return { success: false, message: `积分不足，需要${coupon.pointsPrice}积分` };
	}

	// 兑换成功
	coupon.claimed = true;
	if (coupon.stock !== undefined) {
		coupon.stock--;
		if (coupon.stock <= 0) {
			coupon.soldOut = true;
		}
	}

	return {
		success: true,
		message: '兑换成功',
		pointsUsed: coupon.pointsPrice
	};
}

/**
 * 模拟组合购买优惠券（积分+现金）
 * @param id 优惠券ID
 * @param userPoints 用户当前积分
 * @param payAmount 支付金额
 * @returns 购买结果
 */
export function buyCouponWithCombo(
	id: string,
	userPoints: number,
	payAmount: number
): { success: boolean; message: string; pointsUsed?: number; amountPaid?: number } {
	const coupon = getCouponById(id);

	if (!coupon) {
		return { success: false, message: '优惠券不存在' };
	}

	if (coupon.claimed) {
		return { success: false, message: '您已领取过该优惠券' };
	}

	if (coupon.soldOut) {
		return { success: false, message: '优惠券已售罄' };
	}

	// 检查积分和现金是否都满足
	if (coupon.pointsPrice > 0 && userPoints < coupon.pointsPrice) {
		return { success: false, message: `积分不足，需要${coupon.pointsPrice}积分` };
	}

	if (coupon.price > 0 && payAmount < coupon.price) {
		return { success: false, message: `支付金额不足，需要支付¥${coupon.price}` };
	}

	// 购买成功
	coupon.claimed = true;
	if (coupon.stock !== undefined) {
		coupon.stock--;
		if (coupon.stock <= 0) {
			coupon.soldOut = true;
		}
	}

	return {
		success: true,
		message: '购买成功',
		pointsUsed: coupon.pointsPrice,
		amountPaid: coupon.price
	};
}

/**
 * 模拟赠送优惠券
 * @param id 优惠券ID
 * @param fromUserId 赠送者ID
 * @param toUserId 接收者ID
 * @returns 赠送结果
 */
export function giftCoupon(
	id: string,
	fromUserId: string,
	toUserId: string
): { success: boolean; message: string } {
	const coupon = getCouponById(id);

	if (!coupon) {
		return { success: false, message: '优惠券不存在' };
	}

	// 检查优惠券是否支持赠送（这里简化处理，实际应该在优惠券数据中添加 canGift 字段）
	if (coupon.specialLimit && coupon.specialLimit.includes('不可转赠')) {
		return { success: false, message: '该优惠券不支持赠送' };
	}

	// 模拟赠送成功
	return {
		success: true,
		message: '赠送成功，对方将在"我的优惠券"中收到'
	};
}

/**
 * 检查优惠券是否可用
 * @param id 优惠券ID
 * @param orderAmount 订单金额
 * @returns 检查结果
 */
export function checkCouponAvailability(
	id: string,
	orderAmount: number
): { available: boolean; message: string } {
	const coupon = getCouponById(id);

	if (!coupon) {
		return { available: false, message: '优惠券不存在' };
	}

	if (!coupon.claimed) {
		return { available: false, message: '您还未领取该优惠券' };
	}

	// 检查使用条件（简化处理，实际应该解析 condition 字段）
	if (coupon.type === 'discount') {
		// 满减券：检查订单金额是否满足条件
		const minAmount = parseInt(coupon.condition.match(/\d+/)?.[0] || '0');
		if (orderAmount < minAmount) {
			return { available: false, message: `订单金额需满${minAmount}元才能使用` };
		}
	}

	return { available: true, message: '优惠券可用' };
}

export default {
	mockCoupons,
	getCouponById,
	getCouponsByType,
	getHotCoupons,
	getNewUserCoupons,
	getVipCoupons,
	claimCoupon,
	buyCoupon,
	exchangeCouponWithPoints,
	buyCouponWithCombo,
	giftCoupon,
	checkCouponAvailability
};
