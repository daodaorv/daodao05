import { Router, Request, Response } from 'express';
import { PaymentDAO } from '@dao/payment.dao';
import { successResponse, errorResponse } from '@utils/response';
import { logger } from '@utils/logger';
import { CreatePaymentParams } from '../../types/models/payment.types';

const router = Router();
const paymentDAO = new PaymentDAO();

/**
 * 创建支付
 * POST /api/v1/payments
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const params: CreatePaymentParams = {
      order_id: req.body.order_id,
      user_id: req.body.user_id,
      type: req.body.type || 'order',
      amount: req.body.amount,
      method: req.body.method,
      remark: req.body.remark,
    };

    // 验证必填参数
    if (!params.order_id || !params.user_id || !params.amount || !params.method) {
      res.status(400).json(errorResponse('缺少必要参数', 400));
      return;
    }

    const payment = await paymentDAO.createPayment(params);
    res.status(201).json(successResponse(payment));
  } catch (error: any) {
    logger.error('创建支付失败:', error);
    res.status(500).json(errorResponse(error.message || '创建支付失败'));
  }
});

/**
 * 查询支付状态
 * GET /api/v1/payments/order/:orderId
 */
router.get('/order/:orderId', async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = Number(req.params.orderId);
    const payment = await paymentDAO.findByOrderId(orderId);

    if (!payment) {
      res.status(404).json(errorResponse('支付记录不存在', 404));
      return;
    }

    res.json(successResponse(payment));
  } catch (error) {
    logger.error('查询支付状态失败:', error);
    res.status(500).json(errorResponse('查询支付状态失败'));
  }
});

export default router;
