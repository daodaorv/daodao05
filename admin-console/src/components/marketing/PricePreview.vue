<template>
  <div class="price-preview">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>价格预览计算器</span>
        </div>
      </template>

      <!-- 输入表单 -->
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="车型" prop="vehicleModelId">
              <el-select
                v-model="formData.vehicleModelId"
                placeholder="请选择车型"
                style="width: 100%"
              >
                <el-option label="RV80豪华版" :value="1" />
                <el-option label="经济型B房车" :value="2" />
                <el-option label="特价C型房车" :value="3" />
                <el-option label="大型拖挂房车" :value="4" />
                <el-option label="商务B型房车" :value="5" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="城市" prop="cityId">
              <el-select
                v-model="formData.cityId"
                placeholder="请选择城市"
                filterable
                style="width: 100%"
              >
                <el-option label="杭州市" :value="1" />
                <el-option label="上海市" :value="2" />
                <el-option label="北京市" :value="3" />
                <el-option label="成都市" :value="4" />
                <el-option label="深圳市" :value="5" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="租车日期" prop="startDate">
              <el-date-picker
                v-model="formData.startDate"
                type="date"
                placeholder="选择开始日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="还车日期" prop="endDate">
              <el-date-picker
                v-model="formData.endDate"
                type="date"
                placeholder="选择结束日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="handleCalculate" :loading="calculating">
            计算价格
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 计算结果 -->
    <el-card v-if="result" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>计算结果</span>
        </div>
      </template>

      <!-- 价格摘要 -->
      <el-descriptions :column="2" border style="margin-bottom: 20px">
        <el-descriptions-item label="车型">{{ result.vehicleModelName }}</el-descriptions-item>
        <el-descriptions-item label="城市">{{ result.cityName }}</el-descriptions-item>
        <el-descriptions-item label="租期">
          {{ result.startDate }} 至 {{ result.endDate }} ({{ result.rentalDays }}天)
        </el-descriptions-item>
        <el-descriptions-item label="每日租金">
          <span style="color: #f56c6c; font-size: 20px; font-weight: bold">
            ¥{{ result.dailyRentalPrice.toFixed(2) }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="订单总价" :span="2">
          <span style="color: #67c23a; font-size: 24px; font-weight: bold">
            ¥{{ result.totalPrice }}
          </span>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 计算明细 -->
      <el-divider content-position="left">计算明细</el-divider>

      <!-- 车型基础价 -->
      <div class="detail-item">
        <div class="detail-label">车型基础价</div>
        <div class="detail-value">¥{{ result.basePrice }}</div>
      </div>

      <!-- 城市因子 -->
      <div class="detail-item">
        <div class="detail-label">城市因子</div>
        <div v-if="result.cityFactor" class="detail-value">
          <el-tag type="info">{{ result.cityFactor.factorName }}</el-tag>
          <span style="margin-left: 10px">
            {{ result.cityFactor.adjustmentType === 'percentage' ?
              `${result.cityFactor.configValue}%` :
              `¥${result.cityFactor.configValue}` }}
          </span>
          <span style="margin-left: 10px; color: #67c23a; font-weight: bold">
            {{ result.cityFactor.calculatedAmount >= 0 ? '+' : '' }}¥{{ result.cityFactor.calculatedAmount.toFixed(2) }}
          </span>
        </div>
        <div v-else class="detail-value" style="color: #999">无</div>
      </div>

      <!-- 时间因子 -->
      <div class="detail-item">
        <div class="detail-label">平均时间因子</div>
        <div class="detail-value">
          <span style="color: #67c23a; font-weight: bold">
            {{ result.avgTimeFactorAmount >= 0 ? '+' : '' }}¥{{ result.avgTimeFactorAmount.toFixed(2) }}
          </span>
        </div>
      </div>

      <!-- 每日时间因子详情 -->
      <el-collapse style="margin-top: 10px; margin-bottom: 20px">
        <el-collapse-item title="查看每日时间因子详情" name="1">
          <el-table :data="result.timeFactorDetails" border stripe style="width: 100%">
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column prop="dayOfWeek" label="星期" width="80">
              <template #default="{ row }">
                {{ ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][row.dayOfWeek] }}
              </template>
            </el-table-column>
            <el-table-column prop="factorName" label="因子名称" width="150">
              <template #default="{ row }">
                <el-tag v-if="row.factorName" type="warning">{{ row.factorName }}</el-tag>
                <span v-else style="color: #999">无</span>
              </template>
            </el-table-column>
            <el-table-column prop="configValue" label="配置值" width="120">
              <template #default="{ row }">
                <span v-if="row.factorName">
                  {{ row.adjustmentType === 'percentage' ?
                    `${row.configValue}%` :
                    `¥${row.configValue}` }}
                </span>
                <span v-else style="color: #999">-</span>
              </template>
            </el-table-column>
            <el-table-column prop="calculatedAmount" label="计算金额" width="120">
              <template #default="{ row }">
                <span style="color: #67c23a; font-weight: bold">
                  {{ row.calculatedAmount >= 0 ? '+' : '' }}¥{{ row.calculatedAmount.toFixed(2) }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>

      <!-- 其他因子 -->
      <div class="detail-item">
        <div class="detail-label">其他因子</div>
        <div v-if="result.otherFactors.length > 0" class="detail-value">
          <div v-for="(factor, index) in result.otherFactors" :key="index" style="margin-bottom: 5px">
            <el-tag type="success">{{ factor.factorName }}</el-tag>
            <span style="margin-left: 10px">
              {{ factor.adjustmentType === 'percentage' ?
                `${factor.configValue}%` :
                `¥${factor.configValue}` }}
            </span>
            <span style="margin-left: 10px; color: #67c23a; font-weight: bold">
              {{ factor.calculatedAmount >= 0 ? '+' : '' }}¥{{ factor.calculatedAmount.toFixed(2) }}
            </span>
          </div>
        </div>
        <div v-else class="detail-value" style="color: #999">无</div>
      </div>

      <!-- 应用的规则 -->
      <div v-if="result.appliedRules.length > 0" class="detail-item">
        <div class="detail-label">应用的规则</div>
        <div class="detail-value">
          <el-tag v-for="(rule, index) in result.appliedRules" :key="index" type="warning" style="margin-right: 5px">
            {{ rule }}
          </el-tag>
        </div>
      </div>

      <!-- 警告信息 -->
      <el-alert
        v-if="result.warnings.length > 0"
        title="警告信息"
        type="warning"
        :closable="false"
        style="margin-top: 20px"
      >
        <template #default>
          <div v-for="(warning, index) in result.warnings" :key="index">
            {{ warning }}
          </div>
        </template>
      </el-alert>

      <!-- 计算说明 -->
      <el-divider content-position="left">计算说明</el-divider>
      <pre class="explanation">{{ result.explanation }}</pre>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { calculatePrice } from '@/utils/newPricingEngine'
import type { PriceCalculationResult } from '@/utils/newPricingEngine'

// 表单数据
const formRef = ref<FormInstance>()
const formData = reactive({
  vehicleModelId: 0,
  cityId: 0,
  startDate: '',
  endDate: ''
})

const formRules: FormRules = {
  vehicleModelId: [{ required: true, message: '请选择车型', trigger: 'change' }],
  cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }]
}

// 计算结果
const calculating = ref(false)
const result = ref<PriceCalculationResult | null>(null)

// 计算价格
const handleCalculate = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      calculating.value = true
      try {
        const startDate = new Date(formData.startDate).toISOString().split('T')[0]
        const endDate = new Date(formData.endDate).toISOString().split('T')[0]

        const res = await calculatePrice({
          vehicleModelId: formData.vehicleModelId,
          cityId: formData.cityId,
          startDate,
          endDate
        })

        result.value = res
        ElMessage.success('计算成功')
      } catch (error: any) {
        ElMessage.error(error.message || '计算失败')
      } finally {
        calculating.value = false
      }
    }
  })
}

// 重置
const handleReset = () => {
  formRef.value?.resetFields()
  formData.vehicleModelId = 0
  formData.cityId = 0
  formData.startDate = ''
  formData.endDate = ''
  result.value = null
}
</script>

<style scoped lang="scss">
.price-preview {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #ebeef5;

    &:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-weight: bold;
      color: #606266;
    }

    .detail-value {
      color: #303133;
    }
  }

  .explanation {
    background-color: #f5f7fa;
    padding: 15px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
</style>
