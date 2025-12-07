/**
 * 车辆相关Mock数据
 */

// 默认车辆图片（1x1 透明 PNG）
const DEFAULT_VEHICLE_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

// 模拟车辆数据
const mockVehicles = [
  {
    id: 1,
    name: '大通V90房车',
    plate: '京A12345',
    brand: '上汽大通',
    model: 'V90',
    type: 'C型房车',
    status: 'available',
    statusText: '可用',
    seats: 4,
    beds: 2,
    mileage: 12500,
    dailyPrice: 800,
    location: '北京朝阳门店',
    image: DEFAULT_VEHICLE_IMAGE,
    lastMaintenance: '2025-11-15',
    nextMaintenance: '2025-12-15'
  },
  {
    id: 2,
    name: '依维柯C型房车',
    plate: '京B23456',
    brand: '依维柯',
    model: 'Daily',
    type: 'C型房车',
    status: 'rented',
    statusText: '租用中',
    seats: 6,
    beds: 4,
    mileage: 8900,
    dailyPrice: 900,
    location: '北京朝阳门店',
    image: DEFAULT_VEHICLE_IMAGE,
    lastMaintenance: '2025-11-10',
    nextMaintenance: '2025-12-10'
  },
  {
    id: 3,
    name: '福特全顺房车',
    plate: '京C34567',
    brand: '福特',
    model: '全顺',
    type: 'B型房车',
    status: 'rented',
    statusText: '租用中',
    seats: 4,
    beds: 2,
    mileage: 15600,
    dailyPrice: 700,
    location: '北京海淀门店',
    image: DEFAULT_VEHICLE_IMAGE,
    lastMaintenance: '2025-11-05',
    nextMaintenance: '2025-12-05'
  },
  {
    id: 4,
    name: '奔驰斯宾特房车',
    plate: '京D45678',
    brand: '奔驰',
    model: 'Sprinter',
    type: 'B型房车',
    status: 'maintenance',
    statusText: '维护中',
    seats: 6,
    beds: 3,
    mileage: 6700,
    dailyPrice: 1500,
    location: '北京朝阳门店',
    image: DEFAULT_VEHICLE_IMAGE,
    lastMaintenance: '2025-11-28',
    nextMaintenance: '2025-12-28'
  },
  {
    id: 5,
    name: '大通V90房车',
    plate: '京E56789',
    brand: '上汽大通',
    model: 'V90',
    type: 'C型房车',
    status: 'disabled',
    statusText: '禁用',
    seats: 4,
    beds: 2,
    mileage: 25000,
    dailyPrice: 800,
    location: '北京海淀门店',
    image: DEFAULT_VEHICLE_IMAGE,
    lastMaintenance: '2025-10-20',
    nextMaintenance: '2025-11-20'
  }
]

function formatDateTime(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

const mockUploadHistory = [
  {
    id: 'history_1',
    vehicleId: 1,
    type: 'inspection',
    remark: 'Pre-rental inspection photos',
    operator: 'Operator A',
    createTime: '2025-11-26 09:30',
    photos: [
      {
        url: DEFAULT_VEHICLE_IMAGE,
        location: '39.9042,116.4074',
        locationName: 'Beijing HQ',
        time: '2025-11-26 09:25'
      },
      {
        url: DEFAULT_VEHICLE_IMAGE,
        location: '39.9042,116.4074',
        locationName: 'Beijing HQ',
        time: '2025-11-26 09:26'
      }
    ]
  },
  {
    id: 'history_2',
    vehicleId: 1,
    type: 'damage',
    remark: 'Customer reported scratch',
    operator: 'Operator B',
    createTime: '2025-11-20 18:15',
    photos: [
      {
        url: DEFAULT_VEHICLE_IMAGE,
        location: '31.2304,121.4737',
        locationName: 'Shanghai Service Center',
        time: '2025-11-20 18:10'
      }
    ]
  },
  {
    id: 'history_3',
    vehicleId: 2,
    type: 'maintenance',
    remark: 'Regular maintenance record',
    operator: 'Operator C',
    createTime: '2025-11-18 11:05',
    photos: [
      {
        url: DEFAULT_VEHICLE_IMAGE,
        location: '22.5431,114.0579',
        locationName: 'Shenzhen Workshop',
        time: '2025-11-18 10:55'
      },
      {
        url: DEFAULT_VEHICLE_IMAGE,
        location: '22.5431,114.0579',
        locationName: 'Shenzhen Workshop',
        time: '2025-11-18 10:56'
      }
    ]
  }
]

/**
 * 获取车辆列表
 */
export function getVehicleList(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredVehicles = [...mockVehicles]

      // 根据状态筛选
      if (params && params.status) {
        filteredVehicles = filteredVehicles.filter(vehicle => vehicle.status === params.status)
      }

      // 根据关键词搜索
      if (params && params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredVehicles = filteredVehicles.filter(vehicle =>
          vehicle.name.toLowerCase().includes(keyword) ||
          vehicle.plate.includes(keyword) ||
          vehicle.brand.includes(keyword)
        )
      }

      resolve({
        list: filteredVehicles,
        total: filteredVehicles.length
      })
    }, 500)
  })
}

/**
 * 获取车辆详情
 */
export function getVehicleDetail(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const vehicle = mockVehicles.find(v => v.id === parseInt(id))

      if (vehicle) {
        resolve({
          ...vehicle,
          features: ['空调', '冰箱', '微波炉', '卫生间', '淋浴', '太阳能板'],
          images: [
            DEFAULT_VEHICLE_IMAGE,
            DEFAULT_VEHICLE_IMAGE,
            DEFAULT_VEHICLE_IMAGE
          ],
          description: '这是一辆配置齐全的房车，适合家庭出游。',
          insurance: '全险',
          documents: [
            { name: '行驶证', url: 'https://example.com/doc1.pdf' },
            { name: '保险单', url: 'https://example.com/doc2.pdf' }
          ]
        })
      } else {
        reject({
          code: 404,
          message: '车辆不存在'
        })
      }
    }, 500)
  })
}

/**
 * 更新车辆状态
 */
export function updateVehicleStatus(id, status, remark) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        status,
        remark,
        message: '车辆状态更新成功'
      })
    }, 500)
  })
}

/**
 * 添加维保记录
 */
export function addMaintenanceRecord(id, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        message: '维保记录添加成功'
      })
    }, 500)
  })
}

/**
 * 获取维保记录
 */
export function getMaintenanceRecords(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: [
          {
            id: 1,
            type: '定期保养',
            date: '2025-11-15',
            mileage: 12000,
            cost: 800,
            items: ['更换机油', '更换机滤', '检查刹车'],
            operator: '张师傅',
            remark: '保养正常'
          },
          {
            id: 2,
            type: '故障维修',
            date: '2025-10-20',
            mileage: 11500,
            cost: 1200,
            items: ['更换刹车片', '调整刹车系统'],
            operator: '李师傅',
            remark: '刹车片磨损严重'
          }
        ]
      })
    }, 500)
  })
}

/**
 * 上传车辆照片
 */
export function uploadVehiclePhotos(data = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date()
      const record = {
        id: `history_${Date.now()}`,
        vehicleId: data.vehicleId || 0,
        type: data.type || 'inspection',
        remark: data.remark || '',
        operator: data.operator || 'On-site staff',
        createTime: formatDateTime(now),
        photos: (data.photos || []).map((photo, index) => ({
          url: photo.url || DEFAULT_VEHICLE_IMAGE,
          location: photo.location || '',
          locationName: photo.locationName || '',
          time: photo.time || formatDateTime(now),
          id: photo.id || `${Date.now()}_${index}`
        }))
      }

      if (record.photos.length === 0) {
        record.photos.push({
          url: DEFAULT_VEHICLE_IMAGE,
          location: '',
          locationName: '',
          time: formatDateTime(now),
          id: `${record.id}_0`
        })
      }

      mockUploadHistory.unshift(record)

      resolve({
        code: 200,
        message: 'Upload success',
        data: {
          id: record.id
        }
      })
    }, 500)
  })
}

/**
 * 获取车辆上传历史
 */
export function getUploadHistory(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let list = [...mockUploadHistory]
      if (params.vehicleId) {
        const vehicleId = String(params.vehicleId)
        list = list.filter(item => String(item.vehicleId) === vehicleId)
      }

      resolve({
        code: 200,
        message: 'Success',
        data: {
          list,
          total: list.length
        }
      })
    }, 400)
  })
}

export default {
  getVehicleList,
  getVehicleDetail,
  updateVehicleStatus,
  addMaintenanceRecord,
  getMaintenanceRecords,
  uploadVehiclePhotos,
  getUploadHistory
}
