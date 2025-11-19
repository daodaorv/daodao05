import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Send verification code
   * POST /api/v1/auth/send-code
   */
  sendCode = async (req: Request, res: Response) => {
    try {
      const { phone, code_type } = req.body;

      const result = await this.authService.sendVerificationCode(
        phone,
        code_type
      );

      res.json({
        code: 0,
        message: 'Verification code sent successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        code: 400002,
        message: error.message || 'Failed to send verification code',
        data: null,
      });
    }
  };

  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  register = async (req: Request, res: Response) => {
    try {
      const { phone, password, verification_code, username } = req.body;

      const result = await this.authService.register({
        phone,
        password,
        verification_code,
        username,
      });

      // Remove password_hash from response
      const userResponse = result.user.toJSON();
      delete (userResponse as any).password_hash;

      res.status(201).json({
        code: 0,
        message: 'User registered successfully',
        data: {
          user: userResponse,
          token: result.token,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        code: 400003,
        message: error.message || 'Registration failed',
        data: null,
      });
    }
  };

  /**
   * Login with password
   * POST /api/v1/auth/login
   */
  login = async (req: Request, res: Response) => {
    try {
      const { phone, password } = req.body;
      const loginIp = req.ip;
      const loginDevice = req.get('User-Agent');
      const loginPlatform = req.body.platform || 'pc';

      const result = await this.authService.login({
        phone,
        password,
        loginIp,
        loginDevice,
        loginPlatform,
      });

      // Remove password_hash from response
      const userResponse = result.user.toJSON();
      delete (userResponse as any).password_hash;

      res.json({
        code: 0,
        message: 'Login successful',
        data: {
          user: userResponse,
          profile: result.profile,
          token: result.token,
        },
      });
    } catch (error: any) {
      res.status(401).json({
        code: 401006,
        message: error.message || 'Login failed',
        data: null,
      });
    }
  };

  /**
   * Login with verification code
   * POST /api/v1/auth/login-with-code
   */
  loginWithCode = async (req: Request, res: Response) => {
    try {
      const { phone, verification_code } = req.body;
      const loginIp = req.ip;
      const loginDevice = req.get('User-Agent');
      const loginPlatform = req.body.platform || 'miniprogram';

      const result = await this.authService.loginWithCode({
        phone,
        verification_code,
        loginIp,
        loginDevice,
        loginPlatform,
      });

      // Remove password_hash from response
      const userResponse = result.user.toJSON();
      delete (userResponse as any).password_hash;

      res.json({
        code: 0,
        message: 'Login successful',
        data: {
          user: userResponse,
          profile: result.profile,
          token: result.token,
        },
      });
    } catch (error: any) {
      res.status(401).json({
        code: 401007,
        message: error.message || 'Login failed',
        data: null,
      });
    }
  };
}

