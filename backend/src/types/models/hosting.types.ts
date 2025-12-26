import { RowDataPacket } from 'mysql2';

/**
 * 托管车辆
 */
export interface HostingVehicle extends RowDataPacket {
  id: number;
  user_id: number;
  vehicle_id?: number;
  plate_number?: string;
  brand: string;
  model: string;
  year?: number;
  mileage?: number;
  hosting_type: 'own_car' | 'new_car';
  status: 'pending' | 'approved' | 'operating' | 'maintenance' | 'self_use' | 'rejected' | 'terminated';
  store_id?: number;
  hosting_start_date?: Date;
  hosting_end_date?: Date;
  total_income: number;
  available_balance: number;
  frozen_balance: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 托管申请
 */
export interface HostingApplication extends RowDataPacket {
  id: number;
  user_id: number;
  application_type: 'own_car' | 'new_car' | 'self_use';
  hosting_vehicle_id?: number;
  vehicle_info?: any;
  owner_info?: any;
  photos?: any;
  store_id?: number;
  pickup_time?: Date;
  return_time?: Date;
  additional_services?: any;
  status: 'pending' | 'approved' | 'rejected';
  reject_reason?: string;
  reviewed_by?: number;
  reviewed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * 托管收益明细
 */
export interface HostingIncomeDetail extends RowDataPacket {
  id: number;
  hosting_vehicle_id: number;
  user_id: number;
  order_id?: number;
  income_type: 'rental' | 'bonus' | 'subsidy' | 'other';
  amount: number;
  description?: string;
  income_date: Date;
  created_at: Date;
}

/**
 * 托管提现记录
 */
export interface HostingWithdrawal extends RowDataPacket {
  id: number;
  user_id: number;
  hosting_vehicle_id?: number;
  amount: number;
  fee: number;
  actual_amount: number;
  bank_account: string;
  bank_name: string;
  account_name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fail_reason?: string;
  processed_at?: Date;
  created_at: Date;
  updated_at: Date;
}
