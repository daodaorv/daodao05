import { Router, Request, Response } from 'express';
import { UserDAO, UserProfileDAO } from '@dao/user.dao';
import { UserProfile } from '../../types/models/user.types';
import { successResponse, errorResponse } from '@utils/response';
import { logger } from '@utils/logger';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const userDAO = new UserDAO();
const userProfileDAO = new UserProfileDAO();

/**
 * 1. 获取用户信息
 * GET /api/v1/users/profile
 */
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return;
    }

    const user = await userDAO.findById(userId);
    if (!user) {
      res.status(404).json(errorResponse('用户不存在', 404));
      return;
    }

    // 获取用户资料
    const profile = await userProfileDAO.findByUserId(userId);

    // 构建用户标签
    const tags: string[] = [];
    if (user.user_type === 'customer') {
      // 根据用户类型添加标签
      // TODO: 这里可以根据会员等级、活跃度等添加更多标签
    }

    res.json(
      successResponse({
        id: user.id.toString(),
        phone: user.phone,
        nickname: user.username || '',
        avatar: user.avatar_url || '/static/default-avatar.png',
        userType: user.user_type.toUpperCase(),
        tags,
        walletBalance: 0, // TODO: 从钱包表查询
        integrals: 0, // TODO: 从积分表查询
        profile: {
          realName: user.real_name || '',
          idCard: user.id_card || '',
          driverLicense: user.driver_license || '',
          gender: profile?.gender || '',
          birthday: profile?.birthday || '',
          address: profile?.address || '',
        },
      })
    );
  } catch (error) {
    logger.error('获取用户信息失败:', error);
    res.status(500).json(errorResponse('获取用户信息失败', 500));
  }
});

/**
 * 2. 更新用户资料
 * PUT /api/v1/users/profile
 */
router.put('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return;
    }

    const { nickname, avatar, gender, birthday, bio: _bio } = req.body;

    // 更新用户基本信息
    if (nickname !== undefined || avatar !== undefined) {
      await userDAO.updateUserInfo(userId, {
        username: nickname,
        avatar_url: avatar,
      });
    }

    // 更新用户资料
    if (gender !== undefined || birthday !== undefined) {
      const profileData: Partial<UserProfile> = {};
      if (gender !== undefined) profileData.gender = gender;
      if (birthday !== undefined) profileData.birthday = birthday;
      await userProfileDAO.upsertProfile(userId, profileData);
    }

    res.json(
      successResponse({
        success: true,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (error) {
    logger.error('更新用户资料失败:', error);
    res.status(500).json(errorResponse('更新用户资料失败', 500));
  }
});

/**
 * 3. 获取用户钱包余额
 * GET /api/v1/users/wallet
 */
router.get('/wallet', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return;
    }

    // Mock钱包数据
    // TODO: 从钱包表查询真实数据
    res.json(
      successResponse({
        balance: 1250.5,
        frozenAmount: 0,
        totalIncome: 5680.0,
        totalExpense: 4429.5,
      })
    );
  } catch (error) {
    logger.error('获取钱包余额失败:', error);
    res.status(500).json(errorResponse('获取钱包余额失败', 500));
  }
});

/**
 * 4. 设置登录密码
 * POST /api/v1/users/password/set
 */
router.post('/password/set', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return;
    }

    if (!newPassword || !confirmPassword) {
      res.status(400).json(errorResponse('新密码和确认密码不能为空', 400));
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json(errorResponse('两次输入的密码不一致', 400));
      return;
    }

    // 密码强度验证
    if (newPassword.length < 6 || newPassword.length > 20) {
      res.status(400).json(errorResponse('密码长度必须在6-20位之间', 400));
      return;
    }

    const user = await userDAO.findById(userId);
    if (!user) {
      res.status(404).json(errorResponse('用户不存在', 404));
      return;
    }

    // 如果已有密码，需要验证旧密码
    if (user.password_hash && oldPassword) {
      const isValid = await userDAO.verifyUserPassword(userId, oldPassword);
      if (!isValid) {
        res.status(400).json(errorResponse('原密码错误', 400));
        return;
      }
    }

    // 更新密码
    await userDAO.updatePassword(userId, newPassword);

    logger.info(`用户设置密码成功: userId=${userId}`);

    res.json(successResponse({ success: true }));
  } catch (error) {
    logger.error('设置密码失败:', error);
    res.status(500).json(errorResponse('设置密码失败', 500));
  }
});

/**
 * 5. 设置支付密码
 * POST /api/v1/users/payment-password/set
 */
router.post('/payment-password/set', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { password, confirmPassword, verifyCode } = req.body;

    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return;
    }

    if (!password || !confirmPassword || !verifyCode) {
      res.status(400).json(errorResponse('密码和验证码不能为空', 400));
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json(errorResponse('两次输入的密码不一致', 400));
      return;
    }

    // 验证码验证
    if (verifyCode !== '123456') {
      res.status(400).json(errorResponse('验证码错误', 400));
      return;
    }

    // 支付密码必须是6位数字
    if (!/^\d{6}$/.test(password)) {
      res.status(400).json(errorResponse('支付密码必须是6位数字', 400));
      return;
    }

    // TODO: 保存支付密码到数据库
    logger.info(`用户设置支付密码成功: userId=${userId}`);

    res.json(successResponse({ success: true }));
  } catch (error) {
    logger.error('设置支付密码失败:', error);
    res.status(500).json(errorResponse('设置支付密码失败', 500));
  }
});

/**
 * 6. 完善用户信息
 * POST /api/v1/users/complete-info
 */
router.post('/complete-info', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { realName, idCard, driverLicenseNo, driverLicenseFront: _driverLicenseFront, driverLicenseBack: _driverLicenseBack } = req.body;

    if (!userId) {
      res.status(401).json(errorResponse('未授权', 401));
      return;
    }

    if (!realName || !idCard || !driverLicenseNo) {
      res.status(400).json(errorResponse('真实姓名、身份证号和驾驶证号不能为空', 400));
      return;
    }

    // 更新用户信息
    await userDAO.updateUserInfo(userId, {
      real_name: realName,
      id_card: idCard,
      driver_license: driverLicenseNo,
    });

    logger.info(`用户完善信息成功: userId=${userId}`);

    res.json(
      successResponse({
        success: true,
        isCompleted: true,
      })
    );
  } catch (error) {
    logger.error('完善用户信息失败:', error);
    res.status(500).json(errorResponse('完善用户信息失败', 500));
  }
});

export default router;
