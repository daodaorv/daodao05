import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { Store } from '../types/models/store.types';
import { logger } from '@utils/logger';
import { RowDataPacket } from 'mysql2/promise';

interface CountResult extends RowDataPacket {
  count: number;
}

/**
 * 门店数据访问对象
 */
export class StoreDAO extends BaseDao<Store> {
  constructor() {
    super('stores');
  }

  /**
   * 根据城市获取门店列表
   */
  async findByCity(cityName: string): Promise<Store[]> {
    try {
      const sql = `
        SELECT * FROM ${this.tableName}
        WHERE city = ? AND status = 'active'
        ORDER BY sort_order DESC, created_at DESC
      `;
      const result = await QueryBuilder.query<Store>(sql, [cityName]);
      return result;
    } catch (error) {
      logger.error('根据城市查找门店失败:', error);
      throw error;
    }
  }

  /**
   * 根据门店编码查找门店
   */
  async findByCode(code: string): Promise<Store | null> {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE code = ? LIMIT 1`;
      const result = await QueryBuilder.queryOne<Store>(sql, [code]);
      return result;
    } catch (error) {
      logger.error('根据编码查找门店失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有激活的门店
   */
  async findAllActive(): Promise<Store[]> {
    try {
      const sql = `
        SELECT * FROM ${this.tableName}
        WHERE status = 'active'
        ORDER BY sort_order DESC, created_at DESC
      `;
      const result = await QueryBuilder.query<Store>(sql, []);
      return result;
    } catch (error) {
      logger.error('获取激活门店列表失败:', error);
      throw error;
    }
  }

  /**
   * 统计门店数量（按城市）
   */
  async countByCity(cityName: string): Promise<number> {
    try {
      const sql = `
        SELECT COUNT(*) as count FROM ${this.tableName}
        WHERE city = ? AND status = 'active'
      `;
      const result = await QueryBuilder.queryOne<CountResult>(sql, [cityName]);
      return result?.count || 0;
    } catch (error) {
      logger.error('统计城市门店数量失败:', error);
      throw error;
    }
  }
}
