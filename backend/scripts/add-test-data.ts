/**
 * 补充P2增值服务模块测试数据
 */

import { db } from '../src/db/connection';
import { logger } from '../src/utils/logger';

async function addTestData() {
  const connection = await db.getConnection();

  try {
    logger.info('开始补充测试数据...');

    // 1. 补充热门营地数据
    await connection.query('UPDATE campsites SET is_hot = 1 WHERE id = 2');
    logger.info('✅ 已设置营地ID=2为热门营地');

    // 2. 补充热门线路数据
    await connection.query('UPDATE tours SET is_hot = 1 WHERE id = 2');
    logger.info('✅ 已设置线路ID=2为热门线路');

    // 3. 添加更多营地数据
    const campsiteSQL = `
      INSERT INTO campsites (
        name, image, images, tags, rating, review_count, min_price,
        available_sites, is_hot, address, latitude, longitude,
        features, facilities, description, check_in_notices,
        cancellation_policy, status
      ) VALUES (
        '上海崇明房车营地',
        'https://example.com/images/chongming-camp.jpg',
        '["https://example.com/images/camp3.jpg","https://example.com/images/camp4.jpg"]',
        '["海景","生态","休闲"]',
        4.6,
        89,
        320.00,
        12,
        1,
        '上海市崇明区东滩湿地公园',
        31.5167,
        121.9667,
        '["生态环境","观鸟基地","自行车道","儿童乐园"]',
        '["水电桩","淋浴间","洗衣房","餐厅","超市"]',
        '位于东滩湿地公园的生态营地，环境优美，适合家庭度假。',
        '["入住时间14:00-20:00","退房时间11:00前","需携带身份证","可携带宠物"]',
        '["入住前5天取消全额退款","入住前2-5天取消退款70%","入住前2天内取消不退款"]',
        'ACTIVE'
      )
    `;
    await connection.query(campsiteSQL);
    logger.info('✅ 已添加上海崇明房车营地');

    // 4. 添加更多旅游线路数据
    const tourSQL = `
      INSERT INTO tours (
        title, image, images, tags, duration, min_people, max_people,
        destination, price_per_person, child_price, is_hot, itinerary,
        price_includes, price_excludes, booking_notices,
        cancellation_policy, status
      ) VALUES (
        '新疆天山环线10日深度游',
        'https://example.com/images/xinjiang-tour.jpg',
        '["https://example.com/images/tour3.jpg","https://example.com/images/tour4.jpg"]',
        '["自然风光","民族文化","美食之旅"]',
        10,
        4,
        8,
        '新疆',
        6980.00,
        3490.00,
        1,
        '[{"day":1,"title":"乌鲁木齐-天山天池","content":"游览天山天池，欣赏雪山美景"}]',
        '["房车租赁费","领队服务费","营地费用","基础保险","部分门票"]',
        '["餐饮费用","个人消费","额外保险","自费项目"]',
        '["需提前10天预订","需支付定金3000元","需提供驾驶证和身份证复印件"]',
        '["出发前20天取消全额退款","出发前10-20天取消退款80%","出发前10天内取消退款50%"]',
        'ACTIVE'
      )
    `;
    await connection.query(tourSQL);
    logger.info('✅ 已添加新疆天山环线旅游线路');

    // 5. 添加旅游批次数据
    const batchSQL = `
      INSERT INTO tour_batches (
        tour_id, departure_date, return_date, status,
        current_people, max_people, guide_name, guide_phone
      ) VALUES
      (2, '2026-05-01', '2026-05-07', 'recruiting', 3, 6, '张导', '13800138001'),
      (2, '2026-06-01', '2026-06-07', 'recruiting', 5, 6, '李导', '13800138002'),
      (2, '2026-07-01', '2026-07-07', 'confirmed', 6, 6, '王导', '13800138003')
    `;
    await connection.query(batchSQL);
    logger.info('✅ 已添加3个旅游批次');

    logger.info('🎉 测试数据补充完成！');
  } catch (error) {
    logger.error('补充测试数据失败', error);
    throw error;
  } finally {
    connection.release();
  }
}

// 执行脚本
addTestData()
  .then(() => {
    logger.info('脚本执行成功');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('脚本执行失败', error);
    process.exit(1);
  });
