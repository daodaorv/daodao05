import { Router, Request, Response } from 'express';
import { testConnection } from '@db/connection';
import { testRedisConnection } from '@config/redis';
import { successResponse, errorResponse } from '@utils/response';

const router = Router();

/**
 * 健康检查
 */
router.get('/', (_req: Request, res: Response) => {
  res.json(successResponse({ status: 'ok', timestamp: new Date().toISOString() }));
});

/**
 * 数据库连接检查
 */
router.get('/db', async (_req: Request, res: Response) => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      res.json(successResponse({ status: 'connected' }));
    } else {
      res.status(503).json(errorResponse('数据库连接失败', 503));
    }
  } catch (error) {
    res.status(503).json(errorResponse('数据库连接失败', 503, error));
  }
});

/**
 * Redis连接检查
 */
router.get('/redis', async (_req: Request, res: Response) => {
  try {
    const isConnected = await testRedisConnection();
    if (isConnected) {
      res.json(successResponse({ status: 'connected' }));
    } else {
      res.status(503).json(errorResponse('Redis连接失败', 503));
    }
  } catch (error) {
    res.status(503).json(errorResponse('Redis连接失败', 503, error));
  }
});

export default router;
