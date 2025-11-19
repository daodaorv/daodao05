import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: uni.getStorageSync('token') || '',
    userInfo: uni.getStorageSync('userInfo') || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    setToken(token) {
      this.token = token;
      uni.setStorageSync('token', token);
    },

    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      uni.setStorageSync('userInfo', userInfo);
    },

    logout() {
      this.token = '';
      this.userInfo = null;
      uni.removeStorageSync('token');
      uni.removeStorageSync('userInfo');
    },

    async fetchUserInfo() {
      // TODO: 从API获取用户信息
      try {
        // const result = await authApi.getUserInfo();
        // this.setUserInfo(result.user);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    },
  },
});

