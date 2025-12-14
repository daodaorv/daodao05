<template>
  <div class="city-tier-management">
    <el-alert
      title="城市分级说明"
      type="info"
      :closable="false"
      style="margin-bottom: 20px"
    >
      <template #default>
        <div>城市分级是预设的城市因子策略，系统会根据城市所属分级自动应用对应的价格调整</div>
        <div style="margin-top: 5px">优先级：一线城市 > 二线城市 > 三线城市 > 其他城市</div>
      </template>
    </el-alert>

    <!-- 城市分级列表 -->
    <el-table
      v-loading="loading"
      :data="tierList"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column prop="tierName" label="分级名称" width="150" />
      <el-table-column prop="tierCode" label="分级代码" width="120" />
      <el-table-column prop="priority" label="优先级" width="100">
        <template #default="{ row }">
          <el-tag :type="getPriorityType(row.priority)">{{ row.priority }}</el-tag>
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
      <el-table-column prop="cityCount" label="城市数量" width="100">
        <template #default="{ row }">
          <el-tag type="info">{{ row.cityCount }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag v-if="row.status === 'active'" type="success">启用</el-tag>
          <el-tag v-else type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" min-width="200" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button link type="primary" size="small" @click="handleViewCities(row)">
            查看城市
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑城市分级"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="分级名称">
          <el-input v-model="formData.tierName" disabled />
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

        <el-form-item label="变更原因" prop="changeReason">
          <el-input
            v-model="formData.changeReason"
            type="textarea"
            :rows="3"
            placeholder="请输入变更原因"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看城市对话框 -->
    <el-dialog
      v-model="citiesDialogVisible"
      :title="`${currentTier?.tierName} - 城市列表`"
      width="800px"
    >
      <el-table :data="tierCities" border stripe style="width: 100%">
        <el-table-column prop="cityName" label="城市名称" width="150" />
        <el-table-column prop="provinceName" label="所属省份" width="150" />
        <el-table-column prop="effectiveFactor" label="生效因子" min-width="200">
          <template #default="{ row }">
            <div v-if="row.effectiveFactor">
              <el-tag type="success">{{ row.effectiveFactor.factorName }}</el-tag>
              <span style="margin-left: 10px">
                {{ row.effectiveFactor.adjustmentType === 'percentage' ?
                  `${row.effectiveFactor.adjustmentValue}%` :
                  `¥${row.effectiveFactor.adjustmentValue}` }}
              </span>
            </div>
            <span v-else style="color: #999">无</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleChangeTier(row)">
              修改分级
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <el-button type="primary" @click="citiesDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 修改城市分级对话框 -->
    <el-dialog
      v-model="changeTierDialogVisible"
      title="修改城市分级"
      width="500px"
    >
      <div v-if="currentCity" style="margin-bottom: 20px">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="城市名称">{{ currentCity.name }}</el-descriptions-item>
          <el-descriptions-item label="所属省份">{{ currentCity.provinceName }}</el-descriptions-item>
          <el-descriptions-item label="当前分级">{{ currentCity.tierName }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <el-form label-width="100px">
        <el-form-item label="新分级">
          <el-select v-model="newTierId" placeholder="请选择新的城市分级" style="width: 100%">
            <el-option
              v-for="tier in tierList"
              :key="tier.id"
              :label="tier.tierName"
              :value="tier.id"
              :disabled="tier.id === currentCity?.tierId"
            >
              <span>{{ tier.tierName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ tier.adjustmentType === 'percentage' ?
                  `${tier.adjustmentValue}%` :
                  `¥${tier.adjustmentValue}` }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="changeTierDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmChangeTier">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import {
  getCityTierList,
  updateCityTier,
  getCityList
} from '@/api/cityFactor'
import type { CityTier, City } from '@/types/cityFactor'

// 分级列表
const loading = ref(false)
const tierList = ref<CityTier[]>([])

// 编辑对话框
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive({
  id: 0,
  tierName: '',
  adjustmentType: 'percentage' as 'percentage' | 'fixed',
  adjustmentValue: 0,
  changeReason: '',
  status: 'active' as 'active' | 'inactive'
})

const formRules: FormRules = {
  adjustmentType: [{ required: true, message: '请选择调整方式', trigger: 'change' }],
  adjustmentValue: [{ required: true, message: '请输入调整值', trigger: 'blur' }],
  changeReason: [
    { required: true, message: '请输入变更原因', trigger: 'blur' },
    { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 查看城市对话框
const citiesDialogVisible = ref(false)
const currentTier = ref<CityTier | null>(null)
const tierCities = ref<City[]>([])

// 获取优先级标签类型
const getPriorityType = (priority: number) => {
  if (priority >= 10) return 'danger'
  if (priority >= 5) return 'warning'
  return 'info'
}

// 加载分级列表
const loadTierList = async () => {
  loading.value = true
  try {
    const res = await getCityTierList()
    if (res.code === 0) {
      tierList.value = res.data.list
    }
  } catch (error) {
    ElMessage.error('加载分级列表失败')
  } finally {
    loading.value = false
  }
}

// 编辑
const handleEdit = (row: CityTier) => {
  formData.id = row.id
  formData.tierName = row.tierName
  formData.adjustmentType = row.adjustmentType
  formData.adjustmentValue = row.adjustmentValue
  formData.changeReason = ''
  formData.status = row.status
  dialogVisible.value = true
}

// 查看城市
const handleViewCities = async (row: CityTier) => {
  currentTier.value = row
  try {
    const res = await getCityList({
      page: 1,
      pageSize: 1000,
      tier: row.tierCode
    })
    if (res.code === 0) {
      tierCities.value = res.data.list
      citiesDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('加载城市列表失败')
  }
}

// 修改城市分级对话框
const changeTierDialogVisible = ref(false)
const currentCity = ref<City | null>(null)
const newTierId = ref<number | null>(null)

// 修改城市分级
const handleChangeTier = (row: City) => {
  currentCity.value = row
  newTierId.value = null
  changeTierDialogVisible.value = true
}

// 确认修改城市分级
const handleConfirmChangeTier = async () => {
  if (!newTierId.value || !currentCity.value) {
    ElMessage.warning('请选择新的城市分级')
    return
  }

  try {
    // 这里应该调用修改城市分级的API
    // await updateCityTier(currentCity.value.id, newTierId.value)
    ElMessage.success('修改成功')
    changeTierDialogVisible.value = false
    // 重新加载城市列表
    if (currentTier.value) {
      handleViewCities(currentTier.value)
    }
  } catch (error) {
    ElMessage.error('修改失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await updateCityTier({
          id: formData.id,
          adjustmentType: formData.adjustmentType,
          adjustmentValue: formData.adjustmentValue,
          changeReason: formData.changeReason
        })
        if (res.code === 0) {
          ElMessage.success('更新成功')
          dialogVisible.value = false
          loadTierList()
        }
      } catch (error) {
        ElMessage.error('更新失败')
      }
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 初始化
onMounted(() => {
  loadTierList()
})
</script>

<style scoped lang="scss">
.city-tier-management {
  // 样式
}
</style>
