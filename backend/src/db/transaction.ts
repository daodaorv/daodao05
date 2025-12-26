import { db } from './connection';
import { PoolConnection } from 'mysql2/promise';
import { logger } from '@utils/logger';

/**
 * 事务管理类
 */
export class Transaction {
  /**
   * 执行事务
   */
  static async execute<T>(
    callback: (connection: PoolConnection) => Promise<T>
  ): Promise<T> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      logger.error('事务回滚:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}
