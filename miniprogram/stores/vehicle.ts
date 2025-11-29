/**
 * 车辆状态管理
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getVehicles, getVehicleDetail, favoriteVehicle, getFavoriteVehicles } from '@/api/vehicle';

export const useVehicleStore = defineStore('vehicle', () => {
    // 状态
    const vehicleList = ref<any[]>([]);
    const currentVehicle = ref<any>(null);
    const searchParams = ref<any>({});
    const favoriteIds = ref<string[]>([]);

    // 获取车辆列表
    const fetchVehicles = async (params: any) => {
        try {
            searchParams.value = params;
            const res = await getVehicles(params);
            if (res.code === 0) {
                vehicleList.value = res.data.list;
                return res.data;
            }
            return null;
        } catch (error) {
            console.error('获取车辆列表失败:', error);
            return null;
        }
    };

    // 获取车辆详情
    const fetchVehicleDetail = async (id: string) => {
        try {
            const res = await getVehicleDetail(id);
            if (res.code === 0) {
                currentVehicle.value = res.data;
                return res.data;
            }
            return null;
        } catch (error) {
            console.error('获取车辆详情失败:', error);
            return null;
        }
    };

    // 获取收藏列表
    const fetchFavoriteVehicles = async (params?: { page?: number; limit?: number }) => {
        try {
            const res = await getFavoriteVehicles(params);
            if (res.code === 0) {
                // 如果是第一页，覆盖列表；否则追加（这里简化处理，假设组件处理分页或每次全量）
                // 实际业务中可能需要维护一个 separate list for favorites page
                // 但考虑到 vehicleList 是通用的，我们可能需要一个专门的 favoritesList state
                // 或者直接返回数据给组件处理
                return res.data;
            }
            return null;
        } catch (error) {
            console.error('获取收藏列表失败:', error);
            return null;
        }
    };

    // 切换收藏
    const toggleFavorite = async (vehicleId: string) => {
        try {
            const res = await favoriteVehicle(vehicleId);
            if (res.code === 0) {
                const index = favoriteIds.value.indexOf(vehicleId);
                if (index > -1) {
                    favoriteIds.value.splice(index, 1);
                } else {
                    favoriteIds.value.push(vehicleId);
                }
                // 保存到本地存储
                uni.setStorageSync('favoriteIds', JSON.stringify(favoriteIds.value));
                return res.data.favorited;
            }
            return false;
        } catch (error) {
            console.error('收藏操作失败:', error);
            return false;
        }
    };

    // 检查是否已收藏
    const isFavorite = (vehicleId: string) => {
        return favoriteIds.value.includes(vehicleId);
    };

    // 初始化收藏列表
    const initFavorites = () => {
        const saved = uni.getStorageSync('favoriteIds');
        if (saved) {
            favoriteIds.value = JSON.parse(saved);
        }
    };

    // 清空列表
    const clearList = () => {
        vehicleList.value = [];
    };

    return {
        // 状态
        vehicleList,
        currentVehicle,
        searchParams,
        favoriteIds,
        // 方法
        fetchVehicles,
        fetchVehicleDetail,
        fetchFavoriteVehicles,
        toggleFavorite,
        isFavorite,
        initFavorites,
        clearList
    };
});
