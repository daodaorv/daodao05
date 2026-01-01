import { Request, Response } from 'express';
import { UserDAO } from '@dao/user.dao';
import { QueryBuilder } from '@db/query-builder';
import { successResponse, errorResponse } from '@utils/response';
import { logger } from '@utils/logger';

/**
 * 管理端用户管理控制器
 */
export class UserAdminController {
  private userDAO: UserDAO;

  constructor() {
    this.userDAO = new UserDAO();
  }

  /**
   * 获取用户列表（分页、搜索、筛选）
   * GET /api/v1/admin/users
   */
  async getUserList(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        pageSize = 10,
        phone,
        username,
        status,
      } = req.query;

      // 构建查询条件
      const conditions: string[] = ["user_type = 'customer'"];
      const params: any[] = [];

      if (phone) {
        conditions.push('phone LIKE ?');
        params.push(`%${phone}%`);
      }

      if (username) {
        conditions.push('username LIKE ?');
        params.push(`%${username}%`);
      }

      if (status) {
        conditions.push('status = ?');
        params.push(status);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // 查询总数
      const countSql = `SELECT COUNT(*) as total FROM users ${whereClause}`;
      const countResult = await QueryBuilder.queryOne(countSql, params);
      const total = (countResult as any)?.total || 0;

      // 查询列表
      const offset = (Number(page) - 1) * Number(pageSize);
      const listSql = `
        SELECT id, phone, username, email, real_name, avatar_url, status,
               user_type, created_at, updated_at, last_login_at
        FROM users
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;
      const rawList = await QueryBuilder.query(listSql, [...params, Number(pageSize), offset]);

      // 转换字段名为驼峰格式
      const list = (rawList as any[]).map(user => ({
        id: user.id,
        phone: user.phone,
        username: user.username,
        email: user.email,
        realName: user.real_name,
        avatarUrl: user.avatar_url || '/static/default-avatar.png',
        status: user.status,
        userType: user.user_type,
        tags: [], // TODO: 从标签表查询
        lastLoginAt: user.last_login_at,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      }));

      res.json(
        successResponse({
          list,
          total,
          page: Number(page),
          pageSize: Number(pageSize),
        })
      );
    } catch (error) {
      logger.error('获取用户列表失败:', error);
      res.status(500).json(errorResponse('获取用户列表失败', 500));
    }
  }

  /**
   * 获取用户详情
   * GET /api/v1/admin/users/:id
   */
  async getUserDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userDAO.findById(Number(id));

      if (!user) {
        res.status(404).json(errorResponse('用户不存在', 404));
        return;
      }

      res.json(successResponse(user));
    } catch (error) {
      logger.error('获取用户详情失败:', error);
      res.status(500).json(errorResponse('获取用户详情失败', 500));
    }
  }

  /**
   * 创建用户
   * POST /api/v1/admin/users
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { phone, username, password, email, realName } = req.body;

      // 验证必填字段
      if (!phone) {
        res.status(400).json(errorResponse('手机号不能为空', 400));
        return;
      }

      // 检查手机号是否已存在
      const existingUser = await this.userDAO.findByPhone(phone);
      if (existingUser) {
        res.status(400).json(errorResponse('该手机号已被注册', 400));
        return;
      }

      // 创建用户
      const userId = await this.userDAO.createUser({
        phone,
        password,
        username: username || `用户${phone.slice(-4)}`,
        email,
        user_type: 'customer',
      });

      // 如果提供了真实姓名，更新用户信息
      if (realName) {
        await this.userDAO.updateUserInfo(userId, { real_name: realName });
      }

      const user = await this.userDAO.findById(userId);
      res.json(successResponse(user));
    } catch (error) {
      logger.error('创建用户失败:', error);
      res.status(500).json(errorResponse('创建用户失败', 500));
    }
  }

  /**
   * 更新用户
   * PUT /api/v1/admin/users/:id
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { username, email, realName, status } = req.body;

      const user = await this.userDAO.findById(Number(id));
      if (!user) {
        res.status(404).json(errorResponse('用户不存在', 404));
        return;
      }

      // 更新用户信息
      await this.userDAO.updateUserInfo(Number(id), {
        username,
        email,
        real_name: realName,
      });

      // 更新状态
      if (status) {
        const sql = 'UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?';
        await QueryBuilder.update(sql, [status, Number(id)]);
      }

      const updatedUser = await this.userDAO.findById(Number(id));
      res.json(successResponse(updatedUser));
    } catch (error) {
      logger.error('更新用户失败:', error);
      res.status(500).json(errorResponse('更新用户失败', 500));
    }
  }

  /**
   * 删除用户
   * DELETE /api/v1/admin/users/:id
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await this.userDAO.findById(Number(id));
      if (!user) {
        res.status(404).json(errorResponse('用户不存在', 404));
        return;
      }

      const sql = 'DELETE FROM users WHERE id = ?';
      await QueryBuilder.execute(sql, [Number(id)]);

      res.json(successResponse({ success: true }));
    } catch (error) {
      logger.error('删除用户失败:', error);
      res.status(500).json(errorResponse('删除用户失败', 500));
    }
  }

  /**
   * 更改用户状态
   * PUT /api/v1/admin/users/:id/status
   */
  async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['active', 'inactive', 'banned'].includes(status)) {
        res.status(400).json(errorResponse('无效的状态值', 400));
        return;
      }

      const user = await this.userDAO.findById(Number(id));
      if (!user) {
        res.status(404).json(errorResponse('用户不存在', 404));
        return;
      }

      const sql = 'UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?';
      await QueryBuilder.update(sql, [status, Number(id)]);

      res.json(successResponse({ success: true }));
    } catch (error) {
      logger.error('更改用户状态失败:', error);
      res.status(500).json(errorResponse('更改用户状态失败', 500));
    }
  }
}
