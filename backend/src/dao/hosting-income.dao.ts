/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { HostingIncomeDetail } from '../types/models/hosting.types';

/**
 * 托管收益明细 DAO
 */
export class HostingIncomeDAO extends BaseDao<HostingIncomeDetail> {
  constructor() {
    super('hosting_income_details');
  }

  /**
   * 获取收益明细列表
   */
  async getIncomeDetails(
    userId: number,
    filters: {
      vehicleId?: number;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const { vehicleId, startDate, endDate, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    const conditions: string[] = ['user_id = ?'];
    const params: any[] = [userId];

    if (vehicleId) {
      conditions.push('hosting_vehicle_id = ?');
      params.push(vehicleId);
    }

    if (startDate) {
      conditions.push('income_date >= ?');
      params.push(startDate);
    }

    if (endDate) {
      conditions.push('income_date <= ?');
      params.push(endDate);
    }

    const whereClause = conditions.join(' AND ');

    const rows = await QueryBuilder.query<HostingIncomeDetail>(
      `SELECT * FROM ${this.tableName} WHERE ${whereClause} ORDER BY income_date DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const countResult = await QueryBuilder.queryOne<any>(
      `SELECT COUNT(*) as total FROM ${this.tableName} WHERE ${whereClause}`,
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
