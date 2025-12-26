import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { Coupon } from '../types/models/coupon.types';

/**
 * 优惠券 DAO
 */
export class CouponDAO extends BaseDao<Coupon> {
  constructor() {
    super('coupons');
  }

  /**
   * 获取优惠券列表
   */
  async getCoupons(filters: {
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const { category, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const conditions: string[] = ['status = ?'];
    const params: any[] = ['active'];

    if (category && category !== 'all') {
      conditions.push('type = ?');
      params.push(category);
    }

    const whereClause = conditions.join(' AND ');

    const rows = await QueryBuilder.query<Coupon>(
      `SELECT * FROM ${this.tableName} WHERE ${whereClause} ORDER BY is_hot DESC, created_at DESC LIMIT ? OFFSET ?`,
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
   * 获取优惠券详情
   */
  async getCouponById(id: number) {
    return await this.findById(id);
  }

  /**
   * 检查优惠券库存
   */
  async checkStock(couponId: number): Promise<boolean> {
    const coupon = await this.findById(couponId);
    if (!coupon) return false;

    // total_stock = 0 表示无限制
    if (coupon.total_stock === 0) return true;

    return coupon.remaining_stock > 0;
  }

  /**
   * 减少库存
   */
  async decreaseStock(couponId: number): Promise<boolean> {
    const result = await QueryBuilder.query(
      `UPDATE ${this.tableName} SET remaining_stock = remaining_stock - 1 WHERE id = ? AND (total_stock = 0 OR remaining_stock > 0)`,
      [couponId]
    );

    return (result as any).affectedRows > 0;
  }
}
