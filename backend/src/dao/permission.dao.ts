import { ResultSetHeader } from 'mysql2';
import { BaseDao } from './base.dao';
import { Permission } from '../types/models/role.types';

/**
 * 权限数据访问对象
 */
export class PermissionDAO extends BaseDao<Permission> {
  constructor() {
    super('permissions');
  }

  /**
   * 根据ID查询权限
   */
  async findById(permissionId: number): Promise<Permission | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const [rows] = await this.pool.execute<Permission[]>(query, [permissionId]);
    return rows[0] || null;
  }

  /**
   * 根据权限代码查询权限
   */
  async findByCode(code: string): Promise<Permission | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE code = ?`;
    const [rows] = await this.pool.execute<Permission[]>(query, [code]);
    return rows[0] || null;
  }

  /**
   * 根据资源模块查询权限列表
   */
  async findByResource(resource: string): Promise<Permission[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE resource = ? ORDER BY action`;
    const [rows] = await this.pool.execute<Permission[]>(query, [resource]);
    return rows;
  }

  /**
   * 查询所有权限
   */
  async findAll(): Promise<Permission[]> {
    const query = `SELECT * FROM ${this.tableName} ORDER BY resource, action`;
    const [rows] = await this.pool.execute<Permission[]>(query);
    return rows;
  }

  /**
   * 根据角色ID查询权限列表
   */
  async findByRoleId(roleId: number): Promise<Permission[]> {
    const query = `
      SELECT p.*
      FROM ${this.tableName} p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
      ORDER BY p.resource, p.action
    `;
    const [rows] = await this.pool.execute<Permission[]>(query, [roleId]);
    return rows;
  }

  /**
   * 根据用户ID查询权限列表（通过用户角色）
   */
  async findByUserId(userId: number): Promise<Permission[]> {
    const query = `
      SELECT DISTINCT p.*
      FROM ${this.tableName} p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      INNER JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = ?
      ORDER BY p.resource, p.action
    `;
    const [rows] = await this.pool.execute<Permission[]>(query, [userId]);
    return rows;
  }

  /**
   * 创建权限
   */
  async createPermission(data: {
    code: string;
    name: string;
    resource: string;
    action: string;
    description?: string;
  }): Promise<number> {
    const query = `
      INSERT INTO ${this.tableName} (code, name, resource, action, description)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await this.pool.execute<ResultSetHeader>(query, [
      data.code,
      data.name,
      data.resource,
      data.action,
      data.description || null,
    ]);
    return result.insertId;
  }

  /**
   * 删除权限
   */
  async deletePermission(permissionId: number): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const [result] = await this.pool.execute<ResultSetHeader>(query, [permissionId]);
    return result.affectedRows > 0;
  }
}
