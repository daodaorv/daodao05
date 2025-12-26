import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { Rating } from '../types/models/rating.types';

/**
 * 评价 DAO
 */
export class RatingDAO extends BaseDao<Rating> {
  constructor() {
    super('ratings');
  }

  /**
   * 获取用户评价列表
   */
  async getUserRatings(userId: number, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const rows = await QueryBuilder.query<Rating>(
      `SELECT * FROM ${this.tableName} WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const countResult = await QueryBuilder.queryOne<unknown>(
      `SELECT COUNT(*) as total FROM ${this.tableName} WHERE user_id = ?`,
      [userId]
    );

    return {
      list: rows,
      total: countResult?.total || 0,
      page,
      limit,
    };
  }
}
