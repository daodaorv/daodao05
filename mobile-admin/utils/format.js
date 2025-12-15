/**
 * 格式化工具
 */

/**
 * 解析日期字符串（兼容 iOS）
 * iOS 不支持 "2025-11-28 15:30:00" 格式，需要转换为 "2025/11/28 15:30:00"
 */
function parseDate(date) {
  if (!date) return null

  // 如果已经是 Date 对象，直接返回
  if (date instanceof Date) return date

  // 将 "YYYY-MM-DD HH:mm:ss" 格式转换为 "YYYY/MM/DD HH:mm:ss"
  const dateStr = String(date).replace(/-/g, '/')
  return new Date(dateStr)
}

/**
 * 格式化日期时间
 */
export function formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''

  const d = parseDate(date)
  if (!d || isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 格式化日期
 */
export function formatDate(date) {
  return formatDateTime(date, 'YYYY-MM-DD')
}

/**
 * 格式化时间
 */
export function formatTime(date) {
  return formatDateTime(date, 'HH:mm:ss')
}

/**
 * 格式化金额
 */
export function formatMoney(money, decimals = 2) {
  if (money === null || money === undefined) return '0.00'

  const num = parseFloat(money)
  if (isNaN(num)) return '0.00'

  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 格式化手机号
 */
export function formatPhone(phone) {
  if (!phone) return ''
  // 验证手机号格式（11位数字）
  if (!/^\d{11}$/.test(phone)) {
    console.warn('Invalid phone format:', phone)
    return phone
  }
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')
}

/**
 * 隐藏手机号中间4位
 */
export function hidePhone(phone) {
  if (!phone) return ''
  // 验证手机号格式（11位数字）
  if (!/^\d{11}$/.test(phone)) {
    console.warn('Invalid phone format:', phone)
    return phone
  }
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 隐藏身份证号中间部分
 */
export function hideIdCard(idCard) {
  if (!idCard) return ''
  // 验证身份证号格式（15位或18位）
  if (!/^(\d{15}|\d{17}[\dXx])$/.test(idCard)) {
    console.warn('Invalid ID card format:', idCard)
    return idCard
  }
  return idCard.replace(/(\d{6})\d+(\d{4})/, '$1********$2')
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'

  // 边界检查：确保bytes是有效数字
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) {
    console.warn('Invalid bytes value:', bytes)
    return '0 B'
  }

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  // 边界检查：确保索引在有效范围内
  if (i < 0 || i >= sizes.length) {
    console.warn('Size index out of bounds:', i)
    return bytes + ' B'
  }

  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date) {
  if (!date) return ''

  const now = new Date()
  const target = parseDate(date)

  if (!target || isNaN(target.getTime())) return ''

  const diff = now - target

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return Math.floor(diff / minute) + '分钟前'
  } else if (diff < day) {
    return Math.floor(diff / hour) + '小时前'
  } else if (diff < 7 * day) {
    return Math.floor(diff / day) + '天前'
  } else {
    return formatDate(date)
  }
}

export default {
  formatDateTime,
  formatDate,
  formatTime,
  formatMoney,
  formatPhone,
  hidePhone,
  hideIdCard,
  formatFileSize,
  formatRelativeTime
}
