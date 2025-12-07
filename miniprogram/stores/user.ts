/**
 * 用户状态管理
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login, getUserProfile, wechatLogin } from '@/api/auth';

export const useUserStore = defineStore('user', () => {
    // 状态
    const token = ref('');
    const refreshToken = ref('');
    const userInfo = ref<any>(null);

    // 计算属性
    const isLoggedIn = computed(() => !!token.value);
    const isPlusMember = computed(() => userInfo.value?.memberLevel === 'PLUS');

    // 初始化:从本地存储恢复
    const parseStoredUserInfo = (stored: any) => {
        if (!stored) return null;
        if (typeof stored === 'string') {
            try {
                return JSON.parse(stored);
            } catch (error) {
                console.warn('[userStore] 解析 userInfo 失败，已清理异常缓存');
                uni.removeStorageSync('userInfo');
                return null;
            }
        }
        return stored;
    };

    const init = () => {
        token.value = uni.getStorageSync('token') || '';
        refreshToken.value = uni.getStorageSync('refreshToken') || '';
        userInfo.value = parseStoredUserInfo(uni.getStorageSync('userInfo'));
    };

    // 登录
    const doLogin = async (phone: string, password: string) => {
        try {
            const res = await login(phone, password);
            if (res.code === 0) {
                token.value = res.data.token;
                refreshToken.value = res.data.refreshToken;
                userInfo.value = res.data.user;

                // 保存到本地存储
                uni.setStorageSync('token', res.data.token);
                uni.setStorageSync('refreshToken', res.data.refreshToken);
                uni.setStorageSync('userInfo', JSON.stringify(res.data.user));

                return true;
            }
            return false;
        } catch (error) {
            console.error('登录失败:', error);
            return false;
        }
    };

    // 微信登录
    const doWechatLogin = async (code: string, userInfoData?: any) => {
        try {
            const res = await wechatLogin(code, userInfoData);
            if (res.code === 0) {
                token.value = res.data.token;
                refreshToken.value = res.data.refreshToken;
                userInfo.value = res.data.user;

                uni.setStorageSync('token', res.data.token);
                uni.setStorageSync('refreshToken', res.data.refreshToken);
                uni.setStorageSync('userInfo', JSON.stringify(res.data.user));

                return true;
            }
            return false;
        } catch (error) {
            console.error('微信登录失败:', error);
            return false;
        }
    };

    // 获取用户信息
    const fetchUserInfo = async () => {
        try {
            const res = await getUserProfile();
            if (res.code === 0) {
                userInfo.value = res.data;
                uni.setStorageSync('userInfo', JSON.stringify(res.data));
                return true;
            }
            return false;
        } catch (error) {
            console.error('获取用户信息失败:', error);
            return false;
        }
    };

    // 退出登录
    const logout = () => {
        token.value = '';
        refreshToken.value = '';
        userInfo.value = null;

        uni.removeStorageSync('token');
        uni.removeStorageSync('refreshToken');
        uni.removeStorageSync('userInfo');
    };

    // 更新用户信息
    const updateUserInfo = (data: any) => {
        userInfo.value = { ...userInfo.value, ...data };
        uni.setStorageSync('userInfo', JSON.stringify(userInfo.value));
    };

    return {
        // 状态
        token,
        refreshToken,
        userInfo,
        // 计算属性
        isLoggedIn,
        isPlusMember,
        // 方法
        init,
        doLogin,
        doWechatLogin,
        fetchUserInfo,
        logout,
        updateUserInfo
    };
});
