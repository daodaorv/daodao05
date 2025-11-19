import { Model, DataTypes, Sequelize } from 'sequelize';

export interface UserAttributes {
  id: number;
  username: string;
  phone: string;
  email?: string;
  password_hash: string;
  real_name?: string;
  id_card?: string;
  driver_license?: string;
  avatar_url?: string;
  user_type: 'customer' | 'mobile_admin' | 'pc_admin';
  status: 'active' | 'inactive' | 'banned';
  last_login_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public phone!: string;
  public email?: string;
  public password_hash!: string;
  public real_name?: string;
  public id_card?: string;
  public driver_license?: string;
  public avatar_url?: string;
  public user_type!: 'customer' | 'mobile_admin' | 'pc_admin';
  public status!: 'active' | 'inactive' | 'banned';
  public last_login_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export function initUserModel(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      real_name: {
        type: DataTypes.STRING(50),
      },
      id_card: {
        type: DataTypes.STRING(20),
      },
      driver_license: {
        type: DataTypes.STRING(50),
      },
      avatar_url: {
        type: DataTypes.STRING(500),
      },
      user_type: {
        type: DataTypes.ENUM('customer', 'mobile_admin', 'pc_admin'),
        allowNull: false,
        defaultValue: 'customer',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'banned'),
        allowNull: false,
        defaultValue: 'active',
      },
      last_login_at: {
        type: DataTypes.DATE,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['username'] },
        { fields: ['phone'] },
        { fields: ['email'] },
        { fields: ['user_type'] },
        { fields: ['status'] },
        { fields: ['created_at'] },
      ],
    }
  );

  return User;
}

