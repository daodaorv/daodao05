/**
 * 菜单配置 - 基于产品需求文档的完整菜单架构
 */
import type { MenuItem } from '@/types/permission'
import { UserRole } from '@/types/permission'

// 完整的菜单配置
export const menuConfig: MenuItem[] = [
  // 工作台
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      title: '工作台',
      icon: 'House',
      roles: [
        UserRole.PLATFORM_ADMIN,
        UserRole.REGIONAL_MANAGER,
        UserRole.STORE_MANAGER,
        UserRole.STORE_STAFF,
      ],
    },
    component: () => import('@/views/dashboard/Dashboard.vue'),
  },

  // 核心业务管理
  {
    path: '/users',
    name: 'Users',
    meta: {
      title: '用户管理',
      icon: 'User',
      roles: [UserRole.PLATFORM_ADMIN, UserRole.REGIONAL_MANAGER, UserRole.STORE_MANAGER],
    },
    children: [
      {
        path: '/users/list',
        name: 'UserList',
        meta: { title: '用户列表' },
        component: () => import('@/views/user/UserList.vue'),
      },
      {
        path: '/users/detail/:id',
        name: 'UserDetail',
        meta: { title: '用户详情', hidden: true },
        component: () => import('@/views/user/UserDetail.vue'),
      },
      {
        path: '/users/tags',
        name: 'UserTags',
        meta: { title: '标签管理' },
        component: () => import('@/views/user/UserTags.vue'),
      },
      {
        path: '/users/rule-logs',
        name: 'RuleExecutionLogs',
        meta: { title: '规则执行日志' },
        component: () => import('@/views/user/RuleExecutionLogs.vue'),
      },
      {
        path: '/users/plus-membership',
        name: 'PlusMembership',
        meta: { title: 'PLUS会员管理' },
        component: () => import('@/views/user/PlusMembership.vue'),
      },
      {
        path: '/users/membership-migration',
        name: 'MembershipMigration',
        meta: { title: '数据迁移', roles: [UserRole.PLATFORM_ADMIN] },
        component: () => import('@/views/user/MembershipMigration.vue'),
      },
      {
        path: '/users/risk',
        name: 'UserRisk',
        meta: { title: '风控管理', roles: [UserRole.PLATFORM_ADMIN] },
        component: () => import('@/views/user/UserRisk.vue'),
      },
      {
        path: '/users/blacklist',
        name: 'UserBlacklist',
        meta: { title: '黑名单', roles: [UserRole.PLATFORM_ADMIN] },
        component: () => import('@/views/user/UserBlacklist.vue'),
      },
    ],
  },

  {
    path: '/vehicles',
    name: 'Vehicles',
    meta: {
      title: '车辆管理',
      icon: 'Van',
      roles: [UserRole.PLATFORM_ADMIN, UserRole.REGIONAL_MANAGER, UserRole.STORE_MANAGER],
    },
    children: [
      {
        path: '/vehicles/models',
        name: 'VehicleModels',
        meta: { title: '车型库管理' },
        component: () => import('@/views/vehicle/VehicleModels.vue'),
      },
      {
        path: '/vehicles/list',
        name: 'VehicleList',
        meta: { title: '车辆列表' },
        component: () => import('@/views/vehicle/VehicleList.vue'),
      },
      {
        path: '/vehicles/status',
        name: 'VehicleStatus',
        meta: { title: '车辆状态' },
        component: () => import('@/views/vehicle/VehicleStatus.vue'),
      },
      {
        path: '/vehicles/maintenance',
        name: 'VehicleMaintenance',
        meta: { title: '维保管理' },
        component: () => import('@/views/vehicle/VehicleMaintenance.vue'),
      },
      {
        path: '/vehicles/insurance',
        name: 'VehicleInsurance',
        meta: { title: '保险管理' },
        component: () => import('@/views/vehicle/VehicleInsurance.vue'),
      },
      {
        path: '/vehicles/violations',
        name: 'VehicleViolations',
        meta: { title: '违章管理' },
        component: () => import('@/views/vehicle/VehicleViolations.vue'),
      },
    ],
  },

  {
    path: '/stores',
    name: 'Stores',
    meta: {
      title: '门店管理',
      icon: 'Shop',
      roles: [UserRole.PLATFORM_ADMIN, UserRole.REGIONAL_MANAGER],
    },
    children: [
      {
        path: '/stores/list',
        name: 'StoreList',
        meta: { title: '门店列表' },
        component: () => import('@/views/store/StoreList.vue'),
      },
      {
        path: '/stores/detail/:id',
        name: 'StoreDetail',
        meta: { title: '门店详情', hidden: true },
        component: () => import('@/views/store/StoreDetail.vue'),
      },
      {
        path: '/stores/cities',
        name: 'StoreCities',
        meta: { title: '城市管理' },
        component: () => import('@/views/store/CityManagement.vue'),
      },
      {
        path: '/stores/regions',
        name: 'StoreRegions',
        meta: { title: '区域管理', roles: [UserRole.PLATFORM_ADMIN] },
        component: () => import('@/views/store/RegionManagement.vue'),
      },
    ],
  },

  {
    path: '/orders',
    name: 'Orders',
    meta: {
      title: '订单管理',
      icon: 'List',
      roles: [
        UserRole.PLATFORM_ADMIN,
        UserRole.REGIONAL_MANAGER,
        UserRole.STORE_MANAGER,
        UserRole.STORE_STAFF,
      ],
    },
    children: [
      {
        path: '/orders/list',
        name: 'OrderList',
        meta: { title: '订单列表' },
        component: () => import('@/views/orders/OrderList.vue'),
      },
      {
        path: '/orders/detail/:id',
        name: 'OrderDetail',
        meta: { title: '订单详情', hidden: true },
        component: () => import('@/views/orders/OrderDetail.vue'),
      },
      {
        path: '/orders/exceptions',
        name: 'OrderExceptions',
        meta: { title: '异常处理' },
        component: () => import('@/views/orders/OrderExceptions.vue'),
      },
      {
        path: '/orders/refunds',
        name: 'OrderRefunds',
        meta: { title: '退款管理' },
        component: () => import('@/views/orders/OrderRefunds.vue'),
      },
      {
        path: '/orders/reviews',
        name: 'OrderReviews',
        meta: { title: '评价管理' },
        component: () => import('@/views/orders/OrderReviews.vue'),
      },
    ],
  },

  {
    path: '/hosting',
    name: 'Hosting',
    meta: {
      title: '托管管理',
      icon: 'Coin',
      roles: [UserRole.PLATFORM_ADMIN, UserRole.REGIONAL_MANAGER],
    },
    children: [
      {
        path: '/hosting/old-car',
        name: 'HostingOldCar',
        meta: { title: '自有车托管' },
        component: () => import('@/views/hosting/HostingOldCar.vue'),
      },
      {
        path: '/hosting/new-car',
        name: 'HostingNewCar',
        meta: { title: '购车托管' },
        component: () => import('@/views/hosting/HostingNewCar.vue'),
      },
      {
        path: '/hosting/vehicles',
        name: 'HostingVehicles',
        meta: { title: '托管车辆' },
        component: () => import('@/views/hosting/HostingVehicles.vue'),
      },
      {
        path: '/hosting/income',
        name: 'HostingIncome',
        meta: { title: '收益管理' },
        component: () => import('@/views/hosting/HostingIncome.vue'),
      },
    ],
  },

  {
    path: '/partners',
    name: 'Partners',
    meta: {
      title: '合作商管理',
      icon: 'Connection',
      roles: [UserRole.PLATFORM_ADMIN, UserRole.REGIONAL_MANAGER],
    },
    children: [
      {
        path: '/partners/list',
        name: 'PartnerList',
        meta: { title: '合作商列表' },
        component: () => import('@/views/partner/PartnerList.vue'),
      },
      {
        path: '/partners/stores',
        name: 'PartnerStores',
        meta: { title: '合作商门店' },
        component: () => import('@/views/partner/PartnerStores.vue'),
      },
      {
        path: '/partners/orders',
        name: 'PartnerOrders',
        meta: { title: '合作商订单' },
        component: () => import('@/views/partner/PartnerOrders.vue'),
      },
      {
        path: '/partners/settlement',
        name: 'PartnerSettlement',
        meta: { title: '合作商结算' },
        component: () => import('@/views/partner/PartnerSettlement.vue'),
      },
    ],
  },

  {
    path: '/suppliers',
    name: 'Suppliers',
    meta: {
      title: '供应商管理',
      icon: 'OfficeBuilding',
      roles: [UserRole.PLATFORM_ADMIN, UserRole.REGIONAL_MANAGER],
    },
    children: [
      {
        path: '/suppliers/maintenance',
        name: 'MaintenanceSuppliers',
        meta: { title: '维保供应商' },
        component: () => import('@/views/supplier/MaintenanceSuppliers.vue'),
      },
      {
        path: '/suppliers/insurance',
        name: 'InsuranceSuppliers',
        meta: { title: '保险供应商' },
        component: () => import('@/views/supplier/InsuranceSuppliers.vue'),
      },
      {
        path: '/suppliers/other',
        name: 'OtherSuppliers',
        meta: { title: '其他供应商' },
        component: () => import('@/views/supplier/OtherSuppliers.vue'),
      },
    ],
  },

  {
    path: '/campsites',
    name: 'Campsites',
    meta: {
      title: '营地管理',
      icon: 'Place',
      roles: [UserRole.PLATFORM_ADMIN, UserRole.REGIONAL_MANAGER, UserRole.STORE_MANAGER],
    },
    children: [
      {
        path: '/campsites/list',
        name: 'CampsiteList',
        meta: { title: '营地列表' },
        component: () => import('@/views/campsites/CampsiteList.vue'),
      },
      {
        path: '/campsites/settings',
        name: 'CampsiteSettings',
        meta: { title: '营地设置' },
        component: () => import('@/views/campsites/CampsiteSettings.vue'),
      },
      {
        path: '/campsites/reservations',
        name: 'CampsiteReservations',
        meta: { title: '预订管理' },
        component: () => import('@/views/campsites/CampsiteReservations.vue'),
      },
      {
        path: '/campsites/inquiries',
        name: 'CampsiteInquiries',
        meta: { title: '咨询配置' },
        component: () => import('@/views/campsites/CampsiteInquiries.vue'),
      },
    ],
  },

  // 营销运营管理
  {
    path: '/marketing',
    name: 'Marketing',
    meta: {
      title: '营销管理',
      icon: 'Promotion',
      roles: [UserRole.PLATFORM_ADMIN, UserRole.REGIONAL_MANAGER],
    },
    children: [
      {
        path: '/marketing/pricing',
        name: 'MarketingPricing',
        meta: { title: '价格策略' },
        component: () => import('@/views/marketing/MarketingPricing.vue'),
      },
      {
        path: '/marketing/coupons',
        name: 'MarketingCoupons',
        meta: { title: '优惠券管理' },
        component: () => import('@/views/marketing/MarketingCoupons.vue'),
      },
      {
        path: '/marketing/activities',
        name: 'MarketingActivities',
        meta: { title: '营销活动' },
        component: () => import('@/views/marketing/MarketingActivities.vue'),
      },
      {
        path: '/marketing/packages',
        name: 'MarketingPackages',
        meta: { title: '特惠套餐' },
        component: () => import('@/views/marketing/MarketingPackages.vue'),
      },
      {
        path: '/marketing/tours',
        name: 'MarketingTours',
        meta: { title: '房车旅游' },
        component: () => import('@/views/marketing/MarketingTours.vue'),
      },
      {
        path: '/marketing/extras',
        name: 'MarketingExtras',
        meta: { title: '增值费用管理' },
        component: () => import('@/views/marketing/MarketingExtras.vue'),
      },
    ],
  },

  {
    path: '/community',
    name: 'Community',
    meta: {
      title: '社区管理',
      icon: 'ChatDotRound',
      roles: [UserRole.PLATFORM_ADMIN],
    },
    children: [
      {
        path: '/community/review',
        name: 'CommunityReview',
        meta: { title: '内容审核' },
        component: () => import('@/views/community/ContentReview.vue'),
      },
      {
        path: '/community/settings',
        name: 'CommunitySettings',
        meta: { title: '社区配置' },
        component: () => import('@/views/community/CommunitySettings.vue'),
      },
      {
        path: '/community/reports',
        name: 'CommunityReports',
        meta: { title: '举报处理' },
        component: () => import('@/views/community/ReportManagement.vue'),
      },
      {
        path: '/community/content',
        name: 'CommunityContent',
        meta: { title: '内容管理' },
        component: () => import('@/views/community/CommunityContent.vue'),
      },
    ],
  },

  {
    path: '/customer-service',
    name: 'CustomerService',
    meta: {
      title: '客服管理',
      icon: 'Service',
      roles: [UserRole.PLATFORM_ADMIN, UserRole.REGIONAL_MANAGER],
    },
    children: [
      {
        path: '/customer-service/config',
        name: 'CustomerServiceConfig',
        meta: { title: '客服配置' },
        component: () => import('@/views/customer-service/ServiceConfig.vue'),
      },
      {
        path: '/customer-service/tickets',
        name: 'CustomerServiceTickets',
        meta: { title: '工单管理' },
        component: () => import('@/views/customer-service/TicketManagement.vue'),
      },
      {
        path: '/customer-service/quality',
        name: 'CustomerServiceQuality',
        meta: { title: '质量监控' },
        component: () => import('@/views/customer-service/CustomerServiceQuality.vue'),
      },
      {
        path: '/customer-service/knowledge',
        name: 'CustomerServiceKnowledge',
        meta: { title: '知识库' },
        component: () => import('@/views/customer-service/KnowledgeBase.vue'),
      },
    ],
  },

  {
    path: '/profit-sharing',
    name: 'ProfitSharing',
    meta: {
      title: '分润管理',
      icon: 'Money',
      roles: [UserRole.PLATFORM_ADMIN],
    },
    children: [
      {
        path: '/profit-sharing/hosting',
        name: 'ProfitSharingHosting',
        meta: { title: '托管分润' },
        component: () => import('@/views/profit-sharing/ProfitSharingHosting.vue'),
      },
      {
        path: '/profit-sharing/cooperation',
        name: 'ProfitSharingCooperation',
        meta: { title: '差价分润（合作商）' },
        component: () => import('@/views/profit-sharing/ProfitSharingCooperation.vue'),
      },
      {
        path: '/profit-sharing/staff',
        name: 'ProfitSharingStaff',
        meta: { title: '员工激励' },
        component: () => import('@/views/profit-sharing/ProfitSharingStaff.vue'),
      },
      {
        path: '/profit-sharing/promotion',
        name: 'ProfitSharingPromotion',
        meta: { title: '推广分润' },
        component: () => import('@/views/profit-sharing/ProfitSharingPromotion.vue'),
      },
      {
        path: '/profit-sharing/config',
        name: 'ProfitSharingConfig',
        meta: { title: '分润配置' },
        component: () => import('@/views/profit-sharing/ProfitSharingConfig.vue'),
      },
      {
        path: '/profit-sharing/settlements',
        name: 'ProfitSharingSettlements',
        meta: { title: '结算管理' },
        component: () => import('@/views/profit-sharing/ProfitSharingSettlements.vue'),
      },
      {
        path: '/profit-sharing/withdrawals',
        name: 'ProfitSharingWithdrawals',
        meta: { title: '提现审核' },
        component: () => import('@/views/profit-sharing/ProfitSharingWithdrawals.vue'),
      },
    ],
  },

  // 系统管理
  {
    path: '/employees',
    name: 'Employees',
    meta: {
      title: '员工管理',
      icon: 'UserFilled',
      roles: [UserRole.PLATFORM_ADMIN, UserRole.REGIONAL_MANAGER, UserRole.STORE_MANAGER],
    },
    children: [
      {
        path: '/employees/list',
        name: 'EmployeeList',
        meta: { title: '员工列表' },
        component: () => import('@/views/employee/EmployeeList.vue'),
      },
      {
        path: '/employees/roles',
        name: 'EmployeeRoles',
        meta: { title: '角色分配' },
        component: () => import('@/views/employee/EmployeeRoles.vue'),
      },
      {
        path: '/employees/store-staff',
        name: 'EmployeeStoreStaff',
        meta: { title: '门店员工' },
        component: () => import('@/views/employee/EmployeeStoreStaff.vue'),
      },
      {
        path: '/employees/customer-service',
        name: 'EmployeeCustomerService',
        meta: { title: '客服人员' },
        component: () => import('@/views/employee/EmployeeCustomerService.vue'),
      },
      {
        path: '/employees/performance',
        name: 'EmployeePerformance',
        meta: { title: '绩效管理' },
        component: () => import('@/views/employee/EmployeePerformance.vue'),
      },
    ],
  },

  {
    path: '/permissions',
    name: 'Permissions',
    meta: {
      title: '权限管理',
      icon: 'Lock',
      roles: [UserRole.PLATFORM_ADMIN],
    },
    children: [
      {
        path: '/permissions/roles',
        name: 'PermissionRoles',
        meta: { title: '角色管理' },
        component: () => import('@/views/permission/PermissionRoles.vue'),
      },
      {
        path: '/permissions/config',
        name: 'PermissionConfig',
        meta: { title: '权限配置' },
        component: () => import('@/views/permission/PermissionConfig.vue'),
      },
      {
        path: '/permissions/menu',
        name: 'PermissionMenu',
        meta: { title: '菜单权限' },
        component: () => import('@/views/permission/PermissionMenu.vue'),
      },
      {
        path: '/permissions/data',
        name: 'PermissionData',
        meta: { title: '数据权限' },
        component: () => import('@/views/permission/PermissionData.vue'),
      },
      {
        path: '/permissions/logs',
        name: 'PermissionLogs',
        meta: { title: '操作日志' },
        component: () => import('@/views/permission/PermissionLogs.vue'),
      },
    ],
  },

  {
    path: '/system',
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'Setting',
      roles: [UserRole.PLATFORM_ADMIN],
    },
    children: [
      {
        path: '/system/config',
        name: 'SystemConfig',
        meta: { title: '系统配置' },
        component: () => import('@/views/system/SystemConfig.vue'),
      },
      {
        path: '/system/params',
        name: 'SystemParams',
        meta: { title: '参数设置' },
        component: () => import('@/views/system/SystemParams.vue'),
      },
      {
        path: '/system/alerts',
        name: 'SystemAlerts',
        meta: { title: '智能预警' },
        component: () => import('@/views/system/SystemAlerts.vue'),
      },
      {
        path: '/system/monitor',
        name: 'SystemMonitor',
        meta: { title: '系统监控' },
        component: () => import('@/views/system/SystemMonitor.vue'),
      },
      {
        path: '/system/audit',
        name: 'SystemAudit',
        meta: { title: '审计日志' },
        component: () => import('@/views/system/SystemAudit.vue'),
      },
      {
        path: '/system/backup',
        name: 'SystemBackup',
        meta: { title: '数据备份' },
        component: () => import('@/views/system/SystemBackup.vue'),
      },
    ],
  },

  // 数据分析
  {
    path: '/finance',
    name: 'Finance',
    meta: {
      title: '财务管理',
      icon: 'Wallet',
      roles: [UserRole.PLATFORM_ADMIN, UserRole.REGIONAL_MANAGER],
    },
    children: [
      {
        path: '/finance/income',
        name: 'FinanceIncome',
        meta: { title: '收入统计' },
        component: () => import('@/views/finance/FinanceIncome.vue'),
      },
      {
        path: '/finance/expenses',
        name: 'FinanceExpenses',
        meta: { title: '支出管理' },
        component: () => import('@/views/finance/FinanceExpenses.vue'),
      },
      {
        path: '/finance/reconciliation',
        name: 'FinanceReconciliation',
        meta: { title: '对账结算' },
        component: () => import('@/views/finance/FinanceReconciliation.vue'),
      },
      {
        path: '/finance/reports',
        name: 'FinanceReports',
        meta: { title: '财务报表' },
        component: () => import('@/views/finance/FinanceReports.vue'),
      },
      {
        path: '/finance/invoices',
        name: 'FinanceInvoices',
        meta: { title: '发票管理' },
        component: () => import('@/views/finance/FinanceInvoices.vue'),
      },
    ],
  },
]