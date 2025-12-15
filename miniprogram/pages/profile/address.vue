<template>
  <view class="address-page">
    <view class="address-list" v-if="addressList.length">
      <view class="address-card" v-for="item in addressList" :key="item.id">
        <view class="card-header">
          <view class="name">{{ item.name }}</view>
          <text class="tag" v-if="item.tag">{{ item.tag }}</text>
          <text class="default-tag" v-if="item.isDefault">默认</text>
        </view>
        <text class="phone">{{ item.phone }}</text>
        <text class="full-address">{{ formatAddress(item) }}</text>
        <view class="card-actions">
          <view class="action" @tap="handleEdit(item)">
            <u-icon name="edit-pen" size="18" color="#666" />
            <text>编辑</text>
          </view>
          <view class="action delete" @tap="handleDelete(item)">
            <u-icon name="trash" size="18" color="#F56C6C" />
            <text>删除</text>
          </view>
        </view>
      </view>
    </view>

    <view class="empty-state" v-else-if="!loading">
      <image class="empty-image" src="/static/empty-contacts.png" mode="aspectFit" />
      <text class="empty-text">暂未保存收货地址</text>
    </view>

    <view class="footer-btn">
      <button class="add-btn" @tap="handleAdd">新增地址</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useAddressStore } from '@/stores/address'

const addressStore = useAddressStore()
const addressList = ref<any[]>([])
const loading = ref(true)

const loadAddresses = async () => {
  loading.value = true
  const res = await addressStore.fetchAddresses()
  if (res) {
    addressList.value = res
  }
  loading.value = false
}

onShow(() => {
  loadAddresses()
})

const handleAdd = () => {
  uni.navigateTo({
    url: '/pages/profile/address-edit'
  })
}

const handleEdit = (address: any) => {
  uni.navigateTo({
    url: `/pages/profile/address-edit?id=${address.id}`
  })
}

const handleDelete = (address: any) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该地址吗？',
    success: async (res) => {
      if (res.confirm) {
        const success = await addressStore.removeAddress(address.id)
        if (success) {
          uni.showToast({ title: '删除成功', icon: 'success' })
          loadAddresses()
        } else {
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    }
  })
}

const formatAddress = (address: any) => {
  return `${address.province || ''}${address.city || ''}${address.district || ''}${address.detail || ''}`
}
</script>

<style scoped lang="scss">
.address-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 120rpx;
}

.address-list {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.address-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.tag {
  font-size: 20rpx;
  color: #FF9F29;
  background-color: rgba(255, 159, 41, 0.12);
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.default-tag {
  font-size: 20rpx;
  color: #fff;
  background-color: #FF9F29;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.phone {
  font-size: 28rpx;
  color: #666;
}

.full-address {
  font-size: 26rpx;
  color: #999;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  gap: 32rpx;
  margin-top: 12rpx;
}

.action {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 26rpx;
  color: #666;
}

.action.delete {
  color: #F56C6C;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
  gap: 24rpx;
}

.empty-image {
  width: 320rpx;
  height: 320rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.footer-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.add-btn {
  background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
  color: #fff;
  font-size: 32rpx;
  border-radius: 44rpx;
  height: 88rpx;
  line-height: 88rpx;

  &::after {
    border: none;
  }
}
</style>
