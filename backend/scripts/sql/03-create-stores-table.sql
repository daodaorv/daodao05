-- 创建门店表
USE daodao;

CREATE TABLE IF NOT EXISTS stores (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '门店ID',
    name VARCHAR(100) NOT NULL COMMENT '门店名称',
    code VARCHAR(20) UNIQUE NOT NULL COMMENT '门店编码',
    type ENUM('company', 'franchise', 'partner') NOT NULL DEFAULT 'company' COMMENT '门店类型',
    contact_person VARCHAR(50) COMMENT '联系人',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    email VARCHAR(100) COMMENT '邮箱',
    province VARCHAR(50) COMMENT '省份',
    city VARCHAR(50) COMMENT '城市',
    district VARCHAR(50) COMMENT '区县',
    address TEXT NOT NULL COMMENT '详细地址',
    location_lat DECIMAL(10,8) COMMENT '纬度',
    location_lng DECIMAL(11,8) COMMENT '经度',
    business_hours JSON COMMENT '营业时间',
    services JSON COMMENT '服务项目',
    images JSON COMMENT '门店图片',
    description TEXT COMMENT '门店描述',
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '状态',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_name (name),
    INDEX idx_code (code),
    INDEX idx_type (type),
    INDEX idx_city (city),
    INDEX idx_status (status),
    INDEX idx_location (location_lat, location_lng)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='门店表';

-- 插入测试数据
INSERT INTO stores (name, code, contact_person, contact_phone, province, city, district, address, location_lat, location_lng, status, sort_order) VALUES
('北京朝阳门店', 'BJ001', '张经理', '13800138001', '北京市', '北京', '朝阳区', '朝阳区建国路88号', 39.9042, 116.4074, 'active', 100),
('上海浦东门店', 'SH001', '李经理', '13800138002', '上海市', '上海', '浦东新区', '浦东新区世纪大道1号', 31.2304, 121.4737, 'active', 90),
('广州天河门店', 'GZ001', '王经理', '13800138003', '广东省', '广州', '天河区', '天河区天河路123号', 23.1291, 113.2644, 'active', 80),
('深圳南山门店', 'SZ001', '赵经理', '13800138004', '广东省', '深圳', '南山区', '南山区科技园南路456号', 22.5431, 114.0579, 'active', 70),
('成都武侯门店', 'CD001', '刘经理', '13800138005', '四川省', '成都', '武侯区', '武侯区人民南路789号', 30.5728, 104.0668, 'active', 60);
