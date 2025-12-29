import { Request, Response, NextFunction } from 'express';
import { UserRoleDAO } from '../dao/user-role.dao';
import { DataScope } from '../types/models/role.types';
import { logger } from '../utils/logger';

const userRoleDAO = new UserRoleDAO();

/**
 * 数据范围信息接口
 */
export interface DataScopeInfo {
  scope: DataScope;
  storeIds: number[];
  userId: number;
}

/**
 * 扩展Request接口，添加dataScope属性
 */
declare global {
  namespace Express {
    interface Request {
      dataScope?: DataScopeInfo;
    }
  }
}

/**
 * 数据范围过滤中间件
 * 根据用户角色的data_scope设置数据访问范围
 */
export function applyDataScope() {
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

      // 查询用户的所有角色（包含角色详情）
      const userRoles = await userRoleDAO.findByUserIdWithDetails(user.userId);

      if (userRoles.length === 0) {
        // 用户没有角色，默认只能访问自己的数据
        req.dataScope = {
          scope: DataScope.SELF,
          storeIds: [],
          userId: user.userId,
        };
        next();
        return;
      }

      // 获取最高级别的数据权限范围
      // 优先级: all > region > store > self
      let maxScope = DataScope.SELF;
      const storeIds: number[] = [];

      for (const userRole of userRoles) {
        const roleScope = userRole.role.data_scope;

        // 如果有全局权限，直接使用
        if (roleScope === DataScope.ALL) {
          maxScope = DataScope.ALL;
          break;
        }

        // 更新最高权限级别
        if (roleScope === DataScope.REGION && maxScope !== DataScope.ALL) {
          maxScope = DataScope.REGION;
        } else if (roleScope === DataScope.STORE && maxScope === DataScope.SELF) {
          maxScope = DataScope.STORE;
        }

        // 收集门店ID
        if (userRole.store_id) {
          storeIds.push(userRole.store_id);
        }
      }

      // 设置数据范围信息
      req.dataScope = {
        scope: maxScope,
        storeIds: Array.from(new Set(storeIds)), // 去重
        userId: user.userId,
      };

      logger.debug(`用户 ${user.userId} 的数据范围: ${maxScope}, 门店: [${storeIds.join(', ')}]`);
      next();
    } catch (error) {
      logger.error('数据范围中间件错误:', error);
      res.status(500).json({
        error: '服务器错误',
        message: '数据范围验证失败',
      });
    }
  };
}
