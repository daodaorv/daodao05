import { Router, Request, Response } from 'express';
import { RatingDAO } from '../../dao/rating.dao';
import { successResponse, errorResponse } from '../../utils/response';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const ratingDAO = new RatingDAO();

/**
 * 1. 创建评价
 * POST /api/v1/ratings
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { orderId, rating, content, images } = req.body;

    const ratingId = await ratingDAO.insert({
      user_id: userId,
      order_id: orderId,
      rating,
      content,
      images: images ? JSON.stringify(images) : null,
    } as any);

    return res.json(successResponse({ ratingId, message: '评价成功' }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 2. 获取我的评价列表
 * GET /api/v1/ratings/my
 */
router.get('/my', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { page = 1, pageSize = 10 } = req.query;

    const result = await ratingDAO.getUserRatings(
      userId,
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
 * 3. 获取评价详情
 * GET /api/v1/ratings/:id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rating = await ratingDAO.findById(Number(id));

    if (!rating) {
      return res.status(404).json(errorResponse('评价不存在'));
    }

    return res.json(successResponse(rating));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 4. 更新评价
 * PUT /api/v1/ratings/:id
 */
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { rating, content, images } = req.body;

    await ratingDAO.update(Number(id), {
      rating,
      content,
      images: images ? JSON.stringify(images) : null,
    } as any);

    return res.json(successResponse({ message: '评价更新成功', userId }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 5. 删除评价
 * DELETE /api/v1/ratings/:id
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    await ratingDAO.delete(Number(id));

    return res.json(successResponse({ message: '评价已删除', userId }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 6. 上传评价图片
 * POST /api/v1/ratings/upload
 */
router.post('/upload', authMiddleware, async (_req: Request, res: Response) => {
  try {
    return res.json(successResponse({
      message: '上传成功',
      url: 'https://example.com/rating-image.jpg'
    }));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message));
  }
});

export default router;
