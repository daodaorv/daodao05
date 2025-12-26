/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from 'express';
import { OrderDAO } from '@dao/order.dao';
import { successResponse, errorResponse, paginatedResponse } from '@utils/response';
import { logger } from '@utils/logger';
import { OrderQueryParams, CreateOrderParams, CancelOrderParams, OrderStatus, PaymentStatus } from '../../types/models/order.types';

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
      return undefined;
    }

    const order = await orderDAO.createOrder(params);
    res.status(201).json(successResponse(order));
  } catch (error: any) {
    logger.error('创建订单失败:', error);
    const errorMessage = error instanceof Error ? error.message : '创建订单失败';
    res.status(500).json(errorResponse(errorMessage));
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
      status: req.query.status as OrderStatus | undefined,
      payment_status: req.query.payment_status as PaymentStatus | undefined,
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
 * 获取订单状态列表
 * GET /api/v1/orders/statuses
 * 注意：必须放在 /:id 路由之前，避免被匹配为动态参数
 */
router.get('/statuses', async (_req: Request, res: Response): Promise<void> => {
  try {
    const statuses = [
      { value: 'pending', label: '待支付', description: '订单已创建，等待支付' },
      { value: 'paid', label: '已支付', description: '订单已支付，等待确认' },
      { value: 'confirmed', label: '已确认', description: '订单已确认，等待取车' },
      { value: 'picked_up', label: '已取车', description: '车辆已取走，租赁中' },
      { value: 'returned', label: '已还车', description: '车辆已归还，等待验收' },
      { value: 'completed', label: '已完成', description: '订单已完成' },
      { value: 'cancelled', label: '已取消', description: '订单已取消' },
    ];

    res.json(successResponse(statuses));
  } catch (error) {
    logger.error('获取订单状态列表失败:', error);
    res.status(500).json(errorResponse('获取订单状态列表失败'));
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
      return undefined;
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
      return undefined;
    }

    const params: CancelOrderParams = {
      order_id: orderId,
      cancel_reason,
      cancelled_by,
    };

    const success = await orderDAO.cancelOrder(params);

    if (!success) {
      res.status(400).json(errorResponse('订单取消失败,订单可能不存在或状态不允许取消', 400));
      return undefined;
    }

    res.json(successResponse({ message: '订单已取消' }));
  } catch (error) {
    logger.error('取消订单失败:', error);
    res.status(500).json(errorResponse('取消订单失败'));
  }
});

/**
 * 计算订单价格
 * POST /api/v1/orders/calculate-price
 */
router.post('/calculate-price', async (req: Request, res: Response): Promise<void> => {
  try {
    const { vehicleId, startDate, endDate, services, couponCode } = req.body;

    if (!vehicleId || !startDate || !endDate) {
      res.status(400).json(errorResponse('缺少必要参数', 400));
      return undefined;
    }

    // 计算租赁天数
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      res.status(400).json(errorResponse('结束日期必须大于开始日期', 400));
      return undefined;
    }

    // 获取车辆价格信息
    const vehicle = await orderDAO.getVehiclePrice(vehicleId);
    if (!vehicle) {
      res.status(404).json(errorResponse('车辆不存在', 404));
      return undefined;
    }

    // 计算租金
    const rentalFee = vehicle.daily_price * days;

    // 计算服务费
    let serviceFee = 0;
    if (services && Array.isArray(services)) {
      serviceFee = services.reduce((sum: number, service: any) => {
        const price = (service as { price?: number }).price || 0;
        return sum + price;
      }, 0);
    }

    // 计算优惠券抵扣 (TODO: 实现优惠券逻辑)
    let discount = 0;
    if (couponCode) {
      // 优惠券逻辑待实现
      discount = 0;
    }

    // 计算总价
    const subtotal = rentalFee + serviceFee;
    const totalAmount = subtotal - discount;

    res.json(
      successResponse({
        vehicleId,
        days,
        rentalFee,
        serviceFee,
        discount,
        subtotal,
        totalAmount,
        deposit: vehicle.deposit,
      })
    );
  } catch (error) {
    logger.error('计算订单价格失败:', error);
    res.status(500).json(errorResponse('计算订单价格失败'));
  }
});

/**
 * 获取订单状态列表
 * GET /api/v1/orders/statuses
 */
router.get('/statuses', async (_req: Request, res: Response): Promise<void> => {
  try {
    const statuses = [
      { value: 'pending', label: '待支付', description: '订单已创建，等待支付' },
      { value: 'paid', label: '已支付', description: '订单已支付，等待确认' },
      { value: 'confirmed', label: '已确认', description: '订单已确认，等待取车' },
      { value: 'picked_up', label: '已取车', description: '车辆已取走，租赁中' },
      { value: 'returned', label: '已还车', description: '车辆已归还，等待验收' },
      { value: 'completed', label: '已完成', description: '订单已完成' },
      { value: 'cancelled', label: '已取消', description: '订单已取消' },
    ];

    res.json(successResponse(statuses));
  } catch (error) {
    logger.error('获取订单状态列表失败:', error);
    res.status(500).json(errorResponse('获取订单状态列表失败'));
  }
});

/**
 * 删除订单
 * DELETE /api/v1/orders/:id
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = Number(req.params.id);

    // 获取订单信息
    const order = await orderDAO.findById(orderId);
    if (!order) {
      res.status(404).json(errorResponse('订单不存在', 404));
      return undefined;
    }

    // 只允许删除已取消或已完成的订单
    if (order.status !== 'cancelled' && order.status !== 'completed') {
      res.status(400).json(errorResponse('只能删除已取消或已完成的订单', 400));
      return undefined;
    }

    // 删除订单
    const result = await orderDAO.delete(orderId);
    if (result === 0) {
      res.status(500).json(errorResponse('删除订单失败', 500));
      return undefined;
    }

    res.json(successResponse({ message: '订单已删除' }));
  } catch (error) {
    logger.error('删除订单失败:', error);
    res.status(500).json(errorResponse('删除订单失败'));
  }
});

/**
 * 更新订单状态
 * PUT /api/v1/orders/:id/status
 */
router.put('/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = Number(req.params.id);
    const { status, remark } = req.body;

    if (!status) {
      res.status(400).json(errorResponse('缺少必要参数', 400));
      return undefined;
    }

    // 验证状态值
    const validStatuses: OrderStatus[] = ['pending', 'paid', 'confirmed', 'picked_up', 'returned', 'completed', 'cancelled'];
    if (!validStatuses.includes(status as OrderStatus)) {
      res.status(400).json(errorResponse('无效的订单状态', 400));
      return undefined;
    }

    // 获取订单信息
    const order = await orderDAO.findById(orderId);
    if (!order) {
      res.status(404).json(errorResponse('订单不存在', 404));
      return undefined;
    }

    // 更新订单状态
    const success = await orderDAO.updateOrderStatus(orderId, status as OrderStatus, remark);
    if (!success) {
      res.status(500).json(errorResponse('更新订单状态失败', 500));
      return undefined;
    }

    res.json(successResponse({ message: '订单状态已更新', status }));
  } catch (error) {
    logger.error('更新订单状态失败:', error);
    res.status(500).json(errorResponse('更新订单状态失败'));
  }
});

export default router;
