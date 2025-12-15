# uView UI → uView Plus 组件升级指南

> 本文档用于指导 uni-app 项目从 uView UI 2.x 升级到 uView Plus 3.x
>
> **适用项目**: miniprogram（微信小程序）、mobile-admin（移动管理端）

---

## 一、升级概述

### 1.1 版本变化

- **旧版本**: uView UI 2.x (Vue 2)
- **新版本**: uView Plus 3.x (Vue 3)

### 1.2 核心变化

1. **Vue 3 Composition API**: 使用 `<script setup>` 语法
2. **组件 API 变化**: 部分组件属性和事件有破坏性变更
3. **类型支持**: 完整的 TypeScript 类型定义
4. **性能优化**: 更好的渲染性能和更小的包体积

---

## 二、安装配置

### 2.1 安装依赖

```bash
# 卸载旧版本
npm uninstall uview-ui

# 安装新版本
npm install uview-plus@3.6.18
```

### 2.2 配置 main.js

```javascript
// #ifdef VUE3
import { createSSRApp } from 'vue'
import uviewPlus from 'uview-plus'

export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  app.use(uviewPlus)  // 注册 uView Plus
  return {
    app
  }
}
// #endif
```

### 2.3 配置 App.vue

```vue
<style lang="scss">
  /* 第一行导入 uview-plus 样式 */
  @import "uview-plus/index.scss";

  /* 其他样式 */
</style>
```

### 2.4 配置 uni.scss

```scss
/* 导入 uview-plus 主题变量 */
@import 'uview-plus/theme.scss';
```

### 2.5 配置 pages.json

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^u--(.*)": "uview-plus/components/u-$1/u-$1.vue",
      "^up-(.*)": "uview-plus/components/u-$1/u-$1.vue",
      "^u-([^-].*)": "uview-plus/components/u-$1/u-$1.vue"
    }
  }
}
```

### 2.6 字体图标修复

**问题**: uView Plus 的字体文件路径可能导致图标显示为文本

**解决方案**: 创建自动修复脚本

```javascript
// scripts/fix-uview-font.js
const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../node_modules/uview-plus/libs/css/components.css');

if (fs.existsSync(cssPath)) {
  let content = fs.readFileSync(cssPath, 'utf8');

  // 修复字体路径
  content = content.replace(
    /url\("\.\.\/\.\.\/fonts\//g,
    'url("/static/'
  );

  fs.writeFileSync(cssPath, content, 'utf8');
  console.log('✅ uView Plus 字体路径修复完成');
} else {
  console.log('⚠️  未找到 uView Plus CSS 文件');
}
```

**配置 package.json**:

```json
{
  "scripts": {
    "postinstall": "node scripts/fix-uview-font.js",
    "fix-font": "node scripts/fix-uview-font.js"
  }
}
```

---

## 三、组件 API 变更

### 3.1 u-popup 组件（重要）

**破坏性变更**: 不再支持 `v-model`

#### ❌ 错误用法（uView UI 2.x）

```vue
<template>
  <u-popup v-model="show" mode="bottom">
    <view>弹窗内容</view>
  </u-popup>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  }
}
</script>
```

#### ✅ 正确用法（uView Plus 3.x）

```vue
<template>
  <u-popup :show="show" @close="close" mode="bottom">
    <view>弹窗内容</view>
  </u-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const show = ref(false);

const open = () => {
  show.value = true;
};

const close = () => {
  show.value = false;
};

defineExpose({ open, close });
</script>
```

#### 关键点

1. **使用 `:show` 代替 `v-model`**
2. **必须添加 `@close` 事件处理**
3. **通过 `defineExpose` 暴露 `open` 和 `close` 方法**

#### 完整示例：底部弹出选择器

```vue
<template>
  <u-popup
    :show="show"
    @close="close"
    mode="bottom"
    :closeable="false"
    :z-index="10075"
    :safe-area-inset-bottom="true"
  >
    <view class="picker-container">
      <view class="header">
        <text class="cancel" @tap="close">取消</text>
        <text class="title">选择项目</text>
        <text class="confirm" @tap="confirm">确定</text>
      </view>
      <view class="content">
        <!-- 内容区域 -->
      </view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['confirm']);
const show = ref(false);

const open = () => {
  show.value = true;
};

const close = () => {
  show.value = false;
};

const confirm = () => {
  emit('confirm', /* 数据 */);
  close();
};

defineExpose({ open, close });
</script>
```

### 3.2 u-icon 组件

**无破坏性变更**，但建议使用新的属性

```vue
<!-- 基本用法 -->
<u-icon name="arrow-right" size="20" color="#333"></u-icon>

<!-- 自定义图标 -->
<u-icon name="custom-icon" custom-prefix="custom-icon" size="24"></u-icon>
```

### 3.3 u-button 组件

**无破坏性变更**，API 保持兼容

```vue
<u-button type="primary" @click="handleClick">按钮</u-button>
<u-button type="success" plain>镂空按钮</u-button>
<u-button type="warning" :loading="loading">加载中</u-button>
```

### 3.4 u-input 组件

**建议使用新的事件名称**

```vue
<!-- Vue 3 推荐写法 -->
<u-input
  v-model="value"
  placeholder="请输入内容"
  @change="handleChange"
  @blur="handleBlur"
></u-input>
```

### 3.5 u-form 组件

**表单验证 API 保持兼容**

```vue
<template>
  <u-form :model="form" ref="formRef" :rules="rules">
    <u-form-item label="用户名" prop="username">
      <u-input v-model="form.username" placeholder="请输入用户名"></u-input>
    </u-form-item>
  </u-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const formRef = ref();
const form = reactive({
  username: ''
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ]
};

const validate = async () => {
  try {
    await formRef.value.validate();
    return true;
  } catch (error: unknown) {
    return false;
  }
};
</script>
```

---

## 四、常见问题修复

### 4.1 弹窗被页面导航栏遮挡

**问题**: 弹窗的 z-index 低于页面导航栏

**解决方案**:

```vue
<!-- 1. 提高弹窗 z-index -->
<u-popup :show="show" @close="close" :z-index="10075">
  <!-- 内容 -->
</u-popup>

<!-- 2. 降低导航栏 z-index -->
<style>
.custom-navbar {
  z-index: 99; /* 确保低于弹窗 */
}
</style>
```

**z-index 层级规范**:
- 页面导航栏: `99`
- 弹窗内部元素: `100`
- 弹窗容器: `10075`

### 4.2 图标显示为文本

**问题**: 图标显示为 "arrow-right"、"close" 等文本

**原因**: 字体文件路径错误

**解决方案**: 运行字体修复脚本

```bash
npm run fix-font
```

### 4.3 TypeScript 类型错误

**问题**: 组件 ref 类型错误

**解决方案**:

```typescript
// ❌ 错误
const popupRef = ref<any>();

// ✅ 正确
const popupRef = ref<{ open: () => void; close: () => void }>();

// 或使用 InstanceType
import type { ComponentPublicInstance } from 'vue';
const popupRef = ref<ComponentPublicInstance>();
```

---

## 五、升级检查清单

### 5.1 必须修改的项目

- [ ] **u-popup 组件**: 所有使用 `v-model` 的地方改为 `:show` + `@close`
- [ ] **main.js**: 注册 uView Plus
- [ ] **App.vue**: 导入 uView Plus 样式
- [ ] **uni.scss**: 导入主题变量
- [ ] **pages.json**: 配置 easycom
- [ ] **package.json**: 添加字体修复脚本

### 5.2 建议修改的项目

- [ ] 使用 `<script setup>` 语法
- [ ] 使用 TypeScript 类型定义
- [ ] 统一 z-index 层级
- [ ] 移除 `any` 类型，使用 `unknown`

### 5.3 测试项目

- [ ] 所有弹窗组件正常显示和关闭
- [ ] 图标正常显示（不是文本）
- [ ] 表单验证正常工作
- [ ] 按钮点击事件正常触发
- [ ] 在微信开发者工具中测试
- [ ] 在真机上测试

---

## 六、批量替换脚本

### 6.1 查找所有需要修改的文件

```bash
# 查找所有使用 v-model 的 u-popup
grep -r "v-model.*u-popup" --include="*.vue" .

# 或使用 ripgrep
rg "v-model.*show.*u-popup" -t vue
```

### 6.2 替换模式

**查找模式**:
```regex
<u-popup v-model="(\w+)"
```

**替换为**:
```
<u-popup :show="$1" @close="close$1"
```

**注意**: 需要手动添加 `close` 方法实现

---

## 七、移动管理端升级步骤

### 7.1 准备工作

1. **备份代码**: 创建新分支
   ```bash
   git checkout -b feature/upgrade-uview-plus
   ```

2. **安装依赖**
   ```bash
   cd mobile-admin
   npm uninstall uview-ui
   npm install uview-plus@3.6.18
   ```

3. **复制配置文件**
   - 从 `miniprogram` 复制 `scripts/fix-uview-font.js`
   - 更新 `package.json` 添加 postinstall 脚本

### 7.2 修改配置文件

按照 **第二章** 的步骤修改:
- main.js
- App.vue
- uni.scss
- pages.json

### 7.3 修改组件

1. **查找所有 u-popup 组件**
   ```bash
   grep -r "u-popup" --include="*.vue" mobile-admin/
   ```

2. **逐个修改**
   - 将 `v-model` 改为 `:show` + `@close`
   - 添加 `close` 方法
   - 添加 `defineExpose`

3. **测试每个修改**
   - 在微信开发者工具中测试
   - 确保弹窗正常显示和关闭

### 7.4 验证和测试

1. **运行项目**
   ```bash
   # 在 HBuilderX 中运行到微信开发者工具
   ```

2. **测试所有弹窗功能**
   - 城市选择
   - 日期选择
   - 确认对话框
   - 其他自定义弹窗

3. **检查图标显示**
   - 所有图标应正常显示
   - 如果显示为文本，运行 `npm run fix-font`

### 7.5 提交代码

```bash
git add .
git commit -m "feat(mobile-admin): 升级 uView UI 到 uView Plus 3.x [claude-code]"
git push -u origin feature/upgrade-uview-plus
```

---

## 八、参考资源

### 8.1 官方文档

- [uView Plus 官方文档](https://uview-plus.jiangruyi.com/)
- [uView Plus GitHub](https://github.com/ijry/uview-plus)
- [Vue 3 官方文档](https://cn.vuejs.org/)
- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)

### 8.2 项目文档

- [miniprogram/CLAUDE.md](../CLAUDE.md) - 小程序开发规范
- [mobile-admin/CLAUDE.md](../../mobile-admin/CLAUDE.md) - 移动管理端开发规范
- [CLAUDE.md](../../CLAUDE.md) - 项目总体规范

### 8.3 已完成的升级示例

参考 `miniprogram` 项目中已完成的组件:
- `components/business/RentDatePicker.vue` - 日期选择器
- `components/business/CityStorePicker.vue` - 城市门店选择器
- `components/base/ConfirmDialog.vue` - 确认对话框
- `pages/profile/wallet.vue` - 钱包页面（多个弹窗）

---

## 九、常见错误和解决方案

### 9.1 编译错误

**错误**: `Cannot find module 'uview-plus'`

**解决**:
```bash
rm -rf node_modules
npm install
```

### 9.2 运行时错误

**错误**: `app.use is not a function`

**解决**: 检查 main.js 是否正确使用 Vue 3 语法

```javascript
// ✅ 正确
import { createSSRApp } from 'vue'
const app = createSSRApp(App)
app.use(uviewPlus)

// ❌ 错误
import Vue from 'vue'
Vue.use(uviewPlus)
```

### 9.3 样式问题

**错误**: 组件样式丢失

**解决**: 确保 App.vue 第一行导入样式

```vue
<style lang="scss">
  /* 必须是第一行 */
  @import "uview-plus/index.scss";
</style>
```

---

## 十、总结

### 10.1 核心要点

1. **u-popup 组件**: 最重要的变更，必须修改
2. **字体图标**: 需要运行修复脚本
3. **配置文件**: 5 个文件需要修改
4. **测试验证**: 每个修改都要测试

### 10.2 升级收益

- ✅ Vue 3 性能提升
- ✅ 更好的 TypeScript 支持
- ✅ 更小的包体积
- ✅ 更活跃的社区支持

### 10.3 注意事项

- ⚠️ 必须使用 Vue 3
- ⚠️ 不兼容 Vue 2 项目
- ⚠️ 部分组件有破坏性变更
- ⚠️ 需要逐个测试所有功能

---

**文档版本**: v1.0
**最后更新**: 2025-12-03
**维护者**: Claude Code
**适用项目**: miniprogram, mobile-admin
