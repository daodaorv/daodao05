/**
 * 托管中心Mock数据
 */

import type {
  OldCarApplicationData,
  NewCarApplicationData,
  SelfUseApplicationData,
  IncomeDetailParams,
  WithdrawData,
  ModelBookingData
} from '@/types/hosting'
import { logger } from '@/utils/logger'

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
  submitOldCarApplication(data: OldCarApplicationData) {
    logger.debug('提交自有车托管申请', data)
    return {
      success: true,
      message: '申请已提交，我们将在24小时内完成审核',
      applicationId: 'OC' + Date.now()
    }
  },

  // 提交购车托管申请
  submitNewCarApplication(data: NewCarApplicationData) {
    logger.debug('提交购车托管申请', data)
    return {
      success: true,
      message: '申请已提交，我们将在24小时内联系您',
      applicationId: 'NC' + Date.now()
    }
  },

  // 申请车主自用
  applySelfUse(data: SelfUseApplicationData) {
    logger.debug('申请车主自用', data)
    return {
      success: true,
      message: '自用申请已提交，平台将在24小时内审核',
      orderId: 'SU' + Date.now()
    }
  },

  // 获取收益明细
  getIncomeDetail(params: IncomeDetailParams) {
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
  withdrawIncome(data: WithdrawData) {
    logger.debug('提现申请', data)
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
        beds: 4,
        length: 5940,
        transmission: '自动挡',
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
        beds: 4,
        length: 5995,
        transmission: '自动挡',
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
        beds: 4,
        length: 5650,
        transmission: '手动挡',
        features: ['手动挡', '柴油', '两驱', '太阳能板']
      }
    ]
  },

  // 获取车型详情
  getModelDetail(id: number) {
    const models = this.getPopularModels()
    const model = models.find(m => m.id === id) || models[0]
    return {
      ...model,
      images: ['/static/logo.png', '/static/logo.png', '/static/logo.png'],
      description: `${model.name}是一款专为房车托管设计的优质车型。车辆配置齐全，空间宽敞舒适，非常适合家庭出游和长途旅行。\n\n车辆采用${model.transmission}变速箱，驾驶轻松便捷。内部配备独立卫浴、冷暖空调、车载冰箱等设施，让您的旅途更加舒适。\n\n选择购车托管，您不仅可以拥有一辆属于自己的房车，还能通过托管获得稳定的收益回报。`,
      specs: {
        length: model.length,
        width: 2500,
        height: 3200,
        weight: 3500,
        fuelType: '柴油',
        displacement: '2.0T',
        seats: model.seats,
        beds: model.beds,
        transmission: model.transmission
      },
      hostingInfo: {
        minMonthlyIncome: 3500,
        profitShare: 70,
        estimatedYearlyIncome: 42000,
        subsidyPolicy: '淡季保底补贴，旺季超额分成',
        insurance: '平台统一购买全险'
      },
      detailedFeatures: [
        '独立卫浴',
        '冷暖空调',
        '车载冰箱',
        '太阳能板',
        '逆变器',
        '外接电源',
        '净水系统',
        '灰水箱',
        'LED照明',
        '多媒体系统',
        '倒车影像',
        '驻车空调'
      ]
    }
  },

  // 提交购车预定
  submitModelBooking(data: ModelBookingData) {
    logger.debug('提交购车预定', data)
    return {
      success: true,
      message: '预定申请已提交，我们将在24小时内联系您',
      bookingId: 'MB' + Date.now()
    }
  },

  // 获取城市列表
  getCityList() {
    return [
      {
        id: 1,
        name: '北京',
        latitude: 39.9042,
        longitude: 116.4074
      },
      {
        id: 2,
        name: '上海',
        latitude: 31.2304,
        longitude: 121.4737
      },
      {
        id: 3,
        name: '广州',
        latitude: 23.1291,
        longitude: 113.2644
      },
      {
        id: 4,
        name: '深圳',
        latitude: 22.5431,
        longitude: 114.0579
      }
    ]
  },

  // 获取门店列表（按城市）
  getStoreList(cityId?: number) {
    const allStores = [
      {
        id: 1,
        cityId: 1,
        cityName: '北京',
        name: '朝阳门店',
        fullName: '北京朝阳门店',
        address: '北京市朝阳区建国路88号',
        phone: '010-12345678',
        businessHours: '09:00-18:00',
        latitude: 39.9042,
        longitude: 116.4074,
        canHostingInspection: true
      },
      {
        id: 2,
        cityId: 1,
        cityName: '北京',
        name: '海淀门店',
        fullName: '北京海淀门店',
        address: '北京市海淀区中关村大街1号',
        phone: '010-87654321',
        businessHours: '09:00-18:00',
        latitude: 39.9890,
        longitude: 116.3060,
        canHostingInspection: false
      },
      {
        id: 3,
        cityId: 1,
        cityName: '北京',
        name: '大兴门店',
        fullName: '北京大兴门店',
        address: '北京市大兴区黄村镇大兴路100号',
        phone: '010-11223344',
        businessHours: '09:00-18:00',
        latitude: 39.7266,
        longitude: 116.3419,
        canHostingInspection: false
      },
      {
        id: 4,
        cityId: 2,
        cityName: '上海',
        name: '浦东门店',
        fullName: '上海浦东门店',
        address: '上海市浦东新区世纪大道100号',
        phone: '021-12345678',
        businessHours: '09:00-18:00',
        latitude: 31.2304,
        longitude: 121.4737,
        canHostingInspection: true
      },
      {
        id: 5,
        cityId: 2,
        cityName: '上海',
        name: '徐汇门店',
        fullName: '上海徐汇门店',
        address: '上海市徐汇区漕溪北路88号',
        phone: '021-87654321',
        businessHours: '09:00-18:00',
        latitude: 31.1880,
        longitude: 121.4370,
        canHostingInspection: false
      },
      {
        id: 6,
        cityId: 3,
        cityName: '广州',
        name: '天河门店',
        fullName: '广州天河门店',
        address: '广州市天河区天河路208号',
        phone: '020-12345678',
        businessHours: '09:00-18:00',
        latitude: 23.1353,
        longitude: 113.3235,
        canHostingInspection: false
      },
      {
        id: 7,
        cityId: 4,
        cityName: '深圳',
        name: '南山门店',
        fullName: '深圳南山门店',
        address: '深圳市南山区科技园南区深南大道9988号',
        phone: '0755-12345678',
        businessHours: '09:00-18:00',
        latitude: 22.5365,
        longitude: 113.9357,
        canHostingInspection: false
      }
    ]

    // 筛选条件：按城市筛选，并且只返回可托管验车的门店
    let filteredStores = allStores.filter(store => store.canHostingInspection)

    if (cityId) {
      filteredStores = filteredStores.filter(store => store.cityId === cityId)
    }

    return filteredStores
  }
}
