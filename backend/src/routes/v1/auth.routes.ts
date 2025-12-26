import { Router, Request, Response } from 'express';
import { UserDAO } from '@dao/user.dao';
import { successResponse, errorResponse } from '@utils/response';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '@utils/jwt';
import { verifyPassword } from '@utils/bcrypt';
import { isValidPhone, isValidEmail } from '@utils/validator';
import { logger } from '@utils/logger';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const userDAO = new UserDAO();

/**
 * 1. 发送验证码
 * POST /api/v1/auth/send-code
 */
router.post('/send-code', async (req: Request, res: Response) => {
  try {
    const { phone, type = 'login' } = req.body;

    // 验证手机号
    if (!phone || !isValidPhone(phone)) {
      res.status(400).json(errorResponse('手机号格式错误', 400));
      return undefined;
    }

    // Mock实现：开发环境返回固定验证码
    const codeId = `code_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const code = '123456'; // 开发环境固定验证码

    logger.info(`发送验证码: phone=${phone}, type=${type}, code=${code}`);

    // TODO: 生产环境集成真实短信服务
    // 这里应该调用短信服务API发送验证码

    res.json(
      successResponse({
        codeId,
        expireIn: 300, // 5分钟过期
      })
    );
  } catch (error) {
    logger.error('发送验证码失败:', error);
    res.status(500).json(errorResponse('发送验证码失败', 500));
  }
});

/**
 * 2. 用户注册
 * POST /api/v1/auth/register
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { phone, code, password, nickname } = req.body;

    // 验证必填字段
    if (!phone || !code) {
      res.status(400).json(errorResponse('手机号和验证码不能为空', 400));
      return undefined;
    }

    // 验证手机号格式
    if (!isValidPhone(phone)) {
      res.status(400).json(errorResponse('手机号格式错误', 400));
      return undefined;
    }

    // Mock验证码验证：开发环境固定验证码123456
    if (code !== '123456') {
      res.status(400).json(errorResponse('验证码错误', 400));
      return undefined;
    }

    // 检查手机号是否已注册
    const existingUser = await userDAO.findByPhone(phone);
    if (existingUser) {
      res.status(400).json(errorResponse('该手机号已注册', 400));
      return undefined;
    }

    // 创建用户
    const userId = await userDAO.createUser({
      phone,
      password,
      username: nickname || `用户${phone.substr(-4)}`,
      user_type: 'customer',
    });

    // 获取用户信息
    const user = await userDAO.findById(userId);
    if (!user) {
      res.status(500).json(errorResponse('用户创建失败', 500));
      return undefined;
    }

    // 生成Token
    const token = generateToken({
      userId: user.id,
      username: user.username || '',
      userType: user.user_type,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      username: user.username || '',
      userType: user.user_type,
    });

    // 更新最后登录时间
    await userDAO.updateLastLogin(userId);

    logger.info(`用户注册成功: userId=${userId}, phone=${phone}`);

    res.json(
      successResponse({
        token,
        refreshToken,
        user: {
          id: user.id.toString(),
          phone: user.phone,
          nickname: user.username || '',
          avatar: user.avatar_url || '/static/default-avatar.png',
          userType: user.user_type.toUpperCase(),
        },
      })
    );
  } catch (error) {
    logger.error('用户注册失败:', error);
    res.status(500).json(errorResponse('用户注册失败', 500));
  }
});

/**
 * 3. 用户登录（手机号+密码）
 * POST /api/v1/auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    // 验证必填字段
    if (!phone || !password) {
      res.status(400).json(errorResponse('手机号和密码不能为空', 400));
      return undefined;
    }

    // 验证手机号格式
    if (!isValidPhone(phone)) {
      res.status(400).json(errorResponse('手机号格式错误', 400));
      return undefined;
    }

    // 查找用户
    const user = await userDAO.findByPhone(phone);
    if (!user) {
      res.status(401).json(errorResponse('手机号或密码错误', 401));
      return undefined;
    }

    // 验证密码
    if (!user.password_hash) {
      res.status(401).json(errorResponse('该账号未设置密码，请使用验证码登录', 401));
      return undefined;
    }

    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(401).json(errorResponse('手机号或密码错误', 401));
      return undefined;
    }

    // 检查用户状态
    if (user.status !== 'active') {
      res.status(403).json(errorResponse('账号已被禁用', 403));
      return undefined;
    }

    // 生成Token
    const token = generateToken({
      userId: user.id,
      username: user.username || '',
      userType: user.user_type,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      username: user.username || '',
      userType: user.user_type,
    });

    // 更新最后登录时间
    await userDAO.updateLastLogin(user.id);

    logger.info(`用户登录成功: userId=${user.id}, phone=${phone}`);

    res.json(
      successResponse({
        token,
        refreshToken,
        user: {
          id: user.id.toString(),
          phone: user.phone,
          nickname: user.username || '',
          avatar: user.avatar_url || '/static/default-avatar.png',
          userType: user.user_type.toUpperCase(),
        },
      })
    );
  } catch (error) {
    logger.error('用户登录失败:', error);
    res.status(500).json(errorResponse('用户登录失败', 500));
  }
});

/**
 * 4. 验证码登录
 * POST /api/v1/auth/login-with-code
 */
router.post('/login-with-code', async (req: Request, res: Response) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      res.status(400).json(errorResponse('手机号和验证码不能为空', 400));
      return undefined;
    }

    if (!isValidPhone(phone)) {
      res.status(400).json(errorResponse('手机号格式错误', 400));
      return undefined;
    }

    // Mock验证码验证
    if (code !== '123456') {
      res.status(400).json(errorResponse('验证码错误', 400));
      return undefined;
    }

    // 查找或创建用户
    let user = await userDAO.findByPhone(phone);
    if (!user) {
      // 自动注册
      const userId = await userDAO.createUser({
        phone,
        username: `用户${phone.substr(-4)}`,
        user_type: 'customer',
      });
      user = await userDAO.findById(userId);
    }

    if (!user) {
      res.status(500).json(errorResponse('登录失败', 500));
      return undefined;
    }

    if (user.status !== 'active') {
      res.status(403).json(errorResponse('账号已被禁用', 403));
      return undefined;
    }

    const token = generateToken({
      userId: user.id,
      username: user.username || '',
      userType: user.user_type,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      username: user.username || '',
      userType: user.user_type,
    });

    await userDAO.updateLastLogin(user.id);

    logger.info(`验证码登录成功: userId=${user.id}, phone=${phone}`);

    res.json(
      successResponse({
        token,
        refreshToken,
        user: {
          id: user.id.toString(),
          phone: user.phone,
          nickname: user.username || '',
          avatar: user.avatar_url || '/static/default-avatar.png',
          userType: user.user_type.toUpperCase(),
        },
      })
    );
  } catch (error) {
    logger.error('验证码登录失败:', error);
    res.status(500).json(errorResponse('验证码登录失败', 500));
  }
});

/**
 * 5. 微信授权登录
 * POST /api/v1/auth/wechat-login
 */
router.post('/wechat-login', async (req: Request, res: Response) => {
  try {
    const { code, userInfo } = req.body;

    if (!code) {
      res.status(400).json(errorResponse('微信授权码不能为空', 400));
      return undefined;
    }

    // Mock微信登录：返回Mock用户信息
    // TODO: 生产环境需要调用微信API验证code并获取openid
    const mockOpenId = `wx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockPhone = '13800138000'; // Mock手机号

    logger.info(`微信登录: code=${code}, openId=${mockOpenId}`);

    // 查找或创建用户
    let user = await userDAO.findByPhone(mockPhone);
    if (!user) {
      const userId = await userDAO.createUser({
        phone: mockPhone,
        username: userInfo?.nickName || `微信用户${mockPhone.substr(-4)}`,
        user_type: 'customer',
      });
      user = await userDAO.findById(userId);
    }

    if (!user) {
      res.status(500).json(errorResponse('登录失败', 500));
      return undefined;
    }

    const token = generateToken({
      userId: user.id,
      username: user.username || '',
      userType: user.user_type,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      username: user.username || '',
      userType: user.user_type,
    });

    await userDAO.updateLastLogin(user.id);

    res.json(
      successResponse({
        token,
        refreshToken,
        user: {
          id: user.id.toString(),
          phone: user.phone,
          nickname: user.username || '',
          avatar: user.avatar_url || '/static/default-avatar.png',
          userType: user.user_type.toUpperCase(),
        },
      })
    );
  } catch (error) {
    logger.error('微信登录失败:', error);
    res.status(500).json(errorResponse('微信登录失败', 500));
  }
});

/**
 * 6. 刷新Token
 * POST /api/v1/auth/refresh-token
 */
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json(errorResponse('刷新令牌不能为空', 400));
      return undefined;
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      res.status(401).json(errorResponse('刷新令牌无效或已过期', 401));
      return undefined;
    }

    const user = await userDAO.findById(payload.userId);
    if (!user || user.status !== 'active') {
      res.status(401).json(errorResponse('用户不存在或已被禁用', 401));
      return undefined;
    }

    const newToken = generateToken({
      userId: user.id,
      username: user.username || '',
      userType: user.user_type,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      username: user.username || '',
      userType: user.user_type,
    });

    res.json(
      successResponse({
        token: newToken,
        refreshToken: newRefreshToken,
      })
    );
  } catch (error) {
    logger.error('刷新Token失败:', error);
    res.status(500).json(errorResponse('刷新Token失败', 500));
  }
});

/**
 * 7. 绑定手机号
 * POST /api/v1/auth/bind-phone
 */
router.post('/bind-phone', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { phone, code } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return undefined;
    }

    if (!phone || !code) {
      res.status(400).json(errorResponse('手机号和验证码不能为空', 400));
      return undefined;
    }

    if (!isValidPhone(phone)) {
      res.status(400).json(errorResponse('手机号格式错误', 400));
      return undefined;
    }

    if (code !== '123456') {
      res.status(400).json(errorResponse('验证码错误', 400));
      return undefined;
    }

    const existingUser = await userDAO.findByPhone(phone);
    if (existingUser && existingUser.id !== userId) {
      res.status(400).json(errorResponse('该手机号已被其他账号绑定', 400));
      return undefined;
    }

    await userDAO.updateUserInfo(userId, { username: phone });

    res.json(successResponse({ success: true }));
  } catch (error) {
    logger.error('绑定手机号失败:', error);
    res.status(500).json(errorResponse('绑定手机号失败', 500));
  }
});

/**
 * 8. 支付宝授权登录
 * POST /api/v1/auth/alipay-login
 */
router.post('/alipay-login', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      res.status(400).json(errorResponse('支付宝授权码不能为空', 400));
      return undefined;
    }

    // Mock支付宝登录
    const mockUserId = `alipay_${Date.now()}`;
    const mockPhone = '13900139000';

    logger.info(`支付宝登录: code=${code}, userId=${mockUserId}`);

    let user = await userDAO.findByPhone(mockPhone);
    if (!user) {
      const userId = await userDAO.createUser({
        phone: mockPhone,
        username: `支付宝用户${mockPhone.substr(-4)}`,
        user_type: 'customer',
      });
      user = await userDAO.findById(userId);
    }

    if (!user) {
      res.status(500).json(errorResponse('登录失败', 500));
      return undefined;
    }

    const token = generateToken({
      userId: user.id,
      username: user.username || '',
      userType: user.user_type,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      username: user.username || '',
      userType: user.user_type,
    });

    await userDAO.updateLastLogin(user.id);

    res.json(
      successResponse({
        token,
        refreshToken,
        user: {
          id: user.id.toString(),
          phone: user.phone,
          nickname: user.username || '',
          avatar: user.avatar_url || '/static/default-avatar.png',
          userType: user.user_type.toUpperCase(),
        },
      })
    );
  } catch (error) {
    logger.error('支付宝登录失败:', error);
    res.status(500).json(errorResponse('支付宝登录失败', 500));
  }
});

/**
 * 9. 抖音授权登录
 * POST /api/v1/auth/douyin-login
 */
router.post('/douyin-login', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      res.status(400).json(errorResponse('抖音授权码不能为空', 400));
      return undefined;
    }

    // Mock抖音登录
    const mockOpenId = `dy_${Date.now()}`;
    const mockPhone = '13700137000';

    logger.info(`抖音登录: code=${code}, openId=${mockOpenId}`);

    let user = await userDAO.findByPhone(mockPhone);
    if (!user) {
      const userId = await userDAO.createUser({
        phone: mockPhone,
        username: `抖音用户${mockPhone.substr(-4)}`,
        user_type: 'customer',
      });
      user = await userDAO.findById(userId);
    }

    if (!user) {
      res.status(500).json(errorResponse('登录失败', 500));
      return undefined;
    }

    const token = generateToken({
      userId: user.id,
      username: user.username || '',
      userType: user.user_type,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      username: user.username || '',
      userType: user.user_type,
    });

    await userDAO.updateLastLogin(user.id);

    res.json(
      successResponse({
        token,
        refreshToken,
        user: {
          id: user.id.toString(),
          phone: user.phone,
          nickname: user.username || '',
          avatar: user.avatar_url || '/static/default-avatar.png',
          userType: user.user_type.toUpperCase(),
        },
      })
    );
  } catch (error) {
    logger.error('抖音登录失败:', error);
    res.status(500).json(errorResponse('抖音登录失败', 500));
  }
});

/**
 * 10. 用户名密码登录
 * POST /api/v1/auth/login-with-username
 */
router.post('/login-with-username', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json(errorResponse('用户名和密码不能为空', 400));
      return undefined;
    }

    // 尝试通过用户名或邮箱查找用户
    let user = await userDAO.findByUsername(username);
    if (!user && isValidEmail(username)) {
      user = await userDAO.findByEmail(username);
    }

    if (!user) {
      res.status(401).json(errorResponse('用户名或密码错误', 401));
      return undefined;
    }

    if (!user.password_hash) {
      res.status(401).json(errorResponse('该账号未设置密码', 401));
      return undefined;
    }

    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(401).json(errorResponse('用户名或密码错误', 401));
      return undefined;
    }

    if (user.status !== 'active') {
      res.status(403).json(errorResponse('账号已被禁用', 403));
      return undefined;
    }

    const token = generateToken({
      userId: user.id,
      username: user.username || '',
      userType: user.user_type,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      username: user.username || '',
      userType: user.user_type,
    });

    await userDAO.updateLastLogin(user.id);

    logger.info(`用户名登录成功: userId=${user.id}, username=${username}`);

    res.json(
      successResponse({
        token,
        refreshToken,
        user: {
          id: user.id.toString(),
          phone: user.phone,
          nickname: user.username || '',
          avatar: user.avatar_url || '/static/default-avatar.png',
          userType: user.user_type.toUpperCase(),
        },
      })
    );
  } catch (error) {
    logger.error('用户名登录失败:', error);
    res.status(500).json(errorResponse('用户名登录失败', 500));
  }
});

/**
 * 11. 退出登录
 * POST /api/v1/auth/logout
 */
router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    logger.info(`用户退出登录: userId=${userId}`);

    // TODO: 生产环境可以将token加入黑名单
    // 这里简单返回成功

    res.json(successResponse({ success: true }));
  } catch (error) {
    logger.error('退出登录失败:', error);
    res.status(500).json(errorResponse('退出登录失败', 500));
  }
});

/**
 * 12. 检查登录状态
 * GET /api/v1/auth/check-login
 */
router.get('/check-login', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.json(
        successResponse({
          isLoggedIn: false,
          user: null,
        })
      );
      return;
    }

    const user = await userDAO.findById(userId);
    if (!user || user.status !== 'active') {
      res.json(
        successResponse({
          isLoggedIn: false,
          user: null,
        })
      );
      return;
    }

    res.json(
      successResponse({
        isLoggedIn: true,
        user: {
          id: user.id.toString(),
          phone: user.phone,
          nickname: user.username || '',
          avatar: user.avatar_url || '/static/default-avatar.png',
        },
      })
    );
  } catch (error) {
    logger.error('检查登录状态失败:', error);
    res.status(500).json(errorResponse('检查登录状态失败', 500));
  }
});

export default router;
