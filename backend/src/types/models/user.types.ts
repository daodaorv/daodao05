import { RowDataPacket } from 'mysql2/promise';

/**
 * 用户模型类型定义
 */

export interface User extends RowDataPacket {
  id: number;
  username: string;
  phone: string;
  email?: string;
  password_hash: string;
  real_name?: string;
  id_card?: string;
  driver_license?: string;
  avatar_url?: string;
  user_type: 'customer' | 'mobile_admin' | 'pc_admin';
  status: 'active' | 'inactive' | 'banned';
  last_login_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile extends RowDataPacket {
  id: number;
  user_id: number;
  gender?: 'male' | 'female' | 'other';
  birthday?: Date;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  work_company?: string;
  work_title?: string;
  preferences?: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}
