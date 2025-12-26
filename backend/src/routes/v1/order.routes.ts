import { Router, Request, Response } from 'express';
import { OrderDAO } from '@dao/order.dao';
import { successResponse, errorResponse, paginatedResponse } from '@utils/response';
import { logger } from '@utils/logger';
import { OrderQueryParams, CreateOrderParams, CancelOrderParams } from '../../types/models/order.types';

const router = Router();
const orderDAO = new OrderDAO();

/**
 * 创建订单
 * POST /api/v1/orders
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const params: CreateOrderParams = {
      user_id: req.body.user_id,
      vehicle_id: req.body.vehicle_id,
      store_id: req.body.store_id,
      return_store_id: req.body.return_store_id,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      remark: req.body.remark,
    };

    // 验证必填参数
    if (!params.user_id || !params.vehicle_id || !params.store_id || !params.start_date || !params.end_date) {
      res.status(400).json(errorResponse('缺少必要参数', 400));
      return;
    }

    const order = await orderDAO.createOrder(params);
    res.status(201).json(successResponse(order));
  } catch (error: any) {
    logger.error('创建订单失败:', error);
    res.status(500).json(errorResponse(error.message || '创建订单失败'));
  }
});

/**
 * 获取订单列表
 * GET /api/v1/orders
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const params: OrderQueryParams = {
      user_id: req.query.user_id ? Number(req.query.user_id) : undefined,
      status: req.query.status as any,
      payment_status: req.query.payment_status as any,
      start_date: req.query.start_date as string,
      end_date: req.query.end_date as string,
      page: req.query.page ? Number(req.query.page) : 1,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
    };

    const result = await orderDAO.findOrders(params);
    res.json(paginatedResponse(result.list, result.total, params.page || 1, params.pageSize || 10));
  } catch (error) {
    logger.error('获取订单列表失败:', error);
    res.status(500).json(errorResponse('获取订单列表失败'));
  }
});

/**
 * 获取订单详情
 * GET /api/v1/orders/:id
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const order = await orderDAO.findOrderDetail(id);

    if (!order) {
      res.status(404).json(errorResponse('订单不存在', 404));
      return;
    }

    res.json(successResponse(order));
  } catch (error) {
    logger.error('获取订单详情失败:', error);
    res.status(500).json(errorResponse('获取订单详情失败'));
  }
});

/**
 * 取消订单
 * POST /api/v1/orders/:id/cancel
 */
router.post('/:id/cancel', async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = Number(req.params.id);
    const { cancel_reason, cancelled_by } = req.body;

    if (!cancel_reason || !cancelled_by) {
      res.status(400).json(errorResponse('缺少必要参数', 400));
      return;
    }

    const params: CancelOrderParams = {
      order_id: orderId,
      cancel_reason,
      cancelled_by,
    };

    const success = await orderDAO.cancelOrder(params);

    if (!success) {
      res.status(400).json(errorResponse('订单取消失败,订单可能不存在或状态不允许取消', 400));
      return;
    }

    res.json(successResponse({ message: '订单已取消' }));
  } catch (error) {
    logger.error('取消订单失败:', error);
    res.status(500).json(errorResponse('取消订单失败'));
  }
});

export default router;
