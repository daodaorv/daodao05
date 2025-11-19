import Joi from 'joi';

// Register validation schema
export const registerSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^1[3-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format',
      'any.required': 'Phone number is required',
    }),
  password: Joi.string()
    .min(6)
    .max(20)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.max': 'Password must not exceed 20 characters',
      'any.required': 'Password is required',
    }),
  verification_code: Joi.string()
    .length(6)
    .required()
    .messages({
      'string.length': 'Verification code must be 6 digits',
      'any.required': 'Verification code is required',
    }),
  username: Joi.string()
    .min(3)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username must not exceed 50 characters',
    }),
});

// Login with password validation schema
export const loginSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^1[3-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format',
      'any.required': 'Phone number is required',
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required',
    }),
});

// Login with verification code validation schema
export const loginWithCodeSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^1[3-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format',
      'any.required': 'Phone number is required',
    }),
  verification_code: Joi.string()
    .length(6)
    .required()
    .messages({
      'string.length': 'Verification code must be 6 digits',
      'any.required': 'Verification code is required',
    }),
});

// Send verification code validation schema
export const sendCodeSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^1[3-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format',
      'any.required': 'Phone number is required',
    }),
  code_type: Joi.string()
    .valid('register', 'login', 'reset_password', 'bind_phone')
    .required()
    .messages({
      'any.only': 'Invalid code type',
      'any.required': 'Code type is required',
    }),
});

// Update user profile validation schema
export const updateProfileSchema = Joi.object({
  real_name: Joi.string().max(50).optional(),
  email: Joi.string().email().optional(),
  avatar_url: Joi.string().uri().optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  birthday: Joi.date().optional(),
  address: Joi.string().optional(),
  emergency_contact: Joi.string().max(50).optional(),
  emergency_phone: Joi.string().pattern(/^1[3-9]\d{9}$/).optional(),
  work_company: Joi.string().max(100).optional(),
  work_title: Joi.string().max(50).optional(),
});

