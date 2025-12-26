/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { CrowdfundingShare } from '../types/models/crowdfunding.types';

/**
 * 众筹份额 DAO
 */
export class CrowdfundingShareDAO extends BaseDao<CrowdfundingShare> {
  constructor() {
    super('crowdfunding_shares');
  }

  /**
   * 购买份额
   */
  async purchaseShares(data: {
    projectId: number;
    userId: number;
    shares: number;
    amount: number;
  }) {
    const result = await this.insert({
      project_id: data.projectId,
      user_id: data.userId,
      shares: data.shares,
      amount: data.amount,
      status: 'active',
    } as any);

    return result;
  }

  /**
   * 获取用户参与的项目
   */
  async getUserProjects(userId: number, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const rows = await QueryBuilder.query<any>(
      `SELECT cs.*, cp.project_no, cp.status as project_status
       FROM ${this.tableName} cs
       LEFT JOIN crowdfunding_projects cp ON cs.project_id = cp.id
       WHERE cs.user_id = ?
       ORDER BY cs.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const countResult = await QueryBuilder.queryOne<any>(
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
