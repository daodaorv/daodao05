#!/usr/bin/env node

/**
 * 代码质量检查脚本
 * 用于 Git pre-commit hook 和 CI/CD 流程
 */

import { execSync } from 'child_process'
import { exit } from 'process'

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

function runCommand(command, description) {
  log(`\n🔍 ${description}...`, 'cyan')
  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' })
    log(`✅ ${description} 通过`, 'green')
    return { success: true, output }
  } catch (error) {
    log(`❌ ${description} 失败`, 'red')
    if (error.stdout) {
      console.log(error.stdout)
    }
    if (error.stderr) {
      console.error(error.stderr)
    }
    return { success: false, error }
  }
}

function checkESLintWarnings(output) {
  const warningMatch = output.match(/(\d+)\s+warnings?/)
  const errorMatch = output.match(/(\d+)\s+errors?/)

  const warnings = warningMatch ? parseInt(warningMatch[1]) : 0
  const errors = errorMatch ? parseInt(errorMatch[1]) : 0

  return { warnings, errors }
}

async function main() {
  log('\n╔════════════════════════════════════════╗', 'blue')
  log('║   代码质量门禁检查 - Quality Gate   ║', 'blue')
  log('╚════════════════════════════════════════╝\n', 'blue')

  let hasErrors = false

  // 1. ESLint 检查
  const lintResult = runCommand('npm run lint', 'ESLint 代码规范检查')
  if (!lintResult.success) {
    hasErrors = true
  } else {
    // 检查是否有警告
    const { warnings, errors } = checkESLintWarnings(lintResult.output)
    if (warnings > 0 || errors > 0) {
      log(`\n⚠️  发现 ${errors} 个错误和 ${warnings} 个警告`, 'yellow')
      log('❌ 代码质量门禁要求: 0 errors, 0 warnings', 'red')
      hasErrors = true
    } else {
      log('✨ ESLint: 0 errors, 0 warnings', 'green')
    }
  }

  // 2. TypeScript 类型检查
  const typeCheckResult = runCommand('npm run type-check', 'TypeScript 类型检查')
  if (!typeCheckResult.success) {
    hasErrors = true
  }

  // 3. 构建测试（可选，根据需要启用）
  // const buildResult = runCommand('npm run build', '构建测试')
  // if (!buildResult.success) {
  //   hasErrors = true
  // }

  // 输出最终结果
  log('\n' + '='.repeat(50), 'blue')
  if (hasErrors) {
    log('\n❌ 代码质量门禁检查失败！', 'red')
    log('\n请修复以上问题后再提交代码。', 'yellow')
    log('提示: 运行 npm run lint 和 npm run type-check 查看详细错误\n', 'cyan')
    exit(1)
  } else {
    log('\n✅ 所有代码质量检查通过！', 'green')
    log('🎉 代码符合质量标准，可以提交。\n', 'green')
    exit(0)
  }
}

main().catch((error) => {
  log('\n❌ 质量检查过程出错:', 'red')
  console.error(error)
  exit(1)
})
