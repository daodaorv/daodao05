import { Router, Request, Response } from 'express';
import { TourDAO } from '@dao/tour.dao';
import { successResponse, errorResponse, paginatedResponse } from '@utils/response';
import { logger } from '@utils/logger';
import { TourQueryParams } from '../../types/models/tour.types';

const router = Router();
const tourDAO = new TourDAO();

/**
 * 获取热门旅游线路
 * GET /api/v1/tours/hot
 */
router.get('/hot', async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json(successResponse([]));
  } catch (error) {
    logger.error('获取热门旅游线路失败:', error);
    res.status(500).json(errorResponse('获取热门旅游线路失败'));
  }
});

/**
 * 获取推荐旅游线路
 * GET /api/v1/tours/recommended
 */
router.get('/recommended', async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json(successResponse([]));
  } catch (error) {
    logger.error('获取推荐旅游线路失败:', error);
    res.status(500).json(errorResponse('获取推荐旅游线路失败'));
  }
});

/**
 * 计算旅游预订价格
 * POST /api/v1/tours/calculate-price
 */
router.post('/calculate-price', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tourId, batchId, adults, children } = req.body;

    if (!tourId || !batchId || !adults) {
      res.status(400).json(errorResponse('缺少必要参数', 400));
      return undefined;
    }

    const adultFee = 4980 * adults;
    const childFee = children ? 2490 * children : 0;
    const insuranceFee = (adults + (children || 0)) * 50;
    const totalPrice = adultFee + childFee + insuranceFee;

    res.json(successResponse({
      adultFee,
      childFee,
      insuranceFee,
      totalPrice,
      breakdown: [
        { name: '成人费用', amount: adultFee, description: `¥4980 × ${adults}人` },
        ...(children ? [{ name: '儿童费用', amount: childFee, description: `¥2490 × ${children}人` }] : []),
        { name: '保险费用', amount: insuranceFee, description: `¥50 × ${adults + (children || 0)}人` },
      ],
    }));
  } catch (error) {
    logger.error('计算旅游预订价格失败:', error);
    res.status(500).json(errorResponse('计算旅游预订价格失败'));
  }
});

/**
 * 检查批次可用性
 * POST /api/v1/tours/check-availability
 */
router.post('/check-availability', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tourId, batchId, people } = req.body;

    if (!tourId || !batchId || !people) {
      res.status(400).json(errorResponse('缺少必要参数', 400));
      return undefined;
    }

    res.json(successResponse({
      available: true,
      remainingSeats: 4,
      message: '该批次还有4个名额',
    }));
  } catch (error) {
    logger.error('检查批次可用性失败:', error);
    res.status(500).json(errorResponse('检查批次可用性失败'));
  }
});

/**
 * 创建旅游预订订单
 * POST /api/v1/tours/bookings
 */
router.post('/bookings', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tourId, batchId, adults, contactName, contactPhone, idCard, emergencyContact, emergencyPhone } = req.body;

    if (!tourId || !batchId || !adults || !contactName || !contactPhone || !idCard || !emergencyContact || !emergencyPhone) {
      res.status(400).json(errorResponse('缺少必要参数', 400));
      return undefined;
    }

    const orderNo = `TR${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    res.json(successResponse({
      orderId: `TB${Date.now()}`,
      orderNo,
      status: 'PENDING_PAYMENT',
      totalPrice: 12450,
      paymentDeadline: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    }));
  } catch (error) {
    logger.error('创建旅游预订订单失败:', error);
    res.status(500).json(errorResponse('创建旅游预订订单失败'));
  }
});

/**
 * 获取旅游线路列表
 * GET /api/v1/tours
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const params: TourQueryParams = {
      page: req.query.page ? Number(req.query.page) : 1,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : 20,
      duration: req.query.duration as string,
      price: req.query.price as string,
      status: req.query.status as string,
      keyword: req.query.keyword as string,
    };

    const result = await tourDAO.findTours(params);
    res.json(paginatedResponse(result.list, result.total, params.page || 1, params.pageSize || 20));
  } catch (error) {
    logger.error('获取旅游线路列表失败:', error);
    res.status(500).json(errorResponse('获取旅游线路列表失败'));
  }
});

/**
 * 获取旅游线路详情
 * GET /api/v1/tours/:id
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const tour = await tourDAO.findTourDetail(id);

    if (!tour) {
      res.status(404).json(errorResponse('旅游线路不存在', 404));
      return undefined;
    }

    res.json(successResponse(tour));
  } catch (error) {
    logger.error('获取旅游线路详情失败:', error);
    res.status(500).json(errorResponse('获取旅游线路详情失败'));
  }
});

/**
 * 获取批次列表
 * GET /api/v1/tours/:id/batches
 */
router.get('/:id/batches', async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json(successResponse([]));
  } catch (error) {
    logger.error('获取批次列表失败:', error);
    res.status(500).json(errorResponse('获取批次列表失败'));
  }
});

export default router;
