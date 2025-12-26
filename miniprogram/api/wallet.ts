/**
 * 钱包相关API接口
 */

import { get, post } from '@/utils/request'
import { logger } from '@/utils/logger'

// 类型定义
export interface WalletBalance {
  balance: number
  frozenBalance: number
  totalIncome: number
  totalExpense: number
}

export interface WalletTransaction {
  id: string
  type: 'income' | 'expense' | 'freeze' | 'unfreeze'
  amount: number
  balanceAfter: number
  description: string
  relatedType?: string
  relatedId?: string
  createdAt: string
}

export interface WithdrawParams {
  amount: number
  accountType: 'wechat' | 'alipay' | 'bank'
  accountInfo: string
}

/**
 * 1. 获取钱包余额
 * GET /api/v1/wallet/balance
 */
export function getWalletBalance(): Promise<WalletBalance> {
  logger.debug('获取钱包余额')
  return get('/wallet/balance').then((response: any) => {
    return response.data
  })
}

/**
 * 2. 获取交易记录
 * GET /api/v1/wallet/transactions
 */
export function getWalletTransactions(page: number = 1, pageSize: number = 10) {
  logger.debug('获取交易记录', { page, pageSize })
  return get('/wallet/transactions', { page, pageSize }).then((response: any) => {
    return response.data
  })
}

/**
 * 3. 提现申请
 * POST /api/v1/wallet/withdraw
 */
export function withdrawWallet(params: WithdrawParams): Promise<{ message: string }> {
  logger.debug('提现申请', params)
  return post('/wallet/withdraw', params).then((response: any) => {
    return response.data
  })
}
