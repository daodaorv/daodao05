/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { User, UserProfile } from '../types/models/user.types';
import { hashPassword, verifyPassword } from '@utils/bcrypt';
import { logger } from '@utils/logger';

/**
 * 用户数据访问对象
 */
export class UserDAO extends BaseDao<User> {
  constructor() {
    super('users');
  }

  /**
   * 根据ID查找用户
   */
  async findById(userId: number): Promise<User | null> {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`;
      const result = await QueryBuilder.queryOne<User>(sql, [userId]);
      return result;
    } catch (error) {
      logger.error('根据ID查找用户失败:', error);
      throw error;
    }
  }

  /**
   * 根据手机号查找用户
   */
  async findByPhone(phone: string): Promise<User | null> {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE phone = ? LIMIT 1`;
      const result = await QueryBuilder.queryOne<User>(sql, [phone]);
      return result;
    } catch (error) {
      logger.error('根据手机号查找用户失败:', error);
      throw error;
    }
  }

  /**
   * 根据用户名查找用户
   */
  async findByUsername(username: string): Promise<User | null> {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE username = ? LIMIT 1`;
      const result = await QueryBuilder.queryOne<User>(sql, [username]);
      return result;
    } catch (error) {
      logger.error('根据用户名查找用户失败:', error);
      throw error;
    }
  }

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE email = ? LIMIT 1`;
      const result = await QueryBuilder.queryOne<User>(sql, [email]);
      return result;
    } catch (error) {
      logger.error('根据邮箱查找用户失败:', error);
      throw error;
    }
  }

  /**
   * 创建新用户
   */
  async createUser(userData: {
    phone: string;
    password?: string;
    username?: string;
    email?: string;
    user_type?: string;
  }): Promise<number> {
    try {
      // 如果提供了密码，进行哈希
      let passwordHash: string | undefined;
      if (userData.password) {
        passwordHash = await hashPassword(userData.password);
      }

      const sql = `
        INSERT INTO ${this.tableName}
        (phone, password_hash, username, email, user_type, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'active', NOW(), NOW())
      `;

      const result = await QueryBuilder.insert(sql, [
        userData.phone,
        passwordHash || null,
        userData.username || null,
        userData.email || null,
        userData.user_type || 'customer',
      ]);

      return result.insertId;
    } catch (error) {
      logger.error('创建用户失败:', error);
      throw error;
    }
  }

  /**
   * 验证用户密码
   */
  async verifyUserPassword(userId: number, password: string): Promise<boolean> {
    try {
      const user = await this.findById(userId);
      if (!user || !user.password_hash) {
        return false;
      }

      return await verifyPassword(password, user.password_hash);
    } catch (error) {
      logger.error('验证用户密码失败:', error);
      throw error;
    }
  }

  /**
   * 更新用户密码
   */
  async updatePassword(userId: number, newPassword: string): Promise<boolean> {
    try {
      const passwordHash = await hashPassword(newPassword);
      const sql = `
        UPDATE ${this.tableName}
        SET password_hash = ?, updated_at = NOW()
        WHERE id = ?
      `;

      const affectedRows = await QueryBuilder.update(sql, [passwordHash, userId]);
      return affectedRows > 0;
    } catch (error) {
      logger.error('更新用户密码失败:', error);
      throw error;
    }
  }

  /**
   * 更新最后登录时间
   */
  async updateLastLogin(userId: number): Promise<boolean> {
    try {
      const sql = `
        UPDATE ${this.tableName}
        SET last_login_at = NOW(), updated_at = NOW()
        WHERE id = ?
      `;

      const affectedRows = await QueryBuilder.update(sql, [userId]);
      return affectedRows > 0;
    } catch (error) {
      logger.error('更新最后登录时间失败:', error);
      throw error;
    }
  }

  /**
   * 更新用户信息
   */
  async updateUserInfo(
    userId: number,
    data: {
      username?: string;
      email?: string;
      real_name?: string;
      id_card?: string;
      driver_license?: string;
      avatar_url?: string;
    }
  ): Promise<boolean> {
    try {
      const fields: string[] = [];
      const values: any[] = [];

      if (data.username !== undefined) {
        fields.push('username = ?');
        values.push(data.username);
      }
      if (data.email !== undefined) {
        fields.push('email = ?');
        values.push(data.email);
      }
      if (data.real_name !== undefined) {
        fields.push('real_name = ?');
        values.push(data.real_name);
      }
      if (data.id_card !== undefined) {
        fields.push('id_card = ?');
        values.push(data.id_card);
      }
      if (data.driver_license !== undefined) {
        fields.push('driver_license = ?');
        values.push(data.driver_license);
      }
      if (data.avatar_url !== undefined) {
        fields.push('avatar_url = ?');
        values.push(data.avatar_url);
      }

      if (fields.length === 0) {
        return false;
      }

      fields.push('updated_at = NOW()');
      values.push(userId);

      const sql = `UPDATE ${this.tableName} SET ${fields.join(', ')} WHERE id = ?`;
      const affectedRows = await QueryBuilder.update(sql, values);

      return affectedRows > 0;
    } catch (error) {
      logger.error('更新用户信息失败:', error);
      throw error;
    }
  }
}

/**
 * 用户资料数据访问对象
 */
export class UserProfileDAO extends BaseDao<UserProfile> {
  constructor() {
    super('user_profiles');
  }

  /**
   * 根据用户ID查找用户资料
   */
  async findByUserId(userId: number): Promise<UserProfile | null> {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE user_id = ? LIMIT 1`;
      const result = await QueryBuilder.queryOne<UserProfile>(sql, [userId]);
      return result;
    } catch (error) {
      // 如果是查询不到记录,返回null而不是抛出错误
      logger.warn(`根据用户ID查找用户资料: userId=${userId}, 未找到记录`);
      return null;
    }
  }

  /**
   * 创建或更新用户资料
   */
  async upsertProfile(userId: number, profileData: Partial<UserProfile>): Promise<boolean> {
    try {
      const existing = await this.findByUserId(userId);

      if (existing) {
        // 更新现有资料
        const fields: string[] = [];
        const values: any[] = [];

        Object.entries(profileData).forEach(([key, value]) => {
          if (key !== 'id' && key !== 'user_id' && value !== undefined) {
            fields.push(`${key} = ?`);
            values.push(value);
          }
        });

        if (fields.length === 0) {
          return false;
        }

        fields.push('updated_at = NOW()');
        values.push(existing.id);

        const sql = `UPDATE ${this.tableName} SET ${fields.join(', ')} WHERE id = ?`;
        const affectedRows = await QueryBuilder.update(sql, values);

        return affectedRows > 0;
      } else {
        // 创建新资料
        const sql = `
          INSERT INTO ${this.tableName}
          (user_id, gender, birthday, address, emergency_contact, emergency_phone,
           work_company, work_title, preferences, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        await QueryBuilder.insert(sql, [
          userId,
          profileData.gender || null,
          profileData.birthday || null,
          profileData.address || null,
          profileData.emergency_contact || null,
          profileData.emergency_phone || null,
          profileData.work_company || null,
          profileData.work_title || null,
          profileData.preferences || null,
        ]);

        return true;
      }
    } catch (error) {
      logger.error('创建或更新用户资料失败:', error);
      throw error;
    }
  }
}
