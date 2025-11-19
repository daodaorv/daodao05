import { Model, DataTypes, Sequelize } from 'sequelize';

export interface VerificationCodeAttributes {
  id: number;
  phone: string;
  code: string;
  code_type: 'register' | 'login' | 'reset_password' | 'bind_phone';
  is_used: boolean;
  expires_at: Date;
  created_at?: Date;
}

export class VerificationCode extends Model<VerificationCodeAttributes> implements VerificationCodeAttributes {
  public id!: number;
  public phone!: string;
  public code!: string;
  public code_type!: 'register' | 'login' | 'reset_password' | 'bind_phone';
  public is_used!: boolean;
  public expires_at!: Date;
  public readonly created_at!: Date;
}

export function initVerificationCodeModel(sequelize: Sequelize): typeof VerificationCode {
  VerificationCode.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(6),
        allowNull: false,
      },
      code_type: {
        type: DataTypes.ENUM('register', 'login', 'reset_password', 'bind_phone'),
        allowNull: false,
      },
      is_used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'verification_codes',
      timestamps: false,
      underscored: true,
      indexes: [
        { fields: ['phone'] },
        { fields: ['code_type'] },
        { fields: ['expires_at'] },
      ],
    }
  );

  return VerificationCode;
}

