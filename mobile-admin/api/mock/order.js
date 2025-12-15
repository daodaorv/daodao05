/**
 * 订单相关Mock数据
 */

// 模拟订单数据
const mockOrders = [
  {
    id: 1,
    orderNo: '20231129001',
    status: 'pending',
    statusText: '待确认',
    customerName: '张三',
    customerPhone: '13800138000',
    vehicleName: '大通V90房车',
    vehiclePlate: '京A12345',
    startDate: '2025-12-01',
    endDate: '2025-12-05',
    days: 4,
    totalAmount: 3200,
    deposit: 5000,
    createTime: '2025-11-29 10:30:00',
    remark: '客户要求尽快确认'
  },
  {
    id: 2,
    orderNo: '20231129002',
    status: 'confirmed',
    statusText: '已确认',
    customerName: '李四',
    customerPhone: '13800138001',
    vehicleName: '依维柯C型房车',
    vehiclePlate: '京B23456',
    startDate: '2025-12-02',
    endDate: '2025-12-08',
    days: 6,
    totalAmount: 4800,
    deposit: 5000,
    createTime: '2025-11-29 09:15:00',
    remark: ''
  },
  {
    id: 3,
    orderNo: '20231128003',
    status: 'in_use',
    statusText: '使用中',
    customerName: '王五',
    customerPhone: '13800138002',
    vehicleName: '福特全顺房车',
    vehiclePlate: '京C34567',
    startDate: '2025-11-28',
    endDate: '2025-12-02',
    days: 4,
    totalAmount: 2800,
    deposit: 5000,
    createTime: '2025-11-27 14:20:00',
    remark: ''
  },
  {
    id: 4,
    orderNo: '20231128004',
    status: 'completed',
    statusText: '已完成',
    customerName: '赵六',
    customerPhone: '13800138003',
    vehicleName: '奔驰斯宾特房车',
    vehiclePlate: '京D45678',
    startDate: '2025-11-25',
    endDate: '2025-11-28',
    days: 3,
    totalAmount: 4500,
    deposit: 5000,
    createTime: '2025-11-24 16:45:00',
    remark: ''
  },
  {
    id: 5,
    orderNo: '20231127005',
    status: 'cancelled',
    statusText: '已取消',
    customerName: '孙七',
    customerPhone: '13800138004',
    vehicleName: '大通V90房车',
    vehiclePlate: '京A12345',
    startDate: '2025-11-30',
    endDate: '2025-12-03',
    days: 3,
    totalAmount: 2400,
    deposit: 5000,
    createTime: '2025-11-27 11:30:00',
    remark: '客户临时取消'
  }
]

/**
 * 获取订单列表
 */
export function getOrderList(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredOrders = [...mockOrders]

      // 根据状态筛选
      if (params && params.status) {
        filteredOrders = filteredOrders.filter(order => order.status === params.status)
      }

      // 根据关键词搜索
      if (params && params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredOrders = filteredOrders.filter(order =>
          order.orderNo.toLowerCase().includes(keyword) ||
          order.customerName.includes(keyword) ||
          order.vehiclePlate.includes(keyword)
        )
      }

      resolve({
        list: filteredOrders,
        total: filteredOrders.length
      })
    }, 500)
  })
}

/**
 * 获取订单详情
 */
export function getOrderDetail(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = mockOrders.find(o => o.id === parseInt(id))

      if (order) {
        resolve({
          ...order,
          pickupAddress: '北京市朝阳区某某路123号',
          returnAddress: '北京市朝阳区某某路123号',
          extras: [
            { name: '儿童座椅', price: 50, quantity: 1 },
            { name: '车载WiFi', price: 30, quantity: 1 }
          ],
          insurance: {
            name: '全险',
            price: 200
          },
          timeline: [
            { time: '2025-11-29 10:30:00', status: '订单创建', operator: '系统' },
            { time: '2025-11-29 10:35:00', status: '待确认', operator: '张经理' }
          ]
        })
      } else {
        reject({
          code: 404,
          message: '订单不存在'
        })
      }
    }, 500)
  })
}

/**
 * 更新订单状态
 */
export function updateOrderStatus(id, status, remark) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        status,
        remark,
        message: '订单状态更新成功'
      })
    }, 500)
  })
}

/**
 * 确认订单
 */
export function confirmOrder(id, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        message: '订单确认成功'
      })
    }, 500)
  })
}

/**
 * 取消订单
 */
export function cancelOrder(id, reason) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        reason,
        message: '订单取消成功'
      })
    }, 500)
  })
}

/**
 * 完成订单
 */
export function completeOrder(id, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        message: '订单完成成功'
      })
    }, 500)
  })
}

/**
 * 开始取车流程
 */
export function startPickup(orderId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId,
        message: '取车流程已开始',
        checklistTemplate: {
          exterior: [
            { id: 1, name: '车身前部', checked: false },
            { id: 2, name: '车身后部', checked: false },
            { id: 3, name: '车身左侧', checked: false },
            { id: 4, name: '车身右侧', checked: false },
            { id: 5, name: '车顶', checked: false }
          ],
          interior: [
            { id: 6, name: '驾驶舱', checked: false },
            { id: 7, name: '乘客区', checked: false },
            { id: 8, name: '储物区', checked: false },
            { id: 9, name: '卫生间', checked: false },
            { id: 10, name: '厨房区', checked: false }
          ],
          functions: [
            { id: 11, name: '灯光系统', checked: false },
            { id: 12, name: '空调系统', checked: false },
            { id: 13, name: '音响系统', checked: false },
            { id: 14, name: '导航系统', checked: false },
            { id: 15, name: '水电系统', checked: false }
          ]
        }
      })
    }, 500)
  })
}

/**
 * 提交取车检查数据
 */
export function submitPickupInspection(orderId, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId,
        message: '检查数据提交成功',
        data
      })
    }, 500)
  })
}

/**
 * 上传取车照片
 */
export function uploadPickupPhotos(orderId, photos) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId,
        message: '照片上传成功',
        photoCount: photos.length
      })
    }, 800)
  })
}

/**
 * 完成取车流程
 */
export function completePickup(orderId, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId,
        message: '取车流程完成',
        pickupTime: new Date().toISOString(),
        data
      })
    }, 500)
  })
}

/**
 * 开始还车流程
 */
export function startReturn(orderId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId,
        message: '还车流程已开始',
        pickupData: {
          mileage: 12500,
          fuelLevel: 80,
          pickupTime: '2025-11-28 10:00:00'
        },
        checklistTemplate: {
          exterior: [
            { id: 21, name: '车身前部', checked: false },
            { id: 22, name: '车身后部', checked: false },
            { id: 23, name: '左侧车身', checked: false },
            { id: 24, name: '右侧车身', checked: false },
            { id: 25, name: '车顶/天窗', checked: false }
          ],
          interior: [
            { id: 26, name: '驾驶座', checked: false },
            { id: 27, name: '乘客座', checked: false },
            { id: 28, name: '中控面板', checked: false },
            { id: 29, name: '后备箱', checked: false }
          ],
          functions: [
            { id: 30, name: '灯光系统', checked: false },
            { id: 31, name: '空调系统', checked: false },
            { id: 32, name: '影音系统', checked: false },
            { id: 33, name: '导航系统', checked: false },
            { id: 34, name: '露营设备', checked: false }
          ]
        },
        photoPositions: {
          exterior: [
            { key: 'front', label: '车头正面' },
            { key: 'back', label: '车尾' },
            { key: 'left', label: '左侧45°' },
            { key: 'right', label: '右侧45°' }
          ],
          interior: [
            { key: 'dashboard', label: '仪表盘' },
            { key: 'cabin', label: '驾驶舱' }
          ],
          optional: [
            { key: 'detail1', label: '局部细节1' },
            { key: 'detail2', label: '局部细节2' }
          ]
        }
      })
    }, 500)
  })
}

/**
 * 提交还车检查数据
 */
export function submitReturnInspection(orderId, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId,
        message: '还车检查数据提交成功',
        data
      })
    }, 500)
  })
}

/**
 * 上传还车照片
 */
export function uploadReturnPhotos(orderId, photos) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId,
        message: '还车照片上传成功',
        photoCount: photos.length
      })
    }, 800)
  })
}

/**
 * 提交损坏评估
 */
export function submitDamageAssessment(orderId, damages) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId,
        message: '损坏评估提交成功',
        damageCount: damages.length,
        estimatedCost: damages.reduce((sum, d) => sum + d.estimatedCost, 0)
      })
    }, 500)
  })
}

/**
 * 计算还车费用
 */
export function calculateReturnFees(orderId, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { mileage, fuelLevel, damages = [] } = data

      // 模拟费用计算
      const baseFee = 3200 // 基础租金
      const overtimeFee = 0 // 超时费用
      const overMileageFee = Math.max(0, (mileage - 12500 - 400) * 2) // 超里程费用（超过400公里，每公里2元）
      const fuelFee = Math.max(0, (80 - fuelLevel) * 8) // 补油费用（每格8元）
      const damageFee = damages.reduce((sum, d) => sum + d.estimatedCost, 0) // 损坏赔偿

      const totalFee = baseFee + overtimeFee + overMileageFee + fuelFee + damageFee
      const depositRefund = Math.max(0, 5000 - (overtimeFee + overMileageFee + fuelFee + damageFee))

      resolve({
        orderId,
        fees: {
          baseFee,
          overtimeFee,
          overMileageFee,
          fuelFee,
          damageFee,
          totalFee,
          deposit: 5000,
          depositRefund,
          needPay: Math.max(0, totalFee - 5000 - baseFee)
        },
        breakdown: [
          { name: '基础租金', amount: baseFee, paid: true },
          { name: '超时费用', amount: overtimeFee },
          { name: '超里程费用', amount: overMileageFee },
          { name: '补油费用', amount: fuelFee },
          { name: '损坏赔偿', amount: damageFee }
        ]
      })
    }, 500)
  })
}

/**
 * 完成还车流程
 */
export function completeReturn(orderId, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId,
        message: '还车流程完成',
        returnTime: new Date().toISOString(),
        data
      })
    }, 500)
  })
}

/**
 * 获取取车照片
 */
export function getPickupPhotos(orderId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId,
        photos: {
          exterior: [
            { id: 1, position: 'front', url: '/static/mock/vehicle-front.jpg', timestamp: '2025-11-28 10:00:00' },
            { id: 2, position: 'back', url: '/static/mock/vehicle-back.jpg', timestamp: '2025-11-28 10:01:00' },
            { id: 3, position: 'left', url: '/static/mock/vehicle-left.jpg', timestamp: '2025-11-28 10:02:00' },
            { id: 4, position: 'right', url: '/static/mock/vehicle-right.jpg', timestamp: '2025-11-28 10:03:00' }
          ],
          interior: [
            { id: 5, position: 'dashboard', url: '/static/mock/dashboard.jpg', timestamp: '2025-11-28 10:04:00' },
            { id: 6, position: 'cabin', url: '/static/mock/cabin.jpg', timestamp: '2025-11-28 10:05:00' }
          ]
        }
      })
    }, 500)
  })
}

/**
 * 获取还车照片
 */
export function getReturnPhotos(orderId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId,
        photos: {
          exterior: [
            { id: 1, position: 'front', url: '/static/mock/vehicle-front-return.jpg', timestamp: '2025-12-02 15:00:00' },
            { id: 2, position: 'back', url: '/static/mock/vehicle-back-return.jpg', timestamp: '2025-12-02 15:01:00' },
            { id: 3, position: 'left', url: '/static/mock/vehicle-left-return.jpg', timestamp: '2025-12-02 15:02:00' },
            { id: 4, position: 'right', url: '/static/mock/vehicle-right-return.jpg', timestamp: '2025-12-02 15:03:00' }
          ],
          interior: [
            { id: 5, position: 'dashboard', url: '/static/mock/dashboard-return.jpg', timestamp: '2025-12-02 15:04:00' },
            { id: 6, position: 'cabin', url: '/static/mock/cabin-return.jpg', timestamp: '2025-12-02 15:05:00' }
          ],
          damages: [
            { id: 7, position: 'left-door', url: '/static/mock/damage-1.jpg', timestamp: '2025-12-02 15:06:00', description: '左侧车门轻微划痕' }
          ]
        }
      })
    }, 500)
  })
}

export default {
  getOrderList,
  getOrderDetail,
  updateOrderStatus,
  confirmOrder,
  cancelOrder,
  completeOrder,
  // 取车相关
  startPickup,
  submitPickupInspection,
  uploadPickupPhotos,
  completePickup,
  // 还车相关
  startReturn,
  submitReturnInspection,
  uploadReturnPhotos,
  submitDamageAssessment,
  calculateReturnFees,
  completeReturn,
  // 照片相关
  getPickupPhotos,
  getReturnPhotos
}
