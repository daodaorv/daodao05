import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { config } from '@config/index';
import { logger } from '@utils/logger';
import routes from '@routes/index';

/**
 * 创建Express应用
 */
export function createApp(): Application {
  const app = express();

  // 安全中间件
  app.use(helmet());

  // CORS配置
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: true,
    })
  );

  // 压缩响应
  app.use(compression());

  // 解析JSON请求体
  app.use(express.json({ limit: '10mb' }));

  // 解析URL编码请求体
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 请求日志
  app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });

  // 挂载路由
  app.use('/api', routes);

  // 404处理
  app.use((_req, res) => {
    res.status(404).json({
      code: 404,
      message: '接口不存在',
    });
  });

  // 错误处理
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error('服务器错误:', err);
    res.status(500).json({
      code: 500,
      message: config.env === 'production' ? '服务器内部错误' : err.message,
    });
  });

  return app;
}
