import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { Vehicle, VehicleDetail, VehicleQueryParams, CountResult } from '../types/models/vehicle.types';
import { logger } from '@utils/logger';

/**
 * 车辆数据访问对象
 */
export class VehicleDAO extends BaseDao<Vehicle> {
  constructor() {
    super('vehicles');
  }

  /**
   * 根据条件查询车辆列表
   */
  async findVehicles(params: VehicleQueryParams): Promise<{ list: VehicleDetail[]; total: number }> {
    try {
      const {
        cityId,
        storeId,
        startDate,
        endDate,
        vehicleType,
        minPrice,
        maxPrice,
        seats,
        page = 1,
        pageSize = 10,
      } = params;

      // 构建WHERE条件
      const conditions: string[] = ["v.status = 'available'"];
      const values: unknown[] = [];

      // 城市筛选
      if (cityId) {
        conditions.push('s.city = ?');
        values.push(cityId.replace('city_', ''));
      }

      // 门店筛选
      if (storeId) {
        conditions.push('v.store_id = ?');
        values.push(storeId);
      }

      // 车型类型筛选
      if (vehicleType) {
        conditions.push('vm.type = ?');
        values.push(vehicleType);
      }

      // 价格范围筛选
      if (minPrice !== undefined) {
        conditions.push('v.daily_price >= ?');
        values.push(minPrice);
      }
      if (maxPrice !== undefined) {
        conditions.push('v.daily_price <= ?');
        values.push(maxPrice);
      }

      // 座位数筛选
      if (seats) {
        conditions.push('vm.seats >= ?');
        values.push(seats);
      }

      // 时间段可用性筛选
      if (startDate && endDate) {
        conditions.push(`
          v.id NOT IN (
            SELECT vehicle_id FROM orders
            WHERE status IN ('paid', 'confirmed', 'picked_up')
            AND NOT (end_date < ? OR start_date > ?)
          )
        `);
        values.push(startDate, endDate);
      }

      // 构建完整的WHERE子句
      const whereClause = 'WHERE ' + conditions.join(' AND ');

      // 获取总数
      const countSql =
        'SELECT COUNT(*) as total ' +
        'FROM ' + this.tableName + ' v ' +
        'INNER JOIN vehicle_models vm ON v.model_id = vm.id ' +
        'INNER JOIN stores s ON v.store_id = s.id ' +
        whereClause;

      const countResult = (await QueryBuilder.queryOne(countSql, [...values])) as CountResult | null;
      const total = countResult?.total || 0;

      // 分页查询
      const sql =
        'SELECT ' +
        'v.id, v.vehicle_no, v.model_id, v.store_id, v.license_plate, v.vin, ' +
        'v.color, v.year, v.mileage, v.status, v.daily_price, v.deposit, ' +
        'v.insurance_expire_date, v.annual_inspection_date, v.last_maintenance_date, ' +
        'v.next_maintenance_mileage, v.features as vehicle_features, v.images as vehicle_images, ' +
        'v.description, v.remark, v.created_at, v.updated_at, ' +
        'vm.name as model_name, vm.brand, vm.type as vehicle_type, ' +
        'vm.seats as model_seats, vm.sleep_capacity, ' +
        'vm.features as model_features, vm.images as model_images, ' +
        's.name as store_name, s.address as store_address, s.city ' +
        'FROM ' + this.tableName + ' v ' +
        'INNER JOIN vehicle_models vm ON v.model_id = vm.id ' +
        'INNER JOIN stores s ON v.store_id = s.id ' +
        whereClause + ' ' +
        'ORDER BY v.created_at DESC ' +
        'LIMIT ? OFFSET ?';

      const queryValues = [...values, pageSize, (page - 1) * pageSize];
      const list = (await QueryBuilder.query(sql, queryValues)) as VehicleDetail[];

      return { list, total };
    } catch (error) {
      logger.error('查询车辆列表失败:', error);
      throw error;
    }
  }

  /**
   * 根据ID获取车辆详情
   */
  async findVehicleDetail(id: number): Promise<VehicleDetail | null> {
    try {
      const sql = `
        SELECT
          v.*,
          vm.name as model_name,
          vm.brand,
          vm.series,
          vm.type as vehicle_type,
          vm.seats as model_seats,
          vm.sleep_capacity,
          vm.length,
          vm.width,
          vm.height,
          vm.fuel_type,
          vm.transmission,
          vm.features as model_features,
          vm.specifications,
          vm.images as model_images,
          vm.description as model_description,
          s.name as store_name,
          s.address as store_address,
          s.city,
          s.contact_phone as store_phone
        FROM ${this.tableName} v
        INNER JOIN vehicle_models vm ON v.model_id = vm.id
        INNER JOIN stores s ON v.store_id = s.id
        WHERE v.id = ?
      `;
      const result = (await QueryBuilder.queryOne(sql, [id])) as VehicleDetail | null;
      return result;
    } catch (error) {
      logger.error('获取车辆详情失败:', error);
      throw error;
    }
  }

  /**
   * 检查车辆在指定时间段是否可用
   */
  async checkAvailability(vehicleId: number, startDate: string, endDate: string): Promise<boolean> {
    try {
      const sql = `
        SELECT COUNT(*) as count
        FROM orders
        WHERE vehicle_id = ?
        AND status IN ('paid', 'confirmed', 'picked_up')
        AND NOT (end_date < ? OR start_date > ?)
      `;
      const result = (await QueryBuilder.queryOne(sql, [vehicleId, startDate, endDate])) as CountResult | null;
      return (result?.count || 0) === 0;
    } catch (error) {
      logger.error('检查车辆可用性失败:', error);
      throw error;
    }
  }

  /**
   * 获取推荐车辆列表
   */
  async findRecommendedVehicles(limit: number = 10): Promise<VehicleDetail[]> {
    try {
      const sql = `
        SELECT
          v.*,
          vm.name as model_name,
          vm.brand,
          vm.type as vehicle_type,
          vm.seats as model_seats,
          vm.sleep_capacity,
          vm.features as model_features,
          vm.images as model_images,
          s.name as store_name,
          s.address as store_address
        FROM ${this.tableName} v
        INNER JOIN vehicle_models vm ON v.model_id = vm.id
        INNER JOIN stores s ON v.store_id = s.id
        WHERE v.status = 'available'
        ORDER BY RAND()
        LIMIT ?
      `;
      const list = (await QueryBuilder.query(sql, [limit])) as VehicleDetail[];
      return list;
    } catch (error) {
      logger.error('获取推荐车辆失败:', error);
      throw error;
    }
  }
}
