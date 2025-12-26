import { Router, Request, Response } from 'express';
import { CouponDAO } from '../../dao/coupon.dao';
import { UserCouponDAO } from '../../dao/user-coupon.dao';
import { InviteCodeDAO } from '../../dao/invite-code.dao';
import { InviteRecordDAO } from '../../dao/invite-record.dao';
import { successResponse, errorResponse } from '../../utils/response';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const couponDAO = new CouponDAO();
const userCouponDAO = new UserCouponDAO();
const inviteCodeDAO = new InviteCodeDAO();
const inviteRecordDAO = new InviteRecordDAO();

/**
 * 1. 获取优惠券列表（特惠商城）
 * GET /api/v1/coupons
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, page = 1, pageSize = 10 } = req.query;

    const result = await couponDAO.getCoupons({
      category: category as string,
      page: Number(page),
      limit: Number(pageSize),
    });

    res.json(successResponse({
      list: result.list,
      total: result.total,
      page: result.page,
      pageSize: result.limit,
    }));
  } catch (error: unknown) {
    res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 2. 获取优惠券详情
 * GET /api/v1/coupons/:id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const coupon = await couponDAO.getCouponById(Number(id));

    if (!coupon) {
      return res.status(404).json(errorResponse('优惠券不存在'));
    }

    return res.json(successResponse(coupon));
  } catch (error: unknown) {
    return res.status(500).json(errorResponse(error.message));
  }
});
/**
 * 3. 领取优惠券
 * POST /api/v1/coupons/:id/claim
 */
router.post('/:id/claim', authMiddleware, async (req: Request, res: Response): Promise<unknown> => {
  try {
    const userId = (req as unknown).user.id;
    const { id } = req.params;
    const couponId = Number(id);

    const hasStock = await couponDAO.checkStock(couponId);
    if (!hasStock) {
      return res.status(400).json(errorResponse('优惠券已售罄'));
    }

    const coupon = await couponDAO.getCouponById(couponId);
    if (!coupon) {
      return res.status(404).json(errorResponse('优惠券不存在'));
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + coupon.validity_days);

    await userCouponDAO.claimCoupon({
      userId,
      couponId,
      expiryDate: expiryDate.toISOString().split('T')[0],
    });

    await couponDAO.decreaseStock(couponId);

    return res.json(successResponse({ message: '领取成功' }));
  } catch (error: unknown) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 4. 获取我的优惠券列表
 * GET /api/v1/coupons/my
 */
router.get('/my', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown).user.id;
    const { status, page = 1, pageSize = 10 } = req.query;

    const result = await userCouponDAO.getUserCoupons(
      userId,
      status as string,
      Number(page),
      Number(pageSize)
    );

    res.json(successResponse({
      list: result.list,
      total: result.total,
      page: result.page,
      pageSize: result.limit,
    }));
  } catch (error: unknown) {
    res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 5. 获取可用优惠券
 * GET /api/v1/coupons/available
 */
router.get('/available', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown).user.id;

    const result = await userCouponDAO.getUserCoupons(userId, 'unused', 1, 100);

    res.json(successResponse(result.list));
  } catch (error: unknown) {
    res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 6. 分享优惠券
 * POST /api/v1/coupons/:id/share
 */
router.post('/:id/share', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const shareUrl = `https://example.com/coupon/${id}`;
    const shareCode = `SHARE${id}`;
    res.json(successResponse({ shareUrl, shareCode }));
  } catch (error: unknown) {
    res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 7. 获取优惠券分类
 * GET /api/v1/coupons/categories
 */
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = [
      { id: 'all', name: '全部' },
      { id: 'discount', name: '满减券' },
      { id: 'rate', name: '折扣券' },
      { id: 'daily', name: '日租抵扣' },
      { id: 'service', name: '服务费减免' },
      { id: 'special', name: '特殊券种' },
    ];
    res.json(successResponse(categories));
  } catch (error: unknown) {
    res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 8. 检查优惠券可用性
 * POST /api/v1/coupons/check-availability
 */
router.post('/check-availability', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const available = true;
    const reason = '';
    res.json(successResponse({ available, reason }));
  } catch (error: unknown) {
    res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 9. 生成邀请码
 * POST /api/v1/invite/generate-code
 */
router.post('/invite/generate-code', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown).user.id;
    const inviteCode = await inviteCodeDAO.getUserInviteCode(userId);

    if (!inviteCode) {
      const code = await inviteCodeDAO.generateInviteCode(userId);
      const inviteUrl = `https://example.com/invite/${code}`;
      res.json(successResponse({ inviteCode: code, inviteUrl }));
    } else {
      const inviteUrl = `https://example.com/invite/${inviteCode.invite_code}`;
      res.json(successResponse({ inviteCode: inviteCode.invite_code, inviteUrl }));
    }
  } catch (error: unknown) {
    res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 10. 获取邀请统计
 * GET /api/v1/invite/stats
 */
router.get('/invite/stats', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown).user.id;
    const stats = await inviteCodeDAO.getInviteStats(userId);
    res.json(successResponse(stats));
  } catch (error: unknown) {
    res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 11. 获取邀请记录
 * GET /api/v1/invite/records
 */
router.get('/invite/records', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown).user.id;
    const { page = 1, pageSize = 10 } = req.query;

    const result = await inviteRecordDAO.getInviteRecords(
      userId,
      Number(page),
      Number(pageSize)
    );

    res.json(successResponse({
      list: result.list,
      total: result.total,
      page: result.page,
      pageSize: result.limit,
    }));
  } catch (error: unknown) {
    res.status(500).json(errorResponse(error.message));
  }
});

export default router;
