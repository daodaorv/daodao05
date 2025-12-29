import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/permission.middleware';

const router = Router();
const roleController = new RoleController();

/**
 * 角色管理路由
 * 所有路由都需要认证
 */

// 获取所有激活的角色
router.get(
  '/',
  authMiddleware,
  requirePermission('user:view'),
  roleController.getAllRoles.bind(roleController)
);

// 根据类型获取角色列表
router.get(
  '/type/:type',
  authMiddleware,
  requirePermission('user:view'),
  roleController.getRolesByType.bind(roleController)
);

// 获取角色详情
router.get(
  '/:id',
  authMiddleware,
  requirePermission('user:view'),
  roleController.getRoleDetail.bind(roleController)
);

// 获取用户的角色列表
router.get(
  '/user/:userId',
  authMiddleware,
  requirePermission('user:view'),
  roleController.getUserRoles.bind(roleController)
);

export default router;
