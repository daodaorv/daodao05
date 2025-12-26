<!-- @ts-nocheck -->
<template>
  <div class="service-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>服务列表</span>
          <el-button type="primary" :icon="Plus" @click="handleCreate">
            新增服务
          </el-button>
        </div>
      </template>

      <el-table :data="services" border v-loading="loading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="serviceName" label="服务名称" min-width="150" />
        <el-table-column prop="serviceCode" label="服务编码" width="120" />
        <el-table-column prop="fixedPrice" label="固定价格" width="120">
          <template #default="{ row }">
            ¥{{ row.fixedPrice.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="description" label="服务描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="active"
              inactive-value="inactive"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑服务对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <el-form-item label="服务名称" prop="serviceName">
          <el-input v-model="form.serviceName" placeholder="请输入服务名称" />
        </el-form-item>

        <el-form-item label="服务编码" prop="serviceCode">
          <el-input v-model="form.serviceCode" placeholder="请输入服务编码" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="固定价格" prop="fixedPrice">
              <el-input-number
                v-model="form.fixedPrice"
                :min="0"
                :precision="2"
                :step="10"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="unit">
              <el-select v-model="form.unit" placeholder="选择单位" style="width: 100%">
                <el-option label="次" value="次" />
                <el-option label="小时" value="小时" />
                <el-option label="天" value="天" />
                <el-option label="项" value="项" />
                <el-option label="年" value="年" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="服务描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入服务描述"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio value="active">启用</el-radio>
            <el-radio value="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getSupplierServices,
  createSupplierService,
  updateSupplierService,
  deleteSupplierService,
  type SupplierService
} from '@/api/supplier'

interface Props {
  supplierId: number
}

const props = defineProps<Props>()

const services = ref<SupplierService[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const editingId = ref<number | null>(null)

const form = ref({
  serviceName: '',
  serviceCode: '',
  fixedPrice: 0,
  unit: '次',
  description: '',
  status: 'active' as 'active' | 'inactive'
})

const formRules: FormRules = {
  serviceName: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
  serviceCode: [{ required: true, message: '请输入服务编码', trigger: 'blur' }],
  fixedPrice: [{ required: true, message: '请输入固定价格', trigger: 'blur' }],
  unit: [{ required: true, message: '请选择单位', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 获取服务列表
async function fetchServices() {
  loading.value = true
  try {
    services.value = await getSupplierServices(props.supplierId)
  } catch (error) {
    console.error('获取服务列表失败:', error)
    ElMessage.error('获取服务列表失败')
  } finally {
    loading.value = false
  }
}

// 新增
function handleCreate() {
  dialogTitle.value = '新增服务'
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

// 编辑
function handleEdit(row: SupplierService) {
  dialogTitle.value = '编辑服务'
  editingId.value = row.id
  form.value = {
    serviceName: row.serviceName,
    serviceCode: row.serviceCode,
    fixedPrice: row.fixedPrice,
    unit: row.unit,
    description: row.description || '',
    status: row.status
  }
  dialogVisible.value = true
}

// 删除
async function handleDelete(row: SupplierService) {
  try {
    await ElMessageBox.confirm(`确定要删除服务"${row.serviceName}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteSupplierService(row.id)
    ElMessage.success('删除成功')
    fetchServices()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 状态切换
async function handleStatusChange(row: SupplierService) {
  try {
    await updateSupplierService(row.id, { status: row.status })
    ElMessage.success('状态更新成功')
  } catch (error) {
    console.error('状态更新失败:', error)
    ElMessage.error('状态更新失败')
    // 恢复原状态
    row.status = row.status === 'active' ? 'inactive' : 'active'
  }
}

// 提交表单
async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitLoading.value = true

    if (editingId.value) {
      await updateSupplierService(editingId.value, form.value)
      ElMessage.success('更新成功')
    } else {
      await createSupplierService(props.supplierId, form.value)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchServices()
  } catch (error) {
    if (error !== false) {
      console.error('提交失败:', error)
      ElMessage.error('提交失败')
    }
  } finally {
    submitLoading.value = false
  }
}

// 关闭对话框
function handleDialogClose() {
  resetForm()
}

// 重置表单
function resetForm() {
  form.value = {
    serviceName: '',
    serviceCode: '',
    fixedPrice: 0,
    unit: '次',
    description: '',
    status: 'active'
  }
  formRef.value?.clearValidate()
}

onMounted(() => {
  fetchServices()
})
</script>

<style scoped lang="scss">
.service-management {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
