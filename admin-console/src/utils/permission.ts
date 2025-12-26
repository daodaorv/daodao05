/**
 * 权限工具函数
 */
import type { MenuItem, PermissionCode, RouteMeta } from '@/types/permission'
import { UserRole } from '@/types/permission'
import type { User } from '@/types/user'

/**
 * 检查用户是否有指定角色
 */
export function hasRole(user: User | null, roles?: UserRole[]): boolean {
  if (!user || !roles || roles.length === 0) {
    return true
  }

  return roles.includes(user.role as UserRole)
}

/**
 * 检查用户是否有指定权限
 */
export function hasPermission(user: User | null, permissions?: PermissionCode[]): boolean {
  // 如果没有指定权限要求，则允许访问
  if (!permissions || permissions.length === 0) {
    return true
  }

  // 如果没有用户信息，则拒绝访问
  if (!user) {
    return false
  }

  // 如果用户没有权限列表，则拒绝访问
  if (!user.permissions || user.permissions.length === 0) {
    return false
  }

  // 检查是否有通配符权限
  if (user.permissions.includes('*')) {
    return true
  }

  // 检查用户是否拥有所需权限中的任意一个
  return permissions.some((permission) => {
    // 直接匹配
    if (user.permissions?.includes(permission)) {
      return true
    }

    // 通配符匹配（例如：vehicle:* 可以匹配 vehicle:edit）
    const permissionPrefix = permission.split(':')[0]
    return user.permissions?.some((userPerm) => {
      if (userPerm.endsWith(':*')) {
        const userPermPrefix = userPerm.split(':')[0]
        return userPermPrefix === permissionPrefix
      }
      return false
    })
  })
}

/**
 * 检查用户是否可以访问路由
 */
export function canAccessRoute(user: User | null, meta?: RouteMeta): boolean {
  if (!meta) {
    return true
  }

  // 检查角色权限
  if (meta.roles && !hasRole(user, meta.roles)) {
    return false
  }

  // 检查功能权限
  if (meta.permissions && !hasPermission(user, meta.permissions)) {
    return false
  }

  return true
}

/**
 * 过滤菜单 - 根据用户权限过滤可访问的菜单
 */
export function filterMenuByPermission(menus: MenuItem[], user: User | null): MenuItem[] {
  return menus
    .filter((menu) => {
      // 检查当前菜单项是否可访问
      if (!canAccessRoute(user, menu.meta)) {
        return false
      }

      // 如果有子菜单，递归过滤
      if (menu.children && menu.children.length > 0) {
        menu.children = filterMenuByPermission(menu.children, user)
        // 如果过滤后没有子菜单，则隐藏父菜单
        return menu.children.length > 0
      }

      return true
    })
    .filter((menu) => !menu.meta?.hidden) // 过滤隐藏的菜单
}

/**
 * 获取用户角色的中文名称
 */
export function getRoleName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    [UserRole.PLATFORM_ADMIN]: '平台管理员',
    [UserRole.REGIONAL_MANAGER]: '区域经理',
    [UserRole.STORE_MANAGER]: '门店经理',
    [UserRole.STORE_STAFF]: '门店员工',
  }

  return roleNames[role] || '未知角色'
}

/**
 * 获取用户数据权限范围描述
 */
export function getDataScopeDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    [UserRole.PLATFORM_ADMIN]: '全平台数据',
    [UserRole.REGIONAL_MANAGER]: '所辖区域所有门店数据',
    [UserRole.STORE_MANAGER]: '本门店数据',
    [UserRole.STORE_STAFF]: '分配的任务数据',
  }

  return descriptions[role] || '无数据权限'
}