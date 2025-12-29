import { RowDataPacket } from 'mysql2';

/**
 * 角色类型枚举
 */
export enum RoleType {
  CUSTOMER = 'customer', // C端用户角色
  ADMIN = 'admin', // B端管理员角色
}

/**
 * 数据权限范围枚举
 */
export enum DataScope {
  ALL = 'all', // 全局数据
  REGION = 'region', // 区域数据
  STORE = 'store', // 门店数据
  SELF = 'self', // 个人数据
}

/**
 * 角色状态枚举
 */
export enum RoleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

/**
 * 角色接口
 */
export interface Role extends RowDataPacket {
  id: number;
  name: string;
  code: string;
  type: RoleType;
  data_scope: DataScope;
  description?: string;
  status: RoleStatus;
  created_at: Date;
  updated_at: Date;
}

/**
 * 权限接口
 */
export interface Permission extends RowDataPacket {
  id: number;
  code: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  created_at: Date;
}

/**
 * 角色权限关联接口
 */
export interface RolePermission extends RowDataPacket {
  id: number;
  role_id: number;
  permission_id: number;
  created_at: Date;
}

/**
 * 用户角色关联接口
 */
export interface UserRole extends RowDataPacket {
  id: number;
  user_id: number;
  role_id: number;
  store_id?: number;
  granted_by?: number;
  granted_at: Date;
  expires_at?: Date;
}

/**
 * 角色详情（包含权限列表）
 */
export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

/**
 * 用户角色详情（包含角色信息）
 */
export interface UserRoleWithDetails extends UserRole {
  role: Role;
}
