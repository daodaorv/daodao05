import { BaseDao } from './base.dao';
import { Role, RoleType, RoleStatus, DataScope } from '../types/models/role.types';
import { QueryBuilder } from '../db/query-builder';

/**
 * 角色数据访问对象
 */
export class RoleDAO extends BaseDao<Role> {
  constructor() {
    super('roles');
  }

  /**
   * 根据ID查询角色
   */
  async findById(roleId: number): Promise<Role | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    return QueryBuilder.queryOne<Role>(query, [roleId]);
  }

  /**
   * 根据角色代码查询角色
   */
  async findByCode(code: string): Promise<Role | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE code = ?`;
    return QueryBuilder.queryOne<Role>(query, [code]);
  }

  /**
   * 根据类型查询角色列表
   */
  async findByType(type: RoleType): Promise<Role[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE type = ? AND status = 'active' ORDER BY id`;
    return QueryBuilder.query<Role>(query, [type]);
  }

  /**
   * 查询所有激活的角色
   */
  async findAllActive(): Promise<Role[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE status = 'active' ORDER BY type, id`;
    return QueryBuilder.query<Role>(query);
  }

  /**
   * 创建角色
   */
  async createRole(data: {
    name: string;
    code: string;
    type: RoleType;
    data_scope?: DataScope;
    description?: string;
  }): Promise<number> {
    const query = `
      INSERT INTO ${this.tableName} (name, code, type, data_scope, description)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await QueryBuilder.insert(query, [
      data.name,
      data.code,
      data.type,
      data.data_scope || DataScope.SELF,
      data.description || null,
    ]);
    return result.insertId;
  }

  /**
   * 更新角色信息
   */
  async updateRole(
    roleId: number,
    data: {
      name?: string;
      data_scope?: DataScope;
      description?: string;
      status?: RoleStatus;
    }
  ): Promise<boolean> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.data_scope !== undefined) {
      updates.push('data_scope = ?');
      values.push(data.data_scope);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description);
    }
    if (data.status !== undefined) {
      updates.push('status = ?');
      values.push(data.status);
    }

    if (updates.length === 0) {
      return false;
    }

    values.push(roleId);
    const query = `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = ?`;
    const affectedRows = await QueryBuilder.update(query, values);
    return affectedRows > 0;
  }

  /**
   * 删除角色
   */
  async deleteRole(roleId: number): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const affectedRows = await QueryBuilder.delete(query, [roleId]);
    return affectedRows > 0;
  }

  /**
   * 删除角色的所有权限
   */
  async deleteRolePermissions(roleId: number): Promise<void> {
    const query = 'DELETE FROM role_permissions WHERE role_id = ?';
    await QueryBuilder.execute(query, [roleId]);
  }

  /**
   * 为角色分配权限
   */
  async assignPermissions(roleId: number, permissionIds: number[]): Promise<void> {
    for (const permissionId of permissionIds) {
      const query = 'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)';
      await QueryBuilder.execute(query, [roleId, permissionId]);
    }
  }
}
