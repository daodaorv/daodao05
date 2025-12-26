import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { City } from '../types/models/store.types';
import { logger } from '@utils/logger';
import { RowDataPacket } from 'mysql2';

/**
 * 城市数据访问对象
 * 注意: 城市数据从门店表聚合而来,不是独立表
 */
export class CityDAO extends BaseDao<RowDataPacket> {
  constructor() {
    super('stores'); // 使用门店表
  }

  /**
   * 获取所有有门店的城市列表
   */
  async findAllCities(): Promise<City[]> {
    try {
      const sql = `
        SELECT
          CONCAT('city_', city) as id,
          city as name,
          LOWER(REPLACE(city, ' ', '_')) as code,
          province,
          COUNT(*) as storeCount,
          0 as isHot
        FROM ${this.tableName}
        WHERE status = 'active' AND city IS NOT NULL AND city != ''
        GROUP BY city, province
        ORDER BY storeCount DESC, city ASC
      `;
      const result = await QueryBuilder.query<City>(sql, []);
      return result;
    } catch (error) {
      logger.error('获取城市列表失败:', error);
      throw error;
    }
  }

  /**
   * 根据城市名称查找城市信息
   */
  async findByName(cityName: string): Promise<City | null> {
    try {
      const sql = `
        SELECT
          CONCAT('city_', city) as id,
          city as name,
          LOWER(REPLACE(city, ' ', '_')) as code,
          province,
          COUNT(*) as storeCount,
          0 as isHot
        FROM ${this.tableName}
        WHERE status = 'active' AND city = ?
        GROUP BY city, province
        LIMIT 1
      `;
      const result = await QueryBuilder.queryOne<City>(sql, [cityName]);
      return result;
    } catch (error) {
      logger.error('根据名称查找城市失败:', error);
      throw error;
    }
  }
}
