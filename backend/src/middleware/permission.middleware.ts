import { Request, Response, NextFunction } from 'express';
import { PermissionDAO } from '../dao/permission.dao';
import { logger } from '../utils/logger';

const permissionDAO = new PermissionDAO();

/**
 * 权限验证中间件
 * 检查用户是否拥有指定的权限
 */
export function requirePermission(permissionCode: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 从JWT中获取用户信息
      const user = req.user;

      if (!user || !user.userId) {
        res.status(401).json({
          error: '未认证',
          message: '请先登录',
        });
        return;
      }

      // 查询用户的所有权限
      const permissions = await permissionDAO.findByUserId(user.userId);

      // 检查是否拥有所需权限
      const hasPermission = permissions.some(p => p.code === permissionCode);

      if (!hasPermission) {
        logger.warn(`用户 ${user.userId} 尝试访问权限 ${permissionCode} 但被拒绝`);
        res.status(403).json({
          error: '权限不足',
          message: `需要权限: ${permissionCode}`,
          required: permissionCode,
        });
        return;
      }

      // 权限验证通过，继续执行
      next();
    } catch (error) {
      logger.error('权限验证中间件错误:', error);
      res.status(500).json({
        error: '服务器错误',
        message: '权限验证失败',
      });
    }
  };
}

/**
 * 检查用户是否拥有任意一个权限（OR逻辑）
 */
export function requireAnyPermission(...permissionCodes: string[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;

      if (!user || !user.userId) {
        res.status(401).json({
          error: '未认证',
          message: '请先登录',
        });
        return;
      }

      const permissions = await permissionDAO.findByUserId(user.userId);
      const hasAnyPermission = permissionCodes.some(code =>
        permissions.some(p => p.code === code)
      );

      if (!hasAnyPermission) {
        logger.warn(`用户 ${user.userId} 尝试访问权限 [${permissionCodes.join(', ')}] 但被拒绝`);
        res.status(403).json({
          error: '权限不足',
          message: `需要以下任意一个权限: ${permissionCodes.join(', ')}`,
          required: permissionCodes,
        });
        return;
      }

      next();
    } catch (error) {
      logger.error('权限验证中间件错误:', error);
      res.status(500).json({
        error: '服务器错误',
        message: '权限验证失败',
      });
    }
  };
}
