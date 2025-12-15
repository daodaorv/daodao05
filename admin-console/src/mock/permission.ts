import type {
  Permission,
  PermissionListParams,
  UpdatePermissionParams,
  MenuPermission,
  MenuPermissionListParams,
  UpdateMenuPermissionParams,
  DataPermission,
  DataPermissionListParams,
  UpdateDataPermissionParams,
} from '@/api/permission'

// ==================== 权限配置 Mock 数据 ====================
const mockPermissions: Permission[] = [
  {
    id: 1,
    name: '用户管理',
    code: 'user:manage',
    type: 'menu',
    path: '/users',
    description: '用户管理模块',
    parentId: null,
    sort: 1,
    enabled: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: '用户列表',
    code: 'user:list',
    type: 'menu',
    path: '/users/list',
    description: '用户列表页面',
    parentId: 1,
    sort: 1,
    enabled: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    name: '创建用户',
    code: 'user:create',
    type: 'button',
    description: '创建用户按钮',
    parentId: 2,
    sort: 1,
    enabled: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 4,
    name: '编辑用户',
    code: 'user:edit',
    type: 'button',
    description: '编辑用户按钮',
    parentId: 2,
    sort: 2,
    enabled: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 5,
    name: '删除用户',
    code: 'user:delete',
    type: 'button',
    description: '删除用户按钮',
    parentId: 2,
    sort: 3,
    enabled: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
]

export const mockGetPermissionList = (params: PermissionListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockPermissions]

      if (params.keyword) {
        filteredData = filteredData.filter(
          (item) => item.name.includes(params.keyword!) || item.code.includes(params.keyword!)
        )
      }

      if (params.type) {
        filteredData = filteredData.filter((item) => item.type === params.type)
      }

      if (params.enabled !== undefined) {
        filteredData = filteredData.filter((item) => item.enabled === params.enabled)
      }

      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list: filteredData.slice(start, end),
          total: filteredData.length,
        },
      })
    }, 300)
  })
}

export const mockGetPermissionTree = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取成功',
        data: mockPermissions,
      })
    }, 200)
  })
}

export const mockUpdatePermission = (data: UpdatePermissionParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const permission = mockPermissions.find((p) => p.id === data.id)
      if (permission) {
        Object.assign(permission, data)
      }

      resolve({
        code: 200,
        message: '更新成功',
        data: null,
      })
    }, 300)
  })
}

// ==================== 菜单权限 Mock 数据 ====================
const mockMenuPermissions: MenuPermission[] = [
  {
    id: 1,
    menuId: 1,
    menuName: '用户管理',
    menuPath: '/users',
    roleId: 1,
    roleName: '平台管理员',
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    menuId: 1,
    menuName: '用户管理',
    menuPath: '/users',
    roleId: 2,
    roleName: '区域经理',
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canExport: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    menuId: 2,
    menuName: '车辆管理',
    menuPath: '/vehicles',
    roleId: 1,
    roleName: '平台管理员',
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
]

export const mockGetMenuPermissionList = (params: MenuPermissionListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockMenuPermissions]

      if (params.roleId) {
        filteredData = filteredData.filter((item) => item.roleId === params.roleId)
      }

      if (params.menuId) {
        filteredData = filteredData.filter((item) => item.menuId === params.menuId)
      }

      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list: filteredData.slice(start, end),
          total: filteredData.length,
        },
      })
    }, 300)
  })
}

export const mockUpdateMenuPermission = (data: UpdateMenuPermissionParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const permission = mockMenuPermissions.find((p) => p.id === data.id)
      if (permission) {
        Object.assign(permission, data)
      }

      resolve({
        code: 200,
        message: '更新成功',
        data: null,
      })
    }, 300)
  })
}

// ==================== 数据权限 Mock 数据 ====================
const mockDataPermissions: DataPermission[] = [
  {
    id: 1,
    roleId: 1,
    roleName: '平台管理员',
    resourceType: 'user',
    resourceName: '用户数据',
    scope: 'all',
    scopeName: '全部数据',
    conditions: '',
    enabled: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    roleId: 2,
    roleName: '区域经理',
    resourceType: 'user',
    resourceName: '用户数据',
    scope: 'department',
    scopeName: '本部门数据',
    conditions: 'department_id = current_user.department_id',
    enabled: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    roleId: 3,
    roleName: '门店经理',
    resourceType: 'order',
    resourceName: '订单数据',
    scope: 'store',
    scopeName: '本门店数据',
    conditions: 'store_id = current_user.store_id',
    enabled: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
]

export const mockGetDataPermissionList = (params: DataPermissionListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockDataPermissions]

      if (params.roleId) {
        filteredData = filteredData.filter((item) => item.roleId === params.roleId)
      }

      if (params.resourceType) {
        filteredData = filteredData.filter((item) => item.resourceType === params.resourceType)
      }

      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list: filteredData.slice(start, end),
          total: filteredData.length,
        },
      })
    }, 300)
  })
}

export const mockUpdateDataPermission = (data: UpdateDataPermissionParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const permission = mockDataPermissions.find((p) => p.id === data.id)
      if (permission) {
        Object.assign(permission, data)
      }

      resolve({
        code: 200,
        message: '更新成功',
        data: null,
      })
    }, 300)
  })
}
