/**
 * 联系人相关类型定义
 */

import { RowDataPacket } from 'mysql2/promise';

export interface Contact extends RowDataPacket {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  id_card: string;
  driver_license_no: string;
  driver_license_front: string;
  driver_license_back: string;
  is_default: boolean;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface CreateContactPayload {
  user_id: number;
  name: string;
  phone: string;
  id_card: string;
  driver_license_no: string;
  driver_license_front: string;
  driver_license_back: string;
  is_default?: boolean;
}

export interface UpdateContactPayload {
  name?: string;
  phone?: string;
  id_card?: string;
  driver_license_no?: string;
  driver_license_front?: string;
  driver_license_back?: string;
  is_default?: boolean;
  status?: 'active' | 'inactive';
}
