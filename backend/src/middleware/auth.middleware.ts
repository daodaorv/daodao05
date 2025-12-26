import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '@utils/jwt';
import { errorResponse } from '@utils/response';
import { logger } from '@utils/logger';

/**
 * 扩展Express Request类型，添加user属性
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * JWT认证中间件
 * 验证请求头中的Bearer Token
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    // 获取Authorization头
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json(errorResponse('未提供认证令牌', 401));
      return;
    }

    // 验证Bearer Token格式
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json(errorResponse('认证令牌格式错误', 401));
      return;
    }

    const token = parts[1];

    // 验证Token
    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json(errorResponse('认证令牌无效或已过期', 401));
      return;
    }

    // 将用户信息附加到请求对象
    req.user = payload;

    next();
  } catch (error) {
    logger.error('认证中间件错误:', error);
    res.status(401).json(errorResponse('认证失败', 401));
  }
}

/**
 * 可选认证中间件
 * Token存在时验证，不存在时继续执行
 */
export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next();
      return;
    }

    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const token = parts[1];
      const payload = verifyToken(token);

      if (payload) {
        req.user = payload;
      }
    }

    next();
  } catch (error) {
    logger.error('可选认证中间件错误:', error);
    next();
  }
}
