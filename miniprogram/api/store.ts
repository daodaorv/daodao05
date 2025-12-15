/**
 * 门店相关API接口
 */

import { get } from '@/utils/request';

/**
 * 获取城市列表
 */
export function getCities() {
    return get('/stores/cities');
}

/**
 * 获取门店列表
 */
export function getStores(cityId: string) {
    return get('/stores', { cityId });
}

/**
 * 获取门店详情
 */
export function getStoreDetail(storeId: string) {
    return get(`/stores/${storeId}`);
}
