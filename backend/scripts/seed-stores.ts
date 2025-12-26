import { db } from '../src/db/connection';
import { logger } from '../src/utils/logger';

/**
 * 填充门店测试数据
 */
async function seedStores(): Promise<void> {
  try {
    logger.info('开始填充门店测试数据...');

    const sql = `
INSERT INTO stores (name, code, contact_person, contact_phone, province, city, district, address, location_lat, location_lng, status, sort_order) VALUES
('北京朝阳门店', 'BJ001', '张经理', '13800138001', '北京市', '北京', '朝阳区', '朝阳区建国路88号', 39.9042, 116.4074, 'active', 100),
('上海浦东门店', 'SH001', '李经理', '13800138002', '上海市', '上海', '浦东新区', '浦东新区世纪大道1号', 31.2304, 121.4737, 'active', 90),
('广州天河门店', 'GZ001', '王经理', '13800138003', '广东省', '广州', '天河区', '天河区天河路123号', 23.1291, 113.2644, 'active', 80),
('深圳南山门店', 'SZ001', '赵经理', '13800138004', '广东省', '深圳', '南山区', '南山区科技园南路456号', 22.5431, 114.0579, 'active', 70),
('成都武侯门店', 'CD001', '刘经理', '13800138005', '四川省', '成都', '武侯区', '武侯区人民南路789号', 30.5728, 104.0668, 'active', 60)
`;

    await db.query(sql);
    logger.info('门店测试数据填充完成！');
    process.exit(0);
  } catch (error) {
    logger.error('填充门店数据失败:', error);
    process.exit(1);
  }
}

seedStores();
