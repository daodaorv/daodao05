import { Router, Request, Response } from 'express';
import { HelpArticleDAO } from '../../dao/help.dao';
import { successResponse, errorResponse } from '../../utils/response';

const router = Router();
const helpDAO = new HelpArticleDAO();

/**
 * 1. 获取帮助分类列表
 * GET /api/v1/help/categories
 */
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = [
      { id: 1, name: '常见问题', icon: 'question', sort_order: 1 },
      { id: 2, name: '使用指南', icon: 'guide', sort_order: 2 },
      { id: 3, name: '账户安全', icon: 'security', sort_order: 3 },
      { id: 4, name: '支付问题', icon: 'payment', sort_order: 4 },
    ];
    return res.json(successResponse(categories));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json(errorResponse(error.message));
    }
    return res.status(500).json(errorResponse('未知错误'));
  }
});

/**
 * 2. 获取分类下的文章列表
 * GET /api/v1/help/articles
 */
router.get('/articles', async (req: Request, res: Response) => {
  try {
    const { categoryId, page = 1, pageSize = 10 } = req.query;

    if (!categoryId) {
      return res.status(400).json(errorResponse('分类ID不能为空'));
    }

    const result = await helpDAO.getArticlesByCategory(
      Number(categoryId),
      Number(page),
      Number(pageSize)
    );

    return res.json(successResponse({
      list: result.list,
      total: result.total,
      page: result.page,
      pageSize: result.limit,
    }));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json(errorResponse(error.message));
    }
    return res.status(500).json(errorResponse('未知错误'));
  }
});

/**
 * 3. 获取文章详情
 * GET /api/v1/help/articles/:id
 */
router.get('/articles/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await helpDAO.findById(Number(id));

    if (!article) {
      return res.status(404).json(errorResponse('文章不存在'));
    }

    // 增加浏览次数
    await helpDAO.incrementViewCount(Number(id));

    return res.json(successResponse(article));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json(errorResponse(error.message));
    }
    return res.status(500).json(errorResponse('未知错误'));
  }
});

/**
 * 4. 搜索文章
 * GET /api/v1/help/search
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { keyword, page = 1, pageSize = 10 } = req.query;

    if (!keyword) {
      return res.status(400).json(errorResponse('搜索关键词不能为空'));
    }

    const result = await helpDAO.searchArticles(
      String(keyword),
      Number(page),
      Number(pageSize)
    );

    return res.json(successResponse({
      list: result.list,
      total: result.total,
      page: result.page,
      pageSize: result.limit,
    }));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json(errorResponse(error.message));
    }
    return res.status(500).json(errorResponse('未知错误'));
  }
});

/**
 * 5. 获取热门文章
 * GET /api/v1/help/hot
 */
router.get('/hot', async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    // TODO: 实现热门文章查询
    const articles: unknown[] = [];

    return res.json(successResponse({
      list: articles,
      total: articles.length,
      limit: Number(limit),
    }));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json(errorResponse(error.message));
    }
    return res.status(500).json(errorResponse('未知错误'));
  }
});

/**
 * 6. 提交反馈
 * POST /api/v1/help/feedback
 */
router.post('/feedback', async (req: Request, res: Response) => {
  try {
    const { articleId, helpful } = req.body;

    // TODO: 实现反馈记录
    return res.json(successResponse({
      message: '反馈成功',
      articleId,
      helpful,
    }));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json(errorResponse(error.message));
    }
    return res.status(500).json(errorResponse('未知错误'));
  }
});

export default router;
