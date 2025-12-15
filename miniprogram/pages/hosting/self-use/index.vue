<template>
  <view class="self-use">
    <view class="info-card">
      <text class="vehicle-name">{{ vehicle.name }}</text>
      <text class="plate">{{ vehicle.plateNumber }}</text>
    </view>

    <view class="form">
      <view class="form-item">
        <text class="label">取车门店</text>
        <text class="value">{{ pickupStoreDisplay }}</text>
      </view>

      <view class="form-item switch-item">
        <text class="label">异地还车</text>
        <switch :checked="isDifferentLocation" color="#FF9F29" @change="handleDifferentLocationChange"></switch>
      </view>

      <view v-if="isDifferentLocation" class="different-block">
        <view class="form-item">
          <text class="label">还车城市</text>
          <picker mode="selector" :range="returnCityOptions" range-key="name" @change="onReturnCityChange">
            <view class="picker">{{ returnCityName || '请选择城市' }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">还车门店</text>
          <picker
            :disabled="availableReturnStores.length === 0"
            mode="selector"
            :range="availableReturnStores"
            range-key="name"
            @change="onReturnStoreChange"
          >
            <view class="picker">{{ form.returnStoreName || '请选择门店' }}</view>
          </picker>
        </view>
      </view>

      <view class="form-item" @tap="openDatePicker">
        <text class="label">取车时间</text>
        <view class="picker">{{ pickupTimeDisplay }}</view>
      </view>
      <view class="form-item" @tap="openDatePicker">
        <text class="label">还车时间</text>
        <view class="picker">{{ returnTimeDisplay }}</view>
      </view>
    </view>

    <view class="fee-section">
      <view class="section-title">费用明细</view>
      <view class="fee-item">
        <text>租金</text>
        <text class="free">¥0</text>
      </view>
      <view class="fee-item">
        <text>门店服务费</text>
        <text>¥{{ fees.serviceFee }}</text>
      </view>
      <view class="fee-item">
        <text>异地还车费</text>
        <text>¥{{ fees.returnFee }}</text>
      </view>
      <view class="fee-total">
        <text>合计</text>
        <text class="total">¥{{ totalFee }}</text>
      </view>
    </view>

    <button class="submit-btn" @click="submit">提交申请</button>

    <RentDatePicker
      ref="rentDatePicker"
      :disabled-dates="disabledDatesForPicker"
      @confirm="handleDateConfirm"
    />
  </view>
</template>

<script>
import dayjs from 'dayjs'
import RentDatePicker from '@/components/business/RentDatePicker.vue'
import { applySelfUse, getStoreList, getVehicleDetail } from '@/api/hosting'

const FREE_DISTANCE_KM = 30
const RETURN_FEE_RATE = 4
const MIN_RETURN_FEE = 200

export default {
  components: { RentDatePicker },
  data() {
    return {
      vehicle: {
        id: 1,
        name: '大通V90',
        plateNumber: '京A·12345',
        defaultStoreId: 1
      },
      stores: [],
      cityOptions: [],
      blockedRanges: [],
      isDifferentLocation: false,
      form: {
        pickupStoreId: '',
        pickupStoreName: '',
        pickupCityId: '',
        pickupCityName: '',
        returnCityId: '',
        returnCityName: '',
        returnStoreId: '',
        returnStoreName: '',
        pickupDate: '',
        returnDate: '',
        pickupTime: '10:00',
        returnTime: '10:00'
      },
      fees: {
        serviceFee: 300,
        returnFee: 0
      }
    }
  },
  computed: {
    totalFee() {
      return this.fees.serviceFee + this.fees.returnFee
    },
    pickupStoreDisplay() {
      if (!this.form.pickupStoreName) return '加载中'
      return `${this.form.pickupCityName} · ${this.form.pickupStoreName}`
    },
    returnCityOptions() {
      return this.cityOptions
    },
    availableReturnStores() {
      if (!this.form.returnCityId) return []
      const city = this.cityOptions.find(item => item.id === this.form.returnCityId)
      return city ? city.stores : []
    },
    returnCityName() {
      return this.form.returnCityName
    },
    pickupTimeDisplay() {
      return this.formatDateTime(this.form.pickupDate, this.form.pickupTime)
    },
    returnTimeDisplay() {
      return this.formatDateTime(this.form.returnDate, this.form.returnTime)
    },
    disabledDatesForPicker() {
      const dates = []
      this.blockedRanges.forEach(range => {
        let current = dayjs(range.start)
        const end = dayjs(range.end)
        while (current.isBefore(end) || current.isSame(end, 'day')) {
          dates.push(current.format('YYYY-MM-DD'))
          current = current.add(1, 'day')
        }
      })
      return dates
    }
  },
  onLoad(options) {
    this.initPage(options)
  },
  methods: {
    async initPage(options) {
      await Promise.all([this.loadStores(), this.loadVehicleDetail(options?.vehicleId)])
      this.initDefaultForm()
    },
    async loadStores() {
      try {
        const list = await getStoreList()
        this.stores = list.map(store => {
          const cityName = this.extractCityName(store)
          return {
            ...store,
            cityId: cityName,
            cityName
          }
        })
        this.cityOptions = this.buildCityOptions(this.stores)
      } catch (error) {
        console.error('加载门店列表失败:', error)
        uni.showToast({ title: '门店加载失败', icon: 'none' })
      }
    },
    async loadVehicleDetail(vehicleId) {
      try {
        const detail = await getVehicleDetail(vehicleId ? Number(vehicleId) : 1)
        this.vehicle = {
          ...this.vehicle,
          ...detail
        }
        this.blockedRanges = detail.blockedRanges || this.createMockBlockedRanges()
        if (detail.defaultStoreId) {
          this.form.pickupStoreId = detail.defaultStoreId
        }
      } catch (error) {
        console.error('加载车辆详情失败:', error)
        this.blockedRanges = this.createMockBlockedRanges()
      }
    },
    initDefaultForm() {
      const pickupStore = this.getStoreById(this.form.pickupStoreId) || this.stores[0]
      if (pickupStore) {
        this.form.pickupStoreId = pickupStore.id
        this.form.pickupStoreName = pickupStore.name
        this.form.pickupCityId = pickupStore.cityId
        this.form.pickupCityName = pickupStore.cityName
        this.form.returnCityId = pickupStore.cityId
        this.form.returnCityName = pickupStore.cityName
        this.form.returnStoreId = pickupStore.id
        this.form.returnStoreName = pickupStore.name
      }
      if (!this.form.pickupDate || !this.form.returnDate) {
        const pickup = dayjs().add(1, 'day')
        const dropoff = pickup.add(2, 'day')
        this.form.pickupDate = pickup.format('YYYY-MM-DD')
        this.form.returnDate = dropoff.format('YYYY-MM-DD')
      }
    },
    extractCityName(store) {
      const fromAddress = store.address?.match(/([\u4e00-\u9fa5]+?)市/)
      if (fromAddress && fromAddress[1]) {
        return fromAddress[1]
      }
      const match = store.name?.match(/^([\u4e00-\u9fa5]{2})/)
      return match ? match[1] : '本地'
    },
    buildCityOptions(stores) {
      const map = new Map()
      stores.forEach(store => {
        if (!map.has(store.cityId)) {
          map.set(store.cityId, {
            id: store.cityId,
            name: store.cityName,
            stores: []
          })
        }
        map.get(store.cityId).stores.push(store)
      })
      return Array.from(map.values())
    },
    getStoreById(storeId) {
      return this.stores.find(store => store.id === storeId)
    },
    handleDifferentLocationChange(e) {
      this.isDifferentLocation = e.detail.value
      if (!this.isDifferentLocation) {
        this.form.returnCityId = this.form.pickupCityId
        this.form.returnCityName = this.form.pickupCityName
        this.form.returnStoreId = this.form.pickupStoreId
        this.form.returnStoreName = this.form.pickupStoreName
        this.fees.returnFee = 0
      }
    },
    onReturnCityChange(e) {
      const index = Number(e.detail.value)
      const city = this.returnCityOptions[index]
      if (!city) return
      this.form.returnCityId = city.id
      this.form.returnCityName = city.name
      this.form.returnStoreId = ''
      this.form.returnStoreName = ''
      this.fees.returnFee = 0
    },
    onReturnStoreChange(e) {
      const index = Number(e.detail.value)
      const store = this.availableReturnStores[index]
      if (!store) return
      this.form.returnStoreId = store.id
      this.form.returnStoreName = store.name
      this.calculateReturnFee()
    },
    calculateReturnFee() {
      if (!this.isDifferentLocation) {
        this.fees.returnFee = 0
        return
      }
      const pickupStore = this.getStoreById(this.form.pickupStoreId)
      const returnStore = this.getStoreById(this.form.returnStoreId)
      if (!pickupStore || !returnStore || pickupStore.id === returnStore.id) {
        this.fees.returnFee = 0
        return
      }
      const distance = this.calculateDistanceKm(pickupStore, returnStore)
      const extraDistance = Math.max(0, distance - FREE_DISTANCE_KM)
      if (extraDistance <= 0) {
        this.fees.returnFee = 0
        return
      }
      const fee = Math.max(MIN_RETURN_FEE, Math.round(extraDistance * RETURN_FEE_RATE))
      this.fees.returnFee = fee
    },
    calculateDistanceKm(start, end) {
      const toRad = value => (value * Math.PI) / 180
      const R = 6371
      const dLat = toRad(end.latitude - start.latitude)
      const dLon = toRad(end.longitude - start.longitude)
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(start.latitude)) * Math.cos(toRad(end.latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return Math.round(R * c * 10) / 10
    },
    openDatePicker() {
      this.$refs.rentDatePicker?.open(this.form.pickupDate, this.form.returnDate, this.form.pickupTime)
    },
    handleDateConfirm(data) {
      this.form.pickupDate = data.pickupDate
      this.form.returnDate = data.returnDate
      this.form.pickupTime = data.time
      this.form.returnTime = data.time
    },
    formatDateTime(date, time) {
      if (!date) return '请选择'
      return `${dayjs(date).format('YYYY年MM月DD日')} ${time}`
    },
    createMockBlockedRanges() {
      return [
        { start: dayjs().add(4, 'day').format('YYYY-MM-DD'), end: dayjs().add(6, 'day').format('YYYY-MM-DD') },
        { start: dayjs().add(10, 'day').format('YYYY-MM-DD'), end: dayjs().add(12, 'day').format('YYYY-MM-DD') }
      ]
    },
    async submit() {
      if (!this.form.pickupDate || !this.form.returnDate) {
        uni.showToast({ title: '请选择取还车时间', icon: 'none' })
        return
      }
      if (this.isDifferentLocation && !this.form.returnStoreId) {
        uni.showToast({ title: '请选择还车门店', icon: 'none' })
        return
      }
      const payload = {
        vehicleId: this.vehicle.id,
        pickupStoreId: this.form.pickupStoreId,
        returnStoreId: this.form.returnStoreId,
        pickupDate: this.form.pickupDate,
        pickupTime: this.form.pickupTime,
        returnDate: this.form.returnDate,
        returnTime: this.form.returnTime,
        differentLocation: this.isDifferentLocation,
        fees: this.fees
      }
      uni.showLoading({ title: '提交中...' })
      try {
        await applySelfUse(payload)
        uni.hideLoading()
        uni.showModal({
          title: '提交成功',
          content: '您的自用申请已提交，平台将在24小时内审核',
          showCancel: false,
          success: () => uni.navigateBack()
        })
      } catch (error) {
        console.error('提交失败:', error)
        uni.hideLoading()
        uni.showToast({ title: '提交失败，请稍后再试', icon: 'none' })
      }
    }
  }
}
</script>

<style scoped>
.self-use {
  min-height: 100vh;
  background: #F5F5F5;
  padding: 24rpx 32rpx 120rpx;
}
.info-card {
  background: #FFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}
.vehicle-name {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}
.plate {
  display: block;
  font-size: 24rpx;
  color: #999;
}
.form {
  background: #FFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}
.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F5F5F5;
}
.form-item:last-child {
  border-bottom: none;
}
.label {
  font-size: 28rpx;
  color: #333;
}
.value {
  font-size: 28rpx;
  color: #666;
}
.picker {
  font-size: 28rpx;
  color: #333;
}
.switch-item {
  padding-top: 0;
}
.different-block {
  background: #FFF9F0;
  border-radius: 12rpx;
  padding: 24rpx 24rpx 8rpx;
  margin-bottom: 8rpx;
}
.different-block .form-item {
  border-bottom: none;
  padding: 16rpx 0;
}
.fee-section {
  background: #FFF;
  border-radius: 16rpx;
  padding: 32rpx;
}
.section-title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
}
.fee-item {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  font-size: 28rpx;
}
.free {
  color: #4CAF50;
}
.fee-total {
  display: flex;
  justify-content: space-between;
  padding-top: 24rpx;
  margin-top: 24rpx;
  border-top: 1rpx solid #F5F5F5;
  font-size: 32rpx;
  font-weight: 600;
}
.total {
  color: #FF9F29;
}
.submit-btn {
  position: fixed;
  bottom: 32rpx;
  left: 32rpx;
  right: 32rpx;
  height: 88rpx;
  background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
  color: #FFF;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
}
</style>
