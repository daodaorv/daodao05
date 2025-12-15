/**
 * 导入导出工具函数
 */
import { ElMessage } from 'element-plus'

/**
 * 导出数据为 CSV 文件
 * @param data 要导出的数据数组
 * @param columns 列配置 { key: string, label: string }[]
 * @param filename 文件名(不含扩展名)
 */
export function exportToCSV(
  data: any[],
  columns: Array<{ key: string; label: string }>,
  filename: string
) {
  try {
    // 生成 CSV 表头
    const headers = columns.map(col => col.label).join(',')

    // 生成 CSV 数据行
    const rows = data.map(item => {
      return columns.map(col => {
        let value = item[col.key]

        // 处理特殊值
        if (value === null || value === undefined) {
          value = ''
        } else if (typeof value === 'object') {
          value = JSON.stringify(value)
        } else {
          value = String(value)
        }

        // 如果值包含逗号、引号或换行符,需要用引号包裹并转义
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value.replace(/"/g, '""')}"`
        }

        return value
      }).join(',')
    })

    // 合并表头和数据
    const csvContent = [headers, ...rows].join('\n')

    // 创建 Blob 并下载
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}_${formatDate(new Date())}.csv`
    link.click()

    ElMessage.success(`导出成功: ${data.length} 条数据`)
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败,请重试')
  }
}

/**
 * 导出数据为 Excel 文件(使用 CSV 格式,Excel 可以打开)
 * @param data 要导出的数据数组
 * @param columns 列配置
 * @param filename 文件名
 */
export function exportToExcel(
  data: any[],
  columns: Array<{ key: string; label: string }>,
  filename: string
) {
  // 目前使用 CSV 格式,Excel 可以直接打开
  // 如果需要真正的 Excel 格式,可以使用 xlsx 库
  exportToCSV(data, columns, filename)
}

/**
 * 下载导入模板
 * @param columns 列配置
 * @param filename 文件名
 * @param sampleData 示例数据(可选)
 */
export function downloadImportTemplate(
  columns: Array<{ key: string; label: string }>,
  filename: string,
  sampleData?: any[]
) {
  try {
    // 生成表头
    const headers = columns.map(col => col.label).join(',')

    // 生成示例数据行
    const rows = sampleData ? sampleData.map(item => {
      return columns.map(col => {
        const value = item[col.key] || ''
        return String(value)
      }).join(',')
    }) : []

    // 合并表头和示例数据
    const csvContent = [headers, ...rows].join('\n')

    // 创建 Blob 并下载
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}_导入模板.csv`
    link.click()

    ElMessage.success('模板下载成功')
  } catch (error) {
    console.error('模板下载失败:', error)
    ElMessage.error('模板下载失败,请重试')
  }
}

/**
 * 解析 CSV 文件
 * @param file CSV 文件
 * @returns Promise<any[]> 解析后的数据数组
 */
export function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())

        if (lines.length < 2) {
          reject(new Error('文件内容为空或格式不正确'))
          return
        }

        // 解析表头
        const headers = parseCSVLine(lines[0])

        // 解析数据行
        const data = lines.slice(1).map((line, index) => {
          const values = parseCSVLine(line)
          const row: any = { _rowNumber: index + 2 } // 行号从2开始(1是表头)

          headers.forEach((header, i) => {
            row[header] = values[i] || ''
          })

          return row
        })

        resolve(data)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }

    reader.readAsText(file, 'UTF-8')
  })
}

/**
 * 解析 CSV 行(处理引号和逗号)
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // 转义的引号
        current += '"'
        i++
      } else {
        // 切换引号状态
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      // 字段分隔符
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  // 添加最后一个字段
  result.push(current.trim())

  return result
}

/**
 * 格式化日期为文件名友好格式
 */
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}${month}${day}_${hours}${minutes}${seconds}`
}

/**
 * 验证导入数据
 * @param data 导入的数据
 * @param rules 验证规则 { field: string, required?: boolean, validator?: (value: any) => boolean | string }[]
 * @returns { valid: boolean, errors: Array<{ row: number, field: string, message: string }> }
 */
export function validateImportData(
  data: any[],
  rules: Array<{
    field: string
    label: string
    required?: boolean
    validator?: (value: any, row: any) => boolean | string
  }>
) {
  const errors: Array<{ row: number; field: string; message: string }> = []

  data.forEach((row) => {
    rules.forEach((rule) => {
      const value = row[rule.label] || row[rule.field]

      // 必填验证
      if (rule.required && (!value || String(value).trim() === '')) {
        errors.push({
          row: row._rowNumber || 0,
          field: rule.label,
          message: `${rule.label}不能为空`
        })
        return
      }

      // 自定义验证
      if (rule.validator && value) {
        const result = rule.validator(value, row)
        if (result !== true) {
          errors.push({
            row: row._rowNumber || 0,
            field: rule.label,
            message: typeof result === 'string' ? result : `${rule.label}格式不正确`
          })
        }
      }
    })
  })

  return {
    valid: errors.length === 0,
    errors
  }
}
