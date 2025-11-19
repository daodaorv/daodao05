import { Sequelize } from 'sequelize';
import { logger } from '@/utils/logger';
import { initModels } from '@/models';

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'daodao',
  username: process.env.DB_USER || 'daodao_dev',
  password: process.env.DB_PASSWORD || 'daodao_dev_2024',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  dialect: 'mysql',
  timezone: '+08:00',
  define: {
    timestamps: true,
    underscored: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: (msg) => logger.debug(msg)
});

export async function connectDatabase(): Promise<Sequelize> {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');

    // Initialize models
    initModels(sequelize);
    logger.info('Database models initialized successfully.');

    // Sync database (for development only)
    // Note: We don't use sync() because we manage schema with SQL migrations
    // if (process.env.NODE_ENV === 'development') {
    //   await sequelize.sync({ alter: true });
    //   logger.info('Database synchronized successfully.');
    // }

    return sequelize;
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
}

export { sequelize };