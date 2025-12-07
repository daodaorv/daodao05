/**
 * 主题管理工具
 * 提供主题切换、主题配置管理功能
 */

import { getStorage, setStorage } from './storage'
import logger from './logger'

// 主题类型
export const THEME_TYPES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
}

// 主题配置
const THEME_CONFIG = {
  light: {
    // 主色调
    primaryColor: '#667eea',
    primaryColorLight: '#8b9ef5',
    primaryColorDark: '#4c63d2',

    // 背景色
    backgroundColor: '#f5f5f5',
    backgroundColorSecondary: '#ffffff',

    // 文字颜色
    textColorPrimary: '#333333',
    textColorSecondary: '#666666',
    textColorTertiary: '#999999',
    textColorDisabled: '#cccccc',

    // 边框颜色
    borderColor: '#e5e5e5',
    borderColorLight: '#f5f5f5',

    // 状态颜色
    successColor: '#67c23a',
    warningColor: '#e6a23c',
    dangerColor: '#f56c6c',
    infoColor: '#909399',

    // 阴影
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowColorLight: 'rgba(0, 0, 0, 0.05)',

    // 遮罩
    maskColor: 'rgba(0, 0, 0, 0.5)'
  },

  dark: {
    // 主色调
    primaryColor: '#667eea',
    primaryColorLight: '#8b9ef5',
    primaryColorDark: '#4c63d2',

    // 背景色
    backgroundColor: '#1a1a1a',
    backgroundColorSecondary: '#2d2d2d',

    // 文字颜色
    textColorPrimary: '#e5e5e5',
    textColorSecondary: '#b3b3b3',
    textColorTertiary: '#808080',
    textColorDisabled: '#4d4d4d',

    // 边框颜色
    borderColor: '#404040',
    borderColorLight: '#333333',

    // 状态颜色
    successColor: '#67c23a',
    warningColor: '#e6a23c',
    dangerColor: '#f56c6c',
    infoColor: '#909399',

    // 阴影
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowColorLight: 'rgba(0, 0, 0, 0.2)',

    // 遮罩
    maskColor: 'rgba(0, 0, 0, 0.7)'
  }
}

/**
 * 主题管理类
 */
class ThemeManager {
  constructor() {
    this.currentTheme = THEME_TYPES.LIGHT
    this.listeners = []
    this.init()
  }

  /**
   * 初始化主题管理器
   */
  init() {
    // 加载保存的主题设置
    const savedTheme = getStorage('app_theme')
    if (savedTheme) {
      this.currentTheme = savedTheme
    } else {
      // 默认使用浅色主题
      this.currentTheme = THEME_TYPES.LIGHT
    }

    // 应用主题
    this.applyTheme(this.currentTheme)

    logger.info('ThemeManager', 'Theme manager initialized:', this.currentTheme)
  }

  /**
   * 获取当前主题
   * @returns {string} 当前主题类型
   */
  getCurrentTheme() {
    return this.currentTheme
  }

  /**
   * 获取实际应用的主题（处理auto模式）
   * @returns {string} 实际主题类型（light或dark）
   */
  getActualTheme() {
    if (this.currentTheme === THEME_TYPES.AUTO) {
      return this.getSystemTheme()
    }
    return this.currentTheme
  }

  /**
   * 获取系统主题
   * @returns {string} 系统主题类型
   */
  getSystemTheme() {
    // uni-app 暂不支持直接获取系统主题
    // 可以通过条件编译使用原生能力
    // #ifdef APP-PLUS
    // 这里可以通过原生插件获取系统主题
    // #endif

    // 默认返回浅色主题
    return THEME_TYPES.LIGHT
  }

  /**
   * 设置主题
   * @param {string} theme - 主题类型
   */
  setTheme(theme) {
    if (!Object.values(THEME_TYPES).includes(theme)) {
      logger.error('ThemeManager', 'Invalid theme type:', theme)
      return
    }

    this.currentTheme = theme
    setStorage('app_theme', theme)
    this.applyTheme(theme)
    this.notifyListeners(theme)

    logger.info('ThemeManager', 'Theme changed to:', theme)
  }

  /**
   * 应用主题
   * @param {string} theme - 主题类型
   */
  applyTheme(theme) {
    const actualTheme = theme === THEME_TYPES.AUTO ? this.getSystemTheme() : theme
    const themeConfig = THEME_CONFIG[actualTheme]

    if (!themeConfig) {
      logger.error('ThemeManager', 'Theme config not found:', actualTheme)
      return
    }

    // 将主题配置应用到全局
    // 可以通过修改 CSS 变量或者存储到 storage 供页面读取
    setStorage('current_theme_config', themeConfig)

    // 设置状态栏样式
    this.setStatusBarStyle(actualTheme)

    logger.info('ThemeManager', 'Theme applied:', actualTheme)
  }

  /**
   * 设置状态栏样式
   * @param {string} theme - 主题类型
   */
  setStatusBarStyle(theme) {
    // #ifdef APP-PLUS
    const statusBarStyle = theme === THEME_TYPES.DARK ? 'light' : 'dark'
    plus.navigator.setStatusBarStyle(statusBarStyle)
    // #endif

    // #ifdef MP-WEIXIN
    // 微信小程序设置导航栏样式
    // wx.setNavigationBarColor({
    //   frontColor: theme === THEME_TYPES.DARK ? '#ffffff' : '#000000',
    //   backgroundColor: theme === THEME_TYPES.DARK ? '#1a1a1a' : '#ffffff'
    // })
    // #endif
  }

  /**
   * 获取主题配置
   * @param {string} theme - 主题类型（可选，默认当前主题）
   * @returns {Object} 主题配置对象
   */
  getThemeConfig(theme) {
    const targetTheme = theme || this.getActualTheme()
    return THEME_CONFIG[targetTheme] || THEME_CONFIG[THEME_TYPES.LIGHT]
  }

  /**
   * 获取主题颜色
   * @param {string} colorKey - 颜色键名
   * @returns {string} 颜色值
   */
  getThemeColor(colorKey) {
    const themeConfig = this.getThemeConfig()
    return themeConfig[colorKey] || ''
  }

  /**
   * 切换主题（在light和dark之间切换）
   */
  toggleTheme() {
    const actualTheme = this.getActualTheme()
    const newTheme = actualTheme === THEME_TYPES.LIGHT ? THEME_TYPES.DARK : THEME_TYPES.LIGHT
    this.setTheme(newTheme)
  }

  /**
   * 添加主题变化监听器
   * @param {Function} listener - 监听器函数
   * @returns {Function} 取消监听的函数
   */
  addListener(listener) {
    if (typeof listener === 'function') {
      this.listeners.push(listener)
      logger.info('ThemeManager', 'Added theme listener')

      // 返回取消监听的函数
      return () => this.removeListener(listener)
    }
  }

  /**
   * 移除主题变化监听器
   * @param {Function} listener - 要移除的监听器函数
   */
  removeListener(listener) {
    const index = this.listeners.indexOf(listener)
    if (index !== -1) {
      this.listeners.splice(index, 1)
      logger.info('ThemeManager', 'Removed theme listener')
    }
  }

  /**
   * 通知所有监听器
   * @param {string} theme - 新主题类型
   */
  notifyListeners(theme) {
    const actualTheme = this.getActualTheme()
    this.listeners.forEach(listener => {
      try {
        listener({
          theme: theme,
          actualTheme: actualTheme,
          config: this.getThemeConfig()
        })
      } catch (error) {
        logger.error('ThemeManager', 'Listener execution failed:', error)
      }
    })
  }

  /**
   * 判断是否为深色主题
   * @returns {boolean} 是否为深色主题
   */
  isDarkTheme() {
    return this.getActualTheme() === THEME_TYPES.DARK
  }

  /**
   * 判断是否为浅色主题
   * @returns {boolean} 是否为浅色主题
   */
  isLightTheme() {
    return this.getActualTheme() === THEME_TYPES.LIGHT
  }

  /**
   * 重置主题为默认值
   */
  resetTheme() {
    this.setTheme(THEME_TYPES.LIGHT)
  }
}

// 创建单例
const themeManager = new ThemeManager()

export default themeManager
export { ThemeManager, THEME_CONFIG }
