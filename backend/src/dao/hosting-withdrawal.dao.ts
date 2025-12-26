/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { HostingWithdrawal } from '../types/models/hosting.types';

/**
 * 托管提现 DAO
 */
export class HostingWithdrawalDAO extends BaseDao<HostingWithdrawal> {
  constructor() {
    super('hosting_withdrawals');
  }

  /**
   * 创建提现申请
   */
  async createWithdrawal(data: {
    userId: number;
    hostingVehicleId?: number;
    amount: number;
    fee: number;
    actualAmount: number;
    bankAccount: string;
    bankName: string;
    accountName: string;
  }) {
    const result = await this.insert({
      user_id: data.userId,
      hosting_vehicle_id: data.hostingVehicleId,
      amount: data.amount,
      fee: data.fee,
      actual_amount: data.actualAmount,
      bank_account: data.bankAccount,
      bank_name: data.bankName,
      account_name: data.accountName,
      status: 'pending',
    } as any);

    return result;
  }

  /**
   * 获取提现记录
   */
  async getWithdrawals(userId: number, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const rows = await QueryBuilder.query<HostingWithdrawal>(
      `SELECT * FROM ${this.tableName} WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
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
