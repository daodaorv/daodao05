<template>
  <div class="user-edit-container">
    <el-page-header @back="$router.back()" title="返回">
      <template #content>
        <span class="text-large font-600 mr-3">编辑用户</span>
      </template>
    </el-page-header>

    <el-card v-loading="loading" shadow="never">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" disabled />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="用户类型" prop="user_type">
          <el-select v-model="formData.user_type" placeholder="请选择用户类型">
            <el-option label="普通用户" value="customer" />
            <el-option label="移动端管理员" value="mobile_admin" />
            <el-option label="PC端管理员" value="pc_admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">正常</el-radio>
            <el-radio label="inactive">禁用</el-radio>
            <el-radio label="banned">封禁</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getUserDetail, updateUser } from '@/api/user'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive({
  phone: '',
  username: '',
  user_type: 'customer' as 'customer' | 'mobile_admin' | 'pc_admin',
  status: 'active' as 'active' | 'inactive' | 'banned'
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
}

const fetchUserDetail = async () => {
  loading.value = true
  try {
    const res = await getUserDetail(Number(route.params.id))
    Object.assign(formData, res.data)
  } catch (error) {
    console.error('获取用户详情失败:', error)
    ElMessage.error('获取用户详情失败')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await updateUser(Number(route.params.id), formData)
        ElMessage.success('保存成功')
        router.back()
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => fetchUserDetail())
</script>

<style scoped lang="scss">
.user-edit-container { padding: 20px;
  .el-page-header { margin-bottom: 20px; }
  .el-form { max-width: 600px; }
}
</style>

