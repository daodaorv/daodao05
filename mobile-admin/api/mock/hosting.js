/**
 * 托管相关Mock数据
 */

// 模拟自有车托管申请数据
const mockOwnCarApplications = [
  {
    id: 1,
    applicationNo: 'OWN20251201001',
    type: 'own_car',
    typeText: '自有车托管',
    status: 'pending',
    statusText: '待审核',
    ownerName: '张伟',
    ownerPhone: '13900139000',
    ownerIdCard: '110101199001011234',
    vehicleInfo: {
      brand: '大通',
      model: 'V90房车',
      year: 2022,
      plate: '京A88888',
      vin: 'LZYTBAA12345678901',
      mileage: 15000,
      color: '白色'
    },
    licenseInfo: {
      ownerName: '张伟',
      plateNo: '京A88888',
      vehicleType: '小型普通客车',
      registerDate: '2022-03-15',
      issueDate: '2022-03-15'
    },
    photos: [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=2',
      'https://picsum.photos/800/600?random=3',
      'https://picsum.photos/800/600?random=4',
      'https://picsum.photos/800/600?random=5',
      'https://picsum.photos/800/600?random=6',
      'https://picsum.photos/800/600?random=7',
      'https://picsum.photos/800/600?random=8',
      'https://picsum.photos/800/600?random=9',
      'https://picsum.photos/800/600?random=10',
      'https://picsum.photos/800/600?random=11',
      'https://picsum.photos/800/600?random=12'
    ],
    expectedIncome: 8000,
    hostingPeriod: 36,
    createTime: '2025-12-01 10:30:00',
    remark: '车况良好，保养及时'
  },
  {
    id: 2,
    applicationNo: 'OWN20251201002',
    type: 'own_car',
    typeText: '自有车托管',
    status: 'approved',
    statusText: '已通过',
    ownerName: '李娜',
    ownerPhone: '13900139001',
    ownerIdCard: '110101199102022345',
    vehicleInfo: {
      brand: '依维柯',
      model: 'C型房车',
      year: 2021,
      plate: '京B66666',
      vin: 'LZYTBAA12345678902',
      mileage: 28000,
      color: '银灰色'
    },
    licenseInfo: {
      ownerName: '李娜',
      plateNo: '京B66666',
      vehicleType: '小型普通客车',
      registerDate: '2021-06-20',
      issueDate: '2021-06-20'
    },
    photos: [
      'https://picsum.photos/800/600?random=13',
      'https://picsum.photos/800/600?random=14',
      'https://picsum.photos/800/600?random=15',
      'https://picsum.photos/800/600?random=16',
      'https://picsum.photos/800/600?random=17',
      'https://picsum.photos/800/600?random=18',
      'https://picsum.photos/800/600?random=19',
      'https://picsum.photos/800/600?random=20',
      'https://picsum.photos/800/600?random=21',
      'https://picsum.photos/800/600?random=22',
      'https://picsum.photos/800/600?random=23',
      'https://picsum.photos/800/600?random=24'
    ],
    expectedIncome: 7500,
    hostingPeriod: 24,
    createTime: '2025-11-30 14:20:00',
    reviewTime: '2025-12-01 09:15:00',
    reviewBy: '审核员A',
    reviewComment: '车辆状况良好，符合托管标准，审核通过',
    remark: ''
  },
  {
    id: 3,
    applicationNo: 'OWN20251130003',
    type: 'own_car',
    typeText: '自有车托管',
    status: 'rejected',
    statusText: '已拒绝',
    ownerName: '王强',
    ownerPhone: '13900139002',
    ownerIdCard: '110101198903033456',
    vehicleInfo: {
      brand: '福特',
      model: '全顺房车',
      year: 2016,
      plate: '京C33333',
      vin: 'LZYTBAA12345678903',
      mileage: 120000,
      color: '白色'
    },
    licenseInfo: {
      ownerName: '王强',
      plateNo: '京C33333',
      vehicleType: '小型普通客车',
      registerDate: '2016-08-10',
      issueDate: '2016-08-10'
    },
    photos: [
      'https://picsum.photos/800/600?random=25',
      'https://picsum.photos/800/600?random=26',
      'https://picsum.photos/800/600?random=27',
      'https://picsum.photos/800/600?random=28',
      'https://picsum.photos/800/600?random=29',
      'https://picsum.photos/800/600?random=30',
      'https://picsum.photos/800/600?random=31',
      'https://picsum.photos/800/600?random=32',
      'https://picsum.photos/800/600?random=33',
      'https://picsum.photos/800/600?random=34',
      'https://picsum.photos/800/600?random=35',
      'https://picsum.photos/800/600?random=36'
    ],
    expectedIncome: 6000,
    hostingPeriod: 12,
    createTime: '2025-11-30 11:45:00',
    reviewTime: '2025-11-30 16:30:00',
    reviewBy: '审核员B',
    reviewComment: '车龄超过8年，不符合托管标准',
    remark: ''
  }
]

// 模拟购车托管申请数据
const mockBuyCarApplications = [
  {
    id: 4,
    applicationNo: 'BUY20251201001',
    type: 'buy_car',
    typeText: '购车托管',
    status: 'pending',
    statusText: '待审核',
    applicantName: '赵敏',
    applicantPhone: '13900139003',
    applicantIdCard: '110101199204044567',
    age: 32,
    selectedVehicle: {
      brand: '大通',
      model: 'V90房车',
      price: 380000,
      downPayment: 114000,
      loanAmount: 266000
    },
    installmentPlan: {
      period: 36,
      monthlyPayment: 8200,
      totalInterest: 29200
    },
    incomeProof: {
      monthlyIncome: 25000,
      workUnit: '某科技公司',
      position: '技术总监',
      workYears: 8
    },
    creditInfo: {
      creditScore: 750,
      hasLoan: false,
      hasOverdue: false
    },
    expectedIncome: 9000,
    createTime: '2025-12-01 09:20:00',
    remark: '有稳定收入，信用良好'
  },
  {
    id: 5,
    applicationNo: 'BUY20251130002',
    type: 'buy_car',
    typeText: '购车托管',
    status: 'approved',
    statusText: '已通过',
    applicantName: '孙丽',
    applicantPhone: '13900139004',
    applicantIdCard: '110101199305055678',
    age: 31,
    selectedVehicle: {
      brand: '依维柯',
      model: 'C型房车',
      price: 420000,
      downPayment: 126000,
      loanAmount: 294000
    },
    installmentPlan: {
      period: 48,
      monthlyPayment: 7200,
      totalInterest: 51600
    },
    incomeProof: {
      monthlyIncome: 22000,
      workUnit: '某金融公司',
      position: '部门经理',
      workYears: 6
    },
    creditInfo: {
      creditScore: 780,
      hasLoan: false,
      hasOverdue: false
    },
    expectedIncome: 8500,
    createTime: '2025-11-30 15:30:00',
    reviewTime: '2025-12-01 10:45:00',
    reviewBy: '审核员C',
    reviewComment: '收入稳定，信用优秀，还款能力强，审核通过',
    remark: ''
  }
]

// 模拟车主自用申请数据
const mockSelfUseApplications = [
  {
    id: 6,
    applicationNo: 'SELF20251201001',
    type: 'self_use',
    typeText: '车主自用',
    status: 'pending',
    statusText: '待审核',
    ownerName: '周杰',
    ownerPhone: '13900139005',
    vehicleId: 101,
    vehicleInfo: {
      brand: '大通',
      model: 'V90房车',
      plate: '京A88888',
      currentStatus: 'available',
      currentLocation: '北京朝阳门店'
    },
    useInfo: {
      startDate: '2025-12-05',
      endDate: '2025-12-10',
      days: 5,
      pickupStore: '北京朝阳门店',
      returnStore: '北京朝阳门店'
    },
    fees: {
      serviceFee: 300,
      extraFee: 0,
      totalFee: 300
    },
    createTime: '2025-12-01 11:00:00',
    remark: '家庭出游使用'
  },
  {
    id: 7,
    applicationNo: 'SELF20251130002',
    type: 'self_use',
    typeText: '车主自用',
    status: 'approved',
    statusText: '已通过',
    ownerName: '吴彦祖',
    ownerPhone: '13900139006',
    vehicleId: 102,
    vehicleInfo: {
      brand: '依维柯',
      model: 'C型房车',
      plate: '京B66666',
      currentStatus: 'available',
      currentLocation: '北京海淀门店'
    },
    useInfo: {
      startDate: '2025-12-03',
      endDate: '2025-12-06',
      days: 3,
      pickupStore: '北京海淀门店',
      returnStore: '北京海淀门店'
    },
    fees: {
      serviceFee: 200,
      extraFee: 0,
      totalFee: 200
    },
    createTime: '2025-11-30 16:20:00',
    reviewTime: '2025-12-01 09:30:00',
    reviewBy: '审核员D',
    reviewComment: '车辆可用，时间无冲突，审核通过',
    remark: ''
  }
]

// 模拟托管车辆数据
const mockHostingVehicles = [
  {
    id: 101,
    vehicleNo: 'HOST001',
    ownerName: '李娜',
    ownerPhone: '13900139001',
    vehicleInfo: {
      brand: '依维柯',
      model: 'C型房车',
      year: 2021,
      plate: '京B66666',
      vin: 'LZYTBAA12345678902',
      mileage: 28000,
      color: '银灰色'
    },
    hostingInfo: {
      startDate: '2025-12-02',
      endDate: '2027-12-02',
      period: 24,
      monthlyIncome: 7500,
      totalIncome: 180000
    },
    status: 'active',
    statusText: '托管中',
    currentStatus: 'available',
    currentStatusText: '可用',
    earnings: {
      totalEarnings: 45000,
      monthlyAverage: 7500,
      lastMonthEarnings: 8200,
      unpaidEarnings: 7500
    },
    statistics: {
      totalOrders: 18,
      totalDays: 96,
      utilizationRate: 0.85
    },
    createTime: '2025-12-02 10:00:00'
  },
  {
    id: 102,
    vehicleNo: 'HOST002',
    ownerName: '孙丽',
    ownerPhone: '13900139004',
    vehicleInfo: {
      brand: '依维柯',
      model: 'C型房车',
      year: 2025,
      plate: '京E99999',
      vin: 'LZYTBAA12345678904',
      mileage: 5000,
      color: '白色'
    },
    hostingInfo: {
      startDate: '2025-11-15',
      endDate: '2029-11-15',
      period: 48,
      monthlyIncome: 8500,
      totalIncome: 408000
    },
    status: 'active',
    statusText: '托管中',
    currentStatus: 'in_use',
    currentStatusText: '使用中',
    earnings: {
      totalEarnings: 8500,
      monthlyAverage: 8500,
      lastMonthEarnings: 8500,
      unpaidEarnings: 8500
    },
    statistics: {
      totalOrders: 3,
      totalDays: 12,
      utilizationRate: 0.75
    },
    createTime: '2025-11-15 14:30:00'
  },
  {
    id: 103,
    vehicleNo: 'HOST003',
    ownerName: '周杰',
    ownerPhone: '13900139005',
    vehicleInfo: {
      brand: '大通',
      model: 'V90房车',
      year: 2022,
      plate: '京A88888',
      vin: 'LZYTBAA12345678901',
      mileage: 15000,
      color: '白色'
    },
    hostingInfo: {
      startDate: '2025-10-01',
      endDate: '2028-10-01',
      period: 36,
      monthlyIncome: 8000,
      totalIncome: 288000
    },
    status: 'active',
    statusText: '托管中',
    currentStatus: 'maintenance',
    currentStatusText: '维保中',
    earnings: {
      totalEarnings: 16000,
      monthlyAverage: 8000,
      lastMonthEarnings: 8000,
      unpaidEarnings: 0
    },
    statistics: {
      totalOrders: 6,
      totalDays: 24,
      utilizationRate: 0.80
    },
    createTime: '2025-10-01 09:00:00'
  }
]

/**
 * 获取托管申请列表
 */
export function getHostingApplications(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let allApplications = [
        ...mockOwnCarApplications,
        ...mockBuyCarApplications,
        ...mockSelfUseApplications
      ]

      // 按类型筛选
      if (params.type) {
        allApplications = allApplications.filter(app => app.type === params.type)
      }

      // 按状态筛选
      if (params.status) {
        allApplications = allApplications.filter(app => app.status === params.status)
      }

      // 按关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        allApplications = allApplications.filter(app => {
          const ownerName = app.ownerName || app.applicantName || ''
          const phone = app.ownerPhone || app.applicantPhone || ''
          const applicationNo = app.applicationNo || ''
          return ownerName.toLowerCase().includes(keyword) ||
                 phone.includes(keyword) ||
                 applicationNo.toLowerCase().includes(keyword)
        })
      }

      // 按创建时间倒序排序
      allApplications.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list: allApplications,
          total: allApplications.length
        }
      })
    }, 300)
  })
}

/**
 * 获取自有车托管详情
 */
export function getOwnCarDetail(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const application = mockOwnCarApplications.find(app => app.id === parseInt(id))
      if (application) {
        resolve({
          code: 200,
          message: '获取成功',
          data: application
        })
      } else {
        resolve({
          code: 404,
          message: '申请不存在',
          data: null
        })
      }
    }, 300)
  })
}

/**
 * 提交自有车托管审核
 */
export function submitOwnCarReview(id, reviewData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const application = mockOwnCarApplications.find(app => app.id === parseInt(id))
      if (application) {
        application.status = reviewData.approved ? 'approved' : 'rejected'
        application.statusText = reviewData.approved ? '已通过' : '已拒绝'
        application.reviewTime = new Date().toLocaleString('zh-CN', { hour12: false })
        application.reviewBy = '当前审核员'
        application.reviewComment = reviewData.comment

        resolve({
          code: 200,
          message: '审核提交成功',
          data: application
        })
      } else {
        resolve({
          code: 404,
          message: '申请不存在',
          data: null
        })
      }
    }, 500)
  })
}

/**
 * 获取购车托管详情
 */
export function getBuyCarDetail(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const application = mockBuyCarApplications.find(app => app.id === parseInt(id))
      if (application) {
        resolve({
          code: 200,
          message: '获取成功',
          data: application
        })
      } else {
        resolve({
          code: 404,
          message: '申请不存在',
          data: null
        })
      }
    }, 300)
  })
}

/**
 * 提交购车托管审核
 */
export function submitBuyCarReview(id, reviewData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const application = mockBuyCarApplications.find(app => app.id === parseInt(id))
      if (application) {
        application.status = reviewData.approved ? 'approved' : 'rejected'
        application.statusText = reviewData.approved ? '已通过' : '已拒绝'
        application.reviewTime = new Date().toLocaleString('zh-CN', { hour12: false })
        application.reviewBy = '当前审核员'
        application.reviewComment = reviewData.comment

        resolve({
          code: 200,
          message: '审核提交成功',
          data: application
        })
      } else {
        resolve({
          code: 404,
          message: '申请不存在',
          data: null
        })
      }
    }, 500)
  })
}

/**
 * 获取车主自用详情
 */
export function getSelfUseDetail(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const application = mockSelfUseApplications.find(app => app.id === parseInt(id))
      if (application) {
        resolve({
          code: 200,
          message: '获取成功',
          data: application
        })
      } else {
        resolve({
          code: 404,
          message: '申请不存在',
          data: null
        })
      }
    }, 300)
  })
}

/**
 * 提交车主自用审核
 */
export function submitSelfUseReview(id, reviewData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const application = mockSelfUseApplications.find(app => app.id === parseInt(id))
      if (application) {
        application.status = reviewData.approved ? 'approved' : 'rejected'
        application.statusText = reviewData.approved ? '已通过' : '已拒绝'
        application.reviewTime = new Date().toLocaleString('zh-CN', { hour12: false })
        application.reviewBy = '当前审核员'
        application.reviewComment = reviewData.comment

        resolve({
          code: 200,
          message: '审核提交成功',
          data: application
        })
      } else {
        resolve({
          code: 404,
          message: '申请不存在',
          data: null
        })
      }
    }, 500)
  })
}

/**
 * 获取托管车辆列表
 */
export function getHostingVehicles(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredVehicles = [...mockHostingVehicles]

      // 按状态筛选
      if (params.status) {
        filteredVehicles = filteredVehicles.filter(v => v.currentStatus === params.status)
      }

      // 按关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredVehicles = filteredVehicles.filter(v => {
          return v.ownerName.toLowerCase().includes(keyword) ||
                 v.vehicleInfo.plate.toLowerCase().includes(keyword) ||
                 v.vehicleNo.toLowerCase().includes(keyword)
        })
      }

      resolve({
        code: 200,
        message: '获取成功',
        data: {
          list: filteredVehicles,
          total: filteredVehicles.length
        }
      })
    }, 300)
  })
}

/**
 * 获取托管车辆详情
 */
export function getHostingVehicleDetail(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const vehicle = mockHostingVehicles.find(v => v.id === parseInt(id))
      if (vehicle) {
        resolve({
          code: 200,
          message: '获取成功',
          data: vehicle
        })
      } else {
        resolve({
          code: 404,
          message: '车辆不存在',
          data: null
        })
      }
    }, 300)
  })
}
