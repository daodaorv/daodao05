import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/database';
import { User } from '../models/User';
import { logger } from '../utils/logger';

async function resetPassword() {
  try {
    logger.info('Connecting to database...');
    await connectDatabase();
    logger.info('Database connected.');

    const phone = '13800138000';
    logger.info(`Finding user with phone: ${phone}`);
    const user = await User.findOne({ where: { phone } });

    if (user) {
      logger.info('User found. Hashing new password...');
      const newPassword = '123456';
      const hash = await bcrypt.hash(newPassword, 10);
      logger.info(`New password hash: ${hash}`);

      logger.info('Updating user password...');
      await user.update({ password_hash: hash });
      logger.info('Password reset successfully for user:', { id: user.id });
    } else {
      logger.error(`Admin user with phone ${phone} not found.`);
    }
  } catch (error) {
    logger.error('Error resetting password:', error);
    process.exit(1);
  }
}

resetPassword().finally(() => {
  logger.info('Script finished.');
  process.exit(0);
});

