/**
 * 创建tour_batches表并补充批次数据
 */

import { db } from '../src/db/connection';
import { logger } from '../src/utils/logger';
import * as fs from 'fs';
import * as path from 'path';

async function createTableAndAddBatches() {
  const connection = await db.getConnection();

  try {
    logger.info('开始创建tour_batches表...');

    // 读取SQL文件
    const sqlPath = path.join(__dirname, 'sql', 'create-tour-batches.sql');
    const createTableSQL = fs.readFileSync(sqlPath, 'utf8');

    // 执行创建表SQL
    await connection.query(createTableSQL);
    logger.info('✅ tour_batches表创建成功');

    // 添加批次数据
    const batchSQL = `
      INSERT INTO tour_batches (
        tour_id, departure_date, return_date, status,
        current_people, max_people, guide_name, guide_phone
      ) VALUES
      (2, '2026-05-01', '2026-05-07', 'recruiting', 3, 6, '张导', '13800138001'),
      (2, '2026-06-01', '2026-06-07', 'recruiting', 5, 6, '李导', '13800138002'),
      (2, '2026-07-01', '2026-07-07', 'confirmed', 6, 6, '王导', '13800138003')
    `;

    await connection.query(batchSQL);
    logger.info('✅ 已添加3个旅游批次');

    logger.info('🎉 tour_batches表创建和数据补充完成！');
  } catch (error) {
    logger.error('操作失败', error);
    throw error;
  } finally {
    connection.release();
  }
}

// 执行脚本
createTableAndAddBatches()
  .then(() => {
    logger.info('脚本执行成功');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('脚本执行失败', error);
    process.exit(1);
  });
