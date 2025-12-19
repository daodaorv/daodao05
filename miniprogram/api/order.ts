/**
 * 订单相关API接口
 */

import { request } from '@/utils/request';

// ==================== Mock 数据 ====================

// Mock 订单状态列表
const mockStatusList = [
    { code: 'pending_payment', name: '待付款' },
    { code: 'pending_confirmation', name: '待确认' },
    { code: 'pending_pickup', name: '待取车' },
    { code: 'in_progress', name: '租赁中' },
    { code: 'pending_return', name: '待还车' },
    { code: 'completed', name: '已完成' },
    { code: 'cancelled', name: '已取消' }
];

// 导入类型定义
import type { Vehicle, Store, OrderStatus } from '@/types/order'

// Mock 订单数据
interface MockOrderRecord {
    id: string;
    orderNo: string;
    status: OrderStatus;
    statusId?: number;
    vehicle?: Vehicle | null;
    pickupStore?: Store | null;
    returnStore?: Store | null;
    pickupTime?: string;
    returnTime?: string;
    totalAmount: number;
    actualAmount: number;
    depositAmount?: number;
    createdAt: string;
    isRated?: boolean;
}

const mockOrders: MockOrderRecord[] = [
    {
        id: 'order_001',
        orderNo: 'DD202512010001',
        status: { code: 'pending_payment', name: '待付款' },
        vehicle: {
            id: 'vehicle_001',
            name: '依维柯欧胜C型房车',
            images: ['/static/logo.png'],
            specifications: {
                seats: 4,
                fuelType: '柴油',
                transmission: '手动'
            }
        },
        pickupStore: {
            id: 'store_001',
            name: '杭州西湖门店'
        },
        returnStore: {
            id: 'store_001',
            name: '杭州西湖门店'
        },
        pickupTime: '2025-12-05T10:00:00',
        returnTime: '2025-12-08T18:00:00',
        totalAmount: 2880,
        actualAmount: 1280,
        depositAmount: 5000,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小时前
        isRated: false
    },
    {
        id: 'order_002',
        orderNo: 'DD202511280002',
        status: { code: 'pending_confirmation', name: '待确认' },
        vehicle: {
            id: 'vehicle_002',
            name: '大通V90房车',
            images: ['/static/logo.png'],
            specifications: {
                seats: 6,
                fuelType: '柴油',
                transmission: '自动'
            }
        },
        pickupStore: {
            id: 'store_002',
            name: '上海浦东门店'
        },
        returnStore: {
            id: 'store_003',
            name: '苏州工业园门店'
        },
        pickupTime: '2025-12-10T09:00:00',
        returnTime: '2025-12-15T17:00:00',
        totalAmount: 4500,
        actualAmount: 4500,
        depositAmount: 8000,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1天前
        isRated: false
    },
    {
        id: 'order_003',
        orderNo: 'DD202511250003',
        status: { code: 'in_progress', name: '租赁中' },
        vehicle: {
            id: 'vehicle_003',
            name: '福特全顺B型房车',
            images: ['/static/logo.png'],
            specifications: {
                seats: 4,
                fuelType: '汽油',
                transmission: '自动'
            }
        },
        pickupStore: {
            id: 'store_001',
            name: '杭州西湖门店'
        },
        returnStore: {
            id: 'store_001',
            name: '杭州西湖门店'
        },
        pickupTime: '2025-11-28T10:00:00',
        returnTime: '2025-12-03T18:00:00',
        totalAmount: 3200,
        actualAmount: 3200,
        depositAmount: 6000,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4天前
        isRated: false
    },
    {
        id: 'order_004',
        orderNo: 'DD202511200004',
        status: { code: 'completed', name: '已完成' },
        vehicle: {
            id: 'vehicle_004',
            name: '奔驰斯宾特房车',
            images: ['/static/logo.png'],
            specifications: {
                seats: 6,
                fuelType: '柴油',
                transmission: '自动'
            }
        },
        pickupStore: {
            id: 'store_002',
            name: '上海浦东门店'
        },
        returnStore: {
            id: 'store_002',
            name: '上海浦东门店'
        },
        pickupTime: '2025-11-15T09:00:00',
        returnTime: '2025-11-20T17:00:00',
        totalAmount: 6800,
        actualAmount: 6800,
        depositAmount: 10000,
        createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), // 11天前
        isRated: false
    },
    {
        id: 'order_005',
        orderNo: 'DD202511100005',
        status: { code: 'cancelled', name: '已取消' },
        vehicle: {
            id: 'vehicle_005',
            name: '江铃特顺房车',
            images: ['/static/logo.png'],
            specifications: {
                seats: 4,
                fuelType: '柴油',
                transmission: '手动'
            }
        },
        pickupStore: {
            id: 'store_003',
            name: '苏州工业园门店'
        },
        returnStore: {
            id: 'store_003',
            name: '苏州工业园门店'
        },
        pickupTime: '2025-11-25T10:00:00',
        returnTime: '2025-11-28T18:00:00',
        totalAmount: 1980,
        actualAmount: 1980,
        depositAmount: 4000,
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21天前
        isRated: false
    }
];

// ==================== 动态 Mock 订单 ====================

export function registerMockOrder(order: Partial<MockOrderRecord> & { orderNo: string }): MockOrderRecord {
    const existing = mockOrders.find(o => o.orderNo === order.orderNo);
    const normalized: MockOrderRecord = {
        id: order.id || `order_${Date.now()}`,
        orderNo: order.orderNo,
        status: order.status || { code: 'pending_payment', name: '待支付' },
        statusId: order.statusId ?? 1,
        pickupTime: order.pickupTime || new Date().toISOString(),
        returnTime: order.returnTime || order.pickupTime || new Date().toISOString(),
        totalAmount: order.totalAmount ?? order.actualAmount ?? 0,
        actualAmount: order.actualAmount ?? order.totalAmount ?? 0,
        depositAmount: order.depositAmount ?? 0,
        createdAt: order.createdAt || new Date().toISOString(),
        ...order
    };

    if (existing) {
        Object.assign(existing, normalized);
        return existing;
    }

    mockOrders.unshift(normalized);
    return normalized;
}

// ==================== API 函数 ====================

/**
 * 计算订单价格
 */
export function calculatePrice(data: import('@/types/order').CalculatePriceParams) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                code: 0,
                message: 'success',
                data: {
                    rentalFee: 2400,
                    insuranceFee: 300,
                    serviceFee: 180,
                    depositAmount: 5000,
                    totalAmount: 2880
                }
            });
        }, 500);
    });
}

/**
 * 创建订单
 */
export function createOrder(data: import('@/types/order').CreateOrderParams) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newOrder = {
                id: 'order_' + Date.now(),
                orderNo: 'DD' + Date.now(),
                ...data,
                status: { code: 'pending_payment', name: '待付款' },
                createdAt: new Date().toISOString()
            };
            resolve({
                code: 0,
                message: 'success',
                data: newOrder
            });
        }, 800);
    });
}

/**
 * 获取用户订单列表
 */
export function getOrders(params?: {
    status?: string;
    page?: number;
    limit?: number;
}) {
    return getUserOrders(params);
}

/**
 * 获取用户订单列表（别名）
 */
export function getUserOrders(params?: {
    status?: string;
    page?: number;
    limit?: number;
}) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const { status, page = 1, limit = 10 } = params || {};

            // 根据状态筛选
            let filteredOrders = mockOrders;
            if (status) {
                filteredOrders = mockOrders.filter(order => order.status.code === status);
            }

            // 分页
            const start = (page - 1) * limit;
            const end = start + limit;
            const paginatedOrders = filteredOrders.slice(start, end);

            resolve({
                code: 0,
                message: 'success',
                data: {
                    orders: paginatedOrders,
                    pagination: {
                        current: page,
                        pageSize: limit,
                        total: filteredOrders.length,
                        pages: Math.ceil(filteredOrders.length / limit)
                    }
                }
            });
        }, 600);
    });
}

/**
 * 获取订单状态列表
 */
export function getOrderStatusList() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                code: 0,
                message: 'success',
                data: mockStatusList
            });
        }, 300);
    });
}

/**
 * 获取订单详情
 * @param orderId 订单ID或订单编号
 */
export function getOrderDetail(orderId: string) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 支持通过订单ID或订单编号查询
            const order = mockOrders.find(o => o.id === orderId || o.orderNo === orderId);
            if (order) {
                resolve({
                    code: 0,
                    message: 'success',
                    data: order
                });
            } else {
                reject({
                    code: 404,
                    message: '订单不存在'
                });
            }
        }, 500);
    });
}

/**
 * 取消订单
 */
export function cancelOrder(orderId: string, reason?: string) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const order = mockOrders.find(o => o.id === orderId);
            if (order) {
                if (order.status.code === 'pending_payment' || order.status.code === 'pending_confirmation') {
                    order.status = { code: 'cancelled', name: '已取消' };
                    resolve({
                        code: 0,
                        message: '订单已取消',
                        data: { success: true }
                    });
                } else {
                    reject({
                        code: 400,
                        message: '当前订单状态不允许取消'
                    });
                }
            } else {
                reject({
                    code: 404,
                    message: '订单不存在'
                });
            }
        }, 800);
    });
}

/**
 * 删除订单
 */
export function deleteOrder(orderId: string) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = mockOrders.findIndex(o => o.id === orderId);
            if (index !== -1) {
                const order = mockOrders[index];
                if (order.status.code === 'cancelled') {
                    mockOrders.splice(index, 1);
                    resolve({
                        code: 0,
                        message: '订单已删除',
                        data: { success: true }
                    });
                } else {
                    reject({
                        code: 400,
                        message: '只能删除已取消的订单'
                    });
                }
            } else {
                reject({
                    code: 404,
                    message: '订单不存在'
                });
            }
        }, 500);
    });
}

/**
 * 更新订单状态
 */
export function updateOrderStatus(orderNo: string, status: string) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const order = mockOrders.find(o => o.orderNo === orderNo);
            if (order) {
                // 状态映射
                const statusMap: Record<string, { code: string; name: string }> = {
                    'pending_payment': { code: 'pending_payment', name: '待付款' },
                    'pending_confirmation': { code: 'pending_confirmation', name: '待确认' },
                    'pending_pickup': { code: 'pending_pickup', name: '待取车' },
                    'in_progress': { code: 'in_progress', name: '租赁中' },
                    'pending_return': { code: 'pending_return', name: '待还车' },
                    'completed': { code: 'completed', name: '已完成' },
                    'cancelled': { code: 'cancelled', name: '已取消' }
                };
                const statusIdMap: Record<string, number> = {
                    'pending_payment': 1,
                    'pending_confirmation': 2,
                    'pending_pickup': 3,
                    'in_progress': 4,
                    'pending_return': 5,
                    'completed': 6,
                    'cancelled': 7
                };

                if (statusMap[status]) {
                    order.status = statusMap[status];
                    order.statusId = statusIdMap[status] ?? order.statusId;
                    resolve({
                        code: 0,
                        message: '订单状态更新成功',
                        data: {
                            success: true,
                            orderNo,
                            status: statusMap[status],
                            updatedAt: new Date().toISOString()
                        }
                    });
                } else {
                    reject({
                        code: 400,
                        message: '无效的订单状态'
                    });
                }
            } else {
                reject({
                    code: 404,
                    message: '订单不存在'
                });
            }
        }, 300);
    });
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
    deleteOrder,
    updateOrderStatus,
    registerMockOrder
};

export default orderApi;
