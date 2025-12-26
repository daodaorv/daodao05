import { db } from '../src/db/connection';
import { logger } from '../src/utils/logger';
import fs from 'fs';
import path from 'path';

/**
 * 填充种子数据
 */
async function seedData(): Promise<void> {
  try {
    logger.info('开始填充种子数据...');

    const sqlFile = path.join(__dirname, 'sql', '04-seed-data.sql');
    const sql = fs.readFileSync(sqlFile, 'utf-8');

    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement) {
        await db.query(statement);
      }
    }

    logger.info('种子数据填充完成！');
    process.exit(0);
  } catch (error) {
    logger.error('种子数据填充失败:', error);
    process.exit(1);
  }
}

seedData();
