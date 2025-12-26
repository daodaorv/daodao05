import jwt from 'jsonwebtoken';
import { config } from '@config/index';

/**
 * JWT工具类
 */

export interface JwtPayload {
  userId: number;
  username: string;
  userType: string;
}

/**
 * 生成访问令牌
 */
export function generateToken(payload: JwtPayload): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.sign(payload as any, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as any);
}

/**
 * 生成刷新令牌
 */
export function generateRefreshToken(payload: JwtPayload): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.sign(payload as any, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as any);
}

/**
 * 验证访问令牌
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
}

/**
 * 验证刷新令牌
 */
export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
}
