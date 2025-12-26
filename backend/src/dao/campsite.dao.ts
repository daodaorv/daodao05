import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { RowDataPacket } from 'mysql2/promise';
import { Campsite, CampsiteQueryParams } from '../types/models/campsite.types';

/**
 * 营地预订DAO
 */
export class CampsiteDAO extends BaseDao<Campsite & RowDataPacket> {
  constructor() {
    super('campsites');
  }

  /**
   * 查询营地列表
   */
  async findCampsites(params: CampsiteQueryParams): Promise<{
    list: Campsite[];
    total: number;
  }> {
    const { page = 1, pageSize = 20, price, type, keyword, latitude, longitude } = params;

    let sql = `
      SELECT c.*
      FROM campsites c
      WHERE c.status = 'ACTIVE'
    `;

    const queryParams: unknown[] = [];

    // 关键词搜索
    if (keyword) {
      sql += ` AND (c.name LIKE ? OR c.address LIKE ?)`;
      queryParams.push(`%${keyword}%`, `%${keyword}%`);
    }

    // 类型筛选
    if (type) {
      sql += ` AND c.tags LIKE ?`;
      queryParams.push(`%${type}%`);
    }

    // 价格筛选
    if (price) {
      const [min, max] = price.split('-').map(Number);
      if (max) {
        sql += ` AND c.min_price BETWEEN ? AND ?`;
        queryParams.push(min, max);
      } else {
        sql += ` AND c.min_price >= ?`;
        queryParams.push(min);
      }
    }

    // 距离排序（如果提供了经纬度）
    if (latitude && longitude) {
      sql += ` ORDER BY (6371 * acos(cos(radians(?)) * cos(radians(c.latitude)) * cos(radians(c.longitude) - radians(?)) + sin(radians(?)) * sin(radians(c.latitude)))) ASC`;
      queryParams.push(latitude, longitude, latitude);
    } else {
      sql += ` ORDER BY c.is_hot DESC, c.created_at DESC`;
    }

    const result = await QueryBuilder.paginate<Campsite & RowDataPacket>(sql, queryParams, page, pageSize);

    return {
      list: result.data,
      total: result.total,
    };
  }

  /**
   * 获取营地详情
   */
  async findCampsiteDetail(id: number): Promise<Campsite | null> {
    const sql = `
      SELECT c.*
      FROM campsites c
      WHERE c.id = ? AND c.status = 'ACTIVE'
    `;

    return QueryBuilder.queryOne<Campsite & RowDataPacket>(sql, [id]);
  }
}
