import { User } from '@/models/User';
import { UserProfile } from '@/models/UserProfile';
import { UserLoginLog } from '@/models/UserLoginLog';
import { Op } from 'sequelize';

export class UserService {
  /**
   * Get user profile
   */
  async getUserProfile(userId: number): Promise<{
    user: User;
    profile: UserProfile | null;
  }> {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const profile = await UserProfile.findOne({
      where: { user_id: userId },
    });

    return { user, profile };
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: number,
    data: {
      real_name?: string;
      email?: string;
      avatar_url?: string;
      gender?: 'male' | 'female' | 'other';
      birthday?: Date;
      address?: string;
      emergency_contact?: string;
      emergency_phone?: string;
      work_company?: string;
      work_title?: string;
    }
  ): Promise<{ user: User; profile: UserProfile }> {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Update user basic info
    const userUpdates: any = {};
    if (data.real_name !== undefined) userUpdates.real_name = data.real_name;
    if (data.email !== undefined) userUpdates.email = data.email;
    if (data.avatar_url !== undefined) userUpdates.avatar_url = data.avatar_url;

    if (Object.keys(userUpdates).length > 0) {
      await user.update(userUpdates);
    }

    // Update or create profile
    let profile = await UserProfile.findOne({
      where: { user_id: userId },
    });

    const profileUpdates: any = {};
    if (data.gender !== undefined) profileUpdates.gender = data.gender;
    if (data.birthday !== undefined) profileUpdates.birthday = data.birthday;
    if (data.address !== undefined) profileUpdates.address = data.address;
    if (data.emergency_contact !== undefined)
      profileUpdates.emergency_contact = data.emergency_contact;
    if (data.emergency_phone !== undefined)
      profileUpdates.emergency_phone = data.emergency_phone;
    if (data.work_company !== undefined)
      profileUpdates.work_company = data.work_company;
    if (data.work_title !== undefined)
      profileUpdates.work_title = data.work_title;

    if (profile) {
      await profile.update(profileUpdates);
    } else {
      profile = await UserProfile.create({
        user_id: userId,
        ...profileUpdates,
      });
    }

    return { user, profile };
  }

  /**
   * Get user login logs
   */
  async getUserLoginLogs(
    userId: number,
    limit: number = 10
  ): Promise<UserLoginLog[]> {
    return UserLoginLog.findAll({
      where: { user_id: userId },
      order: [['login_time', 'DESC']],
      limit,
    });
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(params: {
    page?: number;
    pageSize?: number;
    status?: 'active' | 'inactive' | 'banned';
    userType?: 'customer' | 'mobile_admin' | 'pc_admin';
    search?: string;
  }): Promise<{
    users: User[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const offset = (page - 1) * pageSize;

    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.userType) where.user_type = params.userType;

    // Search by phone or username
    if (params.search) {
      where[Op.or] = [
        { phone: { [Op.like]: `%${params.search}%` } },
        { username: { [Op.like]: `%${params.search}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash'] },
      limit: pageSize,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      users: rows,
      total: count,
      page,
      pageSize,
    };
  }

  /**
   * Update user status (admin only)
   */
  async updateUserStatus(
    userId: number,
    status: 'active' | 'inactive' | 'banned'
  ): Promise<User> {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    await user.update({ status });

    return user;
  }
}

