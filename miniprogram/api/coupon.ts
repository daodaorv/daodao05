/**
 * 优惠券相关API接口
 * 包含特惠商城、我的优惠券、邀请中心等功能的接口
 */

import { get, post } from '@/utils/request';

// ==================== 优惠券商城接口 ====================

/**
 * 获取优惠券列表
 * @param params 查询参数
 */
export function getCoupons(params?: {
    category?: string;
    page?: number;
    pageSize?: number;
}) {
    return get('/api/v1/coupons', params);
}

/**
 * 获取优惠券详情
 * @param id 优惠券ID
 */
export function getCouponDetail(id: string) {
    return get(`/api/v1/coupons/${id}`);
}

/**
 * 领取优惠券（免费/积分/现金/组合）
 * @param id 优惠券ID
 * @param params 领取参数
 */
export function claimCoupon(id: string, params?: {
    usePoints?: number;
    payAmount?: number;
    paymentMethod?: string;
}) {
    return post(`/api/v1/coupons/${id}/claim`, params);
}

/**
 * 获取优惠券分类
 */
export function getCouponCategories() {
    return get('/api/v1/coupons/categories');
}

/**
 * 检查优惠券可用性
 * @param params 检查参数
 */
export function checkCouponAvailability(params: {
    couponId: string;
    orderId?: string;
    orderAmount?: number;
}) {
    return post('/api/v1/coupons/check-availability', params);
}

// ==================== 我的优惠券接口 ====================

/**
 * 获取我的优惠券列表
 * @param params 查询参数
 */
export function getMyCoupons(params?: {
    status?: 'unused' | 'used' | 'expired';
    page?: number;
    pageSize?: number;
}) {
    return get('/api/v1/coupons/my', params);
}

/**
 * 分享优惠券
 * @param id 优惠券ID
 */
export function shareCoupon(id: string) {
    return post(`/api/v1/coupons/${id}/share`);
}

// ==================== 邀请中心接口 ====================

/**
 * 生成邀请码
 */
export function generateInviteCode() {
    return post('/api/v1/invite/generate-code');
}

/**
 * 获取邀请统计
 */
export function getInviteStats() {
    return get('/api/v1/invite/stats');
}

/**
 * 获取邀请记录
 * @param params 查询参数
 */
export function getInviteRecords(params?: {
    page?: number;
    pageSize?: number;
}) {
    return get('/api/v1/invite/records', params);
}

// ==================== 兼容旧接口（保留） ====================

/**
 * 获取可用优惠券（旧接口，保留兼容）
 */
export function getAvailableCoupons(params: {
    orderAmount: number;
    vehicleId?: string;
    category?: string;
}) {
    return get('/coupons/available', params);
}
