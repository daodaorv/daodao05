import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { RowDataPacket } from 'mysql2/promise';
import { SpecialOffer, SpecialOfferQueryParams } from '../types/models/special-offer.types';

/**
 * 特惠租车DAO
 */
export class SpecialOfferDAO extends BaseDao<SpecialOffer & RowDataPacket> {
  constructor() {
    super('special_offers');
  }

  /**
   * 查询特惠套餐列表
   */
  async findSpecialOffers(params: SpecialOfferQueryParams): Promise<{
    list: SpecialOffer[];
    total: number;
  }> {
    const { route, priceRange, sortBy, page = 1, limit = 20 } = params;

    let sql = `
      SELECT so.*
      FROM special_offers so
      WHERE so.status = 'ACTIVE'
    `;

    const queryParams: unknown[] = [];

    // 路线筛选
    if (route) {
      sql += ` AND (so.route_from = ? OR so.route_to = ?)`;
      queryParams.push(route, route);
    }

    // 价格区间筛选
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (max) {
        sql += ` AND so.package_price BETWEEN ? AND ?`;
        queryParams.push(min, max);
      } else {
        sql += ` AND so.package_price >= ?`;
        queryParams.push(min);
      }
    }

    // 排序
    if (sortBy === 'price-asc') {
      sql += ` ORDER BY so.package_price ASC`;
    } else if (sortBy === 'price-desc') {
      sql += ` ORDER BY so.package_price DESC`;
    } else if (sortBy === 'quota') {
      sql += ` ORDER BY so.remaining_quota DESC`;
    } else {
      sql += ` ORDER BY so.created_at DESC`;
    }

    const result = await QueryBuilder.paginate<SpecialOffer & RowDataPacket>(sql, queryParams, page, limit);

    return {
      list: result.data,
      total: result.total,
    };
  }

  /**
   * 获取特惠套餐详情
   */
  async findSpecialOfferDetail(id: number): Promise<SpecialOffer | null> {
    const sql = `
      SELECT so.*
      FROM special_offers so
      WHERE so.id = ? AND so.status = 'ACTIVE'
    `;

    return QueryBuilder.queryOne<SpecialOffer & RowDataPacket>(sql, [id]);
  }

  /**
   * 检查套餐可用性
   */
  async checkAvailability(offerId: number, pickupDate: string): Promise<boolean> {
    const sql = `
      SELECT remaining_quota, available_time_start, available_time_end
      FROM special_offers
      WHERE id = ? AND status = 'ACTIVE'
    `;

    const offer = await QueryBuilder.queryOne<SpecialOffer & RowDataPacket>(sql, [offerId]);

    if (!offer) {
      return false;
    }

    // 检查日期是否在可用时间范围内
    const pickup = new Date(pickupDate);
    const start = new Date(offer.available_time_start);
    const end = new Date(offer.available_time_end);

    if (pickup < start || pickup > end) {
      return false;
    }

    // 检查剩余配额
    return offer.remaining_quota > 0;
  }
}
