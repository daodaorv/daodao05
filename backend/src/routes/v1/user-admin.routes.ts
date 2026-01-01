import { Router } from 'express';
import { UserAdminController } from '../../controllers/user-admin.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';

const router = Router();
const userAdminController = new UserAdminController();

/**
 * 管理端用户管理路由
 * 所有路由都需要认证和权限验证
 */

// 获取用户列表
router.get(
  '/',
  authMiddleware,
  requirePermission('user:view'),
  userAdminController.getUserList.bind(userAdminController)
);

// 获取用户详情
router.get(
  '/:id',
  authMiddleware,
  requirePermission('user:view'),
  userAdminController.getUserDetail.bind(userAdminController)
);

// 创建用户
router.post(
  '/',
  authMiddleware,
  requirePermission('user:create'),
  userAdminController.createUser.bind(userAdminController)
);

// 更新用户
router.put(
  '/:id',
  authMiddleware,
  requirePermission('user:edit'),
  userAdminController.updateUser.bind(userAdminController)
);

// 删除用户
router.delete(
  '/:id',
  authMiddleware,
  requirePermission('user:delete'),
  userAdminController.deleteUser.bind(userAdminController)
);

// 更改用户状态
router.put(
  '/:id/status',
  authMiddleware,
  requirePermission('user:edit'),
  userAdminController.updateUserStatus.bind(userAdminController)
);

export default router;
