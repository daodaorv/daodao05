/**
 * 验证规则常量
 */

export const VALIDATION = {
  // 手机号
  PHONE_LENGTH: 11,
  PHONE_REGEX: /^1[3-9]\d{9}$/,

  // 密码
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 20,

  // 验证码
  CODE_LENGTH: 6,
  CODE_COUNTDOWN: 60, // 秒

  // 驾驶证
  DRIVER_LICENSE_MIN_LENGTH: 6,
  DRIVER_LICENSE_MAX_LENGTH: 20,
  DRIVER_LICENSE_REGEX: /^[A-Za-z0-9]{6,20}$/,

  // 姓名
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 20,
} as const;

export const VALIDATION_MESSAGES = {
  PHONE_REQUIRED: '请输入手机号',
  PHONE_INVALID: '请输入有效的手机号',

  PASSWORD_REQUIRED: '请输入密码',
  PASSWORD_TOO_SHORT: '密码至少6位',

  CODE_REQUIRED: '请输入验证码',
  CODE_INVALID: '验证码格式错误',

  NAME_REQUIRED: '请输入姓名',

  DRIVER_LICENSE_REQUIRED: '请输入驾驶证号',
  DRIVER_LICENSE_INVALID: '驾驶证号格式错误',

  LICENSE_PHOTO_FRONT_REQUIRED: '请上传驾驶证正面',
  LICENSE_PHOTO_BACK_REQUIRED: '请上传驾驶证反面',
} as const;
