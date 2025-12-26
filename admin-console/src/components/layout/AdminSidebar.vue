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
      background-color="#fff"
      text-color="#303133"
      active-text-color="#409eff"
      @select="handleMenuSelect"
    >
      <template v-for="menuItem in menuRoutes" :key="menuItem.path">
        <MenuItemComponent :menu-item="menuItem" />
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElSubMenu, ElMenuItem, ElIcon } from 'element-plus'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { menuConfig } from '@/config/menu'
import { filterMenuByPermission } from '@/utils/permission'
import type { MenuItem } from '@/types/permission'

const route = useRoute()
const router = useRouter()
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

// 递归菜单组件
const MenuItemComponent = defineComponent({
  name: 'MenuItemComponent',
  props: {
    menuItem: {
      type: Object as () => MenuItem,
      required: true,
    },
  },
  setup(props) {
    const hasChildren = computed(() => {
      return props.menuItem.children && props.menuItem.children.length > 0
    })

    return () => {
      if (hasChildren.value) {
        // 有子菜单，渲染 el-sub-menu
        return h(
          ElSubMenu,
          { index: props.menuItem.path },
          {
            title: () => [
              props.menuItem.meta?.icon
                ? h(ElIcon, null, {
                    default: () => h(props.menuItem.meta!.icon as any),
                  })
                : null,
              h('span', null, props.menuItem.meta?.title),
            ],
            default: () =>
              props.menuItem.children!.map((child) =>
                h(MenuItemComponent, { key: child.path, menuItem: child })
              ),
          }
        )
      } else {
        // 没有子菜单，渲染 el-menu-item
        return h(
          ElMenuItem,
          { index: props.menuItem.path },
          {
            default: () => [
              props.menuItem.meta?.icon
                ? h(ElIcon, null, {
                    default: () => h(props.menuItem.meta!.icon as any),
                  })
                : null,
              h('template', { slot: 'title' }, props.menuItem.meta?.title),
            ],
          }
        )
      }
    }
  },
})

// 处理菜单选择
const handleMenuSelect = (index: string) => {
  // 只有叶子节点（没有子菜单的菜单项）才进行路由导航
  // 父级菜单项会自动展开/收起，不需要导航
  const findMenuItem = (items: MenuItem[], path: string): MenuItem | undefined => {
    for (const item of items) {
      if (item.path === path) {
        return item
      }
      if (item.children) {
        const found = findMenuItem(item.children, path)
        if (found) return found
      }
    }
    return undefined
  }

  const menuItem = findMenuItem(menuRoutes.value, index)

  // 只有没有子菜单的菜单项才进行路由导航
  if (menuItem && (!menuItem.children || menuItem.children.length === 0)) {
    router.push(index).catch((err) => {
      // 捕获导航错误，避免控制台警告
      console.warn('Navigation error:', err)
    })
  }
}
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