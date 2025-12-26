-- =============================================
-- 支付记录表创建脚本
-- 创建时间: 2025-12-25
-- 说明: 第2批API开发 - 支付管理表
-- =============================================

USE daodao;

-- 创建支付记录表
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '支付ID',
    payment_no VARCHAR(32) UNIQUE NOT NULL COMMENT '支付单号',
    order_id BIGINT NOT NULL COMMENT '订单ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    type ENUM('order', 'deposit', 'violation_deposit', 'penalty', 'compensation') NOT NULL COMMENT '支付类型',
    amount DECIMAL(10,2) NOT NULL COMMENT '支付金额',
    method ENUM('wechat', 'alipay', 'balance', 'cash') NOT NULL COMMENT '支付方式',
    channel VARCHAR(50) COMMENT '支付渠道',
    third_party_no VARCHAR(100) COMMENT '第三方支付单号',
    status ENUM('pending', 'success', 'failed', 'cancelled', 'refunding', 'refunded') NOT NULL DEFAULT 'pending' COMMENT '支付状态',
    paid_at TIMESTAMP NULL COMMENT '支付时间',
    refund_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '退款金额',
    refund_reason VARCHAR(500) COMMENT '退款原因',
    refund_at TIMESTAMP NULL COMMENT '退款时间',
    remark VARCHAR(500) COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,

    INDEX idx_payment_no (payment_no),
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付记录表';
