import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { UserPoints } from '../types/models/points.types';

/**
 * 用户积分 DAO
 */
export class UserPointsDAO extends BaseDao<UserPoints> {
  constructor() {
    super('user_points');
  }

  /**
   * 获取用户积分
   */
  async getUserPoints(userId: number): Promise<UserPoints | null> {
    return await QueryBuilder.queryOne<UserPoints>(
      `SELECT * FROM ${this.tableName} WHERE user_id = ?`,
      [userId]
    );
  }
}
