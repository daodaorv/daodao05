<!-- @ts-nocheck -->
<template>
  <div class="vehicle-models-container">
    <PageHeader title="车型库管理" description="管理车辆品牌、型号和配置参数" />

    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <DataTable
      :data="modelsList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :pagination="pagination"
      :actions-width="250"
      :selection="true"
      @selection-change="handleSelectionChange"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
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

      <template #vehicleType="{ row }">
        <el-tag :type="(getVehicleTypeTag(row.vehicleType)) as any" size="small">
          {{ getVehicleTypeLabel(row.vehicleType) }}
        </el-tag>
      </template>

      <template #seats="{ row }">
        {{ row.seats }}人
      </template>

      <template #beds="{ row }">
        {{ row.beds }}个
      </template>

      <template #dailyPrice="{ row }">
        ¥{{ row.dailyPrice }}
      </template>

      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
          {{ row.status === 'active' ? '启用' : '禁用' }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleView(row)">
          查看
        </el-button>
        <el-button link type="primary" size="small" @click="handleEdit(row)">
          编辑
        </el-button>
        <el-button link type="primary" size="small" @click="handleAdjustPrice(row)">
          调整价格
        </el-button>
        <el-button link type="success" size="small" @click="handleViewPriceCalendar(row)">
          价格日历
        </el-button>
        <el-button link type="info" size="small" @click="handleViewHistory(row)">
          价格历史
        </el-button>
        <el-button
          v-if="row.priceGroupId"
          link
          type="warning"
          size="small"
          @click="handleLeaveGroup(row)"
        >
          脱离分组
        </el-button>
        <el-button
          link
          :type="row.status === 'active' ? 'warning' : 'success'"
          size="small"
          @click="handleStatusChange(row)"
        >
          {{ row.status === 'active' ? '禁用' : '启用' }}
        </el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">
          删除
        </el-button>
      </template>
    </DataTable>

    <!-- 新增/编辑车型对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
      >
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基础信息" name="basic">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="品牌" prop="brandId">
                  <el-select v-model="form.brandId" placeholder="请选择品牌" style="width: 100%">
                    <el-option
                      v-for="brand in brandsList"
                      :key="brand.id"
                      :label="brand.name"
                      :value="brand.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车型名称" prop="modelName">
                  <el-input v-model="form.modelName" placeholder="请输入车型名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="车辆类型" prop="vehicleType">
                  <el-select v-model="form.vehicleType" placeholder="请选择类型" style="width: 100%">
                    <el-option
                      v-for="option in VEHICLE_TYPE_OPTIONS"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="日租金" prop="dailyPrice">
                  <el-input-number
                    v-model="form.dailyPrice"
                    :min="0"
                    :step="100"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="车型图片" prop="image">
              <el-upload
                class="image-uploader"
                action="#"
                :show-file-list="false"
                :auto-upload="false"
              >
                <img v-if="form.image" :src="form.image" class="uploaded-image" />
                <el-icon v-else class="uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="车型描述" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="3"
                placeholder="请输入车型描述"
              />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="配置参数" name="config">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="核载人数" prop="seats">
                  <el-input-number
                    v-model="form.seats"
                    :min="1"
                    :max="20"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="床位数" prop="beds">
                  <el-input-number
                    v-model="form.beds"
                    :min="1"
                    :max="10"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="车长(米)" prop="length">
                  <el-input-number
                    v-model="form.length"
                    :min="0"
                    :step="0.1"
                    :precision="1"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车宽(米)" prop="width">
                  <el-input-number
                    v-model="form.width"
                    :min="0"
                    :step="0.1"
                    :precision="1"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="车高(米)" prop="height">
                  <el-input-number
                    v-model="form.height"
                    :min="0"
                    :step="0.1"
                    :precision="1"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="油箱容量(升)" prop="fuelCapacity">
                  <el-input-number
                    v-model="form.fuelCapacity"
                    :min="0"
                    :step="10"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="配置特点">
              <el-checkbox-group v-model="form.features">
                <el-checkbox label="空调">空调</el-checkbox>
                <el-checkbox label="冰箱">冰箱</el-checkbox>
                <el-checkbox label="微波炉">微波炉</el-checkbox>
                <el-checkbox label="卫生间">卫生间</el-checkbox>
                <el-checkbox label="淋浴">淋浴</el-checkbox>
                <el-checkbox label="太阳能">太阳能</el-checkbox>
                <el-checkbox label="发电机">发电机</el-checkbox>
                <el-checkbox label="倒车影像">倒车影像</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 调整价格对话框 -->
    <el-dialog
      v-model="priceDialogVisible"
      title="调整车型价格"
      width="600px"
      @close="handlePriceDialogClose"
    >
      <el-alert
        v-if="currentModel?.priceGroupId"
        title="提示"
        type="warning"
        :closable="false"
        style="margin-bottom: 20px"
      >
        该车型当前属于价格分组【{{ currentModel.priceGroupName }}】，调整价格后将脱离分组，使用独立价格
      </el-alert>

      <el-descriptions :column="2" border style="margin-bottom: 20px">
        <el-descriptions-item label="车型名称">
          {{ currentModel?.modelName }}
        </el-descriptions-item>
        <el-descriptions-item label="当前价格">
          <span class="price">¥{{ currentModel?.dailyPrice }}/天</span>
        </el-descriptions-item>
        <el-descriptions-item label="所属分组" :span="2">
          {{ currentModel?.priceGroupName || '无' }}
        </el-descriptions-item>
      </el-descriptions>

      <el-form
        ref="priceFormRef"
        :model="priceFormData"
        :rules="priceFormRules"
        label-width="120px"
      >
        <el-form-item label="新价格" prop="newPrice">
          <el-input-number
            v-model="priceFormData.newPrice"
            :min="0"
            :step="50"
            :precision="0"
            controls-position="right"
            style="width: 200px"
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
          <el-select
            v-model="priceFormData.changeReason"
            placeholder="请选择变更原因"
            style="width: 100%"
            allow-create
            filterable
          >
            <el-option label="市场调研" value="市场调研" />
            <el-option label="成本变化" value="成本变化" />
            <el-option label="季节调整" value="季节调整" />
            <el-option label="竞争策略" value="竞争策略" />
            <el-option label="促销活动" value="促销活动" />
          </el-select>
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
        <el-button type="primary" @click="handlePriceSubmit" :loading="submitLoading">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 批量调价对话框 -->
    <el-dialog
      v-model="batchPriceDialogVisible"
      title="批量调整车型价格"
      width="800px"
      @close="handleBatchPriceDialogClose"
    >
      <el-alert
        title="提示"
        type="info"
        :closable="false"
        style="margin-bottom: 20px"
      >
        已选择 {{ selectedModels.length }} 个车型，调整后属于分组的车型将脱离分组
      </el-alert>

      <el-form
        ref="batchPriceFormRef"
        :model="batchPriceFormData"
        :rules="batchPriceFormRules"
        label-width="120px"
      >
        <el-form-item label="调价方式" prop="adjustType">
          <el-radio-group v-model="batchPriceFormData.adjustType">
            <el-radio label="percentage">百分比调整</el-radio>
            <el-radio label="fixed">固定金额调整</el-radio>
            <el-radio label="unified">统一设置价格</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="调整值" prop="adjustValue">
          <el-input-number
            v-model="batchPriceFormData.adjustValue"
            :step="batchPriceFormData.adjustType === 'percentage' ? 5 : 50"
            :precision="batchPriceFormData.adjustType === 'percentage' ? 0 : 0"
            controls-position="right"
            style="width: 200px"
          />
          <span style="margin-left: 10px">
            {{ batchPriceFormData.adjustType === 'percentage' ? '%' : '元/天' }}
          </span>
          <span v-if="batchPriceFormData.adjustType !== 'unified'" style="margin-left: 10px; color: #909399">
            {{ batchPriceFormData.adjustType === 'percentage' ? '(正数涨价，负数降价)' : '(正数涨价，负数降价)' }}
          </span>
        </el-form-item>
        <el-form-item label="变更原因" prop="changeReason">
          <el-select
            v-model="batchPriceFormData.changeReason"
            placeholder="请选择变更原因"
            style="width: 100%"
            allow-create
            filterable
          >
            <el-option label="市场调研" value="市场调研" />
            <el-option label="成本变化" value="成本变化" />
            <el-option label="季节调整" value="季节调整" />
            <el-option label="竞争策略" value="竞争策略" />
            <el-option label="促销活动" value="促销活动" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="batchPriceFormData.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注信息（可选）"
          />
        </el-form-item>
      </el-form>

      <el-divider>价格预览</el-divider>

      <el-table :data="batchPricePreview" border max-height="300">
        <el-table-column prop="modelName" label="车型名称" width="200" />
        <el-table-column prop="oldPrice" label="当前价格" width="120">
          <template #default="{ row }">
            ¥{{ row.oldPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="newPrice" label="调整后价格" width="120">
          <template #default="{ row }">
            <span :class="row.change > 0 ? 'price-up' : row.change < 0 ? 'price-down' : ''">
              ¥{{ row.newPrice }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="change" label="价格变化" width="120">
          <template #default="{ row }">
            <span :class="row.change > 0 ? 'price-up' : row.change < 0 ? 'price-down' : ''">
              {{ row.change > 0 ? '+' : '' }}¥{{ row.change }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="changePercent" label="变化幅度" width="100">
          <template #default="{ row }">
            <span :class="row.change > 0 ? 'price-up' : row.change < 0 ? 'price-down' : ''">
              {{ row.changePercent > 0 ? '+' : '' }}{{ row.changePercent }}%
            </span>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <el-button @click="batchPriceDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBatchPriceSubmit" :loading="submitLoading">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 加入分组对话框 -->
    <el-dialog
      v-model="joinGroupDialogVisible"
      title="加入价格分组"
      width="700px"
      @close="handleJoinGroupDialogClose"
    >
      <el-alert
        title="提示"
        type="info"
        :closable="false"
        style="margin-bottom: 20px"
      >
        已选择 {{ selectedModels.length }} 个车型，加入分组后将自动继承分组价格
      </el-alert>

      <el-form
        ref="joinGroupFormRef"
        :model="joinGroupFormData"
        :rules="joinGroupFormRules"
        label-width="120px"
      >
        <el-form-item label="选择分组" prop="groupId">
          <el-select
            v-model="joinGroupFormData.groupId"
            placeholder="请选择价格分组"
            style="width: 100%"
            @change="handleGroupChange"
          >
            <el-option
              v-for="group in priceGroupsList"
              :key="group.id"
              :label="`${group.groupName} (¥${group.basePrice}/天)`"
              :value="group.id"
            >
              <div style="display: flex; justify-content: space-between">
                <span>{{ group.groupName }}</span>
                <span style="color: #f56c6c; font-weight: bold">¥{{ group.basePrice }}/天</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-divider>价格预览</el-divider>

      <el-table :data="joinGroupPreview" border max-height="300">
        <el-table-column prop="modelName" label="车型名称" width="200" />
        <el-table-column prop="oldPrice" label="当前价格" width="120">
          <template #default="{ row }">
            ¥{{ row.oldPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="newPrice" label="分组价格" width="120">
          <template #default="{ row }">
            <span :class="row.change > 0 ? 'price-up' : row.change < 0 ? 'price-down' : ''">
              ¥{{ row.newPrice }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="change" label="价格变化" width="120">
          <template #default="{ row }">
            <span :class="row.change > 0 ? 'price-up' : row.change < 0 ? 'price-down' : ''">
              {{ row.change > 0 ? '+' : '' }}¥{{ row.change }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.alreadyInGroup" type="warning" size="small">
              已在分组
            </el-tag>
            <el-tag v-else type="success" size="small">
              可加入
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <el-button @click="joinGroupDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleJoinGroupSubmit" :loading="submitLoading">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 价格历史对话框 -->
    <el-dialog
      v-model="historyDialogVisible"
      title="价格变更历史"
      width="900px"
      @close="handleHistoryDialogClose"
    >
      <el-descriptions :column="2" border style="margin-bottom: 20px">
        <el-descriptions-item label="车型名称">
          {{ currentModel?.modelName }}
        </el-descriptions-item>
        <el-descriptions-item label="当前价格">
          <span class="price">¥{{ currentModel?.dailyPrice }}/天</span>
        </el-descriptions-item>
        <el-descriptions-item label="所属分组" :span="2">
          {{ currentModel?.priceGroupName || '无' }}
        </el-descriptions-item>
      </el-descriptions>

      <el-table :data="priceHistoryList" border v-loading="historyLoading" max-height="400">
        <el-table-column prop="changedAt" label="变更时间" width="180" />
        <el-table-column prop="oldPrice" label="原价格" width="100">
          <template #default="{ row }">
            ¥{{ row.oldPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="newPrice" label="新价格" width="100">
          <template #default="{ row }">
            <span :class="row.newPrice > row.oldPrice ? 'price-up' : row.newPrice < row.oldPrice ? 'price-down' : ''">
              ¥{{ row.newPrice }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="change" label="价格变化" width="120">
          <template #default="{ row }">
            <span :class="row.newPrice > row.oldPrice ? 'price-up' : row.newPrice < row.oldPrice ? 'price-down' : ''">
              {{ row.newPrice > row.oldPrice ? '+' : '' }}¥{{ row.newPrice - row.oldPrice }}
              ({{ row.oldPrice > 0 ? (row.newPrice > row.oldPrice ? '+' : '') + Math.round(((row.newPrice - row.oldPrice) / row.oldPrice) * 100) : 0 }}%)
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="changeType" label="变更类型" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.changeType === 'manual'" type="primary" size="small">
              手动调整
            </el-tag>
            <el-tag v-else-if="row.changeType === 'group_sync'" type="success" size="small">
              分组同步
            </el-tag>
            <el-tag v-else-if="row.changeType === 'batch'" type="warning" size="small">
              批量调整
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="changeReason" label="变更原因" min-width="150" show-overflow-tooltip />
        <el-table-column prop="changedBy" label="操作人" width="100" />
      </el-table>

      <template #footer>
        <el-button @click="historyDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Plus,
  Download,
  Upload,
  Picture,
} from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import {
  getVehicleModels,
  createVehicleModel,
  updateVehicleModel,
  deleteVehicleModel,
  changeVehicleModelStatus,
  getBrands,
} from '@/api/vehicle'
import { updateModelPrice, batchUpdatePrice, joinPriceGroup, leaveGroup, getPriceGroups, getPriceHistory } from '@/api/vehicleModelPrice'
import type { VehicleModel } from '@/mock/vehicles'
import type { UpdateModelPriceRequest, BatchUpdatePriceRequest, JoinPriceGroupRequest, VehicleModelPriceGroup, VehicleModelPriceHistory } from '@/types/vehicleModel'
import { useErrorHandler, useEnumLabel } from '@/composables'
import { exportToCSV } from '@/utils/export'

// Composables
const { handleApiError } = useErrorHandler()
const { getVehicleTypeLabel } = useEnumLabel()

// 车辆类型选项
const VEHICLE_TYPE_OPTIONS = [
  { label: '自行式C型', value: 'c_type' },
  { label: '自行式B型', value: 'b_type' },
  { label: '拖挂式', value: 'trailer' },
]

// 品牌列表
interface Brand {
  id: number
  name: string
  logo: string
  status: string
}

const brandsList = ref<Brand[]>([])

// 搜索表单
const searchForm = reactive({
  brandId: null as number | null,
  keyword: '',
  vehicleType: '',
  status: '',
})

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    prop: 'brandId',
    label: '品牌',
    type: 'select',
    placeholder: '请选择品牌',
    width: '150px',
    options: [], // 动态加载
  },
  {
    prop: 'keyword',
    label: '车型名称',
    type: 'input',
    placeholder: '请输入车型名称',
    width: '200px',
  },
  {
    prop: 'vehicleType',
    label: '车辆类型',
    type: 'select',
    placeholder: '请选择类型',
    width: '150px',
    options: VEHICLE_TYPE_OPTIONS,
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    width: '150px',
    options: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' },
    ],
  },
]

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'image', label: '车型图片', width: 120, slot: 'image' },
  { prop: 'brandName', label: '品牌', width: 120 },
  { prop: 'modelName', label: '车型名称', width: 200 },
  { prop: 'vehicleType', label: '车辆类型', width: 120, slot: 'vehicleType' },
  { prop: 'seats', label: '核载人数', width: 100, slot: 'seats' },
  { prop: 'beds', label: '床位数', width: 100, slot: 'beds' },
  { prop: 'dailyPrice', label: '日租金', width: 120, slot: 'dailyPrice' },
  { prop: 'vehicleCount', label: '车辆数量', width: 100 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'createdAt', label: '创建时间', width: 180 },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '新增车型',
    type: 'primary',
    icon: Plus,
    onClick: () => handleCreate(),
  },
  {
    label: '批量调价',
    type: 'warning',
    onClick: handleBatchAdjustPrice,
    disabled: () => selectedModels.value.length === 0,
  },
  {
    label: '加入分组',
    onClick: handleJoinGroup,
    disabled: () => selectedModels.value.length === 0,
  },
  {
    label: '导出车型',
    icon: Download,
    onClick: handleExport,
  },
  {
    label: '导入车型',
    icon: Upload,
    onClick: () => ElMessage.info('导入功能开发中'),
  },
]

// 表格操作列配置 - 使用自定义插槽
const tableActions: TableAction[] = []

// 车型列表
const modelsList = ref<VehicleModel[]>([])
const selectedModels = ref<VehicleModel[]>([])

const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增车型')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const activeTab = ref('basic')

// 价格调整对话框
const priceDialogVisible = ref(false)
const currentModel = ref<VehicleModel | null>(null)
const priceFormRef = ref<FormInstance>()

const priceFormData = reactive<UpdateModelPriceRequest>({
  modelId: 0,
  newPrice: 0,
  changeReason: '',
  remark: '',
})

// 批量调价对话框
const batchPriceDialogVisible = ref(false)
const batchPriceFormRef = ref<FormInstance>()

const batchPriceFormData = reactive({
  adjustType: 'percentage' as 'percentage' | 'fixed' | 'unified',
  adjustValue: 0,
  changeReason: '',
  remark: '',
})

// 加入分组对话框
const joinGroupDialogVisible = ref(false)
const joinGroupFormRef = ref<FormInstance>()
const priceGroupsList = ref<VehicleModelPriceGroup[]>([])

const joinGroupFormData = reactive({
  groupId: null as number | null,
})

const joinGroupFormRules: FormRules = {
  groupId: [
    { required: true, message: '请选择价格分组', trigger: 'change' },
  ],
}

// 价格历史对话框
const historyDialogVisible = ref(false)
const priceHistoryList = ref<VehicleModelPriceHistory[]>([])
const historyLoading = ref(false)

const batchPriceFormRules: FormRules = {
  adjustValue: [
    { required: true, message: '请输入调整值', trigger: 'blur' },
    { type: 'number', message: '调整值必须是数字', trigger: 'blur' },
  ],
  changeReason: [
    { required: true, message: '请输入变更原因', trigger: 'change' },
    { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' },
  ],
}

// 批量调价预览
const batchPricePreview = computed(() => {
  return selectedModels.value.map(model => {
    let newPrice = model.dailyPrice

    if (batchPriceFormData.adjustType === 'percentage') {
      newPrice = model.dailyPrice * (1 + batchPriceFormData.adjustValue / 100)
    } else if (batchPriceFormData.adjustType === 'fixed') {
      newPrice = model.dailyPrice + batchPriceFormData.adjustValue
    } else if (batchPriceFormData.adjustType === 'unified') {
      newPrice = batchPriceFormData.adjustValue
    }

    newPrice = Math.max(0, Math.round(newPrice))

    return {
      modelId: model.id,
      modelName: model.modelName,
      oldPrice: model.dailyPrice,
      newPrice,
      change: newPrice - model.dailyPrice,
      changePercent: model.dailyPrice > 0 ? Math.round(((newPrice - model.dailyPrice) / model.dailyPrice) * 100) : 0,
    }
  })
})

// 加入分组预览
const joinGroupPreview = computed(() => {
  const selectedGroup = priceGroupsList.value.find(g => g.id === joinGroupFormData.groupId)
  if (!selectedGroup) return []

  return selectedModels.value.map(model => {
    const newPrice = selectedGroup.basePrice
    return {
      modelId: model.id,
      modelName: model.modelName,
      oldPrice: model.dailyPrice,
      newPrice,
      change: newPrice - model.dailyPrice,
      alreadyInGroup: model.priceGroupId === selectedGroup.id,
    }
  })
})

const priceFormRules: FormRules = {
  newPrice: [
    { required: true, message: '请输入新价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于0', trigger: 'blur' },
  ],
  changeReason: [
    { required: true, message: '请输入变更原因', trigger: 'change' },
    { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' },
  ],
}

// 计算价格变化
const priceChange = computed(() => {
  if (!currentModel.value) return 0
  return priceFormData.newPrice - currentModel.value.dailyPrice
})

const priceChangePercent = computed(() => {
  if (!currentModel.value || currentModel.value.dailyPrice === 0) return 0
  return Math.round((priceChange.value / currentModel.value.dailyPrice) * 100)
})

const form = reactive({
  id: 0,
  brandId: null as number | null,
  modelName: '',
  vehicleType: '',
  seats: 4,
  beds: 2,
  length: 5.0,
  width: 2.0,
  height: 2.8,
  fuelCapacity: 70,
  dailyPrice: 500,
  image: '',
  description: '',
  features: [] as string[],
})

const formRules: FormRules = {
  brandId: [
    { required: true, message: '请选择品牌', trigger: 'change' },
  ],
  modelName: [
    { required: true, message: '请输入车型名称', trigger: 'blur' },
  ],
  vehicleType: [
    { required: true, message: '请选择车辆类型', trigger: 'change' },
  ],
  dailyPrice: [
    { required: true, message: '请输入日租金', trigger: 'blur' },
  ],
}

// 加载车型列表
const loadVehicleModels = async () => {
  loading.value = true
  try {
    const res = await getVehicleModels({
      page: pagination.page,
      pageSize: pagination.pageSize,
      brandId: searchForm.brandId,
      keyword: searchForm.keyword,
      vehicleType: searchForm.vehicleType,
      status: searchForm.status,
    })
    modelsList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载车型列表失败')
  } finally {
    loading.value = false
  }
}

// 加载品牌列表
const loadBrands = async () => {
  try {
    const res = await getBrands()
    brandsList.value = res.data
    // 动态更新搜索字段的品牌选项
    const brandField = searchFields.find(f => f.prop === 'brandId')
    if (brandField) {
      brandField.options = res.data.map((b: Brand) => ({
        label: b.name,
        value: b.id,
      }))
    }
  } catch (error) {
    handleApiError(error, '加载品牌列表失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadVehicleModels()
}

// 重置
const handleReset = () => {
  searchForm.brandId = null
  searchForm.keyword = ''
  searchForm.vehicleType = ''
  searchForm.status = ''
  pagination.page = 1
  loadVehicleModels()
}

// 新增车型
const handleCreate = () => {
  dialogTitle.value = '新增车型'
  isEdit.value = false
  activeTab.value = 'basic'
  dialogVisible.value = true
}

// 查看车型
const handleView = (_row: VehicleModel) => {
  ElMessage.info('查看功能开发中...')
}

// 编辑车型
const handleEdit = (row: VehicleModel) => {
  dialogTitle.value = '编辑车型'
  isEdit.value = true
  activeTab.value = 'basic'
  form.id = row.id
  form.brandId = row.brandId
  form.modelName = row.modelName
  form.vehicleType = row.vehicleType
  form.seats = row.seats
  form.beds = row.beds
  form.length = row.length
  form.width = row.width
  form.height = row.height
  form.fuelCapacity = row.fuelCapacity
  form.dailyPrice = row.dailyPrice
  form.image = row.image
  form.description = row.description
  form.features = [...row.features]
  dialogVisible.value = true
}

// 状态变更
const handleStatusChange = async (row: VehicleModel) => {
  const action = row.status === 'active' ? '禁用' : '启用'
  const newStatus = row.status === 'active' ? 'inactive' : 'active'

  try {
    await ElMessageBox.confirm(
      `确定要${action}车型 "${row.modelName}" 吗？`,
      `${action}确认`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await changeVehicleModelStatus(row.id, newStatus)
    row.status = newStatus
    ElMessage.success(`${action}成功`)
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, `${action}失败`)
    }
  }
}

// 删除车型
const handleDelete = async (row: VehicleModel) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除车型 "${row.modelName}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await deleteVehicleModel(row.id)
    ElMessage.success('删除成功')
    loadVehicleModels()
  } catch (error) {
    if (error !== 'cancel') {
      handleApiError(error, '删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      if (isEdit.value) {
        await updateVehicleModel(form.id, {
          brandId: form.brandId!,
          modelName: form.modelName,
          vehicleType: form.vehicleType as any,
          seats: form.seats,
          beds: form.beds,
          length: form.length,
          width: form.width,
          height: form.height,
          fuelCapacity: form.fuelCapacity,
          dailyPrice: form.dailyPrice,
          image: form.image,
          description: form.description,
          features: [...form.features],
        })
        ElMessage.success('更新成功')
      } else {
        await createVehicleModel({
          brandId: form.brandId!,
          modelName: form.modelName,
          vehicleType: form.vehicleType as any,
          seats: form.seats,
          beds: form.beds,
          length: form.length,
          width: form.width,
          height: form.height,
          fuelCapacity: form.fuelCapacity,
          dailyPrice: form.dailyPrice,
          image: form.image,
          description: form.description,
          features: [...form.features],
        })
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      loadVehicleModels()
    } catch (error) {
      handleApiError(error, isEdit.value ? '更新失败' : '创建失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
  form.id = 0
  form.brandId = null
  form.modelName = ''
  form.vehicleType = ''
  form.seats = 4
  form.beds = 2
  form.length = 5.0
  form.width = 2.0
  form.height = 2.8
  form.fuelCapacity = 70
  form.dailyPrice = 500
  form.image = ''
  form.description = ''
  form.features = []
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadVehicleModels()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadVehicleModels()
}

// 获取车辆类型标签类型
const getVehicleTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    c_type: 'primary',
    b_type: 'success',
    trailer: 'warning',
  }
  return tagMap[type] || 'info'
}

// 调整价格
const handleAdjustPrice = (row: VehicleModel) => {
  currentModel.value = row
  priceFormData.modelId = row.id
  priceFormData.newPrice = row.dailyPrice
  priceFormData.changeReason = ''
  priceFormData.remark = ''
  priceDialogVisible.value = true
}

// 提交价格调整
const handlePriceSubmit = async () => {
  if (!priceFormRef.value) return

  try {
    await priceFormRef.value.validate()

    // 价格未变化
    if (priceFormData.newPrice === currentModel.value?.dailyPrice) {
      ElMessage.warning('价格未发生变化')
      return
    }

    // 价格变化超过30%需要二次确认
    if (Math.abs(priceChangePercent.value) > 30) {
      await ElMessageBox.confirm(
        `价格变化幅度较大（${priceChangePercent.value}%），确定要继续吗？`,
        '警告',
        { type: 'warning' }
      )
    }

    submitLoading.value = true

    const res = await updateModelPrice(priceFormData)
    if (res.success) {
      ElMessage.success('价格调整成功')
      priceDialogVisible.value = false
      loadVehicleModels()
    }
  } catch (error: unknown) {
    if (error !== 'cancel') {
      console.error('提交失败:', error)
      handleApiError(error, '价格调整失败')
    }
  } finally {
    submitLoading.value = false
  }
}

// 关闭价格对话框
const handlePriceDialogClose = () => {
  priceFormRef.value?.resetFields()
  currentModel.value = null
}

// 选择变化
const handleSelectionChange = (selection: VehicleModel[]) => {
  selectedModels.value = selection
}

// 批量调价
const handleBatchAdjustPrice = () => {
  if (selectedModels.value.length === 0) {
    ElMessage.warning('请先选择要调价的车型')
    return
  }

  batchPriceFormData.adjustType = 'percentage'
  batchPriceFormData.adjustValue = 0
  batchPriceFormData.changeReason = ''
  batchPriceFormData.remark = ''
  batchPriceDialogVisible.value = true
}

// 提交批量调价
const handleBatchPriceSubmit = async () => {
  if (!batchPriceFormRef.value) return

  try {
    await batchPriceFormRef.value.validate()

    // 检查是否有价格变化
    const hasChange = batchPricePreview.value.some(item => item.change !== 0)
    if (!hasChange && batchPriceFormData.adjustType !== 'unified') {
      ElMessage.warning('价格未发生变化')
      return
    }

    // 检查是否有负价格
    const hasNegativePrice = batchPricePreview.value.some(item => item.newPrice < 0)
    if (hasNegativePrice) {
      ElMessage.error('调整后存在负价格，请修改调整值')
      return
    }

    // 检查是否有大幅度变化
    const maxChangePercent = Math.max(...batchPricePreview.value.map(item => Math.abs(item.changePercent)))
    if (maxChangePercent > 30) {
      await ElMessageBox.confirm(
        `部分车型价格变化幅度较大（最大${maxChangePercent}%），确定要继续吗？`,
        '警告',
        { type: 'warning' }
      )
    }

    submitLoading.value = true

    const request: BatchUpdatePriceRequest = {
      modelIds: selectedModels.value.map(m => m.id),
      adjustType: batchPriceFormData.adjustType,
      adjustValue: batchPriceFormData.adjustValue,
      changeReason: batchPriceFormData.changeReason,
      remark: batchPriceFormData.remark,
    }

    const res = await batchUpdatePrice(request)
    if (res.success) {
      const { successCount, failureCount } = res.data
      if (failureCount === 0) {
        ElMessage.success(`批量调价成功，共更新 ${successCount} 个车型`)
      } else {
        ElMessage.warning(`批量调价完成，成功 ${successCount} 个，失败 ${failureCount} 个`)
      }
      batchPriceDialogVisible.value = false
      selectedModels.value = []
      loadVehicleModels()
    }
  } catch (error: unknown) {
    if (error !== 'cancel') {
      console.error('提交失败:', error)
      handleApiError(error, '批量调价失败')
    }
  } finally {
    submitLoading.value = false
  }
}

// 关闭批量调价对话框
const handleBatchPriceDialogClose = () => {
  batchPriceFormRef.value?.resetFields()
}

// 加载价格分组列表
const loadPriceGroups = async () => {
  try {
    const res = await getPriceGroups({ status: 'active' })
    if (res.code === 200) {
      priceGroupsList.value = res.data.list
    }
  } catch (error) {
    console.error('加载价格分组失败:', error)
    handleApiError(error, '加载价格分组失败')
  }
}

// 加入分组
const handleJoinGroup = () => {
  if (selectedModels.value.length === 0) {
    ElMessage.warning('请先选择要加入分组的车型')
    return
  }

  joinGroupFormData.groupId = null
  loadPriceGroups()
  joinGroupDialogVisible.value = true
}

// 分组选择变化
const handleGroupChange = () => {
  // 触发预览更新
}

// 提交加入分组
const handleJoinGroupSubmit = async () => {
  if (!joinGroupFormRef.value) return

  try {
    await joinGroupFormRef.value.validate()

    // 检查是否有车型已在该分组
    const alreadyInGroup = joinGroupPreview.value.filter(item => item.alreadyInGroup)
    if (alreadyInGroup.length > 0) {
      await ElMessageBox.confirm(
        `有 ${alreadyInGroup.length} 个车型已在该分组中，将跳过这些车型，是否继续？`,
        '提示',
        { type: 'warning' }
      )
    }

    submitLoading.value = true

    const request: JoinPriceGroupRequest = {
      modelIds: selectedModels.value.map(m => m.id),
      groupId: joinGroupFormData.groupId!,
    }

    const res = await joinPriceGroup(request)
    if (res.success) {
      const { successCount, skippedCount } = res.data
      if (skippedCount === 0) {
        ElMessage.success(`成功将 ${successCount} 个车型加入分组`)
      } else {
        ElMessage.warning(`成功 ${successCount} 个，跳过 ${skippedCount} 个`)
      }
      joinGroupDialogVisible.value = false
      selectedModels.value = []
      loadVehicleModels()
    }
  } catch (error: unknown) {
    if (error !== 'cancel') {
      console.error('提交失败:', error)
      handleApiError(error, '加入分组失败')
    }
  } finally {
    submitLoading.value = false
  }
}

// 关闭加入分组对话框
const handleJoinGroupDialogClose = () => {
  joinGroupFormRef.value?.resetFields()
}

// 脱离分组
const handleLeaveGroup = async (row: VehicleModel) => {
  if (!row.priceGroupId) {
    ElMessage.warning('该车型未加入任何分组')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要将车型【${row.modelName}】脱离分组【${row.priceGroupName}】吗？脱离后将保持当前价格 ¥${row.dailyPrice}`,
      '脱离分组确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    const res = await leaveGroup({ modelId: row.id })
    if (res.success) {
      ElMessage.success('脱离分组成功')
      loadVehicleModels()
    }
  } catch (error: unknown) {
    if (error !== 'cancel') {
      console.error('脱离分组失败:', error)
      handleApiError(error, '脱离分组失败')
    }
  }
}

// 查看价格日历
const handleViewPriceCalendar = (row: VehicleModel) => {
  router.push({
    name: 'PriceCalendar',
    query: {
      modelId: row.id,
      modelName: row.modelName
    }
  })
}

// 查看价格历史
const handleViewHistory = async (row: VehicleModel) => {
  currentModel.value = row
  historyDialogVisible.value = true

  historyLoading.value = true
  try {
    const res = await getPriceHistory({ modelId: row.id })
    if (res.code === 200) {
      priceHistoryList.value = res.data.list
    }
  } catch (error) {
    console.error('加载价格历史失败:', error)
    handleApiError(error, '加载价格历史失败')
  } finally {
    historyLoading.value = false
  }
}

// 关闭价格历史对话框
const handleHistoryDialogClose = () => {
  priceHistoryList.value = []
  currentModel.value = null
}

// 页面加载
onMounted(() => {
  loadBrands()
  loadVehicleModels()
})

// 导出数据
function handleExport() {
  if (modelsList.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const columns = tableColumns
    .filter(col => col.prop && col.prop !== 'actions')
    .map(col => ({ key: col.prop, label: col.label }))

  exportToCSV(modelsList.value, columns, '车型列表')
}
</script>

<style scoped lang="scss">
.vehicle-models-container {
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

  .image-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s;

      &:hover {
        border-color: #409eff;
      }
    }

    .uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
      line-height: 178px;
    }

    .uploaded-image {
      width: 178px;
      height: 178px;
      display: block;
      object-fit: cover;
    }
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
