import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { UserMembership } from '../types/models/membership.types';

/**
 * 用户会员 DAO
 */
export class UserMembershipDAO extends BaseDao<UserMembership> {
  constructor() {
    super('user_memberships');
  }

  /**
   * 获取用户会员信息
   */
  async getUserMembership(userId: number): Promise<UserMembership | null> {
    return await QueryBuilder.queryOne<UserMembership>(
      `SELECT * FROM ${this.tableName} WHERE user_id = ? AND status = 'active'`,
      [userId]
    );
  }
}
