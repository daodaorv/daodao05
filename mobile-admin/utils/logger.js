/**
 * 统一日志工具
 * 提供分级日志记录功能，支持开发环境和生产环境的不同行为
 */

// 日志级别常量
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
}

// 日志级别名称映射
const LOG_LEVEL_NAMES = {
  0: 'DEBUG',
  1: 'INFO',
  2: 'WARN',
  3: 'ERROR',
  4: 'NONE'
}

// 日志配置
const config = {
  // 当前日志级别（开发环境显示所有日志，生产环境只显示警告和错误）
  level: process.env.NODE_ENV === 'production' ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG,
  // 是否启用日志
  enabled: true,
  // 是否显示时间戳
  showTimestamp: true,
  // 是否显示日志级别
  showLevel: true,
  // 日志前缀
  prefix: '[Mobile-Admin]'
}

/**
 * 格式化时间戳
 * @returns {string} 格式化后的时间字符串
 */
function formatTimestamp() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0')
  return `${hours}:${minutes}:${seconds}.${milliseconds}`
}

/**
 * 构建日志消息
 * @param {number} level - 日志级别
 * @param {string} tag - 日志标签
 * @returns {string} 格式化的日志前缀
 */
function buildLogPrefix(level, tag) {
  const parts = []

  // 添加项目前缀
  if (config.prefix) {
    parts.push(config.prefix)
  }

  // 添加时间戳
  if (config.showTimestamp) {
    parts.push(`[${formatTimestamp()}]`)
  }

  // 添加日志级别
  if (config.showLevel) {
    parts.push(`[${LOG_LEVEL_NAMES[level]}]`)
  }

  // 添加标签
  if (tag) {
    parts.push(`[${tag}]`)
  }

  return parts.join(' ')
}

/**
 * 判断是否应该输出日志
 * @param {number} level - 日志级别
 * @returns {boolean} 是否应该输出
 */
function shouldLog(level) {
  return config.enabled && level >= config.level
}

/**
 * 输出调试日志
 * @param {string} tag - 日志标签
 * @param {...any} args - 日志内容
 * @example
 * logger.debug('API', '请求参数:', { id: 1 })
 */
export function debug(tag, ...args) {
  if (!shouldLog(LOG_LEVELS.DEBUG)) return

  const prefix = buildLogPrefix(LOG_LEVELS.DEBUG, tag)
  console.log(prefix, ...args)
}

/**
 * 输出信息日志
 * @param {string} tag - 日志标签
 * @param {...any} args - 日志内容
 * @example
 * logger.info('User', '用户登录成功')
 */
export function info(tag, ...args) {
  if (!shouldLog(LOG_LEVELS.INFO)) return

  const prefix = buildLogPrefix(LOG_LEVELS.INFO, tag)
  console.log(prefix, ...args)
}

/**
 * 输出警告日志
 * @param {string} tag - 日志标签
 * @param {...any} args - 日志内容
 * @example
 * logger.warn('Storage', '存储空间不足')
 */
export function warn(tag, ...args) {
  if (!shouldLog(LOG_LEVELS.WARN)) return

  const prefix = buildLogPrefix(LOG_LEVELS.WARN, tag)
  console.warn(prefix, ...args)
}

/**
 * 输出错误日志
 * @param {string} tag - 日志标签
 * @param {...any} args - 日志内容
 * @example
 * logger.error('API', '请求失败:', error)
 */
export function error(tag, ...args) {
  if (!shouldLog(LOG_LEVELS.ERROR)) return

  const prefix = buildLogPrefix(LOG_LEVELS.ERROR, tag)

  // 处理错误对象
  const processedArgs = args.map(arg => {
    if (arg instanceof Error) {
      return {
        message: arg.message,
        stack: arg.stack,
        name: arg.name
      }
    }
    return arg
  })

  console.error(prefix, ...processedArgs)
}

/**
 * 设置日志级别
 * @param {number} level - 日志级别（使用 LOG_LEVELS 常量）
 * @example
 * logger.setLevel(logger.LOG_LEVELS.WARN)
 */
export function setLevel(level) {
  if (level >= LOG_LEVELS.DEBUG && level <= LOG_LEVELS.NONE) {
    config.level = level
  } else {
    console.warn('Invalid log level:', level)
  }
}

/**
 * 启用或禁用日志
 * @param {boolean} enabled - 是否启用
 * @example
 * logger.setEnabled(false) // 禁用所有日志
 */
export function setEnabled(enabled) {
  config.enabled = !!enabled
}

/**
 * 设置日志前缀
 * @param {string} prefix - 日志前缀
 * @example
 * logger.setPrefix('[MyApp]')
 */
export function setPrefix(prefix) {
  config.prefix = prefix
}

/**
 * 创建带标签的日志记录器
 * @param {string} tag - 默认标签
 * @returns {Object} 日志记录器对象
 * @example
 * const apiLogger = logger.createLogger('API')
 * apiLogger.info('请求成功')
 * apiLogger.error('请求失败', error)
 */
export function createLogger(tag) {
  return {
    debug: (...args) => debug(tag, ...args),
    info: (...args) => info(tag, ...args),
    warn: (...args) => warn(tag, ...args),
    error: (...args) => error(tag, ...args)
  }
}

// 导出日志级别常量
export { LOG_LEVELS }

// 默认导出
export default {
  debug,
  info,
  warn,
  error,
  setLevel,
  setEnabled,
  setPrefix,
  createLogger,
  LOG_LEVELS
}
