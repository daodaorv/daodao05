import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { PostLike } from '../types/models/community.types';

/**
 * 帖子点赞 DAO
 */
export class PostLikeDAO extends BaseDao<PostLike> {
  constructor() {
    super('post_likes');
  }

  /**
   * 检查用户是否已点赞
   */
  async hasLiked(postId: number, userId: number): Promise<boolean> {
    const result = await QueryBuilder.queryOne<unknown>(
      `SELECT id FROM ${this.tableName} WHERE post_id = ? AND user_id = ?`,
      [postId, userId]
    );
    return !!result;
  }

  /**
   * 取消点赞
   */
  async unlike(postId: number, userId: number) {
    return await QueryBuilder.delete(
      `DELETE FROM ${this.tableName} WHERE post_id = ? AND user_id = ?`,
      [postId, userId]
    );
  }
}
