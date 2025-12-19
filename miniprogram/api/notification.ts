/**
 * 通知相关API接口
 */

import { logger } from '@/utils/logger'

// ==================== 类型定义 ====================

interface NotificationData {
  type: string;
  orderNo: string;
  userId: string;
  title?: string;
  content?: string;
}

interface StoreNotificationData {
  storeId: string;
  orderNo: string;
  type: 'new_order' | 'payment_success';
}

// ==================== API 函数 ====================

/**
 * 发送通知
 */
export function sendNotification(data: NotificationData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      logger.debug('发送通知', data);
      resolve({
        code: 0,
        message: 'success',
        data: {
          success: true,
          notificationId: 'NOTIF' + Date.now(),
          sentAt: new Date().toISOString()
        }
      });
    }, 200);
  });
}

/**
 * 通知门店（新订单）
 */
export function notifyStore(data: StoreNotificationData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      logger.debug('通知门店', data);
      resolve({
        code: 0,
        message: 'success',
        data: {
          success: true,
          notifiedAt: new Date().toISOString()
        }
      });
    }, 200);
  });
}

/**
 * 获取用户通知列表
 */
export function getNotifications(params?: {
  page?: number;
  limit?: number;
  type?: string;
}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { page = 1, limit = 10 } = params || {};

      // Mock 通知数据
      const mockNotifications = [
        {
          id: 'notif_001',
          type: 'payment_success',
          title: '支付成功',
          content: '订单DD202512010001支付成功，等待门店确认',
          isRead: false,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'notif_002',
          type: 'order_confirmed',
          title: '订单已确认',
          content: '您的订单DD202511280002已确认，请按时取车',
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'notif_003',
          type: 'pickup_reminder',
          title: '取车提醒',
          content: '您的订单DD202511250003即将到达取车时间',
          isRead: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedNotifications = mockNotifications.slice(start, end);

      resolve({
        code: 0,
        message: 'success',
        data: {
          notifications: paginatedNotifications,
          pagination: {
            current: page,
            pageSize: limit,
            total: mockNotifications.length,
            pages: Math.ceil(mockNotifications.length / limit)
          }
        }
      });
    }, 500);
  });
}

/**
 * 标记通知为已读
 */
export function markNotificationRead(notificationId: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      logger.debug('标记通知已读', { notificationId });
      resolve({
        code: 0,
        message: 'success',
        data: {
          success: true
        }
      });
    }, 200);
  });
}

/**
 * 获取未读通知数量
 */
export function getUnreadCount() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: {
          count: 2
        }
      });
    }, 200);
  });
}

// 默认导出对象，方便使用 notificationApi.xxx() 的方式调用
export const notificationApi = {
  sendNotification,
  notifyStore,
  getNotifications,
  markNotificationRead,
  getUnreadCount
};

export default notificationApi;
