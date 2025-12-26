-- 种子数据
USE daodao;

-- 插入角色数据
INSERT INTO roles (name, code, description, status) VALUES
('超级管理员', 'super_admin', '系统超级管理员，拥有所有权限', 'active'),
('管理员', 'admin', 'PC管理端管理员', 'active'),
('客户', 'customer', '普通客户用户', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 插入车辆品牌数据
INSERT INTO vehicle_brands (name, name_en, country, status) VALUES
('大通', 'MAXUS', '中国', 'active'),
('依维柯', 'IVECO', '意大利', 'active'),
('福特', 'Ford', '美国', 'active'),
('奔驰', 'Mercedes-Benz', '德国', 'active'),
('江铃', 'JMC', '中国', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);
