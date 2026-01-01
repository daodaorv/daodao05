/**
 * 订单相关Mock数据
 */

// 订单状态枚举
export enum OrderStatus {
  PENDING_PAYMENT = 1,    // 待付款
  PENDING_CONFIRM = 2,    // 待确认
  PENDING_PICKUP = 3,     // 待取车
  RENTING = 4,            // 租赁中
  PENDING_RETURN = 5,     // 待还车
  COMPLETED = 6,          // 已完成
  CANCELLED = 7           // 已取消
}

// 订单列表Mock数据
export const mockOrderList = [
  {
    id: 'ORD20260101001',
    vehicleId: 1,
    vehicleName: '依维柯欧胜C型房车',
    vehicleImage: 'https://placehold.co/200x150/FF9F29/FFFFFF?text=Vehicle',
    status: OrderStatus.PENDING_PAYMENT,
    statusText: '待付款',
    pickupTime: '2026-01-15 10:00',
    returnTime: '2026-01-18 10:00',
    pickupStoreName: '北京朝阳门店',
    returnStoreName: '北京朝阳门店',
    totalAmount: 2040,
    createTime: '2026-01-01 14:30'
  }
];

// 订单详情Mock数据
export const mockOrderDetail = {
  id: 'ORD20260101001',
  orderType: 'vehicle',
  vehicleId: 1,
  vehicleName: '依维柯欧胜C型房车',
  vehicleImage: 'https://placehold.co/400x300/FF9F29/FFFFFF?text=Vehicle',
  vehicleSpec: '自动挡 | 4座2卧',
  status: OrderStatus.PENDING_PAYMENT,
  statusText: '待付款',
  pickupTime: '2026-01-15 10:00:00',
  returnTime: '2026-01-18 10:00:00',
  pickupStoreName: '北京朝阳门店',
  returnStoreName: '北京朝阳门店',
  rentalDays: 3,
  rentalFee: 2040,
  insuranceFee: 150,
  serviceFee: 0,
  totalAmount: 2190,
  createTime: '2026-01-01 14:30:00'
};

// 优惠券列表Mock数据（从pages/order/select-coupon.vue迁移）
export const mockCouponList = [
  {
    id: 'CP001',
    name: '房车租赁满减券',
    description: '适用于所有房车租赁订单',
    type: 'discount',
    amount: 200,
    minAmount: 800,
    validFrom: '2025-11-01',
    validTo: '2025-12-31',
    status: 'available',
    applicableProducts: ['vehicle'],
    scope: '房车租赁订单'
  },
  {
    id: 'CP002',
    name: '房车新用户专享券',
    description: '首次租车专享优惠',
    type: 'discount',
    amount: 300,
    minAmount: 1200,
    validFrom: '2025-11-01',
    validTo: '2025-12-31',
    status: 'available',
    applicableProducts: ['vehicle'],
    scope: '房车租赁订单'
  },
  {
    id: 'CP003',
    name: '营地预订立减券',
    description: '指定营地预订可用',
    type: 'discount',
    amount: 120,
    minAmount: 600,
    validFrom: '2025-11-01',
    validTo: '2025-12-31',
    status: 'available',
    applicableProducts: ['campsite'],
    scope: '营地预订'
  },
  {
    id: 'CP004',
    name: '旅游线路优惠券',
    description: '适用于旅游线路订单',
    type: 'discount',
    amount: 400,
    minAmount: 3000,
    validFrom: '2025-11-01',
    validTo: '2025-12-31',
    status: 'available',
    applicableProducts: ['tour'],
    scope: '旅游线路订单'
  },
  {
    id: 'CP005',
    name: '营地周末券',
    description: '限周末营地入住使用',
    type: 'discount',
    amount: 80,
    minAmount: 500,
    validFrom: '2025-11-15',
    validTo: '2025-12-31',
    status: 'available',
    applicableProducts: ['campsite'],
    scope: '营地预订'
  },
  {
    id: 'CP006',
    name: '已使用房车券',
    description: '已使用的优惠券示例',
    type: 'discount',
    amount: 150,
    minAmount: 700,
    validFrom: '2025-10-01',
    validTo: '2025-11-30',
    status: 'used',
    applicableProducts: ['vehicle'],
    scope: '房车租赁订单'
  }
];

// 特惠套餐Mock数据（从pages/order/confirm.vue迁移）
export const mockSpecialOffer = {
  offerId: '1',
  fixedRentalDays: 5,
  packagePrice: 1280,
  originalPrice: 3400,
  vehicle: {
    name: '依维柯欧胜C型房车',
    type: 'C型房车',
    image: '/static/场景推荐2.jpg',
    seats: 6,
    beds: 4
  },
  pickupStore: {
    name: '北京大新门店',
    address: '北京市朝阳区大新路123号'
  },
  returnStore: {
    name: '西安鼓楼门店',
    address: '陕西省西安市碑林区鼓楼街88号'
  },
  availableTimeRange: {
    start: '2025-12-05',
    end: '2025-12-30'
  }
};
