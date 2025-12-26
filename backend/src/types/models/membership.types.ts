import { RowDataPacket } from 'mysql2';

/**
 * 用户会员信息
 */
export interface UserMembership extends RowDataPacket {
  id: number;
  user_id: number;
  level: 'free' | 'silver' | 'gold' | 'platinum';
  start_date: Date;
  end_date: Date;
  auto_renew: boolean;
  status: 'active' | 'expired' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}
