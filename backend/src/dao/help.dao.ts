/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { HelpArticle } from '../types/models/help.types';

/**
 * 帮助文章 DAO
 */
export class HelpArticleDAO extends BaseDao<HelpArticle> {
  constructor() {
    super('help_articles');
  }

  /**
   * 获取分类下的文章列表
   */
  async getArticlesByCategory(
    categoryId: number,
    page: number = 1,
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;

    const rows = await QueryBuilder.query<HelpArticle>(
      `SELECT * FROM ${this.tableName}
       WHERE category_id = ? AND status = 'published'
       ORDER BY sort_order ASC, created_at DESC
       LIMIT ? OFFSET ?`,
      [categoryId, limit, offset]
    );

    const countResult = await QueryBuilder.queryOne<any>(
      `SELECT COUNT(*) as total FROM ${this.tableName}
       WHERE category_id = ? AND status = 'published'`,
      [categoryId]
    );

    return {
      list: rows,
      total: countResult?.total || 0,
      page,
      limit,
    };
  }

  /**
   * 搜索文章
   */
  async searchArticles(keyword: string, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const rows = await QueryBuilder.query<HelpArticle>(
      `SELECT * FROM ${this.tableName}
       WHERE (title LIKE ? OR content LIKE ?) AND status = 'published'
       ORDER BY view_count DESC, created_at DESC
       LIMIT ? OFFSET ?`,
      [`%${keyword}%`, `%${keyword}%`, limit, offset]
    );

    const countResult = await QueryBuilder.queryOne<any>(
      `SELECT COUNT(*) as total FROM ${this.tableName}
       WHERE (title LIKE ? OR content LIKE ?) AND status = 'published'`,
      [`%${keyword}%`, `%${keyword}%`]
    );

    return {
      list: rows,
      total: countResult?.total || 0,
      page,
      limit,
    };
  }

  /**
   * 增加浏览次数
   */
  async incrementViewCount(id: number): Promise<void> {
    await QueryBuilder.update(
      `UPDATE ${this.tableName} SET view_count = view_count + 1 WHERE id = ?`,
      [id]
    );
  }
}
