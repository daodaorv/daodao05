import { db } from './connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

/**
 * 查询构建器类
 */
export class QueryBuilder {
  /**
   * 执行查询并返回结果
   */
  static async query<T extends RowDataPacket>(
    sql: string,
    params?: unknown[]
  ): Promise<T[]> {
    // 使用query代替execute来避免prepared statement的问题
    const [rows] = await db.query<T[]>(sql, params);
    return rows;
  }

  /**
   * 执行查询并返回单条记录
   */
  static async queryOne<T extends RowDataPacket>(
    sql: string,
    params?: unknown[]
  ): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * 执行通用操作（INSERT/UPDATE/DELETE）
   */
  static async execute(sql: string, params?: unknown[]): Promise<ResultSetHeader> {
    const [result] = await db.execute<ResultSetHeader>(sql, params);
    return result;
  }

  /**
   * 执行插入操作
   */
  static async insert(sql: string, params?: unknown[]): Promise<ResultSetHeader> {
    const [result] = await db.execute<ResultSetHeader>(sql, params);
    return result;
  }

  /**
   * 执行更新操作
   */
  static async update(sql: string, params?: unknown[]): Promise<number> {
    const [result] = await db.execute<ResultSetHeader>(sql, params);
    return result.affectedRows;
  }

  /**
   * 执行删除操作
   */
  static async delete(sql: string, params?: unknown[]): Promise<number> {
    const [result] = await db.execute<ResultSetHeader>(sql, params);
    return result.affectedRows;
  }

  /**
   * 分页查询
   */
  static async paginate<T extends RowDataPacket>(
    sql: string,
    params: unknown[],
    page: number,
    pageSize: number
  ): Promise<{ data: T[]; total: number; page: number; pageSize: number }> {
    // 获取总数
    const countSql = `SELECT COUNT(*) as total FROM (${sql}) as count_table`;
    const countResult = await this.queryOne<RowDataPacket & { total: number }>(countSql, params);
    const total = countResult?.total || 0;

    // 获取分页数据
    const offset = (page - 1) * pageSize;
    const paginatedSql = `${sql} LIMIT ? OFFSET ?`;
    const data = await this.query<T>(paginatedSql, [...params, pageSize, offset]);

    return { data, total, page, pageSize };
  }
}
