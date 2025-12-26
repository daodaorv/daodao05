import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { Payment, CreatePaymentParams } from '../types/models/payment.types';
import { logger } from '@utils/logger';

/**
 * 支付数据访问对象
 */
export class PaymentDAO extends BaseDao<Payment> {
  constructor() {
    super('payments');
  }

  /**
   * 生成支付单号
   */
  private generatePaymentNo(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `PAY${year}${month}${day}${random}`;
  }

  /**
   * 创建支付记录
   */
  async createPayment(params: CreatePaymentParams): Promise<Payment> {
    try {
      const { order_id, user_id, type, amount, method, remark } = params;

      // 生成支付单号
      const paymentNo = this.generatePaymentNo();

      // 插入支付记录
      const sql =
        'INSERT INTO ' + this.tableName + ' ' +
        '(payment_no, order_id, user_id, type, amount, method, remark) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?)';

      const result = await QueryBuilder.insert(sql, [
        paymentNo,
        order_id,
        user_id,
        type,
        amount,
        method,
        remark || null,
      ]);

      // 查询并返回创建的支付记录
      const payment = await this.findById(result.insertId);
      if (!payment) {
        throw new Error('支付记录创建失败');
      }

      return payment;
    } catch (error) {
      logger.error('创建支付记录失败:', error);
      throw error;
    }
  }

  /**
   * 根据订单ID查询支付记录
   */
  async findByOrderId(orderId: number): Promise<Payment | null> {
    try {
      const sql = 'SELECT * FROM ' + this.tableName + ' WHERE order_id = ? ORDER BY created_at DESC LIMIT 1';
      const result = (await QueryBuilder.queryOne(sql, [orderId])) as Payment | null;
      return result;
    } catch (error) {
      logger.error('查询支付记录失败:', error);
      throw error;
    }
  }

  /**
   * 更新支付状态为成功
   */
  async updatePaymentSuccess(paymentId: number, thirdPartyNo?: string): Promise<boolean> {
    try {
      const sql =
        'UPDATE ' + this.tableName + ' ' +
        'SET status = ?, paid_at = NOW(), third_party_no = ? ' +
        'WHERE id = ?';

      const result = await QueryBuilder.update(sql, ['success', thirdPartyNo || null, paymentId]);
      return result > 0;
    } catch (error) {
      logger.error('更新支付状态失败:', error);
      throw error;
    }
  }
}
