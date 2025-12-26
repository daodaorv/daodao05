/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { Notification } from '../types/models/notification.types';

/**
 * 通知 DAO
 */
export class NotificationDAO extends BaseDao<Notification> {
  constructor() {
    super('notifications');
  }

  /**
   * 获取用户通知列表
   */
  async getUserNotifications(
    userId: number,
    filters: { type?: string; isRead?: boolean },
    page: number = 1,
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;
    const conditions: string[] = ['user_id = ?'];
    const params: any[] = [userId];

    if (filters.type) {
      conditions.push('type = ?');
      params.push(filters.type);
    }

    if (filters.isRead !== undefined) {
      conditions.push('is_read = ?');
      params.push(filters.isRead);
    }

    const whereClause = conditions.join(' AND ');

    const rows = await QueryBuilder.query<Notification>(
      `SELECT * FROM ${this.tableName} WHERE ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
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
   * 标记通知为已读
   */
  async markAsRead(notificationId: number) {
    return await QueryBuilder.update(
      `UPDATE ${this.tableName} SET is_read = TRUE, read_at = NOW() WHERE id = ?`,
      [notificationId]
    );
  }

  /**
   * 批量标记为已读
   */
  async markAllAsRead(userId: number) {
    return await QueryBuilder.update(
      `UPDATE ${this.tableName} SET is_read = TRUE, read_at = NOW() WHERE user_id = ? AND is_read = FALSE`,
      [userId]
    );
  }

  /**
   * 获取未读通知数量
   */
  async getUnreadCount(userId: number) {
    const result = await QueryBuilder.queryOne<any>(
      `SELECT COUNT(*) as count FROM ${this.tableName} WHERE user_id = ? AND is_read = FALSE`,
      [userId]
    );
    return result?.count || 0;
  }
}
