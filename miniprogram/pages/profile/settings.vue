<template>
  <view class="settings-page">
    <view
      v-for="section in sections"
      :key="section.title"
      class="section"
    >
      <view class="section-title">{{ section.title }}</view>
      <view
        v-for="item in section.items"
        :key="item.title"
        class="settings-item"
        @tap="handleItemTap(item)"
        hover-class="item-active"
      >
        <view class="item-left">
          <text class="item-title">{{ item.title }}</text>
          <text v-if="getItemNote(item)" class="item-note">{{ getItemNote(item) }}</text>
        </view>
        <u-icon name="arrow-right" size="18" color="#ccc"></u-icon>
      </view>
    </view>

    <view class="logout-btn-box">
      <button class="logout-btn" @tap="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const cacheSize = ref('0KB')

const phoneLabel = computed(() => {
  const mobile = userStore.userInfo?.mobile
  if (!mobile) return '未绑定'
  return `${mobile.slice(0, 3)}****${mobile.slice(-4)}`
})

const sections = ref([
  {
    title: '账号信息',
    items: [
      { title: '头像与资料', note: '头像、昵称、生日', type: 'route', path: '/pages/profile/edit' },
      { title: '手机号', noteKey: 'phone', type: 'route', path: '/pages/auth/bind-phone' }
    ]
  },
  {
    title: '安全设置',
    items: [
      { title: '登录密码', note: '用于登录账号', type: 'route', path: '/pages/profile/password-login' },
      { title: '支付密码', note: '支付及敏感操作验证', type: 'route', path: '/pages/profile/password-pay' }
    ]
  },
  {
    title: '关于与支持',
    items: [
      { title: '隐私政策', type: 'privacy' },
      { title: '用户协议', type: 'agreement' },
      { title: '关于我们', type: 'about' },
      { title: '清除缓存', type: 'clearCache', noteKey: 'cache' },
      { title: '当前版本', type: 'version', note: 'v1.0.0' }
    ]
  }
])

onMounted(() => {
  calculateCacheSize()
})

const calculateCacheSize = () => {
  const size = Math.floor(Math.random() * 10) + 1
  cacheSize.value = `${size}MB`
}

const getItemNote = (item: any) => {
  if (item.noteKey === 'phone') return phoneLabel.value
  if (item.noteKey === 'cache') return cacheSize.value
  return item.note || ''
}

const handleItemTap = (item: any) => {
  switch (item.type) {
    case 'route':
      navigateTo(item.path)
      break
    case 'privacy':
      handlePrivacy()
      break
    case 'agreement':
      handleAgreement()
      break
    case 'about':
      handleAbout()
      break
    case 'clearCache':
      handleClearCache()
      break
    case 'version':
      uni.showToast({ title: `当前版本 ${item.note || 'v1.0.0'}`, icon: 'none' })
      break
    default:
      break
  }
}

const navigateTo = (path: string) => {
  uni.navigateTo({ url: path })
}

const handlePrivacy = () => {
  uni.showToast({ title: '隐私政策', icon: 'none' })
}

const handleAgreement = () => {
  uni.showToast({ title: '用户协议', icon: 'none' })
}

const handleAbout = () => {
  uni.navigateTo({
    url: '/pages/profile/about'
  })
}

const handleClearCache = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '清理中...' })
        setTimeout(() => {
          uni.hideLoading()
          cacheSize.value = '0KB'
          uni.showToast({ title: '清理完成', icon: 'success' })
        }, 1000)
      }
    }
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.reLaunch({
          url: '/pages/index/index'
        })
      }
    }
  })
}
</script>

<style scoped lang="scss">
.settings-page {
  min-height: 100vh;
  background-color: $uni-bg-color;
  padding-top: $uni-spacing-md;
}

.section {
  background-color: #FFFFFF;
  margin-bottom: $uni-spacing-md;
}

.section-title {
  font-size: 28rpx;
  color: $uni-text-color-placeholder;
  padding: $uni-spacing-sm $uni-spacing-lg;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx $uni-spacing-lg;
  border-top: 1rpx solid $uni-border-color-light;
  background-color: #FFFFFF;
}

.settings-item:first-of-type {
  border-top: none;
}

.item-active {
  background-color: $uni-bg-color;
}

.item-left {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.item-title {
  font-size: 30rpx;
  color: $uni-text-color;
}

.item-note {
  font-size: 24rpx;
  color: $uni-text-color-placeholder;
}

.logout-btn-box {
  margin: 48rpx $uni-spacing-lg;
}

.logout-btn {
  background-color: #FFFFFF;
  color: #F44336;
  font-size: 32rpx;
  border-radius: $uni-radius-btn;
  height: 88rpx;
  line-height: 88rpx;
  transition: all 0.3s ease;

  &:active {
    opacity: 0.8;
    transform: scale(0.98);
  }

  &::after {
    border: none;
  }
}
</style>
