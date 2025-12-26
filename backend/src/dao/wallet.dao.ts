import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { UserWallet } from '../types/models/wallet.types';

/**
 * 用户钱包 DAO
 */
export class UserWalletDAO extends BaseDao<UserWallet> {
  constructor() {
    super('user_wallets');
  }

  /**
   * 获取用户钱包信息
   */
  async getUserWallet(userId: number): Promise<UserWallet | null> {
    return await QueryBuilder.queryOne<UserWallet>(
      `SELECT * FROM ${this.tableName} WHERE user_id = ?`,
      [userId]
    );
  }
}
