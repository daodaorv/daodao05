import { Router, Request, Response } from 'express';
import { CommunityPostDAO } from '../../dao/community-post.dao';
import { PostCommentDAO } from '../../dao/post-comment.dao';
import { PostLikeDAO } from '../../dao/post-like.dao';
import { successResponse, errorResponse } from '../../utils/response';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const postDAO = new CommunityPostDAO();
const commentDAO = new PostCommentDAO();
const likeDAO = new PostLikeDAO();

/**
 * 1. 发布内容
 * POST /api/v1/community/posts
 */
router.post('/posts', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown).user.id;
    const { title, content, images, location, tags } = req.body;

    const postId = await postDAO.insert({
      user_id: userId,
      title,
      content,
      images: images ? JSON.stringify(images) : null,
      location,
      tags: tags ? JSON.stringify(tags) : null,
      status: 'published',
    } as unknown);

    return res.json(successResponse({ postId, message: '发布成功' }));
  } catch (error: unknown) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 2. 获取内容详情
 * GET /api/v1/community/posts/:id
 */
router.get('/posts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await postDAO.findById(Number(id));

    if (!post) {
      return res.status(404).json(errorResponse('帖子不存在'));
    }

    // 增加浏览数
    await postDAO.incrementViewCount(Number(id));

    return res.json(successResponse(post));
  } catch (error: unknown) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 3. 点赞内容
 * POST /api/v1/community/posts/:id/like
 */
router.post('/posts/:id/like', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown).user.id;
    const { id } = req.params;
    const postId = Number(id);

    const hasLiked = await likeDAO.hasLiked(postId, userId);

    if (hasLiked) {
      await likeDAO.unlike(postId, userId);
      await postDAO.decrementLikeCount(postId);
      return res.json(successResponse({ message: '已取消点赞', liked: false }));
    } else {
      await likeDAO.insert({ post_id: postId, user_id: userId } as unknown);
      await postDAO.incrementLikeCount(postId);
      return res.json(successResponse({ message: '点赞成功', liked: true }));
    }
  } catch (error: unknown) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 4. 评论内容
 * POST /api/v1/community/posts/:id/comments
 */
router.post('/posts/:id/comments', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown).user.id;
    const { id } = req.params;
    const { content, parentId } = req.body;

    const commentId = await commentDAO.insert({
      post_id: Number(id),
      user_id: userId,
      parent_id: parentId || null,
      content,
    } as unknown);

    return res.json(successResponse({ commentId, message: '评论成功' }));
  } catch (error: unknown) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 5. 获取评论列表
 * GET /api/v1/community/posts/:id/comments
 */
router.get('/posts/:id/comments', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, pageSize = 10 } = req.query;

    const result = await commentDAO.getPostComments(
      Number(id),
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
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 6. 收藏内容
 * POST /api/v1/community/posts/:id/favorite
 */
router.post('/posts/:id/favorite', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown).user.id;
    const { id } = req.params;

    // TODO: 实现收藏逻辑
    return res.json(successResponse({
      message: '收藏成功',
      postId: Number(id),
      userId
    }));
  } catch (error: unknown) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 7. 获取用户主页
 * GET /api/v1/community/users/:id
 */
router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: 实现用户主页逻辑
    return res.json(successResponse({
      userId: Number(id),
      posts: [],
      followers: 0,
      following: 0
    }));
  } catch (error: unknown) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 8. 关注用户
 * POST /api/v1/community/users/:id/follow
 */
router.post('/users/:id/follow', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown).user.id;
    const { id } = req.params;

    // TODO: 实现关注逻辑
    return res.json(successResponse({
      message: '关注成功',
      targetUserId: Number(id),
      userId
    }));
  } catch (error: unknown) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 9. 上传图片
 * POST /api/v1/community/upload
 */
router.post('/upload', authMiddleware, async (_req: Request, res: Response) => {
  try {
    // TODO: 实现图片上传逻辑
    return res.json(successResponse({
      message: '上传成功',
      url: 'https://example.com/image.jpg'
    }));
  } catch (error: unknown) {
    return res.status(500).json(errorResponse(error.message));
  }
});

/**
 * 10. 获取帖子列表
 * GET /api/v1/community/posts
 */
router.get('/posts', async (req: Request, res: Response) => {
  try {
    const { status, page = 1, pageSize = 10 } = req.query;

    const result = await postDAO.getPosts(
      { status: status as string },
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
    return res.status(500).json(errorResponse(error.message));
  }
});

export default router;
