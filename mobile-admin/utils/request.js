// API请求封装 - 移动管理端
import config from '../config/index';

class Request {
  constructor() {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
  }

  request(options) {
    return new Promise((resolve, reject) => {
      const { url, method = 'GET', data = {}, header = {} } = options;

      // 获取token（使用mobile_admin_前缀避免与小程序端冲突）
      const token = uni.getStorageSync('mobile_admin_token');
      if (token) {
        header.Authorization = `Bearer ${token}`;
      }

      uni.request({
        url: this.baseURL + url,
        method,
        data,
        header: {
          'Content-Type': 'application/json',
          ...header,
        },
        timeout: this.timeout,
        success: (res) => {
          if (res.statusCode === 200) {
            // 业务成功
            if (res.data.code === 0 || res.data.code === 200) {
              resolve(res.data.data);
            } else {
              // 业务失败
              const error = new Error(res.data.message || '请求失败');
              error.code = res.data.code;
              reject(error);
            }
          } else if (res.statusCode === 401) {
            // 未授权，清除token
            uni.removeStorageSync('mobile_admin_token');
            uni.removeStorageSync('mobile_admin_userInfo');
            uni.showToast({
              title: '登录已过期，请重新登录',
              icon: 'none',
            });
            setTimeout(() => {
              uni.reLaunch({
                url: '/pages/login/login',
              });
            }, 1500);
            reject(new Error('未授权'));
          } else {
            // HTTP错误
            reject(new Error(res.data.message || `请求失败 (${res.statusCode})`));
          }
        },
        fail: (err) => {
          console.error('Request failed:', err);
          uni.showToast({
            title: '网络请求失败',
            icon: 'none',
          });
          reject(new Error('网络请求失败'));
        },
      });
    });
  }

  get(url, data, header) {
    return this.request({ url, method: 'GET', data, header });
  }

  post(url, data, header) {
    return this.request({ url, method: 'POST', data, header });
  }

  put(url, data, header) {
    return this.request({ url, method: 'PUT', data, header });
  }

  delete(url, data, header) {
    return this.request({ url, method: 'DELETE', data, header });
  }
}

export default new Request();

