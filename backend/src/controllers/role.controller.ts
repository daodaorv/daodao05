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
  async getAllRoles(_req: Request, res: Response): Promise<void> {
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

  /**
   * 创建角色
   */
  async createRole(req: Request, res: Response): Promise<void> {
    try {
      const { name, code, type, description, dataScope } = req.body;

      // 验证必填字段
      if (!name || !code || !type) {
        res.status(400).json(errorResponse('角色名称、编码和类型不能为空'));
        return;
      }

      // 验证角色类型
      if (type !== 'customer' && type !== 'admin') {
        res.status(400).json(errorResponse('无效的角色类型'));
        return;
      }

      // 检查角色编码是否已存在
      const existingRole = await roleDAO.findByCode(code);
      if (existingRole) {
        res.status(400).json(errorResponse('角色编码已存在'));
        return;
      }

      // 创建角色
      const roleId = await roleDAO.createRole({
        name,
        code,
        type: type as RoleType,
        description: description || '',
        data_scope: dataScope || 'self',
      });

      const role = await roleDAO.findById(roleId);
      res.status(201).json(successResponse(role));
    } catch (error) {
      logger.error('创建角色失败:', error);
      res.status(500).json(errorResponse('创建角色失败'));
    }
  }

  /**
   * 更新角色
   */
  async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const roleId = parseInt(req.params.id);
      const { name, description, dataScope, status } = req.body;

      // 检查角色是否存在
      const role = await roleDAO.findById(roleId);
      if (!role) {
        res.status(404).json(errorResponse('角色不存在'));
        return;
      }

      // 更新角色
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (dataScope !== undefined) updateData.data_scope = dataScope;
      if (status !== undefined) updateData.status = status;

      await roleDAO.update(roleId, updateData);

      const updatedRole = await roleDAO.findById(roleId);
      res.json(successResponse(updatedRole));
    } catch (error) {
      logger.error('更新角色失败:', error);
      res.status(500).json(errorResponse('更新角色失败'));
    }
  }

  /**
   * 删除角色
   */
  async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      const roleId = parseInt(req.params.id);

      // 检查角色是否存在
      const role = await roleDAO.findById(roleId);
      if (!role) {
        res.status(404).json(errorResponse('角色不存在'));
        return;
      }

      // 检查是否有用户使用该角色
      const userRoles = await userRoleDAO.findByRoleId(roleId);
      if (userRoles.length > 0) {
        res.status(400).json(errorResponse('该角色下还有用户，无法删除'));
        return;
      }

      // 删除角色
      await roleDAO.delete(roleId);
      res.json(successResponse({ message: '角色已删除' }));
    } catch (error) {
      logger.error('删除角色失败:', error);
      res.status(500).json(errorResponse('删除角色失败'));
    }
  }

  /**
   * 配置角色权限
   */
  async assignRolePermissions(req: Request, res: Response): Promise<void> {
    try {
      const roleId = parseInt(req.params.id);
      const { permissionIds } = req.body;

      // 验证必填字段
      if (!permissionIds || !Array.isArray(permissionIds)) {
        res.status(400).json(errorResponse('权限ID列表不能为空'));
        return;
      }

      // 检查角色是否存在
      const role = await roleDAO.findById(roleId);
      if (!role) {
        res.status(404).json(errorResponse('角色不存在'));
        return;
      }

      // 验证所有权限ID是否存在
      for (const permissionId of permissionIds) {
        const permission = await permissionDAO.findById(permissionId);
        if (!permission) {
          res.status(400).json(errorResponse(`权限ID ${permissionId} 不存在`));
          return;
        }
      }

      // 删除角色现有的所有权限
      await roleDAO.deleteRolePermissions(roleId);

      // 分配新权限
      if (permissionIds.length > 0) {
        await roleDAO.assignPermissions(roleId, permissionIds);
      }

      // 返回更新后的角色权限
      const permissions = await permissionDAO.findByRoleId(roleId);
      res.json(successResponse({ roleId, permissions }));
    } catch (error) {
      logger.error('配置角色权限失败:', error);
      res.status(500).json(errorResponse('配置角色权限失败'));
    }
  }
}
