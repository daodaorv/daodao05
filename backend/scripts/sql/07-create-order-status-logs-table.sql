-- =============================================
-- 订单状态日志表创建脚本
-- 创建时间: 2025-12-25
-- 说明: 第2批API开发 - 订单状态变更日志
-- =============================================

USE daodao;

-- 创建订单状态日志表
CREATE TABLE IF NOT EXISTS order_status_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '日志ID',
    order_id BIGINT NOT NULL COMMENT '订单ID',
    from_status VARCHAR(20) COMMENT '原状态',
    to_status VARCHAR(20) NOT NULL COMMENT '新状态',
    operator_id BIGINT COMMENT '操作人ID',
    operator_type ENUM('system', 'user', 'admin', 'mobile_admin') NOT NULL DEFAULT 'system' COMMENT '操作人类型',
    remark VARCHAR(500) COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_operator_id (operator_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单状态日志表';
