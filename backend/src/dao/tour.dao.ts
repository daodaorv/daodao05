import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { RowDataPacket } from 'mysql2/promise';
import { Tour, TourQueryParams } from '../types/models/tour.types';

/**
 * 房车旅游DAO
 */
export class TourDAO extends BaseDao<Tour & RowDataPacket> {
  constructor() {
    super('tours');
  }

  /**
   * 查询旅游线路列表
   */
  async findTours(params: TourQueryParams): Promise<{
    list: Tour[];
    total: number;
  }> {
    const { page = 1, pageSize = 20, duration, price, keyword } = params;

    let sql = `
      SELECT t.*
      FROM tours t
      WHERE t.status = 'ACTIVE'
    `;

    const queryParams: unknown[] = [];

    // 关键词搜索
    if (keyword) {
      sql += ` AND (t.title LIKE ? OR t.destination LIKE ?)`;
      queryParams.push(`%${keyword}%`, `%${keyword}%`);
    }

    // 行程天数筛选
    if (duration) {
      const [min, max] = duration.split('-').map(Number);
      if (max) {
        sql += ` AND t.duration BETWEEN ? AND ?`;
        queryParams.push(min, max);
      } else {
        sql += ` AND t.duration >= ?`;
        queryParams.push(min);
      }
    }

    // 价格筛选
    if (price) {
      const [min, max] = price.split('-').map(Number);
      if (max) {
        sql += ` AND t.price_per_person BETWEEN ? AND ?`;
        queryParams.push(min, max);
      } else {
        sql += ` AND t.price_per_person >= ?`;
        queryParams.push(min);
      }
    }

    sql += ` ORDER BY t.is_hot DESC, t.created_at DESC`;

    const result = await QueryBuilder.paginate<Tour & RowDataPacket>(sql, queryParams, page, pageSize);

    return {
      list: result.data,
      total: result.total,
    };
  }

  /**
   * 获取旅游线路详情
   */
  async findTourDetail(id: number): Promise<Tour | null> {
    const sql = `
      SELECT t.*
      FROM tours t
      WHERE t.id = ? AND t.status = 'ACTIVE'
    `;

    return QueryBuilder.queryOne<Tour & RowDataPacket>(sql, [id]);
  }
}
