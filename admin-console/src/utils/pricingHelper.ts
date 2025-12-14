/**
 * 价格计算辅助工具
 * 提供车型租金联动、价格计算等功能
 */

/**
 * 车型基础租金配置
 * 根据车型类型定义默认的日租金
 */
export const VEHICLE_TYPE_BASE_PRICE: Record<string, number> = {
  'A型房车': 800,
  'B型房车': 600,
  'C型房车': 500,
  '拖挂房车': 400,
  '其他': 300
}

/**
 * 车型租金范围配置
 * 定义每种车型的合理租金范围
 */
export const VEHICLE_TYPE_PRICE_RANGE: Record<string, { min: number; max: number }> = {
  'A型房车': { min: 600, max: 1500 },
  'B型房车': { min: 400, max: 1000 },
  'C型房车': { min: 300, max: 800 },
  '拖挂房车': { min: 200, max: 600 },
  '其他': { min: 100, max: 500 }
}

/**
 * 所有权类型价格调整系数
 * 不同所有权类型的车辆可能有不同的定价策略
 */
export const OWNERSHIP_TYPE_MULTIPLIER: Record<string, number> = {
  platform: 1.0, // 平台自有：标准价格
  hosting: 0.95, // 托管：略低于标准价格
  cooperative: 0.9 // 合作商：最低价格
}

/**
 * 根据车型获取基础日租金
 * @param vehicleType 车型类型
 * @returns 基础日租金（元/天）
 */
export function getBasePrice(vehicleType: string): number {
  return VEHICLE_TYPE_BASE_PRICE[vehicleType] || VEHICLE_TYPE_BASE_PRICE['其他']
}

/**
 * 根据车型获取租金范围
 * @param vehicleType 车型类型
 * @returns 租金范围对象 { min, max }
 */
export function getPriceRange(vehicleType: string): { min: number; max: number } {
  return (
    VEHICLE_TYPE_PRICE_RANGE[vehicleType] || VEHICLE_TYPE_PRICE_RANGE['其他']
  )
}

/**
 * 验证租金是否在合理范围内
 * @param vehicleType 车型类型
 * @param price 租金
 * @returns 是否在合理范围内
 */
export function isPriceInRange(vehicleType: string, price: number): boolean {
  const range = getPriceRange(vehicleType)
  return price >= range.min && price <= range.max
}

/**
 * 计算建议租金
 * 根据车型、所有权类型、车辆状况等因素计算建议租金
 * @param options 计算选项
 * @returns 建议租金
 */
export function calculateSuggestedPrice(options: {
  vehicleType: string
  ownershipType?: 'platform' | 'hosting' | 'cooperative'
  condition?: 'excellent' | 'good' | 'fair' | 'poor'
  mileage?: number
  age?: number
}): number {
  const { vehicleType, ownershipType = 'platform', condition = 'good', mileage = 0, age = 0 } = options

  // 1. 获取基础价格
  let price = getBasePrice(vehicleType)

  // 2. 应用所有权类型调整
  const ownershipMultiplier = OWNERSHIP_TYPE_MULTIPLIER[ownershipType] || 1.0
  price *= ownershipMultiplier

  // 3. 根据车况调整
  const conditionMultiplier = {
    excellent: 1.2, // 优秀：+20%
    good: 1.0, // 良好：标准价格
    fair: 0.85, // 一般：-15%
    poor: 0.7 // 较差：-30%
  }
  price *= conditionMultiplier[condition] || 1.0

  // 4. 根据里程数调整（每10万公里降低5%）
  if (mileage > 0) {
    const mileageDiscount = Math.floor(mileage / 100000) * 0.05
    price *= 1 - Math.min(mileageDiscount, 0.3) // 最多降低30%
  }

  // 5. 根据车龄调整（每年降低3%）
  if (age > 0) {
    const ageDiscount = age * 0.03
    price *= 1 - Math.min(ageDiscount, 0.4) // 最多降低40%
  }

  // 6. 确保价格在合理范围内
  const range = getPriceRange(vehicleType)
  price = Math.max(range.min, Math.min(range.max, price))

  // 7. 四舍五入到整数
  return Math.round(price)
}

/**
 * 计算最终租金
 * 在基础租金上应用各种因子（城市因子、时间因子等）
 * @param basePrice 基础日租金
 * @param factors 价格调整因子数组
 * @returns 最终租金
 */
export function calculateFinalPrice(
  basePrice: number,
  factors: Array<{
    type: 'percentage' | 'fixed'
    value: number
    priority: number
  }> = []
): number {
  // 按优先级排序（优先级高的先应用）
  const sortedFactors = [...factors].sort((a, b) => b.priority - a.priority)

  let finalPrice = basePrice

  // 应用所有因子
  sortedFactors.forEach(factor => {
    if (factor.type === 'percentage') {
      // 百分比调整
      finalPrice *= 1 + factor.value / 100
    } else {
      // 固定金额调整
      finalPrice += factor.value
    }
  })

  // 确保价格不为负数
  finalPrice = Math.max(0, finalPrice)

  // 四舍五入到整数
  return Math.round(finalPrice)
}

/**
 * 计算租期折扣
 * 根据租期长度计算折扣
 * @param days 租期天数
 * @returns 折扣系数（0-1之间）
 */
export function calculateDurationDiscount(days: number): number {
  if (days >= 30) {
    return 0.8 // 月租：8折
  } else if (days >= 7) {
    return 0.9 // 周租：9折
  } else if (days >= 3) {
    return 0.95 // 3天以上：95折
  }
  return 1.0 // 短租：无折扣
}

/**
 * 计算总租金
 * @param dailyPrice 日租金
 * @param days 租期天数
 * @param applyDiscount 是否应用租期折扣
 * @returns 总租金
 */
export function calculateTotalPrice(
  dailyPrice: number,
  days: number,
  applyDiscount = true
): number {
  let total = dailyPrice * days

  if (applyDiscount) {
    const discount = calculateDurationDiscount(days)
    total *= discount
  }

  return Math.round(total)
}

/**
 * 格式化价格显示
 * @param price 价格
 * @param showUnit 是否显示单位
 * @returns 格式化后的价格字符串
 */
export function formatPrice(price: number, showUnit = true): string {
  const formattedPrice = price.toLocaleString('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })

  return showUnit ? `¥${formattedPrice}` : formattedPrice
}

/**
 * 计算价格变化百分比
 * @param oldPrice 原价格
 * @param newPrice 新价格
 * @returns 变化百分比（正数表示涨价，负数表示降价）
 */
export function calculatePriceChangePercentage(oldPrice: number, newPrice: number): number {
  if (oldPrice === 0) {
    return 0
  }

  const change = ((newPrice - oldPrice) / oldPrice) * 100
  return Math.round(change * 10) / 10 // 保留1位小数
}

/**
 * 获取价格变化描述
 * @param oldPrice 原价格
 * @param newPrice 新价格
 * @returns 价格变化描述文本
 */
export function getPriceChangeDescription(oldPrice: number, newPrice: number): string {
  const percentage = calculatePriceChangePercentage(oldPrice, newPrice)

  if (percentage > 0) {
    return `上涨 ${percentage}%`
  } else if (percentage < 0) {
    return `下降 ${Math.abs(percentage)}%`
  }
  return '无变化'
}

/**
 * 验证价格输入
 * @param price 价格
 * @param min 最小值
 * @param max 最大值
 * @returns 验证结果对象
 */
export function validatePrice(
  price: number,
  min = 0,
  max = 999999
): { valid: boolean; message?: string } {
  if (typeof price !== 'number' || isNaN(price)) {
    return { valid: false, message: '价格必须是有效数字' }
  }

  if (price < min) {
    return { valid: false, message: `价格不能低于 ${formatPrice(min)}` }
  }

  if (price > max) {
    return { valid: false, message: `价格不能高于 ${formatPrice(max)}` }
  }

  return { valid: true }
}

/**
 * 计算押金
 * 通常为日租金的一定倍数
 * @param dailyPrice 日租金
 * @param multiplier 倍数（默认3倍）
 * @returns 押金金额
 */
export function calculateDeposit(dailyPrice: number, multiplier = 3): number {
  return Math.round(dailyPrice * multiplier)
}

/**
 * 计算保险费用
 * @param dailyPrice 日租金
 * @param days 租期天数
 * @param insuranceRate 保险费率（默认5%）
 * @returns 保险费用
 */
export function calculateInsurance(
  dailyPrice: number,
  days: number,
  insuranceRate = 0.05
): number {
  const totalRent = dailyPrice * days
  return Math.round(totalRent * insuranceRate)
}

/**
 * 计算订单总金额
 * 包含租金、押金、保险等
 * @param options 计算选项
 * @returns 订单总金额明细
 */
export function calculateOrderTotal(options: {
  dailyPrice: number
  days: number
  applyDiscount?: boolean
  includeDeposit?: boolean
  includeInsurance?: boolean
  depositMultiplier?: number
  insuranceRate?: number
}): {
  rentTotal: number
  deposit: number
  insurance: number
  total: number
  discount: number
} {
  const {
    dailyPrice,
    days,
    applyDiscount = true,
    includeDeposit = true,
    includeInsurance = true,
    depositMultiplier = 3,
    insuranceRate = 0.05
  } = options

  // 计算租金总额
  const rentTotal = calculateTotalPrice(dailyPrice, days, applyDiscount)

  // 计算折扣金额
  const originalTotal = dailyPrice * days
  const discount = originalTotal - rentTotal

  // 计算押金
  const deposit = includeDeposit ? calculateDeposit(dailyPrice, depositMultiplier) : 0

  // 计算保险
  const insurance = includeInsurance ? calculateInsurance(dailyPrice, days, insuranceRate) : 0

  // 计算总金额
  const total = rentTotal + deposit + insurance

  return {
    rentTotal,
    deposit,
    insurance,
    total,
    discount
  }
}

/**
 * 获取车型列表
 * @returns 车型列表
 */
export function getVehicleTypes(): string[] {
  return Object.keys(VEHICLE_TYPE_BASE_PRICE)
}

/**
 * 获取车型价格信息
 * @param vehicleType 车型类型
 * @returns 车型价格信息对象
 */
export function getVehicleTypePriceInfo(vehicleType: string): {
  type: string
  basePrice: number
  priceRange: { min: number; max: number }
  formattedBasePrice: string
  formattedRange: string
} {
  const basePrice = getBasePrice(vehicleType)
  const priceRange = getPriceRange(vehicleType)

  return {
    type: vehicleType,
    basePrice,
    priceRange,
    formattedBasePrice: formatPrice(basePrice),
    formattedRange: `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`
  }
}

// ==================== 多因子动态定价计算引擎 ====================

/**
 * 因子类型
 */
export type FactorType = 'city' | 'time' | 'other'

/**
 * 因子详情接口
 */
export interface FactorDetail {
  factorId: number
  factorName: string
  factorType: FactorType
  adjustmentType: 'percentage' | 'fixed'
  configValue: number // 配置值（百分比或固定金额）
  calculatedAmount: number // 计算后的金额
  priority?: number // 优先级（仅城市和时间因子）
}

/**
 * 每日价格详情接口
 */
export interface DailyPriceDetail {
  date: string // 日期 YYYY-MM-DD
  basePrice: number // 车型基础价
  cityFactor?: FactorDetail // 城市因子
  timeFactor?: FactorDetail // 时间因子
  otherFactors: FactorDetail[] // 其他因子
  dailyRental: number // 当日租金
}

/**
 * 价格计算请求接口
 */
export interface PriceCalculationRequest {
  modelId: number
  modelName: string
  basePrice: number
  cityId: number
  cityName: string
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  cityFactors?: Array<{
    id: number
    name: string
    adjustmentType: 'percentage' | 'fixed'
    adjustmentValue: number
    priority: number
  }>
  timeFactors?: Array<{
    id: number
    name: string
    date: string
    adjustmentType: 'percentage' | 'fixed'
    adjustmentValue: number
    priority: number
  }>
  otherFactors?: Array<{
    id: number
    name: string
    adjustmentType: 'percentage' | 'fixed'
    adjustmentValue: number
  }>
}

/**
 * 价格计算结果接口
 */
export interface PriceCalculationResult {
  modelId: number
  modelName: string
  basePrice: number
  cityId: number
  cityName: string
  startDate: string
  endDate: string
  rentalDays: number

  // 因子详情
  cityFactor?: FactorDetail
  timeFactorSummary: {
    averageAmount: number
    dailyDetails: DailyPriceDetail[]
  }
  otherFactors: FactorDetail[]

  // 计算结果
  averageDailyRental: number // 平均每日租金
  totalPrice: number // 订单总价

  // 计算说明
  calculationExplanation: string
  calculatedAt: string
}

/**
 * 计算因子金额
 * @param basePrice 基础价格
 * @param adjustmentType 调整类型
 * @param adjustmentValue 调整值
 * @returns 因子金额
 */
function calculateFactorAmount(
  basePrice: number,
  adjustmentType: 'percentage' | 'fixed',
  adjustmentValue: number
): number {
  if (adjustmentType === 'percentage') {
    return Math.round(basePrice * (adjustmentValue / 100))
  } else {
    return adjustmentValue
  }
}

/**
 * 应用保底价规则
 * 最终每日租金不能低于车型基础价的20%
 * @param dailyRental 计算后的每日租金
 * @param basePrice 车型基础价
 * @returns 应用保底价后的租金
 */
function applyMinimumPriceRule(dailyRental: number, basePrice: number): number {
  const minimumPrice = Math.round(basePrice * 0.2)
  return Math.max(dailyRental, minimumPrice)
}

/**
 * 应用折扣限制规则
 * 百分比因子累计折扣不能超过80%
 * @param factors 因子列表
 * @returns 是否超过折扣限制
 */
function checkDiscountLimit(factors: Array<{ adjustmentType: 'percentage' | 'fixed'; adjustmentValue: number }>): {
  valid: boolean
  totalDiscount: number
  message?: string
} {
  const percentageFactors = factors.filter(f => f.adjustmentType === 'percentage' && f.adjustmentValue < 0)
  const totalDiscount = percentageFactors.reduce((sum, f) => sum + Math.abs(f.adjustmentValue), 0)

  if (totalDiscount > 80) {
    return {
      valid: false,
      totalDiscount,
      message: `累计折扣 ${totalDiscount}% 超过限制（最大80%）`
    }
  }

  return { valid: true, totalDiscount }
}

/**
 * 选择生效的城市因子
 * 同一城市只生效一个因子（优先级最高的）
 * @param cityFactors 城市因子列表
 * @returns 生效的城市因子
 */
function selectEffectiveCityFactor(
  cityFactors: Array<{
    id: number
    name: string
    adjustmentType: 'percentage' | 'fixed'
    adjustmentValue: number
    priority: number
  }>
): typeof cityFactors[0] | undefined {
  if (!cityFactors || cityFactors.length === 0) {
    return undefined
  }

  // 按优先级降序排序，取第一个
  const sorted = [...cityFactors].sort((a, b) => b.priority - a.priority)
  return sorted[0]
}

/**
 * 选择生效的时间因子
 * 同一天只生效一个因子（优先级最高的）
 * @param timeFactors 时间因子列表
 * @param date 日期
 * @returns 生效的时间因子
 */
function selectEffectiveTimeFactor(
  timeFactors: Array<{
    id: number
    name: string
    date: string
    adjustmentType: 'percentage' | 'fixed'
    adjustmentValue: number
    priority: number
  }>,
  date: string
): typeof timeFactors[0] | undefined {
  const factorsForDate = timeFactors.filter(f => f.date === date)

  if (factorsForDate.length === 0) {
    return undefined
  }

  // 按优先级降序排序，取第一个
  const sorted = [...factorsForDate].sort((a, b) => b.priority - a.priority)
  return sorted[0]
}

/**
 * 计算日期范围内的天数
 * @param startDate 开始日期 YYYY-MM-DD
 * @param endDate 结束日期 YYYY-MM-DD
 * @returns 天数
 */
function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1 // 包含起始日期
}

/**
 * 生成日期范围内的所有日期
 * @param startDate 开始日期 YYYY-MM-DD
 * @param endDate 结束日期 YYYY-MM-DD
 * @returns 日期数组
 */
function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)

  const current = new Date(start)
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }

  return dates
}

/**
 * 核心价格计算函数
 * 实现完整的多因子动态定价算法
 *
 * 计算公式：最终日租价 = 车型基础价 + 所有生效因子的金额
 *
 * @param request 价格计算请求
 * @returns 价格计算结果
 */
export function calculateMultiFactorPrice(request: PriceCalculationRequest): PriceCalculationResult {
  const {
    modelId,
    modelName,
    basePrice,
    cityId,
    cityName,
    startDate,
    endDate,
    cityFactors = [],
    timeFactors = [],
    otherFactors = []
  } = request

  // 步骤1：选择生效的城市因子（优先级最高的）
  const effectiveCityFactor = selectEffectiveCityFactor(cityFactors)

  let cityFactorDetail: FactorDetail | undefined
  let cityFactorAmount = 0

  if (effectiveCityFactor) {
    cityFactorAmount = calculateFactorAmount(
      basePrice,
      effectiveCityFactor.adjustmentType,
      effectiveCityFactor.adjustmentValue
    )

    cityFactorDetail = {
      factorId: effectiveCityFactor.id,
      factorName: effectiveCityFactor.name,
      factorType: 'city',
      adjustmentType: effectiveCityFactor.adjustmentType,
      configValue: effectiveCityFactor.adjustmentValue,
      calculatedAmount: cityFactorAmount,
      priority: effectiveCityFactor.priority
    }
  }

  // 步骤2：计算每天的价格（包含时间因子）
  const dateRange = generateDateRange(startDate, endDate)
  const dailyDetails: DailyPriceDetail[] = []
  let totalRental = 0

  for (const date of dateRange) {
    // 选择当天生效的时间因子
    const effectiveTimeFactor = selectEffectiveTimeFactor(timeFactors, date)

    let timeFactorDetail: FactorDetail | undefined
    let timeFactorAmount = 0

    if (effectiveTimeFactor) {
      timeFactorAmount = calculateFactorAmount(
        basePrice,
        effectiveTimeFactor.adjustmentType,
        effectiveTimeFactor.adjustmentValue
      )

      timeFactorDetail = {
        factorId: effectiveTimeFactor.id,
        factorName: effectiveTimeFactor.name,
        factorType: 'time',
        adjustmentType: effectiveTimeFactor.adjustmentType,
        configValue: effectiveTimeFactor.adjustmentValue,
        calculatedAmount: timeFactorAmount,
        priority: effectiveTimeFactor.priority
      }
    }

    // 步骤3：计算其他因子（所有命中的因子都生效）
    const otherFactorDetails: FactorDetail[] = []
    let otherFactorsAmount = 0

    for (const factor of otherFactors) {
      const amount = calculateFactorAmount(
        basePrice,
        factor.adjustmentType,
        factor.adjustmentValue
      )

      otherFactorsAmount += amount

      otherFactorDetails.push({
        factorId: factor.id,
        factorName: factor.name,
        factorType: 'other',
        adjustmentType: factor.adjustmentType,
        configValue: factor.adjustmentValue,
        calculatedAmount: amount
      })
    }

    // 步骤4：计算当日租金
    let dailyRental = basePrice + cityFactorAmount + timeFactorAmount + otherFactorsAmount

    // 步骤5：应用保底价规则
    dailyRental = applyMinimumPriceRule(dailyRental, basePrice)

    // 确保价格不为负数
    dailyRental = Math.max(0, Math.round(dailyRental))

    totalRental += dailyRental

    dailyDetails.push({
      date,
      basePrice,
      cityFactor: cityFactorDetail,
      timeFactor: timeFactorDetail,
      otherFactors: otherFactorDetails,
      dailyRental
    })
  }

  // 计算租期天数
  const rentalDays = calculateDays(startDate, endDate)

  // 计算平均每日租金
  const averageDailyRental = Math.round(totalRental / rentalDays)

  // 计算时间因子平均金额
  const totalTimeFactor = dailyDetails.reduce((sum, d) => sum + (d.timeFactor?.calculatedAmount || 0), 0)
  const averageTimeFactor = Math.round(totalTimeFactor / rentalDays)

  // 生成计算说明
  const explanation = generateCalculationExplanation({
    basePrice,
    cityFactor: cityFactorDetail,
    averageTimeFactor,
    otherFactors: dailyDetails[0]?.otherFactors || [],
    averageDailyRental,
    rentalDays,
    totalPrice: totalRental
  })

  return {
    modelId,
    modelName,
    basePrice,
    cityId,
    cityName,
    startDate,
    endDate,
    rentalDays,
    cityFactor: cityFactorDetail,
    timeFactorSummary: {
      averageAmount: averageTimeFactor,
      dailyDetails
    },
    otherFactors: dailyDetails[0]?.otherFactors || [],
    averageDailyRental,
    totalPrice: totalRental,
    calculationExplanation: explanation,
    calculatedAt: new Date().toISOString()
  }
}

/**
 * 生成计算说明
 * @param params 计算参数
 * @returns 人类可读的计算过程说明
 */
function generateCalculationExplanation(params: {
  basePrice: number
  cityFactor?: FactorDetail
  averageTimeFactor: number
  otherFactors: FactorDetail[]
  averageDailyRental: number
  rentalDays: number
  totalPrice: number
}): string {
  const {
    basePrice,
    cityFactor,
    averageTimeFactor,
    otherFactors,
    averageDailyRental,
    rentalDays,
    totalPrice
  } = params

  const lines: string[] = []

  lines.push(`车型基础价：¥${basePrice}/天`)

  if (cityFactor) {
    const sign = cityFactor.calculatedAmount >= 0 ? '+' : ''
    lines.push(`城市因子【${cityFactor.factorName}】：${sign}¥${cityFactor.calculatedAmount}/天`)
  }

  if (averageTimeFactor !== 0) {
    const sign = averageTimeFactor >= 0 ? '+' : ''
    lines.push(`时间因子（平均）：${sign}¥${averageTimeFactor}/天`)
  }

  if (otherFactors.length > 0) {
    for (const factor of otherFactors) {
      const sign = factor.calculatedAmount >= 0 ? '+' : ''
      lines.push(`${factor.factorName}：${sign}¥${factor.calculatedAmount}/天`)
    }
  }

  lines.push(`平均每日租金：¥${averageDailyRental}/天`)
  lines.push(`租期：${rentalDays}天`)
  lines.push(`订单总价：¥${totalPrice}`)

  return lines.join('\n')
}

/**
 * 验证价格计算请求
 * @param request 价格计算请求
 * @returns 验证结果
 */
export function validatePriceCalculationRequest(
  request: PriceCalculationRequest
): { valid: boolean; message?: string } {
  if (!request.modelId || !request.modelName) {
    return { valid: false, message: '车型信息不完整' }
  }

  if (!request.basePrice || request.basePrice <= 0) {
    return { valid: false, message: '车型基础价必须大于0' }
  }

  if (!request.cityId || !request.cityName) {
    return { valid: false, message: '城市信息不完整' }
  }

  if (!request.startDate || !request.endDate) {
    return { valid: false, message: '租期日期不完整' }
  }

  const start = new Date(request.startDate)
  const end = new Date(request.endDate)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, message: '日期格式错误' }
  }

  if (start > end) {
    return { valid: false, message: '开始日期不能晚于结束日期' }
  }

  // 检查折扣限制
  const allFactors = [
    ...(request.cityFactors || []),
    ...(request.timeFactors || []),
    ...(request.otherFactors || [])
  ]

  const discountCheck = checkDiscountLimit(allFactors)
  if (!discountCheck.valid) {
    return { valid: false, message: discountCheck.message }
  }

  return { valid: true }
}
