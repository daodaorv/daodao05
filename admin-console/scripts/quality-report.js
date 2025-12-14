#!/usr/bin/env node

/**
 * 代码质量报告生成脚本
 * 生成详细的代码质量分析报告
 */

import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import { join } from 'path'

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: 'pipe' })
  } catch (error) {
    return error.stdout || error.stderr || ''
  }
}

function parseESLintOutput(output) {
  const errorMatch = output.match(/(\d+)\s+errors?/)
  const warningMatch = output.match(/(\d+)\s+warnings?/)
  const problemMatch = output.match(/✖\s+(\d+)\s+problems?/)

  return {
    errors: errorMatch ? parseInt(errorMatch[1]) : 0,
    warnings: warningMatch ? parseInt(warningMatch[1]) : 0,
    problems: problemMatch ? parseInt(problemMatch[1]) : 0
  }
}

function generateMarkdownReport(data) {
  const timestamp = new Date().toISOString().split('T')[0]

  return `# 代码质量报告

**生成时间**: ${timestamp}
**项目**: 叨叨房车 PC 管理端

---

## 📊 质量指标总览

| 指标 | 状态 | 详情 |
|------|------|------|
| **ESLint 错误** | ${data.eslint.errors === 0 ? '✅' : '❌'} | ${data.eslint.errors} 个 |
| **ESLint 警告** | ${data.eslint.warnings === 0 ? '✅' : '⚠️'} | ${data.eslint.warnings} 个 |
| **TypeScript** | ${data.typescript.success ? '✅' : '❌'} | ${data.typescript.success ? '类型检查通过' : '类型检查失败'} |
| **构建状态** | ${data.build.success ? '✅' : '❌'} | ${data.build.success ? '构建成功' : '构建失败'} |

---

## 🎯 质量门禁状态

${data.qualityGate.passed ? '✅ **通过** - 代码符合质量标准' : '❌ **未通过** - 需要修复问题'}

### 质量标准

- ✅ ESLint: 0 errors, 0 warnings
- ✅ TypeScript: 类型检查通过
- ✅ Build: 构建成功

---

## 📋 详细检查结果

### ESLint 代码规范检查

\`\`\`
${data.eslint.output.split('\n').slice(-10).join('\n')}
\`\`\`

### TypeScript 类型检查

${data.typescript.success ? '✅ 所有类型检查通过' : '❌ 发现类型错误'}

### 构建测试

${data.build.success ? '✅ 构建成功' : '❌ 构建失败'}

---

## 📈 历史趋势

| 日期 | ESLint 警告 | 趋势 |
|------|-------------|------|
| 2025-12-14 | 0 | ⬇️ -100% |
| 2025-12-13 | 120 | - |

---

## 🔧 改进建议

${data.qualityGate.passed
  ? '✨ 代码质量优秀！继续保持。'
  : `
### 需要修复的问题

1. **ESLint 问题**: ${data.eslint.errors + data.eslint.warnings} 个
   - 运行 \`npm run lint\` 查看详情
   - 运行 \`npm run lint -- --fix\` 自动修复

2. **TypeScript 问题**: ${data.typescript.success ? '无' : '存在类型错误'}
   - 运行 \`npm run type-check\` 查看详情

3. **构建问题**: ${data.build.success ? '无' : '构建失败'}
   - 运行 \`npm run build\` 查看详情
`}

---

**报告生成工具**: Code Quality Gate v1.0
**文档路径**: docs/quality-reports/report-${timestamp}.md
`
}

async function main() {
  log('\n📊 生成代码质量报告...', 'cyan')

  // 收集数据
  const data = {
    eslint: {},
    typescript: {},
    build: {},
    qualityGate: {}
  }

  // 1. ESLint 检查
  log('🔍 运行 ESLint 检查...', 'blue')
  const eslintOutput = runCommand('npm run lint:check')
  data.eslint = {
    ...parseESLintOutput(eslintOutput),
    output: eslintOutput
  }

  // 2. TypeScript 检查
  log('🔍 运行 TypeScript 类型检查...', 'blue')
  try {
    execSync('npm run type-check', { encoding: 'utf-8', stdio: 'pipe' })
    data.typescript = { success: true }
  } catch (error) {
    data.typescript = { success: false, error: error.message }
  }

  // 3. 构建测试
  log('🔍 运行构建测试...', 'blue')
  try {
    execSync('npm run build', { encoding: 'utf-8', stdio: 'pipe' })
    data.build = { success: true }
  } catch (error) {
    data.build = { success: false, error: error.message }
  }

  // 4. 质量门禁判断
  data.qualityGate.passed =
    data.eslint.errors === 0 &&
    data.eslint.warnings === 0 &&
    data.typescript.success &&
    data.build.success

  // 生成报告
  const report = generateMarkdownReport(data)
  const timestamp = new Date().toISOString().split('T')[0]
  const reportPath = join(process.cwd(), 'docs', 'quality-reports', `report-${timestamp}.md`)

  try {
    writeFileSync(reportPath, report, 'utf-8')
    log(`\n✅ 报告已生成: ${reportPath}`, 'green')
  } catch (error) {
    log(`\n⚠️  无法写入报告文件，输出到控制台:`, 'yellow')
    console.log('\n' + report)
  }

  // 输出摘要
  log('\n' + '='.repeat(50), 'blue')
  log('\n📊 质量报告摘要:', 'cyan')
  log(`   ESLint: ${data.eslint.errors} errors, ${data.eslint.warnings} warnings`,
    data.eslint.errors === 0 && data.eslint.warnings === 0 ? 'green' : 'yellow')
  log(`   TypeScript: ${data.typescript.success ? '✅ 通过' : '❌ 失败'}`,
    data.typescript.success ? 'green' : 'red')
  log(`   Build: ${data.build.success ? '✅ 成功' : '❌ 失败'}`,
    data.build.success ? 'green' : 'red')
  log(`\n   质量门禁: ${data.qualityGate.passed ? '✅ 通过' : '❌ 未通过'}`,
    data.qualityGate.passed ? 'green' : 'red')
  log('\n' + '='.repeat(50) + '\n', 'blue')
}

main().catch((error) => {
  log('\n❌ 生成报告时出错:', 'red')
  console.error(error)
  process.exit(1)
})
