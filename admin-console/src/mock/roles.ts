/**
 * 角色管理 Mock 数据
 */
import type { Role, RoleListParams, CreateRoleParams, UpdateRoleParams, ConfigPermissionsParams, RoleUser } from '@/api/role'

// Mock 角色数据
const mockRoles: Role[] = [
  {
    id: 1,
    name: '平台管理员',
    code: 'platform_admin',
    type: 'platform_admin',
    description: '拥有系统所有权限',
    dataScope: 'all',
    userCount: 5,
    status: 'active',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: '区域经理',
    code: 'regional_manager',
    type: 'regional_manager',
    description: '管理所辖区域所有门店',
    dataScope: 'region',
    userCount: 12,
    status: 'active',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    name: '门店经理',
    code: 'store_manager',
    type: 'store_manager',
    description: '管理本门店业务',
    dataScope: 'store',
    userCount: 28,
    status: 'active',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 4,
    name: '门店员工',
    code: 'store_staff',
    type: 'store_staff',
    description: '处理门店日常业务',
    dataScope: 'self',
    userCount: 156,
    status: 'active',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
]

// Mock 角色用户数据
const mockRoleUsers: Record<number, RoleUser[]> = {
  1: [
    {
      id: 1,
      username: 'admin',
      realName: '系统管理员',
      phone: '13800138000',
      department: '技术部',
      status: 'active',
    },
    {
      id: 2,
      username: 'admin2',
      realName: '超级管理员',
      phone: '13800138001',
      department: '运营部',
      status: 'active',
    },
  ],
  2: [
    {
      id: 3,
      username: 'regional_manager1',
      realName: '张三',
      phone: '13800138002',
      department: '华北区',
      status: 'active',
    },
  ],
  3: [
    {
      id: 4,
      username: 'store_manager1',
      realName: '李四',
      phone: '13800138003',
      department: '北京朝阳店',
      status: 'active',
    },
  ],
  4: [
    {
      id: 5,
      username: 'staff1',
      realName: '王五',
      phone: '13800138004',
      department: '北京朝阳店',
      status: 'active',
    },
  ],
}

// Mock 获取角色列表
export const mockGetRoleList = (params: RoleListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredRoles = [...mockRoles]

      // 关键词搜索
      if (params.keyword) {
        filteredRoles = filteredRoles.filter(
          (role) =>
            role.name.includes(params.keyword!) ||
            role.code.includes(params.keyword!) ||
            role.description.includes(params.keyword!)
        )
      }

      // 状态筛选
      if (params.status) {
        filteredRoles = filteredRoles.filter((role) => role.status === params.status)
      }

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredRoles.slice(start, end)

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: filteredRoles.length,
          page,
          pageSize,
        },
      })
    }, 300)
  })
}

// Mock 获取角色详情
export const mockGetRoleDetail = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const role = mockRoles.find((r) => r.id === id)
      if (role) {
        resolve({
          code: 200,
          message: '获取成功',
          data: role,
        })
      } else {
        reject({
          code: 404,
          message: '角色不存在',
        })
      }
    }, 200)
  })
}

// Mock 创建角色
export const mockCreateRole = (data: CreateRoleParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRole: Role = {
        id: mockRoles.length + 1,
        name: data.name,
        code: data.code,
        type: data.type,
        description: data.description || '',
        dataScope: data.dataScope,
        userCount: 0,
        status: data.status || 'active',
        isSystem: false,
        createdAt: new Date().toISOString(),
      }
      mockRoles.push(newRole)

      resolve({
        code: 200,
        message: '创建成功',
        data: newRole,
      })
    }, 500)
  })
}

// Mock 更新角色
export const mockUpdateRole = (data: UpdateRoleParams) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockRoles.findIndex((r) => r.id === data.id)
      if (index > -1) {
        mockRoles[index] = {
          ...mockRoles[index],
          ...data,
          updatedAt: new Date().toISOString(),
        }
        resolve({
          code: 200,
          message: '更新成功',
          data: mockRoles[index],
        })
      } else {
        reject({
          code: 404,
          message: '角色不存在',
        })
      }
    }, 500)
  })
}

// Mock 删除角色
export const mockDeleteRole = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockRoles.findIndex((r) => r.id === id)
      if (index > -1) {
        const role = mockRoles[index]
        if (role.isSystem) {
          reject({
            code: 403,
            message: '系统角色不能删除',
          })
          return
        }
        mockRoles.splice(index, 1)
        resolve({
          code: 200,
          message: '删除成功',
        })
      } else {
        reject({
          code: 404,
          message: '角色不存在',
        })
      }
    }, 300)
  })
}

// Mock 配置角色权限
export const mockConfigRolePermissions = (data: ConfigPermissionsParams) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const role = mockRoles.find((r) => r.id === data.roleId)
      if (role) {
        // 这里只是模拟，实际应该保存权限配置
        resolve({
          code: 200,
          message: '权限配置成功',
        })
      } else {
        reject({
          code: 404,
          message: '角色不存在',
        })
      }
    }, 500)
  })
}

// Mock 获取角色用户列表
export const mockGetRoleUsers = (roleId: number, params?: { page?: number; pageSize?: number }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = mockRoleUsers[roleId] || []
      const page = params?.page || 1
      const pageSize = params?.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = users.slice(start, end)

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: users.length,
        },
      })
    }, 300)
  })
}
