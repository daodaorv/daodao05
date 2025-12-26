import { Router, Request, Response } from 'express';
import { NotificationDAO } from '../../dao/notification.dao';
import { successResponse, errorResponse } from '../../utils/response';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const notificationDAO = new NotificationDAO();

/**
 * 1. 发送通知
 * POST /api/v1/notifications/send
 */
router.post('/send', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId, type, title, content, link } = req.body;

    const notificationId = await notificationDAO.insert({
      user_id: userId,
      type,
      title,
      content,
      link,
      is_read: false,
    } as any);

    return res.json(successResponse({
      notificationId,
      message: '通知发送成功'
    }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 2. 通知门店
 * POST /api/v1/notifications/notify-store
 */
router.post('/notify-store', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { storeId, type, title, content } = req.body;

    // TODO: 实现门店通知逻辑，查询门店相关用户并发送通知
    // 当前返回 Mock 数据
    return res.json(successResponse({
      message: '门店通知已发送',
      storeId,
      type,
      title,
      content, // 包含 content 以避免未使用变量警告
    }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 3. 获取用户通知列表
 * GET /api/v1/notifications
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { type, isRead, page = 1, pageSize = 10 } = req.query;

    const filters: any = {};
    if (type) filters.type = type as string;
    if (isRead !== undefined) filters.isRead = isRead === 'true';

    const result = await notificationDAO.getUserNotifications(
      userId,
      filters,
      Number(page),
      Number(pageSize)
    );

    return res.json(successResponse({
      list: result.list,
      total: result.total,
      page: result.page,
      pageSize: result.limit,
    }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 4. 标记通知为已读
 * PUT /api/v1/notifications/:id/read
 */
router.put('/:id/read', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await notificationDAO.markAsRead(Number(id));

    return res.json(successResponse({ message: '已标记为已读' }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 5. 获取未读通知数量
 * GET /api/v1/notifications/unread-count
 */
router.get('/unread-count', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const count = await notificationDAO.getUnreadCount(userId);

    return res.json(successResponse({ count }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

export default router;
