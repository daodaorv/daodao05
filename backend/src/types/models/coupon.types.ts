import { RowDataPacket } from 'mysql2';

/**
 * 优惠券
 */
export interface Coupon extends RowDataPacket {
  id: number;
  name: string;
  type: 'discount' | 'rate' | 'daily' | 'service' | 'special';
  amount?: number;
  rate?: number;
  min_amount: number;
  scope?: string;
  description?: string;
  validity_days: number;
  price: number;
  points_price: number;
  total_stock: number;
  remaining_stock: number;
  limit_per_user: number;
  is_new_user: boolean;
  is_vip: boolean;
  is_hot: boolean;
  stack_rule?: string;
  special_limit?: string;
  status: 'active' | 'inactive' | 'expired';
  start_date?: Date;
  end_date?: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * 用户优惠券
 */
export interface UserCoupon extends RowDataPacket {
  id: number;
  user_id: number;
  coupon_id: number;
  status: 'unused' | 'used' | 'expired';
  claim_date: Date;
  expiry_date: Date;
  used_date?: Date;
  order_id?: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 邀请码
 */
export interface InviteCode extends RowDataPacket {
  id: number;
  user_id: number;
  invite_code: string;
  total_invites: number;
  successful_registrations: number;
  completed_first_orders: number;
  total_rewards: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 邀请记录
 */
export interface InviteRecord extends RowDataPacket {
  id: number;
  inviter_id: number;
  invitee_id?: number;
  invite_code: string;
  invitee_phone?: string;
  status: 'pending' | 'registered' | 'completed_order';
  registered_at?: Date;
  first_order_at?: Date;
  reward_amount: number;
  created_at: Date;
  updated_at: Date;
}

