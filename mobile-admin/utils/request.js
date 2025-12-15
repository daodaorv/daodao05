/**
 * 网络请求封装
 * 统一处理请求拦截、响应拦截、错误处理
 */

import logger from './logger'

// 常量配置
const REQUEST_TIMEOUT = 10000
const HTTP_STATUS_OK = 200
const BUSINESS_CODE_SUCCESS = 0
const BUSINESS_CODE_OK = 200
const BUSINESS_CODE_UNAUTHORIZED = 401
const TOAST_DURATION = 2000

// 配置
const config = {
  // 开发环境使用Mock数据，不请求真实后端
  baseURL: '',
  timeout: REQUEST_TIMEOUT,
  useMock: true // 前端独立开发阶段使用Mock数据
}

// Token管理
const tokenManager = {
  get() {
    return uni.getStorageSync('token') || ''
  },
  set(token) {
    uni.setStorageSync('token', token)
  },
  remove() {
    uni.removeStorageSync('token')
  }
}

/**
 * 请求拦截器
 */
function requestInterceptor(options) {
  // 添加认证信息
  const token = tokenManager.get()
  if (token) {
    options.header = {
      ...options.header,
      'Authorization': `Bearer ${token}`
    }
  }

  // 添加通用header
  options.header = {
    'Content-Type': 'application/json',
    ...options.header
  }

  return options
}

/**
 * 响应拦截器
 */
function responseInterceptor(response) {
  const { statusCode, data } = response

  // HTTP状态码检查
  if (statusCode !== HTTP_STATUS_OK) {
    handleError({
      code: statusCode,
      message: '网络请求失败'
    })
    return Promise.reject(response)
  }

  // 业务状态码检查
  if (data.code !== BUSINESS_CODE_SUCCESS && data.code !== BUSINESS_CODE_OK) {
    // Token过期处理
    if (data.code === BUSINESS_CODE_UNAUTHORIZED) {
      handleTokenExpired()
      return Promise.reject(data)
    }

    handleError(data)
    return Promise.reject(data)
  }

  return data.data || data
}

/**
 * 错误处理
 */
function handleError(error) {
  let message = '请求失败'

  if (error instanceof Error) {
    message = error.message
  } else if (typeof error === 'object' && error !== null) {
    message = error.message || error.msg || '请求失败'
  } else if (typeof error === 'string') {
    message = error
  }

  uni.showToast({
    title: message,
    icon: 'none',
    duration: TOAST_DURATION
  })

  // 使用统一日志工具
  logger.error('Request', '请求失败:', error)
}

/**
 * Token过期处理
 */
function handleTokenExpired() {
  tokenManager.remove()

  uni.showToast({
    title: '登录已过期，请重新登录',
    icon: 'none',
    duration: TOAST_DURATION
  })

  // 延迟跳转到登录页
  setTimeout(() => {
    uni.reLaunch({
      url: '/pages/login/login'
    })
  }, TOAST_DURATION)
}

/**
 * 显示加载提示
 * @param {Object} options - 请求选项
 */
function showLoadingIfNeeded(options) {
  if (options.showLoading !== false) {
    uni.showLoading({
      title: options.loadingText || '加载中...',
      mask: true
    })
  }
}

/**
 * 隐藏加载提示
 * @param {Object} options - 请求选项
 */
function hideLoadingIfNeeded(options) {
  if (options.showLoading !== false) {
    uni.hideLoading()
  }
}

/**
 * 统一请求方法
 */
function request(options) {
  return new Promise((resolve, reject) => {
    // 请求拦截
    options = requestInterceptor(options)

    // 显示加载提示
    showLoadingIfNeeded(options)

    // 发起请求
    uni.request({
      url: config.baseURL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: options.header || {},
      timeout: options.timeout || REQUEST_TIMEOUT,
      success: (res) => {
        // 响应拦截
        responseInterceptor(res)
          .then(data => resolve(data))
          .catch(err => reject(err))
      },
      fail: (err) => {
        handleError({
          message: '网络连接失败，请检查网络设置'
        })
        reject(err)
      },
      complete: () => {
        // 隐藏加载提示
        hideLoadingIfNeeded(options)
      }
    })
  })
}

/**
 * GET请求
 */
export function get(url, params = {}, options = {}) {
  return request({
    url,
    method: 'GET',
    data: params,
    ...options
  })
}

/**
 * POST请求
 */
export function post(url, data = {}, options = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}

/**
 * PUT请求
 */
export function put(url, data = {}, options = {}) {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  })
}

/**
 * DELETE请求
 */
export function del(url, data = {}, options = {}) {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  })
}

/**
 * 文件上传
 */
export function upload(url, filePath, options = {}) {
  return new Promise((resolve, reject) => {
    const token = tokenManager.get()

    uni.showLoading({
      title: '上传中...',
      mask: true
    })

    uni.uploadFile({
      url: config.baseURL + url,
      filePath,
      name: options.name || 'file',
      formData: options.formData || {},
      header: {
        'Authorization': `Bearer ${token}`,
        ...options.header
      },
      success: (res) => {
        const data = JSON.parse(res.data)
        if (data.code === BUSINESS_CODE_SUCCESS || data.code === BUSINESS_CODE_OK) {
          resolve(data.data)
        } else {
          handleError(data)
          reject(data)
        }
      },
      fail: (err) => {
        handleError({
          message: '上传失败，请重试'
        })
        reject(err)
      },
      complete: () => {
        uni.hideLoading()
      }
    })
  })
}

// 导出配置和Token管理器
export { config, tokenManager }

export default {
  get,
  post,
  put,
  del,
  upload,
  config,
  tokenManager
}