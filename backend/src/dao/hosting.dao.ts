/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { HostingVehicle } from '../types/models/hosting.types';

/**
 * 托管中心 DAO
 */
export class HostingDAO extends BaseDao<HostingVehicle> {
  constructor() {
    super('hosting_vehicles');
  }

  /**
   * 获取用户的托管车辆列表
   */
  async getUserVehicles(
    userId: number,
    status?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    const conditions: string[] = ['user_id = ?'];
    const params: any[] = [userId];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    const whereClause = conditions.join(' AND ');

    const rows = await QueryBuilder.query<HostingVehicle>(
      `SELECT * FROM ${this.tableName} WHERE ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
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

  /**
   * 获取托管收益统计
   */
  async getIncomeStats(userId: number) {
    const statsResult = await QueryBuilder.queryOne<any>(
      `SELECT
        SUM(total_income) as totalIncome,
        SUM(available_balance) as availableBalance,
        SUM(frozen_balance) as frozenBalance
      FROM ${this.tableName}
      WHERE user_id = ?`,
      [userId]
    );

    const todayResult = await QueryBuilder.queryOne<any>(
      `SELECT SUM(amount) as todayIncome
      FROM hosting_income_details
      WHERE user_id = ? AND DATE(income_date) = CURDATE()`,
      [userId]
    );

    const monthResult = await QueryBuilder.queryOne<any>(
      `SELECT SUM(amount) as monthIncome
      FROM hosting_income_details
      WHERE user_id = ? AND YEAR(income_date) = YEAR(CURDATE()) AND MONTH(income_date) = MONTH(CURDATE())`,
      [userId]
    );

    return {
      totalIncome: statsResult?.totalIncome || 0,
      todayIncome: todayResult?.todayIncome || 0,
      monthIncome: monthResult?.monthIncome || 0,
      availableBalance: statsResult?.availableBalance || 0,
      frozenBalance: statsResult?.frozenBalance || 0,
    };
  }
}
