/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { PostComment } from '../types/models/community.types';

/**
 * 帖子评论 DAO
 */
export class PostCommentDAO extends BaseDao<PostComment> {
  constructor() {
    super('post_comments');
  }

  /**
   * 获取帖子评论列表
   */
  async getPostComments(postId: number, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const rows = await QueryBuilder.query<PostComment>(
      `SELECT * FROM ${this.tableName} WHERE post_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [postId, limit, offset]
    );

    const countResult = await QueryBuilder.queryOne<any>(
      `SELECT COUNT(*) as total FROM ${this.tableName} WHERE post_id = ?`,
      [postId]
    );

    return {
      list: rows,
      total: countResult?.total || 0,
      page,
      limit,
    };
  }
}
