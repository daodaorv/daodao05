-- 联系人表创建脚本
USE daodao;

-- 联系人表
CREATE TABLE IF NOT EXISTS contacts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '联系人ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    name VARCHAR(50) NOT NULL COMMENT '联系人姓名',
    phone VARCHAR(20) NOT NULL COMMENT '手机号码',
    id_card VARCHAR(18) NOT NULL COMMENT '身份证号',
    driver_license_no VARCHAR(50) NOT NULL COMMENT '驾驶证号',
    driver_license_front VARCHAR(500) NOT NULL COMMENT '驾驶证正面照片URL',
    driver_license_back VARCHAR(500) NOT NULL COMMENT '驾驶证反面照片URL',
    is_default BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否默认联系人',
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_phone (phone),
    INDEX idx_status (status),
    INDEX idx_is_default (is_default),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='联系人表';
