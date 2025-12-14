<template>
  <div class="price-calculation-demo">
    <PageHeader
      title="价格计算演示"
      description="多因子动态定价系统 - 完整计算流程演示"
    />

    <el-alert
      title="计算公式"
      type="info"
      :closable="false"
      style="margin-bottom: 20px"
    >
      <div style="font-size: 14px; font-weight: bold">
        最终日租价 = 车型基础价 + 所有生效因子的金额
      </div>
      <div style="margin-top: 10px; font-size: 12px; color: #666">
        <div>• 城市因子：同一城市只生效优先级最高的因子</div>
        <div>• 时间因子：同一天只生效优先级最高的因子（法定节假日优先级90）</div>
        <div>• 其他因子：所有命中的因子都生效，金额累加</div>
        <div>• 保底价规则：最终价格不低于基础价的20%</div>
        <div>• 折扣限制：百分比因子累计折扣不超过80%</div>
      </div>
    </el-alert>

    <!-- 计算参数表单 -->
    <el-card style="margin-bottom: 20px">
      <template #header>
        <span>计算参数</span>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="选择车型" prop="modelId">
              <el-select
                v-model="formData.modelId"
                placeholder="请选择车型"
                style="width: 100%"
                @change="handleModelChange"
              >
                <el-option
                  v-for="model in vehicleModels"
                  :key="model.id"
                  :label="`${model.modelName} (¥${model.dailyPrice}/天)`"
                  :value="model.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="选择城市" prop="cityId">
              <el-select
                v-model="formData.cityId"
                placeholder="请选择城市"
                style="width: 100%"
                @change="handleCityChange"
              >
                <el-option
                  v-for="city in cities"
                  :key="city.id"
                  :label="`${city.name} (${city.tierName})`"
                  :value="city.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="租期" prop="dateRange">
              <el-date-picker
                v-model="formData.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" @click="handleCalculate" :loading="calculating">
                计算价格
              </el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 计算结果 -->
    <el-card v-if="calculationResult" style="margin-bottom: 20px">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span>计算结果</span>
          <el-tag type="success" size="large">
            订单总价：¥{{ calculationResult.totalPrice }}
          </el-tag>
        </div>
      </template>

      <!-- 基础信息 -->
      <el-descriptions :column="3" border style="margin-bottom: 20px">
        <el-descriptions-item label="车型">
          {{ calculationResult.modelName }}
        </el-descriptions-item>
        <el-descriptions-item label="城市">
          {{ calculationResult.cityName }}
        </el-descriptions-item>
        <el-descriptions-item label="租期">
          {{ calculationResult.rentalDays }}天
        </el-descriptions-item>
        <el-descriptions-item label="基础价">
          ¥{{ calculationResult.basePrice }}/天
        </el-descriptions-item>
        <el-descriptions-item label="平均日租金">
          <span style="color: #67c23a; font-weight: bold">
            ¥{{ calculationResult.averageDailyRental }}/天
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="订单总价">
          <span style="color: #f56c6c; font-weight: bold; font-size: 18px">
            ¥{{ calculationResult.totalPrice }}
          </span>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 因子详情 -->
      <el-divider>生效因子</el-divider>

      <el-row :gutter="20" style="margin-bottom: 20px">
        <!-- 城市因子 -->
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div style="display: flex; align-items: center">
                <el-icon style="margin-right: 5px"><Location /></el-icon>
                <span>城市因子</span>
              </div>
            </template>
            <div v-if="calculationResult.cityFactor">
              <div style="margin-bottom: 10px">
                <el-tag type="primary">{{ calculationResult.cityFactor.factorName }}</el-tag>
              </div>
              <div style="font-size: 12px; color: #666">
                <div>优先级：{{ calculationResult.cityFactor.priority }}</div>
                <div>
                  调整方式：{{ calculationResult.cityFactor.adjustmentType === 'percentage' ? '百分比' : '固定金额' }}
                </div>
                <div>
                  配置值：{{ calculationResult.cityFactor.adjustmentType === 'percentage'
                    ? `${calculationResult.cityFactor.configValue}%`
                    : `¥${calculationResult.cityFactor.configValue}` }}
                </div>
                <div style="margin-top: 10px; font-size: 16px; font-weight: bold; color: #67c23a">
                  {{ calculationResult.cityFactor.calculatedAmount >= 0 ? '+' : '' }}¥{{ calculationResult.cityFactor.calculatedAmount }}/天
                </div>
              </div>
            </div>
            <div v-else style="color: #999; text-align: center">
              无生效因子
            </div>
          </el-card>
        </el-col>

        <!-- 时间因子 -->
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div style="display: flex; align-items: center">
                <el-icon style="margin-right: 5px"><Calendar /></el-icon>
                <span>时间因子（平均）</span>
              </div>
            </template>
            <div v-if="calculationResult.timeFactorSummary.averageAmount !== 0">
              <div style="font-size: 12px; color: #666">
                <div>租期内有 {{ timeFactorDays }} 天生效时间因子</div>
                <div style="margin-top: 10px; font-size: 16px; font-weight: bold; color: #e6a23c">
                  {{ calculationResult.timeFactorSummary.averageAmount >= 0 ? '+' : '' }}¥{{ calculationResult.timeFactorSummary.averageAmount }}/天
                </div>
              </div>
            </div>
            <div v-else style="color: #999; text-align: center">
              无生效因子
            </div>
          </el-card>
        </el-col>

        <!-- 其他因子 -->
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div style="display: flex; align-items: center">
                <el-icon style="margin-right: 5px"><Star /></el-icon>
                <span>其他因子</span>
              </div>
            </template>
            <div v-if="calculationResult.otherFactors.length > 0">
              <div v-for="factor in calculationResult.otherFactors" :key="factor.factorId" style="margin-bottom: 10px">
                <el-tag size="small">{{ factor.factorName }}</el-tag>
                <div style="font-size: 14px; font-weight: bold; color: #409eff; margin-top: 5px">
                  {{ factor.calculatedAmount >= 0 ? '+' : '' }}¥{{ factor.calculatedAmount }}/天
                </div>
              </div>
            </div>
            <div v-else style="color: #999; text-align: center">
              无生效因子
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 计算说明 -->
      <el-divider>计算说明</el-divider>
      <el-alert
        type="success"
        :closable="false"
        style="white-space: pre-line"
      >
        {{ calculationResult.calculationExplanation }}
      </el-alert>

      <!-- 每日价格明细 -->
      <el-divider>每日价格明细</el-divider>
      <el-table
        :data="calculationResult.timeFactorSummary.dailyDetails"
        border
        stripe
        max-height="400"
      >
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="basePrice" label="基础价" width="100">
          <template #default="{ row }">
            ¥{{ row.basePrice }}
          </template>
        </el-table-column>
        <el-table-column label="城市因子" width="120">
          <template #default="{ row }">
            <span v-if="row.cityFactor">
              {{ row.cityFactor.calculatedAmount >= 0 ? '+' : '' }}¥{{ row.cityFactor.calculatedAmount }}
            </span>
            <span v-else style="color: #999">-</span>
          </template>
        </el-table-column>
        <el-table-column label="时间因子" width="150">
          <template #default="{ row }">
            <div v-if="row.timeFactor">
              <el-tag size="small" type="danger">{{ row.timeFactor.factorName }}</el-tag>
              <div style="margin-top: 5px">
                {{ row.timeFactor.calculatedAmount >= 0 ? '+' : '' }}¥{{ row.timeFactor.calculatedAmount }}
              </div>
            </div>
            <span v-else style="color: #999">-</span>
          </template>
        </el-table-column>
        <el-table-column label="其他因子" width="120">
          <template #default="{ row }">
            <span v-if="row.otherFactors.length > 0">
              {{ row.otherFactors.reduce((sum, f) => sum + f.calculatedAmount, 0) >= 0 ? '+' : '' }}¥{{ row.otherFactors.reduce((sum, f) => sum + f.calculatedAmount, 0) }}
            </span>
            <span v-else style="color: #999">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="dailyRental" label="当日租金" width="120">
          <template #default="{ row }">
            <span style="color: #67c23a; font-weight: bold">
              ¥{{ row.dailyRental }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Location, Calendar, Star } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { getVehicleModels } from '@/api/vehicle'
import { getCityList, getCityTierList, getCityFactorList } from '@/api/cityFactor'
import { getNationalHolidayList, getCustomTimeRuleList } from '@/api/timeFactor'
import {
  calculateMultiFactorPrice,
  validatePriceCalculationRequest,
  type PriceCalculationRequest,
  type PriceCalculationResult
} from '@/utils/pricingHelper'
import type { VehicleModel } from '@/mock/vehicles'
import type { City, CityTier, CityFactor } from '@/types/cityFactor'
import type { NationalHoliday, CustomTimeRule } from '@/types/timeFactor'

// 表单数据
const formRef = ref<FormInstance>()
const formData = reactive({
  modelId: null as number | null,
  cityId: null as number | null,
  dateRange: [] as string[]
})

const formRules: FormRules = {
  modelId: [{ required: true, message: '请选择车型', trigger: 'change' }],
  cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
  dateRange: [{ required: true, message: '请选择租期', trigger: 'change' }]
}

// 数据源
const vehicleModels = ref<VehicleModel[]>([])
const cities = ref<City[]>([])
const cityTiers = ref<CityTier[]>([])
const cityFactors = ref<CityFactor[]>([])
const nationalHolidays = ref<NationalHoliday[]>([])
const customTimeRules = ref<CustomTimeRule[]>([])

// 选中的数据
const selectedModel = ref<VehicleModel | null>(null)
const selectedCity = ref<City | null>(null)

// 计算状态
const calculating = ref(false)
const calculationResult = ref<PriceCalculationResult | null>(null)

// 计算时间因子生效天数
const timeFactorDays = computed(() => {
  if (!calculationResult.value) return 0
  return calculationResult.value.timeFactorSummary.dailyDetails.filter(d => d.timeFactor).length
})

// 加载车型列表
const loadVehicleModels = async () => {
  try {
    const res = await getVehicleModels({ page: 1, pageSize: 100, status: 'active' })
    vehicleModels.value = res.data.list
  } catch (error) {
    console.error('加载车型列表失败', error)
  }
}

// 加载城市列表
const loadCities = async () => {
  try {
    const res = await getCityList({ page: 1, pageSize: 100 })
    cities.value = res.list
  } catch (error) {
    console.error('加载城市列表失败', error)
  }
}

// 加载城市分级
const loadCityTiers = async () => {
  try {
    const res = await getCityTierList({ page: 1, pageSize: 100, status: 'active' })
    cityTiers.value = res.list
  } catch (error) {
    console.error('加载城市分级失败', error)
  }
}

// 加载城市因子
const loadCityFactors = async () => {
  try {
    const res = await getCityFactorList({ page: 1, pageSize: 100, status: 'active' })
    cityFactors.value = res.list
  } catch (error) {
    console.error('加载城市因子失败', error)
  }
}

// 加载法定节假日
const loadNationalHolidays = async () => {
  try {
    const currentYear = new Date().getFullYear()
    const res = await getNationalHolidayList({
      page: 1,
      pageSize: 100,
      year: currentYear,
      status: 'active'
    })
    if (res.code === 0) {
      nationalHolidays.value = res.data.list
    }
  } catch (error) {
    console.error('加载法定节假日失败', error)
  }
}

// 加载自定义时间规则
const loadCustomTimeRules = async () => {
  try {
    const res = await getCustomTimeRuleList({
      page: 1,
      pageSize: 100,
      status: 'active'
    })
    if (res.code === 0) {
      customTimeRules.value = res.data.list
    }
  } catch (error) {
    console.error('加载自定义时间规则失败', error)
  }
}

// 车型变化
const handleModelChange = (modelId: number) => {
  selectedModel.value = vehicleModels.value.find(m => m.id === modelId) || null
}

// 城市变化
const handleCityChange = (cityId: number) => {
  selectedCity.value = cities.value.find(c => c.id === cityId) || null
}

// 生成日期范围内的所有日期
function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)

  const current = new Date(start)
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.setDate() + 1)
  }

  return dates
}

// 匹配时间因子到具体日期
function matchTimeFactorsToDate(date: string): Array<{
  id: number
  name: string
  date: string
  adjustmentType: 'percentage' | 'fixed'
  adjustmentValue: number
  priority: number
}> {
  const factors: Array<{
    id: number
    name: string
    date: string
    adjustmentType: 'percentage' | 'fixed'
    adjustmentValue: number
    priority: number
  }> = []

  // 匹配法定节假日
  for (const holiday of nationalHolidays.value) {
    if (date >= holiday.startDate && date <= holiday.endDate) {
      factors.push({
        id: holiday.id,
        name: holiday.holidayName,
        date,
        adjustmentType: holiday.adjustmentType,
        adjustmentValue: holiday.adjustmentValue,
        priority: 90 // 法定节假日固定优先级90
      })
    }
  }

  // 匹配自定义时间规则
  for (const rule of customTimeRules.value) {
    let matched = false

    if (rule.ruleType === 'date_range' && rule.dateRangeConfig) {
      if (date >= rule.dateRangeConfig.startDate && date <= rule.dateRangeConfig.endDate) {
        matched = true
      }
    } else if (rule.ruleType === 'specific_date' && rule.specificDateConfig) {
      if (rule.specificDateConfig.dates.includes(date)) {
        matched = true
      }
    } else if (rule.ruleType === 'periodic' && rule.periodicConfig) {
      // 简化处理：这里只处理日期范围内的周期性规则
      if (rule.periodicConfig.startDate && rule.periodicConfig.endDate) {
        if (date >= rule.periodicConfig.startDate && date <= rule.periodicConfig.endDate) {
          const dayOfWeek = new Date(date).getDay() || 7 // 0-6 转为 1-7
          if (rule.periodicConfig.periodicType === 'weekly' && rule.periodicConfig.weekdays?.includes(dayOfWeek)) {
            matched = true
          }
        }
      }
    }

    if (matched) {
      factors.push({
        id: rule.id,
        name: rule.ruleName,
        date,
        adjustmentType: rule.adjustmentType,
        adjustmentValue: rule.adjustmentValue,
        priority: rule.priority
      })
    }
  }

  return factors
}

// 计算价格
const handleCalculate = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    if (!selectedModel.value || !selectedCity.value) {
      ElMessage.warning('请选择车型和城市')
      return
    }

    calculating.value = true

    try {
      // 构建城市因子列表
      const cityFactorsList: Array<{
        id: number
        name: string
        adjustmentType: 'percentage' | 'fixed'
        adjustmentValue: number
        priority: number
      }> = []

      // 添加城市分级因子
      if (selectedCity.value.tierId) {
        const tier = cityTiers.value.find(t => t.id === selectedCity.value!.tierId)
        if (tier) {
          cityFactorsList.push({
            id: tier.id,
            name: tier.tierName,
            adjustmentType: tier.adjustmentType,
            adjustmentValue: tier.adjustmentValue,
            priority: tier.tierLevel // 使用分级等级作为优先级
          })
        }
      }

      // 添加自定义城市因子
      for (const factor of cityFactors.value) {
        if (factor.cityIds.includes(selectedCity.value.id)) {
          cityFactorsList.push({
            id: factor.id,
            name: factor.factorName,
            adjustmentType: factor.adjustmentType,
            adjustmentValue: factor.adjustmentValue,
            priority: factor.priority
          })
        }
      }

      // 构建时间因子列表（匹配到具体日期）
      const [startDate, endDate] = formData.dateRange
      const dateRange = generateDateRange(startDate, endDate)
      const timeFactorsList: Array<{
        id: number
        name: string
        date: string
        adjustmentType: 'percentage' | 'fixed'
        adjustmentValue: number
        priority: number
      }> = []

      for (const date of dateRange) {
        const factors = matchTimeFactorsToDate(date)
        timeFactorsList.push(...factors)
      }

      // 构建计算请求
      const request: PriceCalculationRequest = {
        modelId: selectedModel.value.id,
        modelName: selectedModel.value.modelName,
        basePrice: selectedModel.value.dailyPrice,
        cityId: selectedCity.value.id,
        cityName: selectedCity.value.name,
        startDate,
        endDate,
        cityFactors: cityFactorsList,
        timeFactors: timeFactorsList,
        otherFactors: [] // 暂无其他因子
      }

      // 验证请求
      const validation = validatePriceCalculationRequest(request)
      if (!validation.valid) {
        ElMessage.error(validation.message || '请求参数验证失败')
        return
      }

      // 执行计算
      const result = calculateMultiFactorPrice(request)
      calculationResult.value = result

      ElMessage.success('价格计算完成')
    } catch (error) {
      console.error('价格计算失败', error)
      ElMessage.error('价格计算失败')
    } finally {
      calculating.value = false
    }
  })
}

// 重置
const handleReset = () => {
  formRef.value?.resetFields()
  formData.modelId = null
  formData.cityId = null
  formData.dateRange = []
  selectedModel.value = null
  selectedCity.value = null
  calculationResult.value = null
}

// 初始化
onMounted(() => {
  loadVehicleModels()
  loadCities()
  loadCityTiers()
  loadCityFactors()
  loadNationalHolidays()
  loadCustomTimeRules()
})
</script>

<style scoped lang="scss">
.price-calculation-demo {
  padding: 20px;
}
</style>
