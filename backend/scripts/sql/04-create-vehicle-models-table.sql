-- =============================================
-- 车型表创建脚本
-- 创建时间: 2025-12-25
-- 说明: 第2批API开发 - 车辆模块基础表
-- =============================================

USE daodao;

-- 创建车型表
CREATE TABLE IF NOT EXISTS vehicle_models (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '车型ID',
    name VARCHAR(100) NOT NULL COMMENT '车型名称',
    brand VARCHAR(50) NOT NULL COMMENT '品牌',
    series VARCHAR(50) COMMENT '系列',
    type ENUM('A型', 'B型', 'C型', '拖挂式', '自行式', '越野型') NOT NULL COMMENT '车型类型',
    seats INT NOT NULL COMMENT '座位数',
    sleep_capacity INT NOT NULL COMMENT '可睡人数',
    length DECIMAL(5,2) COMMENT '车长(米)',
    width DECIMAL(5,2) COMMENT '车宽(米)',
    height DECIMAL(5,2) COMMENT '车高(米)',
    fuel_type ENUM('汽油', '柴油', '电动', '混合动力') NOT NULL COMMENT '燃料类型',
    transmission ENUM('手动', '自动') NOT NULL COMMENT '变速箱类型',
    engine_displacement DECIMAL(4,1) COMMENT '排量(L)',
    features JSON COMMENT '车型特点',
    specifications JSON COMMENT '详细规格',
    images JSON COMMENT '车型图片',
    description TEXT COMMENT '车型描述',
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '状态',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_brand (brand),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='车型表';

-- 插入测试数据
INSERT INTO vehicle_models (name, brand, series, type, seats, sleep_capacity, length, width, height, fuel_type, transmission, engine_displacement, features, specifications, description, status, sort_order) VALUES
('大通RV80 C型房车', '上汽大通', 'RV80', 'C型', 6, 4, 5.99, 2.30, 3.20, '柴油', '手动', 2.5,
 '["独立卫浴", "中央空调", "太阳能板", "外置厨房", "大容量水箱"]',
 '{"水箱容量": "200L", "电池容量": "200Ah", "发电机": "3KW", "空调": "顶置空调"}',
 '经典C型房车,适合家庭出游,配置齐全,性价比高', 'active', 100),

('依维柯欧胜 B型房车', '依维柯', '欧胜', 'B型', 4, 2, 5.41, 2.05, 2.52, '柴油', '手动', 3.0,
 '["隐蔽性好", "城市通勤", "升顶设计", "智能家居", "节能环保"]',
 '{"水箱容量": "120L", "电池容量": "150Ah", "升顶高度": "1.9m", "空调": "驻车空调"}',
 '低调奢华的B型房车,适合城市穿梭和长途旅行', 'active', 90),

('福特全顺 B型房车', '福特', '全顺', 'B型', 4, 2, 5.34, 2.03, 2.40, '柴油', '手动', 2.2,
 '["经济实用", "操控灵活", "空间优化", "多功能布局"]',
 '{"水箱容量": "100L", "电池容量": "120Ah", "空调": "驻车空调"}',
 '入门级B型房车,经济实惠,适合新手体验', 'active', 80),

('奔驰斯宾特 B型房车', '奔驰', '斯宾特', 'B型', 4, 2, 5.93, 2.02, 2.43, '柴油', '自动', 2.1,
 '["豪华配置", "智能驾驶", "静音舒适", "高端内饰", "安全性能"]',
 '{"水箱容量": "150L", "电池容量": "200Ah", "空调": "独立空调", "音响": "BOSE音响"}',
 '豪华B型房车,配置顶级,驾乘体验极佳', 'active', 95),

('览众风骏房车 C型', '览众', '风骏', 'C型', 6, 6, 5.99, 2.30, 3.15, '柴油', '手动', 2.8,
 '["大空间", "多床位", "家庭出游", "储物丰富", "性价比高"]',
 '{"水箱容量": "180L", "电池容量": "180Ah", "发电机": "2.5KW", "空调": "顶置空调"}',
 '大空间C型房车,适合多人家庭出游', 'active', 85);
