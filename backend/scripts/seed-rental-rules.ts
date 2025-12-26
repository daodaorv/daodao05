import { db } from '../src/db/connection';
import { logger } from '../src/utils/logger';
import fs from 'fs';
import path from 'path';

async function seedRentalRules(): Promise<void> {
  try {
    logger.info('开始插入租车须知测试数据...');

    const sqlFile = path.join(__dirname, 'sql/18-seed-rental-rules-data.sql');
    const sql = fs.readFileSync(sqlFile, 'utf-8');

    // 分割SQL语句
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && s !== 'USE daodao');

    for (const statement of statements) {
      if (statement) {
        await db.query(statement);
      }
    }

    logger.info('租车须知测试数据插入成功！');
    process.exit(0);
  } catch (error) {
    logger.error('插入租车须知测试数据失败:', error);
    process.exit(1);
  }
}

seedRentalRules();
