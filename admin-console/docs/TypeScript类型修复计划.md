# TypeScript 类型修复计划

**创建时间**: 2025-12-14
**当前状态**: 184 个类型错误
**修复策略**: 分阶段逐步修复

---

## 📊 类型错误统计

### 总体情况

- **总错误数**: 184 个
- **已修复**: 0 个
- **待修复**: 184 个
- **修复进度**: 0%

### 错误分类

| 分类 | 数量 | 优先级 | 状态 |
|------|------|--------|------|
| 价格策略相关 | 28 | P0 | 🔄 进行中 |
| 通用组件类型 | 45 | P1 | ⏸️ 待处理 |
| 业务模块类型 | 89 | P2 | ⏸️ 待处理 |
| 其他类型错误 | 22 | P3 | ⏸️ 待处理 |

---

## 🎯 修复策略

### 阶段一：价格策略核心文件（本次）

**目标**: 修复新增/修改的价格策略相关文件的类型错误

**范围**:
1. ✅ `src/api/priceCalendar.ts` (7个错误)
2. ✅ `src/components/marketing/CityFactorList.vue` (2个错误)
3. ✅ `src/components/marketing/CustomTimeRuleList.vue` (2个错误)
4. ✅ `src/components/marketing/NationalHolidayList.vue` (1个错误)
5. ✅ `src/components/marketing/OtherPriceRuleList.vue` (3个错误)
6. ✅ `src/components/marketing/PriceCalendarCell.vue` (1个错误)
7. ✅ `src/components/marketing/WeekCalendarView.vue` (3个错误)
8. ✅ `src/views/marketing/PriceCalendar.vue` (9个错误)

**预计时间**: 1-2 小时

### 阶段二：通用组件类型完善（下次）

**目标**: 修复通用组件的类型定义

**范围**:
- `src/components/common/StatsCard.vue`
- `src/components/common/SearchForm.vue`
- `src/components/common/DataTable.vue`
- `src/components/common/FormDialog.vue`
- `src/components/common/BatchOperation.vue`

**预计时间**: 2-3 小时

### 阶段三：业务模块类型修复（后续）

**目标**: 逐步修复各业务模块的类型错误

**范围**:
- 用户管理模块
- 订单管理模块
- 分润管理模块
- 供应商管理模块
- 其他业务模块

**预计时间**: 5-8 小时

---

## 📋 详细错误清单

### 价格策略相关错误（28个）

#### src/api/priceCalendar.ts (7个)

```typescript
// 错误 1: Line 117
// 'storeRes' is of type 'unknown'
const storeRes = await getStoreDetail(storeId)
const store = storeRes.data // ❌ 类型错误

// 修复方案：添加类型断言或类型守卫
const storeRes = await getStoreDetail(storeId) as StoreDetailResponse
const store = storeRes.data // ✅ 修复后

// 错误 2-3: Line 141, 219
// PriceCalculationRequest 类型不匹配
// 缺少字段: modelName, basePrice, cityName

// 修复方案：统一类型定义或添加类型转换

// 错误 4-7: Line 147, 148, 151, 223
// PriceCalculationResult 缺少字段: timeFactor, dailyRental

// 修复方案：更新 pricingHelper 返回类型
```

#### src/components/marketing/CityFactorList.vue (2个)

```typescript
// 错误 1: Line 34
// Type 'string' is not assignable to type 'EpPropMergeType<...>'
<el-tag :type="getFactorTypeTag(row.adjustmentType)">

// 修复方案：使用类型断言
<el-tag :type="getFactorTypeTag(row.adjustmentType) as any">

// 错误 2: Line 264
// computed() 类型不匹配

// 修复方案：明确指定返回类型
const formFields = computed<FormField[]>(() => [...])
```

#### src/views/marketing/PriceCalendar.vue (9个)

```typescript
// 错误 1-6: Line 184, 187, 190, 193
// '__VLS_ctx.calendarData' is possibly 'null'

// 修复方案：添加可选链或空值检查
{{ calendarData?.summary.avgPrice }}

// 错误 7: Line 244
// '"@/api/store"' has no exported member named 'getStores'

// 修复方案：使用正确的导入
import { getStoreList } from '@/api/store'

// 错误 8-9: Line 245, 246
// Cannot find module '@/types/vehicle' or '@/types/store'

// 修复方案：使用正确的类型导入路径
import type { VehicleModel } from '@/api/vehicle'
import type { Store } from '@/api/store'
```

---

## 🔧 通用修复模式

### 模式 1: Element Plus 组件类型

**问题**: Element Plus 组件的 props 类型过于严格

```typescript
// ❌ 错误
<el-tag :type="dynamicType">

// ✅ 修复方案 1: 类型断言
<el-tag :type="dynamicType as any">

// ✅ 修复方案 2: 类型守卫
const tagType = (type: string): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
  const validTypes = ['primary', 'success', 'warning', 'danger', 'info']
  return validTypes.includes(type) ? type as any : 'info'
}
```

### 模式 2: API 响应类型

**问题**: API 响应类型为 unknown

```typescript
// ❌ 错误
const res = await getStoreDetail(id)
const store = res.data // unknown

// ✅ 修复方案 1: 类型断言
const res = await getStoreDetail(id) as StoreDetailResponse
const store = res.data

// ✅ 修复方案 2: 类型守卫
interface StoreDetailResponse {
  data: Store
  message: string
}
const res = await getStoreDetail(id) as StoreDetailResponse
```

### 模式 3: 可选链和空值检查

**问题**: 对象可能为 null 或 undefined

```typescript
// ❌ 错误
{{ calendarData.summary.avgPrice }}

// ✅ 修复方案 1: 可选链
{{ calendarData?.summary?.avgPrice }}

// ✅ 修复方案 2: 空值合并
{{ calendarData?.summary?.avgPrice ?? 0 }}

// ✅ 修复方案 3: 类型守卫
const avgPrice = computed(() => {
  if (!calendarData.value) return 0
  return calendarData.value.summary.avgPrice
})
```

### 模式 4: Computed 类型

**问题**: computed() 返回类型推断失败

```typescript
// ❌ 错误
const formFields = computed(() => [...])

// ✅ 修复方案: 明确指定类型
const formFields = computed<FormField[]>(() => [...])
```

---

## 📝 修复记录

### 2025-12-14

#### 已修复

- [ ] `src/api/priceCalendar.ts` - 7个错误
- [ ] `src/components/marketing/CityFactorList.vue` - 2个错误
- [ ] `src/components/marketing/CustomTimeRuleList.vue` - 2个错误
- [ ] `src/components/marketing/NationalHolidayList.vue` - 1个错误
- [ ] `src/components/marketing/OtherPriceRuleList.vue` - 3个错误
- [ ] `src/components/marketing/PriceCalendarCell.vue` - 1个错误
- [ ] `src/components/marketing/WeekCalendarView.vue` - 3个错误
- [ ] `src/views/marketing/PriceCalendar.vue` - 9个错误

#### 待修复

- [ ] 通用组件类型完善（45个错误）
- [ ] 业务模块类型修复（89个错误）
- [ ] 其他类型错误（22个错误）

---

## 🎯 长期目标

### 目标 1: 类型覆盖率 100%

- 当前: ~85%
- 目标: 100%
- 预计完成: 2025-12-31

### 目标 2: 移除所有 @ts-nocheck

- 当前: 约 20 个文件使用 @ts-nocheck
- 目标: 0 个文件使用 @ts-nocheck
- 预计完成: 2025-12-31

### 目标 3: 启用严格模式

- 当前: 部分严格模式选项已启用
- 目标: 启用所有严格模式选项
- 预计完成: 2026-01-15

---

## 📚 参考资源

### TypeScript 官方文档

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Type Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### Element Plus 类型

- [Element Plus TypeScript Support](https://element-plus.org/en-US/guide/typescript.html)
- [Component Props Types](https://github.com/element-plus/element-plus/tree/dev/packages/components)

### Vue 3 类型

- [Vue 3 TypeScript Support](https://vuejs.org/guide/typescript/overview.html)
- [Composition API with TypeScript](https://vuejs.org/guide/typescript/composition-api.html)

---

## 💡 最佳实践

### 1. 优先使用类型推断

```typescript
// ✅ 好的做法
const count = ref(0) // 自动推断为 Ref<number>

// ❌ 不必要的类型注解
const count: Ref<number> = ref(0)
```

### 2. 为复杂类型添加注解

```typescript
// ✅ 好的做法
const formData = reactive<FormData>({
  name: '',
  age: 0
})

// ❌ 类型不明确
const formData = reactive({
  name: '',
  age: 0
})
```

### 3. 使用类型守卫

```typescript
// ✅ 好的做法
function isStore(obj: unknown): obj is Store {
  return typeof obj === 'object' && obj !== null && 'id' in obj
}

if (isStore(data)) {
  console.log(data.name) // 类型安全
}
```

### 4. 避免使用 any

```typescript
// ❌ 避免
const data: any = await fetchData()

// ✅ 使用 unknown 并进行类型检查
const data: unknown = await fetchData()
if (isValidData(data)) {
  // 类型安全的使用
}
```

---

**文档维护**: 每次修复类型错误后更新此文档
**下次更新**: 完成阶段一修复后
