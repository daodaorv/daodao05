/**
 * 统一日志系统
 * 提供开发环境调试和生产环境错误追踪功能
 */

/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

/**
 * 日志配置接口
 */
interface LoggerConfig {
  /** 是否启用日志 */
  enabled: boolean
  /** 最低日志级别 */
  minLevel: LogLevel
  /** 是否在生产环境启用 */
  enableInProduction: boolean
  /** 是否上报错误到服务器 */
  reportErrors: boolean
}

/**
 * 日志记录接口
 */
interface LogEntry {
  level: LogLevel
  message: string
  data?: unknown
  timestamp: string
  stack?: string
}

/**
 * 默认配置
 */
const defaultConfig: LoggerConfig = {
  enabled: true,
  minLevel: LogLevel.DEBUG,
  enableInProduction: false,
  reportErrors: true
}

/**
 * 当前配置
 */
let config: LoggerConfig = { ...defaultConfig }

/**
 * 判断是否为开发环境
 */
const isDevelopment = (): boolean => {
  // @ts-ignore
  return process.env.NODE_ENV === 'development'
}

/**
 * 判断是否应该记录日志
 */
const shouldLog = (level: LogLevel): boolean => {
  if (!config.enabled) return false
  if (!isDevelopment() && !config.enableInProduction) return false

  const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
  const currentLevelIndex = levels.indexOf(level)
  const minLevelIndex = levels.indexOf(config.minLevel)

  return currentLevelIndex >= minLevelIndex
}

/**
 * 格式化日志消息
 */
const formatMessage = (level: LogLevel, message: string, data?: unknown): string => {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [${level}]`

  if (data !== undefined) {
    return `${prefix} ${message} ${JSON.stringify(data, null, 2)}`
  }

  return `${prefix} ${message}`
}

/**
 * 上报错误到服务器
 */
const reportError = async (entry: LogEntry): Promise<void> => {
  if (!config.reportErrors) return
  if (!isDevelopment() && entry.level !== LogLevel.ERROR) return

  try {
    // TODO: 实现错误上报API
    // await uni.request({
    //   url: '/api/logs/error',
    //   method: 'POST',
    //   data: entry
    // })
  } catch (error) {
    // 上报失败时静默处理，避免循环错误
    console.error('Failed to report error:', error)
  }
}

/**
 * 日志记录器类
 */
class Logger {
  /**
   * 配置日志系统
   */
  configure(newConfig: Partial<LoggerConfig>): void {
    config = { ...config, ...newConfig }
  }

  /**
   * 获取当前配置
   */
  getConfig(): LoggerConfig {
    return { ...config }
  }

  /**
   * DEBUG级别日志
   * 用于详细的调试信息
   */
  debug(message: string, data?: unknown): void {
    if (!shouldLog(LogLevel.DEBUG)) return

    const formatted = formatMessage(LogLevel.DEBUG, message, data)
    console.log(formatted)
  }

  /**
   * INFO级别日志
   * 用于一般信息
   */
  info(message: string, data?: unknown): void {
    if (!shouldLog(LogLevel.INFO)) return

    const formatted = formatMessage(LogLevel.INFO, message, data)
    console.info(formatted)
  }

  /**
   * WARN级别日志
   * 用于警告信息
   */
  warn(message: string, data?: unknown): void {
    if (!shouldLog(LogLevel.WARN)) return

    const formatted = formatMessage(LogLevel.WARN, message, data)
    console.warn(formatted)

    const entry: LogEntry = {
      level: LogLevel.WARN,
      message,
      data,
      timestamp: new Date().toISOString()
    }
    reportError(entry)
  }

  /**
   * ERROR级别日志
   * 用于错误信息
   */
  error(message: string, error?: unknown): void {
    if (!shouldLog(LogLevel.ERROR)) return

    let errorData: unknown = error
    let stack: string | undefined

    // 提取错误堆栈
    if (error instanceof Error) {
      errorData = {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
      stack = error.stack
    }

    const formatted = formatMessage(LogLevel.ERROR, message, errorData)
    console.error(formatted)

    const entry: LogEntry = {
      level: LogLevel.ERROR,
      message,
      data: errorData,
      timestamp: new Date().toISOString(),
      stack
    }
    reportError(entry)
  }

  /**
   * 记录API请求
   */
  logRequest(method: string, url: string, data?: unknown): void {
    this.debug(`API Request: ${method} ${url}`, data)
  }

  /**
   * 记录API响应
   */
  logResponse(method: string, url: string, status: number, data?: unknown): void {
    if (status >= 200 && status < 300) {
      this.debug(`API Response: ${method} ${url} [${status}]`, data)
    } else if (status >= 400) {
      this.error(`API Error: ${method} ${url} [${status}]`, data)
    }
  }

  /**
   * 记录页面访问
   */
  logPageView(pagePath: string, params?: unknown): void {
    this.info(`Page View: ${pagePath}`, params)
  }

  /**
   * 记录用户行为
   */
  logUserAction(action: string, data?: unknown): void {
    this.info(`User Action: ${action}`, data)
  }

  /**
   * 性能监控
   */
  logPerformance(label: string, duration: number): void {
    this.debug(`Performance: ${label} took ${duration}ms`)
  }
}

/**
 * 导出单例实例
 */
export const logger = new Logger()

/**
 * 默认导出
 */
export default logger
