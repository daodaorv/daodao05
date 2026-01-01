import { BaseDao } from './base.dao';
import { OperationLog } from '../types/models/operation-log.types';
import { QueryBuilder } from '../db/query-builder';

/**
 * 操作日志数据访问对象
 */
export class OperationLogDAO extends BaseDao<OperationLog> {
  constructor() {
    super('operation_logs');
  }

  /**
   * 创建操作日志
   */
  async createLog(data: {
    user_id: number;
    operator: string;
    operator_avatar?: string;
    module: string;
    action: string;
    description?: string;
    ip?: string;
    user_agent?: string;
    status?: string;
    duration?: number;
    request_params?: string;
    response_data?: string;
    error_message?: string;
  }): Promise<number> {
    const query = `
      INSERT INTO ${this.tableName} 
      (user_id, operator, operator_avatar, module, action, description, 
       ip, user_agent, status, duration, request_params, response_data, error_message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await QueryBuilder.insert(query, [
      data.user_id,
      data.operator,
      data.operator_avatar || null,
      data.module,
      data.action,
      data.description || null,
      data.ip || null,
      data.user_agent || null,
      data.status || 'success',
      data.duration || null,
      data.request_params || null,
      data.response_data || null,
      data.error_message || null,
    ]);
    return result.insertId;
  }

  /**
   * 根据ID查询操作日志
   */
  async findById(id: number): Promise<OperationLog | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    return QueryBuilder.queryOne<OperationLog>(query, [id]);
  }

  /**
   * 清理指定日期之前的日志
   */
  async cleanBeforeDate(beforeDate: string): Promise<number> {
    const query = `DELETE FROM ${this.tableName} WHERE created_at < ?`;
    return QueryBuilder.delete(query, [beforeDate]);
  }
}
