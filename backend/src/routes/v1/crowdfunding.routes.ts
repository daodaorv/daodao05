/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from 'express';
import { CrowdfundingModelDAO } from '../../dao/crowdfunding-model.dao';
import { CrowdfundingProjectDAO } from '../../dao/crowdfunding-project.dao';
import { CrowdfundingShareDAO } from '../../dao/crowdfunding-share.dao';
import { successResponse, errorResponse } from '../../utils/response';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const modelDAO = new CrowdfundingModelDAO();
const projectDAO = new CrowdfundingProjectDAO();
const shareDAO = new CrowdfundingShareDAO();

/**
 * 1. 获取众筹推荐车型列表
 * GET /api/v1/crowdfunding/models
 */
router.get('/models', async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const result = await modelDAO.getModels(Number(page), Number(pageSize));
    return res.json(successResponse({
      list: result.list,
      total: result.total,
      page: result.page,
      pageSize: result.limit,
      hasMore: result.page * result.limit < result.total,
    }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 2. 获取众筹车型详情
 * GET /api/v1/crowdfunding/models/:id
 */
router.get('/models/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const model = await modelDAO.getModelById(Number(id));
    if (!model) {
      return res.status(404).json(errorResponse('车型不存在'));
    }
    return res.json(successResponse(model));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 3. 发起众筹项目
 * POST /api/v1/crowdfunding/projects
 */
router.post('/projects', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { modelId, targetAmount, totalShares, startDate, endDate } = req.body;

    const projectId = await projectDAO.createProject({
      modelId,
      initiatorId: userId,
      targetAmount,
      totalShares,
      startDate,
      endDate,
    });

    return res.json(successResponse({ projectId, message: '众筹项目创建成功' }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 4. 获取众筹项目列表
 * GET /api/v1/crowdfunding/projects
 */
router.get('/projects', async (req: Request, res: Response) => {
  try {
    const { status, page = 1, pageSize = 10 } = req.query;
    const result = await projectDAO.getProjects({
      status: status as string,
      page: Number(page),
      limit: Number(pageSize),
    });

    return res.json(successResponse({
      list: result.list,
      total: result.total,
      page: result.page,
      pageSize: result.limit,
    }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 5. 获取众筹项目详情
 * GET /api/v1/crowdfunding/projects/:id
 */
router.get('/projects/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await projectDAO.findById(Number(id));
    if (!project) {
      return res.status(404).json(errorResponse('项目不存在'));
    }
    return res.json(successResponse(project));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 6. 参与众筹
 * POST /api/v1/crowdfunding/projects/:id/participate
 */
router.post('/projects/:id/participate', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { shares, amount } = req.body;

    await shareDAO.purchaseShares({
      projectId: Number(id),
      userId,
      shares,
      amount,
    });

    return res.json(successResponse({ message: '参与成功' }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 7. 获取我参与的众筹项目
 * GET /api/v1/crowdfunding/my-projects
 */
router.get('/my-projects', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { page = 1, pageSize = 10 } = req.query;

    const result = await shareDAO.getUserProjects(userId, Number(page), Number(pageSize));

    return res.json(successResponse({
      list: result.list,
      total: result.total,
      page: result.page,
      pageSize: result.limit,
    }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 8. 获取我的众筹份额
 * GET /api/v1/crowdfunding/my-shares
 */
router.get('/my-shares', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { page = 1, pageSize = 10 } = req.query;

    const result = await shareDAO.getUserProjects(userId, Number(page), Number(pageSize));

    return res.json(successResponse({
      list: result.list,
      total: result.total,
      page: result.page,
      pageSize: result.limit,
    }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 9. 获取众筹统计数据
 * GET /api/v1/crowdfunding/statistics
 */
router.get('/statistics', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // TODO: 实现真实的统计数据查询
    // 当前返回 Mock 数据，后续需要从数据库查询用户的实际统计
    const stats = {
      totalInvestment: 0,
      totalShares: 0,
      totalProjects: 0,
      totalIncome: 0,
      expectedAnnualReturn: 0,
      userId, // 包含 userId 以避免未使用变量警告
    };

    return res.json(successResponse(stats));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 10. 获取众筹收益记录
 * GET /api/v1/crowdfunding/income-records
 */
router.get('/income-records', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { page = 1, pageSize = 10 } = req.query;

    // TODO: 实现真实的收益记录查询，使用 userId 查询用户的收益记录
    // 当前返回 Mock 数据
    const result = {
      list: [],
      total: 0,
      page: Number(page),
      pageSize: Number(pageSize),
      userId, // 包含 userId 以避免未使用变量警告
    };

    return res.json(successResponse(result));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 11. 提现众筹收益
 * POST /api/v1/crowdfunding/withdraw
 */
router.post('/withdraw', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { amount, bankAccount } = req.body;

    // TODO: 实现真实的提现逻辑
    // 当前返回 Mock 数据
    return res.json(successResponse({
      message: '提现申请已提交',
      withdrawId: `WD${Date.now()}`,
      amount,
      userId,
      bankAccount,
    }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 12. 获取份额交易列表
 * GET /api/v1/crowdfunding/share-transactions
 */
router.get('/share-transactions', async (req: Request, res: Response) => {
  try {
    const { projectId, status, page = 1, pageSize = 10 } = req.query;

    // TODO: 实现真实的份额交易查询，使用 projectId 和 status 过滤
    // 当前返回 Mock 数据
    const result = {
      list: [],
      total: 0,
      page: Number(page),
      pageSize: Number(pageSize),
      filters: { projectId, status }, // 包含过滤参数以避免未使用变量警告
    };

    return res.json(successResponse(result));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 13. 发布份额转让
 * POST /api/v1/crowdfunding/shares/:id/list
 */
router.post('/shares/:id/list', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { shares, price } = req.body;

    // TODO: 实现真实的份额转让发布逻辑
    // 当前返回 Mock 数据
    return res.json(successResponse({
      message: '份额转让已发布',
      transactionId: `ST${Date.now()}`,
      shareId: Number(id),
      shares,
      price,
      userId,
    }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 14. 购买转让份额
 * POST /api/v1/crowdfunding/share-transactions/:id/purchase
 */
router.post('/share-transactions/:id/purchase', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    // TODO: 实现真实的份额购买逻辑
    // 当前返回 Mock 数据
    return res.json(successResponse({
      message: '购买成功',
      transactionId: Number(id),
      userId,
    }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 15. 取消份额转让
 * DELETE /api/v1/crowdfunding/share-transactions/:id
 */
router.delete('/share-transactions/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    // TODO: 实现真实的取消转让逻辑
    // 当前返回 Mock 数据
    return res.json(successResponse({
      message: '已取消转让',
      transactionId: Number(id),
      userId,
    }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 16. 获取项目参与者列表
 * GET /api/v1/crowdfunding/projects/:id/participants
 */
router.get('/projects/:id/participants', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, pageSize = 10 } = req.query;

    // TODO: 实现真实的参与者列表查询
    // 当前返回 Mock 数据
    const result = {
      list: [],
      total: 0,
      page: Number(page),
      pageSize: Number(pageSize),
      projectId: Number(id),
    };

    return res.json(successResponse(result));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

export default router;
