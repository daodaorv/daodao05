import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { CrowdfundingModel } from '../types/models/crowdfunding.types';

/**
 * 众筹车型 DAO
 */
export class CrowdfundingModelDAO extends BaseDao<CrowdfundingModel> {
  constructor() {
    super('crowdfunding_models');
  }

  /**
   * 获取推荐车型列表
   */
  async getModels(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const rows = await QueryBuilder.query<CrowdfundingModel>(
      `SELECT * FROM ${this.tableName} WHERE status = 'active' ORDER BY is_recommended DESC, is_hot DESC, created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const countResult = await QueryBuilder.queryOne<any>(
      `SELECT COUNT(*) as total FROM ${this.tableName} WHERE status = 'active'`,
      []
    );

    return {
      list: rows,
      total: countResult?.total || 0,
      page,
      limit,
    };
  }

  /**
   * 获取车型详情
   */
  async getModelById(id: number) {
    return await this.findById(id);
  }
}
