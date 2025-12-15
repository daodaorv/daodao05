<template>
  <view class="notifications-container">
    <!-- 通知总开关 -->
    <view class="notification-section">
      <view class="section-title">通知总开关</view>
      <view class="notification-group">
        <view class="notification-item">
          <view class="notification-left">
            <text class="notification-icon">🔔</text>
            <view class="notification-info">
              <text class="notification-label">推送通知</text>
              <text class="notification-desc">接收系统推送的通知消息</text>
            </view>
          </view>
          <view class="notification-right">
            <switch :checked="notifications.enabled" @change="handleNotificationToggle" color="#667eea" />
          </view>
        </view>
      </view>
    </view>

    <!-- 通知方式 -->
    <view class="notification-section" v-if="notifications.enabled">
      <view class="section-title">通知方式</view>
      <view class="notification-group">
        <view class="notification-item">
          <view class="notification-left">
            <text class="notification-icon">🔊</text>
            <view class="notification-info">
              <text class="notification-label">声音提醒</text>
              <text class="notification-desc">收到通知时播放提示音</text>
            </view>
          </view>
          <view class="notification-right">
            <switch :checked="notifications.sound" @change="handleSoundToggle" color="#667eea" />
          </view>
        </view>

        <view class="notification-item">
          <view class="notification-left">
            <text class="notification-icon">📳</text>
            <view class="notification-info">
              <text class="notification-label">振动提醒</text>
              <text class="notification-desc">收到通知时设备振动</text>
            </view>
          </view>
          <view class="notification-right">
            <switch :checked="notifications.vibrate" @change="handleVibrateToggle" color="#667eea" />
          </view>
        </view>

        <view class="notification-item">
          <view class="notification-left">
            <text class="notification-icon">🔴</text>
            <view class="notification-info">
              <text class="notification-label">角标提醒</text>
              <text class="notification-desc">在应用图标显示未读数量</text>
            </view>
          </view>
          <view class="notification-right">
            <switch :checked="notifications.badge" @change="handleBadgeToggle" color="#667eea" />
          </view>
        </view>
      </view>
    </view>

    <!-- 通知类型 -->
    <view class="notification-section" v-if="notifications.enabled">
      <view class="section-title">通知类型</view>
      <view class="notification-group">
        <view class="notification-item">
          <view class="notification-left">
            <text class="notification-icon">📋</text>
            <view class="notification-info">
              <text class="notification-label">订单通知</text>
              <text class="notification-desc">新订单、订单状态变更等</text>
            </view>
          </view>
          <view class="notification-right">
            <switch :checked="notifications.types.order" @change="(e) => handleTypeToggle('order', e)" color="#667eea" />
          </view>
        </view>

        <view class="notification-item">
          <view class="notification-left">
            <text class="notification-icon">🚗</text>
            <view class="notification-info">
              <text class="notification-label">车辆通知</text>
              <text class="notification-desc">车辆状态、维保提醒等</text>
            </view>
          </view>
          <view class="notification-right">
            <switch :checked="notifications.types.vehicle" @change="(e) => handleTypeToggle('vehicle', e)" color="#667eea" />
          </view>
        </view>

        <view class="notification-item">
          <view class="notification-left">
            <text class="notification-icon">💬</text>
            <view class="notification-info">
              <text class="notification-label">消息通知</text>
              <text class="notification-desc">工单回复、在线客服消息等</text>
            </view>
          </view>
          <view class="notification-right">
            <switch :checked="notifications.types.message" @change="(e) => handleTypeToggle('message', e)" color="#667eea" />
          </view>
        </view>

        <view class="notification-item">
          <view class="notification-left">
            <text class="notification-icon">⚠️</text>
            <view class="notification-info">
              <text class="notification-label">系统通知</text>
              <text class="notification-desc">系统公告、维护通知等</text>
            </view>
          </view>
          <view class="notification-right">
            <switch :checked="notifications.types.system" @change="(e) => handleTypeToggle('system', e)" color="#667eea" />
          </view>
        </view>

        <view class="notification-item">
          <view class="notification-left">
            <text class="notification-icon">🏠</text>
            <view class="notification-info">
              <text class="notification-label">托管通知</text>
              <text class="notification-desc">托管申请、审核结果等</text>
            </view>
          </view>
          <view class="notification-right">
            <switch :checked="notifications.types.hosting" @change="(e) => handleTypeToggle('hosting', e)" color="#667eea" />
          </view>
        </view>
      </view>
    </view>

    <!-- 免打扰时段 -->
    <view class="notification-section" v-if="notifications.enabled">
      <view class="section-title">免打扰时段</view>
      <view class="notification-group">
        <view class="notification-item">
          <view class="notification-left">
            <text class="notification-icon">🌙</text>
            <view class="notification-info">
              <text class="notification-label">免打扰模式</text>
              <text class="notification-desc">在指定时段内不接收通知</text>
            </view>
          </view>
          <view class="notification-right">
            <switch :checked="notifications.doNotDisturb.enabled" @change="handleDoNotDisturbToggle" color="#667eea" />
          </view>
        </view>

        <view class="notification-item" v-if="notifications.doNotDisturb.enabled" @click="selectStartTime">
          <view class="notification-left">
            <text class="notification-icon">🕐</text>
            <view class="notification-info">
              <text class="notification-label">开始时间</text>
            </view>
          </view>
          <view class="notification-right">
            <text class="notification-value">{{ notifications.doNotDisturb.startTime }}</text>
            <text class="notification-arrow">›</text>
          </view>
        </view>

        <view class="notification-item" v-if="notifications.doNotDisturb.enabled" @click="selectEndTime">
          <view class="notification-left">
            <text class="notification-icon">🕐</text>
            <view class="notification-info">
              <text class="notification-label">结束时间</text>
            </view>
          </view>
          <view class="notification-right">
            <text class="notification-value">{{ notifications.doNotDisturb.endTime }}</text>
            <text class="notification-arrow">›</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 测试通知 -->
    <view class="test-section" v-if="notifications.enabled">
      <button class="test-button" @click="sendTestNotification">发送测试通知</button>
    </view>

    <!-- 时间选择器 -->
    <u-datetime-picker
      :show="showTimePicker"
      v-model="selectedTime"
      mode="time"
      @confirm="handleTimeConfirm"
      @cancel="showTimePicker = false"
    ></u-datetime-picker>
  </view>
</template>

<script>
import { getStorage, setStorage } from '@/utils/storage'

export default {
  data() {
    return {
      notifications: {
        enabled: true,
        sound: true,
        vibrate: true,
        badge: true,
        types: {
          order: true,
          vehicle: true,
          message: true,
          system: true,
          hosting: true
        },
        doNotDisturb: {
          enabled: false,
          startTime: '22:00',
          endTime: '08:00'
        }
      },
      showTimePicker: false,
      selectedTime: new Date().getTime(),
      timePickerType: '' // 'start' or 'end'
    }
  },

  onLoad() {
    this.loadNotificationSettings()
  },

  methods: {
    loadNotificationSettings() {
      const savedSettings = getStorage('notification_settings')
      if (savedSettings) {
        this.notifications = { ...this.notifications, ...savedSettings }
      }
    },

    saveNotificationSettings() {
      setStorage('notification_settings', this.notifications)

      // 同步到系统设置
      const appSettings = getStorage('app_settings') || {}
      appSettings.notifications = this.notifications
      setStorage('app_settings', appSettings)
    },

    // 通知总开关
    handleNotificationToggle(e) {
      this.notifications.enabled = e.detail.value
      this.saveNotificationSettings()

      if (!e.detail.value) {
        uni.showModal({
          title: '提示',
          content: '关闭通知后将无法接收任何推送消息',
          showCancel: false
        })
      } else {
        // 请求通知权限
        this.requestNotificationPermission()
      }
    },

    // 请求通知权限
    requestNotificationPermission() {
      // #ifdef APP-PLUS
      const main = plus.android.runtimeMainActivity()
      const pkName = main.getPackageName()
      const uid = main.getApplicationInfo().plusGetAttribute('uid')
      const NotificationManagerCompat = plus.android.importClass('android.support.v4.app.NotificationManagerCompat')
      if (NotificationManagerCompat) {
        const areNotificationsEnabled = NotificationManagerCompat.from(main).areNotificationsEnabled()
        if (!areNotificationsEnabled) {
          uni.showModal({
            title: '通知权限未开启',
            content: '请在系统设置中开启通知权限',
            confirmText: '去设置',
            success: (res) => {
              if (res.confirm) {
                const Intent = plus.android.importClass('android.content.Intent')
                const intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS')
                intent.putExtra('android.provider.extra.APP_PACKAGE', pkName)
                main.startActivity(intent)
              }
            }
          })
        }
      }
      // #endif
    },

    // 声音开关
    handleSoundToggle(e) {
      this.notifications.sound = e.detail.value
      this.saveNotificationSettings()
    },

    // 振动开关
    handleVibrateToggle(e) {
      this.notifications.vibrate = e.detail.value
      this.saveNotificationSettings()
    },

    // 角标开关
    handleBadgeToggle(e) {
      this.notifications.badge = e.detail.value
      this.saveNotificationSettings()
    },

    // 通知类型开关
    handleTypeToggle(type, e) {
      this.notifications.types[type] = e.detail.value
      this.saveNotificationSettings()
    },

    // 免打扰模式开关
    handleDoNotDisturbToggle(e) {
      this.notifications.doNotDisturb.enabled = e.detail.value
      this.saveNotificationSettings()

      if (e.detail.value) {
        uni.showToast({
          title: '已开启免打扰模式',
          icon: 'success'
        })
      }
    },

    // 选择开始时间
    selectStartTime() {
      this.timePickerType = 'start'
      const [hour, minute] = this.notifications.doNotDisturb.startTime.split(':')
      const now = new Date()
      now.setHours(parseInt(hour))
      now.setMinutes(parseInt(minute))
      this.selectedTime = now.getTime()
      this.showTimePicker = true
    },

    // 选择结束时间
    selectEndTime() {
      this.timePickerType = 'end'
      const [hour, minute] = this.notifications.doNotDisturb.endTime.split(':')
      const now = new Date()
      now.setHours(parseInt(hour))
      now.setMinutes(parseInt(minute))
      this.selectedTime = now.getTime()
      this.showTimePicker = true
    },

    // 确认时间选择
    handleTimeConfirm(e) {
      const date = new Date(e.value)
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      const timeString = `${hour}:${minute}`

      if (this.timePickerType === 'start') {
        this.notifications.doNotDisturb.startTime = timeString
      } else {
        this.notifications.doNotDisturb.endTime = timeString
      }

      this.saveNotificationSettings()
      this.showTimePicker = false
    },

    // 发送测试通知
    sendTestNotification() {
      uni.showLoading({
        title: '发送中...'
      })

      setTimeout(() => {
        uni.hideLoading()

        // 显示本地通知
        // #ifdef APP-PLUS
        const options = {
          cover: false,
          title: '测试通知',
          content: '这是一条测试通知消息',
          payload: { type: 'test' }
        }

        if (this.notifications.sound) {
          options.sound = 'system'
        }

        plus.push.createMessage(
          options.content,
          JSON.stringify(options.payload),
          options
        )
        // #endif

        uni.showToast({
          title: '测试通知已发送',
          icon: 'success'
        })
      }, 1000)
    }
  }
}
</script>

<style scoped>
.notifications-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

/* 通知区块 */
.notification-section {
  margin-bottom: 20rpx;
}

.section-title {
  padding: 30rpx 30rpx 20rpx;
  font-size: 26rpx;
  color: #999;
}

.notification-group {
  background: #fff;
  border-radius: 12rpx;
  margin: 0 20rpx;
  overflow: hidden;
}

/* 通知项 */
.notification-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 30rpx;
  border-bottom: 1px solid #f5f5f5;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.notification-icon {
  font-size: 40rpx;
  margin-right: 24rpx;
}

.notification-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.notification-label {
  font-size: 30rpx;
  color: #333;
}

.notification-desc {
  font-size: 24rpx;
  color: #999;
}

.notification-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.notification-value {
  font-size: 26rpx;
  color: #999;
}

.notification-arrow {
  font-size: 40rpx;
  color: #ccc;
}

/* 测试按钮 */
.test-section {
  padding: 40rpx 20rpx;
}

.test-button {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.test-button::after {
  border: none;
}
</style>
