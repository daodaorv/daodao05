import { Router, Request, Response } from 'express';
import { RentalRuleDAO } from '@dao/rental-rule.dao';
import { successResponse, errorResponse } from '@utils/response';
import { logger } from '@utils/logger';

const router = Router();
const rentalRuleDAO = new RentalRuleDAO();

/**
 * 获取租车须知
 * GET /api/v1/rules/rental?productType=vehicle
 */
router.get('/rental', async (req: Request, res: Response) => {
  try {
    const { productType } = req.query;

    if (!productType || (productType !== 'vehicle' && productType !== 'special-offer')) {
      res.status(400).json(errorResponse('无效的产品类型', 400));
      return undefined;
    }

    const rule = await rentalRuleDAO.findByProductType(productType as 'vehicle' | 'special-offer');

    if (!rule) {
      res.status(404).json(errorResponse('租车须知不存在', 404));
      return undefined;
    }

    res.json(successResponse(rule.content));
  } catch (error) {
    logger.error('获取租车须知失败:', error);
    res.status(500).json(errorResponse('获取租车须知失败', 500));
  }
});

export default router;
