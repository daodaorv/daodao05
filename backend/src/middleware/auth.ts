import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';

export interface AuthRequest extends Request {
  user?: User;
  userId?: number;
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        code: 401001,
        message: 'No token provided',
        data: null,
      });
      return;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'daodao_secret_key_2024';

    try {
      const decoded = jwt.verify(token, secret) as { userId: number };

      // Find user
      const user = await User.findByPk(decoded.userId);

      if (!user) {
        res.status(401).json({
          code: 401002,
          message: 'User not found',
          data: null,
        });
        return;
      }

      if (user.status !== 'active') {
        res.status(401).json({
          code: 401003,
          message: 'User account is not active',
          data: null,
        });
        return;
      }

      req.user = user;
      req.userId = user.id;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          code: 401004,
          message: 'Token expired',
          data: null,
        });
        return;
      }

      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          code: 401005,
          message: 'Invalid token',
          data: null,
        });
        return;
      }

      throw error;
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: 'Authentication error',
      data: null,
    });
  }
}

// Check if user has specific role
export function authorize(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        code: 401001,
        message: 'Not authenticated',
        data: null,
      });
      return;
    }

    if (!allowedRoles.includes(req.user.user_type)) {
      res.status(403).json({
        code: 403001,
        message: 'Insufficient permissions',
        data: null,
      });
      return;
    }

    next();
  };
}

