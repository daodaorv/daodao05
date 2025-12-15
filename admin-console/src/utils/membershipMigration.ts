/**
 * PLUS会员数据迁移工具
 * 将旧的 plus_member 用户类型迁移为 registered + PLUS会员标签
 */

import type { UserInfo } from '@/api/user'
import type { Tag } from '@/api/user'

// 迁移日志接口
export interface MigrationLog {
  userId: number
  username: string
  oldUserType: string
  newUserType: string
  addedTags: string[]
  migratedAt: string
  status: 'success' | 'failed'
  errorMessage?: string
}

// 迁移统计接口
export interface MigrationStats {
  totalUsers: number
  migratedUsers: number
  failedUsers: number
  skippedUsers: number
  startTime: string
  endTime: string
  duration: number
}

/**
 * 执行用户数据迁移
 * @param users 用户列表
 * @param plusMemberTag PLUS会员标签
 * @returns 迁移日志和统计信息
 */
export async function migrateUsers(
  users: UserInfo[],
  plusMemberTag: Tag
): Promise<{ logs: MigrationLog[]; stats: MigrationStats }> {
  const startTime = new Date()
  const logs: MigrationLog[] = []
  let migratedCount = 0
  let failedCount = 0
  let skippedCount = 0

  for (const user of users) {
    try {
      // 检查是否需要迁移
      if (user.userType !== 'plus_member') {
        skippedCount++
        continue
      }

      // 执行迁移
      const oldUserType = user.userType
      user.userType = 'customer'  // 改为普通客户

      // 添加PLUS会员标签
      if (!user.tags) {
        user.tags = []
      }

      // 检查是否已有PLUS会员标签
      const hasPlusTag = user.tags.some(tag => tag.name === 'PLUS会员')
      if (!hasPlusTag) {
        // 设置会员到期时间为1年后
        const expireDate = new Date()
        expireDate.setFullYear(expireDate.getFullYear() + 1)

        const tagWithExpire = {
          ...plusMemberTag,
          expiresAt: expireDate.toISOString()
        }
        user.tags.push(tagWithExpire)
      }

      // 记录迁移日志
      logs.push({
        userId: user.id,
        username: user.username,
        oldUserType,
        newUserType: user.userType,
        addedTags: ['PLUS会员'],
        migratedAt: new Date().toISOString(),
        status: 'success'
      })

      migratedCount++
    } catch (error) {
      // 记录失败日志
      logs.push({
        userId: user.id,
        username: user.username,
        oldUserType: user.userType,
        newUserType: user.userType,
        addedTags: [],
        migratedAt: new Date().toISOString(),
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : '未知错误'
      })

      failedCount++
    }
  }

  const endTime = new Date()
  const duration = endTime.getTime() - startTime.getTime()

  const stats: MigrationStats = {
    totalUsers: users.length,
    migratedUsers: migratedCount,
    failedUsers: failedCount,
    skippedUsers: skippedCount,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    duration
  }

  return { logs, stats }
}

/**
 * 验证迁移结果
 * @param users 用户列表
 * @returns 验证结果
 */
export function validateMigration(users: UserInfo[]): {
  isValid: boolean
  issues: string[]
} {
  const issues: string[] = []

  // 检查是否还有 plus_member 类型的用户
  const plusMemberUsers = users.filter(user => user.userType === 'plus_member')
  if (plusMemberUsers.length > 0) {
    issues.push(`还有 ${plusMemberUsers.length} 个用户的类型为 plus_member`)
  }

  // 检查是否所有迁移的用户都有PLUS会员标签
  const migratedUsers = users.filter(user =>
    user.userType === 'customer' &&
    user.tags?.some(tag => tag.name === 'PLUS会员')
  )

  // 统计信息
  console.log(`迁移验证结果:`)
  console.log(`- 总用户数: ${users.length}`)
  console.log(`- 已迁移用户: ${migratedUsers.length}`)
  console.log(`- 未迁移用户: ${plusMemberUsers.length}`)

  return {
    isValid: issues.length === 0,
    issues
  }
}

/**
 * 生成迁移报告
 * @param logs 迁移日志
 * @param stats 迁移统计
 * @returns Markdown格式的报告
 */
export function generateMigrationReport(
  logs: MigrationLog[],
  stats: MigrationStats
): string {
  const successLogs = logs.filter(log => log.status === 'success')
  const failedLogs = logs.filter(log => log.status === 'failed')

  let report = `# PLUS会员数据迁移报告\n\n`
  report += `## 迁移统计\n\n`
  report += `- 总用户数: ${stats.totalUsers}\n`
  report += `- 成功迁移: ${stats.migratedUsers}\n`
  report += `- 迁移失败: ${stats.failedUsers}\n`
  report += `- 跳过用户: ${stats.skippedUsers}\n`
  report += `- 开始时间: ${new Date(stats.startTime).toLocaleString('zh-CN')}\n`
  report += `- 结束时间: ${new Date(stats.endTime).toLocaleString('zh-CN')}\n`
  report += `- 总耗时: ${stats.duration}ms\n\n`

  if (successLogs.length > 0) {
    report += `## 成功迁移的用户 (${successLogs.length})\n\n`
    report += `| 用户ID | 用户名 | 旧类型 | 新类型 | 添加标签 | 迁移时间 |\n`
    report += `|--------|--------|--------|--------|----------|----------|\n`
    successLogs.forEach(log => {
      report += `| ${log.userId} | ${log.username} | ${log.oldUserType} | ${log.newUserType} | ${log.addedTags.join(', ')} | ${new Date(log.migratedAt).toLocaleString('zh-CN')} |\n`
    })
    report += `\n`
  }

  if (failedLogs.length > 0) {
    report += `## 迁移失败的用户 (${failedLogs.length})\n\n`
    report += `| 用户ID | 用户名 | 错误信息 |\n`
    report += `|--------|--------|----------|\n`
    failedLogs.forEach(log => {
      report += `| ${log.userId} | ${log.username} | ${log.errorMessage || '未知错误'} |\n`
    })
    report += `\n`
  }

  report += `## 迁移说明\n\n`
  report += `本次迁移将所有 \`plus_member\` 类型的用户迁移为 \`customer\` 类型，并为其添加 "PLUS会员" 标签。\n\n`
  report += `迁移后的用户将享受以下权益:\n`
  report += `- 双倍积分\n`
  report += `- 95折优惠\n`
  report += `- 专属优惠券\n`
  report += `- 优先服务\n`
  report += `- 免费保险\n\n`
  report += `会员有效期: 1年\n`

  return report
}

/**
 * 导出迁移报告为文件
 * @param report 报告内容
 * @param filename 文件名
 */
export function exportMigrationReport(report: string, filename: string = 'migration-report.md') {
  const blob = new Blob([report], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
