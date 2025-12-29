import { Permission } from '../types/models/role.types';
import { PermissionDAO } from '../dao/permission.dao';
import { logger } from '../utils/logger';

const permissionDAO = new PermissionDAO();

/**
 * 权限缓存工具
 * 简化版本：使用内存缓存，避免频繁查询数据库
 */
class PermissionCache {
  private cache: Map<number, { permissions: Permission[]; timestamp: number }>;
  private readonly CACHE_TTL = 15 * 60 * 1000; // 15分钟过期

  constructor() {
    this.cache = new Map();
  }

  /**
   * 获取用户权限（带缓存）
   */
  async getUserPermissions(userId: number): Promise<Permission[]> {
    const cached = this.cache.get(userId);

    // 检查缓存是否有效
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      logger.debug(`从缓存获取用户 ${userId} 的权限`);
      return cached.permissions;
    }

    // 缓存失效或不存在，从数据库查询
    logger.debug(`从数据库查询用户 ${userId} 的权限`);
    const permissions = await permissionDAO.findByUserId(userId);

    // 更新缓存
    this.cache.set(userId, {
      permissions,
      timestamp: Date.now(),
    });

    return permissions;
  }

  /**
   * 清除指定用户的权限缓存
   */
  clearUserCache(userId: number): void {
    this.cache.delete(userId);
    logger.debug(`清除用户 ${userId} 的权限缓存`);
  }

  /**
   * 清除所有权限缓存
   */
  clearAllCache(): void {
    this.cache.clear();
    logger.debug('清除所有权限缓存');
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats(): { size: number; ttl: number } {
    return {
      size: this.cache.size,
      ttl: this.CACHE_TTL,
    };
  }
}

// 导出单例
export const permissionCache = new PermissionCache();
