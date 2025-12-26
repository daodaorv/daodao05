import { db } from '../src/db/connection';
import { logger } from '../src/utils/logger';
import fs from 'fs';
import path from 'path';

/**
 * 执行SQL文件
 */
async function executeSqlFile(filePath: string): Promise<void> {
  try {
    const sql = fs.readFileSync(filePath, 'utf-8');

    // 移除注释并分割SQL语句
    const statements = sql
      .split('\n')
      .filter((line) => !line.trim().startsWith('--')) // 过滤注释行
      .join('\n')
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      if (statement) {
        await db.query(statement);
      }
    }
    logger.info(`执行SQL文件成功: ${path.basename(filePath)}`);
  } catch (error) {
    logger.error(`执行SQL文件失败: ${path.basename(filePath)}`, error);
    throw error;
  }
}

/**
 * 初始化数据库
 */
async function initDatabase(): Promise<void> {
  try {
    logger.info('开始初始化数据库...');

    const sqlDir = path.join(__dirname, 'sql');
    const sqlFiles = [
      '01-create-database.sql',
      '02-create-tables-part1.sql',
      '02-create-tables-part2.sql',
      '03-create-stores-table.sql',
      '04-create-vehicle-models-table.sql',
      '05-create-vehicles-table.sql',
      '06-create-orders-table.sql',
      '07-create-order-status-logs-table.sql',
      '08-create-payments-table.sql',
      '09-seed-vehicles-data.sql',
    ];

    for (const file of sqlFiles) {
      const filePath = path.join(sqlDir, file);
      if (fs.existsSync(filePath)) {
        await executeSqlFile(filePath);
      }
    }

    logger.info('数据库初始化完成！');
    process.exit(0);
  } catch (error) {
    logger.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

initDatabase();
