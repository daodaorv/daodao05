import { QueryBuilder } from '@db/query-builder';
import { Contact, CreateContactPayload, UpdateContactPayload } from '../types/models/contact.types';
import { logger } from '@utils/logger';

/**
 * 联系人数据访问对象
 */
export class ContactDAO {
  private tableName = 'contacts';

  /**
   * 根据用户ID获取联系人列表
   */
  async findByUserId(userId: number): Promise<Contact[]> {
    try {
      const sql = `
        SELECT * FROM ${this.tableName}
        WHERE user_id = ? AND status = 'active'
        ORDER BY is_default DESC, created_at DESC
      `;
      const result = await QueryBuilder.query<Contact>(sql, [userId]);
      return result;
    } catch (error) {
      logger.error('根据用户ID获取联系人列表失败:', error);
      throw error;
    }
  }

  /**
   * 根据ID获取联系人详情
   */
  async findById(id: number, userId: number): Promise<Contact | null> {
    try {
      const sql = `
        SELECT * FROM ${this.tableName}
        WHERE id = ? AND user_id = ? AND status = 'active'
        LIMIT 1
      `;
      const result = await QueryBuilder.queryOne<Contact>(sql, [id, userId]);
      return result;
    } catch (error) {
      logger.error('根据ID获取联系人详情失败:', error);
      throw error;
    }
  }

  /**
   * 创建联系人
   */
  async create(data: CreateContactPayload): Promise<number> {
    try {
      // 如果设置为默认联系人，先取消其他默认联系人
      if (data.is_default) {
        await this.clearDefaultContact(data.user_id);
      }

      const sql = `
        INSERT INTO ${this.tableName}
        (user_id, name, phone, id_card, driver_license_no, driver_license_front, driver_license_back, is_default)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await QueryBuilder.execute(sql, [
        data.user_id,
        data.name,
        data.phone,
        data.id_card,
        data.driver_license_no,
        data.driver_license_front,
        data.driver_license_back,
        data.is_default || false,
      ]);
      return result.insertId;
    } catch (error) {
      logger.error('创建联系人失败:', error);
      throw error;
    }
  }

  /**
   * 更新联系人
   */
  async update(id: number, userId: number, data: UpdateContactPayload): Promise<boolean> {
    try {
      // 如果设置为默认联系人，先取消其他默认联系人
      if (data.is_default) {
        await this.clearDefaultContact(userId, id);
      }

      const fields: string[] = [];
      const values: unknown[] = [];

      if (data.name !== undefined) {
        fields.push('name = ?');
        values.push(data.name);
      }
      if (data.phone !== undefined) {
        fields.push('phone = ?');
        values.push(data.phone);
      }
      if (data.id_card !== undefined) {
        fields.push('id_card = ?');
        values.push(data.id_card);
      }
      if (data.driver_license_no !== undefined) {
        fields.push('driver_license_no = ?');
        values.push(data.driver_license_no);
      }
      if (data.driver_license_front !== undefined) {
        fields.push('driver_license_front = ?');
        values.push(data.driver_license_front);
      }
      if (data.driver_license_back !== undefined) {
        fields.push('driver_license_back = ?');
        values.push(data.driver_license_back);
      }
      if (data.is_default !== undefined) {
        fields.push('is_default = ?');
        values.push(data.is_default);
      }
      if (data.status !== undefined) {
        fields.push('status = ?');
        values.push(data.status);
      }

      if (fields.length === 0) {
        return false;
      }

      values.push(id, userId);
      const sql = `
        UPDATE ${this.tableName}
        SET ${fields.join(', ')}
        WHERE id = ? AND user_id = ?
      `;
      const result = await QueryBuilder.execute(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      logger.error('更新联系人失败:', error);
      throw error;
    }
  }

  /**
   * 删除联系人（软删除）
   */
  async delete(id: number, userId: number): Promise<boolean> {
    try {
      const sql = `
        UPDATE ${this.tableName}
        SET status = 'inactive'
        WHERE id = ? AND user_id = ?
      `;
      const result = await QueryBuilder.execute(sql, [id, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      logger.error('删除联系人失败:', error);
      throw error;
    }
  }

  /**
   * 清除默认联系人标记
   */
  private async clearDefaultContact(userId: number, excludeId?: number): Promise<void> {
    try {
      let sql = `
        UPDATE ${this.tableName}
        SET is_default = false
        WHERE user_id = ?
      `;
      const params: unknown[] = [userId];

      if (excludeId) {
        sql += ' AND id != ?';
        params.push(excludeId);
      }

      await QueryBuilder.execute(sql, params);
    } catch (error) {
      logger.error('清除默认联系人标记失败:', error);
      throw error;
    }
  }
}
