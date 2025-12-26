/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from 'express';
import { HostingDAO } from '../../dao/hosting.dao';
import { HostingApplicationDAO } from '../../dao/hosting-application.dao';
import { HostingIncomeDAO } from '../../dao/hosting-income.dao';
import { HostingWithdrawalDAO } from '../../dao/hosting-withdrawal.dao';
import { successResponse, errorResponse } from '../../utils/response';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const hostingDAO = new HostingDAO();
const applicationDAO = new HostingApplicationDAO();
const incomeDAO = new HostingIncomeDAO();
const withdrawalDAO = new HostingWithdrawalDAO();

/**
 * 1. 获取托管收益
 * GET /api/v1/hosting/income
 */
router.get('/income', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const stats = await hostingDAO.getIncomeStats(userId);
    res.json(successResponse(stats));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 2. 获取托管车辆列表
 * GET /api/v1/hosting/vehicles
 */
router.get('/vehicles', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const result = await hostingDAO.getUserVehicles(
      userId,
      status as string,
      Number(page),
      Number(limit)
    );

    res.json(successResponse({
      list: result.list,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    }));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 3. 提交自有车托管申请
 * POST /api/v1/hosting/old-car/apply
 */
router.post('/old-car/apply', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { vehicleInfo, photos, ownerInfo, storeId } = req.body;

    const result = await applicationDAO.createApplication({
      userId,
      applicationType: 'own_car',
      vehicleInfo,
      photos,
      ownerInfo,
      storeId,
    });

    res.json(successResponse({
      applicationId: result,
      status: 'pending',
      estimatedReviewTime: '1-3个工作日',
    }));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 4. 提交购车托管申请
 * POST /api/v1/hosting/new-car/apply
 */
router.post('/new-car/apply', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { modelId, installmentPeriod, applicantInfo } = req.body;

    const result = await applicationDAO.createApplication({
      userId,
      applicationType: 'new_car',
      vehicleInfo: { modelId, installmentPeriod },
      ownerInfo: applicantInfo,
    });

    res.json(successResponse({
      applicationId: result,
      status: 'pending',
      estimatedReviewTime: '3-5个工作日',
    }));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 5. 申请车主自用
 * POST /api/v1/hosting/self-use/apply
 */
router.post('/self-use/apply', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { vehicleId, pickupStoreId, returnStoreId, pickupTime, returnTime, additionalServices } = req.body;

    const result = await applicationDAO.createApplication({
      userId,
      applicationType: 'self_use',
      vehicleInfo: { vehicleId, pickupStoreId, returnStoreId },
      pickupTime,
      returnTime,
      additionalServices,
    });

    res.json(successResponse({
      orderId: result,
      status: 'pending',
      totalFee: 500.00,
      serviceFee: 300.00,
      crossCityFee: 200.00,
    }));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 6. 获取收益明细
 * GET /api/v1/hosting/income/detail
 */
router.get('/income/detail', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { vehicleId, startDate, endDate, page = 1, limit = 20 } = req.query;

    const result = await incomeDAO.getIncomeDetails(userId, {
      vehicleId: vehicleId ? Number(vehicleId) : undefined,
      startDate: startDate as string,
      endDate: endDate as string,
      page: Number(page),
      limit: Number(limit),
    });

    res.json(successResponse({
      list: result.list,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    }));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 7. 提现
 * POST /api/v1/hosting/withdraw
 */
router.post('/withdraw', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { amount, bankAccount, bankName, accountName } = req.body;

    // 计算手续费（示例：1%）
    const fee = amount * 0.01;
    const actualAmount = amount - fee;

    const result = await withdrawalDAO.createWithdrawal({
      userId,
      amount,
      fee,
      actualAmount,
      bankAccount,
      bankName,
      accountName,
    });

    res.json(successResponse({
      withdrawalId: result,
      status: 'pending',
      amount,
      fee,
      actualAmount,
    }));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 8. 获取提现记录
 * GET /api/v1/hosting/withdraw/records
 */
router.get('/withdraw/records', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { page = 1, limit = 20 } = req.query;

    const result = await withdrawalDAO.getWithdrawals(userId, Number(page), Number(limit));

    res.json(successResponse({
      list: result.list,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    }));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 9. 获取托管协议
 * GET /api/v1/hosting/agreement
 */
router.get('/agreement', authMiddleware, async (_req: Request, res: Response) => {
  try {
    // Mock 托管协议内容
    const agreement = {
      title: '叨叨房车托管服务协议',
      version: '1.0',
      content: '本协议是您与叨叨房车之间关于房车托管服务的法律协议...',
      sections: [
        { title: '第一条 服务内容', content: '...' },
        { title: '第二条 双方权利义务', content: '...' },
        { title: '第三条 收益分配', content: '...' },
      ],
    };

    res.json(successResponse(agreement));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 10. 获取托管统计
 * GET /api/v1/hosting/statistics
 */
router.get('/statistics', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // 获取托管车辆数量
    const vehicles = await hostingDAO.getUserVehicles(userId, undefined, 1, 1000);

    // 获取收益统计
    const incomeStats = await hostingDAO.getIncomeStats(userId);

    res.json(successResponse({
      totalVehicles: vehicles.total,
      operatingVehicles: vehicles.list.filter((v: any) => v.status === 'operating').length,
      totalIncome: incomeStats.totalIncome,
      monthIncome: incomeStats.monthIncome,
      availableBalance: incomeStats.availableBalance,
    }));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
});

export default router;
