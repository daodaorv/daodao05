-- 租车须知表创建脚本
USE daodao;

-- 租车须知表
CREATE TABLE IF NOT EXISTS rental_rules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '规则ID',
    product_type ENUM('vehicle', 'special-offer') NOT NULL COMMENT '产品类型',
    version VARCHAR(20) NOT NULL COMMENT '版本号',
    content JSON NOT NULL COMMENT '规则内容(JSON格式)',
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_product_type (product_type),
    INDEX idx_status (status),
    INDEX idx_version (version),
    UNIQUE KEY uk_product_version (product_type, version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='租车须知表';
