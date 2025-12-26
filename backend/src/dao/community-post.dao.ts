import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { CommunityPost } from '../types/models/community.types';

/**
 * 社区帖子 DAO
 */
export class CommunityPostDAO extends BaseDao<CommunityPost> {
  constructor() {
    super('community_posts');
  }

  /**
   * 获取帖子列表
   */
  async getPosts(filters: { status?: string }, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters.status) {
      conditions.push('status = ?');
      params.push(filters.status);
    } else {
      conditions.push('status = ?');
      params.push('published');
    }

    const whereClause = conditions.join(' AND ');

    const rows = await QueryBuilder.query<CommunityPost>(
      `SELECT * FROM ${this.tableName} WHERE ${whereClause} ORDER BY is_top DESC, created_at DESC LIMIT ? OFFSET ?`,
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
   * 增加浏览数
   */
  async incrementViewCount(postId: number) {
    return await QueryBuilder.update(
      `UPDATE ${this.tableName} SET view_count = view_count + 1 WHERE id = ?`,
      [postId]
    );
  }

  /**
   * 增加点赞数
   */
  async incrementLikeCount(postId: number) {
    return await QueryBuilder.update(
      `UPDATE ${this.tableName} SET like_count = like_count + 1 WHERE id = ?`,
      [postId]
    );
  }

  /**
   * 减少点赞数
   */
  async decrementLikeCount(postId: number) {
    return await QueryBuilder.update(
      `UPDATE ${this.tableName} SET like_count = like_count - 1 WHERE id = ? AND like_count > 0`,
      [postId]
    );
  }
}
