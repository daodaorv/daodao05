import { BaseDao } from './base.dao';
import { QueryBuilder } from '@db/query-builder';
import { HostingApplication } from '../types/models/hosting.types';

/**
 * 托管申请 DAO
 */
export class HostingApplicationDAO extends BaseDao<HostingApplication> {
  constructor() {
    super('hosting_applications');
  }

  /**
   * 创建托管申请
   */
  async createApplication(data: {
    userId: number;
    applicationType: string;
    vehicleInfo?: any;
    ownerInfo?: any;
    photos?: any;
    storeId?: number;
    pickupTime?: string;
    returnTime?: string;
    additionalServices?: any;
  }) {
    const result = await this.insert({
      user_id: data.userId,
      application_type: data.applicationType as any,
      vehicle_info: data.vehicleInfo ? JSON.stringify(data.vehicleInfo) : null,
      owner_info: data.ownerInfo ? JSON.stringify(data.ownerInfo) : null,
      photos: data.photos ? JSON.stringify(data.photos) : null,
      store_id: data.storeId,
      pickup_time: data.pickupTime as any,
      return_time: data.returnTime as any,
      additional_services: data.additionalServices ? JSON.stringify(data.additionalServices) : null,
      status: 'pending',
    } as any);

    return result;
  }

  /**
   * 获取用户的申请列表
   */
  async getUserApplications(userId: number, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const rows = await QueryBuilder.query<HostingApplication>(
      `SELECT * FROM ${this.tableName} WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const countResult = await QueryBuilder.queryOne<any>(
      `SELECT COUNT(*) as total FROM ${this.tableName} WHERE user_id = ?`,
      [userId]
    );

    return {
      list: rows,
      total: countResult?.total || 0,
      page,
      limit,
    };
  }
}
