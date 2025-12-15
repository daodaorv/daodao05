<template>
  <view class="address-edit-page">
    <view class="form-container">
      <u-form ref="formRef" :model="formData" :rules="rules">
        <u-form-item label="收货人" prop="name" required>
          <u-input v-model="formData.name" placeholder="请输入姓名" />
        </u-form-item>
        <u-form-item label="手机号" prop="phone" required>
          <u-input v-model="formData.phone" placeholder="请输入手机号" type="number" maxlength="11" />
        </u-form-item>
        <u-form-item label="地区" prop="region" required>
          <picker mode="region" @change="onRegionChange">
            <view class="region-value">{{ regionText || '请选择省市区' }}</view>
          </picker>
        </u-form-item>
        <u-form-item label="详细地址" prop="detail" required>
          <u-textarea v-model="formData.detail" placeholder="街道、楼栋等详细信息" maxlength="60" auto-height />
        </u-form-item>
        <u-form-item label="地址标签" prop="tag">
          <u-input v-model="formData.tag" placeholder="例如：家、公司、学校" maxlength="8" />
        </u-form-item>
        <u-form-item label="设为默认" prop="isDefault">
          <switch :checked="formData.isDefault" @change="onDefaultChange" color="#FF9F29" style="transform: scale(0.8)" />
        </u-form-item>
      </u-form>
    </view>

    <view class="footer-btn">
      <button class="submit-btn" :loading="submitting" @tap="handleSubmit">保存</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useAddressStore } from '@/stores/address'

const addressStore = useAddressStore()
const formRef = ref<any>(null)
const submitting = ref(false)
const isEdit = ref(false)
const addressId = ref('')

const formData = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  tag: '家',
  isDefault: false
})

const regionText = ref('')

const rules = {
  name: {
    rules: [{ required: true, errorMessage: '请输入姓名' }]
  },
  phone: {
    rules: [
      { required: true, errorMessage: '请输入手机号' },
      { pattern: /^1[3-9]\d{9}$/, errorMessage: '手机号格式不正确' }
    ]
  },
  region: {
    rules: [{ required: true, errorMessage: '请选择省市区' }]
  },
  detail: {
    rules: [{ required: true, errorMessage: '请输入详细地址' }]
  }
}

onLoad(async (options: any) => {
  if (options.id) {
    isEdit.value = true
    addressId.value = options.id
    uni.setNavigationBarTitle({ title: '编辑地址' })
    if (!addressStore.addressList.length) {
      await addressStore.fetchAddresses()
    }
    const target = addressStore.addressList.find((item: any) => item.id === options.id)
    if (target) {
      formData.value = {
        name: target.name,
        phone: target.phone,
        province: target.province,
        city: target.city,
        district: target.district,
        detail: target.detail,
        tag: target.tag || '家',
        isDefault: !!target.isDefault
      }
      regionText.value = `${target.province}${target.city}${target.district}`
    } else {
      uni.showToast({ title: '地址不存在', icon: 'none' })
      setTimeout(() => uni.navigateBack(), 1500)
    }
  } else {
    uni.setNavigationBarTitle({ title: '新增地址' })
  }
})

const onRegionChange = (e: any) => {
  const [province, city, district] = e.detail.value
  formData.value.province = province
  formData.value.city = city
  formData.value.district = district
  regionText.value = `${province}${city}${district}`
}

const onDefaultChange = (e: any) => {
  formData.value.isDefault = e.detail.value
}

const handleSubmit = () => {
  formRef.value.validate().then(async () => {
    submitting.value = true
    const payload = { ...formData.value }
    let success = false
    if (isEdit.value) {
      success = await addressStore.editAddress(addressId.value, payload)
    } else {
      success = await addressStore.addAddress(payload)
    }
    submitting.value = false
    if (success) {
      uni.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 1500)
    } else {
      uni.showToast({ title: '保存失败', icon: 'none' })
    }
  }).catch(() => {
    uni.showToast({ title: '请完善信息', icon: 'none' })
  })
}
</script>

<style scoped lang="scss">
.address-edit-page {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding: 24rpx;
}

.form-container {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
}

.region-value {
  font-size: 28rpx;
  color: #333;
}

.footer-btn {
  margin-top: 60rpx;
}

.submit-btn {
  background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
  color: #FFFFFF;
  font-size: 32rpx;
  border-radius: 44rpx;
  height: 88rpx;
  line-height: 88rpx;
  
  &::after {
    border: none;
  }
}
</style>
