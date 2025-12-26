import { RowDataPacket } from 'mysql2';

/**
 * 用户积分
 */
export interface UserPoints extends RowDataPacket {
  id: number;
  user_id: number;
  total_points: number;
  available_points: number;
  frozen_points: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 积分交易记录
 */
export interface PointsTransaction extends RowDataPacket {
  id: number;
  user_id: number;
  type: 'earn' | 'spend' | 'expire' | 'refund';
  amount: number;
  balance: number;
  source: string;
  description: string;
  created_at: Date;
}
