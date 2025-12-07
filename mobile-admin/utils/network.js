/**
 * QÜ¶¡
 * Ñ§QÜ¶ØÐ›QÜ¶åâŒ‹öå
 */
import logger from './logger'

/**
 * QÜ¶¡{
 */
class NetworkManager {
  constructor() {
    this.isOnline = true
    this.networkType = 'unknown'
    this.listeners = []
    this.init()
  }

  /**
   * ËQÜÑ§
   */
  init() {
    // ·ÖËQÜ¶
    this.checkNetworkStatus()

    // Ñ,QÜ¶Ø
    uni.onNetworkStatusChange((res) => {
      const wasOnline = this.isOnline
      this.isOnline = res.isConnected
      this.networkType = res.networkType

      logger.info('NetworkManager', 'Network status changed:', res.isConnected, res.networkType)

      // æÑ¶Ø‹ö
      if (wasOnline !== this.isOnline) {
        this.notifyListeners({
          isOnline: this.isOnline,
          networkType: this.networkType,
          previousState: wasOnline
        })
      }
    })
  }

  /**
   * ÀåSMQÜ¶
   */
  checkNetworkStatus() {
    uni.getNetworkType({
      success: (res) => {
        this.networkType = res.networkType
        this.isOnline = res.networkType !== 'none'
        logger.info('NetworkManager', 'Current network status:', this.isOnline, this.networkType)
      },
      fail: (error) => {
        logger.error('NetworkManager', 'Failed to get network status:', error)
      }
    })
  }

  /**
   * û QÜ¶ØÑ,h
   * @param {Function} listener - Ñ,ýp
   * @returns {Function} ÖˆÑ,„ýp
   */
  addListener(listener) {
    if (typeof listener === 'function') {
      this.listeners.push(listener)
      logger.info('NetworkManager', 'Added network listener')

      // ÔÞÖˆÑ,„ýp
      return () => this.removeListener(listener)
    }
  }

  /**
   * ûdQÜ¶ØÑ,h
   * @param {Function} listener - ûd„Ñ,ýp
   */
  removeListener(listener) {
    const index = this.listeners.indexOf(listener)
    if (index !== -1) {
      this.listeners.splice(index, 1)
      logger.info('NetworkManager', 'Removed network listener')
    }
  }

  /**
   * å@	Ñ,h
   * @param {Object} status - QÜ¶ùa
   */
  notifyListeners(status) {
    this.listeners.forEach(listener => {
      try {
        listener(status)
      } catch (error) {
        logger.error('NetworkManager', 'Listener execution failed:', error)
      }
    })
  }

  /**
   * ·ÖSMQÜ¶
   * @returns {Object} QÜ¶ùa
   */
  getStatus() {
    return {
      isOnline: this.isOnline,
      networkType: this.networkType
    }
  }

  /**
   * $­/&(¿
   * @returns {boolean} /&(¿
   */
  isConnected() {
    return this.isOnline
  }

  /**
   * $­/&»¿
   * @returns {boolean} /&»¿
   */
  isOffline() {
    return !this.isOnline
  }

  /**
   * ·ÖQÜ{‹
   * @returns {string} QÜ{‹
   */
  getNetworkType() {
    return this.networkType
  }

  /**
   * $­/&:WiFiQÜ
   * @returns {boolean} /&:WiFi
   */
  isWiFi() {
    return this.networkType === 'wifi'
  }

  /**
   * $­/&:û¨QÜ
   * @returns {boolean} /&:û¨QÜ
   */
  isMobile() {
    return ['2g', '3g', '4g', '5g'].includes(this.networkType)
  }

  /**
   * I…QÜÞ¥
   * @param {number} timeout - …ööôëÒ	
   * @returns {Promise<boolean>} /&Þ¥Ÿ
   */
  waitForConnection(timeout = 30000) {
    return new Promise((resolve) => {
      if (this.isOnline) {
        resolve(true)
        return
      }

      const timer = setTimeout(() => {
        this.removeListener(listener)
        resolve(false)
      }, timeout)

      const listener = (status) => {
        if (status.isOnline) {
          clearTimeout(timer)
          this.removeListener(listener)
          resolve(true)
        }
      }

      this.addListener(listener)
    })
  }
}

// úU‹
const networkManager = new NetworkManager()

export default networkManager
export { NetworkManager }
