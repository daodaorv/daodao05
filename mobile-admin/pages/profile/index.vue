<template>
  <view class="profile-container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-avatar">
        <image :src="userInfo.avatar" mode="aspectFill" />
      </view>
      <view class="user-info">
        <text class="user-name">{{ userInfo.name }}</text>
        <text class="user-role">{{ getRoleText(userInfo.role) }}</text>
      </view>
      <view class="user-edit" @click="editProfile">
        <text>编辑</text>
      </view>
    </view>

    <!-- 数据统计 -->
    <view class="stats-section">
      <view class="stat-item">
        <text class="stat-value">{{ stats.todayOrders }}</text>
        <text class="stat-label">今日订单</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.monthOrders }}</text>
        <text class="stat-label">本月订单</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.totalOrders }}</text>
        <text class="stat-label">总订单</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-group">
        <view class="menu-item" @click="navigateTo('/pages/profile/settings')">
          <view class="menu-icon">⚙️</view>
          <text class="menu-label">系统设置</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="navigateTo('/pages/profile/notifications')">
          <view class="menu-icon">🔔</view>
          <text class="menu-label">通知设置</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="navigateTo('/pages/profile/security')">
          <view class="menu-icon">🔒</view>
          <text class="menu-label">账号安全</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-item" @click="navigateTo('/pages/profile/sync')">
          <view class="menu-icon">🔄</view>
          <text class="menu-label">数据同步</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="navigateTo('/pages/profile/help')">
          <view class="menu-icon">❓</view>
          <text class="menu-label">帮助中心</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="navigateTo('/pages/profile/about')">
          <view class="menu-icon">ℹ️</view>
          <text class="menu-label">关于我们</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="clearCache">
          <view class="menu-icon">🗑️</view>
          <text class="menu-label">清除缓存</text>
          <text class="menu-value">{{ cacheSize }}</text>
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-item" @click="handleLogout">
          <view class="menu-icon">🚪</view>
          <text class="menu-label logout">退出登录</text>
        </view>
      </view>
    </view>

    <!-- 版本信息 -->
    <view class="version-info">
      <text>版本号: v1.0.0</text>
    </view>
  </view>
</template>

<script>
import { getUserInfo, logout } from '@/api/auth'
import { getStorage, clearStorage } from '@/utils/storage'

export default {
  data() {
    return {
      userInfo: {
        id: 1,
        name: '张经理',
        role: 'manager',
        avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      },
      stats: {
        todayOrders: 28,
        monthOrders: 156,
        totalOrders: 1234
      },
      cacheSize: '12.5MB'
    }
  },

  onLoad() {
    this.loadUserInfo()
    this.loadStats()
    this.calculateCacheSize()
  },

  onShow() {
    // 页面显示时刷新用户信息
    this.loadUserInfo()
  },

  methods: {
    async loadUserInfo() {
      try {
        const data = await getUserInfo()
        this.userInfo = data
      } catch (error) {
        console.error('加载用户信息失败:', error)
      }
    },

    async loadStats() {
      try {
        // 这里应该调用API加载统计数据
        // 暂时使用模拟数据
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }
    },

    calculateCacheSize() {
      try {
        const info = uni.getStorageInfoSync()
        const size = (info.currentSize / 1024).toFixed(1)
        this.cacheSize = `${size}MB`
      } catch (error) {
        console.error('计算缓存大小失败:', error)
      }
    },

    navigateTo(url) {
      uni.navigateTo({
        url: url
      })
    },

    editProfile() {
      uni.navigateTo({
        url: '/pages/profile/edit'
      })
    },

    clearCache() {
      uni.showModal({
        title: '清除缓存',
        content: '确定要清除所有缓存数据吗？',
        success: (res) => {
          if (res.confirm) {
            try {
              // 保留登录信息
              const token = getStorage('token')
              const userInfo = getStorage('userInfo')

              // 清除所有缓存
              clearStorage()

              // 恢复登录信息
              if (token) {
                uni.setStorageSync('token', token)
              }
              if (userInfo) {
                uni.setStorageSync('userInfo', userInfo)
              }

              uni.showToast({
                title: '缓存已清除',
                icon: 'success'
              })

              this.calculateCacheSize()
            } catch (error) {
              uni.showToast({
                title: '清除失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },

    handleLogout() {
      uni.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await logout()

              // 清除本地存储
              clearStorage()

              uni.showToast({
                title: '已退出登录',
                icon: 'success'
              })

              // 跳转到登录页
              setTimeout(() => {
                uni.reLaunch({
                  url: '/pages/login/login'
                })
              }, 1500)
            } catch (error) {
              uni.showToast({
                title: '退出失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },

    getRoleText(role) {
      const roleMap = {
        admin: '超级管理员',
        manager: '门店经理',
        staff: '门店员工',
        service: '客服人员'
      }
      return roleMap[role] || '未知角色'
    }
  }
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

/* 用户信息卡片 */
.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60rpx 40rpx;
  display: flex;
  align-items: center;
  color: #fff;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 30rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.user-avatar image {
  width: 100%;
  height: 100%;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
}

.user-role {
  font-size: 26rpx;
  opacity: 0.9;
}

.user-edit {
  padding: 12rpx 32rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 40rpx;
  font-size: 26rpx;
}

/* 数据统计 */
.stats-section {
  display: flex;
  background: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 40rpx 0;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  border-right: 1px solid #eee;
}

.stat-item:last-child {
  border-right: none;
}

.stat-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 26rpx;
  color: #999;
}

/* 功能菜单 */
.menu-section {
  padding: 0 20rpx;
}

.menu-group {
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 32rpx 30rpx;
  border-bottom: 1px solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 24rpx;
}

.menu-label {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}

.menu-label.logout {
  color: #f56c6c;
  text-align: center;
}

.menu-value {
  font-size: 26rpx;
  color: #999;
  margin-right: 12rpx;
}

.menu-arrow {
  font-size: 40rpx;
  color: #ccc;
}

/* 版本信息 */
.version-info {
  text-align: center;
  padding: 40rpx 0;
  font-size: 24rpx;
  color: #999;
}
</style>
