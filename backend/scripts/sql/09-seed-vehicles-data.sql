-- =============================================
-- 车辆测试数据脚本
-- 创建时间: 2025-12-25
-- 说明: 为每个门店插入测试车辆数据
-- =============================================

USE daodao;

-- 插入车辆数据 (每个门店2-3辆车)
-- 北京朝阳门店 (store_id=1)
INSERT INTO vehicles (vehicle_no, model_id, store_id, license_plate, vin, color, year, mileage, status, daily_price, deposit, insurance_expire_date, annual_inspection_date, features, images, description) VALUES
('BJ001-001', 1, 1, '京A12345', 'LZYTBAA11JA123456', '珍珠白', 2023, 15000, 'available', 680.00, 5000.00, '2025-12-31', '2025-06-30',
 '["倒车影像", "GPS导航", "行车记录仪", "蓝牙音响"]',
 '["https://example.com/vehicle1.jpg"]',
 '车况良好,定期保养,适合家庭出游'),

('BJ001-002', 2, 1, '京A23456', 'LZYTBAA11JA234567', '商务灰', 2022, 28000, 'available', 580.00, 4000.00, '2025-12-31', '2025-06-30',
 '["倒车影像", "GPS导航", "行车记录仪"]',
 '["https://example.com/vehicle2.jpg"]',
 '经济实用,操控灵活'),

('BJ001-003', 4, 1, '京A34567', 'LZYTBAA11JA345678', '曜石黑', 2024, 5000, 'available', 1280.00, 8000.00, '2026-12-31', '2026-06-30',
 '["倒车影像", "GPS导航", "行车记录仪", "BOSE音响", "自动驾驶辅助"]',
 '["https://example.com/vehicle3.jpg"]',
 '豪华配置,全新车辆');

-- 上海浦东门店 (store_id=2)
INSERT INTO vehicles (vehicle_no, model_id, store_id, license_plate, vin, color, year, mileage, status, daily_price, deposit, insurance_expire_date, annual_inspection_date, features, images, description) VALUES
('SH001-001', 1, 2, '沪B12345', 'LZYTBAA11JB123456', '天空蓝', 2023, 18000, 'available', 680.00, 5000.00, '2025-12-31', '2025-06-30',
 '["倒车影像", "GPS导航", "行车记录仪", "蓝牙音响"]',
 '["https://example.com/vehicle4.jpg"]',
 '车况良好,适合长途旅行'),

('SH001-002', 3, 2, '沪B23456', 'LZYTBAA11JB234567', '珍珠白', 2022, 32000, 'available', 480.00, 3500.00, '2025-12-31', '2025-06-30',
 '["倒车影像", "GPS导航", "行车记录仪"]',
 '["https://example.com/vehicle5.jpg"]',
 '入门级房车,性价比高');
