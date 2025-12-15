# 通用组件使用文档

本目录包含移动管理端的通用组件库，所有组件都支持响应式设计和跨页面复用。

---

## 📦 组件列表

### 1. ImageUploader - 图片上传组件

**文件**: `ImageUploader.vue`

**功能**: 图片选择、上传、预览和管理，支持多图上传、上传进度显示、图片压缩

**Props**:
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | Array | [] | 已上传的图片URL数组（支持v-model） |
| maxCount | Number | 9 | 最大上传数量 |
| disabled | Boolean | false | 是否禁用 |
| compress | Boolean | true | 是否压缩图片 |
| uploadUrl | String | '/api/v1/upload/image' | 上传地址 |
| addText | String | '添加图片' | 添加按钮文字 |
| tip | String | '' | 提示文字 |
| useMock | Boolean | true | 是否使用Mock上传 |

**事件**:
| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 图片列表变化时触发 | urls: Array |
| change | 图片列表变化时触发 | urls: Array |
| upload-success | 单张图片上传成功时触发 | result: Object |
| upload-error | 单张图片上传失败时触发 | error: Error |

**使用示例**:
```vue
<template>
  <view>
    <!-- 基础用法 -->
    <ImageUploader
      v-model="imageList"
      :max-count="6"
      @change="handleChange"
    />

    <!-- 自定义配置 -->
    <ImageUploader
      v-model="vehicleImages"
      :max-count="9"
      :compress="true"
      upload-url="/api/v1/vehicles/upload"
      add-text="上传车辆照片"
      tip="最多上传9张，每张不超过2MB"
      @upload-success="handleUploadSuccess"
      @upload-error="handleUploadError"
    />

    <!-- 禁用状态 -->
    <ImageUploader
      v-model="readonlyImages"
      :disabled="true"
    />
  </view>
</template>

<script>
import ImageUploader from '@/components/common/ImageUploader.vue'

export default {
  components: {
    ImageUploader
  },
  data() {
    return {
      imageList: [],
      vehicleImages: [],
      readonlyImages: ['https://example.com/image1.jpg']
    }
  },
  methods: {
    handleChange(urls) {
      console.log('图片列表变化:', urls)
    },
    handleUploadSuccess(result) {
      console.log('上传成功:', result)
    },
    handleUploadError(error) {
      console.error('上传失败:', error)
    }
  }
}
</script>
```

---

### 2. LoadingSpinner - 加载状态组件

**文件**: `LoadingSpinner.vue`

**功能**: 显示加载状态，支持全屏和局部加载

**Props**:
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| fullscreen | Boolean | false | 是否全屏显示 |
| text | String | '加载中...' | 加载提示文字 |
| size | Number | 60 | 加载图标尺寸（rpx） |

**使用示例**:
```vue
<template>
  <!-- 局部加载 -->
  <LoadingSpinner text="数据加载中..." />

  <!-- 全屏加载 -->
  <LoadingSpinner fullscreen text="请稍候..." :size="80" />
</template>

<script>
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  components: {
    LoadingSpinner
  }
}
</script>
```

---

### 2. EmptyState - 空状态提示组件

**文件**: `EmptyState.vue`

**功能**: 显示空状态提示，支持自定义图标、文字和操作按钮

**Props**:
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| icon | String | '📭' | 图标（emoji） |
| title | String | '暂无数据' | 标题文字 |
| description | String | '' | 描述文字 |
| buttonText | String | '' | 按钮文字（为空则不显示按钮） |
| buttonType | String | 'default' | 按钮类型 |

**事件**:
| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| click | 点击按钮时触发 | - |

**使用示例**:
```vue
<template>
  <!-- 基础用法 -->
  <EmptyState
    icon="📋"
    title="暂无订单"
    description="您还没有创建任何订单"
  />

  <!-- 带操作按钮 -->
  <EmptyState
    icon="🚗"
    title="暂无车辆"
    description="请先添加车辆信息"
    buttonText="添加车辆"
    buttonType="primary"
    @click="handleAddVehicle"
  />
</template>

<script>
import EmptyState from '@/components/common/EmptyState.vue'

export default {
  components: {
    EmptyState
  },
  methods: {
    handleAddVehicle() {
      // 处理添加车辆
    }
  }
}
</script>
```

---

### 3. ErrorBoundary - 错误处理组件

**文件**: `ErrorBoundary.vue`

**功能**: 捕获和处理组件错误，提供友好的错误提示和重试功能

**事件**:
| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| error | 捕获到错误时触发 | error: Error对象 |
| retry | 点击重试按钮时触发 | - |
| reload | 重新加载时触发 | - |

**使用示例**:
```vue
<template>
  <ErrorBoundary @error="handleError" @retry="handleRetry">
    <!-- 包裹可能出错的内容 -->
    <YourComponent />
  </ErrorBoundary>
</template>

<script>
import ErrorBoundary from '@/components/common/ErrorBoundary.vue'

export default {
  components: {
    ErrorBoundary
  },
  methods: {
    handleError(error) {
      console.error('组件错误:', error)
    },
    handleRetry() {
      // 重新加载数据
      this.loadData()
    }
  }
}
</script>
```

---

### 4. ConfirmDialog - 确认对话框组件

**文件**: `ConfirmDialog.vue`

**功能**: 显示确认对话框，支持自定义标题、内容和按钮

**Props**:
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| visible | Boolean | false | 是否显示对话框（支持v-model） |
| title | String | '提示' | 对话框标题 |
| message | String | - | 消息内容（必填） |
| confirmText | String | '确定' | 确认按钮文字 |
| cancelText | String | '取消' | 取消按钮文字 |
| showCancel | Boolean | true | 是否显示取消按钮 |
| type | String | 'default' | 类型（default/danger） |
| closeOnClickOverlay | Boolean | false | 点击遮罩是否关闭 |

**事件**:
| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| confirm | 点击确认按钮时触发 | - |
| cancel | 点击取消按钮时触发 | - |
| update:visible | 对话框显示状态改变时触发 | visible: Boolean |

**使用示例**:
```vue
<template>
  <view>
    <button @click="showDialog">删除订单</button>

    <ConfirmDialog
      v-model:visible="dialogVisible"
      title="删除确认"
      message="确定要删除这个订单吗？此操作不可撤销。"
      type="danger"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </view>
</template>

<script>
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

export default {
  components: {
    ConfirmDialog
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    showDialog() {
      this.dialogVisible = true
    },
    handleConfirm() {
      // 执行删除操作
      console.log('确认删除')
    },
    handleCancel() {
      console.log('取消删除')
    }
  }
}
</script>
```

---

### 5. StatusBadge - 状态徽章组件

**文件**: `StatusBadge.vue`

**功能**: 显示状态徽章，支持多种预设样式和尺寸

**Props**:
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| text | String | - | 状态文字（必填） |
| type | String | 'default' | 状态类型（default/primary/success/warning/error/info） |
| size | String | 'normal' | 尺寸（small/normal/large） |

**使用示例**:
```vue
<template>
  <view>
    <!-- 不同类型 -->
    <StatusBadge text="待处理" type="default" />
    <StatusBadge text="进行中" type="primary" />
    <StatusBadge text="已完成" type="success" />
    <StatusBadge text="警告" type="warning" />
    <StatusBadge text="错误" type="error" />
    <StatusBadge text="信息" type="info" />

    <!-- 不同尺寸 -->
    <StatusBadge text="小" type="primary" size="small" />
    <StatusBadge text="中" type="primary" size="normal" />
    <StatusBadge text="大" type="primary" size="large" />
  </view>
</template>

<script>
import StatusBadge from '@/components/common/StatusBadge.vue'

export default {
  components: {
    StatusBadge
  }
}
</script>
```

---

## 🎨 样式说明

### 颜色规范

所有组件遵循统一的颜色规范：

| 类型 | 背景色 | 文字色 | 用途 |
|------|--------|--------|------|
| default | #f5f5f5 | #666 | 默认状态 |
| primary | #e6f7ff | #1890ff | 主要操作 |
| success | #f0f9ff | #52c41a | 成功状态 |
| warning | #fff7e6 | #faad14 | 警告状态 |
| error | #fff1f0 | #f5222d | 错误状态 |
| info | #f0f5ff | #722ed1 | 信息提示 |

### 尺寸规范

| 尺寸 | padding | font-size | 用途 |
|------|---------|-----------|------|
| small | 4-16rpx | 22rpx | 紧凑布局 |
| normal | 8-20rpx | 24rpx | 常规使用 |
| large | 12-28rpx | 28rpx | 突出显示 |

---

## 📝 最佳实践

### 1. 组件导入

推荐使用局部导入，避免全局注册：

```vue
<script>
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'

export default {
  components: {
    LoadingSpinner,
    EmptyState
  }
}
</script>
```

### 2. 加载状态处理

```vue
<template>
  <view>
    <!-- 加载中 -->
    <LoadingSpinner v-if="loading" fullscreen />

    <!-- 空状态 -->
    <EmptyState v-else-if="list.length === 0" />

    <!-- 正常内容 -->
    <view v-else>
      <!-- 列表内容 -->
    </view>
  </view>
</template>
```

### 3. 错误处理

```vue
<template>
  <ErrorBoundary @error="handleError" @retry="loadData">
    <YourComponent />
  </ErrorBoundary>
</template>
```

### 4. 确认操作

```vue
<template>
  <ConfirmDialog
    v-model:visible="dialogVisible"
    :title="dialogTitle"
    :message="dialogMessage"
    :type="dialogType"
    @confirm="handleConfirm"
  />
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      dialogMessage: '',
      dialogType: 'default'
    }
  },
  methods: {
    showConfirm(title, message, type = 'default') {
      this.dialogTitle = title
      this.dialogMessage = message
      this.dialogType = type
      this.dialogVisible = true
    }
  }
}
</script>
```

---

## ⚠️ 注意事项

1. **响应式单位**: 所有组件使用 `rpx` 作为响应式单位，会自动适配不同屏幕尺寸

2. **Props验证**: 所有组件都包含完整的 Props 类型验证，传入错误类型会在控制台警告

3. **事件命名**: 遵循 Vue 3 规范，使用 kebab-case 命名事件

4. **v-model支持**: ConfirmDialog 组件支持 v-model:visible 双向绑定

5. **样式隔离**: 所有组件样式使用 scoped，不会影响全局样式

---

## 🔧 维护说明

### 添加新组件

1. 在 `components/common/` 目录下创建新组件文件
2. 遵循现有组件的代码结构和命名规范
3. 添加完整的 Props 验证和事件说明
4. 更新本文档，添加组件使用说明

### 组件规范

- 单一职责：每个组件只负责一个功能
- 代码行数：控制在 200 行以内
- Props 验证：必须包含类型和默认值
- 事件命名：使用 kebab-case
- 样式作用域：使用 scoped

---

**文档版本**: v1.0.0
**最后更新**: 2025-11-29
**维护者**: 叨叨房车技术团队
