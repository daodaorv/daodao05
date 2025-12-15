<template>
  <div class="file-export">
    <el-button
      :type="type"
      :icon="icon || Download"
      :loading="exporting"
      :disabled="disabled || exporting"
      @click="handleExport"
    >
      {{ label }}
    </el-button>

    <!-- 导出配置对话框 -->
    <el-dialog
      v-model="configVisible"
      title="导出配置"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form :model="exportConfig" label-width="100px">
        <!-- 导出格式 -->
        <el-form-item label="导出格式">
          <el-radio-group v-model="exportConfig.format">
            <el-radio v-if="formats.includes('xlsx')" value="xlsx">Excel (.xlsx)</el-radio>
            <el-radio v-if="formats.includes('csv')" value="csv">CSV (.csv)</el-radio>
            <el-radio v-if="formats.includes('pdf')" value="pdf">PDF (.pdf)</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 导出字段选择 -->
        <el-form-item v-if="showFieldSelector" label="导出字段">
          <el-checkbox-group v-model="exportConfig.selectedFields">
            <el-checkbox
              v-for="field in availableFields"
              :key="field.prop"
              :label="field.prop"
            >
              {{ field.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 数据范围 -->
        <el-form-item v-if="showRangeSelector" label="数据范围">
          <el-radio-group v-model="exportConfig.range">
            <el-radio value="current">当前页</el-radio>
            <el-radio value="all">全部数据</el-radio>
            <el-radio value="selected">已选数据</el-radio>
          </el-radio-group>
          <div v-if="exportConfig.range === 'selected'" class="range-tip">
            已选择 {{ selectedCount }} 条数据
          </div>
        </el-form-item>

        <!-- 文件名 -->
        <el-form-item label="文件名">
          <el-input
            v-model="exportConfig.filename"
            placeholder="请输入文件名"
            maxlength="50"
          >
            <template #append>.{{ exportConfig.format }}</template>
          </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="configVisible = false">取消</el-button>
        <el-button type="primary" :loading="exporting" @click="handleConfirmExport">
          确认导出
        </el-button>
      </template>
    </el-dialog>

    <!-- 导出进度对话框 -->
    <el-dialog
      v-model="progressVisible"
      title="导出进度"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="export-progress">
        <el-progress
          :percentage="exportProgress"
          :status="exportProgress === 100 ? 'success' : undefined"
        />
        <div class="progress-text">
          {{ exportProgressText }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import type { Component } from 'vue'
import * as XLSX from 'xlsx'

// 导出格式类型
type ExportFormat = 'xlsx' | 'csv' | 'pdf'

// 字段配置接口
interface FieldConfig {
  prop: string
  label: string
}

// Props 定义
interface Props {
  label?: string                    // 按钮文本
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
  icon?: Component                  // 按钮图标
  disabled?: boolean                // 是否禁用
  data?: any[]                      // 导出数据
  columns?: FieldConfig[]           // 列配置
  formats?: ExportFormat[]          // 支持的导出格式
  defaultFormat?: ExportFormat      // 默认导出格式
  filename?: string                 // 默认文件名
  showConfig?: boolean              // 是否显示配置对话框
  showFieldSelector?: boolean       // 是否显示字段选择器
  showRangeSelector?: boolean       // 是否显示范围选择器
  selectedData?: any[]              // 已选数据
  fetchAllData?: () => Promise<any[]> // 获取全部数据的方法
  batchSize?: number                // 批量导出大小
}

const props = withDefaults(defineProps<Props>(), {
  label: '导出',
  type: 'default',
  disabled: false,
  data: () => [],
  columns: () => [],
  formats: () => ['xlsx', 'csv'],
  defaultFormat: 'xlsx',
  filename: '导出数据',
  showConfig: true,
  showFieldSelector: true,
  showRangeSelector: true,
  selectedData: () => [],
  batchSize: 1000,
})

// Emits 定义
const emit = defineEmits<{
  'before-export': []
  'success': [data: { format: ExportFormat; filename: string }]
  'error': [error: Error]
}>()

// 响应式数据
const exporting = ref(false)
const configVisible = ref(false)
const progressVisible = ref(false)
const exportProgress = ref(0)
const exportProgressText = ref('')

const exportConfig = ref({
  format: props.defaultFormat,
  selectedFields: [] as string[],
  range: 'current' as 'current' | 'all' | 'selected',
  filename: props.filename,
})

// 计算属性
const availableFields = computed(() => props.columns)
const selectedCount = computed(() => props.selectedData?.length || 0)

// 初始化选中的字段
const initSelectedFields = () => {
  if (exportConfig.value.selectedFields.length === 0) {
    exportConfig.value.selectedFields = props.columns.map(col => col.prop)
  }
}

// 处理导出按钮点击
const handleExport = () => {
  if (props.showConfig) {
    initSelectedFields()
    configVisible.value = true
  } else {
    handleConfirmExport()
  }
}

// 确认导出
const handleConfirmExport = async () => {
  configVisible.value = false

  try {
    emit('before-export')
    exporting.value = true
    progressVisible.value = true
    exportProgress.value = 0
    exportProgressText.value = '准备导出数据...'

    // 获取导出数据
    const exportData = await getExportData()

    if (!exportData || exportData.length === 0) {
      ElMessage.warning('没有可导出的数据')
      return
    }

    exportProgressText.value = '正在处理数据...'
    exportProgress.value = 30

    // 根据格式导出
    switch (exportConfig.value.format) {
      case 'xlsx':
        await exportToExcel(exportData)
        break
      case 'csv':
        await exportToCSV(exportData)
        break
      case 'pdf':
        await exportToPDF(exportData)
        break
    }

    exportProgress.value = 100
    exportProgressText.value = '导出完成！'

    setTimeout(() => {
      progressVisible.value = false
      ElMessage.success('导出成功')
      emit('success', {
        format: exportConfig.value.format,
        filename: exportConfig.value.filename,
      })
    }, 500)
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请重试')
    emit('error', error as Error)
    progressVisible.value = false
  } finally {
    exporting.value = false
  }
}

// 获取导出数据
const getExportData = async (): Promise<any[]> => {
  let data: any[] = []

  switch (exportConfig.value.range) {
    case 'current':
      data = props.data
      break
    case 'all':
      if (props.fetchAllData) {
        exportProgressText.value = '正在获取全部数据...'
        data = await props.fetchAllData()
      } else {
        data = props.data
      }
      break
    case 'selected':
      data = props.selectedData
      break
  }

  // 过滤字段
  if (props.showFieldSelector && exportConfig.value.selectedFields.length > 0) {
    const selectedFields = exportConfig.value.selectedFields
    data = data.map(row => {
      const filteredRow: any = {}
      selectedFields.forEach(field => {
        filteredRow[field] = row[field]
      })
      return filteredRow
    })
  }

  return data
}

// 导出为 Excel
const exportToExcel = async (data: any[]) => {
  exportProgressText.value = '正在生成 Excel 文件...'
  exportProgress.value = 50

  // 准备表头
  const headers = props.columns
    .filter(col => exportConfig.value.selectedFields.includes(col.prop))
    .map(col => col.label)

  // 准备数据
  const rows = data.map(row => {
    return exportConfig.value.selectedFields.map(field => {
      const value = row[field]
      // 处理特殊值
      if (value === null || value === undefined) return ''
      if (typeof value === 'object') return JSON.stringify(value)
      return value
    })
  })

  // 创建工作表
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])

  // 设置列宽
  const colWidths = headers.map(() => ({ wch: 15 }))
  worksheet['!cols'] = colWidths

  // 创建工作簿
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  exportProgress.value = 80

  // 导出文件
  const filename = `${exportConfig.value.filename}.xlsx`
  XLSX.writeFile(workbook, filename)

  exportProgress.value = 100
}

// 导出为 CSV
const exportToCSV = async (data: any[]) => {
  exportProgressText.value = '正在生成 CSV 文件...'
  exportProgress.value = 50

  // 准备表头
  const headers = props.columns
    .filter(col => exportConfig.value.selectedFields.includes(col.prop))
    .map(col => col.label)

  // 准备数据
  const rows = data.map(row => {
    return exportConfig.value.selectedFields.map(field => {
      const value = row[field]
      // 处理特殊值
      if (value === null || value === undefined) return ''
      if (typeof value === 'object') return JSON.stringify(value)
      // CSV 需要转义逗号和引号
      const strValue = String(value)
      if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
        return `"${strValue.replace(/"/g, '""')}"`
      }
      return strValue
    })
  })

  exportProgress.value = 70

  // 生成 CSV 内容
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n')

  // 添加 BOM 以支持中文
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })

  exportProgress.value = 90

  // 下载文件
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${exportConfig.value.filename}.csv`
  link.click()
  URL.revokeObjectURL(link.href)

  exportProgress.value = 100
}

// 导出为 PDF
const exportToPDF = async (data: any[]) => {
  exportProgressText.value = '正在生成 PDF 文件...'
  exportProgress.value = 50

  // PDF 导出需要额外的库支持，这里提供基础实现
  // 实际项目中建议使用 jsPDF 或 pdfmake 库
  ElMessage.warning('PDF 导出功能需要额外配置，请使用 Excel 或 CSV 格式')
  throw new Error('PDF export not implemented')
}

// 关闭配置对话框
const handleDialogClose = () => {
  // 重置配置
  exportConfig.value.format = props.defaultFormat
  exportConfig.value.range = 'current'
  exportConfig.value.filename = props.filename
}

// 暴露方法供父组件调用
defineExpose({
  export: handleConfirmExport,
})
</script>

<script lang="ts">
export default {
  name: 'FileExport',
}
</script>

<style scoped lang="scss">
.file-export {
  display: inline-block;

  .range-tip {
    margin-top: 8px;
    font-size: 12px;
    color: #909399;
  }

  .export-progress {
    padding: 20px 0;

    .progress-text {
      margin-top: 16px;
      text-align: center;
      font-size: 14px;
      color: #606266;
    }
  }

  :deep(.el-checkbox-group) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
