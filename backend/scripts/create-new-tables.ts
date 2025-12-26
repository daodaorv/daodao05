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
      .filter((line) => !line.trim().startsWith('--'))
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
 * 创建新表
 */
async function createNewTables(): Promise<void> {
  try {
    logger.info('开始创建新表...');

    const sqlDir = path.join(__dirname, 'sql');
    const sqlFiles = [
      '16-create-contacts-table.sql',
      '17-create-rental-rules-table.sql',
    ];

    for (const file of sqlFiles) {
      const filePath = path.join(sqlDir, file);
      if (fs.existsSync(filePath)) {
        await executeSqlFile(filePath);
      } else {
        logger.warn(`SQL文件不存在: ${file}`);
      }
    }

    logger.info('新表创建完成！');
    process.exit(0);
  } catch (error) {
    logger.error('创建新表失败:', error);
    process.exit(1);
  }
}

createNewTables();
