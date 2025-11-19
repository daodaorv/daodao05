import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { validateRequest } from '@/middleware/validation';
import {
  registerSchema,
  loginSchema,
  loginWithCodeSchema,
  sendCodeSchema,
} from '@/validators/auth.validator';

const router = Router();
const authController = new AuthController();

// Send verification code
router.post(
  '/send-code',
  validateRequest(sendCodeSchema),
  authController.sendCode
);

// Register
router.post(
  '/register',
  validateRequest(registerSchema),
  authController.register
);

// Login with password
router.post('/login', validateRequest(loginSchema), authController.login);

// Login with verification code
router.post(
  '/login-with-code',
  validateRequest(loginWithCodeSchema),
  authController.loginWithCode
);

export default router;

