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
          <text class="id-card">身份证: {{ maskIdCard(contact.idCard) }}</text>
        </view>
        <view class="actions">
          <view class="action-btn edit" @tap="handleEdit(contact)">
            <u-icon name="compose" size="20" color="#666"></u-icon>
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
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useContactStore } from '@/stores/contact';

const contactStore = useContactStore();
const contacts = ref<any[]>([]);
const loading = ref(true);

// 加载联系人
const loadContacts = async () => {
  loading.value = true;
  const res = await contactStore.fetchContacts();
  if (res) {
    contacts.value = res;
  }
  loading.value = false;
};

onShow(() => {
  loadContacts();
});

// 添加联系人
const handleAdd = () => {
  uni.navigateTo({
    url: '/pages/profile/contact-edit'
  });
};

// 编辑联系人
const handleEdit = (contact: any) => {
  uni.navigateTo({
    url: `/pages/profile/contact-edit?id=${contact.id}`
  });
};

// 删除联系人
const handleDelete = (contact: any) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该联系人吗？',
    success: async (res) => {
      if (res.confirm) {
        const success = await contactStore.removeContact(contact.id);
        if (success) {
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          });
          loadContacts();
        } else {
          uni.showToast({
            title: '删除失败',
            icon: 'none'
          });
        }
      }
    }
  });
};

// 身份证脱敏
const maskIdCard = (idCard: string) => {
  if (!idCard) return '';
  return idCard.replace(/^(.{4})(?:\d+)(.{4})$/, '$1******$2');
};
</script>

<style scoped lang="scss">
.contacts-page {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding-bottom: 120rpx;
}

.contact-list {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.contact-item {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.tag {
  font-size: 20rpx;
  color: #FF9F29;
  background-color: rgba(255, 159, 41, 0.1);
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
}

.phone {
  font-size: 28rpx;
  color: #666;
}

.id-card {
  font-size: 24rpx;
  color: #999;
}

.actions {
  display: flex;
  gap: 32rpx;
}

.action-btn {
  padding: 16rpx;
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
    margin-bottom: 32rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

.footer-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background-color: #FFFFFF;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.add-btn {
  background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
  color: #FFFFFF;
  font-size: 32rpx;
  border-radius: 44rpx;
  height: 88rpx;
  line-height: 88rpx;
  
  &::after {
    border: none;
  }
}
</style>
