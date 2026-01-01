import { BaseDao } from './base.dao';
import { UserRole, UserRoleWithDetails, Role } from '../types/models/role.types';
import { QueryBuilder } from '../db/query-builder';

/**
 * 用户角色关联数据访问对象
 */
export class UserRoleDAO extends BaseDao<UserRole> {
  constructor() {
    super('user_roles');
  }

  /**
   * 根据用户ID查询角色列表
   */
  async findByUserId(userId: number): Promise<UserRole[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE user_id = ?`;
    return QueryBuilder.query<UserRole>(query, [userId]);
  }

  /**
   * 根据用户ID查询角色详情（包含角色信息）
   */
  async findByUserIdWithDetails(userId: number): Promise<UserRoleWithDetails[]> {
    const query = `
      SELECT
        ur.*,
        r.id as role_id,
        r.name as role_name,
        r.code as role_code,
        r.type as role_type,
        r.data_scope as role_data_scope,
        r.description as role_description,
        r.status as role_status
      FROM ${this.tableName} ur
      INNER JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = ? AND r.status = 'active'
    `;
    const rows = await QueryBuilder.query<any>(query, [userId]);

    return rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      role_id: row.role_id,
      store_id: row.store_id,
      granted_by: row.granted_by,
      granted_at: row.granted_at,
      expires_at: row.expires_at,
      role: {
        id: row.role_id,
        name: row.role_name,
        code: row.role_code,
        type: row.role_type,
        data_scope: row.role_data_scope,
        description: row.role_description,
        status: row.role_status,
        created_at: row.created_at,
        updated_at: row.updated_at,
      } as Role,
    })) as UserRoleWithDetails[];
  }

  /**
   * 根据角色ID查询用户列表
   */
  async findByRoleId(roleId: number): Promise<UserRole[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE role_id = ?`;
    return QueryBuilder.query<UserRole>(query, [roleId]);
  }

  /**
   * 检查用户是否拥有指定角色
   */
  async hasRole(userId: number, roleCode: string): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM ${this.tableName} ur
      INNER JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = ? AND r.code = ? AND r.status = 'active'
    `;
    const rows = await QueryBuilder.query<any>(query, [userId, roleCode]);
    return rows[0].count > 0;
  }

  /**
   * 为用户分配角色
   */
  async assignRole(data: {
    user_id: number;
    role_id: number;
    store_id?: number;
    granted_by?: number;
    expires_at?: Date;
  }): Promise<number> {
    const query = `
      INSERT INTO ${this.tableName} (user_id, role_id, store_id, granted_by, expires_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await QueryBuilder.insert(query, [
      data.user_id,
      data.role_id,
      data.store_id || null,
      data.granted_by || null,
      data.expires_at || null,
    ]);
    return result.insertId;
  }

  /**
   * 移除用户角色
   */
  async removeRole(userId: number, roleId: number, storeId?: number): Promise<boolean> {
    let query = `DELETE FROM ${this.tableName} WHERE user_id = ? AND role_id = ?`;
    const params: any[] = [userId, roleId];

    if (storeId !== undefined) {
      query += ' AND store_id = ?';
      params.push(storeId);
    }

    const affectedRows = await QueryBuilder.delete(query, params);
    return affectedRows > 0;
  }

  /**
   * 移除用户的所有角色
   */
  async removeAllRoles(userId: number): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE user_id = ?`;
    const affectedRows = await QueryBuilder.delete(query, [userId]);
    return affectedRows > 0;
  }
}

