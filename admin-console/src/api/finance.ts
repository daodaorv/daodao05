/**
 * 财务管理 API
 */
import {
  mockGetIncomeStats,
  mockGetIncomeList,
  mockGetExpenseList,
  mockCreateExpense,
  mockUpdateExpense,
  mockDeleteExpense,
  mockGetReconciliationList,
  mockCreateReconciliation,
  mockGetFinancialReports,
  mockGetInvoiceList,
  mockCreateInvoice,
  mockUpdateInvoice,
  mockGetFinancialAnalysis,
  type IncomeStats,
  type IncomeRecord,
  type ExpenseRecord,
  type ExpenseCategory,
  type ReconciliationRecord,
  type ReconciliationStatus,
  type FinancialReport,
  type ReportType,
  type Invoice,
  type InvoiceStatus,
  type FinancialAnalysis
} from '@/mock/finance'

// 导出类型
export type {
  IncomeStats,
  IncomeRecord,
  ExpenseRecord,
  ExpenseCategory,
  ReconciliationRecord,
  ReconciliationStatus,
  FinancialReport,
  ReportType,
  Invoice,
  InvoiceStatus,
  FinancialAnalysis
}

/**
 * 获取收入统计
 */
export function getIncomeStats(params: {
  startDate: string
  endDate: string
}): Promise<IncomeStats> {
  return mockGetIncomeStats(params)
}

/**
 * 获取收入列表
 */
export function getIncomeList(params: {
  page: number
  pageSize: number
  startDate?: string
  endDate?: string
  storeId?: number
  keyword?: string
}): Promise<{ list: IncomeRecord[]; total: number }> {
  return mockGetIncomeList(params)
}

/**
 * 获取支出列表
 */
export function getExpenseList(params: {
  page: number
  pageSize: number
  category?: ExpenseCategory
  startDate?: string
  endDate?: string
  storeId?: number
  keyword?: string
}): Promise<{ list: ExpenseRecord[]; total: number }> {
  return mockGetExpenseList(params)
}

/**
 * 创建支出记录
 */
export function createExpense(data: Partial<ExpenseRecord>): Promise<ExpenseRecord> {
  return mockCreateExpense(data)
}

/**
 * 更新支出记录
 */
export function updateExpense(id: number, data: Partial<ExpenseRecord>): Promise<ExpenseRecord> {
  return mockUpdateExpense(id, data)
}

/**
 * 删除支出记录
 */
export function deleteExpense(id: number): Promise<void> {
  return mockDeleteExpense(id)
}

/**
 * 获取对账结算列表
 */
export function getReconciliationList(params: {
  page: number
  pageSize: number
  status?: ReconciliationStatus
  startDate?: string
  endDate?: string
  storeId?: number
}): Promise<{ list: ReconciliationRecord[]; total: number }> {
  return mockGetReconciliationList(params)
}

/**
 * 创建对账记录
 */
export function createReconciliation(data: Partial<ReconciliationRecord>): Promise<ReconciliationRecord> {
  return mockCreateReconciliation(data)
}

/**
 * 获取财务报表
 */
export function getFinancialReports(params: {
  type: ReportType
  startDate: string
  endDate: string
  storeId?: number
}): Promise<FinancialReport> {
  return mockGetFinancialReports(params)
}

/**
 * 获取发票列表
 */
export function getInvoiceList(params: {
  page: number
  pageSize: number
  status?: InvoiceStatus
  startDate?: string
  endDate?: string
  keyword?: string
}): Promise<{ list: Invoice[]; total: number }> {
  return mockGetInvoiceList(params)
}

/**
 * 创建发票
 */
export function createInvoice(data: Partial<Invoice>): Promise<Invoice> {
  return mockCreateInvoice(data)
}

/**
 * 更新发票状态
 */
export function updateInvoice(id: number, data: Partial<Invoice>): Promise<Invoice> {
  return mockUpdateInvoice(id, data)
}

/**
 * 获取财务分析
 */
export function getFinancialAnalysis(params: {
  startDate: string
  endDate: string
  storeId?: number
}): Promise<FinancialAnalysis> {
  return mockGetFinancialAnalysis(params)
}
