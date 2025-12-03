# uView UI 组件迁移映射文档

## 迁移概述

本文档记录了从 uni-ui 到 uView UI 2.0 的组件迁移映射关系。

**迁移日期**: 2025-12-03
**uView 版本**: 2.0.38
**项目**: 叨叨房车小程序

---

## 一、组件映射表

### 1. 图标组件

| uni-ui | uView UI | 属性映射 | 备注 |
|--------|----------|---------|------|
| `<uni-icons>` | `<u-icon>` | `type` → `name` | uView 图标库更丰富 (1000+) |
| | | `size` → `size` | 单位保持一致 |
| | | `color` → `color` | 颜色属性一致 |

**迁移示例**:
```vue
<!-- 迁移前 -->
<uni-icons type="heart" size="20" color="#FF9F29"></uni-icons>

<!-- 迁移后 -->
<u-icon name="heart" size="20" color="#FF9F29"></u-icon>
```

**图标名称映射**:
- `star-filled` → `star-fill`
- `heart-filled` → `heart-fill`
- `location` → `map-pin`
- `arrowright` → `arrow-right`
- `arrowdown` → `arrow-down`
- `checkmarkempty` → `checkbox-mark`
- `closeempty` → `close`
- `chatbubble` → `chat`
- `person-filled` → `account-fill`
- `calendar-filled` → `calendar-fill`

---

### 2. 弹出层组件

| uni-ui | uView UI | 属性映射 | 备注 |
|--------|----------|---------|------|
| `<uni-popup>` | `<u-popup>` | `show` → `show` | 显示控制 |
| | | `mode` → `mode` | 弹出方向 |
| | | 无 | `closeable` 新增关闭按钮 |

**迁移示例**:
```vue
<!-- 迁移前 -->
<uni-popup ref="popup" type="bottom">
  <view>内容</view>
</uni-popup>

<!-- 迁移后 -->
<u-popup v-model="show" mode="bottom" :closeable="true">
  <view>内容</view>
</u-popup>
```

---

### 3. 表单组件

#### 3.1 表单容器

| uni-ui | uView UI | 属性映射 | 备注 |
|--------|----------|---------|------|
| `<uni-forms>` | `<u-form>` | `model` → `model` | 表单数据 |
| | | `rules` → `rules` | 验证规则 |
| `<uni-forms-item>` | `<u-form-item>` | `label` → `label` | 标签文本 |
| | | `name` → `prop` | 字段名 |

**迁移示例**:
```vue
<!-- 迁移前 -->
<uni-forms :model="form" :rules="rules">
  <uni-forms-item label="姓名" name="name">
    <input v-model="form.name" />
  </uni-forms-item>
</uni-forms>

<!-- 迁移后 -->
<u-form :model="form" :rules="rules">
  <u-form-item label="姓名" prop="name">
    <u-input v-model="form.name"></u-input>
  </u-form-item>
</u-form>
```

#### 3.2 输入框

| uni-ui | uView UI | 属性映射 | 备注 |
|--------|----------|---------|------|
| `<uni-easyinput>` | `<u-input>` | `value` → `v-model` | 双向绑定 |
| | | `placeholder` → `placeholder` | 占位符 |
| | | `type` → `type` | 输入类型 |

---

### 4. 列表组件

| uni-ui | uView UI | 属性映射 | 备注 |
|--------|----------|---------|------|
| `<uni-list>` | `<u-list>` | 基本一致 | 列表容器 |
| `<uni-list-item>` | `<u-list-item>` | `title` → `title` | 标题 |
| | | 无 | `icon` 新增图标 |

---

### 5. 其他组件

| uni-ui | uView UI | 属性映射 | 备注 |
|--------|----------|---------|------|
| `<uni-load-more>` | `<u-loadmore>` | `status` → `status` | 加载状态 |
| `<uni-datetime-picker>` | `<u-datetime-picker>` | `value` → `v-model` | 日期选择 |
| `<uni-file-picker>` | `<u-upload>` | 属性差异较大 | 文件上传 |
| `<uni-countdown>` | `<u-count-down>` | `time` → `time` | 倒计时 |

---

## 二、批量替换脚本

### 1. 组件标签替换

```bash
# uni-icons → u-icon
find . -name "*.vue" -type f -exec sed -i 's/<uni-icons/<u-icon/g'  \;
find . -name "*.vue" -type f -exec sed -i 's/<\/uni-icons>/<\/u-icon>/g' {} \;

# uni-popup → u-popup
find . -name "*.vue" -type f -exec sed -i 's/<uni-popup/<u-popup/g' {} \;
find . -name "*.vue" -type f -exec sed -i 's/<\/uni-popup>/<\/u-popup>/g' {} \;

# uni-forms → u-form
find . -name "*.vue" -type f -exec sed -i 's/<uni-forms/<u-form/g' {} \;
find . -name "*.vue" -type f -exec sed -i 's/<\/uni-forms>/<\/u-form>/g' {} \;

# uni-forms-item → u-form-item
find . -name "*.vue" -type f -exec sed -i 's/<uni-forms-item/<u-form-item/g' {} \;
find . -name "*.vue" -type f -exec sed -i 's/<\/uni-forms-item>/<\/u-form-item>/g' {} \;
```

---

## 三、需要手动调整的内容

### 1. 图标名称映射

由于 uni-icons 和 u-icon 的图标名称不完全一致，需要手动调整以下图标：

- ✅ `star-filled` → `star-fill`
- ✅ `heart-filled` → `heart-fill`
- ✅ `location` → `map-pin`
- ✅ `arrowright` → `arrow-right`
- ✅ `arrowdown` → `arrow-down`
- ✅ `checkmarkempty` → `checkbox-mark`
- ✅ `closeempty` → `close`

### 2. 弹出层显示控制

uni-popup 使用 ref 调用方法，uView 使用 v-model 控制：

```vue
<!-- 迁移前 -->
<uni-popup ref="popup">内容</uni-popup>
<script>
this.$refs.popup.open()
</script>

<!-- 迁移后 -->
<u-popup v-model="show">内容</u-popup>
<script>
this.show = true
</script>
```

### 3. 表单项属性名

uni-forms-item 的 `name` 属性需要改为 `prop`：

```vue
<!-- 迁移前 -->
<uni-forms-item name="username">

<!-- 迁移后 -->
<u-form-item prop="username">
```

---

## 四、迁移进度

### 已完成

- [x] 安装 uView UI 2.0.38
- [x] 配置 pages.json easycom
- [x] 配置 main.js 引入 uView
- [x] 配置 App.vue 全局样式
- [x] 配置 uni.scss 主题变量

### 进行中

- [ ] 替换 uni-icons → u-icon (239处)
- [ ] 替换 uni-popup → u-popup (10处)
- [ ] 替换 uni-forms → u-form (5处)
- [ ] 替换其他 uni-ui 组件
- [ ] 重构自定义组件适配 uView 样式

### 待完成

- [ ] 删除 uni_modules 目录下的 uni-ui 组件
- [ ] 全量测试所有页面功能

---

## 五、注意事项

### 1. 图标库差异

uView 的图标库与 uni-icons 不完全相同，部分图标名称需要手动映射。建议参考：
- uView 图标库：https://www.uviewui.com/components/icon.html
- uni-icons 图标库：https://uniapp.dcloud.net.cn/component/uniui/uni-icons.html

### 2. 组件属性差异

部分组件的属性名称和用法有差异，需要仔细对照文档进行调整。

### 3. 样式兼容性

uView 的默认样式可能与原有样式有冲突，需要在迁移后进行样式调整。

### 4. 性能优化

uView 组件库体积较大，建议：
- 使用 easycom 按需加载
- 删除未使用的 uni-ui 组件
- 优化图片资源

---

## 六、测试清单

### 功能测试

- [ ] 首页功能正常
- [ ] 社区模块正常
- [ ] 托管中心正常
- [ ] 营地预订正常
- [ ] 房车旅游正常
- [ ] 特惠租车正常
- [ ] 车辆管理正常
- [ ] 订单管理正常
- [ ] 个人中心正常
- [ ] 优惠券商城正常
- [ ] 会员中心正常
- [ ] 评价系统正常
- [ ] 帮助中心正常
- [ ] 认证模块正常

### 样式测试

- [ ] 图标显示正常
- [ ] 弹窗样式正常
- [ ] 表单样式正常
- [ ] 列表样式正常
- [ ] 按钮样式正常
- [ ] 颜色主题一致

### 兼容性测试

- [ ] 微信小程序
- [ ] H5
- [ ] App

---

## 七、回滚方案

如果迁移出现严重问题，可以通过以下步骤回滚：

1. 恢复 Git 版本：`git checkout .`
2. 卸载 uView：`npm uninstall uview-ui`
3. 恢复 pages.json、main.js、App.vue、uni.scss
4. 重新安装 uni-ui 组件

---

**文档维护**: Claude Code
**最后更新**: 2025-12-03
