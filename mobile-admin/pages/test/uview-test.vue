<template>
  <view class="test-container">
    <view class="page-title">uView Plus 组件测试</view>

    <!-- 基础组件测试 -->
    <view class="section">
      <view class="section-title">1. 基础组件</view>

      <!-- 按钮 -->
      <view class="test-item">
        <text class="item-label">u-button 按钮：</text>
        <view class="button-group">
          <u-button type="primary" text="主要按钮" @click="handleClick('primary')"></u-button>
          <u-button type="success" text="成功按钮" @click="handleClick('success')"></u-button>
          <u-button type="warning" text="警告按钮" @click="handleClick('warning')"></u-button>
          <u-button type="error" text="错误按钮" @click="handleClick('error')"></u-button>
        </view>
      </view>

      <!-- 图标 -->
      <view class="test-item">
        <text class="item-label">u-icon 图标：</text>
        <view class="icon-group">
          <u-icon name="home" size="40" color="#2979ff"></u-icon>
          <u-icon name="star" size="40" color="#ff9800"></u-icon>
          <u-icon name="heart" size="40" color="#f44336"></u-icon>
          <u-icon name="setting" size="40" color="#4caf50"></u-icon>
          <u-icon name="search" size="40" color="#9c27b0"></u-icon>
        </view>
      </view>

      <!-- 标签 -->
      <view class="test-item">
        <text class="item-label">u-tag 标签：</text>
        <view class="tag-group">
          <u-tag text="默认标签" type="primary"></u-tag>
          <u-tag text="成功标签" type="success"></u-tag>
          <u-tag text="警告标签" type="warning"></u-tag>
          <u-tag text="错误标签" type="error"></u-tag>
          <u-tag text="信息标签" type="info"></u-tag>
        </view>
      </view>
    </view>

    <!-- 表单组件测试 -->
    <view class="section">
      <view class="section-title">2. 表单组件</view>

      <!-- 输入框 -->
      <view class="test-item">
        <text class="item-label">u-input 输入框：</text>
        <u-input v-model="formData.name" placeholder="请输入姓名"></u-input>
      </view>

      <!-- 开关 -->
      <view class="test-item">
        <text class="item-label">u-switch 开关：</text>
        <u-switch v-model="formData.switch" @change="handleSwitchChange"></u-switch>
        <text class="switch-status">{{ formData.switch ? '开启' : '关闭' }}</text>
      </view>

      <!-- 单选框 -->
      <view class="test-item">
        <text class="item-label">u-radio 单选框：</text>
        <u-radio-group v-model="formData.radio" @change="handleRadioChange">
          <u-radio :name="1" label="选项1"></u-radio>
          <u-radio :name="2" label="选项2"></u-radio>
          <u-radio :name="3" label="选项3"></u-radio>
        </u-radio-group>
      </view>

      <!-- 复选框 -->
      <view class="test-item">
        <text class="item-label">u-checkbox 复选框：</text>
        <u-checkbox-group v-model="formData.checkbox" @change="handleCheckboxChange">
          <u-checkbox name="apple" label="苹果"></u-checkbox>
          <u-checkbox name="banana" label="香蕉"></u-checkbox>
          <u-checkbox name="orange" label="橙子"></u-checkbox>
        </u-checkbox-group>
      </view>
    </view>

    <!-- 反馈组件测试 -->
    <view class="section">
      <view class="section-title">3. 反馈组件</view>

      <!-- Toast -->
      <view class="test-item">
        <text class="item-label">u-toast 提示：</text>
        <view class="button-group">
          <u-button text="成功提示" size="small" @click="showToast('success')"></u-button>
          <u-button text="错误提示" size="small" @click="showToast('error')"></u-button>
          <u-button text="警告提示" size="small" @click="showToast('warning')"></u-button>
        </view>
      </view>

      <!-- Modal -->
      <view class="test-item">
        <text class="item-label">u-modal 模态框：</text>
        <u-button text="打开模态框" @click="showModal"></u-button>
      </view>

      <!-- Popup -->
      <view class="test-item">
        <text class="item-label">u-popup 弹出层：</text>
        <view class="button-group">
          <u-button text="底部弹出" size="small" @click="showPopup('bottom')"></u-button>
          <u-button text="顶部弹出" size="small" @click="showPopup('top')"></u-button>
          <u-button text="左侧弹出" size="small" @click="showPopup('left')"></u-button>
          <u-button text="右侧弹出" size="small" @click="showPopup('right')"></u-button>
        </view>
      </view>
    </view>

    <!-- 数据展示组件测试 -->
    <view class="section">
      <view class="section-title">4. 数据展示</view>

      <!-- 进度条 -->
      <view class="test-item">
        <text class="item-label">u-line-progress 进度条：</text>
        <u-line-progress :percentage="progressValue" :show-percent="true"></u-line-progress>
        <view class="button-group" style="margin-top: 20rpx;">
          <u-button text="增加" size="small" @click="changeProgress(10)"></u-button>
          <u-button text="减少" size="small" @click="changeProgress(-10)"></u-button>
        </view>
      </view>

      <!-- 徽标 -->
      <view class="test-item">
        <text class="item-label">u-badge 徽标：</text>
        <view class="badge-group">
          <u-badge :value="5">
            <u-button text="消息" size="small"></u-button>
          </u-badge>
          <u-badge :value="99" :max="99">
            <u-button text="通知" size="small"></u-button>
          </u-badge>
          <u-badge dot>
            <u-button text="提醒" size="small"></u-button>
          </u-badge>
        </view>
      </view>
    </view>

    <!-- 测试结果 -->
    <view class="section">
      <view class="section-title">5. 测试结果</view>
      <view class="test-result">
        <text class="result-text">✅ 如果以上组件都能正常显示和交互，说明 uView Plus 安装成功！</text>
        <text class="result-text">✅ 图标应该显示为图形，而不是文本</text>
        <text class="result-text">✅ 所有按钮和交互都应该正常工作</text>
      </view>
    </view>

    <!-- uView Plus 组件 -->
    <u-toast ref="uToast"></u-toast>
    <u-modal :show="modalShow" title="提示" content="这是一个模态框" @confirm="modalShow = false" @cancel="modalShow = false"></u-modal>
    <u-popup :show="popupShow" :mode="popupMode" @close="popupShow = false">
      <view class="popup-content">
        <text>这是一个 {{ popupMode }} 弹出层</text>
        <u-button text="关闭" @click="popupShow = false" style="margin-top: 40rpx;"></u-button>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        switch: false,
        radio: 1,
        checkbox: []
      },
      progressValue: 50,
      modalShow: false,
      popupShow: false,
      popupMode: 'bottom'
    }
  },
  methods: {
    handleClick(type) {
      uni.showToast({
        title: `点击了${type}按钮`,
        icon: 'none'
      })
    },
    handleSwitchChange(value) {
      console.log('开关状态:', value)
    },
    handleRadioChange(value) {
      console.log('单选框选中:', value)
    },
    handleCheckboxChange(value) {
      console.log('复选框选中:', value)
    },
    showToast(type) {
      this.$refs.uToast.show({
        type: type,
        message: `这是一个${type}提示`
      })
    },
    showModal() {
      this.modalShow = true
    },
    showPopup(mode) {
      this.popupMode = mode
      this.popupShow = true
    },
    changeProgress(delta) {
      this.progressValue = Math.max(0, Math.min(100, this.progressValue + delta))
    }
  }
}
</script>

<style scoped>
.test-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 40rpx 30rpx;
}

.page-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 40rpx;
}

.section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #eee;
}

.test-item {
  margin-bottom: 40rpx;
}

.test-item:last-child {
  margin-bottom: 0;
}

.item-label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.icon-group {
  display: flex;
  gap: 30rpx;
  align-items: center;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.switch-status {
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #666;
}

.badge-group {
  display: flex;
  gap: 40rpx;
  align-items: center;
}

.popup-content {
  padding: 60rpx 40rpx;
  text-align: center;
  font-size: 32rpx;
  color: #333;
}

.test-result {
  padding: 30rpx;
  background: #e8f5e9;
  border-radius: 12rpx;
}

.result-text {
  display: block;
  font-size: 28rpx;
  color: #2e7d32;
  line-height: 1.8;
  margin-bottom: 10rpx;
}

.result-text:last-child {
  margin-bottom: 0;
}
</style>
