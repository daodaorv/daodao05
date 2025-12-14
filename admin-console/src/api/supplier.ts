/**
 * 供应商管理 API
 */
import {
  mockGetSupplierList,
  mockGetSupplierDetail,
  mockCreateSupplier,
  mockUpdateSupplier,
  mockDeleteSupplier,
  mockGetSupplierStats,
  type Supplier,
  type SupplierListParams,
  type CreateSupplierParams,
  type UpdateSupplierParams,
  type SupplierStats
} from '@/mock/suppliers'

// 导出类型
export type {
  Supplier,
  SupplierListParams,
  CreateSupplierParams,
  UpdateSupplierParams,
  SupplierStats
}

/**
 * 获取供应商列表
 */
export const getSupplierList = (params: SupplierListParams) => {
  // return request.get('/suppliers', { params })
  return mockGetSupplierList(params)
}

/**
 * 获取供应商详情
 */
export const getSupplierDetail = (id: number) => {
  // return request.get(`/suppliers/${id}`)
  return mockGetSupplierDetail(id)
}

/**
 * 创建供应商
 */
export const createSupplier = (data: CreateSupplierParams) => {
  // return request.post('/suppliers', data)
  return mockCreateSupplier(data)
}

/**
 * 更新供应商
 */
export const updateSupplier = (id: number, data: UpdateSupplierParams) => {
  // return request.put(`/suppliers/${id}`, data)
  return mockUpdateSupplier(id, data)
}

/**
 * 删除供应商
 */
export const deleteSupplier = (id: number) => {
  // return request.delete(`/suppliers/${id}`)
  return mockDeleteSupplier(id)
}

/**
 * 获取供应商统计
 */
export const getSupplierStats = () => {
  // return request.get('/suppliers/stats')
  return mockGetSupplierStats()
}
