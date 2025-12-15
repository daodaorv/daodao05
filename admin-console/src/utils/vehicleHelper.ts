/**
 * 车辆管理辅助工具
 * 提供虚拟牌照生成、牌照验证等功能
 */

/**
 * 虚拟牌照前缀配置
 * 用于区分不同所有权类型的车辆
 */
const VIRTUAL_PLATE_PREFIX = {
  platform: 'DD', // 平台自有车辆
  hosting: 'TG', // 托管车辆
  cooperative: 'HZ' // 合作商车辆
} as const

/**
 * 虚拟牌照格式说明
 * 格式: {前缀}{年份后2位}{月份2位}{序号4位}
 * 示例: DD250112001 (平台自有-2025年1月-序号001)
 *       TG250112002 (托管-2025年1月-序号002)
 *       HZ250112003 (合作商-2025年1月-序号003)
 */

/**
 * 生成虚拟牌照
 * @param ownershipType 所有权类型 ('platform' | 'hosting' | 'cooperative')
 * @param existingPlates 已存在的虚拟牌照列表（用于避免重复）
 * @returns 生成的虚拟牌照
 */
export function generateVirtualPlate(
  ownershipType: 'platform' | 'hosting' | 'cooperative',
  existingPlates: string[] = []
): string {
  const prefix = VIRTUAL_PLATE_PREFIX[ownershipType]
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2) // 年份后2位
  const month = (now.getMonth() + 1).toString().padStart(2, '0') // 月份2位

  // 从当前月份的虚拟牌照中找出最大序号
  const currentMonthPrefix = `${prefix}${year}${month}`
  const currentMonthPlates = existingPlates.filter(plate =>
    plate.startsWith(currentMonthPrefix)
  )

  let maxSequence = 0
  currentMonthPlates.forEach(plate => {
    const sequence = parseInt(plate.slice(-4), 10)
    if (!isNaN(sequence) && sequence > maxSequence) {
      maxSequence = sequence
    }
  })

  // 生成新序号（从1开始）
  const newSequence = (maxSequence + 1).toString().padStart(4, '0')
  const virtualPlate = `${currentMonthPrefix}${newSequence}`

  return virtualPlate
}

/**
 * 验证虚拟牌照格式
 * @param plate 虚拟牌照
 * @returns 是否为有效的虚拟牌照格式
 */
export function isValidVirtualPlate(plate: string): boolean {
  if (!plate || typeof plate !== 'string') {
    return false
  }

  // 检查长度（前缀2位 + 年份2位 + 月份2位 + 序号4位 = 10位）
  if (plate.length !== 10) {
    return false
  }

  // 检查前缀
  const prefix = plate.slice(0, 2)
  const validPrefixes = Object.values(VIRTUAL_PLATE_PREFIX)
  if (!validPrefixes.includes(prefix as any)) {
    return false
  }

  // 检查年份（00-99）
  const year = plate.slice(2, 4)
  if (!/^\d{2}$/.test(year)) {
    return false
  }

  // 检查月份（01-12）
  const month = plate.slice(4, 6)
  const monthNum = parseInt(month, 10)
  if (!/^\d{2}$/.test(month) || monthNum < 1 || monthNum > 12) {
    return false
  }

  // 检查序号（0001-9999）
  const sequence = plate.slice(6, 10)
  if (!/^\d{4}$/.test(sequence)) {
    return false
  }

  return true
}

/**
 * 解析虚拟牌照信息
 * @param plate 虚拟牌照
 * @returns 解析后的信息对象
 */
export function parseVirtualPlate(plate: string): {
  isValid: boolean
  ownershipType?: 'platform' | 'hosting' | 'cooperative'
  year?: number
  month?: number
  sequence?: number
  generatedDate?: string
} {
  if (!isValidVirtualPlate(plate)) {
    return { isValid: false }
  }

  const prefix = plate.slice(0, 2)
  const year = parseInt(plate.slice(2, 4), 10)
  const month = parseInt(plate.slice(4, 6), 10)
  const sequence = parseInt(plate.slice(6, 10), 10)

  // 根据前缀确定所有权类型
  let ownershipType: 'platform' | 'hosting' | 'cooperative' | undefined
  if (prefix === VIRTUAL_PLATE_PREFIX.platform) {
    ownershipType = 'platform'
  } else if (prefix === VIRTUAL_PLATE_PREFIX.hosting) {
    ownershipType = 'hosting'
  } else if (prefix === VIRTUAL_PLATE_PREFIX.cooperative) {
    ownershipType = 'cooperative'
  }

  // 计算完整年份（假设2000年后）
  const fullYear = 2000 + year

  // 生成日期字符串
  const generatedDate = `${fullYear}-${month.toString().padStart(2, '0')}`

  return {
    isValid: true,
    ownershipType,
    year: fullYear,
    month,
    sequence,
    generatedDate
  }
}

/**
 * 检查虚拟牌照是否已存在
 * @param plate 虚拟牌照
 * @param existingPlates 已存在的虚拟牌照列表
 * @returns 是否已存在
 */
export function checkPlateExists(plate: string, existingPlates: string[]): boolean {
  return existingPlates.includes(plate)
}

/**
 * 批量生成虚拟牌照
 * @param ownershipType 所有权类型
 * @param count 生成数量
 * @param existingPlates 已存在的虚拟牌照列表
 * @returns 生成的虚拟牌照数组
 */
export function generateBatchVirtualPlates(
  ownershipType: 'platform' | 'hosting' | 'cooperative',
  count: number,
  existingPlates: string[] = []
): string[] {
  const plates: string[] = []
  const allExistingPlates = [...existingPlates]

  for (let i = 0; i < count; i++) {
    const newPlate = generateVirtualPlate(ownershipType, allExistingPlates)
    plates.push(newPlate)
    allExistingPlates.push(newPlate) // 添加到已存在列表，避免重复
  }

  return plates
}

/**
 * 获取虚拟牌照的显示文本
 * @param plate 虚拟牌照
 * @returns 格式化的显示文本
 */
export function getVirtualPlateDisplayText(plate: string): string {
  const info = parseVirtualPlate(plate)

  if (!info.isValid) {
    return plate
  }

  const typeMap = {
    platform: '平台自有',
    hosting: '托管',
    cooperative: '合作商'
  }

  const typeName = info.ownershipType ? typeMap[info.ownershipType] : '未知'

  return `${plate} (${typeName}-${info.generatedDate})`
}

/**
 * 根据所有权类型获取虚拟牌照前缀
 * @param ownershipType 所有权类型
 * @returns 虚拟牌照前缀
 */
export function getVirtualPlatePrefix(
  ownershipType: 'platform' | 'hosting' | 'cooperative'
): string {
  return VIRTUAL_PLATE_PREFIX[ownershipType]
}

/**
 * 验证真实牌照格式（中国车牌）
 * @param plate 车牌号
 * @returns 是否为有效的真实车牌格式
 */
export function isValidRealPlate(plate: string): boolean {
  if (!plate || typeof plate !== 'string') {
    return false
  }

  // 中国车牌格式：
  // 普通车牌：省份简称(1位) + 字母(1位) + 5位数字或字母
  // 新能源车牌：省份简称(1位) + 字母(1位) + 6位数字或字母
  const normalPlateRegex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{5}$/
  const newEnergyPlateRegex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{6}$/

  return normalPlateRegex.test(plate) || newEnergyPlateRegex.test(plate)
}

/**
 * 判断是否为虚拟牌照
 * @param plate 牌照号
 * @returns 是否为虚拟牌照
 */
export function isVirtualPlate(plate: string): boolean {
  return isValidVirtualPlate(plate)
}

/**
 * 格式化牌照显示
 * @param plate 牌照号
 * @param showType 是否显示类型标签
 * @returns 格式化后的牌照显示文本
 */
export function formatPlateDisplay(plate: string, showType = true): string {
  if (!plate) {
    return '无牌照'
  }

  if (isVirtualPlate(plate)) {
    return showType ? getVirtualPlateDisplayText(plate) : plate
  }

  if (isValidRealPlate(plate)) {
    return showType ? `${plate} (真实牌照)` : plate
  }

  return plate
}
