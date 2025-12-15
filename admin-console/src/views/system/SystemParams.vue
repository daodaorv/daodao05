<template>
  <div class="system-params-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>参数设置</h2>
      <p class="page-description">管理系统参数和业务阈值配置</p>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="参数分类">
          <el-select
            v-model="searchForm.category"
            placeholder="请选择分类"
            clearable
            style="width: 150px"
          >
            <el-option label="系统参数" value="system" />
            <el-option label="业务参数" value="business" />
            <el-option label="性能参数" value="performance" />
            <el-option label="安全参数" value="security" />
          </el-select>
        </el-form-item>
        <el-form-item label="参数名称">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入参数名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <el-card class="toolbar-card" shadow="never">
      <el-button type="primary" :icon="Plus" @click="handleCreate">
        新增参数
      </el-button>
      <el-button :icon="Download">导出配置</el-button>
      <el-button :icon="Upload">导入配置</el-button>
      <el-button type="warning" :icon="RefreshRight">重置默认值</el-button>
    </el-card>

    <!-- 参数列表 -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="paramsList"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="参数名称" width="200" />
        <el-table-column prop="key" label="参数键名" width="200" />
        <el-table-column label="参数分类" width="120">
          <template #default="{ row }">
            <el-tag :type="getCategoryType(row.category)" size="small">
              {{ getCategoryLabel(row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="参数值" width="150">
          <template #default="{ row }">
            <el-tag v-if="row.type === 'boolean'" :type="row.value === 'true' ? 'success' : 'info'">
              {{ row.value === 'true' ? '是' : '否' }}
            </el-tag>
            <span v-else>{{ row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="description" label="参数说明" show-overflow-tooltip />
        <el-table-column label="是否系统参数" width="120">
          <template #default="{ row }">
            <el-tag :type="row.isSystem ? 'warning' : 'info'" size="small">
              {{ row.isSystem ? '系统参数' : '自定义' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              size="small"
              :disabled="row.isSystem"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
            <el-button link type="warning" size="small" @click="handleResetValue(row)">
              重置
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑参数对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="参数名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数键名" prop="key">
          <el-input
            v-model="form.key"
            placeholder="请输入参数键名（英文）"
            :disabled="isEdit"
          />
        </el-form-item>
        <el-form-item label="参数分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
            <el-option label="系统参数" value="system" />
            <el-option label="业务参数" value="business" />
            <el-option label="性能参数" value="performance" />
            <el-option label="安全参数" value="security" />
          </el-select>
        </el-form-item>
        <el-form-item label="参数类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
            <el-option label="字符串" value="string" />
            <el-option label="数字" value="number" />
            <el-option label="布尔值" value="boolean" />
            <el-option label="JSON" value="json" />
          </el-select>
        </el-form-item>
        <el-form-item label="参数值" prop="value">
          <el-input
            v-if="form.type === 'string'"
            v-model="form.value"
            placeholder="请输入参数值"
          />
          <el-input-number
            v-else-if="form.type === 'number'"
            v-model="form.value"
            style="width: 100%"
          />
          <el-switch
            v-else-if="form.type === 'boolean'"
            v-model="form.value"
            active-text="是"
            inactive-text="否"
          />
          <el-input
            v-else
            v-model="form.value"
            type="textarea"
            :rows="4"
            placeholder="请输入JSON格式的参数值"
          />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位（可选）" />
        </el-form-item>
        <el-form-item label="默认值" prop="defaultValue">
          <el-input v-model="form.defaultValue" placeholder="请输入默认值" />
        </el-form-item>
        <el-form-item label="参数说明" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入参数说明"
          />
        </el-form-item>
        <el-form-item label="是否系统参数" prop="isSystem">
          <el-switch
            v-model="form.isSystem"
            active-text="是"
            inactive-text="否"
            :disabled="isEdit"
          />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Search,
  Refresh,
  Plus,
  Download,
  Upload,
  RefreshRight,
} from '@element-plus/icons-vue'

// 参数数据类型
interface SystemParam {
  id: number
  name: string
  key: string
  category: string
  type: string
  value: string
  unit: string
  defaultValue: string
  description: string
  isSystem: boolean
  updatedAt: string
}

// 搜索表单
const searchForm = reactive({
  category: '',
  keyword: '',
})

// 参数列表
const paramsList = ref<SystemParam[]>([
  {
    id: 1,
    name: '会话超时时间',
    key: 'session_timeout',
    category: 'system',
    type: 'number',
    value: '30',
    unit: '分钟',
    defaultValue: '30',
    description: '用户会话超时时间，超时后需要重新登录',
    isSystem: true,
    updatedAt: '2024-11-30 10:00:00',
  },
  {
    id: 2,
    name: '文件上传大小限制',
    key: 'upload_size_limit',
    category: 'system',
    type: 'number',
    value: '10',
    unit: 'MB',
    defaultValue: '10',
    description: '单个文件上传大小限制',
    isSystem: true,
    updatedAt: '2024-11-30 09:30:00',
  },
  {
    id: 3,
    name: '订单自动取消时间',
    key: 'order_auto_cancel_time',
    category: 'business',
    type: 'number',
    value: '30',
    unit: '分钟',
    defaultValue: '30',
    description: '未支付订单自动取消时间',
    isSystem: true,
    updatedAt: '2024-11-30 09:00:00',
  },
  {
    id: 4,
    name: '最短租赁天数',
    key: 'min_rental_days',
    category: 'business',
    type: 'number',
    value: '1',
    unit: '天',
    defaultValue: '1',
    description: '车辆最短租赁天数限制',
    isSystem: true,
    updatedAt: '2024-11-30 08:30:00',
  },
  {
    id: 5,
    name: '启用维护模式',
    key: 'maintenance_mode',
    category: 'system',
    type: 'boolean',
    value: 'false',
    unit: '',
    defaultValue: 'false',
    description: '开启后用户端将无法访问',
    isSystem: true,
    updatedAt: '2024-11-30 08:00:00',
  },
])

const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 5,
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增参数')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  id: 0,
  name: '',
  key: '',
  category: '',
  type: 'string',
  value: '',
  unit: '',
  defaultValue: '',
  description: '',
  isSystem: false,
})

const formRules: FormRules = {
  name: [
    { required: true, message: '请输入参数名称', trigger: 'blur' },
  ],
  key: [
    { required: true, message: '请输入参数键名', trigger: 'blur' },
    { pattern: /^[a-z_]+$/, message: '参数键名只能包含小写字母和下划线', trigger: 'blur' },
  ],
  category: [
    { required: true, message: '请选择参数分类', trigger: 'change' },
  ],
  type: [
    { required: true, message: '请选择参数类型', trigger: 'change' },
  ],
  value: [
    { required: true, message: '请输入参数值', trigger: 'blur' },
  ],
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  ElMessage.success('搜索功能开发中...')
}

// 重置
const handleReset = () => {
  searchForm.category = ''
  searchForm.keyword = ''
  pagination.page = 1
}

// 新增参数
const handleCreate = () => {
  dialogTitle.value = '新增参数'
  isEdit.value = false
  dialogVisible.value = true
}

// 编辑参数
const handleEdit = (row: SystemParam) => {
  dialogTitle.value = '编辑参数'
  isEdit.value = true
  form.id = row.id
  form.name = row.name
  form.key = row.key
  form.category = row.category
  form.type = row.type
  form.value = row.value
  form.unit = row.unit
  form.defaultValue = row.defaultValue
  form.description = row.description
  form.isSystem = row.isSystem
  dialogVisible.value = true
}

// 删除参数
const handleDelete = async (row: SystemParam) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除参数 "${row.name}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    const index = paramsList.value.findIndex(p => p.id === row.id)
    if (index > -1) {
      paramsList.value.splice(index, 1)
      pagination.total--
    }
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 重置参数值
const handleResetValue = async (row: SystemParam) => {
  try {
    await ElMessageBox.confirm(
      `确定要将参数 "${row.name}" 重置为默认值吗？`,
      '重置确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    row.value = row.defaultValue
    ElMessage.success('重置成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('重置失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      if (isEdit.value) {
        const index = paramsList.value.findIndex(p => p.id === form.id)
        if (index > -1) {
          paramsList.value[index] = {
            ...paramsList.value[index],
            name: form.name,
            category: form.category,
            type: form.type,
            value: form.value,
            unit: form.unit,
            defaultValue: form.defaultValue,
            description: form.description,
            updatedAt: new Date().toLocaleString('zh-CN'),
          }
        }
        ElMessage.success('更新成功')
      } else {
        const newParam: SystemParam = {
          id: paramsList.value.length + 1,
          name: form.name,
          key: form.key,
          category: form.category,
          type: form.type,
          value: form.value,
          unit: form.unit,
          defaultValue: form.defaultValue,
          description: form.description,
          isSystem: form.isSystem,
          updatedAt: new Date().toLocaleString('zh-CN'),
        }
        paramsList.value.unshift(newParam)
        pagination.total++
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
  form.id = 0
  form.name = ''
  form.key = ''
  form.category = ''
  form.type = 'string'
  form.value = ''
  form.unit = ''
  form.defaultValue = ''
  form.description = ''
  form.isSystem = false
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
}

// 获取分类类型标签
const getCategoryType = (category: string) => {
  const typeMap: Record<string, any> = {
    system: 'primary',
    business: 'success',
    performance: 'warning',
    security: 'danger',
  }
  return typeMap[category] || 'info'
}

// 获取分类标签文本
const getCategoryLabel = (category: string) => {
  const labelMap: Record<string, string> = {
    system: '系统参数',
    business: '业务参数',
    performance: '性能参数',
    security: '安全参数',
  }
  return labelMap[category] || category
}

// 页面加载
onMounted(() => {
  // TODO: 加载参数列表
})
</script>

<style scoped lang="scss">
.system-params-container {
  padding: 20px;

  .page-header {
    margin-bottom: 20px;

    h2 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #303133;
    }

    .page-description {
      font-size: 14px;
      color: #909399;
      margin: 0;
    }
  }

  .search-card,
  .toolbar-card,
  .table-card {
    margin-bottom: 20px;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
