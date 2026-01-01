import { Router } from 'express';
import { OperationLogController } from '../../controllers/operation-log.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';

const router = Router();
const operationLogController = new OperationLogController();

/**
 * 操作日志路由
 */

// 获取操作日志列表
router.get(
  '/',
  authMiddleware,
  requirePermission('user:view'),
  operationLogController.getOperationLogList.bind(operationLogController)
);

// 获取操作日志详情
router.get(
  '/:id',
  authMiddleware,
  requirePermission('user:view'),
  operationLogController.getOperationLogDetail.bind(operationLogController)
);

// 导出操作日志
router.post(
  '/export',
  authMiddleware,
  requirePermission('user:view'),
  operationLogController.exportOperationLogs.bind(operationLogController)
);

// 清理操作日志
router.delete(
  '/clean',
  authMiddleware,
  requirePermission('user:delete'),
  operationLogController.cleanOperationLogs.bind(operationLogController)
);

export default router;
