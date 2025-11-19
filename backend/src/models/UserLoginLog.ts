import { Model, DataTypes, Sequelize } from 'sequelize';

export interface UserLoginLogAttributes {
  id: number;
  user_id: number;
  login_type: 'password' | 'wechat' | 'alipay' | 'douyin' | 'verification_code';
  login_ip?: string;
  login_device?: string;
  login_platform?: 'miniprogram' | 'pc' | 'mobile_admin';
  login_time?: Date;
  login_status: 'success' | 'failed';
  fail_reason?: string;
}

export class UserLoginLog extends Model<UserLoginLogAttributes> implements UserLoginLogAttributes {
  public id!: number;
  public user_id!: number;
  public login_type!: 'password' | 'wechat' | 'alipay' | 'douyin' | 'verification_code';
  public login_ip?: string;
  public login_device?: string;
  public login_platform?: 'miniprogram' | 'pc' | 'mobile_admin';
  public readonly login_time!: Date;
  public login_status!: 'success' | 'failed';
  public fail_reason?: string;
}

export function initUserLoginLogModel(sequelize: Sequelize): typeof UserLoginLog {
  UserLoginLog.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      login_type: {
        type: DataTypes.ENUM('password', 'wechat', 'alipay', 'douyin', 'verification_code'),
        allowNull: false,
      },
      login_ip: {
        type: DataTypes.STRING(50),
      },
      login_device: {
        type: DataTypes.STRING(200),
      },
      login_platform: {
        type: DataTypes.ENUM('miniprogram', 'pc', 'mobile_admin'),
      },
      login_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      login_status: {
        type: DataTypes.ENUM('success', 'failed'),
        allowNull: false,
        defaultValue: 'success',
      },
      fail_reason: {
        type: DataTypes.STRING(200),
      },
    },
    {
      sequelize,
      tableName: 'user_login_logs',
      timestamps: false, // login_time is the timestamp
      underscored: true,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['login_time'] },
        { fields: ['login_status'] },
      ],
    }
  );

  return UserLoginLog;
}

