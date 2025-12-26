/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from 'express';
import { UserWalletDAO } from '../../dao/wallet.dao';
import { successResponse, errorResponse } from '../../utils/response';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const walletDAO = new UserWalletDAO();

/**
 * 1. 获取钱包余额
 * GET /api/v1/wallet/balance
 */
router.get('/balance', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return undefined;
    }
    const wallet = await walletDAO.getUserWallet(userId);

    if (!wallet) {
      return res.json(successResponse({
        balance: 0,
        frozenBalance: 0,
        totalIncome: 0,
        totalExpense: 0,
      }));
    }

    return res.json(successResponse({
      balance: wallet.balance,
      frozenBalance: wallet.frozen_balance,
      totalIncome: wallet.total_income,
      totalExpense: wallet.total_expense,
    }));
  } catch (error: any) {
    if (error instanceof Error) {
      return res.status(500).json(errorResponse(error.message));
    }
    return res.status(500).json(errorResponse('未知错误'));
  }
});

/**
 * 2. 获取交易记录
 * GET /api/v1/wallet/transactions
 */
router.get('/transactions', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return undefined;
    }
    const { page = 1, pageSize = 10 } = req.query;

    // TODO: 实现交易记录查询
    const result = {
      list: [],
      total: 0,
      page: Number(page),
      pageSize: Number(pageSize),
      userId,
    };

    return res.json(successResponse(result));
  } catch (error: any) {
    if (error instanceof Error) {
      return res.status(500).json(errorResponse(error.message));
    }
    return res.status(500).json(errorResponse('未知错误'));
  }
});

/**
 * 3. 提现申请
 * POST /api/v1/wallet/withdraw
 */
router.post('/withdraw', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return undefined;
    }
    const { amount, accountType, accountInfo } = req.body;

    // TODO: 实现提现逻辑
    return res.json(successResponse({
      message: '提现申请已提交',
      amount,
      accountType,
      accountInfo,
      userId,
    }));
  } catch (error: any) {
    if (error instanceof Error) {
      return res.status(500).json(errorResponse(error.message));
    }
    return res.status(500).json(errorResponse('未知错误'));
  }
});

export default router;
