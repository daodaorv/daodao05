/**
 * 分享相关API
 * @description 分享记录、统计、邀请关系等API接口
 */

import { get, post } from '@/utils/request'
import type {
  ShareRecordResponse,
  ShareStatsResponse,
  InviteRecordsResponse,
  InviteStatsResponse,
  PosterUrlResponse,
  ShareAchievementsResponse
} from '@/types/share'

/**
 * 分享API
 */
export const shareApi = {
  /**
   * 记录分享行为
   * @param data 分享数据
   */
  recordShare(data: {
    scene: string
    method: string
    businessId: string
    shareTime: string
  }): Promise<ShareRecordResponse> {
    return post('/share/record', data)
  },

  /**
   * 记录分享访问
   * @param data 访问数据
   */
  recordShareView(data: {
    scene: string
    businessId: string
    shareFrom: string
    viewTime: string
  }): Promise<ShareRecordResponse> {
    return post('/share/view', data)
  },

  /**
   * 获取分享统计
   * @returns 分享统计数据
   */
  getShareStats(): Promise<ShareStatsResponse> {
    return get('/share/stats')
  },

  /**
   * 获取分享历史记录
   * @param params 查询参数
   */
  getShareHistory(params?: {
    page?: number
    pageSize?: number
    scene?: string
  }): Promise<ShareRecordResponse> {
    return get('/share/history', params)
  },

  /**
   * 获取邀请记录
   * @param params 查询参数
   */
  getInviteRecords(params?: {
    page?: number
    pageSize?: number
  }): Promise<InviteRecordsResponse> {
    return get('/invite/records', params)
  },

  /**
   * 获取邀请统计
   * @returns 邀请统计数据
   */
  getInviteStats(): Promise<InviteStatsResponse> {
    return get('/invite/stats')
  },

  /**
   * 生成小程序码
   * @param data 小程序码参数
   */
  generateMiniProgramCode(data: {
    scene: string
    page: string
    width?: number
  }): Promise<PosterUrlResponse> {
    return post('/share/mini-program-code', data)
  },

  /**
   * 绑定邀请关系
   * @param data 邀请码
   */
  bindInviteRelation(data: {
    inviteCode: string
  }): Promise<ShareRecordResponse> {
    return post('/invite/bind', data)
  },

  /**
   * 获取分享成就列表
   * @returns 成就列表
   */
  getShareAchievements(): Promise<ShareAchievementsResponse> {
    return get('/share/achievements')
  },

  /**
   * 验证分享行为（防作弊）
   * @param data 验证数据
   */
  verifyShare(data: {
    scene: string
    businessId: string
    timestamp: number
  }): Promise<ShareRecordResponse> {
    return post('/share/verify', data)
  },

  /**
   * 上报异常分享行为
   * @param data 异常数据
   */
  reportAbnormalShare(data: {
    scene: string
    businessId: string
    reason: string
    timestamp: number
  }): Promise<ShareRecordResponse> {
    return post('/share/report-abnormal', data)
  }
}
