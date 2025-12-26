-- =============================================
-- 营地表创建脚本
-- 创建时间: 2025-12-25
-- 说明: P2增值服务 - 营地预订模块
-- =============================================

USE daodao;

-- 创建营地表
CREATE TABLE IF NOT EXISTS campsites (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '营地ID',
    name VARCHAR(100) NOT NULL COMMENT '营地名称',
    image VARCHAR(500) COMMENT '主图片',
    images JSON COMMENT '图片列表',
    tags JSON COMMENT '标签',
    rating DECIMAL(3,2) DEFAULT 0 COMMENT '评分',
    review_count INT DEFAULT 0 COMMENT '评价数量',
    min_price DECIMAL(10,2) NOT NULL COMMENT '最低价格',
    available_sites INT DEFAULT 0 COMMENT '可用营位数',
    is_hot BOOLEAN DEFAULT FALSE COMMENT '是否热门',
    address VARCHAR(200) NOT NULL COMMENT '地址',
    latitude DECIMAL(10,7) COMMENT '纬度',
    longitude DECIMAL(10,7) COMMENT '经度',
    features JSON COMMENT '特色',
    facilities JSON COMMENT '设施',
    description TEXT COMMENT '描述',
    check_in_notices JSON COMMENT '入住须知',
    cancellation_policy JSON COMMENT '取消政策',
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_name (name),
    INDEX idx_status (status),
    INDEX idx_is_hot (is_hot),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='营地表';
