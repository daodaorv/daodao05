<template>
  <view class="contact-edit-page">
    <view class="form-container">
      <u-form ref="form" :model="formData" :rules="rules">
        <u-form-item label="姓名" prop="name" required>
          <u-input v-model="formData.name" placeholder="请输入真实姓名" />
        </u-form-item>
        <u-form-item label="手机号" prop="phone" required>
          <u-input v-model="formData.phone" placeholder="请输入手机号" type="number" maxlength="11" />
        </u-form-item>
        <u-form-item label="身份证" prop="idCard" required>
          <u-input v-model="formData.idCard" placeholder="请输入身份证号码" maxlength="18" />
        </u-form-item>
        <u-form-item label="驾驶证号" prop="driverLicenseNo" required>
          <u-input v-model="formData.driverLicenseNo" placeholder="请输入驾驶证号码" maxlength="20" />
        </u-form-item>
        <u-form-item label="驾驶证正面" prop="driverLicenseFront" required>
          <uni-file-picker
            v-model="licenseFrontFiles"
            file-mediatype="image"
            :limit="1"
            @select="onLicenseSelect('front', $event)"
            @delete="onLicenseDelete('front')"
          ></uni-file-picker>
        </u-form-item>
        <u-form-item label="驾驶证反面" prop="driverLicenseBack" required>
          <uni-file-picker
            v-model="licenseBackFiles"
            file-mediatype="image"
            :limit="1"
            @select="onLicenseSelect('back', $event)"
            @delete="onLicenseDelete('back')"
          ></uni-file-picker>
        </u-form-item>
        <u-form-item label="设为默认" prop="isDefault">
          <switch :checked="formData.isDefault" @change="handleSwitchChange" color="#FF9F29" style="transform: scale(0.8)" />
        </u-form-item>
      </u-form>
    </view>

    <view class="footer-btn">
      <button class="submit-btn" @tap="handleSubmit" :loading="submitting">保存</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useContactStore } from '@/stores/contact'

const contactStore = useContactStore()
const form = ref<any>(null)
const submitting = ref(false)
const isEdit = ref(false)
const contactId = ref('')

const formData = ref({
  name: '',
  phone: '',
  idCard: '',
  driverLicenseNo: '',
  driverLicenseFront: '',
  driverLicenseBack: '',
  isDefault: false
})

const licenseFrontFiles = ref<any[]>([])
const licenseBackFiles = ref<any[]>([])

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
  idCard: {
    rules: [
      { required: true, errorMessage: '请输入身份证号' },
      { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, errorMessage: '身份证号格式不正确' }
    ]
  },
  driverLicenseNo: {
    rules: [
      { required: true, errorMessage: '请输入驾驶证号' },
      { pattern: /^[A-Za-z0-9]{6,20}$/, errorMessage: '驾驶证号格式不正确' }
    ]
  },
  driverLicenseFront: {
    rules: [{ required: true, errorMessage: '请上传驾驶证正面照片' }]
  },
  driverLicenseBack: {
    rules: [{ required: true, errorMessage: '请上传驾驶证反面照片' }]
  }
}

onLoad(async (options: any) => {
  if (options.id) {
    isEdit.value = true
    contactId.value = options.id
    uni.setNavigationBarTitle({ title: '编辑联系人' })

    if (!contactStore.contactList.length) {
      await contactStore.fetchContacts()
    }

    const contact = contactStore.contactList.find((c: any) => c.id === options.id)
    if (contact) {
      formData.value = {
        name: contact.name || '',
        phone: contact.phone || '',
        idCard: contact.idCard || '',
        driverLicenseNo: contact.driverLicenseNo || '',
        driverLicenseFront: contact.driverLicenseFront || '',
        driverLicenseBack: contact.driverLicenseBack || '',
        isDefault: !!contact.isDefault
      }
      if (contact.driverLicenseFront) {
        licenseFrontFiles.value = [{ url: contact.driverLicenseFront }]
      }
      if (contact.driverLicenseBack) {
        licenseBackFiles.value = [{ url: contact.driverLicenseBack }]
      }
    } else {
      uni.showToast({ title: '联系人不存在', icon: 'none' })
      setTimeout(() => uni.navigateBack(), 1500)
    }
  } else {
    uni.setNavigationBarTitle({ title: '添加联系人' })
    formData.value = {
      name: '',
      phone: '',
      idCard: '',
      driverLicenseNo: '',
      driverLicenseFront: '',
      driverLicenseBack: '',
      isDefault: false
    }
    licenseFrontFiles.value = []
    licenseBackFiles.value = []
  }
})

const handleSwitchChange = (e: any) => {
  formData.value.isDefault = e.detail.value
}

const getFilePath = (event: any) => {
  const tempPaths = event?.tempFilePaths || []
  if (tempPaths.length > 0) {
    return tempPaths[0]
  }
  const files = event?.tempFiles || []
  if (files.length > 0) {
    return files[0].path || files[0].url || ''
  }
  return ''
}

const onLicenseSelect = (type: 'front' | 'back', event: any) => {
  const path = getFilePath(event)
  if (type === 'front') {
    licenseFrontFiles.value = path ? [{ url: path }] : []
    formData.value.driverLicenseFront = path
  } else {
    licenseBackFiles.value = path ? [{ url: path }] : []
    formData.value.driverLicenseBack = path
  }
}

const onLicenseDelete = (type: 'front' | 'back') => {
  if (type === 'front') {
    licenseFrontFiles.value = []
    formData.value.driverLicenseFront = ''
  } else {
    licenseBackFiles.value = []
    formData.value.driverLicenseBack = ''
  }
}

const handleSubmit = () => {
  form.value.validate().then(async () => {
    submitting.value = true
    let success = false

    if (isEdit.value) {
      success = await contactStore.editContact(contactId.value, formData.value)
    } else {
      success = await contactStore.addContact(formData.value)
    }

    submitting.value = false

    if (success) {
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      uni.showToast({
        title: '保存失败',
        icon: 'none'
      })
    }
  }).catch((err: any) => {
    console.log('表单校验失败', err)
  })
}
</script>

<style scoped lang="scss">
.contact-edit-page {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding: 24rpx;
}

.form-container {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
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
