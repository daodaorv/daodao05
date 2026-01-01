<template>
  <div class="register-container">
    <div class="register-form">
      <!-- Logo和标题 -->
      <div class="register-header">
        <div class="logo">🚐</div>
        <h1 class="title">叨叨房车租赁管理平台</h1>
        <p class="subtitle">申请注册管理账号</p>
      </div>

      <!-- 身份选择 -->
      <div class="role-selection">
        <h3>请选择您的身份</h3>
        <el-radio-group v-model="registerForm.roleType" size="large">
          <el-radio-button value="employee">平台员工</el-radio-button>
          <el-radio-button value="cleaner">清洁工</el-radio-button>
          <el-radio-button value="service_provider">服务商</el-radio-button>
          <el-radio-button value="partner">合作方</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 注册表单 -->
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="100px"
        size="large"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="registerForm.phone"
            placeholder="请输入手机号"
            prefix-icon="Phone"
            clearable
          />
        </el-form-item>

        <el-form-item label="姓名" prop="realName">
          <el-input
            v-model="registerForm.realName"
            placeholder="请输入真实姓名"
            prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item label="身份证号" prop="idCard">
          <el-input
            v-model="registerForm.idCard"
            placeholder="请输入身份证号"
            prefix-icon="CreditCard"
            clearable
          />
        </el-form-item>

        <!-- 平台员工特有字段 -->
        <template v-if="registerForm.roleType === 'employee'">
          <el-form-item label="期望职位" prop="position">
            <el-select v-model="registerForm.position" placeholder="请选择期望职位" style="width: 100%">
              <el-option label="门店经理" value="store_manager" />
              <el-option label="门店员工" value="store_staff" />
              <el-option label="客服人员" value="customer_service" />
              <el-option label="财务人员" value="finance" />
              <el-option label="运营人员" value="operation" />
            </el-select>
          </el-form-item>
        </template>

        <!-- 清洁工特有字段 -->
        <template v-if="registerForm.roleType === 'cleaner'">
          <el-form-item label="服务区域" prop="serviceArea">
            <el-input
              v-model="registerForm.serviceArea"
              placeholder="请输入服务区域（如：北京市朝阳区）"
              clearable
            />
          </el-form-item>
        </template>

        <!-- 服务商特有字段 -->
        <template v-if="registerForm.roleType === 'service_provider'">
          <el-form-item label="服务类型" prop="serviceType">
            <el-select v-model="registerForm.serviceType" placeholder="请选择服务类型" style="width: 100%">
              <el-option label="维修保养" value="maintenance" />
              <el-option label="保险服务" value="insurance" />
              <el-option label="其他服务" value="other" />
            </el-select>
          </el-form-item>

          <el-form-item label="公司名称" prop="companyName">
            <el-input
              v-model="registerForm.companyName"
              placeholder="请输入公司名称"
              clearable
            />
          </el-form-item>
        </template>

        <!-- 合作方特有字段 -->
        <template v-if="registerForm.roleType === 'partner'">
          <el-form-item label="合作类型" prop="partnerType">
            <el-select v-model="registerForm.partnerType" placeholder="请选择合作类型" style="width: 100%">
              <el-option label="房车租赁供应商" value="rental_supplier" />
              <el-option label="营地合作方" value="campsite_partner" />
              <el-option label="旅游产品提供商" value="tour_provider" />
            </el-select>
          </el-form-item>

          <el-form-item label="公司名称" prop="companyName">
            <el-input
              v-model="registerForm.companyName"
              placeholder="请输入公司名称"
              clearable
            />
          </el-form-item>
        </template>

        <el-form-item label="申请说明" prop="description">
          <el-input
            v-model="registerForm.description"
            type="textarea"
            :rows="4"
            placeholder="请简要说明您的申请理由和相关经验"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit" class="submit-btn">
            {{ loading ? '提交中...' : '提交申请' }}
          </el-button>
          <el-button @click="handleBack" class="back-btn">返回登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const router = useRouter()

const registerFormRef = ref<FormInstance>()
const loading = ref(false)

interface RegisterForm {
  roleType: string
  phone: string
  realName: string
  idCard: string
  position?: string
  serviceArea?: string
  serviceType?: string
  partnerType?: string
  companyName?: string
  description: string
}

const registerForm = reactive<RegisterForm>({
  roleType: 'employee',
  phone: '',
  realName: '',
  idCard: '',
  description: '',
})

const registerRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度为2-20个字符', trigger: 'blur' },
  ],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '请填写申请说明', trigger: 'blur' },
    { min: 10, max: 500, message: '申请说明长度为10-500个字符', trigger: 'blur' },
  ],
}

// 提交申请
const handleSubmit = async () => {
  if (!registerFormRef.value) return

  try {
    await registerFormRef.value.validate()
    loading.value = true

    // TODO: 调用注册申请API
    // await registerApi.submitApplication(registerForm)

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))

    ElMessage.success('申请提交成功！管理员将在3个工作日内审核您的申请')

    // 跳转回登录页
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error: any) {
    console.error('提交申请失败:', error)
    if (error.errors) {
      // 表单验证失败
      return
    }
    ElMessage.error(error.message || '提交申请失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 返回登录
const handleBack = () => {
  router.push('/login')
}
</script>

<style scoped lang="scss">
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;

  .register-form {
    width: 600px;
    max-width: 100%;
    padding: 40px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

    .register-header {
      text-align: center;
      margin-bottom: 30px;

      .logo {
        font-size: 64px;
        margin-bottom: 16px;
      }

      .title {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 8px;
      }

      .subtitle {
        font-size: 14px;
        color: #909399;
        margin: 0;
      }
    }

    .role-selection {
      margin-bottom: 30px;

      h3 {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
        margin-bottom: 16px;
      }

      :deep(.el-radio-group) {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        .el-radio-button {
          flex: 1;
          min-width: 120px;
        }
      }
    }

    .submit-btn {
      width: 60%;
      height: 44px;
    }

    .back-btn {
      width: 38%;
      height: 44px;
      margin-left: 2%;
    }
  }
}

@media (max-width: 768px) {
  .register-container {
    padding: 20px;

    .register-form {
      padding: 30px 20px;

      .role-selection {
        :deep(.el-radio-group) {
          .el-radio-button {
            min-width: 100px;
          }
        }
      }

      .submit-btn,
      .back-btn {
        width: 100%;
        margin-left: 0;
        margin-top: 10px;
      }
    }
  }
}
</style>
