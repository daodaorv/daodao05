-- =============================================
-- 车辆表创建脚本
-- 创建时间: 2025-12-25
-- 说明: 第2批API开发 - 车辆信息表
-- =============================================

USE daodao;

-- 创建车辆表
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '车辆ID',
    vehicle_no VARCHAR(20) UNIQUE NOT NULL COMMENT '车辆编号',
    model_id BIGINT NOT NULL COMMENT '车型ID',
    store_id BIGINT NOT NULL COMMENT '所属门店ID',
    license_plate VARCHAR(20) UNIQUE NOT NULL COMMENT '车牌号',
    vin VARCHAR(17) UNIQUE NOT NULL COMMENT '车架号',
    color VARCHAR(20) COMMENT '车身颜色',
    year INT NOT NULL COMMENT '出厂年份',
    mileage INT DEFAULT 0 COMMENT '行驶里程(公里)',
    status ENUM('available', 'rented', 'maintenance', 'retired') NOT NULL DEFAULT 'available' COMMENT '车辆状态',
    daily_price DECIMAL(10,2) NOT NULL COMMENT '日租金',
    deposit DECIMAL(10,2) NOT NULL COMMENT '押金',
    insurance_expire_date DATE COMMENT '保险到期日',
    annual_inspection_date DATE COMMENT '年检日期',
    last_maintenance_date DATE COMMENT '上次保养日期',
    next_maintenance_mileage INT COMMENT '下次保养里程',
    features JSON COMMENT '车辆特色配置',
    images JSON COMMENT '车辆图片',
    description TEXT COMMENT '车辆描述',
    remark VARCHAR(500) COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (model_id) REFERENCES vehicle_models(id) ON DELETE RESTRICT,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE RESTRICT,

    INDEX idx_vehicle_no (vehicle_no),
    INDEX idx_model_id (model_id),
    INDEX idx_store_id (store_id),
    INDEX idx_status (status),
    INDEX idx_license_plate (license_plate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='车辆表';
