-- =============================================
-- P2增值服务测试数据插入脚本 (UTF-8)
-- 创建时间: 2025-12-25
-- 说明: 使用正确的UTF-8字符集插入测试数据
-- =============================================

USE daodao;

-- 设置客户端字符集
SET NAMES utf8mb4;
SET CHARACTER_SET_CLIENT = utf8mb4;
SET CHARACTER_SET_RESULTS = utf8mb4;
SET CHARACTER_SET_CONNECTION = utf8mb4;

-- 插入特惠租车测试数据
INSERT INTO special_offers (
    route_from, route_to, vehicle_id, vehicle_name, vehicle_image, vehicle_features,
    package_price, original_price, rental_days,
    available_time_start, available_time_end,
    remaining_quota, total_quota,
    pickup_store_id, return_store_id,
    package_includes, booking_notices, cancellation_policy, status
) VALUES
(
    '北京', '成都', 1, '依维柯C型房车',
    'https://example.com/images/iveco-c.jpg',
    '["4-6人", "自动挡", "柴油", "卫生间"]',
    1280.00, 1680.00, 3,
    '2025-12-26', '2026-01-31',
    8, 10,
    1, 2,
    '["车辆租金", "基础保险", "异地还车费"]',
    '["需提前3天预订", "需支付押金5000元", "需提供驾驶证和身份证"]',
    '["出发前7天取消全额退款", "出发前3-7天取消退款50%", "出发前3天内取消不退款"]',
    'ACTIVE'
),
(
    '上海', '杭州', 2, '大通V90房车',
    'https://example.com/images/maxus-v90.jpg',
    '["2-4人", "自动挡", "汽油", "可拓展"]',
    880.00, 1180.00, 2,
    '2025-12-26', '2026-01-31',
    5, 8,
    3, 4,
    '["车辆租金", "基础保险"]',
    '["需提前2天预订", "需支付押金3000元"]',
    '["出发前5天取消全额退款", "出发前5天内取消不退款"]',
    'ACTIVE'
);

-- 插入营地预订测试数据
INSERT INTO campsites (
    name, image, images, tags, rating, review_count, min_price, available_sites, is_hot,
    address, latitude, longitude, features, facilities, description,
    check_in_notices, cancellation_policy, status
) VALUES
(
    '北京怀柔房车营地', 'https://example.com/images/huairou-camp.jpg',
    '["https://example.com/images/camp1.jpg", "https://example.com/images/camp2.jpg"]',
    '["山景", "湖景", "亲子"]',
    4.8, 128, 280.00, 15, true,
    '北京市怀柔区雁栖湖畔', 40.3912, 116.6722,
    '["24小时安保", "儿童游乐区", "烧烤区", "观景台"]',
    '["水电桩", "淋浴间", "洗衣房", "便利店", "餐厅"]',
    '位于雁栖湖畔的高品质房车营地，环境优美，设施完善，适合家庭出游。',
    '["入住时间14:00-22:00", "退房时间12:00前", "需携带身份证", "禁止携带宠物"]',
    '["入住前3天取消全额退款", "入住前1-3天取消退款50%", "入住当天取消不退款"]',
    'ACTIVE'
);

-- 插入房车旅游测试数据
INSERT INTO tours (
    title, image, images, tags, duration, min_people, max_people, destination,
    price_per_person, child_price, is_hot, itinerary, price_includes, price_excludes,
    booking_notices, cancellation_policy, status
) VALUES
(
    '川西环线7日房车自驾游', 'https://example.com/images/chuanxi-tour.jpg',
    '["https://example.com/images/tour1.jpg", "https://example.com/images/tour2.jpg"]',
    '["自然风光", "高原体验", "摄影天堂"]',
    7, 2, 6, '四川',
    4980.00, 2490.00, true,
    '[{"day":1,"title":"成都-雅安-泸定","content":"早上从成都出发，途经雅安，抵达泸定，参观泸定桥"}]',
    '["房车租赁费", "领队服务费", "营地费用", "基础保险"]',
    '["餐饮费用", "景区门票", "个人消费", "额外保险"]',
    '["需提前7天预订", "需支付定金2000元", "需提供驾驶证复印件"]',
    '["出发前15天取消全额退款", "出发前7-15天取消退款70%"]',
    'ACTIVE'
);
