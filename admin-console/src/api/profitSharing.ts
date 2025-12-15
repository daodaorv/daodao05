import { request } from '@/utils/request'
import type { ApiResponse } from '@/types/user'
import {
  mockGetHostingProfitList,
  mockGetHostingProfitStats,
  mockGetCooperationProfitList,
  mockGetCooperationProfitStats,
  mockGetStaffProfitList,
  mockGetStaffProfitStats,
  mockGetPromotionProfitList,
  mockGetPromotionProfitStats,
  mockGetProfitConfig,
  mockUpdateProfitConfig,
  mockGetSettlementList,
  mockGetSettlementStats,
  mockCreateSettlement,
  mockGetWithdrawalList,
  mockGetWithdrawalStats,
  mockApproveWithdrawal,
  mockRejectWithdrawal,
} from '@/mock/profitSharing'

// 是否使用 Mock 数据
const USE_MOCK = import.meta.env.DEV

// ==================== 托管分润 ====================
export interface HostingProfit {
  id: number
  vehicleId: number
  vehiclePlate: string
  ownerId: number
  ownerName: string
  orderCount: number
  totalRevenue: number
  ownerShare: number
  platformShare: number
  shareRatio: string
  month: string
  status: 'pending' | 'settled' | 'paid'
  createdAt: string
}

export interface HostingProfitStats {
  totalRevenue: number
  totalOwnerShare: number
  totalPlatformShare: number
  vehicleCount: number
}

export interface HostingProfitListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
  month?: string
}

// ==================== 差价分润 ====================
export interface CooperationProfit {
  id: number
  orderId: number
  orderNo: string
  partnerId: number
  partnerName: string
  storeId: number
  storeName: string
  daodaoPrice: number
  partnerPrice: number
  priceDiff: number
  storeShare: number
  platformShare: number
  shareRatio: string
  month: string
  status: 'pending' | 'settled' | 'paid'
  createdAt: string
}

export interface CooperationProfitStats {
  totalPriceDiff: number
  totalStoreShare: number
  totalPlatformShare: number
  orderCount: number
}

export interface CooperationProfitListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
  month?: string
  partnerId?: number
  storeId?: number
}

// ==================== 员工激励 ====================
export interface StaffProfit {
  id: number
  employeeId: number
  employeeName: string
  department: string
  orderCount: number
  totalRevenue: number
  incentiveAmount: number
  incentiveRatio: string
  month: string
  status: 'pending' | 'settled' | 'paid'
  createdAt: string
}

export interface StaffProfitStats {
  totalRevenue: number
  totalIncentive: number
  employeeCount: number
}

export interface StaffProfitListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
  month?: string
  department?: string
}

// ==================== 推广分润 ====================
export interface PromotionProfit {
  id: number
  promoterId: number
  promoterName: string
  promoterType: 'user' | 'agent' | 'partner'
  inviteeCount: number
  orderCount: number
  totalRevenue: number
  commissionAmount: number
  commissionRatio: string
  month: string
  status: 'pending' | 'settled' | 'paid'
  createdAt: string
}

export interface PromotionProfitStats {
  totalRevenue: number
  totalCommission: number
  promoterCount: number
}

export interface PromotionProfitListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
  month?: string
  promoterType?: string
}

// ==================== 分润配置 ====================
export interface ProfitConfig {
  id: number
  configType: 'hosting' | 'cooperation' | 'staff' | 'promotion'
  configName: string
  shareRatio: number
  minAmount: number
  maxAmount: number
  targetUserTags: number[]  // 目标用户标签ID数组（双向关联）
  description: string
  enabled: boolean
  updatedAt: string
}

export interface UpdateProfitConfigParams {
  id: number
  shareRatio?: number
  minAmount?: number
  maxAmount?: number
  description?: string
  enabled?: boolean
}

// ==================== 结算管理 ====================
export interface Settlement {
  id: number
  settlementNo: string
  settlementType: 'hosting' | 'cooperation' | 'staff' | 'promotion'
  targetId: number
  targetName: string
  totalAmount: number
  itemCount: number
  month: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
}

export interface SettlementStats {
  totalAmount: number
  pendingAmount: number
  completedAmount: number
  settlementCount: number
}

export interface SettlementListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
  settlementType?: string
  month?: string
}

export interface CreateSettlementParams {
  settlementType: 'hosting' | 'cooperation' | 'staff' | 'promotion'
  targetIds: number[]
  month: string
}

// ==================== 提现审核 ====================
export interface Withdrawal {
  id: number
  withdrawalNo: string
  userId: number
  userName: string
  userType: 'owner' | 'employee' | 'promoter'
  amount: number
  bankName: string
  bankAccount: string
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'failed'
  applyReason: string
  rejectReason?: string
  createdAt: string
  approvedAt?: string
  completedAt?: string
}

export interface WithdrawalStats {
  totalAmount: number
  pendingAmount: number
  approvedAmount: number
  withdrawalCount: number
}

export interface WithdrawalListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
  userType?: string
}

export interface ApproveWithdrawalParams {
  id: number
  remark?: string
}

export interface RejectWithdrawalParams {
  id: number
  reason: string
}

// ==================== API 接口 ====================
export const profitSharingApi = {
  // 托管分润
  getHostingProfitList: (params: HostingProfitListParams) => {
    if (USE_MOCK) {
      return mockGetHostingProfitList(params) as Promise<
        ApiResponse<{ list: HostingProfit[]; total: number }>
      >
    }
    return request.get<ApiResponse<{ list: HostingProfit[]; total: number }>>(
      '/profit-sharing/hosting',
      params
    )
  },

  getHostingProfitStats: () => {
    if (USE_MOCK) {
      return mockGetHostingProfitStats() as Promise<ApiResponse<HostingProfitStats>>
    }
    return request.get<ApiResponse<HostingProfitStats>>('/profit-sharing/hosting/stats')
  },

  // 差价分润
  getCooperationProfitList: (params: CooperationProfitListParams) => {
    if (USE_MOCK) {
      return mockGetCooperationProfitList(params) as Promise<
        ApiResponse<{ list: CooperationProfit[]; total: number }>
      >
    }
    return request.get<ApiResponse<{ list: CooperationProfit[]; total: number }>>(
      '/profit-sharing/cooperation',
      params
    )
  },

  getCooperationProfitStats: () => {
    if (USE_MOCK) {
      return mockGetCooperationProfitStats() as Promise<ApiResponse<CooperationProfitStats>>
    }
    return request.get<ApiResponse<CooperationProfitStats>>('/profit-sharing/cooperation/stats')
  },

  // 员工激励
  getStaffProfitList: (params: StaffProfitListParams) => {
    if (USE_MOCK) {
      return mockGetStaffProfitList(params) as Promise<
        ApiResponse<{ list: StaffProfit[]; total: number }>
      >
    }
    return request.get<ApiResponse<{ list: StaffProfit[]; total: number }>>(
      '/profit-sharing/staff',
      params
    )
  },

  getStaffProfitStats: () => {
    if (USE_MOCK) {
      return mockGetStaffProfitStats() as Promise<ApiResponse<StaffProfitStats>>
    }
    return request.get<ApiResponse<StaffProfitStats>>('/profit-sharing/staff/stats')
  },

  // 推广分润
  getPromotionProfitList: (params: PromotionProfitListParams) => {
    if (USE_MOCK) {
      return mockGetPromotionProfitList(params) as Promise<
        ApiResponse<{ list: PromotionProfit[]; total: number }>
      >
    }
    return request.get<ApiResponse<{ list: PromotionProfit[]; total: number }>>(
      '/profit-sharing/promotion',
      params
    )
  },

  getPromotionProfitStats: () => {
    if (USE_MOCK) {
      return mockGetPromotionProfitStats() as Promise<ApiResponse<PromotionProfitStats>>
    }
    return request.get<ApiResponse<PromotionProfitStats>>('/profit-sharing/promotion/stats')
  },

  // 分润配置
  getProfitConfig: () => {
    if (USE_MOCK) {
      return mockGetProfitConfig() as Promise<ApiResponse<ProfitConfig[]>>
    }
    return request.get<ApiResponse<ProfitConfig[]>>('/profit-sharing/config')
  },

  updateProfitConfig: (data: UpdateProfitConfigParams) => {
    if (USE_MOCK) {
      return mockUpdateProfitConfig(data) as Promise<ApiResponse>
    }
    return request.put<ApiResponse>(`/profit-sharing/config/${data.id}`, data)
  },

  // 结算管理
  getSettlementList: (params: SettlementListParams) => {
    if (USE_MOCK) {
      return mockGetSettlementList(params) as Promise<
        ApiResponse<{ list: Settlement[]; total: number }>
      >
    }
    return request.get<ApiResponse<{ list: Settlement[]; total: number }>>(
      '/profit-sharing/settlements',
      params
    )
  },

  getSettlementStats: () => {
    if (USE_MOCK) {
      return mockGetSettlementStats() as Promise<ApiResponse<SettlementStats>>
    }
    return request.get<ApiResponse<SettlementStats>>('/profit-sharing/settlements/stats')
  },

  createSettlement: (data: CreateSettlementParams) => {
    if (USE_MOCK) {
      return mockCreateSettlement(data) as Promise<ApiResponse<Settlement>>
    }
    return request.post<ApiResponse<Settlement>>('/profit-sharing/settlements', data)
  },

  // 提现审核
  getWithdrawalList: (params: WithdrawalListParams) => {
    if (USE_MOCK) {
      return mockGetWithdrawalList(params) as Promise<
        ApiResponse<{ list: Withdrawal[]; total: number }>
      >
    }
    return request.get<ApiResponse<{ list: Withdrawal[]; total: number }>>(
      '/profit-sharing/withdrawals',
      params
    )
  },

  getWithdrawalStats: () => {
    if (USE_MOCK) {
      return mockGetWithdrawalStats() as Promise<ApiResponse<WithdrawalStats>>
    }
    return request.get<ApiResponse<WithdrawalStats>>('/profit-sharing/withdrawals/stats')
  },

  approveWithdrawal: (data: ApproveWithdrawalParams) => {
    if (USE_MOCK) {
      return mockApproveWithdrawal(data) as Promise<ApiResponse>
    }
    return request.put<ApiResponse>(`/profit-sharing/withdrawals/${data.id}/approve`, data)
  },

  rejectWithdrawal: (data: RejectWithdrawalParams) => {
    if (USE_MOCK) {
      return mockRejectWithdrawal(data) as Promise<ApiResponse>
    }
    return request.put<ApiResponse>(`/profit-sharing/withdrawals/${data.id}/reject`, data)
  },
}
