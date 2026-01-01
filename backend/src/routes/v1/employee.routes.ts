import { Router } from 'express';
import { EmployeeController } from '../../controllers/employee.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';

const router = Router();
const employeeController = new EmployeeController();

/**
 * 员工管理路由
 */

// 获取员工列表
router.get(
  '/',
  authMiddleware,
  requirePermission('user:view'),
  employeeController.getEmployeeList.bind(employeeController)
);

// 获取员工详情
router.get(
  '/:id',
  authMiddleware,
  requirePermission('user:view'),
  employeeController.getEmployeeDetail.bind(employeeController)
);

// 创建员工
router.post(
  '/',
  authMiddleware,
  requirePermission('user:create'),
  employeeController.createEmployee.bind(employeeController)
);

// 更新员工
router.put(
  '/:id',
  authMiddleware,
  requirePermission('user:update'),
  employeeController.updateEmployee.bind(employeeController)
);

// 更改员工状态
router.put(
  '/:id/status',
  authMiddleware,
  requirePermission('user:update'),
  employeeController.updateEmployeeStatus.bind(employeeController)
);

// 分配员工角色
router.post(
  '/:id/roles',
  authMiddleware,
  requirePermission('user:assign_role'),
  employeeController.assignEmployeeRoles.bind(employeeController)
);

export default router;
