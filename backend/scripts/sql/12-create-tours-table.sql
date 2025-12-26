-- =============================================
-- 旅游线路表创建脚本
-- 创建时间: 2025-12-25
-- 说明: P2增值服务 - 房车旅游模块
-- =============================================

USE daodao;

-- 创建旅游线路表
CREATE TABLE IF NOT EXISTS tours (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '线路ID',
    title VARCHAR(200) NOT NULL COMMENT '线路标题',
    image VARCHAR(500) COMMENT '主图片',
    images JSON COMMENT '图片列表',
    tags JSON COMMENT '标签',
    duration INT NOT NULL COMMENT '行程天数',
    min_people INT NOT NULL COMMENT '最少人数',
    max_people INT NOT NULL COMMENT '最多人数',
    destination VARCHAR(100) NOT NULL COMMENT '目的地',
    price_per_person DECIMAL(10,2) NOT NULL COMMENT '成人价格',
    child_price DECIMAL(10,2) NOT NULL COMMENT '儿童价格',
    is_hot BOOLEAN DEFAULT FALSE COMMENT '是否热门',
    itinerary JSON COMMENT '行程安排',
    price_includes JSON COMMENT '费用包含',
    price_excludes JSON COMMENT '费用不含',
    booking_notices JSON COMMENT '预订须知',
    cancellation_policy JSON COMMENT '取消政策',
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_title (title),
    INDEX idx_status (status),
    INDEX idx_is_hot (is_hot),
    INDEX idx_duration (duration),
    INDEX idx_price (price_per_person)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='旅游线路表';
