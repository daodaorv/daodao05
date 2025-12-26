<template>
  <div class="purchase-models-container">
    <!-- 搜索表单 -->
    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 数据表格 -->
    <DataTable
      :data="modelsList"
      :columns="tableColumns"
      :loading="loading"
      :pagination="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <!-- 车型图片 -->
      <template #image="{ row }">
        <el-image
          :src="row.image"
          :preview-src-list="[row.image]"
          fit="cover"
          style="width: 80px; height: 60px; border-radius: 4px"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
      </template>

      <!-- 车辆价格 -->
      <template #vehiclePrice="{ row }">
        <span class="price-text">¥{{ (row.purchaseHostingConfig?.guaranteedMonthlyIncome * 200 || 0).toLocaleString() }}</span>
      </template>

      <!-- 首付比例 -->
      <template #downPaymentRatio="{ row }">
        <span>{{ row.purchaseHostingConfig?.minDownPaymentRatio || 0 }}%</span>
      </template>

      <!-- 贷款期限 -->
      <template #loanTerm="{ row }">
        <span>{{ row.purchaseHostingConfig?.maxLoanTerm || 0 }}个月</span>
      </template>

      <!-- 保底月收益 -->
      <template #guaranteedIncome="{ row }">
        <span class="income-text">¥{{ row.purchaseHostingConfig?.guaranteedMonthlyIncome?.toLocaleString() || 0 }}/月</span>
      </template>

      <!-- 年化收益率 -->
      <template #annualReturn="{ row }">
        <span class="return-text">{{ row.purchaseHostingConfig?.estimatedAnnualReturn || 0 }}%</span>
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleEdit(row)">
          编辑配置
        </el-button>
        <el-button link type="success" size="small" @click="handleViewApplications(row)">
          查看申请
        </el-button>
      </template>
    </DataTable>

    <!-- 编辑配置对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑购车托管配置"
      width="600px"
      @close="handleEditDialogClose"
    >
      <el-form :model="editForm" label-width="140px">
        <el-form-item label="车型名称">
          <el-input v-model="editForm.modelName" disabled />
        </el-form-item>
        <el-form-item label="最低首付比例">
          <el-input-number
            v-model="editForm.minDownPaymentRatio"
            :min="20"
            :max="50"
            :step="5"
          />
          <span style="margin-left: 10px">%</span>
        </el-form-item>
        <el-form-item label="最长贷款期限">
          <el-input-number
            v-model="editForm.maxLoanTerm"
            :min="12"
            :max="60"
            :step="12"
          />
          <span style="margin-left: 10px">个月</span>
        </el-form-item>
        <el-form-item label="保底月收益">
          <el-input-number
            v-model="editForm.guaranteedMonthlyIncome"
            :min="1000"
            :max="20000"
            :step="500"
          />
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item label="预估年化收益率">
          <el-input-number
            v-model="editForm.estimatedAnnualReturn"
            :min="5"
            :max="15"
            :step="0.5"
            :precision="1"
          />
          <span style="margin-left: 10px">%</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveConfig">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import { mockVehicleModels } from '@/mock/vehicles'
import { useErrorHandler } from '@/composables'

const { handleApiError } = useErrorHandler()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  brandId: undefined,
})

// 搜索字段配置
const searchFields = computed(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '车型名称',
    width: '200px',
  },
])

// 数据列表
const modelsList = ref([])
const loading = ref(false)

// 分页
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 10,
})

// 表格列配置
const tableColumns = [
  { prop: 'image', label: '车型图片', width: 120, slot: true },
  { prop: 'modelName', label: '车型名称', width: 200 },
  { prop: 'brandName', label: '品牌', width: 120 },
  { prop: 'vehiclePrice', label: '参考价格', width: 140, slot: true },
  { prop: 'downPaymentRatio', label: '最低首付', width: 100, slot: true },
  { prop: 'loanTerm', label: '最长期限', width: 100, slot: true },
  { prop: 'guaranteedIncome', label: '保底月收益', width: 140, slot: true },
  { prop: 'annualReturn', label: '年化收益率', width: 120, slot: true },
  { prop: 'actions', label: '操作', width: 200, slot: true, fixed: 'right' },
]

// 编辑对话框
const editDialogVisible = ref(false)
const editForm = reactive({
  id: 0,
  modelName: '',
  minDownPaymentRatio: 30,
  maxLoanTerm: 60,
  guaranteedMonthlyIncome: 5000,
  estimatedAnnualReturn: 8.0,
})

// 加载车型列表
const loadModelsList = async () => {
  loading.value = true
  try {
    // 筛选支持购车托管的车型
    let filteredModels = mockVehicleModels.filter(
      (model) => model.supportPurchaseHosting === true
    )

    // 搜索过滤
    if (searchForm.keyword) {
      filteredModels = filteredModels.filter(
        (model) =>
          model.modelName.includes(searchForm.keyword) ||
          model.brandName.includes(searchForm.keyword)
      )
    }

    // 分页
    const start = (pagination.page - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    modelsList.value = filteredModels.slice(start, end)
    pagination.total = filteredModels.length
  } catch (error) {
    handleApiError(error, '加载车型列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadModelsList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.brandId = undefined
  pagination.page = 1
  loadModelsList()
}

// 编辑配置
const handleEdit = (row: any) => {
  editForm.id = row.id
  editForm.modelName = row.modelName
  if (row.purchaseHostingConfig) {
    editForm.minDownPaymentRatio = row.purchaseHostingConfig.minDownPaymentRatio
    editForm.maxLoanTerm = row.purchaseHostingConfig.maxLoanTerm
    editForm.guaranteedMonthlyIncome = row.purchaseHostingConfig.guaranteedMonthlyIncome
    editForm.estimatedAnnualReturn = row.purchaseHostingConfig.estimatedAnnualReturn
  }
  editDialogVisible.value = true
}

// 保存配置
const handleSaveConfig = () => {
  ElMessage.success('配置已保存')
  editDialogVisible.value = false
  loadModelsList()
}

// 关闭对话框
const handleEditDialogClose = () => {
  editForm.id = 0
  editForm.modelName = ''
  editForm.minDownPaymentRatio = 30
  editForm.maxLoanTerm = 60
  editForm.guaranteedMonthlyIncome = 5000
  editForm.estimatedAnnualReturn = 8.0
}

// 查看申请
const handleViewApplications = (row: any) => {
  ElMessage.info(`查看车型"${row.modelName}"的购车托管申请`)
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadModelsList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadModelsList()
}

onMounted(() => {
  loadModelsList()
})
</script>

<style scoped lang="scss">
.purchase-models-container {
  padding: 20px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 24px;
}

.price-text {
  color: #f56c6c;
  font-weight: bold;
  font-size: 14px;
}

.income-text {
  color: #67c23a;
  font-weight: bold;
  font-size: 14px;
}

.return-text {
  color: #409eff;
  font-weight: bold;
  font-size: 14px;
}
</style>
