import { RowDataPacket } from 'mysql2/promise';

/**
 * 门店相关类型定义
 */

/**
 * 门店类型枚举
 */
export type StoreType = 'company' | 'franchise' | 'partner';

/**
 * 门店状态枚举
 */
export type StoreStatus = 'active' | 'inactive';

/**
 * 门店表模型
 */
export interface Store extends RowDataPacket {
  id: number;
  name: string;
  code: string;
  type: StoreType;
  contact_person: string | null;
  contact_phone: string | null;
  email: string | null;
  province: string | null;
  city: string | null;
  district: string | null;
  address: string;
  location_lat: number | null;
  location_lng: number | null;
  business_hours: unknown | null; // JSON类型
  services: unknown | null; // JSON类型
  images: unknown | null; // JSON类型
  description: string | null;
  status: StoreStatus;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 城市信息（从门店表聚合）
 */
export interface City extends RowDataPacket {
  id: string;
  name: string;
  code: string;
  province: string;
  storeCount: number;
  isHot: boolean;
}
