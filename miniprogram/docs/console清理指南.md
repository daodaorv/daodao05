# Console.log 清理指南

**生成日期**: 2025-12-19
**涉及文件**: 52个
**console调用**: 约150处
**清理策略**: 分类处理 + 自动化工具

---

## 📊 Console使用统计

### 按文件类型分类

| 类型 | 文件数 | console数量 | 优先级 |
|------|--------|-------------|--------|
| API层 | 5 | 35 | 🔴 高 |
| Stores | 4 | 12 | 🔴 高 |
| Utils | 3 | 15 | 🔴 高 |
| Components | 2 | 10 | 🟡 中 |
| Pages | 35 | 75 | 🟡 中 |
| Scripts | 2 | 5 | 🟢 低（保留） |
| App.vue | 1 | 8 | 🟢 低（保留） |

### 按console类型分类

| 类型 | 数量 | 处理方式 |
|------|------|----------|
| console.log | 95 | 替换为logger.debug |
| console.error | 45 | 替换为logger.error |
| console.warn | 8 | 替换为logger.warn |
| console.info | 2 | 替换为logger.info |

---

## 🎯 清理策略

### 策略1: 保留的Console（不清理）

以下console调用应该保留：

#### 1. logger.ts 内部的console ✅
```typescript
// utils/logger.ts 内部使用console是正常的
console.log(formatted)
console.error(formatted)
console.warn(formatted)
```

#### 2. 构建脚本的console ✅
```javascript
// scripts/sync-uview-plus.js
console.log('[sync-uview-plus] copied uview-plus...')
console.error('[sync-uview-plus] failed to sync...')

// scripts/fix-uview-font.js
console.log('字体修复完成')
```

#### 3. App.vue的调试console（可选保留）
```javascript
// App.vue - 开发环境调试信息
console.log('🔍 ========== uView Plus 字体配置检查 ==========')
```

**建议**: 这些console可以保留，或者添加环境判断：
```javascript
if (process.env.NODE_ENV === 'development') {
  console.log('调试信息')
}
```

---

### 策略2: 必须清理的Console

#### 1. API层的console.log（35处）🔴

**文件清单**:
- `api/auth.ts` - 13处
- `api/points.ts` - 4处
- `api/vehicle.ts` - 2处
- `api/notification.ts` - 3处
- `api/mock/hosting.ts` - 已清理 ✅

**替换方案**:
```typescript
// 替换前
console.log('[Mock] 发送验证码到', phone)

// 替换后
import { logger } from '@/utils/logger'
logger.debug('发送验证码', { phone, type })
```

#### 2. Stores的console.error（12处）🔴

**文件清单**:
- `stores/user.ts` - 5处
- `stores/contact.ts` - 4处
- `stores/address.ts` - 4处
- `stores/vehicle.ts` - 4处

**替换方案**:
```typescript
// 替换前
console.error('获取用户信息失败:', error)

// 替换后
import { logger } from '@/utils/logger'
logger.error('获取用户信息失败', error)
```

#### 3. Utils的console（15处）🔴

**文件清单**:
- `utils/auth.ts` - 9处
- `utils/location.ts` - 6处

**替换方案**:
```typescript
// 替换前
console.log('[Auth] 登录信息已保存')
console.error('[Auth] 保存登录信息失败:', error)

// 替换后
import { logger } from '@/utils/logger'
logger.info('登录信息已保存')
logger.error('保存登录信息失败', error)
```

#### 4. Components的console（10处）🟡

**文件清单**:
- `components/business/BookingForm.vue` - 7处
- `components/business/RentDatePicker.vue` - 3处

**替换方案**:
```typescript
// 替换前
console.log('[BookingForm] 获取定位成功:', userLocation.value)
console.error('[BookingForm] 获取定位失败:', error)

// 替换后
import { logger } from '@/utils/logger'
logger.debug('获取定位成功', { location: userLocation.value })
logger.error('获取定位失败', error)
```

#### 5. Pages的console（75处）🟡

**文件清单**（部分）:
- `pages/auth/login.vue` - 15处
- `pages/profile/complete-info.vue` - 12处
- `pages/order/confirm.vue` - 5处
- `pages/tour/booking.vue` - 6处
- `pages/campsite/booking.vue` - 5处
- ... 其他30个页面

**替换方案**:
```typescript
// 替换前
console.log('[登录页面] 当前平台:', platform.value)
console.error('[微信登录] 登录失败:', error)

// 替换后
import { logger } from '@/utils/logger'
logger.debug('当前平台', { platform: platform.value })
logger.error('微信登录失败', error)
```

---

## 🛠️ 自动化清理方案

### 方案1: VSCode 批量替换（推荐）

#### 步骤1: 替换console.log
```regex
搜索: console\.log\(['"]([^'"]+)['"],?\s*([^)]*)\)
替换: logger.debug('$1', $2)
```

#### 步骤2: 替换console.error
```regex
搜索: console\.error\(['"]([^'"]+)['"],?\s*([^)]*)\)
替换: logger.error('$1', $2)
```

#### 步骤3: 替换console.warn
```regex
搜索: console\.warn\(['"]([^'"]+)['"],?\s*([^)]*)\)
替换: logger.warn('$1', $2)
```

#### 步骤4: 添加logger导入
在每个修改的文件顶部添加：
```typescript
import { logger } from '@/utils/logger'
```

### 方案2: 编写自动化脚本

创建 `scripts/replace-console.js`:

```javascript
const fs = require('fs')
const path = require('path')
const glob = require('glob')

// 需要处理的文件模式
const patterns = [
  'api/**/*.ts',
  'stores/**/*.ts',
  'utils/**/*.ts',
  'components/**/*.vue',
  'pages/**/*.vue'
]

// 排除的文件
const excludes = [
  'utils/logger.ts',
  'scripts/**/*'
]

// 替换规则
const replacements = [
  {
    pattern: /console\.log\(/g,
    replacement: 'logger.debug('
  },
  {
    pattern: /console\.error\(/g,
    replacement: 'logger.error('
  },
  {
    pattern: /console\.warn\(/g,
    replacement: 'logger.warn('
  },
  {
    pattern: /console\.info\(/g,
    replacement: 'logger.info('
  }
]

// 检查是否需要添加import
function needsLoggerImport(content) {
  return content.includes('logger.') && !content.includes("from '@/utils/logger'")
}

// 添加logger导入
function addLoggerImport(content) {
  // 对于.vue文件
  if (content.includes('<script>') || content.includes('<script setup>')) {
    return content.replace(
      /(<script[^>]*>)/,
      "$1\\nimport { logger } from '@/utils/logger'"
    )
  }
  // 对于.ts文件
  else {
    return "import { logger } from '@/utils/logger'\\n" + content
  }
}

// 处理单个文件
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let modified = false

  // 应用所有替换规则
  replacements.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement)
      modified = true
    }
  })

  // 如果修改了内容且需要添加import
  if (modified && needsLoggerImport(content)) {
    content = addLoggerImport(content)
  }

  // 写回文件
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`✅ 已处理: ${filePath}`)
    return true
  }

  return false
}

// 主函数
function main() {
  let totalFiles = 0
  let modifiedFiles = 0

  patterns.forEach(pattern => {
    const files = glob.sync(pattern, {
      cwd: path.join(__dirname, '..'),
      absolute: true,
      ignore: excludes
    })

    files.forEach(file => {
      totalFiles++
      if (processFile(file)) {
        modifiedFiles++
      }
    })
  })

  console.log(`\\n📊 处理完成:`)
  console.log(`   总文件数: ${totalFiles}`)
  console.log(`   修改文件数: ${modifiedFiles}`)
}

main()
```

**使用方法**:
```bash
cd miniprogram
node scripts/replace-console.js
```

---

## 📋 分阶段清理计划

### 第1阶段: 核心层清理（2小时）🔴

**优先级**: 最高
**文件**: API层 + Stores + Utils（12个文件）

1. ✅ `api/mock/hosting.ts` - 已完成
2. ⏳ `api/auth.ts` - 13处console
3. ⏳ `api/points.ts` - 4处console
4. ⏳ `api/vehicle.ts` - 2处console
5. ⏳ `api/notification.ts` - 3处console
6. ⏳ `stores/user.ts` - 5处console
7. ⏳ `stores/contact.ts` - 4处console
8. ⏳ `stores/address.ts` - 4处console
9. ⏳ `stores/vehicle.ts` - 4处console
10. ⏳ `utils/auth.ts` - 9处console
11. ⏳ `utils/location.ts` - 6处console

**预计工时**: 2小时

### 第2阶段: 组件层清理（1小时）🟡

**优先级**: 中
**文件**: Components（2个文件）

1. ⏳ `components/business/BookingForm.vue` - 7处
2. ⏳ `components/business/RentDatePicker.vue` - 3处

**预计工时**: 1小时

### 第3阶段: 页面层清理（3-4小时）🟡

**优先级**: 中低
**文件**: Pages（35个文件）

**建议**: 使用自动化脚本批量处理

**预计工时**: 3-4小时（手动）或 30分钟（脚本）

---

## ✅ 验收标准

### 清理完成标准

- ✅ 所有API层文件无console调用
- ✅ 所有Stores文件无console调用
- ✅ 所有Utils文件无console调用（logger.ts除外）
- ✅ 所有Components文件无console调用
- ✅ 所有Pages文件无console调用
- ✅ 所有文件正确导入logger
- ✅ 代码功能正常，无语法错误

### 保留的Console

- ✅ `utils/logger.ts` - logger内部实现
- ✅ `scripts/*.js` - 构建脚本
- ✅ `App.vue` - 可选保留（建议添加环境判断）

---

## 🎯 推荐执行方案

### 方案A: 手动清理（适合学习）

**优点**:
- 可以仔细审查每处console
- 理解代码逻辑
- 确保替换准确

**缺点**:
- 耗时较长（6-7小时）
- 容易遗漏

**适用场景**:
- 团队学习项目
- 需要深入理解代码

### 方案B: 自动化脚本（推荐）⭐

**优点**:
- 快速高效（30分钟）
- 不会遗漏
- 统一替换规则

**缺点**:
- 需要编写脚本
- 可能需要手动调整部分特殊情况

**适用场景**:
- 生产项目
- 快速迭代

### 方案C: 混合方案（最佳）⭐⭐⭐

**步骤**:
1. 手动清理核心层（API + Stores + Utils）- 2小时
2. 使用脚本清理组件和页面层 - 30分钟
3. 手动检查和调整特殊情况 - 30分钟

**总耗时**: 3小时

---

## 📝 注意事项

### 1. 特殊情况处理

#### 情况1: 带标签的console
```typescript
// 替换前
console.log('[Mock] 发送验证码到', phone)

// 替换后
logger.debug('发送验证码', { phone, tag: 'Mock' })
```

#### 情况2: 多参数console
```typescript
// 替换前
console.log('用户信息:', userId, userName, userAge)

// 替换后
logger.debug('用户信息', { userId, userName, userAge })
```

#### 情况3: 对象展开
```typescript
// 替换前
console.log('定位成功:', userLocation.value)

// 替换后
logger.debug('定位成功', { location: userLocation.value })
```

### 2. 导入语句位置

**Vue文件**:
```vue
<script>
import { logger } from '@/utils/logger'
import { ref } from 'vue'
// ... 其他导入
</script>
```

**TypeScript文件**:
```typescript
import { logger } from '@/utils/logger'
// ... 其他导入
```

### 3. 环境判断（可选）

如果希望在生产环境完全禁用日志：

```typescript
// utils/logger.ts 中已经实现了环境判断
// 生产环境会自动禁用DEBUG和INFO级别日志
```

---

## 🎉 预期效果

完成console清理后：

### 代码质量提升

- ✅ 统一的日志管理
- ✅ 更好的调试体验
- ✅ 生产环境性能优化
- ✅ 符合CLAUDE.md规范

### 评分提升

| 维度 | 清理前 | 清理后 | 提升 |
|------|--------|--------|------|
| 代码规范性 | 85/100 | 90/100 | +5分 |
| 调试体验 | 70/100 | 90/100 | +20分 |
| 生产性能 | 80/100 | 95/100 | +15分 |
| **综合评分** | **85/100** | **90/100** | **+5分** |

---

## 📚 参考资料

### Logger使用文档

详见: [utils/logger.ts](../utils/logger.ts)

### 相关文档

- [代码审查报告](./小程序端代码审查报告.md)
- [短期优化完成报告](./短期优化完成报告.md)

---

**文档版本**: v1.0
**最后更新**: 2025-12-19
**下次更新**: 完成console清理后
