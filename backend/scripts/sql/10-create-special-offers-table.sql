-- =============================================
-- 特惠租车表创建脚本
-- 创建时间: 2025-12-25
-- 说明: P2增值服务 - 特惠租车模块
-- =============================================

USE daodao;

-- 创建特惠租车表
CREATE TABLE IF NOT EXISTS special_offers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '特惠套餐ID',
    route_from VARCHAR(50) NOT NULL COMMENT '出发地',
    route_to VARCHAR(50) NOT NULL COMMENT '目的地',
    vehicle_id BIGINT NOT NULL COMMENT '车辆ID',
    vehicle_name VARCHAR(100) NOT NULL COMMENT '车辆名称',
    vehicle_image VARCHAR(500) COMMENT '车辆图片',
    vehicle_features JSON COMMENT '车辆特色',
    package_price DECIMAL(10,2) NOT NULL COMMENT '套餐价格',
    original_price DECIMAL(10,2) NOT NULL COMMENT '原价',
    rental_days INT NOT NULL COMMENT '租赁天数',
    available_time_start DATE NOT NULL COMMENT '可用时间开始',
    available_time_end DATE NOT NULL COMMENT '可用时间结束',
    remaining_quota INT NOT NULL DEFAULT 0 COMMENT '剩余配额',
    total_quota INT NOT NULL COMMENT '总配额',
    pickup_store_id BIGINT NOT NULL COMMENT '取车门店ID',
    return_store_id BIGINT NOT NULL COMMENT '还车门店ID',
    package_includes JSON COMMENT '套餐包含内容',
    booking_notices JSON COMMENT '预订须知',
    cancellation_policy JSON COMMENT '取消政策',
    status ENUM('ACTIVE', 'INACTIVE', 'SOLD_OUT') NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT,
    FOREIGN KEY (pickup_store_id) REFERENCES stores(id) ON DELETE RESTRICT,
    FOREIGN KEY (return_store_id) REFERENCES stores(id) ON DELETE RESTRICT,

    INDEX idx_route (route_from, route_to),
    INDEX idx_price (package_price),
    INDEX idx_status (status),
    INDEX idx_available_time (available_time_start, available_time_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='特惠租车套餐表';
