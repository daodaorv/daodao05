import { db } from '../src/db/connection';
import { logger } from '../src/utils/logger';

async function checkTables(): Promise<void> {
  try {
    logger.info('检查数据库表...');

    const [tables] = await db.query('SHOW TABLES FROM daodao');
    logger.info('数据库中的表:', tables);

    // 检查vehicles表
    try {
      const [vehiclesCount] = await db.query('SELECT COUNT(*) as count FROM daodao.vehicles');
      logger.info('vehicles表记录数:', vehiclesCount);
    } catch (error) {
      logger.error('vehicles表不存在或查询失败:', error);
    }

    // 检查vehicle_models表
    try {
      const [modelsCount] = await db.query('SELECT COUNT(*) as count FROM daodao.vehicle_models');
      logger.info('vehicle_models表记录数:', modelsCount);
    } catch (error) {
      logger.error('vehicle_models表不存在或查询失败:', error);
    }

    process.exit(0);
  } catch (error) {
    logger.error('检查表失败:', error);
    process.exit(1);
  }
}

checkTables();
