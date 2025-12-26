import mysql from 'mysql2/promise';
import { config } from '@config/index';
import { logger } from '@utils/logger';

/**
 * 数据库连接池管理类
 */
class DatabaseConnection {
  private static instance: mysql.Pool;

  private constructor() {}

  /**
   * 获取连接池实例（单例模式）
   */
  public static getInstance(): mysql.Pool {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = mysql.createPool({
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name,
        connectionLimit: config.db.connectionLimit,
        queueLimit: config.db.queueLimit,
        waitForConnections: true,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        timezone: '+08:00',
        charset: 'utf8mb4',
        // 确保使用UTF-8编码,解决中文乱码问题
        typeCast: function (field, next) {
          if (field.type === 'VAR_STRING' || field.type === 'STRING' || field.type === 'TINY_BLOB' || field.type === 'MEDIUM_BLOB' || field.type === 'LONG_BLOB' || field.type === 'BLOB') {
            return field.string();
          }
          return next();
        },
      });

      logger.info('数据库连接池已创建');
    }

    return DatabaseConnection.instance;
  }

  /**
   * 测试数据库连接
   */
  public static async testConnection(): Promise<boolean> {
    try {
      const pool = DatabaseConnection.getInstance();
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      logger.info('数据库连接测试成功');
      return true;
    } catch (error) {
      logger.error('数据库连接测试失败:', error);
      return false;
    }
  }

  /**
   * 关闭连接池
   */
  public static async closePool(): Promise<void> {
    if (DatabaseConnection.instance) {
      await DatabaseConnection.instance.end();
      logger.info('数据库连接池已关闭');
    }
  }
}

export const db = DatabaseConnection.getInstance();
export const testConnection = DatabaseConnection.testConnection;
export const closePool = DatabaseConnection.closePool;
