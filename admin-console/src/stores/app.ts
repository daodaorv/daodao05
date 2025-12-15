import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏状态
  const sidebarCollapsed = ref(false)

  // 设备类型
  const isMobile = ref(false)

  // 主题模式
  const isDark = ref(false)

  // 面包屑导航
  const breadcrumb = ref<Array<{ name: string; path: string }>>([])

  // 切换侧边栏
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // 设置设备类型
  const setMobile = (mobile: boolean) => {
    isMobile.value = mobile
    if (mobile) {
      sidebarCollapsed.value = true
    }
  }

  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  // 设置面包屑
  const setBreadcrumb = (items: Array<{ name: string; path: string }>) => {
    breadcrumb.value = items
  }

  return {
    sidebarCollapsed,
    isMobile,
    isDark,
    breadcrumb,
    toggleSidebar,
    setMobile,
    toggleTheme,
    setBreadcrumb,
  }
})