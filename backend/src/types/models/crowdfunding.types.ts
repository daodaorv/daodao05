import { RowDataPacket } from 'mysql2';

/**
 * 众筹车型
 */
export interface CrowdfundingModel extends RowDataPacket {
  id: number;
  brand: string;
  model: string;
  type: string;
  images?: string;
  price: number;
  share_price: number;
  total_shares: number;
  min_shares: number;
  max_shares?: number;
  expected_annual_return?: number;
  expected_monthly_income?: number;
  specifications?: string;
  features?: string;
  is_hot: boolean;
  is_recommended: boolean;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

/**
 * 众筹项目
 */
export interface CrowdfundingProject extends RowDataPacket {
  id: number;
  project_no: string;
  model_id: number;
  initiator_id: number;
  target_amount: number;
  current_amount: number;
  total_shares: number;
  sold_shares: number;
  participant_count: number;
  start_date: Date;
  end_date: Date;
  status: 'preparing' | 'funding' | 'success' | 'failed' | 'operating';
  vehicle_id?: number;
  store_id?: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 众筹份额
 */
export interface CrowdfundingShare extends RowDataPacket {
  id: number;
  project_id: number;
  user_id: number;
  shares: number;
  amount: number;
  status: 'active' | 'listed' | 'transferred';
  purchased_at: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * 份额交易
 */
export interface ShareTransaction extends RowDataPacket {
  id: number;
  share_id: number;
  seller_id: number;
  buyer_id?: number;
  shares: number;
  price: number;
  status: 'listing' | 'completed' | 'cancelled';
  listed_at: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}
