/**
 * 支付相关类型定义
 */
import { RowDataPacket } from 'mysql2/promise';

/**
 * 支付类型枚举
 */
export type PaymentType = 'order' | 'deposit' | 'violation_deposit' | 'penalty' | 'compensation';

/**
 * 支付方式枚举
 */
export type PaymentMethod = 'wechat' | 'alipay' | 'balance' | 'cash';

/**
 * 支付状态枚举
 */
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'cancelled' | 'refunding' | 'refunded';

/**
 * 支付记录接口
 */
export interface Payment extends RowDataPacket {
  id: number;
  payment_no: string;
  order_id: number;
  user_id: number;
  type: PaymentType;
  amount: number;
  method: PaymentMethod;
  channel?: string;
  third_party_no?: string;
  status: PaymentStatus;
  paid_at?: Date;
  refund_amount: number;
  refund_reason?: string;
  refund_at?: Date;
  remark?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * 创建支付请求参数
 */
export interface CreatePaymentParams {
  order_id: number;
  user_id: number;
  type: PaymentType;
  amount: number;
  method: PaymentMethod;
  remark?: string;
}
