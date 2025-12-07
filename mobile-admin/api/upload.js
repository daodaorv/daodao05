/**
 * 文件上传相关API
 */
import { post } from '@/utils/request'

// 是否使用Mock数据
const USE_MOCK = true

/**
 * 上传图片
 * @param {Object} params - 上传参数
 * @param {string} params.filePath - 文件路径
 * @param {string} params.type - 文件类型（可选）
 * @returns {Promise}
 */
export function uploadImage(params) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      // 模拟上传延迟
      setTimeout(() => {
        resolve({
          code: 200,
          message: '上传成功',
          data: {
            url: params.filePath, // Mock环境直接返回本地路径
            filename: `image_${Date.now()}.jpg`,
            size: Math.floor(Math.random() * 1000000) + 100000,
            uploadTime: new Date().toISOString()
          }
        })
      }, 500)
    })
  }

  // 实际上传逻辑
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${process.env.VUE_APP_API_BASE_URL}/api/v1/upload/image`,
      filePath: params.filePath,
      name: 'file',
      formData: {
        type: params.type || 'general'
      },
      header: {
        'Authorization': `Bearer ${uni.getStorageSync('token')}`
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data)
          if (data.code === 200) {
            resolve(data)
          } else {
            reject(new Error(data.message || '上传失败'))
          }
        } catch (error) {
          reject(new Error('解析响应失败'))
        }
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

/**
 * 批量上传图片
 * @param {Object} params - 上传参数
 * @param {Array} params.filePaths - 文件路径数组
 * @param {string} params.type - 文件类型（可选）
 * @returns {Promise}
 */
export async function uploadImages(params) {
  const { filePaths, type } = params
  const results = []

  for (const filePath of filePaths) {
    try {
      const res = await uploadImage({ filePath, type })
      results.push(res.data)
    } catch (error) {
      console.error('上传图片失败:', error)
      results.push(null)
    }
  }

  return {
    code: 200,
    message: '批量上传完成',
    data: {
      list: results,
      successCount: results.filter(r => r !== null).length,
      failCount: results.filter(r => r === null).length
    }
  }
}

/**
 * 上传文件
 * @param {Object} params - 上传参数
 * @param {string} params.filePath - 文件路径
 * @param {string} params.type - 文件类型（可选）
 * @returns {Promise}
 */
export function uploadFile(params) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '上传成功',
          data: {
            url: params.filePath,
            filename: `file_${Date.now()}.pdf`,
            size: Math.floor(Math.random() * 5000000) + 500000,
            uploadTime: new Date().toISOString()
          }
        })
      }, 800)
    })
  }

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${process.env.VUE_APP_API_BASE_URL}/api/v1/upload/file`,
      filePath: params.filePath,
      name: 'file',
      formData: {
        type: params.type || 'document'
      },
      header: {
        'Authorization': `Bearer ${uni.getStorageSync('token')}`
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data)
          if (data.code === 200) {
            resolve(data)
          } else {
            reject(new Error(data.message || '上传失败'))
          }
        } catch (error) {
          reject(new Error('解析响应失败'))
        }
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

/**
 * 删除文件
 * @param {Object} params - 删除参数
 * @param {string} params.url - 文件URL
 * @returns {Promise}
 */
export function deleteFile(params) {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '删除成功'
    })
  }

  return post('/api/v1/upload/delete', params)
}

/**
 * 获取上传配置
 * @returns {Promise}
 */
export function getUploadConfig() {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '获取成功',
      data: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
        imageMaxSize: 5 * 1024 * 1024, // 5MB
        fileMaxSize: 10 * 1024 * 1024 // 10MB
      }
    })
  }

  return post('/api/v1/upload/config')
}

export default {
  uploadImage,
  uploadImages,
  uploadFile,
  deleteFile,
  getUploadConfig
}
