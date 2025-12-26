import { Router, Request, Response } from 'express';
import { SpecialOfferDAO } from '@dao/special-offer.dao';
import { successResponse, errorResponse, paginatedResponse } from '@utils/response';
import { logger } from '@utils/logger';
import { SpecialOfferQueryParams } from '../../types/models/special-offer.types';

const router = Router();
const specialOfferDAO = new SpecialOfferDAO();

/**
 * 获取特惠套餐列表
 * GET /api/v1/special-offers
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const params: SpecialOfferQueryParams = {
      route: req.query.route as string,
      priceRange: req.query.priceRange as string,
      sortBy: req.query.sortBy as 'price-asc' | 'price-desc' | 'quota' | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };

    const result = await specialOfferDAO.findSpecialOffers(params);

    res.json(
      paginatedResponse(result.list, result.total, params.page || 1, params.limit || 20)
    );
  } catch (error) {
    logger.error('获取特惠套餐列表失败:', error);
    res.status(500).json(errorResponse('获取特惠套餐列表失败'));
  }
});

/**
 * 获取特惠套餐详情
 * GET /api/v1/special-offers/:id
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const offer = await specialOfferDAO.findSpecialOfferDetail(id);

    if (!offer) {
      res.status(404).json(errorResponse('特惠套餐不存在', 404));
      return;
    }

    res.json(successResponse(offer));
  } catch (error) {
    logger.error('获取特惠套餐详情失败:', error);
    res.status(500).json(errorResponse('获取特惠套餐详情失败'));
  }
});

/**
 * 计算特惠套餐价格
 * POST /api/v1/special-offers/calculate-price
 */
router.post('/calculate-price', async (req: Request, res: Response): Promise<void> => {
  try {
    const { offerId, pickupDate, insuranceType, selectedServices, couponCode } = req.body;

    if (!offerId || !pickupDate || !insuranceType) {
      res.status(400).json(errorResponse('缺少必要参数', 400));
      return;
    }

    // 获取套餐信息
    const offer = await specialOfferDAO.findById(Number(offerId));
    if (!offer) {
      res.status(404).json(errorResponse('特惠套餐不存在', 404));
      return;
    }

    // 计算价格
    const packageFee = offer.package_price;
    const insuranceFee = insuranceType === 'standard' ? 80 : insuranceType === 'premium' ? 150 : 0;
    const serviceFee = selectedServices ? selectedServices.length * 50 : 0;
    const discount = couponCode ? 100 : 0;
    const totalAmount = packageFee + insuranceFee + serviceFee - discount;

    res.json(
      successResponse({
        packageFee,
        insuranceFee,
        serviceFee,
        discount,
        totalAmount,
        breakdown: [
          {
            name: '套餐费用',
            amount: packageFee,
            description: `${offer.route_from}→${offer.route_to} ${offer.rental_days}天`,
          },
          {
            name: '保险费用',
            amount: insuranceFee,
            description: insuranceType === 'standard' ? '标准险' : '豪华险',
          },
          ...(serviceFee > 0
            ? [
                {
                  name: '增值服务',
                  amount: serviceFee,
                  description: `${selectedServices?.length || 0}项服务`,
                },
              ]
            : []),
          ...(discount > 0
            ? [
                {
                  name: '优惠券',
                  amount: -discount,
                  description: couponCode,
                },
              ]
            : []),
        ],
      })
    );
  } catch (error) {
    logger.error('计算特惠套餐价格失败:', error);
    res.status(500).json(errorResponse('计算特惠套餐价格失败'));
  }
});

/**
 * 检查套餐可用性
 * GET /api/v1/special-offers/:id/availability
 */
router.get('/:id/availability', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const pickupDate = req.query.pickupDate as string;

    if (!pickupDate) {
      res.status(400).json(errorResponse('缺少取车日期参数', 400));
      return;
    }

    const isAvailable = await specialOfferDAO.checkAvailability(id, pickupDate);
    const offer = await specialOfferDAO.findById(id);

    res.json(
      successResponse({
        available: isAvailable,
        remainingQuota: offer?.remaining_quota || 0,
        message: isAvailable ? '该日期可预订' : '该日期不可预订',
      })
    );
  } catch (error) {
    logger.error('检查套餐可用性失败:', error);
    res.status(500).json(errorResponse('检查套餐可用性失败'));
  }
});

/**
 * 创建特惠套餐订单
 * POST /api/v1/special-offers/orders
 */
router.post('/orders', async (req: Request, res: Response): Promise<void> => {
  try {
    const { offerId, pickupDate, insuranceType, contactInfo } = req.body;

    if (!offerId || !pickupDate || !insuranceType || !contactInfo) {
      res.status(400).json(errorResponse('缺少必要参数', 400));
      return;
    }

    // 检查套餐可用性
    const isAvailable = await specialOfferDAO.checkAvailability(Number(offerId), pickupDate);
    if (!isAvailable) {
      res.status(400).json(errorResponse('该套餐在所选日期不可用', 400));
      return;
    }

    // TODO: 创建订单逻辑（需要订单DAO）
    // 这里返回Mock数据
    const orderNo = `DD${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    res.json(
      successResponse({
        orderId: `SO${Date.now()}`,
        orderNo,
        status: 'PENDING_PAYMENT',
        amount: {
          packageFee: 1280,
          insuranceFee: 80,
          serviceFee: 50,
          discount: 100,
          totalAmount: 1310,
        },
        returnTime: new Date(new Date(pickupDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        expireTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      })
    );
  } catch (error) {
    logger.error('创建特惠套餐订单失败:', error);
    res.status(500).json(errorResponse('创建特惠套餐订单失败'));
  }
});

export default router;
