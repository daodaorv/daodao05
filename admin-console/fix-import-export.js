/**
 * 批量修复导入导出功能的脚本
 *
 * 使用方法: node fix-import-export.js
 */

const fs = require('fs')
const path = require('path')

// 需要修复的文件列表
const filesToFix = [
  'src/views/employee/EmployeeList.vue',
  'src/views/finance/FinanceReports.vue',
  'src/views/finance/FinanceIncome.vue',
  'src/views/vehicle/VehicleViolations.vue',
  'src/views/vehicle/VehicleStatus.vue',
  'src/views/vehicle/VehicleModels.vue',
  'src/views/vehicle/VehicleMaintenance.vue',
  'src/views/vehicle/VehicleList.vue',
  'src/views/vehicle/VehicleInsurance.vue',
  'src/views/store/StoreList.vue',
  'src/views/permission/PermissionRoles.vue',
  'src/views/permission/PermissionLogs.vue',
  'src/views/orders/OrderList.vue',
  'src/views/user/UserBlacklist.vue'
]

// 导出功能的替换模板
const exportFunctionTemplate = `
// 导出数据
function handleExport() {
  if (list.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  // 定义导出列(根据实际表格列配置)
  const columns = tableColumns
    .filter(col => col.prop && col.prop !== 'actions')
    .map(col => ({
      key: col.prop,
      label: col.label
    }))

  // 导出
  exportToCSV(list.value, columns, '数据列表')
}
`

// 导入功能的替换模板
const importFunctionTemplate = `
// 导入数据
function handleImport() {
  ElMessage.info('导入功能正在开发中,敬请期待')
}
`

console.log('开始修复导入导出功能...\n')

let successCount = 0
let errorCount = 0

filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath)

  try {
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  文件不存在: ${filePath}`)
      errorCount++
      return
    }

    let content = fs.readFileSync(fullPath, 'utf-8')
    let modified = false

    // 检查是否需要添加 import
    if (!content.includes("import { exportToCSV }")) {
      // 找到其他 import 语句的位置
      const importMatch = content.match(/import .+ from ['"]@\/composables['"]/);
      if (importMatch) {
        const importLine = importMatch[0]
        const newImportLine = importLine + "\nimport { exportToCSV } from '@/utils/export'"
        content = content.replace(importLine, newImportLine)
        modified = true
      }
    }

    // 替换导出功能
    if (content.includes("ElMessage.info('导出功能开发中')")) {
      content = content.replace(
        /onClick:\s*\(\)\s*=>\s*ElMessage\.info\(['"]导出功能开发中['"]\)/g,
        'onClick: handleExport'
      )

      // 在文件末尾的 </script> 前添加导出函数
      if (!content.includes('function handleExport()')) {
        content = content.replace(
          /(\n\/\/ 组件挂载时|onMounted\(|<\/script>)/,
          exportFunctionTemplate + '\n$1'
        )
      }

      modified = true
    }

    // 替换导入功能
    if (content.includes("ElMessage.info('导入功能开发中')")) {
      content = content.replace(
        /onClick:\s*\(\)\s*=>\s*ElMessage\.info\(['"]导入功能开发中['"]\)/g,
        'onClick: handleImport'
      )

      // 在文件末尾的 </script> 前添加导入函数
      if (!content.includes('function handleImport()')) {
        content = content.replace(
          /(\n\/\/ 导出数据|<\/script>)/,
          importFunctionTemplate + '\n$1'
        )
      }

      modified = true
    }

    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf-8')
      console.log(`✅ 已修复: ${filePath}`)
      successCount++
    } else {
      console.log(`ℹ️  无需修复: ${filePath}`)
    }
  } catch (error) {
    console.log(`❌ 修复失败: ${filePath}`)
    console.log(`   错误: ${error.message}`)
    errorCount++
  }
})

console.log(`\n修复完成!`)
console.log(`成功: ${successCount} 个文件`)
console.log(`失败: ${errorCount} 个文件`)
