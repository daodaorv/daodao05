import request from '@/utils/request';

export const authApi = {
  // 发送验证码
  sendCode(data) {
    return request.post('/auth/send-code', data);
  },

  // 用户注册
  register(data) {
    return request.post('/auth/register', data);
  },

  // 密码登录
  login(data) {
    return request.post('/auth/login', data);
  },

  // 验证码登录
  loginWithCode(data) {
    return request.post('/auth/login-with-code', data);
  },

  // 获取用户信息
  getUserInfo() {
    return request.get('/users/profile');
  },

  // 更新用户信息
  updateUserInfo(data) {
    return request.put('/users/profile', data);
  },

  // 获取登录日志
  getLoginLogs(params) {
    return request.get('/users/login-logs', params);
  },
};

