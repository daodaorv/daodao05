import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { InviteCode } from '../types/models/coupon.types';

/**
 * 邀请码 DAO
 */
export class InviteCodeDAO extends BaseDao<InviteCode> {
  constructor() {
    super('invite_codes');
  }

  /**
   * 生成邀请码
   */
  async generateInviteCode(userId: number): Promise<string> {
    // 生成唯一邀请码
    const inviteCode = `DAODAO${Date.now().toString().slice(-8)}`;

    await this.insert({
      user_id: userId,
      invite_code: inviteCode,
    } as unknown);

    return inviteCode;
  }

  /**
   * 获取用户的邀请码
   */
  async getUserInviteCode(userId: number) {
    const rows = await QueryBuilder.query<InviteCode>(
      `SELECT * FROM ${this.tableName} WHERE user_id = ? LIMIT 1`,
      [userId]
    );

    return rows[0] || null;
  }

  /**
   * 获取邀请统计
   */
  async getInviteStats(userId: number) {
    const inviteCode = await this.getUserInviteCode(userId);

    if (!inviteCode) {
      return {
        totalInvites: 0,
        successfulRegistrations: 0,
        completedFirstOrders: 0,
        totalRewards: 0,
        inviteCode: '',
      };
    }

    return {
      totalInvites: inviteCode.total_invites,
      successfulRegistrations: inviteCode.successful_registrations,
      completedFirstOrders: inviteCode.completed_first_orders,
      totalRewards: inviteCode.total_rewards,
      inviteCode: inviteCode.invite_code,
    };
  }
}
