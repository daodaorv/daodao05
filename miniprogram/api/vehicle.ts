/**
 * 车辆相关API接口
 */

import { get, post } from '@/utils/request';

/**
 * 查询可用房车
 */
export function getVehicles(params: {
    pickupCity: string;
    pickupStoreId: string;
    pickupDate: string;
    returnDate: string;
    returnCity?: string;
    returnStoreId?: string;
    page?: number;
    limit?: number;
}) {
    return get('/vehicles', params);
}

/**
 * 获取房车详情
 */
export function getVehicleDetail(id: string) {
    return get(`/vehicles/${id}`);
}

/**
 * 收藏房车
 */
export function favoriteVehicle(id: string) {
    return post(`/vehicles/${id}/favorite`);
}

/**
 * 获取收藏列表
 */
export function getFavoriteVehicles(params?: { page?: number; limit?: number }) {
    return get('/vehicles/favorites', params);
}

/**
 * 锁定车辆库存
 */
export function lockVehicle(data: {
    vehicleId: string;
    orderNo: string;
    startDate: string;
    endDate: string;
}) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('锁定车辆库存:', data);
            resolve({
                code: 0,
                message: 'success',
                data: {
                    success: true,
                    lockId: 'LOCK' + Date.now(),
                    lockedAt: new Date().toISOString()
                }
            });
        }, 300);
    });
}

/**
 * 释放车辆库存
 */
export function unlockVehicle(lockId: string) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('释放车辆库存:', lockId);
            resolve({
                code: 0,
                message: 'success',
                data: {
                    success: true,
                    unlockedAt: new Date().toISOString()
                }
            });
        }, 300);
    });
}

// 默认导出对象，方便使用 vehicleApi.xxx() 的方式调用
export const vehicleApi = {
    getVehicles,
    getVehicleDetail,
    favoriteVehicle,
    getFavoriteVehicles,
    lockVehicle,
    unlockVehicle
};

export default vehicleApi;
