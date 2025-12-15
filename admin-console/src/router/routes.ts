// @ts-nocheck
/**
 * 路由配置 - 基于菜单配置生成完整路由
 */
import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/components/layout/AdminLayout.vue'
import { menuConfig } from '@/config/menu'
import type { MenuItem } from '@/types/permission'

// 将菜单配置转换为路由配置
const generateRoutes = (menus: MenuItem[], parentPath = ''): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = []

  menus.forEach((menu) => {
    // 如果有子菜单，递归生成子路由并直接添加到routes中
    if (menu.children && menu.children.length > 0) {
      // 递归处理子菜单
      const childRoutes = generateRoutes(menu.children, menu.path)
      routes.push(...childRoutes)
    } else {
      // 没有子菜单的才作为路由添加
      const route: RouteRecordRaw = {
        path: menu.path,
    // @ts-ignore
        name: menu.name,
        meta: menu.meta,
        component: menu.component || (() => import('@/views/common/ComingSoon.vue')),
      }
      routes.push(route)
    }
  })

  return routes
}

// 基础路由（不需要权限）
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { title: '登录', requiresAuth: false },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/NotFound.vue'),
    meta: { title: '页面不存在' },
  },
]

// 主要路由（需要权限）
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: generateRoutes(menuConfig),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

// 所有路由
export const routes: RouteRecordRaw[] = [...constantRoutes, ...asyncRoutes]
