import { Router, Request, Response } from 'express';
import { VehicleDAO } from '@dao/vehicle.dao';
import { successResponse, errorResponse, paginatedResponse } from '@utils/response';
import { logger } from '@utils/logger';
import { VehicleQueryParams } from '../../types/models/vehicle.types';

const router = Router();
const vehicleDAO = new VehicleDAO();

/**
 * 获取车辆列表
 * GET /api/v1/vehicles
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const params: VehicleQueryParams = {
      cityId: req.query.cityId as string,
      storeId: req.query.storeId ? Number(req.query.storeId) : undefined,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      vehicleType: req.query.vehicleType as any,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      seats: req.query.seats ? Number(req.query.seats) : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
    };

    const result = await vehicleDAO.findVehicles(params);

    res.json(
      paginatedResponse(result.list, result.total, params.page || 1, params.pageSize || 10)
    );
  } catch (error) {
    logger.error('获取车辆列表失败:', error);
    res.status(500).json(errorResponse('获取车辆列表失败'));
  }
});

/**
 * 获取推荐车辆
 * GET /api/v1/vehicles/recommended
 */
router.get('/recommended', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const vehicles = await vehicleDAO.findRecommendedVehicles(limit);

    res.json(successResponse(vehicles));
  } catch (error) {
    logger.error('获取推荐车辆失败:', error);
    res.status(500).json(errorResponse('获取推荐车辆失败'));
  }
});

/**
 * 获取车辆详情
 * GET /api/v1/vehicles/:id
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const vehicle = await vehicleDAO.findVehicleDetail(id);

    if (!vehicle) {
      res.status(404).json(errorResponse('车辆不存在', 404));
      return;
    }

    res.json(successResponse(vehicle));
  } catch (error) {
    logger.error('获取车辆详情失败:', error);
    res.status(500).json(errorResponse('获取车辆详情失败'));
  }
});

/**
 * 检查车辆可用性
 * POST /api/v1/vehicles/:id/check-availability
 */
router.post('/:id/check-availability', async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicleId = Number(req.params.id);
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      res.status(400).json(errorResponse('缺少必要参数', 400));
      return;
    }

    const isAvailable = await vehicleDAO.checkAvailability(vehicleId, startDate, endDate);

    res.json(
      successResponse({
        vehicleId,
        startDate,
        endDate,
        available: isAvailable,
      })
    );
  } catch (error) {
    logger.error('检查车辆可用性失败:', error);
    res.status(500).json(errorResponse('检查车辆可用性失败'));
  }
});

/**
 * 计算车辆租赁价格
 * POST /api/v1/vehicles/:id/calculate-price
 */
router.post('/:id/calculate-price', async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicleId = Number(req.params.id);
    const { startDate, endDate, couponCode } = req.body;

    if (!startDate || !endDate) {
      res.status(400).json(errorResponse('缺少必要参数', 400));
      return;
    }

    // 获取车辆信息
    const vehicle = await vehicleDAO.findById(vehicleId);
    if (!vehicle) {
      res.status(404).json(errorResponse('车辆不存在', 404));
      return;
    }

    // 计算天数
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      res.status(400).json(errorResponse('结束日期必须大于开始日期', 400));
      return;
    }

    // 计算价格
    const dailyPrice = vehicle.daily_price;
    const subtotal = dailyPrice * days;
    let discountAmount = 0;

    // TODO: 如果有优惠券,计算优惠金额
    if (couponCode) {
      // 优惠券逻辑待实现
    }

    const totalAmount = subtotal - discountAmount;

    res.json(
      successResponse({
        vehicleId,
        days,
        dailyPrice,
        subtotal,
        discountAmount,
        totalAmount,
        deposit: vehicle.deposit,
      })
    );
  } catch (error) {
    logger.error('计算车辆价格失败:', error);
    res.status(500).json(errorResponse('计算车辆价格失败'));
  }
});

export default router;
