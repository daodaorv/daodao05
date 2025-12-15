<template>
  <view class="verification-container">
    <!-- 加载状态 -->
    <LoadingSpinner v-if="loading" fullscreen text="加载中..." />

    <!-- 核验表单 -->
    <view v-else class="verification-form">
      <!-- 订单信息 -->
      <u-cell-group>
        <u-cell title="订单号" :value="order.orderNo" />
        <u-cell title="客户姓名" :value="order.customerName" />
        <u-cell title="车辆信息" :value="`${order.vehicleName} ${order.vehiclePlate}`" />
        <u-cell title="核验类型" :value="verificationType === 'pickup' ? '取车核验' : '还车核验'" />
      </u-cell-group>

      <!-- 车辆外观检查 -->
      <view class="form-section">
        <view class="section-title">车辆外观检查</view>
        <u-checkbox-group v-model="appearanceCheckList" @change="handleAppearanceChange">
          <u-checkbox
            v-for="item in appearanceChecks"
            :key="item.key"
            :name="item.key"
            :label="item.label"
            shape="square"
            activeColor="#3cc51f"
            class="checkbox-item"
          />
        </u-checkbox-group>
      </view>

      <!-- 车辆内饰检查 -->
      <view class="form-section">
        <view class="section-title">车辆内饰检查</view>
        <u-checkbox-group v-model="interiorCheckList" @change="handleInteriorChange">
          <u-checkbox
            v-for="item in interiorChecks"
            :key="item.key"
            :name="item.key"
            :label="item.label"
            shape="square"
            activeColor="#3cc51f"
            class="checkbox-item"
          />
        </u-checkbox-group>
      </view>

      <!-- 车辆功能检查 -->
      <view class="form-section">
        <view class="section-title">车辆功能检查</view>
        <u-checkbox-group v-model="functionCheckList" @change="handleFunctionChange">
          <u-checkbox
            v-for="item in functionChecks"
            :key="item.key"
            :name="item.key"
            :label="item.label"
            shape="square"
            activeColor="#3cc51f"
            class="checkbox-item"
          />
        </u-checkbox-group>
      </view>

      <!-- 油量/电量 -->
      <view class="form-section">
        <view class="section-title">油量/电量</view>
        <u-radio-group v-model="formData.fuelLevel" placement="row">
          <u-radio
            v-for="level in fuelLevels"
            :key="level.value"
            :name="level.value"
            :label="level.label"
            activeColor="#1890ff"
            class="fuel-radio"
          />
        </u-radio-group>
      </view>

      <!-- 里程数 -->
      <view class="form-section">
        <view class="section-title">当前里程数（km）</view>
        <u-input
          v-model="formData.mileage"
          type="number"
          placeholder="请输入当前里程数"
          border="surround"
        />
      </view>

      <!-- 车辆照片 -->
      <view class="form-section">
        <view class="section-title">车辆照片</view>
        <view class="photo-tip">请拍摄车辆前、后、左、右四个角度的照片</view>
        <u-upload
          :fileList="formData.photos"
          @afterRead="afterRead"
          @delete="deletePhoto"
          :maxCount="8"
          :previewFullImage="true"
          width="160"
          height="160"
        >
          <view class="upload-slot">
            <u-icon name="camera-fill" size="40" color="#999"></u-icon>
            <text class="upload-text">拍摄照片</text>
          </view>
        </u-upload>
        <view class="upload-tip">建议拍摄：车头、车尾、左侧、右侧、仪表盘、内饰</view>
      </view>

      <!-- 问题描述 -->
      <view class="form-section">
        <view class="section-title">问题描述（选填）</view>
        <u--textarea
          v-model="formData.issues"
          placeholder="如有车辆损伤、故障或其他问题，请详细描述"
          :maxlength="500"
          count
        />
      </view>

      <!-- 客户签名 -->
      <view class="form-section">
        <view class="section-title">客户签名</view>
        <view class="signature-box" @click="showSignature">
          <image v-if="formData.signature" :src="formData.signature" class="signature-image" mode="aspectFit" />
          <view v-else class="signature-placeholder">
            <u-icon name="edit-pen-fill" size="60" color="#999"></u-icon>
            <text class="placeholder-text">点击签名</text>
          </view>
        </view>
      </view>

      <!-- 核验人员 -->
      <view class="form-section">
        <view class="section-title">核验人员</view>
        <u-input
          v-model="formData.verifier"
          placeholder="请输入核验人员姓名"
          border="surround"
        />
      </view>

      <!-- 底部操作按钮 -->
      <view class="bottom-actions">
        <u-button
          text="取消"
          type="info"
          plain
          @click="handleCancel"
        />
        <u-button
          text="提交核验"
          type="primary"
          @click="handleSubmit"
        />
      </view>
    </view>

    <!-- 签名弹窗 -->
    <u-popup
      :show="signatureVisible"
      mode="bottom"
      :round="20"
      @close="closeSignature"
    >
      <view class="signature-popup">
        <view class="popup-header">
          <text class="popup-title">客户签名</text>
          <u-button
            text="清除"
            type="error"
            size="mini"
            plain
            @click="clearSignature"
          />
        </view>
        <canvas
          canvas-id="signatureCanvas"
          class="signature-canvas"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        ></canvas>
        <view class="popup-actions">
          <u-button
            text="取消"
            type="info"
            plain
            @click="closeSignature"
          />
          <u-button
            text="确认"
            type="primary"
            @click="confirmSignature"
          />
        </view>
      </view>
    </u-popup>

    <!-- 确认对话框 -->
    <u-modal
      :show="dialogVisible"
      :title="dialogTitle"
      :content="dialogMessage"
      :showCancelButton="true"
      @confirm="handleDialogConfirm"
      @cancel="dialogVisible = false"
    />
  </view>
</template>

<script>
import { getOrderDetail } from '@/api/order'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  components: {
    LoadingSpinner
  },

  data() {
    return {
      orderId: null,
      verificationType: 'pickup', // pickup: 取车核验, return: 还车核验
      order: {},
      loading: false,
      dialogVisible: false,
      dialogTitle: '',
      dialogMessage: '',
      signatureVisible: false,

      // 表单数据
      formData: {
        appearance: {
          front: false,
          rear: false,
          left: false,
          right: false,
          roof: false,
          wheels: false
        },
        interior: {
          seats: false,
          dashboard: false,
          carpet: false,
          windows: false,
          doors: false
        },
        function: {
          engine: false,
          lights: false,
          aircon: false,
          audio: false,
          navigation: false
        },
        fuelLevel: 100,
        mileage: '',
        photos: [],
        issues: '',
        signature: '',
        verifier: ''
      },

      // checkbox 选中列表
      appearanceCheckList: [],
      interiorCheckList: [],
      functionCheckList: [],

      // 检查项配置
      appearanceChecks: [
        { key: 'front', label: '车头外观完好' },
        { key: 'rear', label: '车尾外观完好' },
        { key: 'left', label: '左侧外观完好' },
        { key: 'right', label: '右侧外观完好' },
        { key: 'roof', label: '车顶外观完好' },
        { key: 'wheels', label: '轮胎状况良好' }
      ],
      interiorChecks: [
        { key: 'seats', label: '座椅清洁完好' },
        { key: 'dashboard', label: '仪表台完好' },
        { key: 'carpet', label: '地毯清洁' },
        { key: 'windows', label: '车窗完好' },
        { key: 'doors', label: '车门功能正常' }
      ],
      functionChecks: [
        { key: 'engine', label: '发动机正常' },
        { key: 'lights', label: '灯光系统正常' },
        { key: 'aircon', label: '空调系统正常' },
        { key: 'audio', label: '音响系统正常' },
        { key: 'navigation', label: '导航系统正常' }
      ],
      fuelLevels: [
        { value: 100, label: '满' },
        { value: 75, label: '3/4' },
        { value: 50, label: '1/2' },
        { value: 25, label: '1/4' },
        { value: 0, label: '空' }
      ],

      // 签名相关
      canvasContext: null,
      isDrawing: false,
      lastPoint: null
    }
  },

  onLoad(options) {
    if (options.id) {
      this.orderId = options.id
      this.verificationType = options.type || 'pickup'
      this.loadOrderDetail()
    }

    // 初始化签名画布
    this.$nextTick(() => {
      this.initCanvas()
    })
  },

  methods: {
    async loadOrderDetail() {
      this.loading = true
      try {
        const data = await getOrderDetail(this.orderId)
        this.order = data

        // 如果是还车核验，预填取车时的里程数
        if (this.verificationType === 'return' && data.pickupMileage) {
          this.formData.mileage = String(data.pickupMileage)
        }
      } catch (error) {
        console.error('加载订单详情失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    // 处理外观检查变化
    handleAppearanceChange(values) {
      this.appearanceChecks.forEach(item => {
        this.formData.appearance[item.key] = values.includes(item.key)
      })
    },

    // 处理内饰检查变化
    handleInteriorChange(values) {
      this.interiorChecks.forEach(item => {
        this.formData.interior[item.key] = values.includes(item.key)
      })
    },

    // 处理功能检查变化
    handleFunctionChange(values) {
      this.functionChecks.forEach(item => {
        this.formData.function[item.key] = values.includes(item.key)
      })
    },

    // 图片上传后
    afterRead(event) {
      const { file } = event
      // 单个文件
      if (!Array.isArray(file)) {
        this.formData.photos.push({
          url: file.url,
          status: 'success',
          message: ''
        })
      } else {
        // 多个文件
        file.forEach(item => {
          this.formData.photos.push({
            url: item.url,
            status: 'success',
            message: ''
          })
        })
      }
    },

    // 删除图片
    deletePhoto(event) {
      this.formData.photos.splice(event.index, 1)
    },

    // 初始化签名画布
    initCanvas() {
      this.canvasContext = uni.createCanvasContext('signatureCanvas', this)
      this.canvasContext.setStrokeStyle('#000000')
      this.canvasContext.setLineWidth(3)
      this.canvasContext.setLineCap('round')
      this.canvasContext.setLineJoin('round')
    },

    showSignature() {
      this.signatureVisible = true
    },

    closeSignature() {
      this.signatureVisible = false
    },

    clearSignature() {
      if (this.canvasContext) {
        this.canvasContext.clearRect(0, 0, 750, 400)
        this.canvasContext.draw()
      }
      this.formData.signature = ''
    },

    confirmSignature() {
      // 将画布内容转为图片
      uni.canvasToTempFilePath({
        canvasId: 'signatureCanvas',
        success: (res) => {
          this.formData.signature = res.tempFilePath
          this.closeSignature()
          uni.showToast({
            title: '签名成功',
            icon: 'success'
          })
        },
        fail: (err) => {
          console.error('保存签名失败:', err)
          uni.showToast({
            title: '保存签名失败',
            icon: 'none'
          })
        }
      }, this)
    },

    handleTouchStart(e) {
      this.isDrawing = true
      const touch = e.touches[0]
      this.lastPoint = { x: touch.x, y: touch.y }
    },

    handleTouchMove(e) {
      if (!this.isDrawing) return

      const touch = e.touches[0]
      const currentPoint = { x: touch.x, y: touch.y }

      this.canvasContext.moveTo(this.lastPoint.x, this.lastPoint.y)
      this.canvasContext.lineTo(currentPoint.x, currentPoint.y)
      this.canvasContext.stroke()
      this.canvasContext.draw(true)

      this.lastPoint = currentPoint
    },

    handleTouchEnd() {
      this.isDrawing = false
    },

    handleCancel() {
      this.dialogTitle = '取消核验'
      this.dialogMessage = '确定要取消核验吗？已填写的内容将不会保存。'
      this.dialogVisible = true
    },

    handleSubmit() {
      // 验证必填项
      if (!this.validateForm()) {
        return
      }

      this.dialogTitle = '提交核验'
      this.dialogMessage = '确认提交核验记录吗？提交后将无法修改。'
      this.dialogVisible = true
    },

    validateForm() {
      // 检查照片
      if (this.formData.photos.length === 0) {
        uni.showToast({
          title: '请至少上传一张车辆照片',
          icon: 'none'
        })
        return false
      }

      // 检查里程数
      if (!this.formData.mileage || Number(this.formData.mileage) <= 0) {
        uni.showToast({
          title: '请输入当前里程数',
          icon: 'none'
        })
        return false
      }

      // 检查签名
      if (!this.formData.signature) {
        uni.showToast({
          title: '请客户签名确认',
          icon: 'none'
        })
        return false
      }

      // 检查核验人员
      if (!this.formData.verifier) {
        uni.showToast({
          title: '请输入核验人员姓名',
          icon: 'none'
        })
        return false
      }

      return true
    },

    async handleDialogConfirm() {
      if (this.dialogTitle === '取消核验') {
        uni.navigateBack()
      } else if (this.dialogTitle === '提交核验') {
        await this.submitVerification()
      }
      this.dialogVisible = false
    },

    async submitVerification() {
      try {
        uni.showLoading({
          title: '提交中...'
        })

        // TODO: 调用API提交核验数据
        // await submitVerification(this.orderId, this.verificationType, this.formData)

        // Mock延迟
        await new Promise(resolve => setTimeout(resolve, 1500))

        uni.hideLoading()

        uni.showToast({
          title: '核验提交成功',
          icon: 'success'
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (error) {
        uni.hideLoading()
        console.error('提交核验失败:', error)
        uni.showToast({
          title: '提交失败，请重试',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style scoped>
.verification-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.verification-form {
  padding: 20rpx;
}

/* 表单区块 */
.form-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
}

/* checkbox 样式 */
.checkbox-item {
  margin-bottom: 20rpx;
}

/* 油量选择器 */
.fuel-radio {
  margin-right: 20rpx;
  margin-bottom: 20rpx;
}

/* 照片上传 */
.photo-tip {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
  line-height: 1.6;
}

.upload-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  height: 160rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  border: 2rpx dashed #ddd;
}

.upload-text {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.upload-tip {
  font-size: 22rpx;
  color: #999;
  margin-top: 12rpx;
  line-height: 1.6;
}

/* 签名框 */
.signature-box {
  width: 100%;
  height: 300rpx;
  border: 2rpx dashed #ddd;
  border-radius: 8rpx;
  overflow: hidden;
  background: #fafafa;
}

.signature-image {
  width: 100%;
  height: 100%;
}

.signature-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.placeholder-text {
  font-size: 28rpx;
  color: #999;
}

/* 签名弹窗 */
.signature-popup {
  background: #fff;
  padding: 40rpx;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.signature-canvas {
  width: 670rpx;
  height: 400rpx;
  background: #fafafa;
  border: 2rpx solid #ddd;
  border-radius: 8rpx;
}

.popup-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}

/* 底部操作 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background: #fff;
  border-top: 1px solid #eee;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}
</style>
