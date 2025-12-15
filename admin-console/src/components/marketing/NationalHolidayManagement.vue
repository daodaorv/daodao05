<template>
  <div class="national-holiday-management">
    <el-alert
      title="法定节假日说明"
      type="info"
      :closable="false"
      style="margin-bottom: 20px"
    >
      <template #default>
        <div>法定节假日可以自动同步国家发布的节假日数据，也可以手动添加和编辑</div>
        <div style="margin-top: 5px">优先级：法定节假日(90) > 自定义规则(30-70)</div>
      </template>
    </el-alert>

    <!-- 搜索筛选区 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="年份">
        <el-select v-model="searchForm.year" placeholder="请选择" style="width: 120px">
          <el-option
            v-for="year in yearList"
            :key="year"
            :label="`${year}年`"
            :value="year"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="节假日类型">
        <el-select v-model="searchForm.holidayType" placeholder="请选择" clearable style="width: 150px">
          <el-option label="春节" value="春节" />
          <el-option label="清明节" value="清明节" />
          <el-option label="劳动节" value="劳动节" />
          <el-option label="端午节" value="端午节" />
          <el-option label="中秋节" value="中秋节" />
          <el-option label="国庆节" value="国庆节" />
          <el-option label="元旦" value="元旦" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮区 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleSync">
        <el-icon><Refresh /></el-icon>
        同步节假日
      </el-button>
      <el-button @click="handleAdd">
        <el-icon><Plus /></el-icon>
        手动添加
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
      <el-table-column prop="holidayName" label="节假日名称" width="150" />
      <el-table-column prop="year" label="年份" width="100" />
      <el-table-column prop="startDate" label="开始日期" width="120" />
      <el-table-column prop="endDate" label="结束日期" width="120" />
      <el-table-column prop="days" label="天数" width="80">
        <template #default="{ row }">
          <el-tag type="info">{{ row.days }}天</el-tag>
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
      <el-table-column prop="source" label="数据来源" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.source === 'auto'" type="success">自动同步</el-tag>
          <el-tag v-else type="info">手动添加</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="syncTime" label="同步时间" width="180" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
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

    <!-- 同步对话框 -->
    <el-dialog
      v-model="syncDialogVisible"
      title="同步法定节假日"
      width="500px"
      @close="handleSyncDialogClose"
    >
      <el-form
        ref="syncFormRef"
        :model="syncFormData"
        :rules="syncFormRules"
        label-width="100px"
      >
        <el-form-item label="同步年份" prop="year">
          <el-select v-model="syncFormData.year" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="year in yearList"
              :key="year"
              :label="`${year}年`"
              :value="year"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="强制覆盖">
          <el-switch v-model="syncFormData.force" />
          <div style="margin-top: 5px; color: #999; font-size: 12px">
            开启后将覆盖已存在的节假日数据
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="syncDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSyncSubmit" :loading="syncing">
          {{ syncing ? '同步中...' : '开始同步' }}
        </el-button>
      </template>
    </el-dialog>

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
        <el-form-item label="节假日名称" prop="holidayName">
          <el-input
            v-model="formData.holidayName"
            placeholder="请输入节假日名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="年份" prop="year">
          <el-select v-model="formData.year" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="year in yearList"
              :key="year"
              :label="`${year}年`"
              :value="year"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="日期范围" prop="dateRange">
          <el-date-picker
            v-model="formData.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          />
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Refresh, Plus } from '@element-plus/icons-vue'
import {
  getNationalHolidayList,
  createNationalHoliday,
  updateNationalHoliday,
  deleteNationalHoliday,
  syncNationalHoliday,
  getYearList
} from '@/api/timeFactor'
import type { NationalHolidayListItem, NationalHolidayFormData } from '@/types/timeFactor'

// 年份列表
const yearList = ref<number[]>([])

// 搜索表单
const searchForm = reactive({
  year: new Date().getFullYear(),
  holidayType: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const loading = ref(false)
const tableData = ref<NationalHolidayListItem[]>([])

// 同步对话框
const syncDialogVisible = ref(false)
const syncFormRef = ref<FormInstance>()
const syncing = ref(false)

const syncFormData = reactive({
  year: new Date().getFullYear(),
  force: false
})

const syncFormRules: FormRules = {
  year: [{ required: true, message: '请选择年份', trigger: 'change' }]
}

// 添加/编辑对话框
const dialogVisible = ref(false)
const dialogTitle = ref('添加节假日')
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive<NationalHolidayFormData>({
  holidayName: '',
  year: new Date().getFullYear(),
  startDate: '',
  endDate: '',
  adjustmentType: 'percentage',
  adjustmentValue: 0,
  remark: ''
})

const formRules: FormRules = {
  holidayName: [
    { required: true, message: '请输入节假日名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  year: [{ required: true, message: '请选择年份', trigger: 'change' }],
  dateRange: [{ required: true, message: '请选择日期范围', trigger: 'change' }],
  adjustmentType: [{ required: true, message: '请选择调整方式', trigger: 'change' }],
  adjustmentValue: [{ required: true, message: '请输入调整值', trigger: 'blur' }]
}

// 加载年份列表
const loadYearList = async () => {
  try {
    const res = await getYearList()
    if (res.code === 0) {
      yearList.value = res.data
    }
  } catch (error) {
    console.error('加载年份列表失败', error)
  }
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getNationalHolidayList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      year: searchForm.year,
      holidayType: searchForm.holidayType || undefined
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
  searchForm.year = new Date().getFullYear()
  searchForm.holidayType = ''
  pagination.page = 1
  loadData()
}

// 同步节假日
const handleSync = () => {
  syncFormData.year = new Date().getFullYear()
  syncFormData.force = false
  syncDialogVisible.value = true
}

// 提交同步
const handleSyncSubmit = async () => {
  if (!syncFormRef.value) return

  await syncFormRef.value.validate(async (valid) => {
    if (valid) {
      syncing.value = true
      try {
        const res = await syncNationalHoliday({
          year: syncFormData.year,
          force: syncFormData.force
        })
        if (res.code === 0) {
          ElMessage.success(`同步成功！新增 ${res.data.addedCount} 条，更新 ${res.data.updatedCount} 条`)
          syncDialogVisible.value = false
          loadData()
        }
      } catch (error) {
        ElMessage.error('同步失败')
      } finally {
        syncing.value = false
      }
    }
  })
}

// 添加
const handleAdd = () => {
  dialogTitle.value = '添加节假日'
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: NationalHolidayListItem) => {
  dialogTitle.value = '编辑节假日'
  isEdit.value = true
  formData.id = row.id
  formData.holidayName = row.holidayName
  formData.year = row.year
  formData.startDate = row.startDate
  formData.endDate = row.endDate
  formData.adjustmentType = row.adjustmentType
  formData.adjustmentValue = row.adjustmentValue
  formData.remark = row.remark
  dialogVisible.value = true
}

// 删除
const handleDelete = (row: NationalHolidayListItem) => {
  ElMessageBox.confirm('确认删除该节假日吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        const res = await deleteNationalHoliday(row.id)
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
          const res = await updateNationalHoliday(formData.id!, formData)
          if (res.code === 0) {
            ElMessage.success('更新成功')
            dialogVisible.value = false
            loadData()
          }
        } else {
          const res = await createNationalHoliday(formData)
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

// 关闭同步对话框
const handleSyncDialogClose = () => {
  syncFormRef.value?.resetFields()
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
  resetForm()
}

// 重置表单
const resetForm = () => {
  formData.id = undefined
  formData.holidayName = ''
  formData.year = new Date().getFullYear()
  formData.startDate = ''
  formData.endDate = ''
  formData.adjustmentType = 'percentage'
  formData.adjustmentValue = 0
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
  loadYearList()
  loadData()
})
</script>

<style scoped lang="scss">
.national-holiday-management {
  .search-form {
    margin-bottom: 0;
  }

  .toolbar {
    margin-top: 20px;
  }
}
</style>
