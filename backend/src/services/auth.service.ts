import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import { UserProfile } from '@/models/UserProfile';
import { UserLoginLog } from '@/models/UserLoginLog';
import { VerificationCode } from '@/models/VerificationCode';
import { Op } from 'sequelize';

export class AuthService {
  private jwtSecret: string;
  private jwtExpiresIn: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'daodao_secret_key_2024';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  /**
   * Generate JWT token
   */
  private generateToken(userId: number): string {
    return jwt.sign({ userId }, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    } as jwt.SignOptions);
  }

  /**
   * Hash password
   */
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Compare password
   */
  private async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate verification code
   */
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send verification code
   */
  async sendVerificationCode(
    phone: string,
    codeType: 'register' | 'login' | 'reset_password' | 'bind_phone'
  ): Promise<{ success: boolean; expiresIn: number }> {
    // Check if code was sent recently (60 seconds cooldown)
    const recentCode = await VerificationCode.findOne({
      where: {
        phone,
        code_type: codeType,
        created_at: {
          [Op.gte]: new Date(Date.now() - 60000), // Last 60 seconds
        },
      },
    });

    if (recentCode) {
      throw new Error('Please wait 60 seconds before requesting another code');
    }

    // Generate code
    const code = this.generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save code to database
    await VerificationCode.create({
      phone,
      code,
      code_type: codeType,
      is_used: false,
      expires_at: expiresAt,
    } as any);

    // TODO: Send SMS (for now, just log it)
    console.log(`[SMS] Verification code for ${phone}: ${code}`);

    return {
      success: true,
      expiresIn: 300, // 5 minutes in seconds
    };
  }

  /**
   * Verify verification code
   */
  async verifyCode(
    phone: string,
    code: string,
    codeType: 'register' | 'login' | 'reset_password' | 'bind_phone'
  ): Promise<boolean> {
    const verificationCode = await VerificationCode.findOne({
      where: {
        phone,
        code,
        code_type: codeType,
        is_used: false,
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!verificationCode) {
      return false;
    }

    // Mark as used
    await verificationCode.update({ is_used: true });

    return true;
  }

  /**
   * Register new user
   */
  async register(data: {
    phone: string;
    password: string;
    verification_code: string;
    username?: string;
  }): Promise<{ user: User; token: string }> {
    // Verify code
    const isCodeValid = await this.verifyCode(
      data.phone,
      data.verification_code,
      'register'
    );

    if (!isCodeValid) {
      throw new Error('Invalid or expired verification code');
    }

    // Check if user exists
    const existingUser = await User.findOne({
      where: { phone: data.phone },
    });

    if (existingUser) {
      throw new Error('Phone number already registered');
    }

    // Hash password
    const passwordHash = await this.hashPassword(data.password);

    // Create user
    const user = await User.create({
      username: data.username || data.phone,
      phone: data.phone,
      password_hash: passwordHash,
      user_type: 'customer',
      status: 'active',
    } as any);

    // Create user profile
    await UserProfile.create({
      user_id: user.id,
      preferences: {
        theme: 'light',
        language: 'zh-CN',
      },
    } as any);

    // Generate token
    const token = this.generateToken(user.id);

    return { user, token };
  }

  /**
   * Login with password
   */
  async login(data: {
    phone: string;
    password: string;
    loginIp?: string;
    loginDevice?: string;
    loginPlatform?: 'miniprogram' | 'pc' | 'mobile_admin';
  }): Promise<{ user: User; token: string; profile: UserProfile | null }> {
    // Find user
    const user = await User.findOne({
      where: { phone: data.phone },
    });

    console.log('Login attempt:', { phone: data.phone, userFound: !!user });

    if (!user) {
      // Log failed login
      throw new Error('Invalid phone number or password');
    }

    console.log('User found:', { id: user.id, phone: user.phone, hasPassword: !!user.password_hash });

    // Verify password
    const isPasswordValid = await this.comparePassword(
      data.password,
      user.password_hash
    );

    console.log('Password validation:', { isValid: isPasswordValid });

    if (!isPasswordValid) {
      // Log failed login
      await UserLoginLog.create({
        user_id: user.id,
        login_type: 'password',
        login_ip: data.loginIp,
        login_device: data.loginDevice,
        login_platform: data.loginPlatform,
        login_status: 'failed',
        fail_reason: 'Invalid password',
      } as any);

      throw new Error('Invalid phone number or password');
    }

    // Check user status
    if (user.status !== 'active') {
      throw new Error('User account is not active');
    }

    // Update last login time
    await user.update({ last_login_at: new Date() });

    // Log successful login
    await UserLoginLog.create({
      user_id: user.id,
      login_type: 'password',
      login_ip: data.loginIp,
      login_device: data.loginDevice,
      login_platform: data.loginPlatform,
      login_status: 'success',
    } as any);

    // Get user profile
    const profile = await UserProfile.findOne({
      where: { user_id: user.id },
    });

    // Generate token
    const token = this.generateToken(user.id);

    return { user, token, profile };
  }

  /**
   * Login with verification code
   */
  async loginWithCode(data: {
    phone: string;
    verification_code: string;
    loginIp?: string;
    loginDevice?: string;
    loginPlatform?: 'miniprogram' | 'pc' | 'mobile_admin';
  }): Promise<{ user: User; token: string; profile: UserProfile | null }> {
    // Verify code
    const isCodeValid = await this.verifyCode(
      data.phone,
      data.verification_code,
      'login'
    );

    if (!isCodeValid) {
      throw new Error('Invalid or expired verification code');
    }

    // Find user
    const user = await User.findOne({
      where: { phone: data.phone },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check user status
    if (user.status !== 'active') {
      throw new Error('User account is not active');
    }

    // Update last login time
    await user.update({ last_login_at: new Date() });

    // Log successful login
    await UserLoginLog.create({
      user_id: user.id,
      login_type: 'verification_code',
      login_ip: data.loginIp,
      login_device: data.loginDevice,
      login_platform: data.loginPlatform,
      login_status: 'success',
    } as any);

    // Get user profile
    const profile = await UserProfile.findOne({
      where: { user_id: user.id },
    });

    // Generate token
    const token = this.generateToken(user.id);

    return { user, token, profile };
  }
}

