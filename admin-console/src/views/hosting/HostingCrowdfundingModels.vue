<!-- @ts-nocheck -->
<template>
  <div class="crowdfunding-models-container">
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
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      :selection="true"
      @selection-change="handleSelectionChange"
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

      <!-- 购置价格 -->
      <template #purchasePrice="{ row }">
        <span class="price-text">¥{{ (row.purchasePrice / 10000).toFixed(1) }}万</span>
      </template>

      <!-- 单份价格 -->
      <template #pricePerShare="{ row }">
        <span class="price-text">¥{{ calculatePricePerShare(row).toLocaleString() }}</span>
      </template>

      <!-- 预估月收益 -->
      <template #estimatedMonthlyIncome="{ row }">
        <span class="income-text">¥{{ row.estimatedMonthlyIncome.toLocaleString() }}</span>
      </template>

      <!-- 年化收益率 -->
      <template #annualReturn="{ row }">
        <span class="return-text">{{ calculateAnnualReturn(row) }}%</span>
      </template>

      <!-- 热门推荐 -->
      <template #isHotCrowdfunding="{ row }">
        <el-switch
          v-model="row.isHotCrowdfunding"
          @change="handleToggleHot(row)"
        />
      </template>

      <!-- 展示排序 -->
      <template #displayOrder="{ row }">
        <el-input-number
          v-model="row.crowdfundingDisplayOrder"
          :min="0"
          :max="999"
          size="small"
          controls-position="right"
          @change="handleUpdateOrder(row)"
        />
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleEdit(row)">
          编辑配置
        </el-button>
        <el-button link type="success" size="small" @click="handleViewProjects(row)">
          查看项目
        </el-button>
        <el-button link type="warning" size="small" @click="handleDisable(row)">
          禁用众筹
        </el-button>
      </template>
    </DataTable>

    <!-- 快速编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑众筹配置"
      width="700px"
      @close="handleEditDialogClose"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="120px"
      >
        <el-form-item label="车型名称">
          <el-input v-model="editForm.modelName" disabled />
        </el-form-item>

        <el-form-item label="购置价格" prop="purchasePrice">
          <el-input-number
            v-model="editForm.purchasePrice"
            :min="0"
            :step="10000"
            :precision="0"
            style="width: 100%"
          />
          <div class="form-tip">车辆购置价格(不含税费、上牌等附加费用)</div>
        </el-form-item>

        <el-form-item label="建议份额数" prop="suggestedShares">
          <el-input-number
            v-model="editForm.suggestedShares"
            :min="2"
            :max="20"
            style="width: 100%"
          />
          <div class="form-tip">
            单份价格: ¥{{ calculateEditPricePerShare.toLocaleString() }}
          </div>
        </el-form-item>

        <el-form-item label="预估月收益" prop="estimatedMonthlyIncome">
          <el-input-number
            v-model="editForm.estimatedMonthlyIncome"
            :min="0"
            :step="100"
            :precision="0"
            style="width: 100%"
          />
          <div class="form-tip">
            预估年化收益率: {{ calculateEditAnnualReturn }}%
          </div>
        </el-form-item>

        <el-form-item label="热门推荐">
          <el-switch v-model="editForm.isHotCrowdfunding" />
        </el-form-item>

        <el-form-item label="展示排序">
          <el-input-number
            v-model="editForm.crowdfundingDisplayOrder"
            :min="0"
            style="width: 100%"
          />
          <div class="form-tip">数值越大越靠前</div>
        </el-form-item>

        <el-form-item label="众筹描述">
          <el-input
            v-model="editForm.crowdfundingDescription"
            type="textarea"
            :rows="4"
            placeholder="针对众筹场景的车型介绍"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleEditSubmit">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Picture, Star, Upload } from '@element-plus/icons-vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, ToolbarButton } from '@/components/common/DataTable.vue'
import { useErrorHandler } from '@/composables'
import { createPlaceholderDataUrl } from '@/utils/placeholder'

// Composables
const router = useRouter()
const { handleApiError } = useErrorHandler()

const placeholder = (text: string) => createPlaceholderDataUrl(text, { width: 300, height: 200 })

// 搜索表单
const searchForm = reactive({
  keyword: '',
  isHot: null as boolean | null,
})

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    prop: 'keyword',
    label: '车型名称',
    type: 'input',
    placeholder: '请输入车型名称或品牌',
    width: '200px',
  },
  {
    prop: 'isHot',
    label: '热门推荐',
    type: 'select',
    placeholder: '全部',
    width: '150px',
    options: [
      { label: '热门', value: '1' },
      { label: '非热门', value: '0' },
    ],
  },
]

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'image', label: '车型图片', width: 120, slot: 'image' },
  { prop: 'modelName', label: '车型名称', width: 200 },
  { prop: 'brandName', label: '品牌', width: 120 },
  { prop: 'purchasePrice', label: '购置价格', width: 120, slot: 'purchasePrice' },
  { prop: 'suggestedShares', label: '建议份额', width: 100 },
  { prop: 'pricePerShare', label: '单份价格', width: 120, slot: 'pricePerShare' },
  { prop: 'estimatedMonthlyIncome', label: '预估月收益', width: 120, slot: 'estimatedMonthlyIncome' },
  { prop: 'annualReturn', label: '年化收益率', width: 120, slot: 'annualReturn' },
  { prop: 'isHotCrowdfunding', label: '热门推荐', width: 100, slot: 'isHotCrowdfunding' },
  { prop: 'displayOrder', label: '展示排序', width: 120, slot: 'displayOrder' },
  { prop: 'crowdfundingCount', label: '发起次数', width: 100 },
  { prop: 'successfulCrowdfundingCount', label: '成功次数', width: 100 },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '批量设为热门',
    type: 'warning',
    icon: Star,
    onClick: () => handleBatchSetHot(true),
  },
  {
    label: '批量取消热门',
    type: 'info',
    onClick: () => handleBatchSetHot(false),
  },
  {
    label: '导出数据',
    icon: Upload,
    onClick: () => handleExport(),
  },
]

// 车型列表
const modelsList = ref<any[]>([])
const selectedModels = ref<any[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 编辑对话框
const editDialogVisible = ref(false)
const editFormRef = ref<FormInstance>()
const submitLoading = ref(false)
const editForm = reactive({
  id: 0,
  modelName: '',
  purchasePrice: 0,
  suggestedShares: 10,
  estimatedMonthlyIncome: 0,
  isHotCrowdfunding: false,
  crowdfundingDisplayOrder: 0,
  crowdfundingDescription: '',
})

// 编辑表单验证规则
const editFormRules: FormRules = {
  purchasePrice: [
    { required: true, message: '请输入购置价格', trigger: 'blur' },
    { type: 'number', min: 1, message: '购置价格必须大于0', trigger: 'blur' },
  ],
  suggestedShares: [
    { required: true, message: '请输入建议份额数', trigger: 'blur' },
  ],
  estimatedMonthlyIncome: [
    { required: true, message: '请输入预估月收益', trigger: 'blur' },
    { type: 'number', min: 1, message: '预估月收益必须大于0', trigger: 'blur' },
  ],
}

// 计算单份价格
const calculatePricePerShare = (row: any) => {
  if (row.purchasePrice > 0 && row.suggestedShares > 0) {
    return Math.round(row.purchasePrice / row.suggestedShares)
  }
  return 0
}

// 计算年化收益率
const calculateAnnualReturn = (row: any) => {
  if (row.purchasePrice > 0 && row.estimatedMonthlyIncome > 0) {
    return ((row.estimatedMonthlyIncome * 12 / row.purchasePrice) * 100).toFixed(2)
  }
  return '0.00'
}

// 编辑表单计算属性
const calculateEditPricePerShare = computed(() => {
  if (editForm.purchasePrice > 0 && editForm.suggestedShares > 0) {
    return Math.round(editForm.purchasePrice / editForm.suggestedShares)
  }
  return 0
})

const calculateEditAnnualReturn = computed(() => {
  if (editForm.purchasePrice > 0 && editForm.estimatedMonthlyIncome > 0) {
    return ((editForm.estimatedMonthlyIncome * 12 / editForm.purchasePrice) * 100).toFixed(2)
  }
  return '0.00'
})

// 加载众筹车型列表
const loadCrowdfundingModels = async () => {
  loading.value = true
  try {
    // Mock数据 - 实际应该调用API
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟数据
    const mockData = [
      {
        id: 1,
        modelName: '上汽大通RG10 生活家V90',
        brandName: '上汽大通',
        image: placeholder('上汽大通RG10'),
        purchasePrice: 500000,
        suggestedShares: 10,
        estimatedMonthlyIncome: 8500,
        isHotCrowdfunding: true,
        crowdfundingDisplayOrder: 100,
        crowdfundingCount: 5,
        successfulCrowdfundingCount: 4,
        crowdfundingDescription: '专为川西环线打造的高端房车',
      },
      {
        id: 2,
        modelName: '依维柯欧胜C型房车',
        brandName: '依维柯',
        image: placeholder('依维柯欧胜C型'),
        purchasePrice: 450000,
        suggestedShares: 10,
        estimatedMonthlyIncome: 7500,
        isHotCrowdfunding: true,
        crowdfundingDisplayOrder: 90,
        crowdfundingCount: 3,
        successfulCrowdfundingCount: 3,
        crowdfundingDescription: '经典C型房车，性价比高',
      },
      {
        id: 3,
        modelName: '福特全顺B型房车',
        brandName: '福特',
        image: placeholder('福特全顺B型'),
        purchasePrice: 380000,
        suggestedShares: 10,
        estimatedMonthlyIncome: 6500,
        isHotCrowdfunding: false,
        crowdfundingDisplayOrder: 50,
        crowdfundingCount: 2,
        successfulCrowdfundingCount: 2,
        crowdfundingDescription: '紧凑型B型房车，适合城市出行',
      },
    ]

    modelsList.value = mockData
    pagination.total = mockData.length
  } catch (error) {
    handleApiError(error, '加载众筹车型列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadCrowdfundingModels()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.isHot = null
  pagination.page = 1
  loadCrowdfundingModels()
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedModels.value = selection
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadCrowdfundingModels()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadCrowdfundingModels()
}

// 编辑配置
const handleEdit = (row: any) => {
  editForm.id = row.id
  editForm.modelName = row.modelName
  editForm.purchasePrice = row.purchasePrice
  editForm.suggestedShares = row.suggestedShares
  editForm.estimatedMonthlyIncome = row.estimatedMonthlyIncome
  editForm.isHotCrowdfunding = row.isHotCrowdfunding
  editForm.crowdfundingDisplayOrder = row.crowdfundingDisplayOrder
  editForm.crowdfundingDescription = row.crowdfundingDescription || ''
  editDialogVisible.value = true
}

// 提交编辑
const handleEditSubmit = async () => {
  if (!editFormRef.value) return

  await editFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.warning('请完善表单信息')
      return
    }

    submitLoading.value = true
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // 更新列表中的数据
      const index = modelsList.value.findIndex(m => m.id === editForm.id)
      if (index !== -1) {
        modelsList.value[index] = {
          ...modelsList.value[index],
          purchasePrice: editForm.purchasePrice,
          suggestedShares: editForm.suggestedShares,
          estimatedMonthlyIncome: editForm.estimatedMonthlyIncome,
          isHotCrowdfunding: editForm.isHotCrowdfunding,
          crowdfundingDisplayOrder: editForm.crowdfundingDisplayOrder,
          crowdfundingDescription: editForm.crowdfundingDescription,
        }
      }

      ElMessage.success('保存成功')
      editDialogVisible.value = false
    } catch (error) {
      handleApiError(error, '保存失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 关闭编辑对话框
const handleEditDialogClose = () => {
  editFormRef.value?.resetFields()
}

// 切换热门推荐
const handleToggleHot = async (row: any) => {
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 300))
    ElMessage.success(row.isHotCrowdfunding ? '已设为热门' : '已取消热门')
  } catch (error) {
    // 恢复原状态
    row.isHotCrowdfunding = !row.isHotCrowdfunding
    handleApiError(error, '操作失败')
  }
}

// 更新排序
const handleUpdateOrder = async (_row: any) => {
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 300))
    ElMessage.success('排序已更新')
  } catch (error) {
    handleApiError(error, '更新失败')
  }
}

// 批量设置热门
const handleBatchSetHot = async (isHot: boolean) => {
  if (selectedModels.value.length === 0) {
    ElMessage.warning('请先选择车型')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要将选中的 ${selectedModels.value.length} 个车型${isHot ? '设为' : '取消'}热门吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // 更新选中项的状态
    selectedModels.value.forEach(model => {
      const index = modelsList.value.findIndex(m => m.id === model.id)
      if (index !== -1) {
        modelsList.value[index].isHotCrowdfunding = isHot
      }
    })

    ElMessage.success(`已${isHot ? '设为' : '取消'}热门`)
    selectedModels.value = []
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '操作失败')
    }
  }
}

// 查看众筹项目
const handleViewProjects = (row: any) => {
  router.push({
    name: 'HostingCrowdfundingProjects',
    query: { modelId: row.id },
  })
}

// 禁用众筹
const handleDisable = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要禁用车型 "${row.modelName}" 的众筹功能吗？禁用后该车型将不再出现在小程序众筹列表中。`,
      '禁用确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // 从列表中移除
    const index = modelsList.value.findIndex(m => m.id === row.id)
    if (index !== -1) {
      modelsList.value.splice(index, 1)
      pagination.total--
    }

    ElMessage.success('已禁用众筹')
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '禁用失败')
    }
  }
}

// 导出数据
const handleExport = () => {
  if (modelsList.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  ElMessage.info('导出功能开发中')
}

// 页面加载
onMounted(() => {
  loadCrowdfundingModels()
})
</script>

<style scoped lang="scss">
.crowdfunding-models-container {
  padding: 20px;

  .image-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 60px;
    background-color: #f5f7fa;
    color: #909399;
    font-size: 24px;
  }

  .price-text {
    color: #f56c6c;
    font-weight: 600;
  }

  .income-text {
    color: #67c23a;
    font-weight: 600;
  }

  .return-text {
    color: #409eff;
    font-weight: 600;
  }

  .form-tip {
    margin-top: 4px;
    font-size: 12px;
    color: #909399;
    line-height: 1.4;
  }
}
</style>
