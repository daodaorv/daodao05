<template>
  <view class="contacts-page">
    <view class="contact-list" v-if="contacts.length > 0">
      <view class="contact-item" v-for="contact in contacts" :key="contact.id">
        <view class="contact-info">
          <view class="name-row">
            <text class="name">{{ contact.name }}</text>
            <text class="tag" v-if="contact.isDefault">默认</text>
          </view>
          <text class="phone">{{ contact.phone }}</text>
          <text class="id-card">身份证 {{ maskIdCard(contact.idCard) }}</text>
          <text class="license">驾驶证 {{ maskLicense(contact.driverLicenseNo) }}</text>
        </view>
        <view class="actions">
          <view class="action-btn edit" @tap="handleEdit(contact)">
            <u-icon name="edit-pen" size="20" color="#666"></u-icon>
          </view>
          <view class="action-btn delete" @tap="handleDelete(contact)">
            <u-icon name="trash" size="20" color="#F44336"></u-icon>
          </view>
        </view>
      </view>
    </view>

    <view class="empty-state" v-else-if="!loading">
      <image class="empty-image" src="/static/empty-contacts.png" mode="aspectFit"></image>
      <text class="empty-text">暂无常用联系人</text>
    </view>

    <view class="footer-btn">
      <button class="add-btn" @tap="handleAdd">添加联系人</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useContactStore } from '@/stores/contact'

const contactStore = useContactStore()
const contacts = ref<any[]>([])
const loading = ref(true)

const loadContacts = async () => {
  loading.value = true
  const res = await contactStore.fetchContacts()
  if (res) {
    contacts.value = res
  }
  loading.value = false
}

onShow(() => {
  loadContacts()
})

const handleAdd = () => {
  uni.navigateTo({
    url: '/pages/profile/contact-edit'
  })
}

const handleEdit = (contact: any) => {
  uni.navigateTo({
    url: `/pages/profile/contact-edit?id=${contact.id}`
  })
}

const handleDelete = (contact: any) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该联系人吗？',
    success: async (res) => {
      if (res.confirm) {
        const success = await contactStore.removeContact(contact.id)
        if (success) {
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          })
          loadContacts()
        } else {
          uni.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

const maskIdCard = (idCard: string) => {
  if (!idCard) return ''
  return idCard.replace(/^(.{4})(?:\d+)(.{4})$/, '$1******$2')
}

const maskLicense = (license: string) => {
  if (!license) return ''
  if (license.length <= 4) return '****'
  return `${license.slice(0, 3)}****${license.slice(-2)}`
}
</script>

<style scoped lang="scss">
.contacts-page {
  min-height: 100vh;
  background-color: $uni-bg-color;
  padding-bottom: 120rpx;
}

.contact-list {
  padding: $uni-spacing-md;
  display: flex;
  flex-direction: column;
  gap: $uni-spacing-md;
}

.contact-item {
  background-color: #FFFFFF;
  border-radius: $uni-radius-md;
  padding: $uni-spacing-lg;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: $uni-shadow-sm;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: $uni-spacing-sm;
}

.name-row {
  display: flex;
  align-items: center;
  gap: $uni-spacing-md;
}

.name {
  font-size: 32rpx;
  font-weight: bold;
  color: $uni-text-color;
}

.tag {
  font-size: 20rpx;
  color: $uni-color-primary;
  background-color: rgba(255, 159, 41, 0.1);
  padding: 2rpx $uni-spacing-xs;
  border-radius: $uni-radius-xs;
}

.phone {
  font-size: 28rpx;
  color: $uni-text-color-secondary;
}

.id-card,
.license {
  font-size: 24rpx;
  color: $uni-text-color-placeholder;
}

.actions {
  display: flex;
  gap: $uni-spacing-lg;
}

.action-btn {
  padding: $uni-spacing-md;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 0.6;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;

  .empty-image {
    width: 320rpx;
    height: 320rpx;
    margin-bottom: $uni-spacing-lg;
  }

  .empty-text {
    font-size: 28rpx;
    color: $uni-text-color-placeholder;
  }
}

.footer-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $uni-spacing-md $uni-spacing-lg;
  padding-bottom: calc($uni-spacing-md + env(safe-area-inset-bottom));
  background-color: #FFFFFF;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.add-btn {
  background: $uni-color-primary-gradient;
  color: #FFFFFF;
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
