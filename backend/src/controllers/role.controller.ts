import { Request, Response } from 'express';
import { RoleDAO } from '../dao/role.dao';
import { PermissionDAO } from '../dao/permission.dao';
import { UserRoleDAO } from '../dao/user-role.dao';
import { RoleType } from '../types/models/role.types';
import { logger } from '../utils/logger';
import { successResponse, errorResponse } from '../utils/response';

const roleDAO = new RoleDAO();
const permissionDAO = new PermissionDAO();
const userRoleDAO = new UserRoleDAO();

/**
 * 角色管理控制器
 */
export class RoleController {
  /**
   * 获取所有激活的角色
   */
  async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await roleDAO.findAllActive();
      res.json(successResponse(roles));
    } catch (error) {
      logger.error('获取角色列表失败:', error);
      res.status(500).json(errorResponse('获取角色列表失败'));
    }
  }

  /**
   * 根据类型获取角色列表
   */
  async getRolesByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;

      if (type !== 'customer' && type !== 'admin') {
        res.status(400).json(errorResponse('无效的角色类型'));
        return;
      }

      const roles = await roleDAO.findByType(type as RoleType);
      res.json(successResponse(roles));
    } catch (error) {
      logger.error('获取角色列表失败:', error);
      res.status(500).json(errorResponse('获取角色列表失败'));
    }
  }

  /**
   * 获取角色详情（包含权限列表）
   */
  async getRoleDetail(req: Request, res: Response): Promise<void> {
    try {
      const roleId = parseInt(req.params.id);
      const role = await roleDAO.findById(roleId);

      if (!role) {
        res.status(404).json(errorResponse('角色不存在'));
        return;
      }

      const permissions = await permissionDAO.findByRoleId(roleId);
      res.json(successResponse({ ...role, permissions }));
    } catch (error) {
      logger.error('获取角色详情失败:', error);
      res.status(500).json(errorResponse('获取角色详情失败'));
    }
  }

  /**
   * 获取用户的角色列表
   */
  async getUserRoles(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const userRoles = await userRoleDAO.findByUserIdWithDetails(userId);
      res.json(successResponse(userRoles));
    } catch (error) {
      logger.error('获取用户角色失败:', error);
      res.status(500).json(errorResponse('获取用户角色失败'));
    }
  }
}
