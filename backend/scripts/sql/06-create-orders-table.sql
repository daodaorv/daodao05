-- =============================================
-- 订单表创建脚本
-- 创建时间: 2025-12-25
-- 说明: 第2批API开发 - 订单管理表
-- =============================================

USE daodao;

-- 创建订单表
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID',
    order_no VARCHAR(32) UNIQUE NOT NULL COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    vehicle_id BIGINT NOT NULL COMMENT '车辆ID',
    store_id BIGINT NOT NULL COMMENT '取车门店ID',
    return_store_id BIGINT COMMENT '还车门店ID',
    start_date DATE NOT NULL COMMENT '租赁开始日期',
    end_date DATE NOT NULL COMMENT '租赁结束日期',
    days INT NOT NULL COMMENT '租赁天数',
    daily_price DECIMAL(10,2) NOT NULL COMMENT '日租金',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
    deposit DECIMAL(10,2) NOT NULL COMMENT '押金',
    discount_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '优惠金额',
    actual_amount DECIMAL(10,2) NOT NULL COMMENT '实付金额',
    status ENUM('pending', 'paid', 'confirmed', 'picked_up', 'returned', 'completed', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT '订单状态',
    payment_status ENUM('unpaid', 'paid', 'refunding', 'refunded') NOT NULL DEFAULT 'unpaid' COMMENT '支付状态',
    pickup_time TIMESTAMP NULL COMMENT '实际取车时间',
    return_time TIMESTAMP NULL COMMENT '实际还车时间',
    pickup_confirmed_by BIGINT COMMENT '取车确认人ID',
    return_confirmed_by BIGINT COMMENT '还车确认人ID',
    cancel_reason VARCHAR(500) COMMENT '取消原因',
    cancelled_by BIGINT COMMENT '取消操作人ID',
    cancelled_at TIMESTAMP NULL COMMENT '取消时间',
    remark VARCHAR(500) COMMENT '备注',
    completed_at TIMESTAMP NULL COMMENT '完成时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE RESTRICT,
    FOREIGN KEY (return_store_id) REFERENCES stores(id) ON DELETE SET NULL,
    FOREIGN KEY (pickup_confirmed_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (return_confirmed_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (cancelled_by) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_order_no (order_no),
    INDEX idx_user_id (user_id),
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_store_id (store_id),
    INDEX idx_status (status),
    INDEX idx_start_date (start_date),
    INDEX idx_end_date (end_date),
    INDEX idx_created_at (created_at),
    INDEX idx_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';
