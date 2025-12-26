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
      hidePageHeader: true, // Dashboard有自定义布局，不显示标题
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
        meta: { title: '用户列表', description: '管理小程序注册用户信息和状态' },
        component: () => import('@/views/user/UserList.vue'),
      },
      {
        path: '/users/tags',
        name: 'UserTags',
        meta: { title: '标签管理', description: '管理用户标签和自动打标规则' },
        component: () => import('@/views/user/UserTags.vue'),
      },
      {
        path: '/users/rule-logs',
        name: 'RuleExecutionLogs',
        meta: { title: '规则执行日志', description: '查看自动打标规则执行记录' },
        component: () => import('@/views/user/RuleExecutionLogs.vue'),
      },
      {
        path: '/users/membership-migration',
        name: 'MembershipMigration',
        meta: { title: '数据迁移', description: '迁移历史会员数据', roles: [UserRole.PLATFORM_ADMIN] },
        component: () => import('@/views/user/MembershipMigration.vue'),
      },
      {
        path: '/users/risk',
        name: 'UserRisk',
        meta: { title: '风控管理', description: '监控和管理平台风险用户，及时处理异常行为', roles: [UserRole.PLATFORM_ADMIN] },
        component: () => import('@/views/user/UserRisk.vue'),
      },
      {
        path: '/users/blacklist',
        name: 'UserBlacklist',
        meta: { title: '黑名单', description: '管理平台黑名单用户，防范风险行为', roles: [UserRole.PLATFORM_ADMIN] },
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
        meta: { title: '车型库管理', description: '管理车辆品牌、型号和配置参数' },
        component: () => import('@/views/vehicle/VehicleModels.vue'),
      },
      {
        path: '/vehicles/list',
        name: 'VehicleList',
        meta: { title: '车辆列表', description: '管理平台所有车辆档案、状态跟踪和位置管理(包含平台自有、托管、合作车辆)' },
        component: () => import('@/views/vehicle/VehicleList.vue'),
      },
      {
        path: '/vehicles/status',
        name: 'VehicleStatus',
        meta: { title: '车辆状态', description: '实时管理车辆可用性、维修、保养状态' },
        component: () => import('@/views/vehicle/VehicleStatus.vue'),
      },
      {
        path: '/vehicles/maintenance',
        name: 'VehicleMaintenance',
        meta: { title: '维保管理', description: '管理车辆维修保养计划、记录和成本' },
        component: () => import('@/views/vehicle/VehicleMaintenance.vue'),
      },
      {
        path: '/vehicles/insurance',
        name: 'VehicleInsurance',
        meta: { title: '保险管理', description: '管理车辆保险记录、理赔记录和续保提醒' },
        component: () => import('@/views/vehicle/VehicleInsurance.vue'),
      },
      {
        path: '/vehicles/violations',
        name: 'VehicleViolations',
        meta: { title: '违章管理', description: '管理车辆违章记录、违章处理和罚款缴纳' },
        component: () => import('@/views/vehicle/VehicleViolations.vue'),
      },
      {
        path: '/vehicles/price-analysis',
        name: 'PriceAnalysisReport',
        meta: { title: '价格分析报表', description: '分析车辆定价合理性、收益预测和智能定价建议' },
        component: () => import('@/views/analysis/PriceAnalysisReport.vue'),
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
        meta: { title: '门店列表', description: '管理直营店、加盟店和合作商户信息' },
        component: () => import('@/views/store/StoreList.vue'),
      },
      {
        path: '/stores/cities',
        name: 'StoreCities',
        meta: { title: '城市管理', description: '管理服务城市和服务区域配置' },
        component: () => import('@/views/store/CityManagement.vue'),
      },
      {
        path: '/stores/regions',
        name: 'StoreRegions',
        meta: { title: '区域管理', description: '管理业务区域和区域经理分配', roles: [UserRole.PLATFORM_ADMIN] },
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
        meta: { title: '订单列表', description: '管理租赁订单、异常处理和退款管理' },
        component: () => import('@/views/orders/OrderList.vue'),
      },
      {
        path: '/orders/exceptions',
        name: 'OrderExceptions',
        meta: { title: '异常处理', description: '处理订单异常情况和纠纷解决' },
        component: () => import('@/views/orders/OrderExceptions.vue'),
      },
      {
        path: '/orders/refunds',
        name: 'OrderRefunds',
        meta: { title: '退款管理', description: '处理订单退款申请和审核' },
        component: () => import('@/views/orders/OrderRefunds.vue'),
      },
      {
        path: '/orders/reviews',
        name: 'OrderReviews',
        meta: { title: '评价管理', description: '管理用户订单评价和回复' },
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
      // ==================== 自有车托管 ====================
      {
        path: '/hosting/own-vehicle',
        name: 'HostingOwnVehicle',
        meta: { title: '自有车托管', icon: 'Van' },
        children: [
          {
            path: '/hosting/old-car',
            name: 'HostingOldCar',
            meta: { title: '托管申请审核', description: '审核车主自有车辆托管申请' },
            component: () => import('@/views/hosting/HostingOldCar.vue'),
          },
          {
            path: '/hosting/vehicles',
            name: 'HostingVehicles',
            meta: { title: '托管车辆管理', description: '管理托管车辆运营状态和收益数据' },
            component: () => import('@/views/hosting/HostingVehicles.vue'),
          },
          {
            path: '/hosting/income',
            name: 'HostingIncome',
            meta: { title: '收益管理', description: '管理托管车辆收益统计和分成记录' },
            component: () => import('@/views/hosting/HostingIncome.vue'),
          },
          {
            path: '/hosting/owner-usage',
            name: 'HostingOwnerUsage',
            meta: { title: '车主自用审核', description: '审核车主自用申请，管理自用费用和订单冲突' },
            component: () => import('@/views/hosting/HostingOwnerUsage.vue'),
          },
          {
            path: '/hosting/config',
            name: 'HostingConfig',
            meta: { title: '配置管理' },
            children: [
              {
                path: '/hosting/owner-usage-fee-config',
                name: 'HostingOwnerUsageFeeConfig',
                meta: { title: '自用费用配置', description: '配置车主自用费用规则和限制' },
                component: () => import('@/views/hosting/HostingOwnerUsageFeeConfig.vue'),
              },
              {
                path: '/hosting/seasonal-subsidy-config',
                name: 'HostingSeasonalSubsidyConfig',
                meta: { title: '淡季补贴配置', description: '配置淡季补贴规则和计算方式' },
                component: () => import('@/views/hosting/HostingSeasonalSubsidyConfig.vue'),
              },
            ],
          },
        ],
      },
      // ==================== 购车托管 ====================
      {
        path: '/hosting/purchase',
        name: 'HostingPurchase',
        meta: { title: '购车托管', icon: 'ShoppingCart' },
        children: [
          {
            path: '/hosting/new-car',
            name: 'HostingNewCar',
            meta: { title: '购车申请审核', description: '审核购车托管申请和跟进购车进度' },
            component: () => import('@/views/hosting/HostingNewCar.vue'),
          },
          {
            path: '/hosting/purchase/models',
            name: 'HostingPurchaseModels',
            meta: { title: '购车托管车型', description: '管理支持购车托管的车型配置' },
            component: () => import('@/views/hosting/HostingPurchaseModels.vue'),
          },
        ],
      },

      // ==================== 众筹托管 ====================
      {
        path: '/hosting/crowdfunding',
        name: 'HostingCrowdfunding',
        meta: { title: '众筹托管', icon: 'TrendCharts' },
        children: [
          {
            path: '/hosting/crowdfunding-models',
            name: 'HostingCrowdfundingModels',
            meta: { title: '众筹车型管理', description: '管理支持众筹的车型配置和统计数据' },
            component: () => import('@/views/hosting/HostingCrowdfundingModels.vue'),
          },
          {
            path: '/hosting/crowdfunding-projects',
            name: 'HostingCrowdfundingProjects',
            meta: { title: '众筹项目管理', description: '审核和管理众筹项目、参与者和进度' },
            component: () => import('@/views/hosting/HostingCrowdfundingProjects.vue'),
          },
          {
            path: '/hosting/crowdfunding-owners',
            name: 'HostingCrowdfundingOwners',
            meta: { title: '众筹车主管理', description: '管理众筹参与用户和角色分配' },
            component: () => import('@/views/hosting/HostingCrowdfundingOwners.vue'),
          },
          {
            path: '/hosting/crowdfunding-shares',
            name: 'HostingCrowdfundingShares',
            meta: { title: '份额管理', description: '管理众筹份额持有和转移记录' },
            component: () => import('@/views/hosting/HostingCrowdfundingShares.vue'),
          },
          {
            path: '/hosting/crowdfunding-transactions',
            name: 'HostingCrowdfundingTransactions',
            meta: { title: '份额交易监管', description: '监管份额交易和价格变化' },
            component: () => import('@/views/hosting/HostingCrowdfundingTransactions.vue'),
          },
          {
            path: '/hosting/crowdfunding-income',
            name: 'HostingCrowdfundingIncome',
            meta: { title: '收益分配管理', description: '管理众筹车辆收益分配和统计' },
            component: () => import('@/views/hosting/HostingCrowdfundingIncome.vue'),
          },
          {
            path: '/hosting/crowdfunding-vehicles',
            name: 'HostingCrowdfundingVehicles',
            meta: { title: '众筹车辆管理', description: '管理众筹车辆托管状态和运营数据' },
            component: () => import('@/views/hosting/HostingCrowdfundingVehicles.vue'),
          },
        ],
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
        meta: { title: '合作商列表', description: '管理房车租赁合作商信息和合作状态' },
        component: () => import('@/views/partner/PartnerList.vue'),
      },
      {
        path: '/partners/stores',
        name: 'PartnerStores',
        meta: { title: '合作商门店', description: '查看和管理合作商的门店信息' },
        component: () => import('@/views/partner/PartnerStores.vue'),
      },
      {
        path: '/partners/orders',
        name: 'PartnerOrders',
        meta: { title: '合作商订单', description: '管理合作商订单信息，填写订单号和价格，自动计算差价和分润' },
        component: () => import('@/views/partner/PartnerOrders.vue'),
      },
      {
        path: '/partners/settlement',
        name: 'PartnerSettlement',
        meta: { title: '合作商结算', description: '查看合作商订单结算统计和分润明细' },
        component: () => import('@/views/partner/PartnerSettlement.vue'),
      },
      {
        path: '/partners/profit-config',
        name: 'PartnerProfitConfig',
        meta: { title: '分润配置', description: '配置门店和合作商的分润比例' },
        component: () => import('@/views/partner/PartnerProfitConfig.vue'),
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
        meta: { title: '维保供应商', description: '管理维修保养服务供应商信息' },
        component: () => import('@/views/supplier/MaintenanceSuppliers.vue'),
      },
      {
        path: '/suppliers/insurance',
        name: 'InsuranceSuppliers',
        meta: { title: '保险供应商', description: '管理保险服务供应商信息' },
        component: () => import('@/views/supplier/InsuranceSuppliers.vue'),
      },
      {
        path: '/suppliers/other',
        name: 'OtherSuppliers',
        meta: { title: '其他供应商', description: '管理其他服务供应商信息' },
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
        meta: { title: '营地列表', description: '管理房车营地信息和运营状态' },
        component: () => import('@/views/campsites/CampsiteList.vue'),
      },
      {
        path: '/campsites/reservations',
        name: 'CampsiteReservations',
        meta: { title: '预订管理', description: '管理营地预订和入住信息' },
        component: () => import('@/views/campsites/CampsiteReservations.vue'),
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
        path: '/marketing/price-calendar',
        name: 'PriceCalendar',
        meta: { title: '价格日历', description: '查看和管理每日价格策略，支持快速调价和批量操作' },
        component: () => import('@/views/marketing/PriceCalendar.vue'),
      },
      {
        path: '/marketing/pricing',
        name: 'MarketingPricing',
        meta: { title: '价格策略', description: '管理动态定价策略和时间因子配置' },
        component: () => import('@/views/marketing/MarketingPricing.vue'),
      },
      {
        path: '/marketing/coupons',
        name: 'MarketingCoupons',
        meta: { title: '优惠券管理', description: '管理优惠券创建、发放和核销' },
        component: () => import('@/views/marketing/MarketingCoupons.vue'),
      },
      {
        path: '/marketing/coupon-records',
        name: 'CouponRecords',
        meta: { title: '优惠券记录', description: '查看优惠券领取和使用记录' },
        component: () => import('@/views/marketing/CouponRecords.vue'),
      },
      {
        path: '/marketing/activities',
        name: 'MarketingActivities',
        meta: { title: '营销活动', description: '管理营销活动策划和执行' },
        component: () => import('@/views/marketing/MarketingActivities.vue'),
      },
      {
        path: '/marketing/special-offers',
        name: 'SpecialOffers',
        meta: { title: '特惠租车', description: '管理固定路线的房车租赁套餐' },
        component: () => import('@/views/marketing/SpecialOffers.vue'),
      },
      {
        path: '/marketing/tours',
        name: 'MarketingTours',
        meta: { title: '房车旅游', description: '管理房车旅游路线和批次' },
        component: () => import('@/views/marketing/MarketingTours.vue'),
      },
      {
        path: '/marketing/extras',
        name: 'MarketingExtras',
        meta: { title: '增值费用管理', description: '管理增值服务和费用配置' },
        component: () => import('@/views/marketing/MarketingExtras.vue'),
      },
      {
        path: '/marketing/special-fees',
        name: 'SpecialFees',
        meta: { title: '特殊费用管理', description: '管理特殊费用(如异地还车费)的配置和分配规则' },
        component: () => import('@/views/marketing/SpecialFees.vue'),
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
        meta: { title: '内容审核', description: 'AI+人工双重审核，确保社区内容质量' },
        component: () => import('@/views/community/ContentReview.vue'),
      },
      {
        path: '/community/settings',
        name: 'CommunitySettings',
        meta: { title: '社区配置', description: '管理社区版块和系统配置' },
        component: () => import('@/views/community/CommunitySettings.vue'),
      },
      {
        path: '/community/reports',
        name: 'CommunityReports',
        meta: { title: '举报处理', description: '处理用户举报，维护社区秩序' },
        component: () => import('@/views/community/ReportManagement.vue'),
      },
      {
        path: '/community/content',
        name: 'CommunityContent',
        meta: { title: '内容管理', description: '管理社区已发布的帖子、评论等内容' },
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
        meta: { title: '客服配置', description: '配置智能路由和客服人员管理' },
        component: () => import('@/views/customer-service/ServiceConfig.vue'),
      },
      {
        path: '/customer-service/tickets',
        name: 'CustomerServiceTickets',
        meta: { title: '工单管理', description: '管理客服工单，提升服务质量' },
        component: () => import('@/views/customer-service/TicketManagement.vue'),
      },
      {
        path: '/customer-service/quality',
        name: 'CustomerServiceQuality',
        meta: { title: '质量监控', description: '实时监控客服人员服务质量和绩效指标' },
        component: () => import('@/views/customer-service/CustomerServiceQuality.vue'),
      },
      {
        path: '/customer-service/knowledge',
        name: 'CustomerServiceKnowledge',
        meta: { title: '知识库', description: '管理客服知识库，提升服务效率' },
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
        path: '/profit-sharing/promotion',
        name: 'PromotionProfit',
        meta: { title: '推广分润管理', description: '管理两级推广分润、PLUS会员奖励和推广关系' },
        component: () => import('@/views/profit-sharing/PromotionProfit.vue'),
      },
      {
        path: '/profit-sharing/vehicle-rental',
        name: 'VehicleRentalProfit',
        meta: { title: '房车租赁分润', description: '管理托管车主分润、绩效加成和补贴规则' },
        component: () => import('@/views/profit-sharing/VehicleRentalProfit.vue'),
      },
      {
        path: '/profit-sharing/campsite',
        name: 'CampsiteProfit',
        meta: { title: '营地产品分润', description: '管理营地业主分润和捆绑销售加成' },
        component: () => import('@/views/profit-sharing/CampsiteProfit.vue'),
      },
      {
        path: '/profit-sharing/tour',
        name: 'TourProfit',
        meta: { title: '旅游产品分润', description: '管理旅游产品提供者分润和众筹分润' },
        component: () => import('@/views/profit-sharing/TourProfit.vue'),
      },
      {
        path: '/profit-sharing/config',
        name: 'ProfitConfig',
        meta: { title: '分润配置管理', description: '配置各类分润比例、门槛奖励和补贴规则' },
        component: () => import('@/views/profit-sharing/ProfitConfig.vue'),
      },
      {
        path: '/profit-sharing/records',
        name: 'ProfitRecords',
        meta: { title: '分润记录查询', description: '查询所有分润记录、统计报表和排行榜' },
        component: () => import('@/views/profit-sharing/ProfitRecords.vue'),
      },
      {
        path: '/profit-sharing/simulator',
        name: 'ProfitSimulator',
        meta: { title: '分润模拟器', description: '模拟分润计算，验证规则配置和总额平衡' },
        component: () => import('@/views/profit-sharing/ProfitSimulator.vue'),
      },
      {
        path: '/profit-sharing/withdrawal',
        name: 'WithdrawalAudit',
        meta: { title: '提现审核', description: '审核用户提现申请，管理余额和提现记录' },
        component: () => import('@/views/profit-sharing/WithdrawalAudit.vue'),
      },
      {
        path: '/profit-sharing/risk-control',
        name: 'RiskControl',
        meta: { title: '风控配置', description: '配置风控规则，防范刷单和异常订单' },
        component: () => import('@/views/profit-sharing/RiskControl.vue'),
      },
      {
        path: '/profit-sharing/promotion-tree',
        name: 'PromotionTree',
        meta: { title: '推广关系树', description: '查看推广关系树状结构和团队收益' },
        component: () => import('@/views/profit-sharing/PromotionTree.vue'),
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
        meta: { title: '员工列表', description: '管理平台员工信息、角色分配和在职状态' },
        component: () => import('@/views/employee/EmployeeList.vue'),
      },
      {
        path: '/employees/roles',
        name: 'EmployeeRoles',
        meta: { title: '角色分配', description: '为员工分配系统角色，控制其访问权限和数据范围' },
        component: () => import('@/views/employee/EmployeeRoles.vue'),
      },
      {
        path: '/employees/store-staff',
        name: 'EmployeeStoreStaff',
        meta: { title: '门店员工', description: '管理门店经理和门店员工的信息、排班和考勤' },
        component: () => import('@/views/employee/EmployeeStoreStaff.vue'),
      },
      {
        path: '/employees/customer-service',
        name: 'EmployeeCustomerService',
        meta: { title: '客服人员', description: '管理客服人员信息、工作量统计和服务质量评价' },
        component: () => import('@/views/employee/EmployeeCustomerService.vue'),
      },
      {
        path: '/employees/performance',
        name: 'EmployeePerformance',
        meta: { title: '绩效管理', description: '查看和管理员工绩效数据、评分和奖金发放' },
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
        meta: { title: '角色管理', description: '管理系统角色、权限配置和数据权限范围' },
        component: () => import('@/views/permission/PermissionRoles.vue'),
      },
      {
        path: '/permissions/config',
        name: 'PermissionConfig',
        meta: { title: '权限配置', description: '管理系统权限配置和权限树' },
        component: () => import('@/views/permission/PermissionConfig.vue'),
      },
      {
        path: '/permissions/menu',
        name: 'PermissionMenu',
        meta: { title: '菜单权限', description: '管理角色的菜单访问权限' },
        component: () => import('@/views/permission/PermissionMenu.vue'),
      },
      {
        path: '/permissions/data',
        name: 'PermissionData',
        meta: { title: '数据权限', description: '管理角色的数据访问范围和条件' },
        component: () => import('@/views/permission/PermissionData.vue'),
      },
      {
        path: '/permissions/logs',
        name: 'PermissionLogs',
        meta: { title: '操作日志', description: '查看和管理系统操作日志记录' },
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
        meta: { title: '系统配置', description: '管理系统基础配置和参数' },
        component: () => import('@/views/system/SystemConfig.vue'),
      },
      {
        path: '/system/params',
        name: 'SystemParams',
        meta: { title: '参数设置', description: '管理系统运行参数和业务规则' },
        component: () => import('@/views/system/SystemParams.vue'),
      },
      {
        path: '/system/rental-calculation-config',
        name: 'RentalCalculationConfig',
        meta: { title: '租金计算参数', description: '配置车辆基础租金计算器的财务和运营参数' },
        component: () => import('@/views/system/RentalCalculationConfig.vue'),
      },
      {
        path: '/system/alerts',
        name: 'SystemAlerts',
        meta: { title: '智能预警', description: '配置和管理系统智能预警规则' },
        component: () => import('@/views/system/SystemAlerts.vue'),
      },
      {
        path: '/system/monitor',
        name: 'SystemMonitor',
        meta: { title: '系统监控', description: '实时监控系统运行状态和性能指标' },
        component: () => import('@/views/system/SystemMonitor.vue'),
      },
      {
        path: '/system/audit',
        name: 'SystemAudit',
        meta: { title: '审计日志', description: '查看和管理系统操作审计日志' },
        component: () => import('@/views/system/SystemAudit.vue'),
      },
      {
        path: '/system/backup',
        name: 'SystemBackup',
        meta: { title: '数据备份', description: '管理系统数据备份和恢复' },
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
        meta: { title: '收入统计', description: '查看和分析平台收入数据' },
        component: () => import('@/views/finance/FinanceIncome.vue'),
      },
      {
        path: '/finance/expenses',
        name: 'FinanceExpenses',
        meta: { title: '支出管理', description: '管理和分析平台支出数据' },
        component: () => import('@/views/finance/FinanceExpenses.vue'),
      },
      {
        path: '/finance/reconciliation',
        name: 'FinanceReconciliation',
        meta: { title: '对账结算', description: '管理门店对账和结算流程' },
        component: () => import('@/views/finance/FinanceReconciliation.vue'),
      },
      {
        path: '/finance/reports',
        name: 'FinanceReports',
        meta: { title: '财务报表', description: '查看和分析财务报表数据' },
        component: () => import('@/views/finance/FinanceReports.vue'),
      },
      {
        path: '/finance/invoices',
        name: 'FinanceInvoices',
        meta: { title: '发票管理', description: '管理订单发票开具和状态' },
        component: () => import('@/views/finance/FinanceInvoices.vue'),
      },
    ],
  },
]