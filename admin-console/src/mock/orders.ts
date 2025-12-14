/**
 * 订单管理 Mock 数据
 */

// 订单状态
export type OrderStatus =
  | 'pending_payment'    // 待支付
  | 'pending_confirm'    // 待确认
  | 'confirmed'          // 已确认
  | 'in_use'            // 使用中
  | 'completed'         // 已完成
  | 'cancelled'         // 已取消
  | 'refunding'         // 退款中
  | 'refunded'          // 已退款

// 支付状态
export type PaymentStatus = 'unpaid' | 'paid' | 'refunding' | 'refunded'

// 订单类型
export type OrderType = 'hosting' | 'cooperative'

// 订单信息
export interface Order {
  id: number
  orderNo: string
  type: OrderType
  userId: number
  userName: string
  userPhone: string
  vehicleId: number
  vehicleName: string
  vehicleNumber: string
  storeId: number
  storeName: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  startDate: string
  endDate: string
  days: number
  dailyPrice: number
  totalAmount: number
  depositAmount: number
  insuranceAmount: number
  serviceAmount: number
  discountAmount: number
  actualAmount: number
  paidAmount: number
  refundAmount: number
  pickupStore: string
  returnStore: string
  pickupTime: string
  returnTime: string
  driverName: string
  driverPhone: string
  driverLicense: string
  emergencyContact: string
  emergencyPhone: string
  remark: string
  cancelReason: string
  refundReason: string
  createdAt: string
  updatedAt: string
  confirmedAt: string
  completedAt: string
  cancelledAt: string
}

// 订单统计
export interface OrderStats {
  totalOrders: number
  pendingPayment: number
  pendingConfirm: number
  inUse: number
  completed: number
  cancelled: number
  totalRevenue: number
  todayOrders: number
}

// Mock 订单数据
const mockOrders: Order[] = [
  {
    id: 1,
    orderNo: 'ORD202412030001',
    type: 'hosting',
    userId: 1,
    userName: '张三',
    userPhone: '13800138000',
    vehicleId: 1,
    vehicleName: '大通RV80 C型房车',
    vehicleNumber: '京A12345',
    storeId: 1,
    storeName: '北京朝阳店',
    status: 'in_use',
    paymentStatus: 'paid',
    startDate: '2025-12-01',
    endDate: '2025-12-05',
    days: 4,
    dailyPrice: 800,
    totalAmount: 3200,
    depositAmount: 5000,
    insuranceAmount: 200,
    serviceAmount: 100,
    discountAmount: 0,
    actualAmount: 3500,
    paidAmount: 8500,
    refundAmount: 0,
    pickupStore: '北京朝阳店',
    returnStore: '北京朝阳店',
    pickupTime: '2025-12-01 09:00:00',
    returnTime: '2025-12-05 18:00:00',
    driverName: '张三',
    driverPhone: '13800138000',
    driverLicense: '110101199001011234',
    emergencyContact: '李四',
    emergencyPhone: '13800138001',
    remark: '客户要求提前准备好车辆',
    cancelReason: '',
    refundReason: '',
    createdAt: '2025-11-28T10:00:00.000Z',
    updatedAt: '2025-12-01T09:00:00.000Z',
    confirmedAt: '2025-11-28T14:00:00.000Z',
    completedAt: '',
    cancelledAt: ''
  },
  {
    id: 2,
    orderNo: 'ORD202412030002',
    type: 'cooperative',
    userId: 2,
    userName: '李四',
    userPhone: '13800138001',
    vehicleId: 4,
    vehicleName: '福特全顺B型房车',
    vehicleNumber: '沪B67890',
    storeId: 2,
    storeName: '上海浦东店',
    status: 'confirmed',
    paymentStatus: 'paid',
    startDate: '2025-12-05',
    endDate: '2025-12-10',
    days: 5,
    dailyPrice: 900,
    totalAmount: 4500,
    depositAmount: 6000,
    insuranceAmount: 250,
    serviceAmount: 150,
    discountAmount: 200,
    actualAmount: 4700,
    paidAmount: 10700,
    refundAmount: 0,
    pickupStore: '上海浦东店',
    returnStore: '上海浦东店',
    pickupTime: '2025-12-05 10:00:00',
    returnTime: '2025-12-10 17:00:00',
    driverName: '李四',
    driverPhone: '13800138001',
    driverLicense: '310101199002021234',
    emergencyContact: '王五',
    emergencyPhone: '13800138002',
    remark: '',
    cancelReason: '',
    refundReason: '',
    createdAt: '2025-11-29T11:00:00.000Z',
    updatedAt: '2025-11-29T15:00:00.000Z',
    confirmedAt: '2025-11-29T15:00:00.000Z',
    completedAt: '',
    cancelledAt: ''
  },
  {
    id: 3,
    orderNo: 'ORD202412030003',
    type: 'hosting',
    userId: 3,
    userName: '王五',
    userPhone: '13800138002',
    vehicleId: 2,
    vehicleName: '依维柯拖挂房车',
    vehicleNumber: '粤C11111',
    storeId: 3,
    storeName: '广州天河加盟店',
    status: 'completed',
    paymentStatus: 'paid',
    startDate: '2025-11-20',
    endDate: '2025-11-25',
    days: 5,
    dailyPrice: 1000,
    totalAmount: 5000,
    depositAmount: 8000,
    insuranceAmount: 300,
    serviceAmount: 200,
    discountAmount: 500,
    actualAmount: 5000,
    paidAmount: 13000,
    refundAmount: 8000,
    pickupStore: '广州天河加盟店',
    returnStore: '广州天河加盟店',
    pickupTime: '2025-11-20 09:00:00',
    returnTime: '2025-11-25 18:00:00',
    driverName: '王五',
    driverPhone: '13800138002',
    driverLicense: '440101199003031234',
    emergencyContact: '赵六',
    emergencyPhone: '13800138003',
    remark: '客户体验良好，已完成订单',
    cancelReason: '',
    refundReason: '',
    createdAt: '2025-11-15T10:00:00.000Z',
    updatedAt: '2025-11-25T18:30:00.000Z',
    confirmedAt: '2025-11-15T14:00:00.000Z',
    completedAt: '2025-11-25T18:30:00.000Z',
    cancelledAt: ''
  },
  {
    id: 4,
    orderNo: 'ORD202412030004',
    type: 'hosting',
    userId: 4,
    userName: '赵六',
    userPhone: '13800138003',
    vehicleId: 5,
    vehicleName: '奔驰斯宾特房车',
    vehicleNumber: '京B88888',
    storeId: 1,
    storeName: '北京朝阳店',
    status: 'pending_confirm',
    paymentStatus: 'paid',
    startDate: '2025-12-10',
    endDate: '2025-12-15',
    days: 5,
    dailyPrice: 1500,
    totalAmount: 7500,
    depositAmount: 10000,
    insuranceAmount: 400,
    serviceAmount: 300,
    discountAmount: 0,
    actualAmount: 8200,
    paidAmount: 18200,
    refundAmount: 0,
    pickupStore: '北京朝阳店',
    returnStore: '北京朝阳店',
    pickupTime: '2025-12-10 10:00:00',
    returnTime: '2025-12-15 17:00:00',
    driverName: '赵六',
    driverPhone: '13800138003',
    driverLicense: '110101199004041234',
    emergencyContact: '孙七',
    emergencyPhone: '13800138004',
    remark: '高端客户，需要特别关注',
    cancelReason: '',
    refundReason: '',
    createdAt: '2025-12-02T10:00:00.000Z',
    updatedAt: '2025-12-02T10:30:00.000Z',
    confirmedAt: '',
    completedAt: '',
    cancelledAt: ''
  },
  {
    id: 5,
    orderNo: 'ORD202412030005',
    type: 'cooperative',
    userId: 5,
    userName: '孙七',
    userPhone: '13800138004',
    vehicleId: 6,
    vehicleName: '江铃特顺房车',
    vehicleNumber: '川A66666',
    storeId: 5,
    storeName: '成都武侯店',
    status: 'cancelled',
    paymentStatus: 'refunded',
    startDate: '2025-12-08',
    endDate: '2025-12-12',
    days: 4,
    dailyPrice: 700,
    totalAmount: 2800,
    depositAmount: 4000,
    insuranceAmount: 180,
    serviceAmount: 100,
    discountAmount: 100,
    actualAmount: 2980,
    paidAmount: 6980,
    refundAmount: 6980,
    pickupStore: '成都武侯店',
    returnStore: '成都武侯店',
    pickupTime: '2025-12-08 09:00:00',
    returnTime: '2025-12-12 18:00:00',
    driverName: '孙七',
    driverPhone: '13800138004',
    driverLicense: '510101199005051234',
    emergencyContact: '周八',
    emergencyPhone: '13800138005',
    remark: '',
    cancelReason: '客户临时有事，无法按时取车',
    refundReason: '客户主动取消，全额退款',
    createdAt: '2025-11-30T10:00:00.000Z',
    updatedAt: '2025-12-01T16:00:00.000Z',
    confirmedAt: '2025-11-30T14:00:00.000Z',
    completedAt: '',
    cancelledAt: '2025-12-01T16:00:00.000Z'
  },
  {
    id: 6,
    orderNo: 'ORD202412030006',
    type: 'hosting',
    userId: 6,
    userName: '周八',
    userPhone: '13800138005',
    vehicleId: 3,
    vehicleName: '上汽大通RV90',
    vehicleNumber: '浙A99999',
    storeId: 6,
    storeName: '杭州西湖店',
    status: 'pending_payment',
    paymentStatus: 'unpaid',
    startDate: '2025-12-15',
    endDate: '2025-12-20',
    days: 5,
    dailyPrice: 850,
    totalAmount: 4250,
    depositAmount: 5000,
    insuranceAmount: 220,
    serviceAmount: 120,
    discountAmount: 150,
    actualAmount: 4440,
    paidAmount: 0,
    refundAmount: 0,
    pickupStore: '杭州西湖店',
    returnStore: '杭州西湖店',
    pickupTime: '2025-12-15 10:00:00',
    returnTime: '2025-12-20 17:00:00',
    driverName: '周八',
    driverPhone: '13800138005',
    driverLicense: '330101199006061234',
    emergencyContact: '吴九',
    emergencyPhone: '13800138006',
    remark: '等待客户支付',
    cancelReason: '',
    refundReason: '',
    createdAt: '2025-12-03T09:00:00.000Z',
    updatedAt: '2025-12-03T09:00:00.000Z',
    confirmedAt: '',
    completedAt: '',
    cancelledAt: ''
  }
]

// 订单列表查询参数
export interface OrderListParams {
  page?: number
  pageSize?: number
  keyword?: string
  type?: OrderType
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  storeId?: number
  startDate?: string
  endDate?: string
}

// 创建订单参数
export interface CreateOrderParams {
  userId: number
  vehicleId: number
  storeId: number
  startDate: string
  endDate: string
  pickupTime: string
  returnTime: string
  driverName: string
  driverPhone: string
  driverLicense: string
  emergencyContact: string
  emergencyPhone: string
  remark?: string
}

// 更新订单参数
export interface UpdateOrderParams {
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  remark?: string
  cancelReason?: string
  refundReason?: string
}

// Mock 获取订单列表
export const mockGetOrderList = (params: OrderListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredOrders = [...mockOrders]

      // 关键词搜索
      if (params.keyword) {
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.orderNo.includes(params.keyword!) ||
            order.userName.includes(params.keyword!) ||
            order.userPhone.includes(params.keyword!) ||
            order.vehicleName.includes(params.keyword!) ||
            order.vehicleNumber.includes(params.keyword!)
        )
      }

      // 订单类型筛选
      if (params.type) {
        filteredOrders = filteredOrders.filter((order) => order.type === params.type)
      }

      // 订单状态筛选
      if (params.status) {
        filteredOrders = filteredOrders.filter((order) => order.status === params.status)
      }

      // 支付状态筛选
      if (params.paymentStatus) {
        filteredOrders = filteredOrders.filter((order) => order.paymentStatus === params.paymentStatus)
      }

      // 门店筛选
      if (params.storeId) {
        filteredOrders = filteredOrders.filter((order) => order.storeId === params.storeId)
      }

      // 日期范围筛选
      if (params.startDate && params.endDate) {
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.startDate >= params.startDate! && order.startDate <= params.endDate!
        )
      }

      // 按创建时间倒序排序
      filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredOrders.slice(start, end)

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: filteredOrders.length,
          page,
          pageSize
        }
      })
    }, 300)
  })
}

// Mock 获取订单详情
export const mockGetOrderDetail = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = mockOrders.find((o) => o.id === id)
      if (order) {
        resolve({
          code: 200,
          message: '获取成功',
          data: order
        })
      } else {
        reject({
          code: 404,
          message: '订单不存在'
        })
      }
    }, 200)
  })
}

// Mock 创建订单
export const mockCreateOrder = (params: CreateOrderParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startDate = new Date(params.startDate)
      const endDate = new Date(params.endDate)
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

      const newOrder: Order = {
        id: mockOrders.length + 1,
        orderNo: `ORD${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(mockOrders.length + 1).padStart(4, '0')}`,
        type: 'hosting',
        userId: params.userId,
        userName: '新用户',
        userPhone: '13800138000',
        vehicleId: params.vehicleId,
        vehicleName: '房车',
        vehicleNumber: '京A00000',
        storeId: params.storeId,
        storeName: '门店',
        status: 'pending_payment',
        paymentStatus: 'unpaid',
        startDate: params.startDate,
        endDate: params.endDate,
        days,
        dailyPrice: 800,
        totalAmount: 800 * days,
        depositAmount: 5000,
        insuranceAmount: 200,
        serviceAmount: 100,
        discountAmount: 0,
        actualAmount: 800 * days + 300,
        paidAmount: 0,
        refundAmount: 0,
        pickupStore: '门店',
        returnStore: '门店',
        pickupTime: params.pickupTime,
        returnTime: params.returnTime,
        driverName: params.driverName,
        driverPhone: params.driverPhone,
        driverLicense: params.driverLicense,
        emergencyContact: params.emergencyContact,
        emergencyPhone: params.emergencyPhone,
        remark: params.remark || '',
        cancelReason: '',
        refundReason: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        confirmedAt: '',
        completedAt: '',
        cancelledAt: ''
      }
      mockOrders.unshift(newOrder)
      resolve({
        code: 200,
        message: '创建成功',
        data: newOrder
      })
    }, 500)
  })
}

// Mock 更新订单
export const mockUpdateOrder = (id: number, params: UpdateOrderParams) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockOrders.findIndex((o) => o.id === id)
      if (index !== -1) {
        mockOrders[index] = {
          ...mockOrders[index],
          ...params,
          updatedAt: new Date().toISOString()
        }
        resolve({
          code: 200,
          message: '更新成功',
          data: mockOrders[index]
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

// Mock 取消订单
export const mockCancelOrder = (id: number, reason: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockOrders.findIndex((o) => o.id === id)
      if (index !== -1) {
        mockOrders[index] = {
          ...mockOrders[index],
          status: 'cancelled',
          cancelReason: reason,
          cancelledAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        resolve({
          code: 200,
          message: '取消成功',
          data: mockOrders[index]
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

// Mock 确认订单
export const mockConfirmOrder = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockOrders.findIndex((o) => o.id === id)
      if (index !== -1) {
        mockOrders[index] = {
          ...mockOrders[index],
          status: 'confirmed',
          confirmedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        resolve({
          code: 200,
          message: '确认成功',
          data: mockOrders[index]
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

// Mock 完成订单
export const mockCompleteOrder = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockOrders.findIndex((o) => o.id === id)
      if (index !== -1) {
        mockOrders[index] = {
          ...mockOrders[index],
          status: 'completed',
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        resolve({
          code: 200,
          message: '完成成功',
          data: mockOrders[index]
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

// Mock 获取订单统计
export const mockGetOrderStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: OrderStats = {
        totalOrders: mockOrders.length,
        pendingPayment: mockOrders.filter((o) => o.status === 'pending_payment').length,
        pendingConfirm: mockOrders.filter((o) => o.status === 'pending_confirm').length,
        inUse: mockOrders.filter((o) => o.status === 'in_use').length,
        completed: mockOrders.filter((o) => o.status === 'completed').length,
        cancelled: mockOrders.filter((o) => o.status === 'cancelled').length,
        totalRevenue: mockOrders
          .filter((o) => o.status === 'completed')
          .reduce((sum, o) => sum + o.actualAmount, 0),
        todayOrders: mockOrders.filter(
          (o) => new Date(o.createdAt).toDateString() === new Date().toDateString()
        ).length
      }
      resolve({
        code: 200,
        message: '获取成功',
        data: stats
      })
    }, 200)
  })
}

// ==================== 异常订单管理 ====================

// 异常类型
export type ExceptionType =
  | 'vehicle_damage'      // 车辆损坏
  | 'late_return'         // 逾期未还
  | 'traffic_violation'   // 交通违章
  | 'accident'            // 交通事故
  | 'customer_complaint'  // 客户投诉
  | 'payment_dispute'     // 支付纠纷
  | 'other'              // 其他异常

// 异常状态
export type ExceptionStatus =
  | 'pending'    // 待处理
  | 'processing' // 处理中
  | 'resolved'   // 已解决
  | 'closed'     // 已关闭

// 异常订单信息
export interface OrderException {
  id: number
  orderId: number
  orderNo: string
  type: ExceptionType
  status: ExceptionStatus
  title: string
  description: string
  reportedBy: string
  reportedAt: string
  assignedTo: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  estimatedLoss: number
  actualLoss: number
  resolution: string
  resolvedAt: string
  createdAt: string
  updatedAt: string
}

// Mock 异常订单数据
const mockExceptions: OrderException[] = [
  {
    id: 1,
    orderId: 1,
    orderNo: 'ORD202412030001',
    type: 'late_return',
    status: 'processing',
    title: '订单逾期未还车',
    description: '客户原定于12月5日18:00还车，截至目前仍未归还车辆，已联系客户但未接听电话',
    reportedBy: '门店员工-王五',
    reportedAt: '2025-12-05T19:00:00.000Z',
    assignedTo: '区域经理-李四',
    priority: 'high',
    estimatedLoss: 800,
    actualLoss: 0,
    resolution: '已联系客户紧急联系人，客户表示路上堵车，预计20:00前归还',
    resolvedAt: '',
    createdAt: '2025-12-05T19:00:00.000Z',
    updatedAt: '2025-12-05T19:30:00.000Z'
  },
  {
    id: 2,
    orderId: 3,
    orderNo: 'ORD202412030003',
    type: 'vehicle_damage',
    status: 'resolved',
    title: '车辆外观损坏',
    description: '还车检查时发现车辆右侧车门有明显刮痕，长度约30cm，客户承认是在停车时不慎刮蹭',
    reportedBy: '门店员工-赵六',
    reportedAt: '2025-11-25T18:30:00.000Z',
    assignedTo: '门店经理-孙七',
    priority: 'medium',
    estimatedLoss: 1500,
    actualLoss: 1200,
    resolution: '已与客户协商，客户同意承担维修费用1200元，已从押金中扣除，车辆已送修',
    resolvedAt: '2025-11-26T10:00:00.000Z',
    createdAt: '2025-11-25T18:30:00.000Z',
    updatedAt: '2025-11-26T10:00:00.000Z'
  },
  {
    id: 3,
    orderId: 1,
    orderNo: 'ORD202412030001',
    type: 'traffic_violation',
    status: 'pending',
    title: '行驶期间违章',
    description: '收到交管部门通知，该车辆在12月3日14:30在京藏高速超速行驶，罚款200元，扣3分',
    reportedBy: '系统自动',
    reportedAt: '2025-12-04T10:00:00.000Z',
    assignedTo: '门店员工-王五',
    priority: 'low',
    estimatedLoss: 200,
    actualLoss: 0,
    resolution: '',
    resolvedAt: '',
    createdAt: '2025-12-04T10:00:00.000Z',
    updatedAt: '2025-12-04T10:00:00.000Z'
  },
  {
    id: 4,
    orderId: 2,
    orderNo: 'ORD202412030002',
    type: 'customer_complaint',
    status: 'processing',
    title: '客户投诉车辆清洁问题',
    description: '客户反馈取车时车内有异味，座椅有污渍，影响使用体验',
    reportedBy: '客户-李四',
    reportedAt: '2025-12-05T10:30:00.000Z',
    assignedTo: '客服专员-周八',
    priority: 'medium',
    estimatedLoss: 0,
    actualLoss: 0,
    resolution: '已向客户道歉，安排专人重新清洁车辆，赠送200元优惠券作为补偿',
    resolvedAt: '',
    createdAt: '2025-12-05T10:30:00.000Z',
    updatedAt: '2025-12-05T11:00:00.000Z'
  },
  {
    id: 5,
    orderId: 4,
    orderNo: 'ORD202412030004',
    type: 'accident',
    status: 'processing',
    title: '轻微交通事故',
    description: '客户在行驶过程中与其他车辆发生轻微碰撞，车辆前保险杠受损，已报警处理',
    reportedBy: '客户-赵六',
    reportedAt: '2025-12-11T15:00:00.000Z',
    assignedTo: '区域经理-李四',
    priority: 'urgent',
    estimatedLoss: 3000,
    actualLoss: 0,
    resolution: '已联系保险公司，等待定损结果，客户需承担保险免赔额500元',
    resolvedAt: '',
    createdAt: '2025-12-11T15:00:00.000Z',
    updatedAt: '2025-12-11T16:00:00.000Z'
  }
]

// 异常订单列表查询参数
export interface ExceptionListParams {
  page?: number
  pageSize?: number
  keyword?: string
  type?: ExceptionType
  status?: ExceptionStatus
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  startDate?: string
  endDate?: string
}

// Mock 获取异常订单列表
export const mockGetExceptionList = (params: ExceptionListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredExceptions = [...mockExceptions]

      // 关键词搜索
      if (params.keyword) {
        filteredExceptions = filteredExceptions.filter(
          (exception) =>
            exception.orderNo.includes(params.keyword!) ||
            exception.title.includes(params.keyword!) ||
            exception.description.includes(params.keyword!)
        )
      }

      // 异常类型筛选
      if (params.type) {
        filteredExceptions = filteredExceptions.filter((exception) => exception.type === params.type)
      }

      // 异常状态筛选
      if (params.status) {
        filteredExceptions = filteredExceptions.filter((exception) => exception.status === params.status)
      }

      // 优先级筛选
      if (params.priority) {
        filteredExceptions = filteredExceptions.filter((exception) => exception.priority === params.priority)
      }

      // 按创建时间倒序排序
      filteredExceptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredExceptions.slice(start, end)

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: filteredExceptions.length,
          page,
          pageSize
        }
      })
    }, 300)
  })
}

// Mock 获取异常订单详情
export const mockGetExceptionDetail = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exception = mockExceptions.find((e) => e.id === id)
      if (exception) {
        resolve({
          code: 200,
          message: '获取成功',
          data: exception
        })
      } else {
        reject({
          code: 404,
          message: '异常记录不存在'
        })
      }
    }, 200)
  })
}

// Mock 处理异常订单
export const mockHandleException = (id: number, resolution: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockExceptions.findIndex((e) => e.id === id)
      if (index !== -1) {
        mockExceptions[index] = {
          ...mockExceptions[index],
          status: 'resolved',
          resolution,
          resolvedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        resolve({
          code: 200,
          message: '处理成功',
          data: mockExceptions[index]
        })
      } else {
        reject({
          code: 404,
          message: '异常记录不存在'
        })
      }
    }, 500)
  })
}

// Mock 获取异常统计
export const mockGetExceptionStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats = {
        totalExceptions: mockExceptions.length,
        pending: mockExceptions.filter((e) => e.status === 'pending').length,
        processing: mockExceptions.filter((e) => e.status === 'processing').length,
        resolved: mockExceptions.filter((e) => e.status === 'resolved').length,
        totalLoss: mockExceptions.reduce((sum, e) => sum + e.actualLoss, 0)
      }
      resolve({
        code: 200,
        message: '获取成功',
        data: stats
      })
    }, 200)
  })
}

// ==================== 退款管理 ====================

// 退款状态
export type RefundStatus =
  | 'pending'   // 待审核
  | 'approved'  // 已批准
  | 'rejected'  // 已拒绝
  | 'processing' // 退款中
  | 'completed' // 已完成
  | 'failed'    // 退款失败

// 退款信息
export interface Refund {
  id: number
  orderId: number
  orderNo: string
  userId: number
  userName: string
  userPhone: string
  refundAmount: number
  refundReason: string
  status: RefundStatus
  applyTime: string
  approvedBy: string
  approvedTime: string
  rejectedReason: string
  completedTime: string
  refundMethod: 'original' | 'bank' | 'alipay' | 'wechat'
  bankAccount: string
  createdAt: string
  updatedAt: string
}

// Mock 退款数据
const mockRefunds: Refund[] = [
  {
    id: 1,
    orderId: 5,
    orderNo: 'ORD202412030005',
    userId: 5,
    userName: '孙七',
    userPhone: '13800138004',
    refundAmount: 6980,
    refundReason: '客户临时有事，无法按时取车',
    status: 'completed',
    applyTime: '2025-12-01T15:00:00.000Z',
    approvedBy: '财务专员-吴九',
    approvedTime: '2025-12-01T15:30:00.000Z',
    rejectedReason: '',
    completedTime: '2025-12-01T16:00:00.000Z',
    refundMethod: 'original',
    bankAccount: '',
    createdAt: '2025-12-01T15:00:00.000Z',
    updatedAt: '2025-12-01T16:00:00.000Z'
  },
  {
    id: 2,
    orderId: 6,
    orderNo: 'ORD202412030006',
    userId: 6,
    userName: '周八',
    userPhone: '13800138005',
    refundAmount: 4440,
    refundReason: '车辆故障无法使用，申请全额退款',
    status: 'pending',
    applyTime: '2025-12-03T10:00:00.000Z',
    approvedBy: '',
    approvedTime: '',
    rejectedReason: '',
    completedTime: '',
    refundMethod: 'original',
    bankAccount: '',
    createdAt: '2025-12-03T10:00:00.000Z',
    updatedAt: '2025-12-03T10:00:00.000Z'
  },
  {
    id: 3,
    orderId: 3,
    orderNo: 'ORD202412030003',
    userId: 3,
    userName: '王五',
    userPhone: '13800138002',
    refundAmount: 8000,
    refundReason: '订单完成，退还押金',
    status: 'completed',
    applyTime: '2025-11-25T18:30:00.000Z',
    approvedBy: '系统自动',
    approvedTime: '2025-11-25T18:30:00.000Z',
    rejectedReason: '',
    completedTime: '2025-11-25T19:00:00.000Z',
    refundMethod: 'original',
    bankAccount: '',
    createdAt: '2025-11-25T18:30:00.000Z',
    updatedAt: '2025-11-25T19:00:00.000Z'
  }
]

// 退款列表查询参数
export interface RefundListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: RefundStatus
  startDate?: string
  endDate?: string
}

// Mock 获取退款列表
export const mockGetRefundList = (params: RefundListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredRefunds = [...mockRefunds]

      // 关键词搜索
      if (params.keyword) {
        filteredRefunds = filteredRefunds.filter(
          (refund) =>
            refund.orderNo.includes(params.keyword!) ||
            refund.userName.includes(params.keyword!) ||
            refund.userPhone.includes(params.keyword!)
        )
      }

      // 状态筛选
      if (params.status) {
        filteredRefunds = filteredRefunds.filter((refund) => refund.status === params.status)
      }

      // 按申请时间倒序排序
      filteredRefunds.sort((a, b) => new Date(b.applyTime).getTime() - new Date(a.applyTime).getTime())

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredRefunds.slice(start, end)

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: filteredRefunds.length,
          page,
          pageSize
        }
      })
    }, 300)
  })
}

// Mock 审核退款
export const mockApproveRefund = (id: number, approved: boolean, reason?: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockRefunds.findIndex((r) => r.id === id)
      if (index !== -1) {
        if (approved) {
          mockRefunds[index] = {
            ...mockRefunds[index],
            status: 'processing',
            approvedBy: '财务专员-吴九',
            approvedTime: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        } else {
          mockRefunds[index] = {
            ...mockRefunds[index],
            status: 'rejected',
            approvedBy: '财务专员-吴九',
            approvedTime: new Date().toISOString(),
            rejectedReason: reason || '',
            updatedAt: new Date().toISOString()
          }
        }
        resolve({
          code: 200,
          message: approved ? '审核通过' : '审核拒绝',
          data: mockRefunds[index]
        })
      } else {
        reject({
          code: 404,
          message: '退款记录不存在'
        })
      }
    }, 500)
  })
}

// Mock 获取退款统计
export const mockGetRefundStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats = {
        totalRefunds: mockRefunds.length,
        pending: mockRefunds.filter((r) => r.status === 'pending').length,
        processing: mockRefunds.filter((r) => r.status === 'processing').length,
        completed: mockRefunds.filter((r) => r.status === 'completed').length,
        totalAmount: mockRefunds
          .filter((r) => r.status === 'completed')
          .reduce((sum, r) => sum + r.refundAmount, 0)
      }
      resolve({
        code: 200,
        message: '获取成功',
        data: stats
      })
    }, 200)
  })
}

// ==================== 订单评价管理 ====================

// 评价信息
export interface OrderReview {
  id: number
  orderId: number
  orderNo: string
  userId: number
  userName: string
  vehicleId: number
  vehicleName: string
  storeId: number
  storeName: string
  overallRating: number
  vehicleRating: number
  serviceRating: number
  cleanlinessRating: number
  comment: string
  images: string[]
  reply: string
  repliedBy: string
  repliedAt: string
  status: 'pending' | 'published' | 'hidden'
  createdAt: string
  updatedAt: string
}

// Mock 评价数据
const mockReviews: OrderReview[] = [
  {
    id: 1,
    orderId: 3,
    orderNo: 'ORD202412030003',
    userId: 3,
    userName: '王五',
    vehicleId: 2,
    vehicleName: '依维柯拖挂房车',
    storeId: 3,
    storeName: '广州天河加盟店',
    overallRating: 5,
    vehicleRating: 5,
    serviceRating: 5,
    cleanlinessRating: 5,
    comment: '非常满意的一次租车体验！车辆状况很好，内部设施齐全，工作人员服务态度也很好。强烈推荐！',
    images: ['/images/review1-1.jpg', '/images/review1-2.jpg'],
    reply: '感谢您的好评！我们会继续努力为您提供更好的服务。',
    repliedBy: '门店经理-孙七',
    repliedAt: '2025-11-26T10:00:00.000Z',
    status: 'published',
    createdAt: '2025-11-25T20:00:00.000Z',
    updatedAt: '2025-11-26T10:00:00.000Z'
  },
  {
    id: 2,
    orderId: 1,
    orderNo: 'ORD202412030001',
    userId: 1,
    userName: '张三',
    vehicleId: 1,
    vehicleName: '大通RV80 C型房车',
    storeId: 1,
    storeName: '北京朝阳店',
    overallRating: 4,
    vehicleRating: 4,
    serviceRating: 5,
    cleanlinessRating: 3,
    comment: '整体不错，但是车内清洁还有提升空间，座椅有些灰尘。服务态度很好。',
    images: [],
    reply: '',
    repliedBy: '',
    repliedAt: '',
    status: 'pending',
    createdAt: '2025-12-05T20:00:00.000Z',
    updatedAt: '2025-12-05T20:00:00.000Z'
  },
  {
    id: 3,
    orderId: 2,
    orderNo: 'ORD202412030002',
    userId: 2,
    userName: '李四',
    vehicleId: 4,
    vehicleName: '福特全顺B型房车',
    storeId: 2,
    storeName: '上海浦东店',
    overallRating: 5,
    vehicleRating: 5,
    serviceRating: 5,
    cleanlinessRating: 5,
    comment: '车况很好，空间宽敞，适合家庭出游。门店服务专业，取还车流程很顺畅。',
    images: ['/images/review3-1.jpg'],
    reply: '感谢您的认可！期待您的下次光临。',
    repliedBy: '客服专员-周八',
    repliedAt: '2025-12-11T10:00:00.000Z',
    status: 'published',
    createdAt: '2025-12-10T19:00:00.000Z',
    updatedAt: '2025-12-11T10:00:00.000Z'
  }
]

// 评价列表查询参数
export interface ReviewListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: 'pending' | 'published' | 'hidden'
  minRating?: number
  maxRating?: number
  startDate?: string
  endDate?: string
}

// Mock 获取评价列表
export const mockGetReviewList = (params: ReviewListParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredReviews = [...mockReviews]

      // 关键词搜索
      if (params.keyword) {
        filteredReviews = filteredReviews.filter(
          (review) =>
            review.orderNo.includes(params.keyword!) ||
            review.userName.includes(params.keyword!) ||
            review.comment.includes(params.keyword!)
        )
      }

      // 状态筛选
      if (params.status) {
        filteredReviews = filteredReviews.filter((review) => review.status === params.status)
      }

      // 评分筛选
      if (params.minRating) {
        filteredReviews = filteredReviews.filter((review) => review.overallRating >= params.minRating!)
      }
      if (params.maxRating) {
        filteredReviews = filteredReviews.filter((review) => review.overallRating <= params.maxRating!)
      }

      // 按创建时间倒序排序
      filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredReviews.slice(start, end)

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: filteredReviews.length,
          page,
          pageSize
        }
      })
    }, 300)
  })
}

// Mock 回复评价
export const mockReplyReview = (id: number, reply: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockReviews.findIndex((r) => r.id === id)
      if (index !== -1) {
        mockReviews[index] = {
          ...mockReviews[index],
          reply,
          repliedBy: '客服专员-周八',
          repliedAt: new Date().toISOString(),
          status: 'published',
          updatedAt: new Date().toISOString()
        }
        resolve({
          code: 200,
          message: '回复成功',
          data: mockReviews[index]
        })
      } else {
        reject({
          code: 404,
          message: '评价不存在'
        })
      }
    }, 500)
  })
}

// Mock 隐藏/显示评价
export const mockToggleReviewStatus = (id: number, status: 'published' | 'hidden') => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockReviews.findIndex((r) => r.id === id)
      if (index !== -1) {
        mockReviews[index] = {
          ...mockReviews[index],
          status,
          updatedAt: new Date().toISOString()
        }
        resolve({
          code: 200,
          message: status === 'published' ? '已显示' : '已隐藏',
          data: mockReviews[index]
        })
      } else {
        reject({
          code: 404,
          message: '评价不存在'
        })
      }
    }, 500)
  })
}

// Mock 获取评价统计
export const mockGetReviewStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats = {
        totalReviews: mockReviews.length,
        pending: mockReviews.filter((r) => r.status === 'pending').length,
        published: mockReviews.filter((r) => r.status === 'published').length,
        averageRating: mockReviews.reduce((sum, r) => sum + r.overallRating, 0) / mockReviews.length
      }
      resolve({
        code: 200,
        message: '获取成功',
        data: stats
      })
    }, 200)
  })
}
