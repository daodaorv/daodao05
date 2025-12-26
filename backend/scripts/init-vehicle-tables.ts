import { db } from '../src/db/connection';
import { logger } from '../src/utils/logger';
import fs from 'fs';
import path from 'path';

async function initVehicleTables() {
  try {
    logger.info('开始创建车辆相关表...');

    // 执行SQL文件列表
    const sqlFiles = [
      '04-create-vehicle-models-table.sql',
      '05-create-vehicles-table.sql',
      '06-create-orders-table.sql',
      '07-create-order-status-logs-table.sql',
      '08-create-payments-table.sql',
      '09-seed-vehicles-data.sql',
    ];

    for (const file of sqlFiles) {
      const filePath = path.join(__dirname, 'sql', file);
      if (!fs.existsSync(filePath)) {
        logger.warn(`文件不存在: ${file}`);
        continue;
      }

      logger.info(`执行: ${file}`);
      const sql = fs.readFileSync(filePath, 'utf-8');

      // 分割SQL语句
      const statements = sql
        .split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n')
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const stmt of statements) {
        try {
          await db.query(stmt);
        } catch (error: any) {
          // 忽略重复键错误
          if (!error.message.includes('Duplicate entry')) {
            throw error;
          }
        }
      }
      logger.info(`✓ ${file} 执行成功`);
    }

    logger.info('所有表创建完成!');
    process.exit(0);
  } catch (error) {
    logger.error('创建表失败:', error);
    process.exit(1);
  }
}

initVehicleTables();
