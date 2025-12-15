<template>
  <view class="settings-container">
    <!-- 通用设置 -->
    <view class="settings-section">
      <view class="section-title">通用设置</view>
      <view class="settings-group">
        <view class="setting-item" @click="navigateToNotifications">
          <view class="setting-left">
            <text class="setting-icon">🔔</text>
            <text class="setting-label">通知设置</text>
          </view>
          <view class="setting-right">
            <text class="setting-value">{{ notificationStatus }}</text>
            <text class="setting-arrow">›</text>
          </view>
        </view>

        <view class="setting-item" @click="showLanguageSelector">
          <view class="setting-left">
            <text class="setting-icon">🌐</text>
            <text class="setting-label">语言设置</text>
          </view>
          <view class="setting-right">
            <text class="setting-value">{{ currentLanguage }}</text>
            <text class="setting-arrow">›</text>
          </view>
        </view>

        <view class="setting-item">
          <view class="setting-left">
            <text class="setting-icon">📱</text>
            <text class="setting-label">自动更新</text>
          </view>
          <view class="setting-right">
            <switch :checked="settings.autoUpdate" @change="handleAutoUpdateChange" color="#667eea" />
          </view>
        </view>
      </view>
    </view>

    <!-- 显示设置 -->
    <view class="settings-section">
      <view class="section-title">显示设置</view>
      <view class="settings-group">
        <view class="setting-item" @click="showThemeSelector">
          <view class="setting-left">
            <text class="setting-icon">🎨</text>
            <text class="setting-label">主题模式</text>
          </view>
          <view class="setting-right">
            <text class="setting-value">{{ currentTheme }}</text>
            <text class="setting-arrow">›</text>
          </view>
        </view>

        <view class="setting-item" @click="showFontSizeSelector">
          <view class="setting-left">
            <text class="setting-icon">🔤</text>
            <text class="setting-label">字体大小</text>
          </view>
          <view class="setting-right">
            <text class="setting-value">{{ currentFontSize }}</text>
            <text class="setting-arrow">›</text>
          </view>
        </view>

        <view class="setting-item">
          <view class="setting-left">
            <text class="setting-icon">💾</text>
            <text class="setting-label">省流量模式</text>
          </view>
          <view class="setting-right">
            <switch :checked="settings.dataSaver" @change="handleDataSaverChange" color="#667eea" />
          </view>
        </view>
      </view>
    </view>

    <!-- 隐私设置 -->
    <view class="settings-section">
      <view class="section-title">隐私设置</view>
      <view class="settings-group">
        <view class="setting-item">
          <view class="setting-left">
            <text class="setting-icon">📍</text>
            <text class="setting-label">位置服务</text>
          </view>
          <view class="setting-right">
            <switch :checked="settings.locationService" @change="handleLocationServiceChange" color="#667eea" />
          </view>
        </view>

        <view class="setting-item">
          <view class="setting-left">
            <text class="setting-icon">📊</text>
            <text class="setting-label">数据统计</text>
          </view>
          <view class="setting-right">
            <switch :checked="settings.analytics" @change="handleAnalyticsChange" color="#667eea" />
          </view>
        </view>

        <view class="setting-item" @click="clearCache">
          <view class="setting-left">
            <text class="setting-icon">🗑️</text>
            <text class="setting-label">清除缓存</text>
          </view>
          <view class="setting-right">
            <text class="setting-value">{{ cacheSize }}</text>
            <text class="setting-arrow">›</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 关于 -->
    <view class="settings-section">
      <view class="section-title">关于</view>
      <view class="settings-group">
        <view class="setting-item" @click="checkUpdate">
          <view class="setting-left">
            <text class="setting-icon">🔄</text>
            <text class="setting-label">检查更新</text>
          </view>
          <view class="setting-right">
            <text class="setting-value">v{{ version }}</text>
            <text class="setting-arrow">›</text>
          </view>
        </view>

        <view class="setting-item" @click="viewPrivacyPolicy">
          <view class="setting-left">
            <text class="setting-icon">📄</text>
            <text class="setting-label">隐私政策</text>
          </view>
          <view class="setting-right">
            <text class="setting-arrow">›</text>
          </view>
        </view>

        <view class="setting-item" @click="viewUserAgreement">
          <view class="setting-left">
            <text class="setting-icon">📋</text>
            <text class="setting-label">用户协议</text>
          </view>
          <view class="setting-right">
            <text class="setting-arrow">›</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 主题选择器 -->
    <u-action-sheet :show="showThemeSheet" :actions="themeActions" @close="showThemeSheet = false" @select="handleThemeSelect" title="选择主题模式"></u-action-sheet>

    <!-- 语言选择器 -->
    <u-action-sheet :show="showLanguageSheet" :actions="languageActions" @close="showLanguageSheet = false" @select="handleLanguageSelect" title="选择语言"></u-action-sheet>

    <!-- 字体大小选择器 -->
    <u-action-sheet :show="showFontSizeSheet" :actions="fontSizeActions" @close="showFontSizeSheet = false" @select="handleFontSizeSelect" title="选择字体大小"></u-action-sheet>
  </view>
</template>

<script>
import { getStorage, setStorage } from '@/utils/storage'

export default {
  data() {
    return {
      version: '1.0.0',
      cacheSize: '0MB',
      settings: {
        theme: 'light', // light, dark, auto
        language: 'zh-CN', // zh-CN, en-US
        fontSize: 'medium', // small, medium, large
        autoUpdate: true,
        dataSaver: false,
        locationService: true,
        analytics: true,
        notifications: {
          enabled: true,
          sound: true,
          vibrate: true
        }
      },
      showThemeSheet: false,
      showLanguageSheet: false,
      showFontSizeSheet: false,
      themeActions: [
        { name: '浅色模式', value: 'light' },
        { name: '深色模式', value: 'dark' },
        { name: '跟随系统', value: 'auto' }
      ],
      languageActions: [
        { name: '简体中文', value: 'zh-CN' },
        { name: 'English', value: 'en-US' }
      ],
      fontSizeActions: [
        { name: '小', value: 'small' },
        { name: '中', value: 'medium' },
        { name: '大', value: 'large' }
      ]
    }
  },

  computed: {
    currentTheme() {
      const themeMap = {
        light: '浅色模式',
        dark: '深色模式',
        auto: '跟随系统'
      }
      return themeMap[this.settings.theme] || '浅色模式'
    },

    currentLanguage() {
      const languageMap = {
        'zh-CN': '简体中文',
        'en-US': 'English'
      }
      return languageMap[this.settings.language] || '简体中文'
    },

    currentFontSize() {
      const fontSizeMap = {
        small: '小',
        medium: '中',
        large: '大'
      }
      return fontSizeMap[this.settings.fontSize] || '中'
    },

    notificationStatus() {
      return this.settings.notifications.enabled ? '已开启' : '已关闭'
    }
  },

  onLoad() {
    this.loadSettings()
    this.calculateCacheSize()
  },

  methods: {
    loadSettings() {
      const savedSettings = getStorage('app_settings')
      if (savedSettings) {
        this.settings = { ...this.settings, ...savedSettings }
      }
    },

    saveSettings() {
      setStorage('app_settings', this.settings)
      uni.showToast({
        title: '设置已保存',
        icon: 'success',
        duration: 1500
      })
    },

    calculateCacheSize() {
      try {
        const info = uni.getStorageInfoSync()
        const size = (info.currentSize / 1024).toFixed(1)
        this.cacheSize = `${size}MB`
      } catch (error) {
        console.error('计算缓存大小失败:', error)
        this.cacheSize = '0MB'
      }
    },

    // 导航到通知设置
    navigateToNotifications() {
      uni.navigateTo({
        url: '/pages/profile/notifications'
      })
    },

    // 显示主题选择器
    showThemeSelector() {
      this.showThemeSheet = true
    },

    // 处理主题选择
    handleThemeSelect(item) {
      this.settings.theme = item.value
      this.saveSettings()
      this.applyTheme(item.value)
    },

    // 应用主题
    applyTheme(theme) {
      // 这里可以实现主题切换逻辑
      // 例如：修改全局样式变量、切换样式文件等
      console.log('应用主题:', theme)

      // 如果是跟随系统，检测系统主题
      if (theme === 'auto') {
        // uni-app 暂不支持直接获取系统主题，可以使用条件编译
        // #ifdef APP-PLUS
        // 可以通过原生插件获取系统主题
        // #endif
      }
    },

    // 显示语言选择器
    showLanguageSelector() {
      this.showLanguageSheet = true
    },

    // 处理语言选择
    handleLanguageSelect(item) {
      this.settings.language = item.value
      this.saveSettings()

      uni.showModal({
        title: '提示',
        content: '语言切换需要重启应用才能生效',
        showCancel: false
      })
    },

    // 显示字体大小选择器
    showFontSizeSelector() {
      this.showFontSizeSheet = true
    },

    // 处理字体大小选择
    handleFontSizeSelect(item) {
      this.settings.fontSize = item.value
      this.saveSettings()
      this.applyFontSize(item.value)
    },

    // 应用字体大小
    applyFontSize(fontSize) {
      // 这里可以实现字体大小切换逻辑
      // 例如：修改根元素的字体大小
      console.log('应用字体大小:', fontSize)

      const fontSizeMap = {
        small: '28rpx',
        medium: '30rpx',
        large: '32rpx'
      }

      // 可以通过修改全局样式变量来实现
      // 或者使用 uni.setStorageSync 存储，在 App.vue 中读取并应用
    },

    // 自动更新开关
    handleAutoUpdateChange(e) {
      this.settings.autoUpdate = e.detail.value
      this.saveSettings()
    },

    // 省流量模式开关
    handleDataSaverChange(e) {
      this.settings.dataSaver = e.detail.value
      this.saveSettings()

      if (e.detail.value) {
        uni.showToast({
          title: '已开启省流量模式',
          icon: 'success'
        })
      }
    },

    // 位置服务开关
    handleLocationServiceChange(e) {
      this.settings.locationService = e.detail.value
      this.saveSettings()

      if (!e.detail.value) {
        uni.showModal({
          title: '提示',
          content: '关闭位置服务可能影响部分功能使用',
          showCancel: false
        })
      }
    },

    // 数据统计开关
    handleAnalyticsChange(e) {
      this.settings.analytics = e.detail.value
      this.saveSettings()
    },

    // 清除缓存
    clearCache() {
      uni.showModal({
        title: '清除缓存',
        content: '确定要清除所有缓存数据吗？',
        success: (res) => {
          if (res.confirm) {
            try {
              // 保留重要数据
              const token = getStorage('token')
              const userInfo = getStorage('userInfo')
              const appSettings = getStorage('app_settings')

              // 清除所有缓存
              uni.clearStorageSync()

              // 恢复重要数据
              if (token) setStorage('token', token)
              if (userInfo) setStorage('userInfo', userInfo)
              if (appSettings) setStorage('app_settings', appSettings)

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

    // 检查更新
    checkUpdate() {
      uni.showLoading({
        title: '检查中...'
      })

      setTimeout(() => {
        uni.hideLoading()
        uni.showModal({
          title: '检查更新',
          content: '当前已是最新版本',
          showCancel: false
        })
      }, 1500)
    },

    // 查看隐私政策
    viewPrivacyPolicy() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    },

    // 查看用户协议
    viewUserAgreement() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    }
  }
}
</script>

<style scoped>
.settings-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

/* 设置区块 */
.settings-section {
  margin-bottom: 20rpx;
}

.section-title {
  padding: 30rpx 30rpx 20rpx;
  font-size: 26rpx;
  color: #999;
}

.settings-group {
  background: #fff;
  border-radius: 12rpx;
  margin: 0 20rpx;
  overflow: hidden;
}

/* 设置项 */
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 30rpx;
  border-bottom: 1px solid #f5f5f5;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.setting-icon {
  font-size: 40rpx;
  margin-right: 24rpx;
}

.setting-label {
  font-size: 30rpx;
  color: #333;
}

.setting-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.setting-value {
  font-size: 26rpx;
  color: #999;
}

.setting-arrow {
  font-size: 40rpx;
  color: #ccc;
}
</style>
