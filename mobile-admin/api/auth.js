import request from '../utils/request';

/**
 * 认证相关API - 移动管理端
 */
export const authApi = {
  /**
   * 管理员登录（密码登录）
   * @param {Object} data - 登录数据
   * @param {string} data.phone - 手机号
   * @param {string} data.password - 密码
   * @returns {Promise}
   */
  login(data) {
    return request.post('/auth/login', {
      ...data,
      login_type: 'password',
      platform: 'mobile-admin'
    });
  },

  /**
   * 退出登录
   * @returns {Promise}
   */
  logout() {
    return request.post('/auth/logout');
  },

  /**
   * 获取当前登录用户信息
   * @returns {Promise}
   */
  getCurrentUser() {
    return request.get('/users/profile');
  }
};

