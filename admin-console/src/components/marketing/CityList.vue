<template>
  <div class="city-list">
    <el-alert
      title="城市列表说明"
      type="info"
      :closable="false"
      style="margin-bottom: 20px"
    >
      <template #default>
        <div>查看所有城市及其生效的因子配置，可以修改城市所属分级</div>
      </template>
    </el-alert>

    <!-- 搜索筛选区 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="关键词">
        <el-input
          v-model="searchForm.keyword"
          placeholder="城市名称/省份"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="城市分级">
        <el-select v-model="searchForm.tier" placeholder="请选择" clearable style="width: 150px">
          <el-option label="一线城市" value="tier1" />
          <el-option label="二线城市" value="tier2" />
          <el-option label="三线城市" value="tier3" />
          <el-option label="其他城市" value="other" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮区 -->
    <div class="toolbar">
      <el-button @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入城市
      </el-button>
      <el-button @click="handleExport">
        <el-icon><Download /></el-icon>
        导出城市
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
      <el-table-column prop="cityName" label="城市名称" width="150" />
      <el-table-column prop="provinceName" label="所属省份" width="150" />
      <el-table-column prop="tier" label="城市分级" width="120">
        <template #default="{ row }">
          <el-tag v-if="row.tier === 'tier1'" type="danger">一线城市</el-tag>
          <el-tag v-else-if="row.tier === 'tier2'" type="warning">二线城市</el-tag>
          <el-tag v-else-if="row.tier === 'tier3'" type="success">三线城市</el-tag>
          <el-tag v-else type="info">其他城市</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="effectiveFactor" label="生效因子" min-width="250">
        <template #default="{ row }">
          <div v-if="row.effectiveFactor">
            <el-tag :type="row.effectiveFactor.source === 'custom' ? 'warning' : 'info'">
              {{ row.effectiveFactor.factorName }}
            </el-tag>
            <span style="margin-left: 10px">
              {{ row.effectiveFactor.adjustmentType === 'percentage' ?
                `${row.effectiveFactor.adjustmentValue > 0 ? '+' : ''}${row.effectiveFactor.adjustmentValue}%` :
                `${row.effectiveFactor.adjustmentValue > 0 ? '+' : ''}¥${row.effectiveFactor.adjustmentValue}` }}
            </span>
            <el-tag
              size="small"
              style="margin-left: 10px"
              :type="row.effectiveFactor.source === 'custom' ? 'warning' : 'info'"
            >
              {{ row.effectiveFactor.source === 'custom' ? '自定义' : '分级' }}
            </el-tag>
          </div>
          <span v-else style="color: #999">无</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleChangeTier(row)">
            修改分级
          </el-button>
          <el-button link type="primary" size="small" @click="handleViewConflict(row)">
            查看冲突
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
      style="margin-top: 20px; justify-content: flex-end"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 修改分级对话框 -->
    <el-dialog
      v-model="tierDialogVisible"
      title="修改城市分级"
      width="500px"
      @close="handleTierDialogClose"
    >
      <el-form
        ref="tierFormRef"
        :model="tierFormData"
        :rules="tierFormRules"
        label-width="100px"
      >
        <el-form-item label="城市名称">
          <el-input v-model="currentCity?.cityName" disabled />
        </el-form-item>

        <el-form-item label="当前分级">
          <el-tag v-if="currentCity?.tier === 'tier1'" type="danger">一线城市</el-tag>
          <el-tag v-else-if="currentCity?.tier === 'tier2'" type="warning">二线城市</el-tag>
          <el-tag v-else-if="currentCity?.tier === 'tier3'" type="success">三线城市</el-tag>
          <el-tag v-else type="info">其他城市</el-tag>
        </el-form-item>

        <el-form-item label="新分级" prop="newTier">
          <el-select v-model="tierFormData.newTier" placeholder="请选择" style="width: 100%">
            <el-option label="一线城市" value="tier1" />
            <el-option label="二线城市" value="tier2" />
            <el-option label="三线城市" value="tier3" />
            <el-option label="其他城市" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="变更原因" prop="changeReason">
          <el-input
            v-model="tierFormData.changeReason"
            type="textarea"
            :rows="3"
            placeholder="请输入变更原因"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="tierDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleTierSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看冲突对话框 -->
    <el-dialog
      v-model="conflictDialogVisible"
      :title="`${currentCity?.cityName} - 因子冲突检测`"
      width="700px"
    >
      <el-alert
        v-if="conflictData.conflictFactors && conflictData.conflictFactors.length > 0"
        title="检测到因子冲突"
        type="warning"
        :closable="false"
        style="margin-bottom: 20px"
      >
        <template #default>
          <div>该城市存在多个因子配置，系统将按优先级选择生效因子</div>
        </template>
      </el-alert>

      <el-alert
        v-else
        title="无因子冲突"
        type="success"
        :closable="false"
        style="margin-bottom: 20px"
      >
        <template #default>
          <div>该城市只有一个因子配置，无冲突</div>
        </template>
      </el-alert>

      <el-descriptions title="生效因子" :column="2" border style="margin-bottom: 20px">
        <el-descriptions-item label="因子名称">
          {{ conflictData.effectiveFactor?.factorName }}
        </el-descriptions-item>
        <el-descriptions-item label="优先级">
          <el-tag type="warning">{{ conflictData.effectiveFactor?.priority }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="调整方式">
          <el-tag v-if="conflictData.effectiveFactor?.adjustmentType === 'percentage'" type="success">
            百分比
          </el-tag>
          <el-tag v-else type="warning">固定金额</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="调整值">
          <span v-if="conflictData.effectiveFactor?.adjustmentType === 'percentage'" style="color: #67c23a; font-weight: bold">
            {{ conflictData.effectiveFactor?.adjustmentValue > 0 ? '+' : '' }}{{ conflictData.effectiveFactor?.adjustmentValue }}%
          </span>
          <span v-else style="color: #e6a23c; font-weight: bold">
            {{ conflictData.effectiveFactor?.adjustmentValue > 0 ? '+' : '' }}¥{{ conflictData.effectiveFactor?.adjustmentValue }}
          </span>
        </el-descriptions-item>
      </el-descriptions>

      <div v-if="conflictData.conflictFactors && conflictData.conflictFactors.length > 0">
        <el-divider content-position="left">冲突因子列表</el-divider>
        <el-table :data="conflictData.conflictFactors" border stripe style="width: 100%">
          <el-table-column prop="factorName" label="因子名称" width="150" />
          <el-table-column prop="priority" label="优先级" width="100">
            <template #default="{ row }">
              <el-tag type="info">{{ row.priority }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="未生效原因" min-width="200" />
        </el-table>
      </div>

      <template #footer>
        <el-button type="primary" @click="conflictDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Upload, Download } from '@element-plus/icons-vue'
import {
  getCityList,
  updateCityTierAssignment,
  detectCityFactorConflict,
  importCity,
  exportCity
} from '@/api/cityFactor'
import type { City, CityFactorConflictReport } from '@/types/cityFactor'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  tier: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const loading = ref(false)
const tableData = ref<City[]>([])

// 修改分级对话框
const tierDialogVisible = ref(false)
const tierFormRef = ref<FormInstance>()
const currentCity = ref<City | null>(null)

const tierFormData = reactive({
  newTier: '',
  changeReason: ''
})

const tierFormRules: FormRules = {
  newTier: [{ required: true, message: '请选择新分级', trigger: 'change' }],
  changeReason: [
    { required: true, message: '请输入变更原因', trigger: 'blur' },
    { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
  ]
}

// 查看冲突对话框
const conflictDialogVisible = ref(false)
const conflictData = ref<Partial<CityFactorConflictReport>>({})

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getCityList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword || undefined,
      tier: searchForm.tier as any
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
  searchForm.tier = ''
  pagination.page = 1
  loadData()
}

// 修改分级
const handleChangeTier = (row: City) => {
  currentCity.value = row
  tierFormData.newTier = row.tier
  tierFormData.changeReason = ''
  tierDialogVisible.value = true
}

// 查看冲突
const handleViewConflict = async (row: City) => {
  currentCity.value = row
  try {
    const res = await detectCityFactorConflict(row.id)
    if (res.code === 0) {
      conflictData.value = res.data
      conflictDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('加载冲突信息失败')
  }
}

// 导入城市
const handleImport = () => {
  ElMessage.info('导入功能开发中...')
}

// 导出城市
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 提交分级修改
const handleTierSubmit = async () => {
  if (!tierFormRef.value) return

  await tierFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await updateCityTierAssignment({
          cityId: currentCity.value!.id,
          newTier: tierFormData.newTier as any,
          changeReason: tierFormData.changeReason
        })
        if (res.code === 0) {
          ElMessage.success('修改成功')
          tierDialogVisible.value = false
          loadData()
        }
      } catch (error) {
        ElMessage.error('修改失败')
      }
    }
  })
}

// 关闭分级对话框
const handleTierDialogClose = () => {
  tierFormRef.value?.resetFields()
  tierFormData.newTier = ''
  tierFormData.changeReason = ''
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
.city-list {
  .search-form {
    margin-bottom: 0;
  }

  .toolbar {
    margin-top: 20px;
  }
}
</style>
