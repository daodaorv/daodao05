<template>
  <view class="users-container">
    <view class="search-bar">
      <input v-model="keyword" placeholder="搜索手机号/昵称" @confirm="handleSearch" />
      <button class="search-btn" @click="handleSearch">搜索</button>
    </view>
    
    <scroll-view class="user-list" scroll-y @scrolltolower="loadMore">
      <view v-for="user in userList" :key="user.id" class="user-item" @click="viewDetail(user)">
        <image :src="user.avatar || '/static/default-avatar.png'" class="avatar" />
        <view class="user-info">
          <view class="name">{{ user.nickname || '未设置昵称' }}</view>
          <view class="phone">{{ user.phone }}</view>
        </view>
        <view class="user-meta">
          <view :class="['status', user.status]">
            {{ user.status === 'active' ? '正常' : '禁用' }}
          </view>
          <view class="role">{{ user.role === 'admin' ? '管理员' : '用户' }}</view>
        </view>
      </view>
      
      <view v-if="loading" class="loading">加载中...</view>
      <view v-if="!hasMore && userList.length > 0" class="no-more">没有更多了</view>
      <view v-if="userList.length === 0 && !loading" class="empty">暂无数据</view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userApi } from '../../api/user'

const keyword = ref('')
const userList = ref([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)

const fetchUserList = async (isLoadMore = false) => {
  if (loading.value) return

  loading.value = true
  try {
    // 使用API模块获取用户列表
    const result = await userApi.getUserList({
      page: page.value,
      page_size: 20,
      keyword: keyword.value
    })

    if (isLoadMore) {
      userList.value = [...userList.value, ...result.list]
    } else {
      userList.value = result.list
    }
    hasMore.value = userList.value.length < result.total
  } catch (error) {
    console.error('获取用户列表失败:', error)
    uni.showToast({
      title: error.message || '获取失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  hasMore.value = true
  userList.value = []
  fetchUserList()
}

const loadMore = () => {
  if (!hasMore.value || loading.value) return
  page.value++
  fetchUserList(true)
}

const viewDetail = (user) => {
  uni.showModal({
    title: '用户详情',
    content: `昵称：${user.nickname || '未设置'}\n手机：${user.phone}\n角色：${user.role === 'admin' ? '管理员' : '用户'}\n状态：${user.status === 'active' ? '正常' : '禁用'}`,
    showCancel: false
  })
}

onMounted(() => {
  // 检查登录状态（使用mobile_admin_前缀）
  const token = uni.getStorageSync('mobile_admin_token')
  if (!token) {
    uni.reLaunch({ url: '/pages/login/login' })
    return
  }
  fetchUserList()
})
</script>

<style scoped>
.users-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.search-bar {
  display: flex;
  padding: 20rpx;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.search-bar input {
  flex: 1;
  height: 70rpx;
  border: 1px solid #e0e0e0;
  border-radius: 10rpx;
  padding: 0 20rpx;
  margin-right: 20rpx;
}

.search-btn {
  width: 140rpx;
  height: 70rpx;
  background: #007AFF;
  color: #fff;
  border: none;
  border-radius: 10rpx;
  font-size: 28rpx;
  line-height: 70rpx;
  padding: 0;
}

.user-list {
  flex: 1;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 30rpx 20rpx;
  background: #fff;
  margin-bottom: 20rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.user-info {
  flex: 1;
}

.name {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.phone {
  font-size: 28rpx;
  color: #666;
}

.user-meta {
  text-align: right;
}

.status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  margin-bottom: 10rpx;
}

.status.active {
  background: #e7f7e7;
  color: #52c41a;
}

.status.disabled {
  background: #ffe7e7;
  color: #f5222d;
}

.role {
  font-size: 24rpx;
  color: #999;
}

.loading, .no-more, .empty {
  text-align: center;
  padding: 40rpx;
  color: #999;
  font-size: 28rpx;
}
</style>

