import { QueryBuilder } from '@db/query-builder';
import { RentalRule, RentalRuleProductType } from '../types/models/rental-rule.types';
import { logger } from '@utils/logger';

/**
 * 租车须知数据访问对象
 */
export class RentalRuleDAO {
  private tableName = 'rental_rules';

  /**
   * 根据产品类型获取租车须知
   */
  async findByProductType(productType: RentalRuleProductType): Promise<RentalRule | null> {
    try {
      const sql = `
        SELECT * FROM ${this.tableName}
        WHERE product_type = ? AND status = 'active'
        ORDER BY created_at DESC
        LIMIT 1
      `;
      const result = await QueryBuilder.queryOne<RentalRule>(sql, [productType]);
      return result;
    } catch (error) {
      logger.error('根据产品类型获取租车须知失败:', error);
      throw error;
    }
  }
}
