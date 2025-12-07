/**
 * 规则管理相关接口
 * 当前主要用于获取租车须知内容（取还车流程、预定须知等）
 */

import { get } from '@/utils/request';

export type RentalRuleProductType = 'vehicle' | 'special-offer';

export interface RentalRuleRichItem {
    title: string;
    description: string;
}

export interface RentalRuleSection {
    id: string;
    title: string;
    summary?: string;
    highlight?: string;
    items?: RentalRuleRichItem[];
    paragraphs?: string[];
}

export interface RentalRuleResponse {
    productType: RentalRuleProductType;
    version: string;
    sections: RentalRuleSection[];
}

/**
 * 获取租车须知内容
 * @param params.productType 产品类型（房车租赁 / 特惠租车）
 */
export function getRentalRules(params: { productType: RentalRuleProductType }) {
    return get<RentalRuleResponse>('/rules/rental', params);
}

