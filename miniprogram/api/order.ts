/**
 * 订单相关API接口
 */

import { get, post, del } from '@/utils/request';

/**
 * 计算订单价格
 */
export function calculatePrice(data: any) {
    return post('/orders/calculate-price', data);
}

/**
 * 创建订单
 */
export function createOrder(data: any) {
    return post('/orders', data);
}

/**
 * 获取用户订单列表
 */
export function getOrders(params?: {
    status?: string;
    page?: number;
    limit?: number;
}) {
    return get('/orders', params);
}

/**
 * 获取用户订单列表（别名）
 */
export function getUserOrders(params?: {
    status?: string;
    page?: number;
    limit?: number;
}) {
    return get('/orders', params);
}

/**
 * 获取订单状态列表
 */
export function getOrderStatusList() {
    return get('/orders/status-list');
}

/**
 * 获取订单详情
 */
export function getOrderDetail(orderId: string) {
    return get(`/orders/${orderId}`);
}

/**
 * 取消订单
 */
export function cancelOrder(orderId: string, reason?: string) {
    return post(`/orders/${orderId}/cancel`, { reason });
}

/**
 * 删除订单
 */
export function deleteOrder(orderId: string) {
    return del(`/orders/${orderId}`);
}

// 默认导出对象，方便使用 orderApi.xxx() 的方式调用
export const orderApi = {
    calculatePrice,
    createOrder,
    getOrders,
    getUserOrders,
    getOrderStatusList,
    getOrderDetail,
    cancelOrder,
    deleteOrder
};

export default orderApi;
