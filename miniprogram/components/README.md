# 组件使用文档

## 基础组件 (Base Components)

### 1. NoticeBanner - 公告轮播组件

**功能**: 垂直滚动显示公告通知

**使用示例**:
```vue
<NoticeBanner 
  :notices="noticeList" 
  :autoplay="true" 
  :interval="3000"
  @click="handleNoticeClick"
/>
```

**Props**:
- `notices`: Notice[] - 公告列表
- `autoplay`: boolean - 是否自动播放 (默认true)
- `interval`: number - 切换间隔ms (默认3000)

**Events**:
- `click`: (notice: Notice) => void - 点击公告时触发

---

### 2. LoadingSpinner - 加载状态组件

**功能**: 显示加载动画

**使用示例**:
```vue
<LoadingSpinner 
  :loading="isLoading" 
  text="加载中..." 
  size="medium"
/>
```

**Props**:
- `loading`: boolean - 是否显示加载
- `text`: string - 加载文字
- `size`: 'small' | 'medium' | 'large' - 尺寸

---

### 3. EmptyState - 空状态组件

**功能**: 显示空状态提示

**使用示例**:
```vue
<EmptyState 
  type="search"
  title="未找到相关内容"
  description="换个关键词试试"
  buttonText="返回首页"
  @buttonClick="goHome"
/>
```

**Props**:
- `type`: 'default' | 'search' | 'network' | 'error'
- `title`: string - 标题
- `description`: string - 描述
- `buttonText`: string - 按钮文字

---

### 4. ErrorBoundary - 错误边界组件

**功能**: 捕获子组件错误

**使用示例**:
```vue
<ErrorBoundary @error="handleError" @retry="handleRetry">
  <YourComponent />
</ErrorBoundary>
```

**Events**:
- `error`: (error: Error) => void
- `retry`: () => void

---

### 5. ConfirmDialog - 确认对话框

**功能**: 显示确认对话框

**使用示例**:
```vue
<ConfirmDialog 
  ref="dialogRef"
  type="warn"
  title="确认删除"
  content="删除后无法恢复"
  @confirm="handleConfirm"
/>

// 调用
dialogRef.value.open();
```

---

### 6. Toast - 轻提示组件

**功能**: 显示轻提示

**使用示例**:
```vue
<Toast 
  ref="toastRef"
  :message="toastMessage"
  type="success"
  :duration="2000"
/>

// 调用
toastRef.value.show();
```

---

**创建时间**: 2025-11-26
**维护者**: 小程序端开发团队
