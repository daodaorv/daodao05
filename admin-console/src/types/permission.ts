/**
 * 权限相关类型定义
 */

// 角色类型
export type RoleType = 'customer' | 'admin'

// 角色接口
export interface Role {
  id: number
  code: string
  name: string
  type: RoleType
}

// 用户角色枚举（保留用于兼容性）
export enum UserRole {
  PLATFORM_ADMIN = 'platform_admin', // 平台管理员
  REGIONAL_MANAGER = 'regional_manager', // 区域经理
  STORE_MANAGER = 'store_manager', // 门店经理
  STORE_STAFF = 'store_staff', // 门店员工
}

// 权限代码
export type PermissionCode = string

// 路由元信息
export interface RouteMeta {
  title?: string // 页面标题
  description?: string // 页面描述
  hidePageHeader?: boolean // 是否隐藏页面标题（用于Dashboard等特殊页面）
  icon?: string // 图标
  hidden?: boolean // 是否隐藏
  roles?: UserRole[] // 允许访问的角色
  permissions?: PermissionCode[] // 需要的权限
  noCache?: boolean // 是否不缓存
  affix?: boolean // 是否固定在标签栏
  breadcrumb?: boolean // 是否显示在面包屑
  requiresAuth?: boolean // 是否需要认证
}

// 菜单项
export interface MenuItem {
  path: string
  name?: string
  meta?: RouteMeta
  children?: MenuItem[]
  component?: any
}

// 权限检查结果
export interface PermissionCheckResult {
  hasPermission: boolean
  reason?: string
}
