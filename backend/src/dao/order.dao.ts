/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { Order, OrderDetail, CreateOrderParams, OrderQueryParams, CancelOrderParams } from '../types/models/order.types';
import { CountResult } from '../types/models/vehicle.types';
import { logger } from '@utils/logger';

/**
 * 订单数据访问对象
 */
export class OrderDAO extends BaseDao<Order> {
  constructor() {
    super('orders');
  }

  /**
   * 生成订单号
   */
  private generateOrderNo(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `ORD${year}${month}${day}${random}`;
  }

  /**
   * 创建订单
   */
  async createOrder(params: CreateOrderParams): Promise<Order> {
    try {
      const { user_id, vehicle_id, store_id, return_store_id, start_date, end_date, remark } = params;

      // 获取车辆信息以计算价格
      const vehicleSql = 'SELECT daily_price, deposit FROM vehicles WHERE id = ?';
      const vehicles = (await QueryBuilder.query(vehicleSql, [vehicle_id])) as any[];

      if (vehicles.length === 0) {
        throw new Error('车辆不存在');
      }

      const vehicle = vehicles[0] as { daily_price: number; deposit: number };
      const dailyPrice = parseFloat(String(vehicle.daily_price));
      const deposit = parseFloat(String(vehicle.deposit));

      // 计算租赁天数
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      if (days <= 0) {
        throw new Error('结束日期必须大于开始日期');
      }

      // 计算金额
      const totalAmount = dailyPrice * days;
      const discountAmount = 0; // TODO: 优惠券逻辑
      const actualAmount = totalAmount - discountAmount + deposit;

      // 生成订单号
      const orderNo = this.generateOrderNo();

      // 插入订单
      const sql = `
        INSERT INTO ${this.tableName}
        (order_no, user_id, vehicle_id, store_id, return_store_id, start_date, end_date,
         days, daily_price, total_amount, deposit, discount_amount, actual_amount, remark)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await QueryBuilder.insert(sql, [
        orderNo,
        user_id,
        vehicle_id,
        store_id,
        return_store_id || null,
        start_date,
        end_date,
        days,
        dailyPrice,
        totalAmount,
        deposit,
        discountAmount,
        actualAmount,
        remark || null,
      ]);

      // 查询并返回创建的订单
      const order = await this.findById(result.insertId);
      if (!order) {
        throw new Error('订单创建失败');
      }

      return order;
    } catch (error) {
      logger.error('创建订单失败:', error);
      throw error;
    }
  }

  /**
   * 查询订单列表
   */
  async findOrders(params: OrderQueryParams): Promise<{ list: OrderDetail[]; total: number }> {
    try {
      const { user_id, status, payment_status, start_date, end_date, page = 1, pageSize = 10 } = params;

      // 构建WHERE条件
      const conditions: string[] = ['1=1'];
      const values: any[] = [];

      if (user_id) {
        conditions.push('o.user_id = ?');
        values.push(user_id);
      }

      if (status) {
        conditions.push('o.status = ?');
        values.push(status);
      }

      if (payment_status) {
        conditions.push('o.payment_status = ?');
        values.push(payment_status);
      }

      if (start_date) {
        conditions.push('o.start_date >= ?');
        values.push(start_date);
      }

      if (end_date) {
        conditions.push('o.end_date <= ?');
        values.push(end_date);
      }

      const whereClause = 'WHERE ' + conditions.join(' AND ');

      // 获取总数
      const countSql =
        'SELECT COUNT(*) as total ' +
        'FROM ' + this.tableName + ' o ' +
        whereClause;

      const countResult = (await QueryBuilder.queryOne(countSql, [...values])) as CountResult | null;
      const total = countResult?.total || 0;

      // 分页查询
      const sql =
        'SELECT ' +
        'o.*, ' +
        'u.username as user_name, u.phone as user_phone, ' +
        'v.vehicle_no, v.license_plate, ' +
        'vm.name as vehicle_name, vm.brand as vehicle_brand, ' +
        's1.name as store_name, s1.address as store_address, ' +
        's2.name as return_store_name, s2.address as return_store_address ' +
        'FROM ' + this.tableName + ' o ' +
        'LEFT JOIN users u ON o.user_id = u.id ' +
        'LEFT JOIN vehicles v ON o.vehicle_id = v.id ' +
        'LEFT JOIN vehicle_models vm ON v.model_id = vm.id ' +
        'LEFT JOIN stores s1 ON o.store_id = s1.id ' +
        'LEFT JOIN stores s2 ON o.return_store_id = s2.id ' +
        whereClause + ' ' +
        'ORDER BY o.created_at DESC ' +
        'LIMIT ? OFFSET ?';

      const queryValues = [...values, pageSize, (page - 1) * pageSize];
      const list = (await QueryBuilder.query(sql, queryValues)) as OrderDetail[];

      return { list, total };
    } catch (error) {
      logger.error('查询订单列表失败:', error);
      throw error;
    }
  }

  /**
   * 获取订单详情
   */
  async findOrderDetail(orderId: number): Promise<OrderDetail | null> {
    try {
      const sql =
        'SELECT ' +
        'o.*, ' +
        'u.username as user_name, u.phone as user_phone, ' +
        'v.vehicle_no, v.license_plate, ' +
        'vm.name as vehicle_name, vm.brand as vehicle_brand, ' +
        's1.name as store_name, s1.address as store_address, ' +
        's2.name as return_store_name, s2.address as return_store_address ' +
        'FROM ' + this.tableName + ' o ' +
        'LEFT JOIN users u ON o.user_id = u.id ' +
        'LEFT JOIN vehicles v ON o.vehicle_id = v.id ' +
        'LEFT JOIN vehicle_models vm ON v.model_id = vm.id ' +
        'LEFT JOIN stores s1 ON o.store_id = s1.id ' +
        'LEFT JOIN stores s2 ON o.return_store_id = s2.id ' +
        'WHERE o.id = ?';

      const result = (await QueryBuilder.queryOne(sql, [orderId])) as OrderDetail | null;
      return result;
    } catch (error) {
      logger.error('获取订单详情失败:', error);
      throw error;
    }
  }

  /**
   * 取消订单
   */
  async cancelOrder(params: CancelOrderParams): Promise<boolean> {
    try {
      const { order_id, cancel_reason, cancelled_by } = params;

      const sql =
        'UPDATE ' + this.tableName + ' ' +
        'SET status = ?, cancel_reason = ?, cancelled_by = ?, cancelled_at = NOW() ' +
        'WHERE id = ? AND status IN (?, ?)';

      const result = await QueryBuilder.update(sql, [
        'cancelled',
        cancel_reason,
        cancelled_by,
        order_id,
        'pending',
        'paid',
      ]);

      return result > 0;
    } catch (error) {
      logger.error('取消订单失败:', error);
      throw error;
    }
  }

  /**
   * 更新订单状态
   */
  async updateOrderStatus(orderId: number, status: string, remark?: string): Promise<boolean> {
    try {
      let sql = 'UPDATE ' + this.tableName + ' SET status = ?';
      const values: any[] = [status];

      if (remark) {
        sql += ', remark = ?';
        values.push(remark);
      }

      sql += ' WHERE id = ?';
      values.push(orderId);

      const result = await QueryBuilder.update(sql, values);
      return result > 0;
    } catch (error) {
      logger.error('更新订单状态失败:', error);
      throw error;
    }
  }

  /**
   * 获取车辆价格信息
   */
  async getVehiclePrice(vehicleId: number): Promise<{ daily_price: number; deposit: number } | null> {
    try {
      const sql = 'SELECT daily_price, deposit FROM vehicles WHERE id = ?';
      const result = (await QueryBuilder.queryOne(sql, [vehicleId])) as { daily_price: number; deposit: number } | null;
      return result;
    } catch (error) {
      logger.error('获取车辆价格失败:', error);
      throw error;
    }
  }
}
