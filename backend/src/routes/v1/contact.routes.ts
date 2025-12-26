import { Router, Request, Response } from 'express';
import { ContactDAO } from '@dao/contact.dao';
import { successResponse, errorResponse } from '@utils/response';
import { logger } from '@utils/logger';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const contactDAO = new ContactDAO();

/**
 * 1. 获取联系人列表
 * GET /api/v1/contacts
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return;
    }

    const contacts = await contactDAO.findByUserId(userId);
    res.json(successResponse(contacts));
  } catch (error) {
    logger.error('获取联系人列表失败:', error);
    res.status(500).json(errorResponse('获取联系人列表失败', 500));
  }
});

/**
 * 2. 获取联系人详情
 * GET /api/v1/contacts/:id
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const contactId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return;
    }

    if (isNaN(contactId)) {
      res.status(400).json(errorResponse('无效的联系人ID', 400));
      return;
    }

    const contact = await contactDAO.findById(contactId, userId);
    if (!contact) {
      res.status(404).json(errorResponse('联系人不存在', 404));
      return;
    }

    res.json(successResponse(contact));
  } catch (error) {
    logger.error('获取联系人详情失败:', error);
    res.status(500).json(errorResponse('获取联系人详情失败', 500));
  }
});

/**
 * 3. 创建联系人
 * POST /api/v1/contacts
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return;
    }

    const { name, phone, idCard, driverLicenseNo, driverLicenseFront, driverLicenseBack, isDefault } = req.body;

    // 验证必填字段
    if (!name || !phone || !idCard || !driverLicenseNo || !driverLicenseFront || !driverLicenseBack) {
      res.status(400).json(errorResponse('缺少必填字段', 400));
      return;
    }

    const contactId = await contactDAO.create({
      user_id: userId,
      name,
      phone,
      id_card: idCard,
      driver_license_no: driverLicenseNo,
      driver_license_front: driverLicenseFront,
      driver_license_back: driverLicenseBack,
      is_default: isDefault || false,
    });

    res.status(201).json(successResponse({ id: contactId }));
  } catch (error) {
    logger.error('创建联系人失败:', error);
    res.status(500).json(errorResponse('创建联系人失败', 500));
  }
});

/**
 * 4. 更新联系人
 * PUT /api/v1/contacts/:id
 */
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const contactId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return;
    }

    if (isNaN(contactId)) {
      res.status(400).json(errorResponse('无效的联系人ID', 400));
      return;
    }

    const { name, phone, idCard, driverLicenseNo, driverLicenseFront, driverLicenseBack, isDefault } = req.body;

    const updated = await contactDAO.update(contactId, userId, {
      name,
      phone,
      id_card: idCard,
      driver_license_no: driverLicenseNo,
      driver_license_front: driverLicenseFront,
      driver_license_back: driverLicenseBack,
      is_default: isDefault,
    });

    if (!updated) {
      res.status(404).json(errorResponse('联系人不存在或无更新内容', 404));
      return;
    }

    res.json(successResponse({ success: true }));
  } catch (error) {
    logger.error('更新联系人失败:', error);
    res.status(500).json(errorResponse('更新联系人失败', 500));
  }
});

/**
 * 5. 删除联系人
 * DELETE /api/v1/contacts/:id
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const contactId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return;
    }

    if (isNaN(contactId)) {
      res.status(400).json(errorResponse('无效的联系人ID', 400));
      return;
    }

    const deleted = await contactDAO.delete(contactId, userId);
    if (!deleted) {
      res.status(404).json(errorResponse('联系人不存在', 404));
      return;
    }

    res.json(successResponse({ success: true }));
  } catch (error) {
    logger.error('删除联系人失败:', error);
    res.status(500).json(errorResponse('删除联系人失败', 500));
  }
});

export default router;
