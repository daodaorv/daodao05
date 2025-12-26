import { Router, Request, Response } from 'express';
import { UserMembershipDAO } from '../../dao/user-membership.dao';
import { successResponse, errorResponse } from '../../utils/response';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const membershipDAO = new UserMembershipDAO();

/**
 * 1. 获取会员信息
 * GET /api/v1/membership/info
 */
router.get('/info', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown).user.id;
    const membership = await membershipDAO.getUserMembership(userId);

    if (!membership) {
      return res.json(successResponse({
        level: 'free',
        status: 'active',
        autoRenew: false
      }));
    }

    return res.json(successResponse({
      level: membership.level,
      startDate: membership.start_date,
      endDate: membership.end_date,
      autoRenew: membership.auto_renew,
      status: membership.status
    }));
  } catch (error: unknown) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 2. 获取会员套餐列表
 * GET /api/v1/membership/packages
 */
router.get('/packages', async (_req: Request, res: Response) => {
  try {
    const packages = [
      { id: 1, level: 'silver', name: '银卡会员', price: 99, duration: 30, benefits: [] },
      { id: 2, level: 'gold', name: '金卡会员', price: 299, duration: 90, benefits: [] },
      { id: 3, level: 'platinum', name: '白金会员', price: 999, duration: 365, benefits: [] },
    ];
    return res.json(successResponse(packages));
  } catch (error: unknown) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 3. 获取会员权益列表
 * GET /api/v1/membership/benefits
 */
router.get('/benefits', async (_req: Request, res: Response) => {
  try {
    const benefits = [
      { id: 1, name: '专属客服', description: '7x24小时专属客服' },
      { id: 2, name: '优先预订', description: '优先预订热门车型' },
      { id: 3, name: '折扣优惠', description: '享受会员专属折扣' },
    ];
    return res.json(successResponse(benefits));
  } catch (error: unknown) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 4. 购买会员
 * POST /api/v1/membership/purchase
 */
router.post('/purchase', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown).user.id;
    const { packageId } = req.body;

    return res.json(successResponse({
      message: '购买成功',
      packageId,
      userId
    }));
  } catch (error: unknown) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 5. 续费会员
 * POST /api/v1/membership/renew
 */
router.post('/renew', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown).user.id;
    const { packageId } = req.body;

    return res.json(successResponse({
      message: '续费成功',
      packageId,
      userId
    }));
  } catch (error: unknown) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 6. 取消自动续费
 * POST /api/v1/membership/cancel-auto-renew
 */
router.post('/cancel-auto-renew', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown).user.id;

    return res.json(successResponse({
      message: '已取消自动续费',
      userId
    }));
  } catch (error: unknown) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 7. 开启自动续费
 * POST /api/v1/membership/enable-auto-renew
 */
router.post('/enable-auto-renew', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown).user.id;

    return res.json(successResponse({
      message: '已开启自动续费',
      userId
    }));
  } catch (error: unknown) {
    return res.status(500).json(errorResponse(error.message));
  }
});

export default router;
