import { Model, DataTypes, Sequelize } from 'sequelize';

export interface UserProfileAttributes {
  id: number;
  user_id: number;
  gender?: 'male' | 'female' | 'other';
  birthday?: Date;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  work_company?: string;
  work_title?: string;
  preferences?: any;
  created_at?: Date;
  updated_at?: Date;
}

export class UserProfile extends Model<UserProfileAttributes> implements UserProfileAttributes {
  public id!: number;
  public user_id!: number;
  public gender?: 'male' | 'female' | 'other';
  public birthday?: Date;
  public address?: string;
  public emergency_contact?: string;
  public emergency_phone?: string;
  public work_company?: string;
  public work_title?: string;
  public preferences?: any;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export function initUserProfileModel(sequelize: Sequelize): typeof UserProfile {
  UserProfile.init(
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
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
      },
      birthday: {
        type: DataTypes.DATEONLY,
      },
      address: {
        type: DataTypes.TEXT,
      },
      emergency_contact: {
        type: DataTypes.STRING(50),
      },
      emergency_phone: {
        type: DataTypes.STRING(20),
      },
      work_company: {
        type: DataTypes.STRING(100),
      },
      work_title: {
        type: DataTypes.STRING(50),
      },
      preferences: {
        type: DataTypes.JSON,
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
      tableName: 'user_profiles',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['user_id'] },
      ],
    }
  );

  return UserProfile;
}

