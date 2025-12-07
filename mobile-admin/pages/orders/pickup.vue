<template>
  <view class="pickup-container">
    <!-- 顶部进度条 -->
    <view class="progress-bar">
      <u-steps
        :current="currentStep - 1"
        :list="stepList"
        activeColor="#1890ff"
        inactiveColor="#e0e0e0"
      ></u-steps>
    </view>

    <!-- 步骤1: 订单确认 -->
    <view v-if="currentStep === 1" class="step-content">
      <view class="section-title">订单信息确认</view>
      <u-cell-group>
        <u-cell title="订单号" :value="orderInfo.orderNo" />
        <u-cell title="客户姓名" :value="orderInfo.customerName" />
        <u-cell title="联系电话" :value="orderInfo.customerPhone" />
        <u-cell title="车辆信息" :value="`${orderInfo.vehicleName} (${orderInfo.vehiclePlate})`" />
        <u-cell title="租期" :value="`${orderInfo.startDate} 至 ${orderInfo.endDate}`" />
        <u-cell title="押金状态">
          <template #value>
            <u-tag
              :text="depositPaid ? '已支付' : '未支付'"
              :type="depositPaid ? 'success' : 'warning'"
              size="mini"
            />
          </template>
        </u-cell>
      </u-cell-group>

      <view class="section-title">证件验证</view>
      <view class="document-upload">
        <view class="upload-item">
          <view class="upload-label">身份证</view>
          <u-upload
            :fileList="idCardList"
            @afterRead="(e) => afterReadDocument(e, 'idCard')"
            @delete="() => deleteDocument('idCard')"
            :maxCount="1"
            :previewFullImage="true"
            width="320"
            height="200"
          >
            <view class="upload-slot">
              <u-icon name="camera-fill" size="40" color="#999"></u-icon>
              <text class="upload-text">拍照上传</text>
            </view>
          </u-upload>
        </view>
        <view class="upload-item">
          <view class="upload-label">驾驶证</view>
          <u-upload
            :fileList="driverLicenseList"
            @afterRead="(e) => afterReadDocument(e, 'driverLicense')"
            @delete="() => deleteDocument('driverLicense')"
            :maxCount="1"
            :previewFullImage="true"
            width="320"
            height="200"
          >
            <view class="upload-slot">
              <u-icon name="camera-fill" size="40" color="#999"></u-icon>
              <text class="upload-text">拍照上传</text>
            </view>
          </u-upload>
        </view>
      </view>

      <view class="action-buttons">
        <u-button
          text="下一步"
          type="primary"
          @click="nextStep"
          :disabled="!canProceedStep1"
        ></u-button>
      </view>
    </view>

    <!-- 步骤2: 车辆检查 -->
    <view v-if="currentStep === 2" class="step-content">
      <view class="section-title">车辆检查清单</view>

      <view class="checklist-section">
        <view class="checklist-header">外观检查</view>
        <u-checkbox-group v-model="exteriorCheckList" @change="handleExteriorChange">
          <u-checkbox
            v-for="item in checklist.exterior"
            :key="item.id"
            :name="item.id"
            :label="item.name"
            shape="square"
            activeColor="#1890ff"
            class="checkbox-item"
          />
        </u-checkbox-group>
      </view>

      <view class="checklist-section">
        <view class="checklist-header">内饰检查</view>
        <u-checkbox-group v-model="interiorCheckList" @change="handleInteriorChange">
          <u-checkbox
            v-for="item in checklist.interior"
            :key="item.id"
            :name="item.id"
            :label="item.name"
            shape="square"
            activeColor="#1890ff"
            class="checkbox-item"
          />
        </u-checkbox-group>
      </view>

      <view class="checklist-section">
        <view class="checklist-header">功能检查</view>
        <u-checkbox-group v-model="functionsCheckList" @change="handleFunctionsChange">
          <u-checkbox
            v-for="item in checklist.functions"
            :key="item.id"
            :name="item.id"
            :label="item.name"
            shape="square"
            activeColor="#1890ff"
            class="checkbox-item"
          />
        </u-checkbox-group>
      </view>

      <view class="meter-input-section">
        <view class="input-row">
          <text class="input-label">当前里程（公里）</text>
          <u-input
            v-model="vehicleData.mileage"
            type="number"
            placeholder="请输入当前里程"
            border="surround"
          />
        </view>
        <view class="input-row">
          <text class="input-label">当前油量（格）</text>
          <u-input
            v-model="vehicleData.fuelLevel"
            type="number"
            placeholder="请输入当前油量"
            border="surround"
          />
        </view>
      </view>

      <view class="action-buttons">
        <u-button
          text="上一步"
          type="info"
          plain
          @click="prevStep"
        ></u-button>
        <u-button
          text="下一步"
          type="primary"
          @click="nextStep"
          :disabled="!canProceedStep2"
        ></u-button>
      </view>
    </view>

    <!-- 步骤3: 拍照存证 -->
    <view v-if="currentStep === 3" class="step-content">
      <view class="section-title">车辆拍照存证</view>

      <view class="photo-section">
        <view class="photo-category-title">外观照片（必拍）</view>
        <view class="photo-grid">
          <view v-for="position in photoPositions.exterior" :key="position.key" class="photo-item">
            <view class="photo-label">{{ position.label }}</view>
            <u-upload
              :fileList="getPhotoList('exterior', position.key)"
              @afterRead="(e) => afterReadPhoto(e, 'exterior', position.key)"
              @delete="() => deletePhoto('exterior', position.key)"
              :maxCount="1"
              :previewFullImage="true"
              width="280"
              height="280"
            >
              <view class="upload-slot">
                <u-icon name="camera-fill" size="40" color="#999"></u-icon>
                <text class="upload-text">拍照</text>
              </view>
            </u-upload>
          </view>
        </view>
      </view>

      <view class="photo-section">
        <view class="photo-category-title">内饰照片（必拍）</view>
        <view class="photo-grid">
          <view v-for="position in photoPositions.interior" :key="position.key" class="photo-item">
            <view class="photo-label">{{ position.label }}</view>
            <u-upload
              :fileList="getPhotoList('interior', position.key)"
              @afterRead="(e) => afterReadPhoto(e, 'interior', position.key)"
              @delete="() => deletePhoto('interior', position.key)"
              :maxCount="1"
              :previewFullImage="true"
              width="280"
              height="280"
            >
              <view class="upload-slot">
                <u-icon name="camera-fill" size="40" color="#999"></u-icon>
                <text class="upload-text">拍照</text>
              </view>
            </u-upload>
          </view>
        </view>
      </view>

      <view class="action-buttons">
        <u-button
          text="上一步"
          type="info"
          plain
          @click="prevStep"
        ></u-button>
        <u-button
          text="下一步"
          type="primary"
          @click="nextStep"
          :disabled="!canProceedStep3"
        ></u-button>
      </view>
    </view>

    <!-- 步骤4: 完成取车 -->
    <view v-if="currentStep === 4" class="step-content">
      <view class="section-title">确认信息</view>

      <u-cell-group>
        <u-cell title="检查项完成" :value="`${completedCheckItems}/${totalCheckItems}`" />
        <u-cell title="照片已拍摄" :value="`${completedPhotos}/${totalPhotos}`" />
        <u-cell title="当前里程" :value="`${vehicleData.mileage} 公里`" />
        <u-cell title="当前油量" :value="`${vehicleData.fuelLevel} 格`" />
      </u-cell-group>

      <view class="section-title">客户签名确认</view>
      <view class="signature-section">
        <canvas canvas-id="signatureCanvas" class="signature-canvas" @touchstart="signatureStart" @touchmove="signatureMove" @touchend="signatureEnd"></canvas>
        <u-button
          text="清除签名"
          type="info"
          plain
          @click="clearSignature"
          class="btn-clear-signature"
        ></u-button>
      </view>

      <view class="agreement-section">
        <u-checkbox-group v-model="agreementGroup">
          <u-checkbox
            name="agreed"
            shape="square"
            activeColor="#1890ff"
          >
            我已确认车辆状况，同意租赁协议条款
          </u-checkbox>
        </u-checkbox-group>
      </view>

      <view class="action-buttons">
        <u-button
          text="上一步"
          type="info"
          plain
          @click="prevStep"
        ></u-button>
        <u-button
          text="完成取车"
          type="primary"
          @click="completePickup"
          :disabled="!canComplete"
          :loading="submitting"
        ></u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { startPickup, submitPickupInspection, uploadPickupPhotos, completePickup } from '@/api/order'

export default {
  data() {
    return {
      orderId: '',
      currentStep: 1,
      stepList: [
        { name: '订单确认' },
        { name: '车辆检查' },
        { name: '拍照存证' },
        { name: '完成取车' }
      ],
      orderInfo: {},
      depositPaid: true,
      documents: {
        idCard: '',
        driverLicense: ''
      },
      idCardList: [],
      driverLicenseList: [],
      checklist: {
        exterior: [],
        interior: [],
        functions: []
      },
      exteriorCheckList: [],
      interiorCheckList: [],
      functionsCheckList: [],
      vehicleData: {
        mileage: '',
        fuelLevel: ''
      },
      photoPositions: {
        exterior: [
          { key: 'front', label: '车辆前部' },
          { key: 'back', label: '车辆后部' },
          { key: 'left', label: '车辆左侧' },
          { key: 'right', label: '车辆右侧' }
        ],
        interior: [
          { key: 'dashboard', label: '仪表盘' },
          { key: 'cabin', label: '驾驶舱' }
        ]
      },
      photos: {
        exterior: {},
        interior: {}
      },
      signatureData: '',
      agreementGroup: [],
      submitting: false,
      signatureContext: null
    }
  },
  computed: {
    agreed() {
      return this.agreementGroup.includes('agreed')
    },
    canProceedStep1() {
      return this.depositPaid && this.documents.idCard && this.documents.driverLicense
    },
    canProceedStep2() {
      const allChecked = [...this.checklist.exterior, ...this.checklist.interior, ...this.checklist.functions].every(item => item.checked)
      return allChecked && this.vehicleData.mileage && this.vehicleData.fuelLevel
    },
    canProceedStep3() {
      const exteriorComplete = this.photoPositions.exterior.every(pos => this.photos.exterior[pos.key])
      const interiorComplete = this.photoPositions.interior.every(pos => this.photos.interior[pos.key])
      return exteriorComplete && interiorComplete
    },
    canComplete() {
      return this.agreed && this.signatureData && !this.submitting
    },
    completedCheckItems() {
      return [...this.checklist.exterior, ...this.checklist.interior, ...this.checklist.functions].filter(item => item.checked).length
    },
    totalCheckItems() {
      return this.checklist.exterior.length + this.checklist.interior.length + this.checklist.functions.length
    },
    completedPhotos() {
      return Object.keys(this.photos.exterior).length + Object.keys(this.photos.interior).length
    },
    totalPhotos() {
      return this.photoPositions.exterior.length + this.photoPositions.interior.length
    }
  },
  onLoad(options) {
    this.orderId = options.id
    this.loadOrderInfo()
    this.initPickupFlow()
  },
  onReady() {
    this.initSignatureCanvas()
  },
  methods: {
    async loadOrderInfo() {
      // 这里应该调用获取订单详情的API
      this.orderInfo = {
        orderNo: '20231129001',
        customerName: '张三',
        customerPhone: '13800138000',
        vehicleName: '大通V90房车',
        vehiclePlate: '京A12345',
        startDate: '2025-12-01',
        endDate: '2025-12-05'
      }
    },
    async initPickupFlow() {
      try {
        uni.showLoading({ title: '加载中...' })
        const res = await startPickup(this.orderId)
        this.checklist = res.checklistTemplate
        uni.hideLoading()
      } catch (error) {
        uni.hideLoading()
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },
    // 证件上传处理
    afterReadDocument(event, type) {
      const { file } = event
      this.documents[type] = file.url
      if (type === 'idCard') {
        this.idCardList = [{ url: file.url, status: 'success', message: '' }]
      } else if (type === 'driverLicense') {
        this.driverLicenseList = [{ url: file.url, status: 'success', message: '' }]
      }
    },
    deleteDocument(type) {
      this.documents[type] = ''
      if (type === 'idCard') {
        this.idCardList = []
      } else if (type === 'driverLicense') {
        this.driverLicenseList = []
      }
    },
    // 检查清单处理
    handleExteriorChange(values) {
      this.checklist.exterior.forEach(item => {
        item.checked = values.includes(item.id)
      })
    },
    handleInteriorChange(values) {
      this.checklist.interior.forEach(item => {
        item.checked = values.includes(item.id)
      })
    },
    handleFunctionsChange(values) {
      this.checklist.functions.forEach(item => {
        item.checked = values.includes(item.id)
      })
    },
    // 照片上传处理
    getPhotoList(category, position) {
      const photo = this.photos[category][position]
      return photo ? [{ url: photo, status: 'success', message: '' }] : []
    },
    afterReadPhoto(event, category, position) {
      const { file } = event
      this.$set(this.photos[category], position, file.url)
    },
    deletePhoto(category, position) {
      this.$delete(this.photos[category], position)
    },
    initSignatureCanvas() {
      this.signatureContext = uni.createCanvasContext('signatureCanvas', this)
      this.signatureContext.setStrokeStyle('#000000')
      this.signatureContext.setLineWidth(3)
      this.signatureContext.setLineCap('round')
      this.signatureContext.setLineJoin('round')
    },
    signatureStart(e) {
      const touch = e.touches[0]
      this.signatureContext.beginPath()
      this.signatureContext.moveTo(touch.x, touch.y)
    },
    signatureMove(e) {
      const touch = e.touches[0]
      this.signatureContext.lineTo(touch.x, touch.y)
      this.signatureContext.stroke()
      this.signatureContext.draw(true)
    },
    signatureEnd() {
      uni.canvasToTempFilePath({
        canvasId: 'signatureCanvas',
        success: (res) => {
          this.signatureData = res.tempFilePath
        }
      }, this)
    },
    clearSignature() {
      this.signatureContext.clearRect(0, 0, 750, 300)
      this.signatureContext.draw()
      this.signatureData = ''
    },
    nextStep() {
      if (this.currentStep < 4) {
        this.currentStep++
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    async completePickup() {
      if (!this.canComplete) return

      try {
        this.submitting = true
        uni.showLoading({ title: '提交中...' })

        // 提交检查数据
        await submitPickupInspection(this.orderId, {
          checklist: this.checklist,
          vehicleData: this.vehicleData
        })

        // 上传照片
        const allPhotos = [
          ...Object.values(this.photos.exterior),
          ...Object.values(this.photos.interior)
        ]
        await uploadPickupPhotos(this.orderId, allPhotos)

        // 完成取车
        await completePickup(this.orderId, {
          documents: this.documents,
          signature: this.signatureData,
          agreed: this.agreed
        })

        uni.hideLoading()
        uni.showToast({ title: '取车完成', icon: 'success' })

        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (error) {
        uni.hideLoading()
        uni.showToast({ title: error.message || '提交失败', icon: 'none' })
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pickup-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 100rpx;
}

.progress-bar {
  padding: 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}

.step-content {
  padding: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin: 30rpx 0 20rpx;
}

.document-upload {
  display: flex;
  gap: 30rpx;
  margin-bottom: 30rpx;
}

.upload-item {
  flex: 1;
}

.upload-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
}

.upload-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 320rpx;
  height: 200rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  border: 2rpx dashed #ddd;
}

.upload-text {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.checklist-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.checklist-header {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.checkbox-item {
  margin-bottom: 20rpx;
}

.meter-input-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.input-row {
  margin-bottom: 20rpx;

  .input-label {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 10rpx;
    display: block;
  }
}

.photo-section {
  margin-bottom: 30rpx;
}

.photo-category-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.photo-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
}

.photo-label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 15rpx;
}

.signature-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.signature-canvas {
  width: 100%;
  height: 300rpx;
  border: 2rpx solid #d9d9d9;
  border-radius: 12rpx;
  background-color: #fff;
}

.btn-clear-signature {
  margin-top: 20rpx;
}

.agreement-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}
</style>
