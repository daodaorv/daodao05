import { createApp } from './app';
import { config } from '@config/index';
import { logger } from '@utils/logger';
import { testConnection, closePool } from '@db/connection';
import { connectRedis, testRedisConnection, disconnectRedis } from '@config/redis';

/**
 * 启动服务器
 */
async function startServer(): Promise<void> {
  try {
    // 测试数据库连接
    logger.info('正在测试数据库连接...');
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('数据库连接失败');
    }

    // 连接Redis
    logger.info('正在连接Redis...');
    await connectRedis();
    const redisConnected = await testRedisConnection();
    if (!redisConnected) {
      logger.warn('Redis连接失败，部分功能可能不可用');
    }

    // 创建Express应用
    const app = createApp();

    // 启动服务器
    const server = app.listen(config.port, config.host, () => {
      logger.info(`服务器已启动: http://${config.host}:${config.port}`);
      logger.info(`环境: ${config.env}`);
    });

    // 优雅关闭
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`收到 ${signal} 信号，正在关闭服务器...`);

      server.close(async () => {
        logger.info('HTTP服务器已关闭');

        // 关闭数据库连接
        await closePool();

        // 关闭Redis连接
        await disconnectRedis();

        logger.info('所有连接已关闭，进程退出');
        process.exit(0);
      });

      // 强制退出超时
      setTimeout(() => {
        logger.error('强制退出进程');
        process.exit(1);
      }, 10000);
    };

    // 监听退出信号
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // 监听未捕获的异常
    process.on('uncaughtException', (error) => {
      logger.error('未捕获的异常:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('未处理的Promise拒绝:', reason);
      gracefulShutdown('unhandledRejection');
    });
  } catch (error) {
    logger.error('服务器启动失败:', error);
    process.exit(1);
  }
}

// 启动服务器
startServer();





 
