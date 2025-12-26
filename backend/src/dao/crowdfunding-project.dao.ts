import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { CrowdfundingProject } from '../types/models/crowdfunding.types';

/**
 * 众筹项目 DAO
 */
export class CrowdfundingProjectDAO extends BaseDao<CrowdfundingProject> {
  constructor() {
    super('crowdfunding_projects');
  }

  /**
   * 创建众筹项目
   */
  async createProject(data: {
    modelId: number;
    initiatorId: number;
    targetAmount: number;
    totalShares: number;
    startDate: string;
    endDate: string;
  }) {
    const projectNo = `CF${Date.now()}`;

    const result = await this.insert({
      project_no: projectNo,
      model_id: data.modelId,
      initiator_id: data.initiatorId,
      target_amount: data.targetAmount,
      total_shares: data.totalShares,
      start_date: data.startDate as any,
      end_date: data.endDate as any,
      status: 'preparing',
    } as any);

    return result;
  }

  /**
   * 获取项目列表
   */
  async getProjects(filters: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const rows = await QueryBuilder.query<CrowdfundingProject>(
      `SELECT * FROM ${this.tableName} ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const countResult = await QueryBuilder.queryOne<any>(
      `SELECT COUNT(*) as total FROM ${this.tableName} ${whereClause}`,
      params
    );

    return {
      list: rows,
      total: countResult?.total || 0,
      page,
      limit,
    };
  }
}
