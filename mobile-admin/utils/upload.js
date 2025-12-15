/**
 * 文件上传工具函数
 * 提供图片上传、文件上传、图片压缩等功能
 */

// 常量配置
const MAX_IMAGE_COUNT = 9
const DEFAULT_COMPRESS_QUALITY = 0.8
const MAX_IMAGE_WIDTH = 1920
const MAX_IMAGE_HEIGHT = 1920
const MAX_FILE_SIZE_MB = 2
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024
const MOCK_UPLOAD_DELAY = 1000
const PROGRESS_INCREMENT = 10
const PROGRESS_INTERVAL = 100

/**
 * 图片压缩配置
 */
const COMPRESS_CONFIG = {
  quality: DEFAULT_COMPRESS_QUALITY,
  maxWidth: MAX_IMAGE_WIDTH,
  maxHeight: MAX_IMAGE_HEIGHT,
  maxSize: MAX_FILE_SIZE
}

/**
 * 文件类型配置
 */
const FILE_TYPES = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  video: ['mp4', 'avi', 'mov'],
  document: ['pdf', 'doc', 'docx', 'xls', 'xlsx']
}

/**
 * 选择图片
 * @param {Object} options - 选项
 * @param {Number} options.count - 最多可选择的图片数量，默认9
 * @param {Array} options.sizeType - 所选的图片的尺寸，默认['original', 'compressed']
 * @param {Array} options.sourceType - 选择图片的来源，默认['album', 'camera']
 * @returns {Promise<Array>} 图片临时文件路径数组
 */
export function chooseImage(options = {}) {
  const {
    count = MAX_IMAGE_COUNT,
    sizeType = ['original', 'compressed'],
    sourceType = ['album', 'camera']
  } = options

  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count,
      sizeType,
      sourceType,
      success: (res) => {
        resolve(res.tempFilePaths)
      },
      fail: (error) => {
        if (error instanceof Error) {
          console.error('选择图片失败:', error.message)
        } else {
          console.error('选择图片失败:', String(error))
        }
        reject(error)
      }
    })
  })
}

/**
 * 压缩图片
 * @param {String} src - 图片路径
 * @param {Object} options - 压缩选项
 * @returns {Promise<String>} 压缩后的图片路径
 */
export function compressImage(src, options = {}) {
  const config = { ...COMPRESS_CONFIG, ...options }

  return new Promise((resolve, reject) => {
    uni.compressImage({
      src,
      quality: config.quality,
      success: (res) => {
        resolve(res.tempFilePath)
      },
      fail: (error) => {
        if (error instanceof Error) {
          console.error('压缩图片失败:', error.message)
        } else {
          console.error('压缩图片失败:', String(error))
        }
        // 压缩失败返回原图
        resolve(src)
      }
    })
  })
}

/**
 * 获取图片信息
 * @param {String} src - 图片路径
 * @returns {Promise<Object>} 图片信息
 */
export function getImageInfo(src) {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src,
      success: (res) => {
        resolve({
          width: res.width,
          height: res.height,
          path: res.path,
          orientation: res.orientation,
          type: res.type
        })
      },
      fail: (error) => {
        if (error instanceof Error) {
          console.error('获取图片信息失败:', error.message)
        } else {
          console.error('获取图片信息失败:', String(error))
        }
        reject(error)
      }
    })
  })
}

/**
 * 处理上传响应
 * @param {Object} res - 上传响应
 * @returns {Object} 解析后的数据
 */
function handleUploadResponse(res) {
  if (res.statusCode !== 200) {
    throw new Error(`上传失败，状态码: ${res.statusCode}`)
  }

  try {
    const data = JSON.parse(res.data)
    if (data.code === 0) {
      return data.data
    } else {
      throw new Error(data.message || '上传失败')
    }
  } catch (err) {
    if (err.message && err.message !== '上传失败') {
      throw new Error('解析响应数据失败')
    }
    throw err
  }
}

/**
 * 设置上传进度监听
 * @param {Object} uploadTask - 上传任务
 * @param {Function} onProgress - 进度回调
 */
function setupProgressListener(uploadTask, onProgress) {
  if (onProgress && typeof onProgress === 'function') {
    uploadTask.onProgressUpdate((res) => {
      onProgress({
        progress: res.progress,
        totalBytesSent: res.totalBytesSent,
        totalBytesExpectedToSend: res.totalBytesExpectedToSend
      })
    })
  }
}

/**
 * 上传文件到服务器
 * @param {String} filePath - 要上传的文件路径
 * @param {Object} options - 上传选项
 * @param {String} options.url - 上传地址
 * @param {String} options.name - 文件对应的 key
 * @param {Object} options.formData - 额外的表单数据
 * @param {Function} options.onProgress - 上传进度回调
 * @returns {Promise<Object>} 上传结果
 */
export function uploadFile(filePath, options = {}) {
  const {
    url = '/api/v1/upload',
    name = 'file',
    formData = {},
    onProgress
  } = options

  return new Promise((resolve, reject) => {
    const uploadTask = uni.uploadFile({
      url,
      filePath,
      name,
      formData,
      success: (res) => {
        try {
          const data = handleUploadResponse(res)
          resolve(data)
        } catch (err) {
          reject(err)
        }
      },
      fail: (error) => {
        if (error instanceof Error) {
          console.error('上传文件失败:', error.message)
        } else {
          console.error('上传文件失败:', String(error))
        }
        reject(error)
      }
    })

    setupProgressListener(uploadTask, onProgress)
  })
}

/**
 * 压缩单张图片（带错误处理）
 * @param {String} filePath - 图片路径
 * @param {Boolean} compress - 是否压缩
 * @param {Object} compressOptions - 压缩选项
 * @returns {Promise<String>} 压缩后的路径
 */
async function compressImageSafely(filePath, compress, compressOptions) {
  if (!compress) {
    return filePath
  }

  try {
    return await compressImage(filePath, compressOptions)
  } catch (error) {
    if (error instanceof Error) {
      console.warn('图片压缩失败，使用原图上传:', error.message)
    } else {
      console.warn('图片压缩失败，使用原图上传:', String(error))
    }
    return filePath
  }
}

/**
 * 上传单张图片
 * @param {String} imagePath - 图片路径
 * @param {Boolean} compress - 是否压缩
 * @param {Object} compressOptions - 压缩选项
 * @param {Object} uploadOptions - 上传选项
 * @returns {Promise<Object>} 上传结果
 */
async function uploadSingleImage(imagePath, compress, compressOptions, uploadOptions) {
  const filePath = await compressImageSafely(imagePath, compress, compressOptions)
  return uploadFile(filePath, uploadOptions)
}

/**
 * 上传图片（带压缩）
 * @param {String|Array} imagePaths - 图片路径或路径数组
 * @param {Object} options - 上传选项
 * @returns {Promise<Object|Array>} 上传结果
 */
export async function uploadImage(imagePaths, options = {}) {
  const {
    compress = true,
    compressOptions = {},
    ...uploadOptions
  } = options

  // 处理单个图片
  if (typeof imagePaths === 'string') {
    return uploadSingleImage(imagePaths, compress, compressOptions, uploadOptions)
  }

  // 处理多个图片
  if (Array.isArray(imagePaths)) {
    const uploadPromises = imagePaths.map(path =>
      uploadSingleImage(path, compress, compressOptions, uploadOptions)
    )
    return Promise.all(uploadPromises)
  }

  throw new Error('imagePaths 必须是字符串或数组')
}

/**
 * 选择并上传图片
 * @param {Object} chooseOptions - 选择图片选项
 * @param {Object} uploadOptions - 上传选项
 * @returns {Promise<Array>} 上传结果数组
 */
export async function chooseAndUploadImage(chooseOptions = {}, uploadOptions = {}) {
  try {
    // 选择图片
    const tempFilePaths = await chooseImage(chooseOptions)

    // 上传图片
    const results = await uploadImage(tempFilePaths, uploadOptions)

    return Array.isArray(results) ? results : [results]
  } catch (error) {
    if (error instanceof Error) {
      console.error('选择并上传图片失败:', error.message)
    } else {
      console.error('选择并上传图片失败:', String(error))
    }
    throw error
  }
}

/**
 * 预览图片
 * @param {Object} options - 预览选项
 * @param {Array} options.urls - 图片地址数组
 * @param {Number} options.current - 当前显示图片的索引
 */
export function previewImage(options = {}) {
  const { urls = [], current = 0 } = options

  if (!urls || urls.length === 0) {
    uni.showToast({
      title: '没有可预览的图片',
      icon: 'none'
    })
    return
  }

  uni.previewImage({
    urls,
    current: typeof current === 'number' ? urls[current] : current
  })
}

/**
 * 处理保存图片失败
 * @param {Object} error - 错误对象
 */
function handleSaveImageError(error) {
  if (error instanceof Error) {
    console.error('保存图片失败:', error.message)
  } else {
    console.error('保存图片失败:', String(error))
  }

  const errMsg = typeof error === 'object' && error !== null ? error.errMsg : String(error)
  if (errMsg.includes('auth deny')) {
    uni.showModal({
      title: '提示',
      content: '需要您授权保存图片到相册',
      success: (res) => {
        if (res.confirm) {
          uni.openSetting()
        }
      }
    })
  } else {
    uni.showToast({
      title: '保存失败',
      icon: 'none'
    })
  }
}

/**
 * 保存图片到相册
 * @param {String} filePath - 图片路径
 * @returns {Promise}
 */
export function saveImageToPhotosAlbum(filePath) {
  return new Promise((resolve, reject) => {
    uni.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })
        resolve()
      },
      fail: (error) => {
        handleSaveImageError(error)
        reject(error)
      }
    })
  })
}

/**
 * 验证文件类型
 * @param {String} fileName - 文件名
 * @param {String} type - 文件类型 (image/video/document)
 * @returns {Boolean}
 */
export function validateFileType(fileName, type = 'image') {
  if (!fileName || typeof fileName !== 'string') {
    return false
  }
  const parts = fileName.split('.')
  if (parts.length < 2) {
    return false
  }
  const ext = parts.pop().toLowerCase()
  const allowedTypes = FILE_TYPES[type] || []
  return allowedTypes.includes(ext)
}

/**
 * 验证文件大小
 * @param {Number} fileSize - 文件大小（字节）
 * @param {Number} maxSize - 最大大小（字节）
 * @returns {Boolean}
 */
export function validateFileSize(fileSize, maxSize = COMPRESS_CONFIG.maxSize) {
  return fileSize <= maxSize
}

/**
 * 格式化文件大小
 * @param {Number} bytes - 字节数
 * @returns {String}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'

  // 边界检查：确保bytes是有效数字
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) {
    console.warn('Invalid bytes value:', bytes)
    return '0 B'
  }

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  // 边界检查：确保索引在有效范围内
  if (i < 0 || i >= sizes.length) {
    console.warn('Size index out of bounds:', i)
    return bytes + ' B'
  }

  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

/**
 * Mock 上传（用于开发测试）
 * @param {String} filePath - 文件路径
 * @param {Object} options - 选项
 * @returns {Promise<Object>}
 */
export function mockUpload(filePath, options = {}) {
  return new Promise((resolve) => {
    // 模拟上传进度
    if (options.onProgress) {
      let progress = 0
      const timer = setInterval(() => {
        progress += PROGRESS_INCREMENT
        options.onProgress({ progress })
        if (progress >= 100) {
          clearInterval(timer)
        }
      }, PROGRESS_INTERVAL)
    }

    // 模拟上传延迟
    setTimeout(() => {
      resolve({
        url: filePath, // 开发环境直接返回本地路径
        fileName: filePath.split('/').pop(),
        fileSize: Math.floor(Math.random() * 1000000),
        uploadTime: new Date().toISOString()
      })
    }, MOCK_UPLOAD_DELAY)
  })
}

export default {
  chooseImage,
  compressImage,
  getImageInfo,
  uploadFile,
  uploadImage,
  chooseAndUploadImage,
  previewImage,
  saveImageToPhotosAlbum,
  validateFileType,
  validateFileSize,
  formatFileSize,
  mockUpload
}
