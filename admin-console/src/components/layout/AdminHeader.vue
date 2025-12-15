<template>
  <div class="admin-header">
    <!-- 左侧 -->
    <div class="header-left">
      <el-button
        type="text"
        @click="toggleSidebar"
        class="menu-toggle"
      >
        <el-icon size="20">
          <Fold v-if="!collapsed" />
          <Expand v-else />
        </el-icon>
      </el-button>
    </div>

    <!-- 右侧 -->
    <div class="header-right">
      <!-- 主题切换 -->
      <el-button type="text" @click="toggleTheme" class="theme-toggle">
        <el-icon size="18">
          <Sunny v-if="isDark" />
          <Moon v-else />
        </el-icon>
      </el-button>

      <!-- 通知 -->
      <el-badge :value="notificationCount" :hidden="notificationCount === 0">
        <el-button type="text" class="notification-btn">
          <el-icon size="18">
            <Bell />
          </el-icon>
        </el-button>
      </el-badge>

      <!-- 全屏 -->
      <el-button type="text" @click="toggleFullscreen" class="fullscreen-btn">
        <el-icon size="18">
          <FullScreen />
        </el-icon>
      </el-button>

      <!-- 用户信息 -->
      <el-dropdown @command="handleCommand" class="user-dropdown">
        <div class="user-info">
          <el-avatar :size="32" :src="user?.avatar" />
          <span class="username">{{ user?.username }}</span>
          <el-icon>
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              系统设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const notificationCount = ref(3)

const collapsed = computed(() => appStore.sidebarCollapsed)
const isDark = computed(() => appStore.isDark)
const user = computed(() => userStore.user)

// 切换侧边栏
const toggleSidebar = () => {
  appStore.toggleSidebar()
}

// 切换主题
const toggleTheme = () => {
  appStore.toggleTheme()
}

// 全屏切换
const toggleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}

// 下拉菜单命令处理
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        userStore.logout()
        router.push('/login')
      })
      break
  }
}
</script>

<style scoped lang="scss">
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  .header-left {
    display: flex;
    align-items: center;

    .menu-toggle {
      padding: 8px;
      color: #606266;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .theme-toggle,
    .notification-btn,
    .fullscreen-btn {
      padding: 8px;
      color: #606266;
    }

    .user-dropdown {
      cursor: pointer;

      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background-color 0.3s;

        .username {
          font-size: 14px;
          color: #303133;
        }

        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
  }
}
</style>