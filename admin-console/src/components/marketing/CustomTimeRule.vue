<template>
  <div class="custom-time-rule">
    <el-alert
      title="自定义时间规则说明"
      type="info"
      :closable="false"
      style="margin-bottom: 20px"
    >
      <template #default>
        <div>支持三种规则类型：日期范围、周期性规则、特定日期</div>
        <div style="margin-top: 5px">优先级：法定节假日(90) > 自定义规则(30-70) > 城市分级(1-10)</div>
      </template>
    </el-alert>

    <!-- 搜索筛选区 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="关键词">
        <el-input
          v-model="searchForm.keyword"
          placeholder="规则名称"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="规则类型">
        <el-select v-model="searchForm.ruleType" placeholder="请选择" clearable style="width: 150px">
          <el-option label="日期范围" value="date_range" />
          <el-option label="周期性规则" value="periodic" />
          <el-option label="特定日期" value="specific_date" />
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
        添加规则
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
      <el-table-column prop="ruleName" label="规则名称" width="150" />
      <el-table-column prop="ruleType" label="规则类型" width="120">
        <template #default="{ row }">
          <el-tag v-if="row.ruleType === 'date_range'" type="success">日期范围</el-tag>
          <el-tag v-else-if="row.ruleType === 'periodic'" type="warning">周期性</el-tag>
          <el-tag v-else type="info">特定日期</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ruleConfig" label="规则配置" min-width="200">
        <template #default="{ row }">
          <div v-if="row.ruleType === 'date_range'">
            {{ row.startDate }} 至 {{ row.endDate }}
          </div>
          <div v-else-if="row.ruleType === 'periodic'">
            每{{ row.periodicType === 'weekly' ? '周' : '月' }}
            {{ row.periodicValue }}
          </div>
          <div v-else>
            {{ row.specificDates?.join(', ') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级" width="100">
        <template #default="{ row }">
          <el-tag type="warning">{{ row.priority }}</el-tag>
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
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag v-if="row.status === 'active'" type="success">启用</el-tag>
          <el-tag v-else type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" size="small" @click="handlePreview(row)">预览</el-button>
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
      width="800px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="formData.ruleName" placeholder="请输入规则名称" />
        </el-form-item>

        <el-form-item label="规则类型" prop="ruleType">
          <el-radio-group v-model="formData.ruleType">
            <el-radio value="date_range">日期范围</el-radio>
            <el-radio value="periodic">周期性规则</el-radio>
            <el-radio value="specific_date">特定日期</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 日期范围配置 -->
        <template v-if="formData.ruleType === 'date_range'">
          <el-form-item label="开始日期" prop="dateRangeConfig.startDate">
            <el-date-picker
              v-model="formData.dateRangeConfig.startDate"
              type="date"
              placeholder="选择开始日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="结束日期" prop="dateRangeConfig.endDate">
            <el-date-picker
              v-model="formData.dateRangeConfig.endDate"
              type="date"
              placeholder="选择结束日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </template>

        <!-- 周期性规则配置 -->
        <template v-if="formData.ruleType === 'periodic'">
          <el-form-item label="周期类型" prop="periodicConfig.periodicType">
            <el-radio-group v-model="formData.periodicConfig.periodicType">
              <el-radio value="weekly">每周</el-radio>
              <el-radio value="monthly">每月</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="formData.periodicConfig.periodicType === 'weekly'"
            label="星期几"
            prop="periodicConfig.weekdays"
          >
            <el-checkbox-group v-model="formData.periodicConfig.weekdays">
              <el-checkbox :value="1">周一</el-checkbox>
              <el-checkbox :value="2">周二</el-checkbox>
              <el-checkbox :value="3">周三</el-checkbox>
              <el-checkbox :value="4">周四</el-checkbox>
              <el-checkbox :value="5">周五</el-checkbox>
              <el-checkbox :value="6">周六</el-checkbox>
              <el-checkbox :value="7">周日</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item
            v-if="formData.periodicConfig.periodicType === 'monthly'"
            label="每月日期"
            prop="periodicConfig.monthDays"
          >
            <el-select
              v-model="formData.periodicConfig.monthDays"
              multiple
              placeholder="请选择日期"
              style="width: 100%"
            >
              <el-option v-for="day in 31" :key="day" :label="`${day}日`" :value="day" />
            </el-select>
          </el-form-item>

          <el-form-item label="周期开始日期" prop="periodicConfig.startDate">
            <el-date-picker
              v-model="formData.periodicConfig.startDate"
              type="date"
              placeholder="选择周期开始日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item label="周期结束日期" prop="periodicConfig.endDate">
            <el-date-picker
              v-model="formData.periodicConfig.endDate"
              type="date"
              placeholder="选择周期结束日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </template>

        <!-- 特定日期配置 -->
        <template v-if="formData.ruleType === 'specific_date'">
          <el-form-item label="特定日期" prop="specificDateConfig.dates">
            <el-date-picker
              v-model="formData.specificDateConfig.dates"
              type="dates"
              placeholder="选择多个日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </template>

        <el-form-item label="优先级" prop="priority">
          <el-input-number
            v-model="formData.priority"
            :min="1"
            :max="100"
            controls-position="right"
          />
          <span style="margin-left: 10px; color: #909399; font-size: 12px">
            数值越大优先级越高（建议范围：30-70）
          </span>
        </el-form-item>

        <el-form-item label="调整类型" prop="adjustmentType">
          <el-radio-group v-model="formData.adjustmentType">
            <el-radio value="percentage">百分比</el-radio>
            <el-radio value="fixed">固定金额</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="调整值" prop="adjustmentValue">
          <el-input-number
            v-model="formData.adjustmentValue"
            controls-position="right"
          />
          <span style="margin-left: 10px">
            {{ formData.adjustmentType === 'percentage' ? '%' : '元' }}
          </span>
          <span style="margin-left: 10px; color: #909399; font-size: 12px">
            正数表示涨价，负数表示降价
          </span>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio value="active">启用</el-radio>
            <el-radio value="inactive">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
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
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getCustomTimeRuleList,
  createCustomTimeRule,
  updateCustomTimeRule,
  deleteCustomTimeRule
} from '@/api/timeFactor'
import type { CustomTimeRuleListItem, CustomTimeRuleFormData } from '@/types/timeFactor'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  ruleType: '',
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
const tableData = ref<CustomTimeRuleListItem[]>([])

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const isEdit = ref(false)
const currentId = ref<number | null>(null)

// 表单
const formRef = ref<FormInstance>()
const formData = reactive<CustomTimeRuleFormData>({
  ruleName: '',
  ruleType: 'date_range',
  priority: 50,
  adjustmentType: 'percentage',
  adjustmentValue: 0,
  dateRangeConfig: {
    startDate: '',
    endDate: ''
  },
  periodicConfig: {
    periodicType: 'weekly',
    weekdays: [],
    monthDays: [],
    startDate: '',
    endDate: ''
  },
  specificDateConfig: {
    dates: []
  },
  status: 'active',
  remark: ''
})

const formRules: FormRules = {
  ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  ruleType: [{ required: true, message: '请选择规则类型', trigger: 'change' }],
  priority: [{ required: true, message: '请输入优先级', trigger: 'blur' }],
  adjustmentType: [{ required: true, message: '请选择调整类型', trigger: 'change' }],
  adjustmentValue: [{ required: true, message: '请输入调整值', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getCustomTimeRuleList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword || undefined,
      ruleType: searchForm.ruleType as any,
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

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.ruleType = ''
  searchForm.status = ''
  pagination.page = 1
  loadData()
}

// 重置表单
const resetForm = () => {
  formData.ruleName = ''
  formData.ruleType = 'date_range'
  formData.priority = 50
  formData.adjustmentType = 'percentage'
  formData.adjustmentValue = 0
  formData.dateRangeConfig = { startDate: '', endDate: '' }
  formData.periodicConfig = {
    periodicType: 'weekly',
    weekdays: [],
    monthDays: [],
    startDate: '',
    endDate: ''
  }
  formData.specificDateConfig = { dates: [] }
  formData.status = 'active'
  formData.remark = ''
}

// 添加
const handleAdd = () => {
  resetForm()
  isEdit.value = false
  currentId.value = null
  dialogTitle.value = '添加自定义时间规则'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: CustomTimeRuleListItem) => {
  resetForm()
  isEdit.value = true
  currentId.value = row.id
  dialogTitle.value = '编辑自定义时间规则'

  // 填充表单数据
  formData.ruleName = row.ruleName
  formData.ruleType = row.ruleType
  formData.priority = row.priority
  formData.adjustmentType = row.adjustmentType
  formData.adjustmentValue = row.adjustmentValue
  formData.status = row.status
  formData.remark = row.remark

  // 根据规则类型填充配置
  if (row.ruleType === 'date_range' && row.dateRangeConfig) {
    formData.dateRangeConfig = { ...row.dateRangeConfig }
  } else if (row.ruleType === 'periodic' && row.periodicConfig) {
    formData.periodicConfig = { ...row.periodicConfig }
  } else if (row.ruleType === 'specific_date' && row.specificDateConfig) {
    formData.specificDateConfig = { ...row.specificDateConfig }
  }

  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      if (isEdit.value && currentId.value) {
        await updateCustomTimeRule(currentId.value, formData)
        ElMessage.success('编辑成功')
      } else {
        await createCustomTimeRule(formData)
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
      loadData()
    } catch (error) {
      ElMessage.error(isEdit.value ? '编辑失败' : '添加失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 预览
const handlePreview = (row: CustomTimeRuleListItem) => {
  ElMessage.info('预览规则功能开发中...')
}

// 删除
const handleDelete = (row: CustomTimeRuleListItem) => {
  ElMessageBox.prompt('请输入删除原因', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /.+/,
    inputErrorMessage: '删除原因不能为空'
  })
    .then(async ({ value }) => {
      try {
        const res = await deleteCustomTimeRule({
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
})
</script>

<style scoped lang="scss">
.custom-time-rule {
  .search-form {
    margin-bottom: 0;
  }

  .toolbar {
    margin-top: 20px;
  }
}
</style>
