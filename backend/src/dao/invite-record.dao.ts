import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { InviteRecord } from '../types/models/coupon.types';

/**
 * 邀请记录 DAO
 */
export class InviteRecordDAO extends BaseDao<InviteRecord> {
  constructor() {
    super('invite_records');
  }

  /**
   * 获取邀请记录列表
   */
  async getInviteRecords(
    inviterId: number,
    page: number = 1,
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;

    const rows = await QueryBuilder.query<InviteRecord>(
      `SELECT * FROM ${this.tableName} WHERE inviter_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [inviterId, limit, offset]
    );

    const countResult = await QueryBuilder.queryOne<any>(
      `SELECT COUNT(*) as total FROM ${this.tableName} WHERE inviter_id = ?`,
      [inviterId]
    );

    return {
      list: rows,
      total: countResult?.total || 0,
      page,
      limit,
    };
  }
}
