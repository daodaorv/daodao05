/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryBuilder } from '@db/query-builder';
import { RowDataPacket } from 'mysql2/promise';

/**
 * 基础DAO类
 * 提供通用的CRUD操作
 */
export class BaseDao<T extends RowDataPacket> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * 根据ID查询
   */
  async findById(id: number): Promise<T | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    return QueryBuilder.queryOne<T>(sql, [id]);
  }

  /**
   * 查询所有记录
   */
  async findAll(): Promise<T[]> {
    const sql = `SELECT * FROM ${this.tableName}`;
    return QueryBuilder.query<T>(sql);
  }

  /**
   * 分页查询
   */
  async findPaginated(page: number, pageSize: number): Promise<{
    data: T[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const sql = `SELECT * FROM ${this.tableName}`;
    return QueryBuilder.paginate<T>(sql, [], page, pageSize);
  }

  /**
   * 根据条件查询
   */
  async findByCondition(condition: string, params: any[]): Promise<T[]> {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${condition}`;
    return QueryBuilder.query<T>(sql, params);
  }

  /**
   * 插入记录
   */
  async insert(data: Partial<T>): Promise<number> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
    const result = await QueryBuilder.insert(sql, values);
    return result.insertId;
  }

  /**
   * 更新记录
   */
  async update(id: number, data: Partial<T>): Promise<number> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key) => `${key} = ?`).join(', ');
    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    return QueryBuilder.update(sql, [...values, id]);
  }

  /**
   * 删除记录
   */
  async delete(id: number): Promise<number> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    return QueryBuilder.delete(sql, [id]);
  }
}
