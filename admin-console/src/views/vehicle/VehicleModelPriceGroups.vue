<!-- @ts-nocheck -->
<template>
  <div class="vehicle-model-price-groups">
    <el-card>
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="分组名称">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入分组名称或编码"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item label="车型类型">
          <el-select v-model="searchForm.vehicleType" placeholder="请选择" clearable>
            <el-option label="全部" value="" />
            <el-option label="C型房车" value="c_type" />
            <el-option label="B型房车" value="b_type" />
            <el-option label="拖挂房车" value="trailer" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="全部" value="" />
            <el-option label="启用" value="active" />
            <el-option label="停用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 工具栏 -->
      <div class="toolbar">
        <el-button type="primary" @click="handleCreate">新增分组</el-button>
      </div>

      <!-- 表格 -->
      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="groupName" label="分组名称" width="150" />
        <el-table-column prop="groupCode" label="分组编码" width="150" />
        <el-table-column prop="basePrice" label="基础价格" width="120">
          <template #default="{ row }">
            <span class="price">¥{{ row.basePrice }}/天</span>
          </template>
        </el-table-column>
        <el-table-column prop="vehicleTypes" label="适用车型" width="200">
          <template #default="{ row }">
            <el-tag
              v-for="type in row.vehicleTypes"
              :key="type"
              size="small"
              style="margin-right: 5px"
            >
              {{ getVehicleTypeLabel(type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="vehicleCount" label="车型数量" width="100">
          <template #default="{ row }">
            <el-link type="primary" @click="handleViewModels(row)">
              {{ row.vehicleCount }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" size="small" @click="handleUpdatePrice(row)">
              调整价格
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '停用' : '启用' }}
            </el-button>
            <el-button
              link
              type="danger"
              size="small"
              @click="handleDelete(row)"
              :disabled="row.vehicleCount > 0"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSearch"
        @current-change="handleSearch"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <!-- 新增/编辑分组对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="分组名称" prop="groupName">
          <el-input v-model="formData.groupName" placeholder="请输入分组名称" />
        </el-form-item>
        <el-form-item label="分组编码" prop="groupCode">
          <el-input
            v-model="formData.groupCode"
            placeholder="请输入分组编码（大写字母、数字、下划线）"
            :disabled="isEdit"
          />
        </el-form-item>
        <el-form-item label="适用车型" prop="vehicleTypes">
          <el-checkbox-group v-model="formData.vehicleTypes">
            <el-checkbox label="c_type">C型房车</el-checkbox>
            <el-checkbox label="b_type">B型房车</el-checkbox>
            <el-checkbox label="trailer">拖挂房车</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="基础价格" prop="basePrice">
          <el-input-number
            v-model="formData.basePrice"
            :min="0"
            :step="50"
            :precision="0"
            controls-position="right"
          />
          <span style="margin-left: 10px">元/天</span>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分组描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 调整价格对话框 -->
    <el-dialog
      v-model="priceDialogVisible"
      title="调整分组价格"
      width="600px"
      @close="handlePriceDialogClose"
    >
      <el-alert
        title="提示"
        type="warning"
        :closable="false"
        style="margin-bottom: 20px"
      >
        调整分组价格后，所有继承该分组价格的车型（未自定义价格）将自动同步新价格
      </el-alert>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="分组名称">
          {{ currentGroup?.groupName }}
        </el-descriptions-item>
        <el-descriptions-item label="当前价格">
          <span class="price">¥{{ currentGroup?.basePrice }}/天</span>
        </el-descriptions-item>
        <el-descriptions-item label="车型数量">
          {{ currentGroup?.vehicleCount }}
        </el-descriptions-item>
        <el-descriptions-item label="受影响车型">
          <el-tag type="warning">{{ affectedCount }} 个</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <el-form
        ref="priceFormRef"
        :model="priceFormData"
        :rules="priceFormRules"
        label-width="120px"
        style="margin-top: 20px"
      >
        <el-form-item label="新价格" prop="newPrice">
          <el-input-number
            v-model="priceFormData.newPrice"
            :min="0"
            :step="50"
            :precision="0"
            controls-position="right"
          />
          <span style="margin-left: 10px">元/天</span>
        </el-form-item>
        <el-form-item label="价格变化">
          <span v-if="priceChange !== 0" :class="priceChange > 0 ? 'price-up' : 'price-down'">
            {{ priceChange > 0 ? '+' : '' }}¥{{ priceChange }}
            ({{ priceChangePercent > 0 ? '+' : '' }}{{ priceChangePercent }}%)
          </span>
          <span v-else>-</span>
        </el-form-item>
        <el-form-item label="变更原因" prop="changeReason">
          <el-input
            v-model="priceFormData.changeReason"
            type="textarea"
            :rows="3"
            placeholder="请输入变更原因"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="priceFormData.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注信息（可选）"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="priceDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePriceSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  getPriceGroups,
  createPriceGroup,
  updatePriceGroup,
  deletePriceGroup,
  updateGroupPrice,
} from '@/api/vehicleModelPrice'
import type {
  VehicleModelPriceGroup,
  VehicleModelPriceGroupListParams,
  CreatePriceGroupRequest,
  UpdateGroupPriceRequest,
} from '@/types/vehicleModel'

// 搜索表单
const searchForm = reactive<VehicleModelPriceGroupListParams>({
  keyword: '',
  vehicleType: '',
  status: '',
  page: 1,
  pageSize: 10,
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 表格数据
const tableData = ref<VehicleModelPriceGroup[]>([])
const loading = ref(false)

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增分组')
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<CreatePriceGroupRequest>({
  groupName: '',
  groupCode: '',
  vehicleTypes: [],
  basePrice: 500,
  description: '',
})

// 表单验证规则
const formRules: FormRules = {
  groupName: [
    { required: true, message: '请输入分组名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  groupCode: [
    { required: true, message: '请输入分组编码', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
    { pattern: /^[A-Z0-9_]+$/, message: '只能包含大写字母、数字和下划线', trigger: 'blur' },
  ],
  vehicleTypes: [
    { required: true, message: '请选择适用车型', trigger: 'change' },
    { type: 'array', min: 1, message: '至少选择一个车型类型', trigger: 'change' },
  ],
  basePrice: [
    { required: true, message: '请输入基础价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于0', trigger: 'blur' },
  ],
}

// 调整价格对话框
const priceDialogVisible = ref(false)
const currentGroup = ref<VehicleModelPriceGroup | null>(null)
const affectedCount = ref(0)
const priceFormRef = ref<FormInstance>()

const priceFormData = reactive<UpdateGroupPriceRequest>({
  groupId: 0,
  newPrice: 0,
  changeReason: '',
  remark: '',
})

const priceFormRules: FormRules = {
  newPrice: [
    { required: true, message: '请输入新价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于0', trigger: 'blur' },
  ],
  changeReason: [
    { required: true, message: '请输入变更原因', trigger: 'blur' },
    { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' },
  ],
}

// 计算价格变化
const priceChange = computed(() => {
  if (!currentGroup.value) return 0
  return priceFormData.newPrice - currentGroup.value.basePrice
})

const priceChangePercent = computed(() => {
  if (!currentGroup.value || currentGroup.value.basePrice === 0) return 0
  return Math.round((priceChange.value / currentGroup.value.basePrice) * 100)
})

// 获取车型类型标签
const getVehicleTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    c_type: 'C型',
    b_type: 'B型',
    trailer: '拖挂',
  }
  return labels[type] || type
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      page: pagination.page,
      pageSize: pagination.pageSize,
    }
    const res = await getPriceGroups(params)
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.vehicleType = ''
  searchForm.status = ''
  handleSearch()
}

// 新增
const handleCreate = () => {
  dialogTitle.value = '新增分组'
  isEdit.value = false
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: VehicleModelPriceGroup) => {
  dialogTitle.value = '编辑分组'
  isEdit.value = true
  Object.assign(formData, {
    groupName: row.groupName,
    groupCode: row.groupCode,
    vehicleTypes: [...row.vehicleTypes],
    basePrice: row.basePrice,
    description: row.description,
  })
  dialogVisible.value = true
}

// 调整价格
const handleUpdatePrice = (row: VehicleModelPriceGroup) => {
  currentGroup.value = row
  affectedCount.value = row.vehicleCount // 实际应该查询 isCustomPrice=false 的数量
  priceFormData.groupId = row.id
  priceFormData.newPrice = row.basePrice
  priceFormData.changeReason = ''
  priceFormData.remark = ''
  priceDialogVisible.value = true
}

// 查看车型
const handleViewModels = (row: VehicleModelPriceGroup) => {
  ElMessage.info(`查看分组【${row.groupName}】的车型列表（功能待实现）`)
}

// 切换状态
const handleToggleStatus = async (row: VehicleModelPriceGroup) => {
  const newStatus = row.status === 'active' ? 'inactive' : 'active'
  const action = newStatus === 'active' ? '启用' : '停用'

  try {
    await ElMessageBox.confirm(`确定要${action}该分组吗？`, '提示', {
      type: 'warning',
    })

    const res = await updatePriceGroup(row.id, { status: newStatus })
    if (res.code === 200) {
      ElMessage.success(`${action}成功`)
      loadData()
    }
  } catch (error: unknown) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

// 删除
const handleDelete = async (row: VehicleModelPriceGroup) => {
  if (row.vehicleCount > 0) {
    ElMessage.warning('该分组下还有车型，无法删除')
    return
  }

  try {
    await ElMessageBox.confirm('确定要删除该分组吗？删除后无法恢复！', '警告', {
      type: 'warning',
    })

    const res = await deletePriceGroup(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadData()
    }
  } catch (error: unknown) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    submitting.value = true

    if (isEdit.value) {
      // 编辑逻辑（暂不实现完整编辑，因为需要 groupId）
      ElMessage.warning('编辑功能待完善')
    } else {
      const res = await createPriceGroup(formData)
      if (res.success) {
        ElMessage.success('创建成功')
        dialogVisible.value = false
        loadData()
      }
    }
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitting.value = false
  }
}

// 提交价格调整
const handlePriceSubmit = async () => {
  if (!priceFormRef.value) return

  try {
    await priceFormRef.value.validate()

    // 价格变化超过30%需要二次确认
    if (Math.abs(priceChangePercent.value) > 30) {
      await ElMessageBox.confirm(
        `价格变化幅度较大（${priceChangePercent.value}%），确定要继续吗？`,
        '警告',
        { type: 'warning' }
      )
    }

    // 影响车型数量较多需要二次确认
    if (affectedCount.value > 10) {
      await ElMessageBox.confirm(
        `此操作将影响 ${affectedCount.value} 个车型的价格，确定要继续吗？`,
        '警告',
        { type: 'warning' }
      )
    }

    submitting.value = true

    const res = await updateGroupPrice(priceFormData)
    if (res.success) {
      ElMessage.success(`分组价格已更新，${res.data.affectedCount}个车型价格已同步`)
      priceDialogVisible.value = false
      loadData()
    }
  } catch (error: unknown) {
    if (error !== 'cancel') {
      console.error('提交失败:', error)
      ElMessage.error('提交失败')
    }
  } finally {
    submitting.value = false
  }
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    groupName: '',
    groupCode: '',
    vehicleTypes: [],
    basePrice: 500,
    description: '',
  })
}

const handlePriceDialogClose = () => {
  priceFormRef.value?.resetFields()
  currentGroup.value = null
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.vehicle-model-price-groups {
  .search-form {
    margin-bottom: 20px;
  }

  .toolbar {
    margin-bottom: 20px;
  }

  .price {
    color: #f56c6c;
    font-weight: bold;
  }

  .price-up {
    color: #f56c6c;
    font-weight: bold;
  }

  .price-down {
    color: #67c23a;
    font-weight: bold;
  }
}
</style>
