/**
 * 车辆相关类型定义
 */
import { RowDataPacket } from 'mysql2/promise';

/**
 * 车型类型枚举
 */
export type VehicleType = 'A型' | 'B型' | 'C型' | '拖挂式' | '自行式' | '越野型';

/**
 * 燃料类型枚举
 */
export type FuelType = '汽油' | '柴油' | '电动' | '混合动力';

/**
 * 变速箱类型枚举
 */
export type TransmissionType = '手动' | '自动';

/**
 * 车辆状态枚举
 */
export type VehicleStatus = 'available' | 'rented' | 'maintenance' | 'retired';

/**
 * 车型模型接口
 */
export interface VehicleModel {
  id: number;
  name: string;
  brand: string;
  series?: string;
  type: VehicleType;
  seats: number;
  sleep_capacity: number;
  length?: number;
  width?: number;
  height?: number;
  fuel_type: FuelType;
  transmission: TransmissionType;
  engine_displacement?: number;
  features?: string[];
  specifications?: Record<string, unknown>;
  images?: string[];
  description?: string;
  status: 'active' | 'inactive';
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 车辆接口
 */
export interface Vehicle extends RowDataPacket {
  id: number;
  vehicle_no: string;
  model_id: number;
  store_id: number;
  license_plate: string;
  vin: string;
  color?: string;
  year: number;
  mileage: number;
  status: VehicleStatus;
  daily_price: number;
  deposit: number;
  insurance_expire_date?: Date;
  annual_inspection_date?: Date;
  last_maintenance_date?: Date;
  next_maintenance_mileage?: number;
  features?: string[];
  images?: string[];
  description?: string;
  remark?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * 车辆详情接口(包含车型信息)
 */
export interface VehicleDetail extends Vehicle {
  model?: VehicleModel;
  store_name?: string;
  store_address?: string;
}

/**
 * 车辆查询参数
 */
export interface VehicleQueryParams {
  cityId?: string;
  storeId?: number;
  startDate?: string;
  endDate?: string;
  vehicleType?: VehicleType;
  minPrice?: number;
  maxPrice?: number;
  seats?: number;
  page?: number;
  pageSize?: number;
}

/**
 * 车辆可用性检查参数
 */
export interface VehicleAvailabilityParams {
  vehicleId: number;
  startDate: string;
  endDate: string;
}

/**
 * 车辆价格计算参数
 */
export interface VehiclePriceParams {
  vehicleId: number;
  startDate: string;
  endDate: string;
  couponCode?: string;
}

/**
 * 车辆价格计算结果
 */
export interface VehiclePriceResult {
  vehicleId: number;
  days: number;
  dailyPrice: number;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  deposit: number;
}

/**
 * 数据库查询结果类型
 */
export interface CountResult extends RowDataPacket {
  total: number;
  count: number;
}
