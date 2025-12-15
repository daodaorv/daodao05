/**
 * 权限管理工具类
 * 基于角色的权限控制（RBAC）
 */

// 角色定义
export const ROLES = {
  SUPER_ADMIN: 'super_admin',      // 超级管理员 - L5
  REGIONAL_MANAGER: 'regional_manager', // 区域经理 - L4
  STORE_MANAGER: 'store_manager',    // 门店经理 - L3
  FIELD_ADMIN: 'field_admin',       // 现场管理员 - L2
  CUSTOMER_SERVICE: 'customer_service' // 客服人员 - L1
}

// 权限定义
export const PERMISSIONS = {
  // 数据概览权限
  VIEW_DASHBOARD: 'view_dashboard',

  // 用户管理权限
  VIEW_USERS: 'view_users',
  CREATE_USER: 'create_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',

  // 订单管理权限
  VIEW_ORDERS: 'view_orders',
  CREATE_ORDER: 'create_order',
  UPDATE_ORDER: 'update_order',
  DELETE_ORDER: 'delete_order',
  PROCESS_ORDER: 'process_order',

  // 车辆管理权限
  VIEW_VEHICLES: 'view_vehicles',
  CREATE_VEHICLE: 'create_vehicle',
  UPDATE_VEHICLE: 'update_vehicle',
  DELETE_VEHICLE: 'delete_vehicle',
  DISPATCH_VEHICLE: 'dispatch_vehicle',

  // 财务管理权限
  VIEW_FINANCE: 'view_finance',
  MANAGE_FINANCE: 'manage_finance',

  // 系统设置权限
  VIEW_SETTINGS: 'view_settings',
  MANAGE_SETTINGS: 'manage_settings',

  // 托管管理权限
  VIEW_HOSTING: 'view_hosting',
  REVIEW_HOSTING: 'review_hosting',

  // 消息管理权限
  VIEW_MESSAGES: 'view_messages',
  MANAGE_TICKETS: 'manage_tickets',
  CHAT_SUPPORT: 'chat_support'
}

// 角色权限映射
const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    // 超级管理员拥有所有权限
    ...Object.values(PERMISSIONS)
  ],

  [ROLES.REGIONAL_MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.UPDATE_ORDER,
    PERMISSIONS.DELETE_ORDER,
    PERMISSIONS.PROCESS_ORDER,
    PERMISSIONS.VIEW_VEHICLES,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.VIEW_HOSTING,
    PERMISSIONS.REVIEW_HOSTING,
    PERMISSIONS.VIEW_MESSAGES,
    PERMISSIONS.MANAGE_TICKETS,
    PERMISSIONS.CHAT_SUPPORT
  ],

  [ROLES.STORE_MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.UPDATE_ORDER,
    PERMISSIONS.PROCESS_ORDER,
    PERMISSIONS.VIEW_VEHICLES,
    PERMISSIONS.CREATE_VEHICLE,
    PERMISSIONS.UPDATE_VEHICLE,
    PERMISSIONS.DISPATCH_VEHICLE,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.VIEW_HOSTING,
    PERMISSIONS.REVIEW_HOSTING,
    PERMISSIONS.VIEW_MESSAGES,
    PERMISSIONS.MANAGE_TICKETS,
    PERMISSIONS.CHAT_SUPPORT
  ],

  [ROLES.FIELD_ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.UPDATE_ORDER,
    PERMISSIONS.PROCESS_ORDER,
    PERMISSIONS.VIEW_VEHICLES,
    PERMISSIONS.UPDATE_VEHICLE,
    PERMISSIONS.DISPATCH_VEHICLE,
    PERMISSIONS.VIEW_MESSAGES,
    PERMISSIONS.MANAGE_TICKETS,
    PERMISSIONS.CHAT_SUPPORT
  ],

  [ROLES.CUSTOMER_SERVICE]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.VIEW_VEHICLES,
    PERMISSIONS.VIEW_MESSAGES,
    PERMISSIONS.MANAGE_TICKETS,
    PERMISSIONS.CHAT_SUPPORT
  ]
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser() {
  try {
    const userStr = uni.getStorageSync('user')
    if (userStr) {
      return JSON.parse(userStr)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
  return null
}

/**
 * 获取当前用户角色
 */
export function getCurrentRole() {
  const user = getCurrentUser()
  return user?.role || null
}

/**
 * 获取角色的所有权限
 * @param {string} role - 角色标识
 * @returns {Array<string>} 权限列表
 */
export function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || []
}

/**
 * 检查用户是否有指定权限
 * @param {string} permission - 权限标识
 * @returns {boolean} 是否有权限
 */
export function hasPermission(permission) {
  const role = getCurrentRole()
  if (!role) {
    return false
  }

  const permissions = getRolePermissions(role)
  return permissions.includes(permission)
}

/**
 * 检查用户是否有任一权限
 * @param {Array<string>} permissions - 权限列表
 * @returns {boolean} 是否有任一权限
 */
export function hasAnyPermission(permissions) {
  return permissions.some(permission => hasPermission(permission))
}

/**
 * 检查用户是否有所有权限
 * @param {Array<string>} permissions - 权限列表
 * @returns {boolean} 是否有所有权限
 */
export function hasAllPermissions(permissions) {
  return permissions.every(permission => hasPermission(permission))
}

/**
 * 检查用户是否是指定角色
 * @param {string} role - 角色标识
 * @returns {boolean} 是否是指定角色
 */
export function hasRole(role) {
  const currentRole = getCurrentRole()
  return currentRole === role
}

/**
 * 检查用户是否是任一角色
 * @param {Array<string>} roles - 角色列表
 * @returns {boolean} 是否是任一角色
 */
export function hasAnyRole(roles) {
  const currentRole = getCurrentRole()
  return roles.includes(currentRole)
}

/**
 * 获取角色显示名称
 * @param {string} role - 角色标识
 * @returns {string} 角色名称
 */
export function getRoleName(role) {
  const roleNames = {
    [ROLES.SUPER_ADMIN]: '超级管理员',
    [ROLES.REGIONAL_MANAGER]: '区域经理',
    [ROLES.STORE_MANAGER]: '门店经理',
    [ROLES.FIELD_ADMIN]: '现场管理员',
    [ROLES.CUSTOMER_SERVICE]: '客服人员'
  }
  return roleNames[role] || '未知角色'
}

/**
 * 获取权限显示名称
 * @param {string} permission - 权限标识
 * @returns {string} 权限名称
 */
export function getPermissionName(permission) {
  const permissionNames = {
    [PERMISSIONS.VIEW_DASHBOARD]: '查看工作台',
    [PERMISSIONS.VIEW_USERS]: '查看用户',
    [PERMISSIONS.CREATE_USER]: '创建用户',
    [PERMISSIONS.UPDATE_USER]: '更新用户',
    [PERMISSIONS.DELETE_USER]: '删除用户',
    [PERMISSIONS.VIEW_ORDERS]: '查看订单',
    [PERMISSIONS.CREATE_ORDER]: '创建订单',
    [PERMISSIONS.UPDATE_ORDER]: '更新订单',
    [PERMISSIONS.DELETE_ORDER]: '删除订单',
    [PERMISSIONS.PROCESS_ORDER]: '处理订单',
    [PERMISSIONS.VIEW_VEHICLES]: '查看车辆',
    [PERMISSIONS.CREATE_VEHICLE]: '创建车辆',
    [PERMISSIONS.UPDATE_VEHICLE]: '更新车辆',
    [PERMISSIONS.DELETE_VEHICLE]: '删除车辆',
    [PERMISSIONS.DISPATCH_VEHICLE]: '调度车辆',
    [PERMISSIONS.VIEW_FINANCE]: '查看财务',
    [PERMISSIONS.MANAGE_FINANCE]: '管理财务',
    [PERMISSIONS.VIEW_SETTINGS]: '查看设置',
    [PERMISSIONS.MANAGE_SETTINGS]: '管理设置',
    [PERMISSIONS.VIEW_HOSTING]: '查看托管',
    [PERMISSIONS.REVIEW_HOSTING]: '审核托管',
    [PERMISSIONS.VIEW_MESSAGES]: '查看消息',
    [PERMISSIONS.MANAGE_TICKETS]: '管理工单',
    [PERMISSIONS.CHAT_SUPPORT]: '在线客服'
  }
  return permissionNames[permission] || '未知权限'
}

/**
 * 数据权限过滤
 * 根据用户角色过滤数据
 * @param {Array} data - 原始数据
 * @param {string} dataType - 数据类型（orders/vehicles/users等）
 * @returns {Array} 过滤后的数据
 */
export function filterDataByPermission(data, dataType) {
  const user = getCurrentUser()
  if (!user) {
    return []
  }

  const role = user.role

  // 超级管理员和区域经理可以查看所有数据
  if (role === ROLES.SUPER_ADMIN || role === ROLES.REGIONAL_MANAGER) {
    return data
  }

  // 门店经理只能查看自己门店的数据
  if (role === ROLES.STORE_MANAGER) {
    return data.filter(item => item.storeId === user.storeId)
  }

  // 现场管理员只能查看自己处理的数据
  if (role === ROLES.FIELD_ADMIN) {
    return data.filter(item =>
      item.assigneeId === user.id ||
      item.creatorId === user.id
    )
  }

  // 客服人员只能查看基本信息
  if (role === ROLES.CUSTOMER_SERVICE) {
    return data.map(item => {
      // 移除敏感信息
      const { password, idCard, ...safeData } = item
      return safeData
    })
  }

  return data
}

/**
 * 检查是否可以访问指定路由
 * @param {string} path - 路由路径
 * @returns {boolean} 是否可以访问
 */
export function canAccessRoute(path) {
  // 公开路由，无需权限
  const publicRoutes = [
    '/pages/login/index',
    '/pages/index/index'
  ]

  if (publicRoutes.includes(path)) {
    return true
  }

  // 检查用户是否已登录
  const user = getCurrentUser()
  if (!user) {
    return false
  }

  // 路由权限映射
  const routePermissions = {
    '/pages/dashboard/index': PERMISSIONS.VIEW_DASHBOARD,
    '/pages/orders/index': PERMISSIONS.VIEW_ORDERS,
    '/pages/vehicles/index': PERMISSIONS.VIEW_VEHICLES,
    '/pages/messages/index': PERMISSIONS.VIEW_MESSAGES,
    '/pages/hosting/applications': PERMISSIONS.VIEW_HOSTING,
    '/pages/statistics/index': PERMISSIONS.VIEW_FINANCE
  }

  const requiredPermission = routePermissions[path]
  if (requiredPermission) {
    return hasPermission(requiredPermission)
  }

  // 默认允许访问（对于未定义权限的路由）
  return true
}

/**
 * 权限不足时的处理
 * @param {string} message - 提示消息
 */
export function handlePermissionDenied(message = '您没有权限执行此操作') {
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
}

/**
 * 导出默认对象
 */
export default {
  ROLES,
  PERMISSIONS,
  getCurrentUser,
  getCurrentRole,
  getRolePermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  getRoleName,
  getPermissionName,
  filterDataByPermission,
  canAccessRoute,
  handlePermissionDenied
}
