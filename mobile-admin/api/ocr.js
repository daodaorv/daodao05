/**
 * OCR识别相关API
 */
import { post } from '@/utils/request'

// 是否使用Mock数据
const USE_MOCK = true

/**
 * Mock数据
 */
const mockData = {
  idCard: {
    name: '张三',
    gender: '男',
    nation: '汉',
    birth: '1990-01-01',
    idNumber: '110101199001011234',
    address: '北京市东城区某某街道某某小区',
    issueAuthority: '北京市公安局东城分局',
    validPeriod: '2020.01.01-2030.01.01'
  },
  license: {
    name: '张三',
    licenseNumber: '110101199001011234',
    vehicleType: 'C1',
    validPeriod: '2020.01.01-2026.01.01',
    issueDate: '2020-01-01',
    issueAuthority: '北京市公安局交通管理局'
  }
}

/**
 * 扫描二维码/条形码
 * @param {Object} params - 扫描参数
 * @returns {Promise}
 */
export function scanCode(params) {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '扫描成功',
      data: {
        content: 'https://example.com/vehicle/12345',
        type: 'qrcode'
      }
    })
  }

  return post('/api/v1/ocr/scan', params)
}

/**
 * 识别身份证
 * @param {Object} params - 识别参数
 * @param {string} params.imagePath - 图片路径
 * @param {string} params.side - 正反面（front/back）
 * @returns {Promise}
 */
export function recognizeIdCard(params) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '识别成功',
          data: mockData.idCard
        })
      }, 1500)
    })
  }

  // 实际上传并识别
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${process.env.VUE_APP_API_BASE_URL}/api/v1/ocr/idcard`,
      filePath: params.imagePath,
      name: 'image',
      formData: {
        side: params.side || 'front'
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
            reject(new Error(data.message || '识别失败'))
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
 * 识别驾驶证
 * @param {Object} params - 识别参数
 * @param {string} params.imagePath - 图片路径
 * @returns {Promise}
 */
export function recognizeLicense(params) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '识别成功',
          data: mockData.license
        })
      }, 1500)
    })
  }

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${process.env.VUE_APP_API_BASE_URL}/api/v1/ocr/license`,
      filePath: params.imagePath,
      name: 'image',
      header: {
        'Authorization': `Bearer ${uni.getStorageSync('token')}`
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data)
          if (data.code === 200) {
            resolve(data)
          } else {
            reject(new Error(data.message || '识别失败'))
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
 * 识别行驶证
 * @param {Object} params - 识别参数
 * @param {string} params.imagePath - 图片路径
 * @returns {Promise}
 */
export function recognizeVehicleLicense(params) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '识别成功',
          data: {
            plateNumber: '京A12345',
            vehicleType: '小型轿车',
            owner: '张三',
            address: '北京市东城区',
            useCharacter: '非营运',
            model: '大通V90',
            vin: 'LZYTBAA12345678',
            engineNumber: 'ABC123456',
            registerDate: '2020-01-01',
            issueDate: '2020-01-01'
          }
        })
      }, 1500)
    })
  }

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${process.env.VUE_APP_API_BASE_URL}/api/v1/ocr/vehicle-license`,
      filePath: params.imagePath,
      name: 'image',
      header: {
        'Authorization': `Bearer ${uni.getStorageSync('token')}`
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data)
          if (data.code === 200) {
            resolve(data)
          } else {
            reject(new Error(data.message || '识别失败'))
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
 * 通用文字识别
 * @param {Object} params - 识别参数
 * @param {string} params.imagePath - 图片路径
 * @returns {Promise}
 */
export function recognizeText(params) {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '识别成功',
      data: {
        text: '这是识别出的文字内容',
        words: ['这是', '识别出', '的', '文字', '内容']
      }
    })
  }

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${process.env.VUE_APP_API_BASE_URL}/api/v1/ocr/text`,
      filePath: params.imagePath,
      name: 'image',
      header: {
        'Authorization': `Bearer ${uni.getStorageSync('token')}`
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data)
          if (data.code === 200) {
            resolve(data)
          } else {
            reject(new Error(data.message || '识别失败'))
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
 * 获取OCR识别历史
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getOcrHistory(params = {}) {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 200,
      message: '获取成功',
      data: {
        list: [
          {
            id: 1,
            type: 'idcard',
            content: '110101199001011234',
            data: mockData.idCard,
            createTime: '2025-12-06 10:30:00'
          },
          {
            id: 2,
            type: 'license',
            content: '110101199001011234',
            data: mockData.license,
            createTime: '2025-12-06 09:15:00'
          }
        ],
        total: 2
      }
    })
  }

  return post('/api/v1/ocr/history', params)
}

export default {
  scanCode,
  recognizeIdCard,
  recognizeLicense,
  recognizeVehicleLicense,
  recognizeText,
  getOcrHistory
}
