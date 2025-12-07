/**
 * 规则管理 Mock 数据
 * 专注租车须知（取还车流程 + 预定须知）
 */

type ProductType = 'vehicle' | 'special-offer';

interface RentalRuleTemplate {
	productType: ProductType;
	version: string;
	sections: Array<{
		id: string;
		title: string;
		summary?: string;
		highlight?: string;
		items?: Array<{ title: string; description: string }>;
		paragraphs?: string[];
	}>;
}

const rentalRuleTemplates: Record<ProductType, RentalRuleTemplate> = {
	vehicle: {
		productType: 'vehicle',
		version: '2024-12-06',
		sections: [
			{
				id: 'handover-process',
				title: '取还车流程手续',
				summary: '到场需持本人身份证、驾驶证原件，遵循门店审核流程完成取还车。',
				highlight: '晚还超过30分钟将按照1小时计费，请提前联系我们申请延长。',
				items: [
					{
						title: '01 到店核验',
						description: '提前15分钟到店，出示身份证/驾驶证原件，完成人脸核验并缴纳押金。'
					},
					{
						title: '02 车辆查验',
						description: '与门店共同完成车辆内外观检查，记录油量/公里数，确认附加设备。'
					},
					{
						title: '03 还车交付',
						description: '按预约时间归还，补齐油量并完成二次查验，确认无违章或附加费用后退还押金。'
					}
				]
			},
			{
				id: 'booking-terms',
				title: '预定须知',
				summary: '请务必阅读完整的租车合同及特殊订单说明，提交订单即视为同意以下条款。',
				paragraphs: [
					'• 订单一经确认即锁定车辆，行程变更需提前72小时联系客服处理，逾期将按合同违约规则执行；',
					'• 需具备有效期内 C1 及以上准驾车型驾驶证，驾龄不少于2年；',
					'• 如遇道路救援、保险理赔等情况，请第一时间联系叨叨房车客服，不得擅自维修；',
					'• 特殊节假日、长线自驾需签署补充协议，押金及违约规则以协议为准。'
				]
			}
		]
	},
	'special-offer': {
		productType: 'special-offer',
		version: '2024-12-06-SO',
		sections: [
			{
				id: 'handover-process',
				title: '取还车流程手续（特惠）',
				summary: '固定门店、固定时段办理，务必按预约时间到店；逾时可能自动取消优惠资格。',
				highlight: '特惠套餐不支持异地还车及时间调整，如需更改需转为常规定价重新计费。',
				items: [
					{
						title: '01 到店排队',
						description: '凭订单二维码在特惠专属窗口排队，逾时15分钟需重新取号。'
					},
					{
						title: '02 快速验车',
						description: '执行快速查验流程，仅支持基础设备调整，如需额外服务请提前备注。'
					},
					{
						title: '03 定点还车',
						description: '返程需回到原门店指定通道，工作人员根据套餐规则确认油量与里程。'
					}
				]
			},
			{
				id: 'booking-terms',
				title: '预定须知（特惠）',
				summary: '提交订单默认同意特惠活动条款，取消/改期需遵循活动专属规则。',
				paragraphs: [
					'• 活动车辆、行程、门店均为固定配置，不支持自定义；',
					'• 特惠订单需一次性支付全款，支付后不可部分退款；',
					'• 如因个人原因无法按时取车，视为主动放弃优惠，不退返差价；',
					'• 其余保险、押金、违约责任沿用叨叨房车标准租车合同。'
				]
			}
		]
	}
};

export const ruleData = {
	getRentalRules(params?: { productType?: ProductType }) {
		const type = params?.productType === 'special-offer' ? 'special-offer' : 'vehicle';
		const payload = rentalRuleTemplates[type];
		return {
			code: 0,
			message: 'success',
			data: {
				...payload,
				fetchedAt: new Date().toISOString()
			}
		};
	}
};

