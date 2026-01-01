import { db } from '../src/db/connection';
import { logger } from '../src/utils/logger';

async function createOperationLogsTable() {
  const connection = await db.getConnection();

  try {
    logger.info('开始创建operation_logs表...');

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS operation_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL COMMENT '操作用户ID',
        operator VARCHAR(100) NOT NULL COMMENT '操作人姓名',
        operator_avatar VARCHAR(255) COMMENT '操作人头像',
        module VARCHAR(50) NOT NULL COMMENT '操作模块',
        action VARCHAR(50) NOT NULL COMMENT '操作类型',
        description TEXT COMMENT '操作描述',
        ip VARCHAR(50) COMMENT 'IP地址',
        user_agent TEXT COMMENT '用户代理',
        status ENUM('success', 'failed') DEFAULT 'success' COMMENT '操作状态',
        duration INT COMMENT '执行时长(ms)',
        request_params TEXT COMMENT '请求参数',
        response_data TEXT COMMENT '响应数据',
        error_message TEXT COMMENT '错误信息',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_module (module),
        INDEX idx_action (action),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';
    `;

    await connection.query(createTableSQL);
    logger.info('✅ operation_logs表创建成功');
  } catch (error) {
    logger.error('创建operation_logs表失败:', error);
    throw error;
  } finally {
    connection.release();
  }
}

createOperationLogsTable()
  .then(() => {
    logger.info('脚本执行完成');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('脚本执行失败:', error);
    process.exit(1);
  });
