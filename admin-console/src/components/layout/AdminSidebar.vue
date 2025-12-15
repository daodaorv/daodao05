<template>
  <div class="admin-sidebar">
    <!-- Logo -->
    <div class="logo-container">
      <div class="logo">🚐</div>
      <h1 v-show="!collapsed" class="logo-text">叨叨房车</h1>
    </div>

    <!-- 菜单 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="collapsed"
      :unique-opened="true"
      :router="true"
      background-color="#fff"
      text-color="#303133"
      active-text-color="#409eff"
    >
      <template v-for="menuItem in menuRoutes" :key="menuItem.path">
        <el-sub-menu
          v-if="menuItem.children && menuItem.children.length > 0"
          :index="menuItem.path"
        >
          <template #title>
            <el-icon v-if="menuItem.meta?.icon">
              <component :is="menuItem.meta.icon" />
            </el-icon>
            <span>{{ menuItem.meta?.title }}</span>
          </template>

          <el-menu-item
            v-for="child in menuItem.children"
            :key="child.path"
            :index="child.path"
          >
            <el-icon v-if="child.meta?.icon">
              <component :is="child.meta.icon" />
            </el-icon>
            <template #title>{{ child.meta?.title }}</template>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item v-else :index="menuItem.path">
          <el-icon v-if="menuItem.meta?.icon">
            <component :is="menuItem.meta.icon" />
          </el-icon>
          <template #title>{{ menuItem.meta?.title }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { menuConfig } from '@/config/menu'
import { filterMenuByPermission } from '@/utils/permission'
import type { MenuItem } from '@/types/permission'

const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const collapsed = computed(() => appStore.sidebarCollapsed)

// 当前激活的菜单
const activeMenu = computed(() => {
  const { path } = route
  return path
})

// 根据用户权限过滤菜单
const menuRoutes = computed<MenuItem[]>(() => {
  const user = userStore.user
  return filterMenuByPermission(menuConfig, user)
})
</script>

<style scoped lang="scss">
.admin-sidebar {
  height: 100%;
  overflow: hidden;

  .logo-container {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 20px;

    .logo {
      font-size: 32px;
    }

    .logo-text {
      margin-left: 12px;
      font-size: 18px;
      font-weight: 600;
      color: #1890ff;
      white-space: nowrap;
    }
  }

  .el-menu {
    border-right: none;
    height: calc(100% - 60px);
    overflow-y: auto;

    :deep(.el-menu-item) {
      height: 48px;
      line-height: 48px;
    }

    :deep(.el-sub-menu__title) {
      height: 48px;
      line-height: 48px;
    }
  }
}
</style>