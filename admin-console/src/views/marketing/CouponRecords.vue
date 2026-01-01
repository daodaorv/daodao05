<template>
  <div class="coupon-records-container">
    <!-- 搜索筛选区 -->
    <SearchForm
      v-model="searchForm"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 记录列表表格 -->
    <DataTable
      :data="recordList"
      :columns="tableColumns"
      :loading="loading"
      :pagination="pagination"
      :actions="tableActions"
      :toolbar-buttons="toolbarButtons"
      :actions-width="120"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #recordType="{ row }">
        <el-tag :type="getRecordTypeTag(row.recordType) as any" size="small">
          {{ getRecordTypeLabel(row.recordType) }}
        </el-tag>
      </template>

      <template #source="{ row }">
        <el-tag type="info" size="small">
          {{ getSourceLabel(row.source) }}
        </el-tag>
      </template>

      <template #actualDiscountAmount="{ row }">
        <span v-if="row.actualDiscountAmount" style="color: #f56c6c; font-weight: bold">
          ¥{{ row.actualDiscountAmount }}
        </span>
        <span v-else style="color: #909399">-</span>
      </template>

      <template #recordTime="{ row }">
        <div style="font-size: 12px">
          {{ formatDateTime(row.recordTime) }}
        </div>
      </template>
    </DataTable>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="记录详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentRecord" :column="2" border>
        <el-descriptions-item label="记录ID">{{ currentRecord.id }}</el-descriptions-item>
        <el-descriptions-item label="记录类型">
          <el-tag :type="getRecordTypeTag(currentRecord.recordType) as any" size="small">
            {{ getRecordTypeLabel(currentRecord.recordType) }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="优惠券名称">{{
          currentRecord.couponName
        }}</el-descriptions-item>
        <el-descriptions-item label="优惠码">{{ currentRecord.couponCode }}</el-descriptions-item>

        <el-descriptions-item label="用户姓名">{{ currentRecord.userName }}</el-descriptions-item>
        <el-descriptions-item label="用户手机">{{ currentRecord.userPhone }}</el-descriptions-item>

        <el-descriptions-item label="记录来源">
          <el-tag type="info" size="small">
            {{ getSourceLabel(currentRecord.source) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="来源详情">
          {{ currentRecord.sourceDetail || '-' }}
        </el-descriptions-item>

        <!-- 使用记录特有字段 -->
        <template v-if="currentRecord.recordType === 'use'">
          <el-descriptions-item label="订单号">{{
            currentRecord.orderNo || '-'
          }}</el-descriptions-item>
          <el-descriptions-item label="实际优惠金额">
            <span style="color: #f56c6c; font-weight: bold"
              >¥{{ currentRecord.actualDiscountAmount }}</span
            >
          </el-descriptions-item>
        </template>

        <!-- 转赠记录特有字段 -->
        <template v-if="currentRecord.recordType === 'transfer'">
          <el-descriptions-item label="转赠给">{{
            currentRecord.transferToUserName || '-'
          }}</el-descriptions-item>
          <el-descriptions-item label="转赠原因">{{
            currentRecord.transferReason || '-'
          }}</el-descriptions-item>
        </template>

        <!-- 失效记录特有字段 -->
        <template v-if="currentRecord.recordType === 'expire'">
          <el-descriptions-item label="失效原因" :span="2">
            {{ currentRecord.expireReason || '-' }}
          </el-descriptions-item>
        </template>

        <!-- 作废记录特有字段 -->
        <template v-if="currentRecord.recordType === 'revoke'">
          <el-descriptions-item label="作废原因">{{
            currentRecord.revokeReason || '-'
          }}</el-descriptions-item>
          <el-descriptions-item label="作废操作人">{{
            currentRecord.revokedBy || '-'
          }}</el-descriptions-item>
        </template>

        <el-descriptions-item label="记录时间" :span="2">
          {{ formatDateTime(currentRecord.recordTime) }}
        </el-descriptions-item>

        <el-descriptions-item label="备注" :span="2">
          {{ currentRecord.remark || '-' }}
        </el-descriptions-item>

        <el-descriptions-item label="IP地址">{{
          currentRecord.ipAddress || '-'
        }}</el-descriptions-item>
        <el-descriptions-item label="设备信息">{{
          currentRecord.deviceInfo || '-'
        }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn, TableAction, ToolbarButton } from '@/components/common/DataTable.vue'
import {
  getCouponRecordList,
  exportCouponRecords,
  type CouponRecord,
  type CouponRecordListParams,
  type CouponRecordType,
  type CouponRecordSource,
} from '@/api/marketing'
import { useErrorHandler } from '@/composables'

// Composables
const { handleApiError } = useErrorHandler()

// 记录类型选项
const RECORD_TYPE_OPTIONS = [
  { label: '领取', value: 'receive' },
  { label: '使用', value: 'use' },
  { label: '失效', value: 'expire' },
  { label: '转赠', value: 'transfer' },
  { label: '作废', value: 'revoke' },
]

// 记录来源选项
const RECORD_SOURCE_OPTIONS = [
  { label: '手动发放', value: 'manual' },
  { label: '活动领取', value: 'activity' },
  { label: '注册赠送', value: 'register' },
  { label: '订单使用', value: 'order' },
  { label: '分享获得', value: 'share' },
  { label: '管理员操作', value: 'admin' },
]

// 搜索表单
const searchForm = reactive<CouponRecordListParams>({
  keyword: '',
  recordType: undefined,
  source: undefined,
  startDate: '',
  endDate: '',
})

// 搜索字段配置
const searchFields = computed<SearchField[]>(() => [
  {
    prop: 'keyword',
    label: '关键词',
    type: 'input',
    placeholder: '优惠券名称/用户名/手机号',
    width: '220px',
  },
  {
    prop: 'recordType',
    label: '记录类型',
    type: 'select',
    placeholder: '请选择记录类型',
    width: '150px',
    options: RECORD_TYPE_OPTIONS,
  },
  {
    prop: 'source',
    label: '记录来源',
    type: 'select',
    placeholder: '请选择来源',
    width: '150px',
    options: RECORD_SOURCE_OPTIONS,
  },
  {
    prop: 'startDate',
    label: '开始日期',
    type: 'date',
    placeholder: '请选择开始日期',
    width: '180px',
    valueFormat: 'YYYY-MM-DD',
  },
  {
    prop: 'endDate',
    label: '结束日期',
    type: 'date',
    placeholder: '请选择结束日期',
    width: '180px',
    valueFormat: 'YYYY-MM-DD',
  },
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'id', label: '记录ID', width: 80 },
  { prop: 'couponName', label: '优惠券名称', minWidth: 150 },
  { prop: 'couponCode', label: '优惠码', width: 140 },
  { prop: 'userName', label: '用户姓名', width: 100 },
  { prop: 'userPhone', label: '用户手机', width: 120 },
  { prop: 'recordType', label: '记录类型', width: 100, slot: 'recordType' },
  { prop: 'source', label: '来源', width: 120, slot: 'source' },
  { prop: 'actualDiscountAmount', label: '优惠金额', width: 100, slot: 'actualDiscountAmount' },
  { prop: 'recordTime', label: '记录时间', width: 160, slot: 'recordTime' },
]

// 表格操作列配置
const tableActions: TableAction[] = [
  {
    label: '查看详情',
    type: 'primary',
    onClick: (row: CouponRecord) => handleView(row),
  },
]

// 工具栏按钮配置
const toolbarButtons: ToolbarButton[] = [
  {
    label: '导出记录',
    type: 'success',
    icon: Download,
    onClick: () => handleExport(),
  },
]

// 记录列表
const recordList = ref<CouponRecord[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 详情对话框状态
const detailDialogVisible = ref(false)
const currentRecord = ref<CouponRecord | null>(null)

// 加载记录列表
const loadRecordList = async () => {
  loading.value = true
  try {
    const params: CouponRecordListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm,
    }

    const res = (await getCouponRecordList(params)) as any
    recordList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    handleApiError(error, '加载优惠券记录失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadRecordList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.recordType = undefined
  searchForm.source = undefined
  searchForm.startDate = ''
  searchForm.endDate = ''
  pagination.page = 1
  loadRecordList()
}

// 查看详情
const handleView = (row: CouponRecord) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

// 导出记录
const handleExport = async () => {
  try {
    ElMessage.info('正在导出，请稍候...')

    const params: CouponRecordListParams = {
      ...searchForm,
    }

    await exportCouponRecords(params)

    // Mock 实现：生成 CSV 数据并下载
    const csvData = generateCSV()
    downloadCSV(csvData, `优惠券记录_${formatDate(new Date())}.csv`)

    ElMessage.success('导出成功')
  } catch (error) {
    handleApiError(error, '导出记录失败')
  }
}

// 生成 CSV 数据
const generateCSV = () => {
  const headers = [
    '记录ID',
    '优惠券名称',
    '优惠码',
    '用户姓名',
    '用户手机',
    '记录类型',
    '来源',
    '优惠金额',
    '记录时间',
    '备注',
  ]
  const rows = recordList.value.map(record => [
    record.id,
    record.couponName,
    record.couponCode,
    record.userName,
    record.userPhone,
    getRecordTypeLabel(record.recordType),
    getSourceLabel(record.source),
    record.actualDiscountAmount || '-',
    formatDateTime(record.recordTime),
    record.remark || '-',
  ])

  return [headers, ...rows]
}

// 下载 CSV 文件
const downloadCSV = (data: any[][], filename: string) => {
  const csvContent = data.map(row => row.join(',')).join('\n')
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 格式化日期（用于文件名）
const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadRecordList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadRecordList()
}

// 获取记录类型标签类型
const getRecordTypeTag = (type: CouponRecordType) => {
  const tagMap: Record<CouponRecordType, string> = {
    receive: 'success',
    use: 'primary',
    expire: 'info',
    transfer: 'warning',
    revoke: 'danger',
  }
  return tagMap[type] || 'info'
}

// 获取记录类型标签文本
const getRecordTypeLabel = (type: CouponRecordType) => {
  const labelMap: Record<CouponRecordType, string> = {
    receive: '领取',
    use: '使用',
    expire: '失效',
    transfer: '转赠',
    revoke: '作废',
  }
  return labelMap[type] || type
}

// 获取来源标签文本
const getSourceLabel = (source: CouponRecordSource) => {
  const labelMap: Record<CouponRecordSource, string> = {
    manual: '手动发放',
    activity: '活动领取',
    register: '注册赠送',
    order: '订单使用',
    share: '分享获得',
    admin: '管理员操作',
  }
  return labelMap[source] || source
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 页面加载
onMounted(() => {
  loadRecordList()
})
</script>

<style scoped lang="scss">
.coupon-records-container {
  padding: 20px;
}
</style>
