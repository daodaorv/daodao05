import { createClient } from 'redis';
import { config } from '@config/index';
import { logger } from '@utils/logger';

/**
 * Redis客户端类型
 */
type RedisClientType = ReturnType<typeof createClient>;

/**
 * Redis连接管理类
 */
class RedisConnection {
  private static instance: RedisClientType;

  private constructor() {}

  /**
   * 获取Redis客户端实例（单例模式）
   */
  public static getInstance(): RedisClientType {
    if (!RedisConnection.instance) {
      const clientConfig: Parameters<typeof createClient>[0] = {
        socket: {
          host: config.redis.host,
          port: config.redis.port,
        },
        database: config.redis.db,
      };

      // 仅当密码非空时配置
      if (config.redis.password) {
        clientConfig.password = config.redis.password;
      }

      RedisConnection.instance = createClient(clientConfig);

      RedisConnection.instance.on('error', (err) => {
        logger.error('Redis客户端错误:', err);
      });

      RedisConnection.instance.on('connect', () => {
        logger.info('Redis连接成功');
      });
    }

    return RedisConnection.instance;
  }

  /**
   * 连接Redis
   */
  public static async connect(): Promise<void> {
    const client = RedisConnection.getInstance();
    if (!client.isOpen) {
      await client.connect();
    }
  }

  /**
   * 测试Redis连接
   */
  public static async testConnection(): Promise<boolean> {
    try {
      const client = RedisConnection.getInstance();
      if (!client.isOpen) {
        await client.connect();
      }
      await client.ping();
      logger.info('Redis连接测试成功');
      return true;
    } catch (error) {
      logger.error('Redis连接测试失败:', error);
      return false;
    }
  }

  /**
   * 关闭Redis连接
   */
  public static async disconnect(): Promise<void> {
    if (RedisConnection.instance && RedisConnection.instance.isOpen) {
      await RedisConnection.instance.quit();
      logger.info('Redis连接已关闭');
    }
  }
}

export const redisClient = RedisConnection.getInstance();
export const connectRedis = RedisConnection.connect;
export const testRedisConnection = RedisConnection.testConnection;
export const disconnectRedis = RedisConnection.disconnect;
