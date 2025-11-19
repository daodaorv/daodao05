"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.connectDatabase = connectDatabase;
const sequelize_1 = require("sequelize");
const logger_1 = require("@/utils/logger");
const sequelize = new sequelize_1.Sequelize({
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
    logging: (msg) => logger_1.logger.debug(msg)
});
exports.sequelize = sequelize;
async function connectDatabase() {
    try {
        await sequelize.authenticate();
        logger_1.logger.info('Database connection has been established successfully.');
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            logger_1.logger.info('Database synchronized successfully.');
        }
        return sequelize;
    }
    catch (error) {
        logger_1.logger.error('Unable to connect to the database:', error);
        throw error;
    }
}
//# sourceMappingURL=database.js.map