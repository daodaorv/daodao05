<template>
  <div class="custom-city-factor">
    <el-alert
      title="自定义城市因子说明"
      type="info"
      :closable="false"
      style="margin-bottom: 20px"
    >
      <template #default>
        <div>自定义城市因子优先级高于城市分级，可以为特定城市设置独立的价格调整策略</div>
        <div style="margin-top: 5px">优先级：自定义因子(50) > 城市分级(1-10)</div>
      </template>
    </el-alert>

    <!-- 搜索筛选区 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="关键词">
        <el-input
          v-model="searchForm.keyword"
          placeholder="因子名称/城市名称"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="调整方式">
        <el-select v-model="searchForm.adjustmentType" placeholder="请选择" clearable style="width: 150px">
          <el-option label="百分比" value="percentage" />
          <el-option label="固定金额" value="fixed" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 120px">
          <el-option label="启用" value="active" />
          <el-option label="停用" value="inactive" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮区 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加自定义因子
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="factorName" label="因子名称" width="150" />
      <el-table-column prop="cityName" label="适用城市" width="150" />
      <el-table-column prop="provinceName" label="所属省份" width="120" />
      <el-table-column prop="priority" label="优先级" width="100">
        <template #default="{ row }">
          <el-tag type="warning">{{ row.priority }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="adjustmentType" label="调整方式" width="120">
        <template #default="{ row }">
          <el-tag v-if="row.adjustmentType === 'percentage'" type="success">百分比</el-tag>
          <el-tag v-else type="warning">固定金额</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="adjustmentValue" label="调整值" width="150">
        <template #default="{ row }">
          <span v-if="row.adjustmentType === 'percentage'" style="color: #67c23a; font-weight: bold">
            {{ row.adjustmentValue > 0 ? '+' : '' }}{{ row.adjustmentValue }}%
          </span>
          <span v-else style="color: #e6a23c; font-weight: bold">
            {{ row.adjustmentValue > 0 ? '+' : '' }}¥{{ row.adjustmentValue }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="effectiveDate" label="生效日期" width="120" />
      <el-table-column prop="expiryDate" label="失效日期" width="120">
        <template #default="{ row }">
          {{ row.expiryDate || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag v-if="row.status === 'active'" type="success">启用</el-tag>
          <el-tag v-else type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" size="small" @click="handleViewDetail(row)">详情</el-button>
          <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
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
      style="margin-top: 20px; justify-content: flex-end"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 添加/编辑对话框 -->
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
        <el-form-item label="因子名称" prop="factorName">
          <el-input
            v-model="formData.factorName"
            placeholder="请输入因子名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="适用城市" prop="cityId">
          <el-select
            v-model="formData.cityId"
            placeholder="请选择城市"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="city in cityOptions"
              :key="city.id"
              :label="`${city.cityName} (${city.provinceName})`"
              :value="city.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="优先级" prop="priority">
          <el-input-number
            v-model="formData.priority"
            :min="1"
            :max="100"
            style="width: 100%"
          />
          <div style="margin-top: 5px; color: #999; font-size: 12px">
            优先级越高越优先生效，建议设置为 50
          </div>
        </el-form-item>

        <el-form-item label="调整方式" prop="adjustmentType">
          <el-radio-group v-model="formData.adjustmentType">
            <el-radio label="percentage">百分比</el-radio>
            <el-radio label="fixed">固定金额</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="调整值" prop="adjustmentValue">
          <el-input-number
            v-model="formData.adjustmentValue"
            :min="-100"
            :max="1000"
            :precision="formData.adjustmentType === 'percentage' ? 1 : 2"
            style="width: 100%"
          />
          <span style="margin-left: 10px; color: #999">
            {{ formData.adjustmentType === 'percentage' ? '%' : '元' }}
          </span>
        </el-form-item>

        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker
            v-model="formData.effectiveDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="失效日期" prop="expiryDate">
          <el-date-picker
            v-model="formData.expiryDate"
            type="date"
            placeholder="选择日期（可选）"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="自定义城市因子详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="因子名称">{{ detailData.factorName }}</el-descriptions-item>
        <el-descriptions-item label="适用城市">{{ detailData.cityName }}</el-descriptions-item>
        <el-descriptions-item label="所属省份">{{ detailData.provinceName }}</el-descriptions-item>
        <el-descriptions-item label="优先级">
          <el-tag type="warning">{{ detailData.priority }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="调整方式">
          <el-tag v-if="detailData.adjustmentType === 'percentage'" type="success">百分比</el-tag>
          <el-tag v-else type="warning">固定金额</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="调整值">
          <span v-if="detailData.adjustmentType === 'percentage'" style="color: #67c23a; font-weight: bold">
            {{ detailData.adjustmentValue > 0 ? '+' : '' }}{{ detailData.adjustmentValue }}%
          </span>
          <span v-else style="color: #e6a23c; font-weight: bold">
            {{ detailData.adjustmentValue > 0 ? '+' : '' }}¥{{ detailData.adjustmentValue }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="生效日期">{{ detailData.effectiveDate }}</el-descriptions-item>
        <el-descriptions-item label="失效日期">{{ detailData.expiryDate || '-' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 'active'" type="success">启用</el-tag>
          <el-tag v-else type="danger">停用</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建人">{{ detailData.createdBy }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '-' }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button type="primary" @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getCityFactorList,
  createCityFactor,
  updateCityFactor,
  deleteCityFactor,
  getCityList
} from '@/api/cityFactor'
import type { CityFactorListItem, CityFactorFormData, City } from '@/types/cityFactor'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  adjustmentType: '',
  status: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const loading = ref(false)
const tableData = ref<CityFactorListItem[]>([])

// 城市选项
const cityOptions = ref<City[]>([])

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('添加自定义因子')
const isEdit = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<CityFactorFormData>({
  factorName: '',
  cityId: 0,
  priority: 50,
  adjustmentType: 'percentage',
  adjustmentValue: 0,
  effectiveDate: '',
  expiryDate: '',
  status: 'active',
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  factorName: [
    { required: true, message: '请输入因子名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
  priority: [
    { required: true, message: '请输入优先级', trigger: 'blur' },
    { type: 'number', min: 1, max: 100, message: '优先级范围 1-100', trigger: 'blur' }
  ],
  adjustmentType: [{ required: true, message: '请选择调整方式', trigger: 'change' }],
  adjustmentValue: [{ required: true, message: '请输入调整值', trigger: 'blur' }],
  effectiveDate: [{ required: true, message: '请选择生效日期', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 详情对话框
const detailDialogVisible = ref(false)
const detailData = ref<Partial<CityFactorListItem>>({})

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getCityFactorList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword || undefined,
      adjustmentType: searchForm.adjustmentType as any,
      status: searchForm.status as any
    })

    if (res.code === 0) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 加载城市列表
const loadCityList = async () => {
  try {
    const res = await getCityList({
      page: 1,
      pageSize: 1000
    })
    if (res.code === 0) {
      cityOptions.value = res.data.list
    }
  } catch (error) {
    console.error('加载城市列表失败', error)
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
  searchForm.adjustmentType = ''
  searchForm.status = ''
  pagination.page = 1
  loadData()
}

// 添加
const handleAdd = () => {
  dialogTitle.value = '添加自定义因子'
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: CityFactorListItem) => {
  dialogTitle.value = '编辑自定义因子'
  isEdit.value = true
  formData.id = row.id
  formData.factorName = row.factorName
  formData.cityId = row.cityId
  formData.priority = row.priority
  formData.adjustmentType = row.adjustmentType
  formData.adjustmentValue = row.adjustmentValue
  formData.effectiveDate = row.effectiveDate
  formData.expiryDate = row.expiryDate || ''
  formData.status = row.status
  formData.remark = row.remark
  dialogVisible.value = true
}

// 查看详情
const handleViewDetail = async (row: CityFactorListItem) => {
  detailData.value = row
  detailDialogVisible.value = true
}

// 删除
const handleDelete = (row: CityFactorListItem) => {
  ElMessageBox.prompt('请输入删除原因', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /.+/,
    inputErrorMessage: '删除原因不能为空'
  })
    .then(async ({ value }) => {
      try {
        const res = await deleteCityFactor({
          id: row.id,
          deleteReason: value
        })
        if (res.code === 0) {
          ElMessage.success('删除成功')
          loadData()
        }
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      // 用户取消
    })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          const res = await updateCityFactor(formData.id!, formData)
          if (res.code === 0) {
            ElMessage.success('更新成功')
            dialogVisible.value = false
            loadData()
          }
        } else {
          const res = await createCityFactor(formData)
          if (res.code === 0) {
            ElMessage.success('创建成功')
            dialogVisible.value = false
            loadData()
          }
        }
      } catch (error) {
        ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
      }
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
  resetForm()
}

// 重置表单
const resetForm = () => {
  formData.id = undefined
  formData.factorName = ''
  formData.cityId = 0
  formData.priority = 50
  formData.adjustmentType = 'percentage'
  formData.adjustmentValue = 0
  formData.effectiveDate = ''
  formData.expiryDate = ''
  formData.status = 'active'
  formData.remark = ''
}

// 分页变化
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  loadData()
}

// 初始化
onMounted(() => {
  loadData()
  loadCityList()
})
</script>

<style scoped lang="scss">
.custom-city-factor {
  .search-form {
    margin-bottom: 0;
  }

  .toolbar {
    margin-top: 20px;
  }
}
</style>
