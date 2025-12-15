/**
 * 托管中心Mock数据
 */

export default {
  // 获取托管收益数据
  getHostingIncome() {
    return {
      totalIncome: 12580.50,
      todayPending: 350.00,
      monthEstimate: 8500.00
    }
  },

  // 获取托管车辆列表
  getHostingVehicles() {
    return [
      {
        id: 1,
        plateNumber: '京A·12345',
        name: '上汽大通V90',
        thumbnail: '/static/logo.png',
        status: 'renting',
        statusText: '出租中',
        todayIncome: 350.00,
        monthIncome: 5200.00,
        totalIncome: 28500.00,
        location: '北京市朝阳区叨叨房车朝阳门店',
        insurance: '已投保（太平洋保险）',
        nextMaintenance: '2025-12-15'
      },
      {
        id: 2,
        plateNumber: '京B·67890',
        name: '览众勇士C7',
        thumbnail: '/static/logo.png',
        status: 'idle',
        statusText: '空闲',
        todayIncome: 0,
        monthIncome: 3300.00,
        totalIncome: 18200.00,
        location: '北京市海淀区叨叨房车海淀门店',
        insurance: '已投保（太平洋保险）',
        nextMaintenance: '2025-12-20'
      },
      {
        id: 3,
        plateNumber: '京C·11111',
        name: '隆翠房车',
        thumbnail: '/static/logo.png',
        status: 'self-use',
        statusText: '自用中',
        todayIncome: 0,
        monthIncome: 4100.00,
        totalIncome: 22300.00,
        location: '车主自用中',
        insurance: '已投保（太平洋保险）',
        nextMaintenance: '2026-01-10'
      }
    ]
  },

  // 提交自有车托管申请
  submitOldCarApplication(data: any) {
    console.log('提交自有车托管申请:', data)
    return {
      success: true,
      message: '申请已提交，我们将在24小时内完成审核',
      applicationId: 'OC' + Date.now()
    }
  },

  // 提交购车托管申请
  submitNewCarApplication(data: any) {
    console.log('提交购车托管申请:', data)
    return {
      success: true,
      message: '申请已提交，我们将在24小时内联系您',
      applicationId: 'NC' + Date.now()
    }
  },

  // 申请车主自用
  applySelfUse(data: any) {
    console.log('申请车主自用:', data)
    return {
      success: true,
      message: '自用申请已提交，平台将在24小时内审核',
      orderId: 'SU' + Date.now()
    }
  },

  // 获取收益明细
  getIncomeDetail(params: any) {
    return {
      list: [
        {
          id: 1,
          title: '租金收益',
          vehiclePlate: '京A·12345',
          date: '2025-12-01',
          amount: 350.00,
          type: 'income'
        },
        {
          id: 2,
          title: '租金收益',
          vehiclePlate: '京B·67890',
          date: '2025-11-30',
          amount: 420.00,
          type: 'income'
        },
        {
          id: 3,
          title: '淡季补贴',
          vehiclePlate: '京A·12345',
          date: '2025-11-29',
          amount: 500.00,
          type: 'subsidy'
        }
      ],
      total: 50,
      page: params.page || 1,
      pageSize: params.pageSize || 20
    }
  },

  // 提现
  withdrawIncome(data: any) {
    console.log('提现申请:', data)
    return {
      success: true,
      message: '提现申请已提交，预计T+1工作日到账',
      withdrawId: 'WD' + Date.now()
    }
  },

  // 获取车辆详情
  getVehicleDetail(id: number) {
    const vehicles = this.getHostingVehicles()
    const vehicle = vehicles.find(v => v.id === id) || vehicles[0]
    return {
      ...vehicle,
      defaultStoreId: 1,
      blockedRanges: [
        { start: '2024-12-10', end: '2024-12-13', type: 'executing' },
        { start: '2024-12-18', end: '2024-12-20', type: 'reserved' }
      ]
    }
  },

  // 获取热门车型列表
  getPopularModels() {
    return [
      {
        id: 1,
        name: '上汽大通V90',
        brand: '上汽大通',
        image: '/static/logo.png',
        price: 458000,
        monthlyPayment: 4500,
        seats: 4,
        length: 5940,
        features: ['自动挡', '柴油', '四驱', '太阳能板']
      },
      {
        id: 2,
        name: '览众勇士C7',
        brand: '览众',
        image: '/static/logo.png',
        price: 528000,
        monthlyPayment: 5200,
        seats: 4,
        length: 5995,
        features: ['自动挡', '柴油', '四驱', '升降顶']
      },
      {
        id: 3,
        name: '隆翠房车',
        brand: '隆翠',
        image: '/static/logo.png',
        price: 398000,
        monthlyPayment: 3900,
        seats: 4,
        length: 5650,
        features: ['手动挡', '柴油', '两驱', '太阳能板']
      }
    ]
  },

  // 获取门店列表
  getStoreList() {
    return [
      {
        id: 1,
        name: '北京朝阳门店',
        address: '北京市朝阳区建国路88号',
        phone: '010-12345678',
        businessHours: '09:00-18:00',
        latitude: 39.9042,
        longitude: 116.4074
      },
      {
        id: 2,
        name: '北京海淀门店',
        address: '北京市海淀区中关村大街1号',
        phone: '010-87654321',
        businessHours: '09:00-18:00',
        latitude: 39.9890,
        longitude: 116.3060
      },
      {
        id: 3,
        name: '上海浦东门店',
        address: '上海市浦东新区世纪大道100号',
        phone: '021-12345678',
        businessHours: '09:00-18:00',
        latitude: 31.2304,
        longitude: 121.4737
      }
    ]
  }
}
