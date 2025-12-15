<template>
  <div class="admin-layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="sidebarWidth" class="admin-sidebar">
        <AdminSidebar />
      </el-aside>

      <!-- 主体内容 -->
      <el-container>
        <!-- 头部 -->
        <el-header height="60px" class="admin-header">
          <AdminHeader />
        </el-header>

        <!-- 面包屑 -->
        <div class="breadcrumb-container">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              v-for="item in breadcrumb"
              :key="item.path"
              :to="item.path"
            >
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!-- 主要内容区域 -->
        <el-main class="admin-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import AdminSidebar from './AdminSidebar.vue'
import AdminHeader from './AdminHeader.vue'

const appStore = useAppStore()

const sidebarWidth = computed(() => {
  return appStore.sidebarCollapsed ? '64px' : '240px'
})

const breadcrumb = computed(() => appStore.breadcrumb)
</script>

<style scoped lang="scss">
.admin-layout {
  height: 100vh;
}

.admin-sidebar {
  background: #fff;
  border-right: 1px solid #e4e7ed;
  transition: width 0.3s;
}

.admin-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.breadcrumb-container {
  background: #f5f5f5;
  padding: 12px 20px;
  border-bottom: 1px solid #e4e7ed;
}

.admin-main {
  background: #f5f5f5;
  padding: 20px;
  min-height: calc(100vh - 60px - 45px);
}

@media (max-width: 768px) {
  .el-container {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100% !important;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e4e7ed;
  }

  .breadcrumb-container {
    padding: 8px 10px;
  }

  .admin-main {
    padding: 10px;
  }
}
</style>