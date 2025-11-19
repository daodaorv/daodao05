import { Sequelize } from 'sequelize';
import { initUserModel, User } from './User';
import { initUserProfileModel, UserProfile } from './UserProfile';
import { initUserLoginLogModel, UserLoginLog } from './UserLoginLog';
import { initVerificationCodeModel, VerificationCode } from './VerificationCode';

export function initModels(sequelize: Sequelize) {
  // Initialize all models
  initUserModel(sequelize);
  initUserProfileModel(sequelize);
  initUserLoginLogModel(sequelize);
  initVerificationCodeModel(sequelize);

  // Define associations
  User.hasOne(UserProfile, {
    foreignKey: 'user_id',
    as: 'profile',
  });

  UserProfile.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  User.hasMany(UserLoginLog, {
    foreignKey: 'user_id',
    as: 'login_logs',
  });

  UserLoginLog.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  return {
    User,
    UserProfile,
    UserLoginLog,
    VerificationCode,
  };
}

export { User, UserProfile, UserLoginLog, VerificationCode };

