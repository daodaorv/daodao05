-- 创建操作日志表
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
