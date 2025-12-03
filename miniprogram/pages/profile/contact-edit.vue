<template>
  <view class="contact-edit-page">
    <view class="form-container">
      <u-form ref="form" :model="formData" :rules="rules">
        <u-form-item label="姓名" prop="name" required>
          <u-input v-model="formData.name" placeholder="请输入真实姓名" />
        </u-form-item>
        <u-form-item label="手机号" prop="phone" required>
          <u-input v-model="formData.phone" placeholder="请输入手机号码" type="number" maxlength="11" />
        </u-form-item>
        <u-form-item label="身份证" prop="idCard" required>
          <u-input v-model="formData.idCard" placeholder="请输入身份证号码" maxlength="18" />
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
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useContactStore } from '@/stores/contact';

const contactStore = useContactStore();
const form = ref<any>(null);
const submitting = ref(false);
const isEdit = ref(false);
const contactId = ref('');

const formData = ref({
  name: '',
  phone: '',
  idCard: '',
  isDefault: false
});

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
  }
};

onLoad(async (options: any) => {
  if (options.id) {
    isEdit.value = true;
    contactId.value = options.id;
    uni.setNavigationBarTitle({ title: '编辑联系人' });
    
    // 获取详情 (这里直接从store列表找，找不到再调接口，简化处理直接调接口或从store找)
    // 假设store里有列表，先从列表找
    const contact = contactStore.contactList.find((c: any) => c.id === options.id);
    if (contact) {
      formData.value = { ...contact };
    } else {
      // 实际应该调用详情接口，这里简化
      uni.showToast({ title: '联系人不存在', icon: 'none' });
      setTimeout(() => uni.navigateBack(), 1500);
    }
  }
});

const handleSwitchChange = (e: any) => {
  formData.value.isDefault = e.detail.value;
};

const handleSubmit = () => {
  form.value.validate().then(async (res: any) => {
    submitting.value = true;
    let success = false;
    
    if (isEdit.value) {
      success = await contactStore.editContact(contactId.value, formData.value);
    } else {
      success = await contactStore.addContact(formData.value);
    }
    
    submitting.value = false;
    
    if (success) {
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    } else {
      uni.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  }).catch((err: any) => {
    console.log('表单校验失败', err);
  });
};
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
