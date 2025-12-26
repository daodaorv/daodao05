import { Router, Request, Response } from 'express';
import { UserPointsDAO } from '../../dao/user-points.dao';
import { PointsTransactionDAO } from '../../dao/points-transaction.dao';
import { successResponse, errorResponse } from '../../utils/response';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const userPointsDAO = new UserPointsDAO();
const transactionDAO = new PointsTransactionDAO();

/**
 * 1. 获取积分余额
 * GET /api/v1/points/balance
 */
router.get('/balance', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return;
    }
    const points = await userPointsDAO.getUserPoints(userId);

    if (!points) {
      return res.json(successResponse({
        totalPoints: 0,
        availablePoints: 0,
        frozenPoints: 0
      }));
    }

    return res.json(successResponse({
      totalPoints: points.total_points,
      availablePoints: points.available_points,
      frozenPoints: points.frozen_points
    }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '操作失败';
    return res.status(500).json(errorResponse(message));
  }
});

/**
 * 2. 获取积分记录
 * GET /api/v1/points/transactions
 */
router.get('/transactions', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return;
    }
    const { page = 1, pageSize = 10 } = req.query;

    const result = await transactionDAO.getUserTransactions(
      userId,
      Number(page),
      Number(pageSize)
    );

    return res.json(successResponse({
      list: result.list,
      total: result.total,
      page: result.page,
      pageSize: result.limit,
    }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '操作失败';
    return res.status(500).json(errorResponse(message));
  }
});

/**
 * 3. 获取积分规则
 * GET /api/v1/points/rules
 */
router.get('/rules', async (_req: Request, res: Response) => {
  try {
    // TODO: 实现积分规则查询
    const rules = [
      { action: 'register', points: 100, description: '注册奖励' },
      { action: 'daily_signin', points: 10, description: '每日签到' },
      { action: 'order_complete', points: 50, description: '完成订单' },
      { action: 'share', points: 20, description: '分享好友' },
    ];

    return res.json(successResponse(rules));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '操作失败';
    return res.status(500).json(errorResponse(message));
  }
});

/**
 * 4. 获取兑换商品列表
 * GET /api/v1/points/products
 */
router.get('/products', async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    // TODO: 实现兑换商品查询
    const result = {
      list: [],
      total: 0,
      page: Number(page),
      pageSize: Number(pageSize),
    };

    return res.json(successResponse(result));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '操作失败';
    return res.status(500).json(errorResponse(message));
  }
});

/**
 * 5. 兑换商品
 * POST /api/v1/points/redeem
 */
router.post('/redeem', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return;
    }
    const { productId, quantity } = req.body;

    // TODO: 实现兑换逻辑
    return res.json(successResponse({
      message: '兑换成功',
      productId,
      quantity,
      userId
    }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '操作失败';
    return res.status(500).json(errorResponse(message));
  }
});

/**
 * 6. 获取兑换记录
 * GET /api/v1/points/redemptions
 */
router.get('/redemptions', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return;
    }
    const { page = 1, pageSize = 10 } = req.query;

    // TODO: 实现兑换记录查询
    const result = {
      list: [],
      total: 0,
      page: Number(page),
      pageSize: Number(pageSize),
      userId
    };

    return res.json(successResponse(result));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '操作失败';
    return res.status(500).json(errorResponse(message));
  }
});

export default router;
