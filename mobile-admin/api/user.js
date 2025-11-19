import request from '../utils/request';

/**
 * 用户管理相关API - 移动管理端
 */
export const userApi = {
  /**
   * 获取用户列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.page_size - 每页数量
   * @param {string} params.keyword - 搜索关键词（手机号/昵称）
   * @param {string} params.role - 角色筛选
   * @param {string} params.status - 状态筛选
   * @returns {Promise}
   */
  getUserList(params) {
    return request.get('/users', params);
  },

  /**
   * 获取用户详情
   * @param {number} userId - 用户ID
   * @returns {Promise}
   */
  getUserDetail(userId) {
    return request.get(`/users/${userId}`);
  },

  /**
   * 更新用户信息
   * @param {number} userId - 用户ID
   * @param {Object} data - 更新数据
   * @returns {Promise}
   */
  updateUser(userId, data) {
    return request.put(`/users/${userId}`, data);
  },

  /**
   * 更新用户状态
   * @param {number} userId - 用户ID
   * @param {string} status - 状态（active/disabled）
   * @returns {Promise}
   */
  updateUserStatus(userId, status) {
    return request.put(`/users/${userId}/status`, { status });
  },

  /**
   * 删除用户
   * @param {number} userId - 用户ID
   * @returns {Promise}
   */
  deleteUser(userId) {
    return request.delete(`/users/${userId}`);
  }
};

