/**
 * 财务管理 Mock 数据
 */

// 支出类别
export type ExpenseCategory = 'vehicle' | 'maintenance' | 'insurance' | 'salary' | 'rent' | 'marketing' | 'other'

// 对账状态
export type ReconciliationStatus = 'pending' | 'processing' | 'completed' | 'failed'

// 报表类型
export type ReportType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'

// 发票状态
export type InvoiceStatus = 'pending' | 'issued' | 'sent' | 'paid' | 'cancelled'

// 收入统计
export interface IncomeStats {
  totalIncome: number
  orderIncome: number
  extraIncome: number
  depositIncome: number
  incomeGrowth: number
  todayIncome: number
  monthIncome: number
  yearIncome: number
  incomeByStore: Array<{
    storeId: number
    storeName: string
    income: number
    growth: number
  }>
  incomeByMonth: Array<{
    month: string
    income: number
  }>
}

// 收入记录
export interface IncomeRecord {
  id: number
  orderId: string
  orderType: string
  amount: number
  paymentMethod: string
  storeId: number
  storeName: string
  userId: number
  userName: string
  description: string
  createdAt: string
}

// 支出记录
export interface ExpenseRecord {
  id: number
  category: ExpenseCategory
  amount: number
  storeId: number
  storeName: string
  description: string
  payee: string
  approver: string
  voucher: string
  createdAt: string
  updatedAt: string
}

// 对账结算记录
export interface ReconciliationRecord {
  id: number
  period: string
  storeId: number
  storeName: string
  totalIncome: number
  totalExpense: number
  netProfit: number
  status: ReconciliationStatus
  reconciler: string
  reconciledAt: string
  notes: string
  createdAt: string
}

// 财务报表
export interface FinancialReport {
  type: ReportType
  period: string
  totalIncome: number
  totalExpense: number
  netProfit: number
  profitMargin: number
  incomeDetails: Array<{
    category: string
    amount: number
    percentage: number
  }>
  expenseDetails: Array<{
    category: string
    amount: number
    percentage: number
  }>
  trends: Array<{
    date: string
    income: number
    expense: number
    profit: number
  }>
}

// 发票
export interface Invoice {
  id: number
  invoiceNo: string
  orderId: string
  type: string
  amount: number
  taxAmount: number
  totalAmount: number
  buyerName: string
  buyerTaxNo: string
  status: InvoiceStatus
  issuedAt: string
  sentAt: string
  paidAt: string
  createdAt: string
}

// 财务分析
export interface FinancialAnalysis {
  profitability: {
    grossProfitMargin: number
    netProfitMargin: number
    returnOnAssets: number
    returnOnEquity: number
  }
  efficiency: {
    assetTurnover: number
    inventoryTurnover: number
    receivablesTurnover: number
  }
  liquidity: {
    currentRatio: number
    quickRatio: number
    cashRatio: number
  }
  growth: {
    revenueGrowth: number
    profitGrowth: number
    assetGrowth: number
  }
  trends: Array<{
    month: string
    revenue: number
    profit: number
    margin: number
  }>
}

// Mock 收入统计数据
const mockIncomeStats: IncomeStats = {
  totalIncome: 12456789,
  orderIncome: 10234567,
  extraIncome: 1876543,
  depositIncome: 345679,
  incomeGrowth: 15.8,
  todayIncome: 45678,
  monthIncome: 1234567,
  yearIncome: 12456789,
  incomeByStore: [
    { storeId: 1, storeName: '北京朝阳门店', income: 3456789, growth: 18.5 },
    { storeId: 2, storeName: '上海浦东门店', income: 2987654, growth: 12.3 },
    { storeId: 3, storeName: '深圳南山门店', income: 2765432, growth: 20.1 },
    { storeId: 4, storeName: '成都高新门店', income: 1876543, growth: 8.7 },
    { storeId: 5, storeName: '杭州西湖门店', income: 1370371, growth: 15.2 }
  ],
  incomeByMonth: [
    { month: '2024-01', income: 987654 },
    { month: '2024-02', income: 876543 },
    { month: '2024-03', income: 1098765 },
    { month: '2024-04', income: 1234567 },
    { month: '2024-05', income: 1345678 },
    { month: '2024-06', income: 1456789 },
    { month: '2024-07', income: 1567890 },
    { month: '2024-08', income: 1234567 },
    { month: '2024-09', income: 1098765 },
    { month: '2024-10', income: 987654 },
    { month: '2024-11', income: 876543 },
    { month: '2024-12', income: 1234567 }
  ]
}

// Mock 收入记录
const mockIncomeRecords: IncomeRecord[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  orderId: `ORD${String(i + 1).padStart(8, '0')}`,
  orderType: ['租车订单', '增值服务', '押金', '违章罚款'][Math.floor(Math.random() * 4)],
  amount: Math.floor(Math.random() * 10000) + 1000,
  paymentMethod: ['微信支付', '支付宝', '银行卡', '现金'][Math.floor(Math.random() * 4)],
  storeId: Math.floor(Math.random() * 5) + 1,
  storeName: ['北京朝阳门店', '上海浦东门店', '深圳南山门店', '成都高新门店', '杭州西湖门店'][Math.floor(Math.random() * 5)],
  userId: Math.floor(Math.random() * 1000) + 1,
  userName: `用户${i + 1}`,
  description: `订单收入 - ${['租车费用', '保险费用', '增值服务', '押金'][Math.floor(Math.random() * 4)]}`,
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
}))

// Mock 支出记录
const mockExpenseRecords: ExpenseRecord[] = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  category: ['vehicle', 'maintenance', 'insurance', 'salary', 'rent', 'marketing', 'other'][Math.floor(Math.random() * 7)] as ExpenseCategory,
  amount: Math.floor(Math.random() * 50000) + 5000,
  storeId: Math.floor(Math.random() * 5) + 1,
  storeName: ['北京朝阳门店', '上海浦东门店', '深圳南山门店', '成都高新门店', '杭州西湖门店'][Math.floor(Math.random() * 5)],
  description: `支出 - ${['车辆采购', '维修保养', '保险费用', '员工工资', '门店租金', '市场推广', '其他费用'][Math.floor(Math.random() * 7)]}`,
  payee: `供应商${i + 1}`,
  approver: ['张经理', '李总监', '王主管'][Math.floor(Math.random() * 3)],
  voucher: `VOU${String(i + 1).padStart(8, '0')}`,
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString()
}))

// Mock 对账记录
const mockReconciliationRecords: ReconciliationRecord[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  period: `2024-${String(i + 1).padStart(2, '0')}`,
  storeId: Math.floor(Math.random() * 5) + 1,
  storeName: ['北京朝阳门店', '上海浦东门店', '深圳南山门店', '成都高新门店', '杭州西湖门店'][Math.floor(Math.random() * 5)],
  totalIncome: Math.floor(Math.random() * 500000) + 500000,
  totalExpense: Math.floor(Math.random() * 200000) + 100000,
  netProfit: 0,
  status: ['pending', 'processing', 'completed', 'failed'][Math.floor(Math.random() * 4)] as ReconciliationStatus,
  reconciler: ['张会计', '李会计', '王会计'][Math.floor(Math.random() * 3)],
  reconciledAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  notes: i % 3 === 0 ? '对账完成，数据准确' : '',
  createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
})).map(record => ({
  ...record,
  netProfit: record.totalIncome - record.totalExpense
}))

// Mock 发票记录
const mockInvoices: Invoice[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  invoiceNo: `INV${String(i + 1).padStart(10, '0')}`,
  orderId: `ORD${String(i + 1).padStart(8, '0')}`,
  type: ['增值税普通发票', '增值税专用发票'][Math.floor(Math.random() * 2)],
  amount: Math.floor(Math.random() * 10000) + 1000,
  taxAmount: 0,
  totalAmount: 0,
  buyerName: `企业${i + 1}`,
  buyerTaxNo: `${Math.floor(Math.random() * 900000000000000000) + 100000000000000000}`,
  status: ['pending', 'issued', 'sent', 'paid', 'cancelled'][Math.floor(Math.random() * 5)] as InvoiceStatus,
  issuedAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString(),
  sentAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
  paidAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
})).map(invoice => ({
  ...invoice,
  taxAmount: Math.floor(invoice.amount * 0.13),
  totalAmount: invoice.amount + Math.floor(invoice.amount * 0.13)
}))

/**
 * 获取收入统计
 */
export function mockGetIncomeStats(_params: {
  startDate: string
  endDate: string
}): Promise<IncomeStats> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockIncomeStats)
    }, 300)
  })
}

/**
 * 获取收入列表
 */
export function mockGetIncomeList(params: {
  page: number
  pageSize: number
  startDate?: string
  endDate?: string
  storeId?: number
  keyword?: string
}): Promise<{ list: IncomeRecord[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockIncomeRecords]

      // 门店筛选
      if (params.storeId) {
        filtered = filtered.filter(record => record.storeId === params.storeId)
      }

      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filtered = filtered.filter(record =>
          record.orderId.toLowerCase().includes(keyword) ||
          record.userName.toLowerCase().includes(keyword) ||
          record.description.toLowerCase().includes(keyword)
        )
      }

      // 日期筛选
      if (params.startDate) {
        filtered = filtered.filter(record => record.createdAt >= params.startDate!)
      }
      if (params.endDate) {
        filtered = filtered.filter(record => record.createdAt <= params.endDate!)
      }

      // 分页
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = filtered.slice(start, end)

      resolve({
        list,
        total: filtered.length
      })
    }, 300)
  })
}

/**
 * 获取支出列表
 */
export function mockGetExpenseList(params: {
  page: number
  pageSize: number
  category?: ExpenseCategory
  startDate?: string
  endDate?: string
  storeId?: number
  keyword?: string
}): Promise<{ list: ExpenseRecord[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockExpenseRecords]

      // 类别筛选
      if (params.category) {
        filtered = filtered.filter(record => record.category === params.category)
      }

      // 门店筛选
      if (params.storeId) {
        filtered = filtered.filter(record => record.storeId === params.storeId)
      }

      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filtered = filtered.filter(record =>
          record.description.toLowerCase().includes(keyword) ||
          record.payee.toLowerCase().includes(keyword) ||
          record.voucher.toLowerCase().includes(keyword)
        )
      }

      // 日期筛选
      if (params.startDate) {
        filtered = filtered.filter(record => record.createdAt >= params.startDate!)
      }
      if (params.endDate) {
        filtered = filtered.filter(record => record.createdAt <= params.endDate!)
      }

      // 分页
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = filtered.slice(start, end)

      resolve({
        list,
        total: filtered.length
      })
    }, 300)
  })
}

/**
 * 创建支出记录
 */
export function mockCreateExpense(data: Partial<ExpenseRecord>): Promise<ExpenseRecord> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newExpense: ExpenseRecord = {
        id: mockExpenseRecords.length + 1,
        category: data.category || 'other',
        amount: data.amount || 0,
        storeId: data.storeId || 1,
        storeName: data.storeName || '北京朝阳门店',
        description: data.description || '',
        payee: data.payee || '',
        approver: data.approver || '',
        voucher: `VOU${String(mockExpenseRecords.length + 1).padStart(8, '0')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      mockExpenseRecords.unshift(newExpense)
      resolve(newExpense)
    }, 300)
  })
}

/**
 * 更新支出记录
 */
export function mockUpdateExpense(id: number, data: Partial<ExpenseRecord>): Promise<ExpenseRecord> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockExpenseRecords.findIndex(record => record.id === id)
      if (index === -1) {
        reject(new Error('支出记录不存在'))
        return
      }

      mockExpenseRecords[index] = {
        ...mockExpenseRecords[index],
        ...data,
        updatedAt: new Date().toISOString()
      }
      resolve(mockExpenseRecords[index])
    }, 300)
  })
}

/**
 * 删除支出记录
 */
export function mockDeleteExpense(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockExpenseRecords.findIndex(record => record.id === id)
      if (index === -1) {
        reject(new Error('支出记录不存在'))
        return
      }

      mockExpenseRecords.splice(index, 1)
      resolve()
    }, 300)
  })
}

/**
 * 获取对账结算列表
 */
export function mockGetReconciliationList(params: {
  page: number
  pageSize: number
  status?: ReconciliationStatus
  startDate?: string
  endDate?: string
  storeId?: number
}): Promise<{ list: ReconciliationRecord[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockReconciliationRecords]

      // 状态筛选
      if (params.status) {
        filtered = filtered.filter(record => record.status === params.status)
      }

      // 门店筛选
      if (params.storeId) {
        filtered = filtered.filter(record => record.storeId === params.storeId)
      }

      // 日期筛选
      if (params.startDate) {
        filtered = filtered.filter(record => record.period >= params.startDate!)
      }
      if (params.endDate) {
        filtered = filtered.filter(record => record.period <= params.endDate!)
      }

      // 分页
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = filtered.slice(start, end)

      resolve({
        list,
        total: filtered.length
      })
    }, 300)
  })
}

/**
 * 创建对账记录
 */
export function mockCreateReconciliation(data: Partial<ReconciliationRecord>): Promise<ReconciliationRecord> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRecord: ReconciliationRecord = {
        id: mockReconciliationRecords.length + 1,
        period: data.period || new Date().toISOString().slice(0, 7),
        storeId: data.storeId || 1,
        storeName: data.storeName || '北京朝阳门店',
        totalIncome: data.totalIncome || 0,
        totalExpense: data.totalExpense || 0,
        netProfit: (data.totalIncome || 0) - (data.totalExpense || 0),
        status: 'pending',
        reconciler: data.reconciler || '',
        reconciledAt: new Date().toISOString(),
        notes: data.notes || '',
        createdAt: new Date().toISOString()
      }
      mockReconciliationRecords.unshift(newRecord)
      resolve(newRecord)
    }, 300)
  })
}

/**
 * 获取财务报表
 */
export function mockGetFinancialReports(params: {
  type: ReportType
  startDate: string
  endDate: string
  storeId?: number
}): Promise<FinancialReport> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const report: FinancialReport = {
        type: params.type,
        period: `${params.startDate} 至 ${params.endDate}`,
        totalIncome: 1234567,
        totalExpense: 456789,
        netProfit: 777778,
        profitMargin: 63.0,
        incomeDetails: [
          { category: '租车收入', amount: 1023456, percentage: 82.9 },
          { category: '增值服务', amount: 187654, percentage: 15.2 },
          { category: '押金收入', amount: 23457, percentage: 1.9 }
        ],
        expenseDetails: [
          { category: '车辆成本', amount: 234567, percentage: 51.3 },
          { category: '人员工资', amount: 123456, percentage: 27.0 },
          { category: '门店租金', amount: 56789, percentage: 12.4 },
          { category: '市场推广', amount: 34567, percentage: 7.6 },
          { category: '其他费用', amount: 7410, percentage: 1.7 }
        ],
        trends: Array.from({ length: 12 }, (_, i) => ({
          date: `2024-${String(i + 1).padStart(2, '0')}`,
          income: Math.floor(Math.random() * 200000) + 800000,
          expense: Math.floor(Math.random() * 100000) + 300000,
          profit: 0
        })).map(item => ({
          ...item,
          profit: item.income - item.expense
        }))
      }
      resolve(report)
    }, 300)
  })
}

/**
 * 获取发票列表
 */
export function mockGetInvoiceList(params: {
  page: number
  pageSize: number
  status?: InvoiceStatus
  startDate?: string
  endDate?: string
  keyword?: string
}): Promise<{ list: Invoice[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockInvoices]

      // 状态筛选
      if (params.status) {
        filtered = filtered.filter(invoice => invoice.status === params.status)
      }

      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filtered = filtered.filter(invoice =>
          invoice.invoiceNo.toLowerCase().includes(keyword) ||
          invoice.orderId.toLowerCase().includes(keyword) ||
          invoice.buyerName.toLowerCase().includes(keyword)
        )
      }

      // 日期筛选
      if (params.startDate) {
        filtered = filtered.filter(invoice => invoice.createdAt >= params.startDate!)
      }
      if (params.endDate) {
        filtered = filtered.filter(invoice => invoice.createdAt <= params.endDate!)
      }

      // 分页
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = filtered.slice(start, end)

      resolve({
        list,
        total: filtered.length
      })
    }, 300)
  })
}

/**
 * 创建发票
 */
export function mockCreateInvoice(data: Partial<Invoice>): Promise<Invoice> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newInvoice: Invoice = {
        id: mockInvoices.length + 1,
        invoiceNo: `INV${String(mockInvoices.length + 1).padStart(10, '0')}`,
        orderId: data.orderId || '',
        type: data.type || '增值税普通发票',
        amount: data.amount || 0,
        taxAmount: Math.floor((data.amount || 0) * 0.13),
        totalAmount: (data.amount || 0) + Math.floor((data.amount || 0) * 0.13),
        buyerName: data.buyerName || '',
        buyerTaxNo: data.buyerTaxNo || '',
        status: 'pending',
        issuedAt: '',
        sentAt: '',
        paidAt: '',
        createdAt: new Date().toISOString()
      }
      mockInvoices.unshift(newInvoice)
      resolve(newInvoice)
    }, 300)
  })
}

/**
 * 更新发票状态
 */
export function mockUpdateInvoice(id: number, data: Partial<Invoice>): Promise<Invoice> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockInvoices.findIndex(invoice => invoice.id === id)
      if (index === -1) {
        reject(new Error('发票不存在'))
        return
      }

      mockInvoices[index] = {
        ...mockInvoices[index],
        ...data
      }
      resolve(mockInvoices[index])
    }, 300)
  })
}

/**
 * 获取财务分析
 */
export function mockGetFinancialAnalysis(_params: {
  startDate: string
  endDate: string
  storeId?: number
}): Promise<FinancialAnalysis> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const analysis: FinancialAnalysis = {
        profitability: {
          grossProfitMargin: 65.5,
          netProfitMargin: 42.3,
          returnOnAssets: 18.7,
          returnOnEquity: 25.4
        },
        efficiency: {
          assetTurnover: 2.3,
          inventoryTurnover: 8.5,
          receivablesTurnover: 12.3
        },
        liquidity: {
          currentRatio: 1.8,
          quickRatio: 1.5,
          cashRatio: 0.9
        },
        growth: {
          revenueGrowth: 15.8,
          profitGrowth: 18.5,
          assetGrowth: 12.3
        },
        trends: Array.from({ length: 12 }, (_, i) => ({
          month: `2024-${String(i + 1).padStart(2, '0')}`,
          revenue: Math.floor(Math.random() * 200000) + 800000,
          profit: Math.floor(Math.random() * 100000) + 300000,
          margin: 0
        })).map(item => ({
          ...item,
          margin: (item.profit / item.revenue) * 100
        }))
      }
      resolve(analysis)
    }, 300)
  })
}
