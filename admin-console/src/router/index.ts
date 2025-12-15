import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { routes } from './routes'
import { canAccessRoute } from '@/utils/permission'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const appStore = useAppStore()
  const isAuthenticated = userStore.isAuthenticated

  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 叨叨房车租赁管理平台`
  }

  // 不需要认证的页面直接放行
  if (to.meta.requiresAuth === false) {
    next()
    return
  }

  // 需要认证但未登录，跳转到登录页
  if (!isAuthenticated) {
    next('/login')
    return
  }

  // 已登录用户访问登录页，跳转到工作台
  if (to.path === '/login') {
    next('/dashboard')
    return
  }

  // 检查权限
  const user = userStore.user
  if (!canAccessRoute(user, to.meta)) {
    // 无权限访问，跳转到 404
    next('/404')
    return
  }

  // 更新面包屑
  const breadcrumb = []
  const matched = to.matched.filter(item => item.meta?.title)
  for (const route of matched) {
    breadcrumb.push({
      name: route.meta?.title as string,
      path: route.path,
    })
  }
  appStore.setBreadcrumb(breadcrumb)

  next()
})

export default router