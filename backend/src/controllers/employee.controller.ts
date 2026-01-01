import { Request, Response } from 'express';
import { UserDAO } from '@dao/user.dao';
import { UserRoleDAO } from '@dao/user-role.dao';
import { QueryBuilder } from '@db/query-builder';
import { successResponse, errorResponse } from '@utils/response';
import { logger } from '@utils/logger';

/**
 * 员工管理控制器
 */
export class EmployeeController {
  private userDAO: UserDAO;
  private userRoleDAO: UserRoleDAO;

  constructor() {
    this.userDAO = new UserDAO();
    this.userRoleDAO = new UserRoleDAO();
  }

  /**
   * 获取员工列表
   * GET /api/v1/admin/employees
   */
  async getEmployeeList(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        pageSize = 10,
        keyword,
        status,
      } = req.query;

      // 构建查询条件 - 只查询管理员类型的用户
      const conditions: string[] = ["user_type = 'admin'"];
      const params: any[] = [];

      if (keyword) {
        conditions.push('(username LIKE ? OR phone LIKE ? OR real_name LIKE ?)');
        params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
      }

      if (status) {
        conditions.push('status = ?');
        params.push(status);
      }

      const whereClause = `WHERE ${conditions.join(' AND ')}`;

      // 查询总数
      const countSql = `SELECT COUNT(*) as total FROM users ${whereClause}`;
      const countResult = await QueryBuilder.queryOne(countSql, params);
      const total = (countResult as any)?.total || 0;

      // 查询列表
      const offset = (Number(page) - 1) * Number(pageSize);
      const listSql = `
        SELECT u.id, u.phone, u.username, u.email, u.real_name, u.avatar_url,
               u.status, u.user_type, u.created_at, u.updated_at
        FROM users u
        ${whereClause}
        ORDER BY u.created_at DESC
        LIMIT ? OFFSET ?
      `;
      const list = await QueryBuilder.query(listSql, [...params, Number(pageSize), offset]);

      res.json(
        successResponse({
          list,
          total,
          page: Number(page),
          pageSize: Number(pageSize),
        })
      );
    } catch (error) {
      logger.error('获取员工列表失败:', error);
      res.status(500).json(errorResponse('获取员工列表失败', 500));
    }
  }

  /**
   * 获取员工详情
   * GET /api/v1/admin/employees/:id
   */
  async getEmployeeDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const employee = await this.userDAO.findById(Number(id));

      if (!employee || (employee.user_type as string) !== 'admin') {
        res.status(404).json(errorResponse('员工不存在', 404));
        return;
      }

      // 获取员工角色
      const roles = await this.userRoleDAO.findByUserIdWithDetails(Number(id));

      res.json(
        successResponse({
          ...employee,
          roles: roles.map(r => ({
            id: r.role.id,
            name: r.role.name,
            code: r.role.code,
          })),
        })
      );
    } catch (error) {
      logger.error('获取员工详情失败:', error);
      res.status(500).json(errorResponse('获取员工详情失败', 500));
    }
  }

  /**
   * 创建员工
   * POST /api/v1/admin/employees
   */
  async createEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { phone, username, password, email, realName } = req.body;

      if (!phone) {
        res.status(400).json(errorResponse('手机号不能为空', 400));
        return;
      }

      const existingUser = await this.userDAO.findByPhone(phone);
      if (existingUser) {
        res.status(400).json(errorResponse('该手机号已被注册', 400));
        return;
      }

      const userId = await this.userDAO.createUser({
        phone,
        password,
        username: username || `员工${phone.slice(-4)}`,
        email,
        user_type: 'admin',
      });

      if (realName) {
        await this.userDAO.updateUserInfo(userId, { real_name: realName });
      }

      const employee = await this.userDAO.findById(userId);
      res.json(successResponse(employee));
    } catch (error) {
      logger.error('创建员工失败:', error);
      res.status(500).json(errorResponse('创建员工失败', 500));
    }
  }

  /**
   * 更新员工
   * PUT /api/v1/admin/employees/:id
   */
  async updateEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { username, email, realName, status } = req.body;

      const employee = await this.userDAO.findById(Number(id));
      if (!employee || (employee.user_type as string) !== 'admin') {
        res.status(404).json(errorResponse('员工不存在', 404));
        return;
      }

      await this.userDAO.updateUserInfo(Number(id), {
        username,
        email,
        real_name: realName,
      });

      if (status) {
        const sql = 'UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?';
        await QueryBuilder.update(sql, [status, Number(id)]);
      }

      const updatedEmployee = await this.userDAO.findById(Number(id));
      res.json(successResponse(updatedEmployee));
    } catch (error) {
      logger.error('更新员工失败:', error);
      res.status(500).json(errorResponse('更新员工失败', 500));
    }
  }

  /**
   * 更改员工状态
   * PUT /api/v1/admin/employees/:id/status
   */
  async updateEmployeeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['active', 'inactive'].includes(status)) {
        res.status(400).json(errorResponse('无效的状态值', 400));
        return;
      }

      const employee = await this.userDAO.findById(Number(id));
      if (!employee || (employee.user_type as string) !== 'admin') {
        res.status(404).json(errorResponse('员工不存在', 404));
        return;
      }

      const sql = 'UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?';
      await QueryBuilder.update(sql, [status, Number(id)]);

      res.json(successResponse({ success: true }));
    } catch (error) {
      logger.error('更改员工状态失败:', error);
      res.status(500).json(errorResponse('更改员工状态失败', 500));
    }
  }

  /**
   * 分配员工角色
   * POST /api/v1/admin/employees/:id/roles
   */
  async assignEmployeeRoles(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { roleIds } = req.body;

      if (!roleIds || !Array.isArray(roleIds) || roleIds.length === 0) {
        res.status(400).json(errorResponse('角色ID列表不能为空', 400));
        return;
      }

      const employee = await this.userDAO.findById(Number(id));
      if (!employee || (employee.user_type as string) !== 'admin') {
        res.status(404).json(errorResponse('员工不存在', 404));
        return;
      }

      // 删除现有角色
      await QueryBuilder.execute('DELETE FROM user_roles WHERE user_id = ?', [Number(id)]);

      // 分配新角色
      for (const roleId of roleIds) {
        await QueryBuilder.execute(
          'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
          [Number(id), roleId]
        );
      }

      res.json(successResponse({ success: true }));
    } catch (error) {
      logger.error('分配员工角色失败:', error);
      res.status(500).json(errorResponse('分配员工角色失败', 500));
    }
  }
}
