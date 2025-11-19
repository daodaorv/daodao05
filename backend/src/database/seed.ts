import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/database';
import { User } from '../models/User';
import { UserProfile } from '../models/UserProfile';
import { logger } from '../utils/logger';

async function seed() {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('Database connected');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { phone: '13800138000' } });
    
    if (existingAdmin) {
      logger.info('Admin user already exists, skipping seed');
      process.exit(0);
    }

    // Create admin user
    const passwordHash = await bcrypt.hash('123456', 10);
    
    const adminUser = await User.create({
      username: 'admin',
      phone: '13800138000',
      password_hash: passwordHash,
      user_type: 'admin',
      status: 'active',
    } as any);

    logger.info('Admin user created:', { id: adminUser.id, phone: adminUser.phone });

    // Create user profile
    await UserProfile.create({
      user_id: adminUser.id,
      nickname: '系统管理员',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      gender: 'unknown',
      preferences: {
        theme: 'light',
        language: 'zh-CN',
      },
    } as any);

    logger.info('Admin profile created');

    // Create test customer user
    const customerUser = await User.create({
      username: '测试用户',
      phone: '13900139000',
      password_hash: passwordHash,
      user_type: 'customer',
      status: 'active',
    } as any);

    logger.info('Customer user created:', { id: customerUser.id, phone: customerUser.phone });

    // Create customer profile
    await UserProfile.create({
      user_id: customerUser.id,
      nickname: '测试用户',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=customer',
      gender: 'unknown',
      preferences: {
        theme: 'light',
        language: 'zh-CN',
      },
    } as any);

    logger.info('Customer profile created');

    logger.info('Database seeding completed successfully');
    logger.info('Admin credentials: phone=13800138000, password=123456');
    logger.info('Customer credentials: phone=13900139000, password=123456');
    
    process.exit(0);
  } catch (error) {
    logger.error('Database seeding failed:', error);
    process.exit(1);
  }
}

seed();

