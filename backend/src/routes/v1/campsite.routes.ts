import { Router, Request, Response } from 'express';
import { CampsiteDAO } from '@dao/campsite.dao';
import { successResponse, errorResponse, paginatedResponse } from '@utils/response';
import { logger } from '@utils/logger';
import { CampsiteQueryParams } from '../../types/models/campsite.types';

const router = Router();
const campsiteDAO = new CampsiteDAO();

/**
 * 获取附近营地
 * GET /api/v1/campsites/nearby
 */
router.get('/nearby', async (req: Request, res: Response): Promise<void> => {
  try {
    const latitude = req.query.latitude ? Number(req.query.latitude) : undefined;
    const longitude = req.query.longitude ? Number(req.query.longitude) : undefined;

    if (!latitude || !longitude) {
      res.status(400).json(errorResponse('缺少经纬度参数', 400));
      return;
    }

    // Mock附近营地数据
    res.json(successResponse([]));
  } catch (error) {
    logger.error('获取附近营地失败:', error);
    res.status(500).json(errorResponse('获取附近营地失败'));
  }
});

/**
 * 获取热门营地
 * GET /api/v1/campsites/hot
 */
router.get('/hot', async (_req: Request, res: Response): Promise<void> => {
  try {
    // Mock热门营地数据
    res.json(successResponse([]));
  } catch (error) {
    logger.error('获取热门营地失败:', error);
    res.status(500).json(errorResponse('获取热门营地失败'));
  }
});

/**
 * 检查营位可用性
 * POST /api/v1/campsites/check-availability
 */
router.post('/check-availability', async (req: Request, res: Response): Promise<void> => {
  try {
    const { campsiteId, siteTypeId, checkInDate, checkOutDate } = req.body;

    if (!campsiteId || !siteTypeId || !checkInDate || !checkOutDate) {
      res.status(400).json(errorResponse('缺少必要参数', 400));
      return;
    }

    res.json(successResponse({ available: true, remainingCount: 8, message: '该时间段可预订' }));
  } catch (error) {
    logger.error('检查营位可用性失败:', error);
    res.status(500).json(errorResponse('检查营位可用性失败'));
  }
});

/**
 * 创建营地预订订单
 * POST /api/v1/campsites/bookings
 */
router.post('/bookings', async (req: Request, res: Response): Promise<void> => {
  try {
    const { campsiteId, siteTypeId, checkInDate, checkOutDate, guests, contactName, contactPhone } = req.body;

    if (!campsiteId || !siteTypeId || !checkInDate || !checkOutDate || !guests || !contactName || !contactPhone) {
      res.status(400).json(errorResponse('缺少必要参数', 400));
      return;
    }

    const orderNo = `CS${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    res.json(successResponse({
      orderId: `CB${Date.now()}`,
      orderNo,
      status: 'PENDING_PAYMENT',
      totalPrice: 610,
      paymentDeadline: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    }));
  } catch (error) {
    logger.error('创建营地预订订单失败:', error);
    res.status(500).json(errorResponse('创建营地预订订单失败'));
  }
});

/**
 * 获取营地列表
 * GET /api/v1/campsites
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const params: CampsiteQueryParams = {
      page: req.query.page ? Number(req.query.page) : 1,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : 20,
      distance: req.query.distance as string,
      price: req.query.price as string,
      type: req.query.type as string,
      keyword: req.query.keyword as string,
      latitude: req.query.latitude ? Number(req.query.latitude) : undefined,
      longitude: req.query.longitude ? Number(req.query.longitude) : undefined,
    };

    const result = await campsiteDAO.findCampsites(params);
    res.json(paginatedResponse(result.list, result.total, params.page || 1, params.pageSize || 20));
  } catch (error) {
    logger.error('获取营地列表失败:', error);
    res.status(500).json(errorResponse('获取营地列表失败'));
  }
});

/**
 * 获取营地详情
 * GET /api/v1/campsites/:id
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const campsite = await campsiteDAO.findCampsiteDetail(id);

    if (!campsite) {
      res.status(404).json(errorResponse('营地不存在', 404));
      return;
    }

    res.json(successResponse(campsite));
  } catch (error) {
    logger.error('获取营地详情失败:', error);
    res.status(500).json(errorResponse('获取营地详情失败'));
  }
});

/**
 * 获取营地评价列表
 * GET /api/v1/campsites/:id/reviews
 */
router.get('/:id/reviews', async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json(successResponse({ list: [], total: 0, hasMore: false }));
  } catch (error) {
    logger.error('获取营地评价列表失败:', error);
    res.status(500).json(errorResponse('获取营地评价列表失败'));
  }
});

export default router;
