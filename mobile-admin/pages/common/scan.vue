<template>
  <view class="scan-container">
    <!-- 扫码区域 -->
    <view class="scan-area">
      <view class="scan-frame">
        <view class="corner corner-tl"></view>
        <view class="corner corner-tr"></view>
        <view class="corner corner-bl"></view>
        <view class="corner corner-br"></view>
        <view class="scan-line"></view>
      </view>
      <text class="scan-tip">{{ scanTip }}</text>
    </view>

    <!-- 扫码类型切换 -->
    <view class="type-switch">
      <view
        class="type-item"
        :class="{ active: scanType === 'qrcode' }"
        @click="switchType('qrcode')"
      >
        <text class="type-icon">📱</text>
        <text class="type-name">二维码</text>
      </view>
      <view
        class="type-item"
        :class="{ active: scanType === 'barcode' }"
        @click="switchType('barcode')"
      >
        <text class="type-icon">📊</text>
        <text class="type-name">条形码</text>
      </view>
      <view
        class="type-item"
        :class="{ active: scanType === 'idcard' }"
        @click="switchType('idcard')"
      >
        <text class="type-icon">🪪</text>
        <text class="type-name">身份证</text>
      </view>
      <view
        class="type-item"
        :class="{ active: scanType === 'license' }"
        @click="switchType('license')"
      >
        <text class="type-icon">🚗</text>
        <text class="type-name">驾驶证</text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="action-button" @click="startScan">
        <text class="button-icon">📷</text>
        <text class="button-text">开始扫描</text>
      </button>
      <button class="action-button secondary" @click="chooseImage">
        <text class="button-icon">🖼️</text>
        <text class="button-text">从相册选择</text>
      </button>
      <button class="action-button secondary" @click="toggleFlash">
        <text class="button-icon">{{ flashOn ? '🔦' : '💡' }}</text>
        <text class="button-text">{{ flashOn ? '关闭' : '打开' }}闪光灯</text>
      </button>
    </view>

    <!-- 扫描历史 -->
    <view class="history-section">
      <view class="history-header">
        <text class="history-title">扫描历史</text>
        <text class="history-clear" @click="clearHistory">清空</text>
      </view>
      <view class="history-list" v-if="scanHistory.length > 0">
        <view
          class="history-item"
          v-for="(item, index) in scanHistory"
          :key="index"
          @click="viewHistoryDetail(item)"
        >
          <view class="history-icon">{{ getTypeIcon(item.type) }}</view>
          <view class="history-info">
            <text class="history-content">{{ item.content }}</text>
            <text class="history-time">{{ item.time }}</text>
          </view>
          <text class="history-arrow">›</text>
        </view>
      </view>
      <view class="history-empty" v-else>
        <text class="empty-text">暂无扫描记录</text>
      </view>
    </view>

    <!-- 结果弹窗 -->
    <u-popup :show="showResult" mode="bottom" :round="20" @close="showResult = false">
      <view class="result-popup">
        <view class="result-header">
          <text class="result-title">识别结果</text>
          <view class="result-close" @click="showResult = false">✕</view>
        </view>
        <view class="result-content">
          <view class="result-type">
            <text class="type-label">类型：</text>
            <text class="type-value">{{ getTypeName(scanResult.type) }}</text>
          </view>
          <view class="result-data" v-if="scanResult.type === 'qrcode' || scanResult.type === 'barcode'">
            <text class="data-label">内容：</text>
            <text class="data-value">{{ scanResult.content }}</text>
          </view>
          <view class="result-data" v-if="scanResult.type === 'idcard' && scanResult.data">
            <view class="data-row">
              <text class="data-label">姓名：</text>
              <text class="data-value">{{ scanResult.data.name }}</text>
            </view>
            <view class="data-row">
              <text class="data-label">性别：</text>
              <text class="data-value">{{ scanResult.data.gender }}</text>
            </view>
            <view class="data-row">
              <text class="data-label">民族：</text>
              <text class="data-value">{{ scanResult.data.nation }}</text>
            </view>
            <view class="data-row">
              <text class="data-label">出生日期：</text>
              <text class="data-value">{{ scanResult.data.birth }}</text>
            </view>
            <view class="data-row">
              <text class="data-label">身份证号：</text>
              <text class="data-value">{{ scanResult.data.idNumber }}</text>
            </view>
            <view class="data-row">
              <text class="data-label">地址：</text>
              <text class="data-value">{{ scanResult.data.address }}</text>
            </view>
          </view>
          <view class="result-data" v-if="scanResult.type === 'license' && scanResult.data">
            <view class="data-row">
              <text class="data-label">姓名：</text>
              <text class="data-value">{{ scanResult.data.name }}</text>
            </view>
            <view class="data-row">
              <text class="data-label">证号：</text>
              <text class="data-value">{{ scanResult.data.licenseNumber }}</text>
            </view>
            <view class="data-row">
              <text class="data-label">准驾车型：</text>
              <text class="data-value">{{ scanResult.data.vehicleType }}</text>
            </view>
            <view class="data-row">
              <text class="data-label">有效期：</text>
              <text class="data-value">{{ scanResult.data.validPeriod }}</text>
            </view>
          </view>
        </view>
        <view class="result-actions">
          <button class="result-button copy" @click="copyResult">复制内容</button>
          <button class="result-button confirm" @click="confirmResult">确认使用</button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { scanCode, recognizeIdCard, recognizeLicense } from '@/api/ocr'

export default {
  data() {
    return {
      scanType: 'qrcode', // qrcode, barcode, idcard, license
      flashOn: false,
      showResult: false,
      scanResult: {
        type: '',
        content: '',
        data: null
      },
      scanHistory: [],
      fromPage: '', // 来源页面
      callback: '' // 回调函数名
    }
  },

  computed: {
    scanTip() {
      const tips = {
        qrcode: '将二维码放入框内，即可自动扫描',
        barcode: '将条形码放入框内，即可自动扫描',
        idcard: '请拍摄身份证正面照片',
        license: '请拍摄驾驶证照片'
      }
      return tips[this.scanType] || '请选择扫描类型'
    }
  },

  onLoad(options) {
    if (options.type) {
      this.scanType = options.type
    }
    if (options.from) {
      this.fromPage = options.from
    }
    if (options.callback) {
      this.callback = options.callback
    }
    this.loadScanHistory()
  },

  methods: {
    switchType(type) {
      this.scanType = type
    },

    startScan() {
      if (this.scanType === 'qrcode' || this.scanType === 'barcode') {
        this.scanQRCode()
      } else if (this.scanType === 'idcard') {
        this.scanIdCard()
      } else if (this.scanType === 'license') {
        this.scanLicense()
      }
    },

    scanQRCode() {
      uni.scanCode({
        scanType: this.scanType === 'qrcode' ? ['qrCode'] : ['barCode'],
        success: (res) => {
          this.handleScanResult({
            type: this.scanType,
            content: res.result,
            data: null
          })
        },
        fail: (error) => {
          uni.showToast({
            title: '扫描失败',
            icon: 'none'
          })
          console.error('扫描失败:', error)
        }
      })
    },

    scanIdCard() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera', 'album'],
        success: (res) => {
          this.recognizeIdCardImage(res.tempFilePaths[0])
        }
      })
    },

    scanLicense() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera', 'album'],
        success: (res) => {
          this.recognizeLicenseImage(res.tempFilePaths[0])
        }
      })
    },

    async recognizeIdCardImage(imagePath) {
      try {
        uni.showLoading({ title: '识别中...' })
        const res = await recognizeIdCard({ imagePath })
        uni.hideLoading()

        if (res.code === 200) {
          this.handleScanResult({
            type: 'idcard',
            content: res.data.idNumber,
            data: res.data
          })
        } else {
          uni.showToast({
            title: res.message || '识别失败',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '识别失败',
          icon: 'none'
        })
        console.error('身份证识别失败:', error)
      }
    },

    async recognizeLicenseImage(imagePath) {
      try {
        uni.showLoading({ title: '识别中...' })
        const res = await recognizeLicense({ imagePath })
        uni.hideLoading()

        if (res.code === 200) {
          this.handleScanResult({
            type: 'license',
            content: res.data.licenseNumber,
            data: res.data
          })
        } else {
          uni.showToast({
            title: res.message || '识别失败',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '识别失败',
          icon: 'none'
        })
        console.error('驾驶证识别失败:', error)
      }
    },

    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: (res) => {
          if (this.scanType === 'idcard') {
            this.recognizeIdCardImage(res.tempFilePaths[0])
          } else if (this.scanType === 'license') {
            this.recognizeLicenseImage(res.tempFilePaths[0])
          } else {
            uni.showToast({
              title: '该类型不支持从相册选择',
              icon: 'none'
            })
          }
        }
      })
    },

    toggleFlash() {
      this.flashOn = !this.flashOn
      // 实际控制闪光灯的逻辑需要原生插件支持
      uni.showToast({
        title: this.flashOn ? '闪光灯已打开' : '闪光灯已关闭',
        icon: 'none'
      })
    },

    handleScanResult(result) {
      this.scanResult = result
      this.showResult = true

      // 保存到历史记录
      const historyItem = {
        type: result.type,
        content: result.content,
        data: result.data,
        time: this.formatTime(new Date())
      }
      this.scanHistory.unshift(historyItem)
      if (this.scanHistory.length > 20) {
        this.scanHistory.pop()
      }
      this.saveScanHistory()
    },

    copyResult() {
      let copyText = this.scanResult.content
      if (this.scanResult.data) {
        copyText = JSON.stringify(this.scanResult.data, null, 2)
      }

      uni.setClipboardData({
        data: copyText,
        success: () => {
          uni.showToast({
            title: '已复制到剪贴板',
            icon: 'success'
          })
        }
      })
    },

    confirmResult() {
      this.showResult = false

      // 如果有回调，返回结果给来源页面
      if (this.fromPage && this.callback) {
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        if (prevPage && typeof prevPage[this.callback] === 'function') {
          prevPage[this.callback](this.scanResult)
        }
      }

      // 返回上一页
      setTimeout(() => {
        uni.navigateBack()
      }, 300)
    },

    viewHistoryDetail(item) {
      this.scanResult = item
      this.showResult = true
    },

    loadScanHistory() {
      const history = uni.getStorageSync('scan_history')
      if (history) {
        this.scanHistory = JSON.parse(history)
      }
    },

    saveScanHistory() {
      uni.setStorageSync('scan_history', JSON.stringify(this.scanHistory))
    },

    clearHistory() {
      uni.showModal({
        title: '提示',
        content: '确定要清空扫描历史吗？',
        success: (res) => {
          if (res.confirm) {
            this.scanHistory = []
            this.saveScanHistory()
            uni.showToast({
              title: '已清空',
              icon: 'success'
            })
          }
        }
      })
    },

    getTypeIcon(type) {
      const icons = {
        qrcode: '📱',
        barcode: '📊',
        idcard: '🪪',
        license: '🚗'
      }
      return icons[type] || '📷'
    },

    getTypeName(type) {
      const names = {
        qrcode: '二维码',
        barcode: '条形码',
        idcard: '身份证',
        license: '驾驶证'
      }
      return names[type] || '未知'
    },

    formatTime(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
    }
  }
}
</script>

<style scoped>
.scan-container {
  min-height: 100vh;
  background-color: #000;
  display: flex;
  flex-direction: column;
}

/* 扫码区域 */
.scan-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
}

.scan-frame {
  position: relative;
  width: 500rpx;
  height: 500rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.corner {
  position: absolute;
  width: 60rpx;
  height: 60rpx;
  border-color: #667eea;
  border-style: solid;
}

.corner-tl {
  top: -2rpx;
  left: -2rpx;
  border-width: 4rpx 0 0 4rpx;
}

.corner-tr {
  top: -2rpx;
  right: -2rpx;
  border-width: 4rpx 4rpx 0 0;
}

.corner-bl {
  bottom: -2rpx;
  left: -2rpx;
  border-width: 0 0 4rpx 4rpx;
}

.corner-br {
  bottom: -2rpx;
  right: -2rpx;
  border-width: 0 4rpx 4rpx 0;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: linear-gradient(90deg, transparent, #667eea, transparent);
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0% {
    top: 0;
  }
  100% {
    top: 100%;
  }
}

.scan-tip {
  margin-top: 60rpx;
  font-size: 28rpx;
  color: #fff;
  text-align: center;
}

/* 类型切换 */
.type-switch {
  display: flex;
  gap: 20rpx;
  padding: 40rpx 20rpx;
  background: rgba(0, 0, 0, 0.5);
}

.type-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx 20rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  border: 2rpx solid transparent;
}

.type-item.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.2);
}

.type-icon {
  font-size: 48rpx;
}

.type-name {
  font-size: 24rpx;
  color: #fff;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 40rpx 20rpx;
  background: rgba(0, 0, 0, 0.5);
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
}

.action-button::after {
  border: none;
}

.action-button.secondary {
  background: rgba(255, 255, 255, 0.2);
}

.button-icon {
  font-size: 40rpx;
}

/* 扫描历史 */
.history-section {
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  padding: 40rpx 20rpx;
  max-height: 600rpx;
  overflow-y: auto;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.history-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.history-clear {
  font-size: 26rpx;
  color: #667eea;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
}

.history-icon {
  font-size: 48rpx;
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.history-content {
  font-size: 28rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-time {
  font-size: 24rpx;
  color: #999;
}

.history-arrow {
  font-size: 40rpx;
  color: #ccc;
}

.history-empty {
  padding: 80rpx 40rpx;
  text-align: center;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

/* 结果弹窗 */
.result-popup {
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.result-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.result-close {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: #999;
}

.result-content {
  flex: 1;
  padding: 40rpx 30rpx;
  overflow-y: auto;
}

.result-type,
.result-data {
  margin-bottom: 30rpx;
}

.type-label,
.data-label {
  font-size: 26rpx;
  color: #999;
}

.type-value,
.data-value {
  font-size: 28rpx;
  color: #333;
  margin-left: 12rpx;
}

.data-row {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.data-row:last-child {
  border-bottom: none;
}

.result-actions {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #f5f5f5;
}

.result-button {
  flex: 1;
  height: 80rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  border: none;
}

.result-button::after {
  border: none;
}

.result-button.copy {
  background: #f5f5f5;
  color: #666;
}

.result-button.confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}
</style>
