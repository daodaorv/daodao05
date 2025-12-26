import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { UserCoupon } from '../types/models/coupon.types';

/**
 * 用户优惠券 DAO
 */
export class UserCouponDAO extends BaseDao<UserCoupon> {
  constructor() {
    super('user_coupons');
  }

  /**
   * 领取优惠券
   */
  async claimCoupon(data: {
    userId: number;
    couponId: number;
    expiryDate: string;
  }) {
    const result = await this.insert({
      user_id: data.userId,
      coupon_id: data.couponId,
      expiry_date: data.expiryDate as any,
      status: 'unused',
    } as any);

    return result;
  }

  /**
   * 获取用户优惠券列表
   */
  async getUserCoupons(
    userId: number,
    status?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    const conditions: string[] = ['uc.user_id = ?'];
    const params: any[] = [userId];

    if (status) {
      conditions.push('uc.status = ?');
      params.push(status);
    }

    const whereClause = conditions.join(' AND ');

    const rows = await QueryBuilder.query<any>(
      `SELECT uc.*, c.name, c.type, c.amount, c.rate, c.min_amount, c.scope
       FROM ${this.tableName} uc
       LEFT JOIN coupons c ON uc.coupon_id = c.id
       WHERE ${whereClause}
       ORDER BY uc.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const countResult = await QueryBuilder.queryOne<any>(
      `SELECT COUNT(*) as total FROM ${this.tableName} uc WHERE ${whereClause}`,
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
