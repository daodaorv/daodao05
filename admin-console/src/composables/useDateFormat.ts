/**
 * 日期格式化 Composable
 *
 * @description 统一管理日期格式化逻辑，避免在每个页面重复定义
 *
 * @example
 * ```ts
 * const { formatDateTime, formatDate, formatTime, formatRelativeTime } = useDateFormat()
 *
 * formatDateTime('2024-01-01 12:00:00') // '2024-01-01 12:00:00'
 * formatDate('2024-01-01') // '2024-01-01'
 * formatRelativeTime('2024-01-01 12:00:00') // '3天前'
 * ```
 */
export function useDateFormat() {
  /**
   * 格式化日期时间
   * @param dateStr 日期字符串
   * @param format 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
   */
  const formatDateTime = (dateStr?: string | Date | null, format = 'YYYY-MM-DD HH:mm:ss'): string => {
    if (!dateStr) return '-'

    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return '-'

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')

      return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds)
    } catch (error) {
      console.error('日期格式化失败:', error)
      return '-'
    }
  }

  /**
   * 格式化日期
   * @param dateStr 日期字符串
   */
  const formatDate = (dateStr?: string | Date | null): string => {
    return formatDateTime(dateStr, 'YYYY-MM-DD')
  }

  /**
   * 格式化时间
   * @param dateStr 日期字符串
   */
  const formatTime = (dateStr?: string | Date | null): string => {
    return formatDateTime(dateStr, 'HH:mm:ss')
  }

  /**
   * 格式化相对时间（多久之前）
   * @param dateStr 日期字符串
   */
  const formatRelativeTime = (dateStr?: string | Date | null): string => {
    if (!dateStr) return '-'

    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return '-'

      const now = new Date()
      const diff = now.getTime() - date.getTime()

      // 小于1分钟
      if (diff < 60 * 1000) {
        return '刚刚'
      }

      // 小于1小时
      if (diff < 60 * 60 * 1000) {
        const minutes = Math.floor(diff / (60 * 1000))
        return `${minutes}分钟前`
      }

      // 小于1天
      if (diff < 24 * 60 * 60 * 1000) {
        const hours = Math.floor(diff / (60 * 60 * 1000))
        return `${hours}小时前`
      }

      // 小于7天
      if (diff < 7 * 24 * 60 * 60 * 1000) {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000))
        return `${days}天前`
      }

      // 小于30天
      if (diff < 30 * 24 * 60 * 60 * 1000) {
        const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000))
        return `${weeks}周前`
      }

      // 小于1年
      if (diff < 365 * 24 * 60 * 60 * 1000) {
        const months = Math.floor(diff / (30 * 24 * 60 * 60 * 1000))
        return `${months}个月前`
      }

      // 超过1年
      const years = Math.floor(diff / (365 * 24 * 60 * 60 * 1000))
      return `${years}年前`
    } catch (error) {
      console.error('相对时间格式化失败:', error)
      return '-'
    }
  }

  /**
   * 格式化时间范围
   * @param startDate 开始日期
   * @param endDate 结束日期
   */
  const formatDateRange = (
    startDate?: string | Date | null,
    endDate?: string | Date | null
  ): string => {
    const start = formatDate(startDate)
    const end = formatDate(endDate)

    if (start === '-' && end === '-') return '-'
    if (start === '-') return `至 ${end}`
    if (end === '-') return `${start} 至今`

    return `${start} 至 ${end}`
  }

  /**
   * 计算时间差（天数）
   * @param startDate 开始日期
   * @param endDate 结束日期
   */
  const getDaysDiff = (
    startDate: string | Date,
    endDate: string | Date = new Date()
  ): number => {
    try {
      const start = new Date(startDate)
      const end = new Date(endDate)

      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0

      const diff = end.getTime() - start.getTime()
      return Math.floor(diff / (24 * 60 * 60 * 1000))
    } catch (error) {
      console.error('计算时间差失败:', error)
      return 0
    }
  }

  /**
   * 判断日期是否过期
   * @param dateStr 日期字符串
   */
  const isExpired = (dateStr?: string | Date | null): boolean => {
    if (!dateStr) return false

    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return false

      return date.getTime() < Date.now()
    } catch (error) {
      console.error('判断日期是否过期失败:', error)
      return false
    }
  }

  /**
   * 判断日期是否即将过期（默认7天内）
   * @param dateStr 日期字符串
   * @param days 天数阈值
   */
  const isExpiringSoon = (dateStr?: string | Date | null, days = 7): boolean => {
    if (!dateStr) return false

    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return false

      const now = Date.now()
      const diff = date.getTime() - now

      return diff > 0 && diff < days * 24 * 60 * 60 * 1000
    } catch (error) {
      console.error('判断日期是否即将过期失败:', error)
      return false
    }
  }

  return {
    formatDateTime,
    formatDate,
    formatTime,
    formatRelativeTime,
    formatDateRange,
    getDaysDiff,
    isExpired,
    isExpiringSoon
  }
}
