/**
 * 支付相关API接口
 */

import { get, post } from '@/utils/request';

/**
 * 创建支付订单
 */
export function createPayment(data: {
    orderId: string;
    paymentMethod: string;
    amount: number;
    splitPayment?: Array<{ method: string; amount: number }>;
}) {
    return post('/payments', data);
}

/**
 * 查询支付状态
 */
export function getPaymentStatus(paymentNo: string) {
    return get(`/payments/${paymentNo}/status`);
}

/**
 * 获取用户钱包余额
 */
export function getWalletBalance() {
    return get('/users/wallet');
}
